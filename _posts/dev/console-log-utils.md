---
date: 2026-01-02
title: bind를 활용한 console.log 유틸 만들기
excerpt: JavaScript bind를 사용해 스택 트레이스가 깨지지 않는 로그 유틸을 만드는 방법
category: 개발
tags:
  - Javascript
thumbnail: https://i.imgur.com/placeholder.png
slug: console-log-utils
updated: 2026-01-05T19:07
---
# 1. 문제 상황
프론트엔드 개발을 하다 보면 `console.log`를 자주 사용하게 됩니다. 
하지만 코드에서 `console.log` 호출 시 다음과 같은 불편한 점이 존재합니다.
## console.log의 문제점

- 린트 규칙에 걸립니다.
	- `no-console`같은 규칙 때문에 에러나 warning이 발생합니다.
	- 그렇다고 린트 규칙을 전부 비활성화하면, 프로덕션 코드에 로그가 그대로 포함되는 문제가 발생할 수 있습니다.
- 개발 모드에서만 로그가 활성화되도록 하고싶은데, 이 경우 로그를 호출하는 모든 위치에서 조건문을 작성해야 합니다.
```js
if (IS_LOCAL) {
  log.info('debug log');
}
```
## 처음에 고안했던 해결책과 한계

이 문제를 해결하기 위해 보통은 로그 전용 유틸을 만들어 사용합니다.
```js
// log.ts
const noop = () => {};

export const log = {
  error: (...args) => IS_LOCAL ? console.error(...args) : noop(),
  info: (...args) => IS_LOCAL ? console.log(...args) : noop(),
};
```

이렇게 하면 위에서 말한 모든 문제점이 해결된 것 처럼 보이지만, 치명적인 단점이 하나 있습니다.
바로 `log.error` 자체가 하나의 JavaScript 함수이기 때문에 호출 시 새로운 스택 프레임이 생성됩니다.

```
로그 호출 부분 → log.error → console.error
```

그 결과 DevTools에서 로그를 확인하면 호출 위치가 항상 `log.ts`로 고정됩니다.
디버깅을 위해 로그를 찍었는데, 정작 중요한 '호출 출처'를 바로 확인할 수 없다는 불편함이 생깁니다.
# 2. 해결책 (bind)

이 문제를 해결하는 방법은 `bind`를 사용해서 로그 유틸을 만드는 것입니다.

```js
// log. ts
const noop = () => {};

export const log = {
  error: IS_LOCAL ? console.error.bind(console, '%c[ERROR]', 'color: red; font-weight: bold') : noop,
  info: IS_LOCAL ? console.info.bind(console, '%c[INFO]', 'color: blue; font-weight: bold') : noop,
};
```

이렇게 하면 Devtools의 스택 트레이스에 `log.ts`가 포함되지 않아 `log.error()`를 호출한 실제 위치가 그대로 표시됩니다.

결론적으로 `bind`를 사용하면 로그 유틸을 유지하면서도 스택 트레이스가 깨지지 않게 할 수 있습니다.
이는 단순한 문법 트릭이 아니라 ECMAScript 스펙 수준에서 bind 동작이 다르기 때문인데요.

