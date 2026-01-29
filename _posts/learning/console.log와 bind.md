---
date: 2026-01-21
title: console.log 유틸을 만들다가 bind 함수의 동작 방식 파헤쳐보기
excerpt: console.log를 유틸함수로 분리해서 사용했더니 DevTools의 콘솔 스택 트레이스가 항상 유틸 파일을 가리키는 문제를 겪었습니다. 이를 해결하기 위해 bind를 사용했고, 그 과정에서 일반 함수 호출과 bind 함수 호출이 ECMAScript 스펙 상에서 어떻게 다른 동작을 하는지 파헤쳐본 경험을 작성한 글입니다.
category: 개발
tags:
  - Javascript
thumbnail: https://i.imgur.com/3SnPacH.png
slug: console-log-bind
updated: 2026-01-29T23:09
---
프론트엔드 개발을 하다 보면 `console.log`를 사용해야 하는 경우가 종종 있는데요. 저는 `console.log`를 사용할 때 마다 약간의 불편한 점이 있어서 `console.log`용 유틸을 따로 분리해서 사용하고 있습니다. 하지만 그 방식에도 불편한 점이 있었는데 `bind`를 활용해서 로그 유틸을 개선하니 문제점이 해결되었습니다. 이번 글은 이런 제 경험을 공유하기 위해 작성했습니다.
## console.log를 사용할 때 불편한 점
프로젝트에 `no-console`같은 린트 규칙이 선언되어 있는 경우 console.log를 코드베이스에 추가하면 `no-console`같은 규칙 때문에 에러나 warning이 발생합니다.
그렇다고 린트 규칙을 전부 비활성화하면, 프로덕션 코드에 로그가 그대로 포함된 채로 올라가는 실수가 발생할 수 있습니다. 물론 이 문제는 다음과 같이 개발 모두에서만 로그가 활성화되도록 분기처리를 해서 해결할 수 있지만, 로그를 호출하는 모든 위치에서 조건문을 작성해야 해서 가독성이 저하된다는 문제가 있습니다.
```js
if (IS_LOCAL) {
  log.info('debug log');
}
```
## 처음에 고안했던 해결책과 한계

저는 이러한 문제를 해결하기 위해 보통은 로그 전용 유틸을 따로 만들어서 사용합니다.
```js
// log.ts
const noop = () => {};

export const log = {
  error: (...args) => IS_LOCAL ? console.error(...args) : noop(),
  info: (...args) => IS_LOCAL ? console.log(...args) : noop(),
};
```

이렇게 하면 린트 규칙 무시, 개발모드 분기도 유틸에서만 처리하면 되기 때문에 위에서 말한 문제점이 모두 해결된 것 처럼 보이지만, 치명적인 단점이 하나 있습니다.
바로 log 유틸 객체에서 호출하는 함수가 하나의 JavaScript 함수이기 때문에 호출 시 새로운 스택 프레임이 생성되는 것입니다.

```
로그 호출 부분 → log.error → console.error
```

그 결과 DevTools에서 로그를 확인하면 호출 위치가 항상 `log.ts`로 고정됩니다.
디버깅을 위해 로그를 찍었는데, 정작 중요한 '호출 출처'를 바로 확인할 수 없다는 불편함이 생깁니다.
# 해결책 (bind)

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

결론적으로 `bind`를 사용하면 로그 유틸을 유지하면서도 스택 트레이스에 log.ts 파일이 추가되지 않기 때문에 실제 로그를 호출한 위치를 Devtools에서 확인할 수 있습니다.
그렇다면 왜 `bind`를 사용하면 스택 트레이스에 `log.ts`파일이 포함되지 않는걸까요? 이는 단순한 문법 트릭이 아니라 ECMAScript 스펙 수준에서 bind 동작이 다르기 때문입니다.

