---
date: 2023-05-06
title: "[Bixby Capsule] 빅스비 캡슐 개발 일지 1: 빅스비로 http GET 요청을 보내보자"
excerpt: 빅스비 캡슐에서 음성 명령으로 http GET 요청을 보내는 방법에 대한 포스트입니다.
category: 개발
tags:
  - Bixby
  - 졸업작품
thumbnail: https://i.imgur.com/UwMoiZP.png
---
# ❓ 빅스비 캡슐을 사용하게 된 이유
## google assistant api 서비스 종료라니??
![google assistant api 서비스 종료](https://i.imgur.com/3S6cCoh.png)
졸업작품에서 음성명령으로 api호출을 해야 할 일이 있어서 google assistant api를 사용하기로 계획했었다.
google assistant api 개발을 위해 공식문서에 들어갔더니 떡하니 6월13일에 지원이 종료된다고 나와있었다....
사실 졸업작품 구술 발표는 5월26일이라서 google assistant api를 사용해도 문제는 없었지만 노력해서 새로운 것을 습득했는데 한달도 안돼서 없어진다면 너무 슬프지 않은가😂
그래서 google assistant api를 대체할 수 있는 것을 찾아보던 중 빅스비 캡슐이라는 것을 발견했다!!

## 빅스비 캡슐을 개발을 공부해야한다니,,,

대체제를 찾아서 정말 다행이었지만 비교적 레퍼런스가 많이 없는 기술을 사용한다는 것에 약간의 걱정이 생겼다.
게다가 지금 이것 말고도 연구실 프로젝트, 코딩테스트 준비, react 공부 등 해야 할 일이 태산인데 이건 언제 공부하지? 라는 걱정 또한 있었다.
그리고 가장 결정적이었던 문제는 빅스비 캡슐을 공부하고싶은 동기가 안생긴다는 것이었다.
4학년이 된 이후로는 공부를 하기 전에 한 가지 사항을 고려하게 되었는데 그것은 바로 '지금 내가 공부하려는 내용이 취업에 도움이 되는가?' 라는 것이었다.
아무리 생각해봐도 나중에 취업해서 이걸 써먹을 일은 없을 것 같았다.
모든 배움에는 다 쓸모가 있지만 시간이 촉박해지니 배움도 가려서 하고싶은 욕망이 생겨버렸다🥲
하지만 내 마음이 어떻든 졸업작품은 완료해야한다.
음성 명령을 넣지 않고도 완성할 수 있긴 해도 하기싫다는 마음 때문에 완성도 낮은 졸업작품을 발표하고 싶진 않았다.
그래서 원활한 학습을 위해 동기부여가 필요했다.
나에게 가장 큰 동기부여는 무언가를 만들고싶다는 욕망이다.
빅스비 캡슐로 무엇을 만들 수 있는지 생각해보니 내 방에 있는 전자기기를 제어할 수 있는 수민 홈 캡슐을 만들면 재미있을 것 같다는 생각이 들었다.
아직 구체화 된 것은 없지만 만들고싶은 대상이 생긴 것 만으로도 학습에 대한 동기가 될 수 있었다.

# 📝 빅스비 캡슐 개발 할 때 참고한 것

## 공식문서는 너무 깔끔하지만 한글번역이....

> [빅스비 캡슐 공식문서](https://bixbydevelopers.com/dev/docs/dev-guide/developers)

공식문서는 굉장히 깔끔하게 잘 정리되어 있었고 영어로 되어있었다.
chrome 브라우저에는 번역이라는 매우 유용한 기능이 있지만 빅스비 캡슐 공식문서에서는 이것이 큰 도움이 되지 않았다.
번역 기능만 사용하면 사이트가 멈춰버리는 것이었다.
그래서 어쩔 수 없이 영어로 된 공식문서를 보면서 개발해야만 했다.

## Bixby Developers 유튜브

> [Bixby Developers - Bixby Capsule Online Course - Korea](https://www.youtube.com/playlist?list=PLE9wDcpAxXg_vqBKKlfAwHp7t3wVXura4)

정말 많은 도움이 됐던 유튜브!! 한국어로 친절하게 강의까지 해주시니 개발하는데 정말 많은 도움이 됐다.
하지만 3년 전 영상이다 보니 현재와 약간 다른 부분도 있었다.
그 중 하나는 자바스크립트 런타임 버전이 달라졌다는 것인데, 영상에 나온 코드는 자바스크립트 런타임 버전 1을 사용하고 있다.
현재 빅스비 캡슐에서는 ES 2020 버전을 지원하는 자바스크립트 런타임 버전 2가 제공된다.
그렇기 때문에 영상만 따라하면서 개발하지 말고 공식문서를 함께 읽는 것을 추천한다.

> [자바스크립트 런타임 버전 변화](https://bixbydevelopers.com/dev/docs/dev-guide/developers/actions.jsrs)

## 빅스비 캡슐 샘플

빅스비 스튜디오를 설치하고 프로젝트를 생성할 때 빅스비에서 제공하는 샘플 프로젝트를 생성할 수 있다.
하지만 이 예제도 자바스크립트 런타임 버전 1을 사용하고, 심지어 연결된 서버는 동작하지 않는다.
~~유지보수 해주세요!~~
![새로운 프로젝트 생성하기](https://i.imgur.com/t6g2d7Y.png)

![http api calls 캡슐 생성](https://i.imgur.com/N98kGOC.png)
확실히 개발할 때 최고의 참고자료는 레퍼런스 인 것 같다!! 이 예제 코드 덕분에 전체적인 흐름을 이해하는데 많은 도움이 됐다.
# 🚀Http Get 요청 보내기

현재 내가 졸업작품에서 만들어야 할 것은 음성 명령으로 리마인더 조회와 등록을 하는 빅스비 캡슐이다.
일단 이번 포스트에서 다뤄 볼 get 요청은 `baseURL/api/reminder/title`로 get 요청을 보내면 다음과 같은 형식의 response를 내려 주는 api 이다.

```json
[
  {
    "title": "오늘의 리마인더1"
  },
  {
    "title": "오늘의 리마인더2"
  }
]
```

## 0. 빅스비 콘솔에 캡슐 등록하기

빅스비 캡슐을 생성하려면 먼저 빅스비 개발자 콘솔에 캡슐을 등록해야 한다.
[빅스비 개발자 콘솔](https://bixbydevelopers.com/dev/console)
위 링크에 들어가서 먼저 팀을 생성한다.
![팀 생성하기](https://i.imgur.com/0pQrxWp.png)
여기서 namespace 부분이 중요하다. 왜냐하면 빅스비 캡슐을 만들 때 `namespace.project`의 이름으로 만들어야 하기 때문이다.
팀을 생성했으면 Register New Capsule 버튼을 눌러서 캡슐을 등록한다.
## 1. 먼저 모델링을 해야한다.
![빅스비 캡슐 생성 시 초기 상태](https://i.imgur.com/i1Bdfc2.png)
빅스비 캡슐을 처음 생성하면 위와 같은 상태가 된다.
우선 http get 요청을 보내기 위해 최소한의 부분을 설명해보겠다.

### 1-1. models이 뭔데??

- actions
    - 빅스비를 학습시킬 때 학습시킬 문장에 대한 액션을 매핑시킨다. 이 때 매핑시키는 것이 이곳에 있는 액션이다.
    - 액션에는 어떤 input이 들어오고 어떤 output이 나가는지 명시해둔다. 이곳에 입출력의 컨셉(타입같은거) 또한 명시한다.
- concepts
    - 컨셉은 빅스비 캡슐에서 처음 들어본 생소한 개념이지만 다른 프로그래밍 언어의 타입과 비슷한 느낌인 것 같다. 컨셉에는 두 가지 종류가 있다.
        - primitive: 기본형 타입, 텍스트나 숫자
        - structure: C언어의 구조체 같은 느낌으로 이해하면 편함. 다른 primitive 컨셉으로 구성되어 있음.

### 1-2. concepts를 만들어보자!

빅스비 캡슐로 리마인더를 조회하면 title을 리스트 형태로 보여줄 예정이다.
그러기 위해서는 아래와 같이 두 가지의 컨셉이 필요하다.
![두 가지 컨셉](https://i.imgur.com/BfRz5Z1.png)

```
text (Title) {
  description (리마인더 제목)
}
```

`Title.model.bxb`에는 위와 같은 코드를 작성했다.
이는 `primitive` 타입으로 리마인더의 제목이 되어줄 것이다.

```
structure (Reminder) {    //구조체 컨셉의 이름
  description (리마인더 모델 정의)

  property (title){   //프로퍼티의 이름
    type(Title)     //primitive 컨셉명
    min(Required)
  }
}
```

`Redminer.model.bxb`에는 위와 같은 코드를 작성했다.
이는 structure 타입으로 primitive 타입인 Title을 포함하고 있다.

### 1-3. 컨셉을 만들었으니 액션을 만들어보자!

액션에서 어떤 입출력이 들어오고 나가는지 결정하는 컨셉을 만들었으니 이제 액션을 만들어볼 차례다.
액션은 `models/actions` 경로 안에 `GetReminder.model.bxb`라는 이름으로 만들었다.
코드는 다음과 같다.

```
action (GetReminder) {
  description (GET Reminder from server)  //설명 부분
  type(Search)  //액션의 타입
  output (Reminder) //아까 만든 컨셉
}
```

위 코드를 설명하자면 `GetReminder`라는 액션을 만들고 액션의 타입을 `Search`로 지정한다.
여기서 액션의 타입이란 무엇이냐면, 액션이 어떤 일을 수행하는지 명시하는 부분이다.
타입을 지정하지 않는다면 기본적으로 Search 타입으로 결정된다.
어떤 타입이 있는지는 [이 문서](https://bixbydevelopers.com/dev/docs/reference/type/action.type)에서 살펴볼 수 있다.
output 에는 아까 만든 컨셉인 Reminder를 지정해줬다.
이 말은 GetReminder의 결과값의 타입이 Reminder라는 뜻이다.

## 2. 모델링이 끝났으면 코드를 작성할 차례

### 2-1. http get 요청을 보내는 javascript 코드 작성하기

코드 부분에서는 아까 만든 액션이 어떤 작업을 수행할지 결정한다.
코드 부분은 자바스크립트 언어로 작성한다.
`code/` 경로 안에 `GetReminder.js`라는 파일을 생성했다.
**파일명은 액션과 동일하게 해주어야 한다.**

```javascript
import http from 'http';

export default function () {
    return http.getUrl('baseURL/api/reminder/title', {format: 'json'});
}
```

서버 주소로 get 요청을 보내 응답을 받아온다. 응답의 포맷은 `json`으로 설정한다.

### 2-2. endpoint 설정하기

`resources/base/endpoints.bxb`라는 파일에서 액션의 엔드포인트를 지정해줘야 한다.
엔드포인트는 1-3에서 만든 액션과 2-1에서 만든 자바스크립트 코드를 매핑시켜주는 역할을 한다.
그리고 액션으로 들어오는 input을 자바스크립트 함수의 input과 연결시켜주는 역할도 한다.
`endpoints.bxb`는 다음과 같이 작성해 준다.

```
endpoints {
  action-endpoints {
    action-endpoint (GetReminder){
      accepted-inputs ()
      local-endpoint (GetReminder.js)
    }
  }
}
```

## 3. 이제 빅스비를 학습시킬 차례!

### 3-1. 학습시키기 전에 target을 한국으로 변경해주자

`capsule.bxb`라는 파일을 보면 `target (bixby-mobile-en-US)` 이라는 부분이 있다.
![타겟 설정](https://i.imgur.com/yR8Qu30.png)
이 부분을 `target (bixby-mobile-ko-KR)`으로 변경해준다.
그 다음 `Training`에 들어가서 Training Source를 추가해준다.

![ko-KR Training Source 추가](https://i.imgur.com/6MZWPS8.png)
### 3-2. 이제 학습시키자!

아래 사진 순서대로 입력을 한다.
![](https://i.imgur.com/AecUqsa.png)


그럼 아래와 같은 화면이 나온다.
![](https://i.imgur.com/8toxndG.png)
여기서 GOAL 부분이 의미하는 것은 "리마인더 조회해줘" 라는 음성 명령이 들어왔을 때
어떤 액션을 실행시켜야 하는지 결정하는 부분이다.
이 부분에 아까 생성한 액션인 `GetReminders.model.bxb`를 대응시켜준다.
그럼 아래와 같은 화면이 나타나고, 오른쪽 위에 save 버튼을 눌러서 학습을 저장한다.

![](https://i.imgur.com/BfFSDww.png)
save 버튼을 누른 후 Training 화면을 보면 아직 학습되지 않은 항목이 있다.

![](https://i.imgur.com/AhsmdeS.png)
Compile NL Model을 눌러서 학습시킨다.

## 4. Views 만들기

모델링도 했고 학습도 시켰으면 동작할 것 같지만 아직 한 가지 더 할 일이 남았다.
바로 Views를 만드는 것이다.
지금까지는 내부적으로 어떻게 동작하는지 만들었다면 이제는 그 데이터를 빅스비에서 어떤식으로 보여줄지 지정해야 한다.
Views를 지정하지 않은 상태에서 실행하면 아래와 같은 결과가 나온다.

![뷰를 만들기 전 상태](https://i.imgur.com/cKJ0Ack.png)
Views에 대한 것은 [이 영상](https://www.youtube.com/watch?v=pZMpiikYnbI&list=PLE9wDcpAxXg_vqBKKlfAwHp7t3wVXura4&index=27)이 많은
도움이 되었다.

### 4-1. views 만들기

`resources/base/views`안에 `Reminder_Result.view.bxb` 파일을 생성한다.
여기서 다음과 같이 뷰를 작성한다.

```
result-view {
  match: Reminder(reminder)

  render {
    list-of (reminder) {
      where-each (item) {
        macro (reminder-summary) {
          param (reminder) {
            expression (item)
          }
        }
      }
    }
  }
}
```

`match` 부분에서 어떤 액션과 매핑할지 명시하고 액션의 결과로 나온 `reminder`라는 output을 reminder라는 파라미터로 받아온다.
`render` 부분에서는 어떤 뷰가 보여질지 결정한다.
리마인더 리스트를 보여줘야 하기 때문에 `list-of`라는 스코프 안에 `where-each`로 macro를 반복해서 보여준다.
macro 안에 있는 `reminder-summary`는 이제 생성할 layout 이다.

### 4-2. layout 만들기

`resources/base/layouts` 폴더 안에 `reminder-summary.marcor.bxb`라는 파일을 만들고 다음과 같이 작성한다.

```
macro-def (reminder-summary) {
  params {
    param (reminder) {
      type (Reminder)
      min (Required)
      max (One)
    }
  }

  content {
    title-card{
      title-area {
        slot1 {
          text {
            value {
              template ("#{value (reminder.title)}")
            }
          }
        }
      }
    }
  }
}
```

## 5. 이제 테스트를 해보자

### 5-1. Simulator 테스트

아까 빅스비를 학습시켰던 Training 페이지에 들어가서 학습시킨 발화 리스트 위에 마우스를 호버해보면 아래와 같이 휴대폰 아이콘이 뜬다.
![](https://i.imgur.com/mQ2oWY3.png)
여기서 아이콘을 클릭하면 Simulator가 새로운 창으로 열리게 된다.
![](https://i.imgur.com/5xYhvig.png)
캡슐이 잘 동작하는 것을 확인할 수 있다.
그런데 윗 부분이 무언가 허전하다.
이것은 바로 `capsule-info.bxb`를 설정하지 않았기 때문이다.

### 5-2. capsule-info.bxb 설정하기

`resources/ko-KR/` 경로 안에 capsule-info.bxb 라는 파일을 생성하고 아래와 같이 작성한다.

```
capsule-info {
  display-name ("나가기 전에 생각했나요?")
  icon-asset (images/icons/bixby_launcher.png)
}
```

이곳에서 캡슐의 이름을 지정해준다.
그리고 나서 실행하보면 아래 이미지 처럼 아이콘과 캡슐명이 함께 표시된 캡슐 화면이 나타난다.
![](https://i.imgur.com/z7tmqI8.png)


# 남은 할일
졸업작품을 위해서 아직 개발해야할 내용이 남아있다.
http post 요청을 보내서 리마인더를 등록하는 기능과 oauth 기능을 이용해서 로그인을 구현하는 것이다.
post 요청을 보내는 것은 로직 구현은 이 포스팅에서 했던 것과 비슷할 것 같지만 발화를 학습시키는 부분을 좀 더 공부해봐야 겠다.
그리고 oauth를 적용하기 위해서는 https 프로토콜이 지원되는 서버가 필요하기 때문에 https를 적용하는 방법도 공부해야 한다.
아직 할 일이 많지만 막막하게 느껴졌던 빅스비 캡슐의 첫 단추를 끼우고 나니 자신감이 생겼다.
빅스비 캡슐 개발 일지 2 에서는 post 요청을 보내고 사용자의 발화를 학습시키는 과정에 대해서 공부한 후 포스팅할 예정이다.
##### 빅스비 캡슐 코드
- [GitHub - strongcom/doormate-bixby-capsule: 나가기 전에 생각했나요? 서비스에서 사용한 빅스비 캡슐 코드입니다.](https://github.com/strongcom/doormate-bixby-capsule)
