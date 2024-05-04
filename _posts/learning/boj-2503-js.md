---
date: 2023-03-25
title: "[BOJ] 2503_숫자야구"
excerpt: 
category: 학습
tags:
  - Algorithm
  - BOJ
thumbnail: https://i.imgur.com/PIqR60k.png
slug: boj-2503
---
[2503번: 숫자 야구](https://www.acmicpc.net/problem/2503)

이게 실버 3 난이도라고???  
심지어 아래 출처를 보니 초등부 정보 올림피아드 문제!!  
한동안 프로그래머스 1레벨 정도 난이도의 문제만 풀면서 자신감이 붙었는데 이 문제를 보고 충격받았다.  
1시간 30분정도 도전해본 후 실패하고 결국 다른 사람의 풀이를 보고 풀었다,,흑흑  
## 나의 접근 방법
답변이 될 수 있는 (strike, ball)의 경우의 수 마다 조건문을 만들어서 처리한다.
```jsx
0   0
0   1
0   2
1   0
1   1
1   2
2   0
```
1. strike와 ball 이 모두 0인 경우
   이 때 물어본 수에 포함된 숫자는 절대 답에 올 수 없으므로 기록해둔다.
2. strike = 0, ball = 1인 경우
   첫 번째 자리가 ball number일 때, 두 번째 자리가 ball number일 때, 세 번째 자리가 ball number일 때의 경우를 나누고, 나머지 자리에는 1부터 9까지 차례대로 대입하는데, 이 때 중복된 숫자가 나오지 않게 하고 1번에서 필터링한 수는 나오지 않게 한다.

이런식으로 각각 경우마다 가능한 수를 구해준다음에 set 에 넣어준다.
하지만 이 풀이의 경우 하나의 답변을 통해서만 정답을 유추하고, 답변들과의 관계에서 유추할 수 있는 것을 고려하지 못한다.
## 통과한 풀이 아이디어
정답이 될 수 있는 수 라면 질문으로 주어졌던 수들의 strike, ball 갯수의 조건을 모두 만족해야 한다.
따라서 3자리 수 중 모든 수가 다르면서 1~9가 포함된 수가 담긴 배열을 만들고, 배열의 각 값이 질문에 나온 모든 조건을 만족하는지 확인하면 된다….
## 정답 코드
```jsx
const fs = require("fs");
const filePath = process.platform === "linux" ? '/dev/stdin' : '../input.txt';
let input = fs.readFileSync(filePath).toString().split('\n').slice(0,-1);

let [n, ...list] = input;
let arr = [];

for(let i = 1; i < 10; i++){
    for(let j = 1; j <10; j++){
        for(let k = 1; k < 10; k++){
            if(i !== j && j !== k && i!==k){
                arr.push(`${i}${j}${k}`);
            }
        }
    }
}

let cnt = 0;

for (let num of arr){
    let isAvailable = false;
    for(let item of list) {
        let [s, b] = [0, 0];
        let [question, strike, ball] = item.split(' ');

        for (let i = 0; i < 3; i++){
            if(question[i] === num[i]){
                s++;
            }else{
                if(num.includes(question[i])){
                    b++;
                }
            }
        }
        if(s=== +strike && b=== +ball){
            isAvailable = true;
        }else{
            isAvailable = false;
            break;
        }

    }
    cnt += isAvailable ? 1:0;
}

console.log(cnt)
```