왜 bind와 화살표 함수는 스택 트레이스에서 서로 다른 결과를 만들까요?
이를 이해하려면 bind가 만들어내는 특이 함수 객체(exotic function object)에 대해 알아볼 필요가 있습니다.
# 왜 bind는 다를까?
[MDN의 bind 공식 문서](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Function/bind#%EC%84%A4%EB%AA%85) 부분을 보면 다음과 같은 설명이 나와 있습니다.

>bind() 함수는 새로운 바인딩한 함수를 만듭니다. 바인딩한 함수는 원본 함수 객체를 감싸는 함수로, ECMAScript 2015에서 말하는 특이 함수 객체(exotic function object)입니다. 바인딩한 함수를 호출하면 일반적으로 래핑된 함수가 호출 됩니다.

여기서 말하는 **특이 함수 객체**란 무엇일까요? 이를 이해하기 위해 먼저 JavaScript의 객체가 어떻게 분류되는지 알아보겠습니다.
## JavaScript의 객체 분류
JavaScript의 객체는 다음과 같은 구조로 분류됩니다.
![](https://i.imgur.com/3SnPacH.png)
Javascript의 대부분의 내장 객체들은 기본 Object를 위임받아 구현되어있습니다. prototype을 쭉 따라가보면 종착지가 Object가 되는 경우가 많은데요. 이런 객체들도 분류가 있습니다. 우리가 흔히 말하는 객체와, 그 객체를 위임받아 구현되었지만 특이 동작이 추가된 특이 객체들, 그리고 그 특이 객체중에서도 함수객체와, 함수중에서도 특이 동작이 있는 특이 함수 객체가 있는데요. 그럼 이 분류들을 차근차근 살펴보겠습니다.

### Ordinary Object (일반 객체)
```js
const obj = {
  a: 1,
  b: 2,
  c: 3,
};
```
 먼저 일반 객체는 `{}` 또는 `new Object()`로 생성되는 우리가 흔히 아는 객체입니다. ECMAScript의 기본 내부 메서드(ordinary behavior) 를 그대로 따르고, 프로퍼티 추가 / 수정 / 삭제가 직관적으로 동작합니다.
 콘솔창에서 출력했을 때 prototype 체인 바로 위쪽에 Object가 바로 존재하는 경우가 일반 객체라고 보면 되겠습니다.

### Exotic Object (특이 객체)
그렇다면 특이 객체는 일반 객체랑 무엇이 다르게 "특이"일까요? 사실 그렇게 특별한 것은 아니고 일반 객체가 아닌 모든 것이라고 보면 됩니다. 내부적으로 일반적인 객체보다 추가적인 동작이 있는 것이죠.
겉보기에는 객체처럼 보이지만 (겉보기에 객체처럼 보인다는 것은 typeof로 확인했을 때 'object'로 출력되는 것을 말합니다)프로퍼티 접근, 길이 변경, 호출 방식 등 일반 객체와 다른 규칙을 따릅니다.
대표적인 예시는 Array, arguments, Function, Bound Function (bind로 생성된 함수) 등이 있습니다. 아까 위에서 봤던 다이어그램 중에서 함수 객체, 특이 함수 객체는 따로 다룰 테니 우선 특이 객체에 속하는 Array에 대해서 먼저 알아보겠습니다. 
## Array로 알아보는 Exotic Object
Array는 너무 일상적으로 사용하다 보니 딱히 “특이하다”고 느껴지지 않습니다. 하지만 ECMAScript 스펙 관점에서 보면, Array는 매우 특이한 객체입니다.

그럼 Array는 왜 일반 객체가 아니라 특이 객체인지, 아래 코드를 통해 살펴보겠습니다.
```js
const arr = [];

arr[2] = 20;

console.log(arr.length); // 3

arr.length = 20;
console.log(arr); // (20) [empty × 2, 20, empty × 17]
```

`arr.length`를 20으로 설정했을 뿐인데, 배열 안에 있는 요소의 수가 늘어납니다. 왜 그럴까요?
바로 배열의 length는 단순한 숫자 프로퍼티가 아니기 때문입니다. 만약 Array가 '특이'하지 않았다면 단순히 아래와 같은 결과가 되었을 것입니다.

```js
{
  2: 20,
  length: 20
}
```
> 즉, 인덱스와 length 사이에 아무런 연관도 없는 **일반 객체**처럼 동작했을 것입니다.

하지만 '특이'하기 때문에 인덱스에 값을 할당하면 자동으로 증가하고, length를 늘려도 실제 요소가 채워지지 않은 채 empty로 길이만 늘어나는 동작이 발생합니다.

이는 Array가 일반 객체가 아닌 **배열 전용 스펙**을 따르기 때문에 가능한 동작입니다. ECMAScript에 정의된 `[[DefineOwnProperty]]`와 `ArraySetLength` 규칙을 기준으로, 위 코드가 왜 이런 결과를 내는지 간단히 살펴보겠습니다.
#### 1. `arr[2] = 20`
- "2"는 유효한 배열 인덱스라서 [10.4.2.1의 2번](https://tc39.es/ecma262/#sec-array-exotic-objects-defineownproperty-p-desc) 스펙을 따르게 됩니다.
- 이 스펙에 따라 배열은 인덱스가 length 이상이면 length = index + 1로 자동 증가합니다.
- 따라서 `arr.length === 3`이 됩니다.
#### 2. arr.length = 20
Array는 `length`에 값을 할당하면 [10.4.2.4의 12번 스펙](https://tc39.es/ecma262/#sec-arraysetlength)에 따라서 다음과 같이 동작합니다.
- 길이가 늘어나면
- 실제 요소를 채우지 않고
- 빈 슬롯(hole) 을 생성한다

이처럼 Array는 겉보기엔 평범하지만 내부적으로는 별도의 규칙을 따르는 Exotic Object입니다.
**이제 이 개념을 함수에 그대로 적용해보면**, 우리가 흔히 쓰는 함수 호출과 bind가 왜 다른 결과를 만드는지 이해할 수 있습니다.
## Function Exotic Object
아까 위 다이어그램에서 보았듯이 특이 객체 안에는 Function 즉 함수 객체도 존재합니다. 왜냐하면 JavaScript의 함수도 내부적으로는 객체이기 때문이죠. 하지만 여기에 `[[Call]]` 규칙이 추가된 객체입니다. 따라서 추가적인 동작이 정의되어있기 때문에 "특이"객체인 것입니다. 
함수 객체는 모든 동작을 세세히 살펴보기 보다는 `[[Call]]`의 스펙을 위주로 보며 bind와 어떤 차이가 있는지를 중심으로 살펴볼건데요.

그럼 Function의 `[[Call]]`명세를 한번 살펴볼까요? 

> [!quote]- 10.2.1 `[[Call]]` ( thisArgument, argumentsList )
> 
> The `[[Call]]` internal method of an ECMAScript [function object](https://tc39.es/ecma262/#function-object) F takes arguments thisArgument (an [ECMAScript language value](https://tc39.es/ecma262/#sec-ecmascript-language-types)) and argumentsList (a [List](https://tc39.es/ecma262/#sec-list-and-record-specification-type) of [ECMAScript language values](https://tc39.es/ecma262/#sec-ecmascript-language-types)) and returns either a [normal completion containing](https://tc39.es/ecma262/#sec-completion-record-specification-type) an [ECMAScript language value](https://tc39.es/ecma262/#sec-ecmascript-language-types) or a [throw completion](https://tc39.es/ecma262/#sec-completion-record-specification-type). It performs the following steps when called:
> 
> 1.  Let callerContext be the [running execution context](https://tc39.es/ecma262/#running-execution-context).
> 2. Let calleeContext be [PrepareForOrdinaryCall](https://tc39.es/ecma262/#sec-prepareforordinarycall)(F, undefined).
> 3. [Assert](https://tc39.es/ecma262/#assert): calleeContext is now the [running execution context](https://tc39.es/ecma262/#running-execution-context).
> 4. If F.`[[IsClassConstructor]]` is true, then
> 	a.  Let error be a newly created TypeError object.
>     b. NOTE: error is created in calleeContext with F's associated [Realm Record](https://tc39.es/ecma262/#realm-record).
>     c. Remove calleeContext from the [execution context stack](https://tc39.es/ecma262/#execution-context-stack) and restore callerContext as the [running execution context](https://tc39.es/ecma262/#running-execution-context).
>     d. Return [ThrowCompletion](https://tc39.es/ecma262/#sec-throwcompletion)(error).
> 5. Perform [OrdinaryCallBindThis](https://tc39.es/ecma262/#sec-ordinarycallbindthis)(F, calleeContext, thisArgument).
> 6. Let result be [Completion](https://tc39.es/ecma262/#sec-completion-ao)([OrdinaryCallEvaluateBody](https://tc39.es/ecma262/#sec-ordinarycallevaluatebody)(F, argumentsList)).
> 7. Remove calleeContext from the [execution context stack](https://tc39.es/ecma262/#execution-context-stack) and restore callerContext as the [running execution context](https://tc39.es/ecma262/#running-execution-context).
> 8. If result is a [return completion](https://tc39.es/ecma262/#sec-completion-record-specification-type), return result.`[[Value]]`.
> 9. [Assert](https://tc39.es/ecma262/#assert): result is a [throw completion](https://tc39.es/ecma262/#sec-completion-record-specification-type).
> 10. Return ? result.
> 
> > [!note]+ Note
> > When calleeContext is removed from the [execution context stack](https://tc39.es/ecma262/#execution-context-stack) in step [7](https://tc39.es/ecma262/#step-call-pop-context-stack) it must not be destroyed if it is suspended and retained for later resumption by an accessible Generator.

10.2.1-2번 명세를 보면 `PrepareForOrdinaryCall` 내부 로직이 새로운 실행 컨텍스트를 생성하고, 이를 콜스택의 맨 위에 Push하는 역할을 합니다. 그리고 10.2.1-3번에서 방금 생성된 `calleeContext`가 현 실행 중인 컨텍스트가 되었음을 확인합니다. 
결론적으로 정리하자면, 일반 함수의 Call은 실행 컨텍스트의 생성을 동반한다는 것입니다.
## Bind Exotic Object
이제 특이 함수 객체인 `bind`를 살펴볼 차례입니다.  
지금까지 Object, Array, Function을 순서대로 살펴본 이유도 결국 이 `bind`의 동작을 이해하기 위함이었습니다.

그렇다면 `bind`는 일반 함수 호출과 무엇이 다를까요?  
`console.log` 유틸에서 핵심이 되는 지점은 `bind`의 `[[Call]]` 동작이기 때문에, 여기서도 Function과 마찬가지로 `[[Call]]` 동작에 초점을 맞춰 살펴보겠습니다.

> [!quote]+ 10.4.1.1 `[[Call]]` ( thisArgument, argumentsList )
> 
> The `[[Call]]` internal method of a [bound function exotic object](https://tc39.es/ecma262/#bound-function-exotic-object) F takes arguments thisArgument (an [ECMAScript language value](https://tc39.es/ecma262/#sec-ecmascript-language-types)) and argumentsList (a [List](https://tc39.es/ecma262/#sec-list-and-record-specification-type) of [ECMAScript language values](https://tc39.es/ecma262/#sec-ecmascript-language-types)) and returns either a [normal completion containing](https://tc39.es/ecma262/#sec-completion-record-specification-type) an [ECMAScript language value](https://tc39.es/ecma262/#sec-ecmascript-language-types) or a [throw completion](https://tc39.es/ecma262/#sec-completion-record-specification-type). It performs the following steps when called:
> 
> 1. Let target be F.`[[BoundTargetFunction]]`.
> 2. Let boundThis be F.`[[BoundThis]]`.
> 3. Let boundArgs be F.`[[BoundArguments]]`.
> 4. Let args be the [list-concatenation](https://tc39.es/ecma262/#list-concatenation) of boundArgs and argumentsList.
> 5. Return ? [Call](https://tc39.es/ecma262/#sec-call)(target, boundThis, args).

bind의 `[[Call]]`은 10.2.1의 함수 `[[Call]]`과는 다른 동작을 보입니다. 실행 컨텍스트를 생성하는 부분은 없고, 기존에 저장해둔 정보를 꺼내어 재조합하는 과정입니다. 예를 들어 아래와 같은 코드가 있다고 해보겠습니다.

```js
function add(a, b) {
  return a + b;
}

const add10 = add.bind(null, 10);
```

bind가 호출되면 ECMAScript 스펙 20.2.3.2의 3번 규칙에 따라서 BoundFunctionCreate가 실행되고, Bound Function Exotic Object가 생성되면서 아래와 같은 정보들이 저장됩니다.

```
add10.`[[BoundTargetFunction]]` === add
add10.`[[BoundThis]]` === null
add10.`[[BoundArguments]]` === [10]
```

그래서 Call이 실행되면 이 저장된 정보들을 활용해서 함수를 구성하고 Call을 반환해서 제어권을 넘깁니다.
## function vs bind
그럼 스펙상으로 살펴봤던 functiond이랑 bind의 실제 동작 차이를 직접 볼까요? 
아래 코드를 브라우저 콘솔에서 실행하고, debugger가 멈춘 시점에 callstack에 어떤 변화가 발생하는지 직접 살펴보겠습니다.

```js
const person = {
  name: 'Gemini',
  greet: function(message) {
    debugger; 
    console.log(`${message}, ${this.name}!`);
  }
};

// 1. 일반 함수 호출 (10.2.1 `[[Call]]`)
console.log('%c--- 일반 호출 시작 ---', 'color: blue; font-weight: bold');
person.greet('Hello');

// 2. 바인드 함수 생성 및 호출 (10.4.1.1 `[[Call]]`)
const boundGreet = person.greet.bind(person, 'Hi');
debugger

console.log('%c--- 바인드 호출 시작 ---', 'color: green; font-weight: bold');
boundGreet();
```

먼저 1번 일반 함수를 호출한 시점에 greet 내부에서 debugger를 통해 멈춰보면, callstack에 greet 함수가 존재하는 것을 볼 수 있습니다.
그리고 2번 boundGreet 다음줄에서 debugger를 실행해보면 bind연산은 단순히 boundGreet에 bind target같은 정보를 저장한 것이기 때문에 별도의 콜스택에 추가되는 값이 없고, greet 함수 안에서 찍힌 debugger를 보면 callstack에 greet만 존재하고, 별도의 boundGreet는 없는 것을 볼 수 있습니다. 왜냐하면 bind의 call은 자기 자신에 대한 실행 컨텍스트를 생성하지 않고, target function의 Call로 위임하기 때문이죠. 따라서 target function을 기준으로 실행 컨텍스트가 생성됩니다.
이처럼 bind는 실제로 콜스택에 영향을 주지 않는 것을 확인했습니다.
# 다시 log.ts로 돌아와서
그럼 위 내용을 바탕으로 왜 bind를 사용하면 스택 트레이스 문제가 해결되는지 정리해 보겠습니다.

- bind는 일반적인 JavaScript 래퍼 함수를 만들지 않습니다. 대신 Bound Function Exotic Object를 생성합니다.
- 이 객체는 호출 시 새로운 JavaScript 코드 레벨의 새로운 실행 컨텍스트를 만들지 않고 내부 `[[Call]]` 추상 연산을 통해 곧바로 대상 함수(console.error 등)로 호출을 위임합니다.

그 결과 DevTools의 스택 트레이스에는 log.ts와 같은 유틸 레이어가 끼어들지 않습니다.

반대로 `error: () => console.error(...)` 처럼 화살표 함수나 일반 함수로 감싸면, 해당 함수 자체가 JS 실행 컨텍스트를 생성하므로 `log.ts`가 스택 트레이스에 남게 됩니다.

브라우저의 스택 트레이스는 **JavaScript 실행 컨텍스트(함수 호출 프레임)** 단위로 구성되며, ECMAScript 스펙의 추상 연산(`[[Call]]` 등) 자체는 JS 실행 프레임이 아니기 때문에 추적 대상이 아닙니다.

# 마무리
만약 bind의 내부 동작을 알지 못했다면 스택 트레이스를 추적해서 두번째 스택 트레이스로 경로를 따로 띄우는 등의 해결책을 사용했을 것 같은데, ECMAScript 스펙을 기준으로 동작을 이해하고 나니 불필요한 복잡함 없이 가장 깔끔한 해결책을 선택할 수 있었습니다.
이렇게 간단해 보이는 유틸이라도 내부 동작을 정확히 이해하면 더 나은 설계를 할 수 있다는 점을 다시 한 번 느끼게 되었습니다.

# 참고 문서
- [https://blog.bitsrc.io/exotic-objects-understanding-why-javascript-behaves-so-moody-5f55e867354f](https://blog.bitsrc.io/exotic-objects-understanding-why-javascript-behaves-so-moody-5f55e867354f)
- https://tc39.es/ecma262/