---
date: 2023-06-14
title: 프로그래머스 k진수에서 소수 개수 구하기
excerpt: 
category: 학습
tags:
  - Algorithm
  - 프로그래머스
thumbnail: https://i.imgur.com/dCcyBTB.png
slug: algorithm-js-cnt-k
updated: 2024-05-05T16:58
---

# 문제 살펴보기

> 문제 설명은 아래 링크를 참고해주세요!
> [프로그래머스 > 코딩테스트 연습 > 022 KAKAO BLIND RECRUITMENT > k진수에서 소수 개수 구하기](https://school.programmers.co.kr/learn/courses/30/lessons/92335#)

문제를 읽어보면 굉장히 간단할 것 같다는 생각이 먼저 든다.  
10진수를 k진수로 바꾸는 것은 나눗셈의 몫과 나머지를 이용해서 간단하게 구할 수 있다.  
그리고 아래 조건도 얼핏 보면 복잡해 보이지만 조금만 더 생각해보면 그냥 0으로 split하면 해결된 다는 것을 알 수 있다.   
- 0P0처럼 소수 양쪽에 0이 있는 경우 
- P0처럼 소수 오른쪽에만 0이 있고 왼쪽에는 아무것도 없는 경우 
- 0P처럼 소수 왼쪽에만 0이 있고 오른쪽에는 아무것도 없는 경우 
- P처럼 소수 양쪽에 아무것도 없는 경우 
- 단, P는 각 자릿수에 0을 포함하지 않는 소수입니다.
  
# 구현하기
구현 과정을 Step으로 나타내면 다음과 같다.  
**Step 1.** 10진수를 k진수로 변환하기  
**Step 2.** 변환된 k진수를 0으로 split하기  
**Step 3.** split된 배열의 수 중에서 소수인 것의 개수를 세기  

위의 Step을 기반으로 구현해야 할 함수를 생각해보면  
0진수를 k진수로 변환하는 함수, 소수를 구하는 함수 이렇게 두 개가 필요하다는 것을 알 수 있다.  
## 10진수를 k진수로 변환하는 함수 구현하기
10진수를 2진수로 변환하는 과정을 생각해보자.  
아래 그림처럼 10진수인 19가 있고, 이를 2진수로 변환한다고 할 때  
19를 기수인 2로 계속 나눈 후 나머지 값을 거꾸로 읽으면 변환된 2진수 값이 나온다.  
![](https://i.imgur.com/EBxJRQz.png)
이 과정을 코드로 구현하면 다음과 같다.  
```javascript
const convert = (n,k) =>{
    const res = [];
    while (n){
        res.push(n%k);
        n /= k;
        n = Math.floor(n);
    }
    return res.reverse().join('');
}
```
나머지를 저장할 Array를 생성한다.  
그 다음 10진수인 n이 0이 아닐 때 까지 while문을 돌면서 n을 기수인 k로 나눈 나머지를 배열에 넣고, n값은 n을 k로 나눈 몫으로 업데이트 해준다.  
나머지를 거꾸로 읽어야 변환된 진수가 되기 때문에 res 배열에 담긴 값을 reverse를 통해 뒤집고 join을 통해 연결한 후 리턴해주었다.  

## 소수를 구하는 함수 구현하기  
### 에라토스테네스의 체는 안됨!!
나의 첫 번째 접근 방법은 에라토스테네스의 체로 소수 함수를 구현하는 것이었다.  
하지만 이렇게 하니 1번이랑 11번에서 런타임 에러가 발생했다.
[MDN - Array: length](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Array/length#%EC%84%A4%EB%AA%85)
을 살펴보면 javascript의 배열의 최대 길이가 4294967296(2^32)인 것을 알 수 있다.  
만약 (n,k) = (824225, 3)이라면 변환된 3진수는 1112212121212이 되고, 이는 배열의 최대 사이즈보다 큰 수이기 때문에 런타임 에러가 발생했던 것이다.  
따라서 다른 방법으로 소수를 구해줘야 한다.  
### 제곱근 방법으로 소수 구하기
어떤 수 N의 약수들은 sqrt(N) 기점으로 대칭을 이루기 때문에 소수를 판별할 때는 N의 제곱근 까지만 보면 된다.  
예시를 들어 설명하자면, N = 12 일 때 약수는 1, 2, 3, 4, 6, 12 가 된다.  
여기서 sqrt(N) = sqrt(12) = 3.X가 된다.  
12를 두 약수의 곱으로 표현할 때 제곱근인 4.X를 기준으로 대칭이 되는 것을 볼 수 있다.  
```
1 * 12  
2 * 6  
3 * 4  

4.x

4 * 3  
6 * 2  
12 * 1 
```
이를 통해 N이 N의 제곱근보다 큰 수로 나누어 떨어진다면, N의 제곱근보다 작은 수로 무조건 나누어 떨어진다는 것을 확인할 수 있다.  
따라서 N의 제곱근까지만 나누어보는 것으로 소수 여부를 판별할 수 있다.  
이 이론을 적용해서 코드를 작성하면 다음과 같다.  
```javascript
const isPrime = (num) => {
    if(num <= 1) return 0;
    for (let i = 2; i<=Math.sqrt(num); i++){
        if(num % i === 0){
            return 0;
        }
    }
    return 1;
}
```
## 전체 코드
```javascript
const convert = (n,k) =>{
    const res = [];
    while (n){
        res.push(n%k);
        n /= k;
        n = Math.floor(n);
    }
    return res.reverse().join('');
}

const isPrime = (num) => {
    if(num <= 1) return 0;
    for (let i = 2; i<=Math.sqrt(num); i++){
        if(num % i === 0){
            return 0;
        }
    }
    return 1;
}

function solution(n, k) {
    return convert(n,k).split('0').reduce((acc,cur)=>acc+isPrime(+cur),0);
}
```
# 문제 후기
간단한 문제였지만 소수 판별 함수를 구현하는 곳에서 어려움이 있었다.  
그래도 이 문제 덕분에 제곱근을 통해 소수를 판별할 수 있다는 사실을 알게 되어 유익했다.  