왜 bind와 화살표 함수는 스택 트레이스에서 서로 다른 결과를 만들까요?
이를 이해하려면 bind가 만들어내는 특이 함수 객체(exotic function object)에 대해 알아볼 필요가 있습니다.
# 3. 왜 bind는 다를까?
[MDN의 bind 공식 문서](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Function/bind#%EC%84%A4%EB%AA%85) 부분을 보면 다음과 같은 설명이 나와 있습니다.

>bind() 함수는 새로운 바인딩한 함수를 만듭니다. 바인딩한 함수는 원본 함수 객체를 감싸는 함수로, ECMAScript 2015에서 말하는 특이 함수 객체(exotic function object)입니다. 바인딩한 함수를 호출하면 일반적으로 래핑된 함수가 호출 됩니다.

여기서 말하는 **특이 함수 객체**란 무엇일까요?
이를 이해하기 위해 먼저 JavaScript 객체의 분류부터 살펴보겠습니다.
## 3-1. JavaScript의 객체 분류
JavaScript에는 크게 두 종류의 객체가 존재합니다.
### Ordinary Object (일반 객체)
```js
const obj = {
  a: 1,
  b: 2,
  c: 3,
};
```
- `{}` 또는 `new Object()`로 생성되는 우리가 흔히 아는 객체입니다.
- ECMAScript의 기본 내부 메서드(ordinary behavior) 를 그대로 따릅니다.
- 프로퍼티 추가 / 수정 / 삭제가 직관적으로 동작합니다.

### Exotic Object (특이 객체)
특이 객체는 일반 객체와 달리 별도의 내부 동작이 정의된 객체를 말합니다.
겉보기에는 객체처럼 보이지만(*typeof로 확인했을 때 object*) 프로퍼티 접근, 길이 변경, 호출 방식 등 일반 객체와 다른 규칙을 따릅니다.

대표적인 예시는 다음과 같습니다.
- Array
- Function
- arguments
- Bound Function (bind로 생성된 함수)
## 3-2. Array로 알아보는 Exotic Object
특이 객체의 개념을 이해하기 위해 가장 익숙하고 실제 동작 차이가 가장 잘 드러나는 Array를 예시로 살펴보겠습니다.

```js
const arr = [];

arr[null] = 10;
arr[2] = 20;

console.log(arr.length); // 3

arr.length = 20;
console.log(arr); // (20) [empty × 2, 20, empty × 17, null: 10]

Object.defineProperty(arr, 2, { configurable: false });

arr.length = 0;

console.log(arr); // (3) [empty × 2, 20, null: 10]
console.log(arr.length); // 3
```

위 코드의 동작은 얼핏 보면 직관적이지 않습니다. Array Exotic Object에 대해 별도로 정의된 ECMAScript 규칙을 보면서 위 동작을 자세히 살펴보겠습니다.

![ECMAScript 10.4.2.1](https://i.imgur.com/8Qw7iPt.png)
![ECMAScript 10.4.2.4](https://i.imgur.com/ipIpyZl.png)

> 코드 실행 흐름을 간결하게 전달하기 위해 설명을 간소화했습니다.
### 1. `arr[null] = 10`
- 프로퍼티 키는 내부적으로 문자열로 변환
- null → "null", "null"은 유효한 배열 인덱스가 아님
	- ECMAScript에서 배열 인덱스는 `0 ≤ index < 2³² - 1` 범위의 정수 문자열만 허용됨

=> 따라서 10.4.2.1의 2번 분기를 타지 않고, "null"은 일반 객체 프로퍼티로 취급된다.
### 2. arr\[2] = 20
- "2"는 유효한 배열 인덱스라서 10.4.2.1의 2번 분기를 탐
- 배열은 인덱스가 length 이상이면 length = index + 1로 자동 증가

=> 따라서 `arr.length === 3`이 된다.
### 3. arr.length = 20
Array는 `length`에 값을 할당하면 10.4.2.4의 12번 규칙에 따라서 다음과 같이 동작한다

- 길이가 늘어나면
- 실제 요소를 채우지 않고
- 빈 슬롯(hole) 을 생성한다

### 4. `Object.defineProperty(arr, 2, { configurable: false })`
- 인덱스 `2`의 요소를 삭제 불가능(non-configurable)*하게 변경
- 이 시점부터 해당 인덱스는 `delete` 대상이 될 수 없음

### 5. `arr.length = 0`

- Array에서 `length`를 줄이는 동작은 10.4.2.4의 13번 규칙에 따라서 length를 줄일 수 있는지 확인한다.
- 10.4.2.4의 18번 규칙에 따라서 뒤에서부터(index 큰 것부터) 삭제한다
	- 이 때 삭제 중 `configurable: false` 요소를 만나면 삭제를 중단하고 `length`를 삭제 실패한 인덱스 + 1로 되돌린다.

=> 따라서 length는 3이 된다.

## 3-3. Function Exotic Object
JavaScript에서 함수는 단순한 객체가 아니라 호출 규칙이 정의된 특이 객체(Function Exotic Object) 입니다.

함수 객체는 \[\[Call]]이라는 내부 메서드를 가지고 있으며,
우리가 함수를 호출할 때 실행되는 동작은
결국 이 \[\[Call]] 내부 메서드입니다.

일반 함수의 \[\[Call]]은 호출 시
새로운 실행 컨텍스트를 생성하고 이를 호출 스택에 쌓습니다.
DevTools에서 확인할 수 있는 스택 트레이스는
바로 이 실행 컨텍스트들의 누적 결과입니다.

## 3-4. Function / Bind Exotic Object
> bind의 call은 무엇인가?
앞에서 Array를 예시로 살펴본 이유는, **특이 객체(exotic object)가 일반 객체와 어떻게 다른 규칙을 갖는지** 구체적인 사례로 보여주기 위함이었습니다.

이제 같은 관점에서, 특이 객체 중에서도 ‘호출 가능한 객체’, **특이 함수 객체(exotic function object)를** 살펴보겠습니다.

`bind`는 이러한 특이 함수 객체를 생성하는 대표적인 예입니다. 이 특이 함수 객체가 어떤 내부적인 동작을 가지는지 ECMAScript 스펙을 통해 살펴보겠습니다.

![ECMAScript 20.2.3.2](https://i.imgur.com/NuKZm5B.png)
![ECMAScript 10.4.1.3|640x290](https://i.imgur.com/pJnHqjU.png)

```js
function add(a, b) {
  return a + b;
}

const add10 = add.bind(null, 10);
```

bind가 호출되면 ECMAScript 스펙 20.2.3.2의 3번 규칙에 따라서 BoundFunctionCreate가 실행되고, Bound Function Exotic Object가 생성됩니다.

이 특이 함수 객체는 스펙 10.4.1.3에 따라 내부적으로 다음 정보를 가집니다.
```
7. [[BoundTargetFunction]] = targetFunction
8. [[BoundThis]] = boundThis
9. [[BoundArguments]] = boundArgs
```

위 예제의 add10 함수 코드를 예시로 들어 보면 다음과 같습니다.
```
add10.[[BoundTargetFunction]] === add
add10.[[BoundThis]] === null
add10.[[BoundArguments]] === [10]
```

즉, bind는 새로운 함수 본문을 가진 함수를 만드는 것이 아니라, 호출 규칙 \[\[Call]]이 변경된 특이 함수 객체를 생성합니다.
이 객체는 호출 시 자체 실행 로직을 실행하지 않고 내부적으로 원본 함수로 호출을 위임합니다.

# 4. 다시 log.ts로 돌아와서
그럼 위 내용을 바탕으로 왜 bind를 사용하면 스택 트레이스 문제가 해결되는지 정리해 보겠습니다.

- bind는 일반적인 JavaScript 래퍼 함수를 만들지 않습니다. 대신 Bound Function Exotic Object를 생성합니다.
- 이 객체는 호출 시 새로운 JavaScript 코드 레벨의 새로운 실행 컨텍스트를 만들지 않고 내부 \[\[Call]] 추상 연산을 통해 곧바로 대상 함수(console.error 등)로 호출을 위임합니다.

그 결과 DevTools의 스택 트레이스에는 log.ts와 같은 유틸 레이어가 끼어들지 않습니다.

반대로 `error: () => console.error(...)` 처럼 화살표 함수나 일반 함수로 감싸면, 해당 함수 자체가 JS 실행 컨텍스트를 생성하므로 `log.ts`가 스택 트레이스에 남게 됩니다.

브라우저의 스택 트레이스는 **JavaScript 실행 컨텍스트(함수 호출 프레임)** 단위로 구성되며, ECMAScript 스펙의 추상 연산(\[\[Call]] 등) 자체는 JS 실행 프레임이 아니기 때문에 추적 대상이 아닙니다.

# 5. 결론
만약 bind의 내부 동작을 알지 못했다면 스택 트레이스를 추적해서 두번째 스택 트레이스로 경로를 따로 띄우는 등의 해결책을 사용했을 것 같은데, ECMAScript 스펙을 기준으로 동작을 이해하고 나니 불필요한 복잡함 없이 가장 깔끔한 해결책을 선택할 수 있었습니다.
이렇게 간단해 보이는 유틸이라도 내부 동작을 정확히 이해하면 더 나은 설계를 할 수 있다는 점을 다시 한 번 느끼게 되었습니다.

# 참고 문서
- [https://blog.bitsrc.io/exotic-objects-understanding-why-javascript-behaves-so-moody-5f55e867354f](https://blog.bitsrc.io/exotic-objects-understanding-why-javascript-behaves-so-moody-5f55e867354f)
- https://tc39.es/ecma262/