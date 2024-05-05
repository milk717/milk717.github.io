---
date: 2023-07-29
title: Javascript에서 정규표현식 100% 활용하기
excerpt: 
category: 학습
tags:
  - Javascript
  - 정규표현식
thumbnail: https://i.imgur.com/npl1lee.png
slug: js-regexp
updated: 2024-05-05T16:58
---
# 정규표현식 Tips

Javascript에서는 `split`이나 `replace`같은 문자열 함수에 정규표현식을 사용할 수 있습니다.  
이번 게시글에서는 제가 자바스크립트에서 정규표현식을 사용하면서 알게된 유용한 팁에 대해 정리해보았습니다.  
이 글은 정규표현식의 기본 개념을 이미 이해하고 있는 독자를 대상으로 작성되었습니다.  
만약 정규표현식에 대한 이해가 부족하다면, 인파님의 블로그 글을 추천드립니다.  
이 블로그에서 정규표현식에 관한 내용이 깊이 있고 체계적으로 정리되어 있어, 정규표현식을 작성할 때마다 저도 항상 참고하고 있습니다.
[https://inpa.tistory.com/entry/JS-📚-정규식-RegExp-누구나-이해하기-쉽게-정리 ](https://inpa.tistory.com/entry/JS-📚-정규식-RegExp-누구나-이해하기-쉽게-정리)

## [Tips 1] split 구분자로 사용

자바스크립트에서는 `split` 구분자에 정규표현식을 사용할 수 있습니다.
`split()` 메서드는 지정한 구분자를 기준으로 문자열을 나눕니다.

```jsx
const str = 'apple, banana, orange';
const splitArr = str.split(', ');
console.log(splitArr);
// [ 'apple', 'banana', 'orange' ]
```

위와 같이 구분자가 명확할 경우는 문자열만 사용해도 충분합니다. 하지만 나눠야 하는 문자열이 `‘apple9banana8orange'` 라면 어떻게 해야할까요?

### split 구분자에 정규표현식 사용하기

이럴 때 바로 정규표현식을 구분자로 사용해야 합니다.

```jsx
const str = 'apple9banana8orange';
const splitArr = str.split(/\d/);
console.log(splitArr);
// [ 'apple', 'banana', 'orange' ]
```

split의 구분자로 사용한 `\d`는 숫자를 매칭하라는 뜻으로 [0-9]와 동일한 매칭 패턴입니다. 구분자로 정규표현식을 사용하면 복잡한 문자열도 분리할 수 있습니다.

### 구분자도 split 결과에 포함하기

그런데 만약 구분자도 split된 배열에 포함하고 싶다면 어떻게 해야할까요? 이럴 땐 정규표현식 그룹화와 캡쳐 기능을 사용할 수 있습니다.

<aside>
💡 그룹화와 *캡쳐 기능에 대한 자세한 설명은 [아래](https://www.notion.so/04c37723eb68486a95fccce83f34507c?pvs=21)에서 할 예정이므로 지금은 간단하게 넘어가겠습니다.*

</aside>

정규표현식은 괄호 안에 있는 매칭 패턴을 캡쳐(capturing)합니다. 이는 괄호로 그룹화된 부분에 매치된 문자열을 추출하는 것입니다.

```jsx
const str = 'apple9banana8orange';
const splitArr = str.split(/(\d)/);
console.log(splitArr);
// [ 'apple', '9', 'banana', '8', 'orange' ]
```

위와 같이 매칭 패턴을 괄호 기호를 사용해 그룹화한다면 이것이 캡쳐링되고, split된 배열에 포함됩니다.

## [Tips 2] replace 매칭 패턴에 사용하기

`replace`의 매칭 패턴으로도 정규표현식을 사용할 수 있습니다. `replace()` 메서드는 매칭 패턴에 일치하는 일부 또는 모든 부분이 교체된 새로운 문자열을 반환합니다. 매칭 패턴은 split처럼 일반 문자열 혹은 정규표현식이 사용될 수 있습니다.

<aside>
💡 replace 매칭 패턴에 일반 문자열을 사용할 때는 replaceAll을 사용해야 합니다. 
그렇지 않으면 매칭되는 첫 번째 단어만 교체됩니다.

</aside>

```jsx
const str = 'apple, banana, orange';
const replaceStr = str.replaceAll(', ', ' ');
console.log(replaceStr);
// apple banana orange
```

위와 같이 매칭해야 하는 패턴이 일정한 경우 replaceAll에 문자열을 넣어서 변환할 수 있습니다. 하지만 우리가 다루는 문자열은 단순한 것 보다 복잡한게 더 많죠😥
이럴 땐 정규표현식을 매칭 패턴으로 사용하면 정말 유용합니다.

### replace 매칭 패턴으로 정규표현식 사용하기

`‘apple1283902banana1238923orange’`와 같이 문자열로 매칭 패턴을 지정할 수 없는 경우 정규표현식을 사용해서 아래와 같이 간편하게 문자열을 교체할 수 있습니다.

```jsx
const str = 'apple1283902banana1238923orange';
const replaceStr = str.replace(/\d/g, ' ');
console.log(replaceStr);
// apple       banana       orange
```

여기서 잠깐!! 정규표현식 뒤에 있는 `g`라는 문자열은 무엇일까요?
이것은 정규식 플래그라는 것으로 `g`는 문자열 내의 모든 패턴을 검색한다는 의미를 가집니다. 만약 `g`플래그를 사용하지 않는다면 매칭된 맨 앞 문자열만 교체하게 됩니다.

### 교체할 문자열 함수로 넘겨주기

그런데 위의 `replaceStr` 약간 불편하지 않나요…?
`apple banana orange` 처럼 하나의 공백만 있으면 좋을텐데 교체되기 전 숫자의 길이만큼 공백이 생겼습니다. 이런 경우 어떻게 해야할까요?

```jsx
const str = 'apple1283902banana1238923orange';
const replacer = (match, offset, string) => {
    if(string[offset + 1].match(/\d/)){
        return '';
    }else{
        return ' ';
    }
}
const replaceStr = str.replace(/\d/g, replacer);
console.log(replaceStr);
// apple banana orange
```

위의 코드에서 보는 것 처럼 교체될 문자열을 함수 형태로 넘겨줄 수 있습니다.
replace는 교체될 문자열이 함수 형태로 넘겨졌을 때 다음과 같은 매개변수들을 가집니다.

(아래 표는 mdn replace 문서를 참고했습니다.)

| 가능한 이름 | 제공되는 값 |
| --- | --- |
| match | 매치된 문자열. |
| p1, p2, ... | 이 부분은 아래쪽에서 자세하게 설명하겠습니다. |
| offset | 매칭된 문자열의 인덱스 |
| string | 조사된 전체 문자열 (replace를 호출한 string) |

따라서 replacer에서 match, offset, string을 매개변수로 받아, 현재 매칭된 문자열의 다음 문자가 숫자라면 공백 없는 문자열 ‘’을 반환하고, 숫자가 아니라면 공백을 반환하도록 구현해서, 연속되는 공백을 하나로 줄였습니다.

```jsx
const replaceStr = str.replace(/\d/g, (match,offset, string)=>string[offset + 1].match(/\d/) ? '':' ');
```

위와 같이 단순한 표현도 가능합니다.

## [Tips 3] replace에서 캡쳐된 문자열 가져오기

위에서 `p1, p2, ...` 부분에 대한 언급을 했었습니다. 이것은 바로 그룹화한 문자열을 차례대로 가져오는 것입니다. 그룹화를 알지 못하시는 분들은 일단은 `그룹화 === 괄호로 묶은 것`이라고 생각해주세요!!

```jsx
const str = 'apple1283902banana1238923orange';
const replacer = (match, p1, p2) => {
    return ' '+p2;
}
const replaceStr = str.replace(/(\d)+([a-zA-z])/g, replacer);
console.log(replaceStr);
```

갑자기 엄청 긴 정규표현식이 등장해서 당황스러울 수도 있지만 설명을 듣고 나면 그다지 복잡한 것이 아니란 것을 알게 되실겁니다😊

`(\d)+`는 숫자이면서 하나 혹은 여러개가 연속된 문자열을 매칭하는 것입니다. (`[a-zA-z])`는 알파벳 문자열을 매칭한 것입니다. 이 두개를 이으면 숫자 여러개+알파벳 하나와 일치하는 문자열을 찾는 것인데요. 위의 예제에서는 `‘1283902b’` `‘1238923o’`이 이곳에 해당합니다.

그리고 아까 설명했듯이 괄호로 묶으면 그룹화가 되고, 그룹화된 문자들은 `p1, p2, ...` 매개변수를 통해 넘어온다고 했죠? 위의 예제에서는 p1에 매칭된 숫자가 들어오고, p2에 매칭된 문자가 들어옵니다. `apple1283902banana` 문자열이라고 하면 `p1 === 1283902` `p2 === b` 가 됩니다.

결과적으로 relacer 함수에서 `return ' '+p2;` 를 반환한 것은 매칭된 `‘1283902b’` `‘1238923o’`를 `공백 + 단어 앞글자`로 변환해주는 것이 됩니다. 아까보다 더 단순하게 여러개의 공백을 하나로 줄일 수 있죠.

## [Tips 4] 정규표현식 안에 변수 넣기

간혹가다 런타임 상에서 동적으로 정규표현식을 작성해야 하는 경우가 있습니다.
이럴 땐 RegExp 객체를 사용해서 변수 안에 있는 값으로 정규표현식을 작성하면 됩니다.

```jsx
const names = ['milk717','sumin','minsu'];
const str = 'My name is sumin';
const regExp = new RegExp(`/${names.join('|')}/`);

console.log(str.match(regExp)) //[ 'sumin', index: 11, input: 'My name is sumin', groups: undefined ]
```

위의 예시처럼 필요한 단어들을 배열에 넣어놓고, 그 단어들을 정규표현식에서 OR 연산자에 해당하는 `|`로 `join`한다면 `/CON|PRN|NUL|…./`과 같이 하나하나 입력하지 않고 정규표현식을 작성할 수 있습니다.

# 정규표현식 그룹화와 캡쳐

정규표현식 그룹화와 캡쳐는 정규표현식에서 특정 부분을 그룹으로 묶고, 해당 그룹에 매치되는 부분을 추출하는 것을 의미합니다.

## 그룹화

패턴을 그룹화하기 위해서는 괄호로 묶어주어야 합니다. 이렇게 괄호로 그룹화된 배턴은 하나의 단위로 취급됩니다. 아래 예시를 통해 살펴보겠습니다.

![그룹화가 적용된 경우](https://i.imgur.com/zxYM6Ve.png)

이렇게 그룹화한 패턴은 하나의 단위처럼 취급할 수 있습니다. 만약 위의 예시에서 그룹화가 없다면 어떻게 되었을까요?

![그룹화가 적용되지 않았을 경우](https://i.imgur.com/UrAphLt.png)

그룹화가 없었다면 abc가 하나의 단위로 취급되지 않고, 각자 따로따로 분리되기 때문에 c 단어만 반복 처리 돼서 abcccc라는 문자도 매칭됩니다.
## 캡쳐링
괄호로 그룹화한 패턴은 캡쳐링 됩니다. 캡쳐링된다는 것은 괄호 안에 있는 패턴으로 매치되는 텍스트를 가져올 수 있는 것입니다. 자바스크립트에서는 match나 replace를 통해 캡쳐된 값을 가져올 수 있습니다. 문장에서 yyyy-mm-dd의 날짜를 추출하는 코드를 통해 그룹화에 대해 알아보겠습니다.
```jsx
const str = '내 생일은 2001-07-17';
const matchRes = str.match(/(\d{4})-(\d{2})-(\d{2})/);
/*
 [
  '2001-07-17',
  '2001',
  '07',
  '17',
  index: 6,
  input: '내 생일은 2001-07-17',
  groups: undefined
]
 */
```

match의 결과값은 배열 형태로 반환되는데, 배열의 첫 번째 인덱스에는 매칭된 문자열이 오고, 그 다음부터 차례대로 그룹별 캡쳐링된 값이 들어오게 됩니다.
만약 그룹화를 사용하지 않고 yyyy-mm-dd를 추출한다면 match 결과는 어떻게 될까요?

```jsx
const str = '내 생일은 2001-07-17';
const matchRes = str.match(/\d{4}-\d{2}-\d{2}/);
console.log(matchRes)
/*
  '2001-07-17',
  index: 6,
  input: '내 생일은 2001-07-17',
  groups: undefined
]
 */
```

결과는 위와 같이 변합니다. 추출된 yyyy-mm-dd형식에서 년, 월, 일을 따로 활용해야 할 일이 있다면 그룹화와 캡쳐링이 유용하게 사용될 수 있습니다.

## 그룹화 패턴 예제

다음은 그룹화를 사용해서 만들 수 있는 정규표현식 패턴입니다.
이번 과제에서 제가 `(?=A)A|B` 를 사용해 파일명과 디렉터리 명을 한번에 탐색하려고 했으나, 이름에 특수문자가 오는 경우를 추출하지 못해 다른 방법을 사용했습니다ㅜ 혹시 path에서 name을 추출하는 부분을 하나의 정규표현식으로 처리한 정규표현식 고수님이 계신다면 알려주세요!

- `(A)?B` : A조건의 문자가 없는 경우 B조건으로 탐색
- `(A)*B` : A조건의 문자가 없거나 여러개인 경우 B조건으로 탐색
- `(?=A)A|B`: A조건으로 우선 탐색하고, A조건이 탐색되면 탐색 멈춤. A조건이 탐색되지 않는다면 B조건으로 탐색

# 참고 문서

- https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/String/replace
- [https://inpa.tistory.com/entry/JS-📚-정규식-RegExp-누구나-이해하기-쉽게-정리](https://inpa.tistory.com/entry/JS-%F0%9F%93%9A-%EC%A0%95%EA%B7%9C%EC%8B%9D-RegExp-%EB%88%84%EA%B5%AC%EB%82%98-%EC%9D%B4%ED%95%B4%ED%95%98%EA%B8%B0-%EC%89%BD%EA%B2%8C-%EC%A0%95%EB%A6%AC)
- https://learn.microsoft.com/ko-kr/windows/win32/fileio/naming-a-file
- https://blog.naver.com/PostView.naver?blogId=hankrah&logNo=222197612239&categoryNo=65&parentCategoryNo=0&viewDate=&currentPage=1&postListTopCurrentPage=1&from=postView
- https://regexr.com/
