---
date: 2023-11-13
title: "[부스트캠프/NDD] 곰터뷰는 왜 Cloudflare를 사용해서 배포하게 되었을까?"
category: 개발
excerpt: Docker, AWS S3, Cloudflare를 사용해서 React 웹사이트를 배포해본 후 Cloudflare을 선택하게된 과정을 담고 있는 글입니다.
tags:
  - 곰터뷰
  - 네이버-부스트캠프
thumbnail: https://i.imgur.com/vTLB9Nf.png
slug: gomterview-1
updated: 2024-05-05T16:58
---
결과적으로 우리 NDD 팀은 Cloudflare를 사용해서 React 페이지를 배포하게 되었습니다.
이 글은 왜 수많은 선택지중에 Cloudflare를 사용해서 배포하게 되었는지에 대한 과정이 담겨있습니다.
# 어떤 방법으로 배포할까?

여러가지 배포 방법을 살펴보기 전에 먼저 React 배포 프로세스에 대해 간단하게 짚고 넘어가겠습니다.

1. `빌드`: React 애플리케이션이 번들러(Webpack, Vite 등)을 통해 빌드되어 정적 파일로 변환됩니다.
2. `파일 업로드`: 빌드된 정적 파일이 서버에 업로드됩니다. 서버에 업로드된 파일은 인터넷을 통해 접근 가능하고 클라이언트가 해당 주소로 접속 시 번들링된 정적 파일을 제공해줍니다.
3. `사용자 동작`: 클라이언트(브라우저)는 서버로부터 받아온 정적 파일을 다운로드받아 웹 페이지를 랜더링합니다.

위 과정을 거치며 정적 페이지가 배포되는데요. 여기서 주의해야 할 점은 React는 SPA구조로 되어있어 사용자가 애플리케이션의 root(/) 경로에서 /user등의 경로로 이동해도 실제로는 index.html 한
파일 내에서 처리되어야 한다는 것입니다. 때문에 이에 대한 서버 설정을 별도로 하지 않으면 /user 경로로 이동시 404페이지가 반환됩니다.
따라서 Nginx등의 웹 서버와 함께 배포해서 모든 경로 요청을 index.html로 리다이랙션 하는 로직을 구현해야 합니다.
![SPA 사이트를 배포할 때 리다이랙션을 처리해야 하는 이유](https://i.imgur.com/jAzUAV0.png)

## Docker를 사용해서 배포하기

사실 React는 정적 사이트라서 Docker를 사용해서 배포했을 때 얻을 수 있는 장점이 거의 없습니다.
그럼에도 불구하고 제가 이 선택지를 고려했던 이유는 다음과 같습니다.

- 이전 프로젝스에서 학교 서버에 Node.js와 React를 배포할 때 Docker를 사용했던 경험이 있습니다. 그래서 Docker를 사용하게 된다면 이전에 작성해둔 Github Action 파일을 재사용할 수
  있어서 제일 쉽고 간단할 것이라고 판단했습니다.
- 부스트캠프에서는 프로젝트를 모노레포로 관리하고 있는데 이에 따라 클라이언트와 서버를 한 곳에 업로드하면 배포 로직이 간소화 될 것이라고 생각했습니다.
- 부스트캠프에서 팀에게 NCP를 지원해주는데 부스트캠프 기간이 종료되고 나면 NCP의 지원 또한 중단됩니다. 우리 팀은 서비스가 닫히지 않고 계속 살아있는 것을 원했기 때문에 NCP 지원이 종료되고 나면 배포된
  파일을 다른 서버로 옮겨야 합니다. 이 때 도커를 사용해서 배포했다면 서버가 변경되더라도 동일한 컨테이너를 사용하기 때문에 쉽게 마이그레이션을 할 수 있을 것이라고 판단했습니다.

위와 같은 이유들이 있었지만 우리 팀은 Docker를 선택하지 않았습니다. 그 이유는 우리가 NCP를 사용하지 않기로 결정해서 호스팅 서버를 변경할 일도 없었고, 모노레포라고 해서 꼭 한 서버에 업로드할 필요는
없었기 때문입니다.
우리 팀은 NCP 대신 AWS EC2를 사용하기로 결정했고, 클라이언트와 서버를 한 곳에 업로드하는 것은 오히려 EC2의 비용만 증가시키는 일이기 때문에 이 선택지는 기각되었습니다.

### 이전 프로젝트에서 Docker를 사용해서 배포를 했던 이유

아까 제가 Docker 도입을 염두했던 큰 이유중 하나는 이전에 Docker를 통해 배포했던 경험이 있었기 때문입니다.
그 때는 배포 방식에 대해 큰 고민을 하지 않고 바로 Docker를 사용했었는데요. 그 이유는 다음과 같았습니다.

- 배포해야하는 서버가 학교 전산원으로부터 제공받은 리눅스 서버였기 때문에 S3, Cloudflare 등 다른 선택지가 존재하지 않았습니다.
- 전산원 서버에서 돌아가는 다른 서비스들은 대부분 도커 컨테이너 위에서 돌아가고 있었습니다. 따라서 일관성을 위해 도커를 사용해야겠다고 생각했습니다. 전산원 서버는 다음과 같은 형태로 구성되어 있었습니다.

![전산원 리눅스 서버의 구조](https://i.imgur.com/bXlKwbt.png)

- 얼마 전에 스프링 서버를 배포하면서 작성해준 Dockerfile, Github Action 파일이 있었고, 이를 조금 수정해서 빠르게 스크립트를 작성할 수 있었습니다.

#### 배포시에 사용했던 스크립트

```yml
name: Docker CD

on:
  push:
    branches:
      - 'production'
    tags:
      - 'v*'
  pull_request:
    branches:
      - 'production'

jobs:
  docker:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v3

      - name: Use Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18.x'

      - name: Make env
        run: |
          touch ./.env
          echo "${{ secrets.ENV }}" > ./.env
          echo .env
        shell: sh

      - name: Install dependencies
        run: yarn

      - name: Build Project
        run: yarn build

      - name: Docker meta
        id: meta
        uses: docker/metadata-action@v4
        with:
          images: |
            ${{ secrets.DOCKER_USERNAME }}/home-appcenter
          tags: |
            type=ref,event=branch
            type=semver,pattern={{version}}

      - name: Login to DockerHub
        if: github.event_name != 'pull_request'
        uses: docker/login-action@v2
        with:
          username: ${{ secrets.DOCKER_USERNAME }}
          password: ${{ secrets.DOCKER_PASSWORD }}

      - name: Build and push
        uses: docker/build-push-action@v4
        with:
          context: .
          push: ${{ github.event_name != 'pull_request' }}
          tags: ${{ steps.meta.outputs.tags }}

      - name: Deploy
        uses: appleboy/ssh-action@v0.1.7
        with:
          host: ${{ secrets.HOST }}
          username: ${{ secrets.USERNAME }}
          password: ${{ secrets.PASSWORD }}
          script: |
            docker stop inu-hompage
            docker rm inu-hompage
            docker pull ${{ secrets.DOCKER_USERNAME }}/home-appcenter:production
            docker run -d --name inu-hompage -p 3000:3000 ${{ secrets.DOCKER_USERNAME }}/home-appcenter:production
            docker image prune -f
```

## S3와 CloundFront를 사용해서 배포하기

AWS를 사용하기로 결정한 후 S3라는 선택지가 생겼습니다!
S3는 AWS에서 제공해주는 객체 스토리지 서비스입니다. React는 정적 사이트이므로 스토리지에 번들링된 파일을 올려두는 방식으로도 배포할 수 있습니다.
S3를 사용해서 배포한다면 다음과 같은 장점들을 얻을 수 있습니다.

- 배포 과정이 매우 간단해진다! 빌드된 React앱 파일을 S3 버킷에 업로드만 하면 되기 때문에 별도의 서버 설정이 필요하지 않습니다.
- CloundFront에서 커스텀 에러 응답을 지정해서 nginx 없이 React앱의 라우팅 처리를 해줄 수 있습니다.

### S3에 배포하는 방법

#### 전체 시나리오

- S3 저장소에 public으로 접근할 수 있는 IAM 사용자를 생성합니다.
- Github Action을 사용해서 S3에 웹팩으로 번들링된 파일을 올립니다
- S3는 정적 파일 호스팅이므로 리액트 라우터 처리는 Cloudfront에서 따로 처리해줍니다.
- CloudFront는 사용자 정의 오류 응답을 설정할 수 있어서, 404 오류가 발생했을 때 'index.html'로 리다이렉트하는 것과 같은 동작을 설정할 수 있습니다.

#### IAM 사용자 생성

1. IAM 서비스로 이동해서 사용자 생성 버튼을 클릭합니다.
   ![](https://i.imgur.com/vpqB6Hn.png)
   ![](https://i.imgur.com/yHW15iH.png)

2. IAM 사용자에게 다음 권한을 부여합니다.
    - AmazonS3FullAccess
    - CloudFrontFullAccess
   ![](https://i.imgur.com/IMEnPjU.png)

3. 사용자를 생성합니다.
   ![](https://i.imgur.com/V5V1MFw.png)

4. 액세스키를 생성하고 저장해둡니다. (다시 볼 수 없으니 꼭!! 저장해두셔야 합니다.)
   ![](https://i.imgur.com/Io5pkul.png)


#### S3 버킷 생성하기

1. 버킷에 적당한 이름과 리전을 선택합니다.
   ![](https://i.imgur.com/56V8eh8.png)


3. 퍼블릭 액세스 차단은 체크박스 해제를 해줍시다.
    - 우리는 S3를 정적 사이트 배포용으로 사용할 것이기 때문에 퍼블릭 엑세스가 허용되어 있어야 합니다.
      ![](https://i.imgur.com/YFj96gE.png)


4. 나머지 옵션은 그대로 둔채로 버킷을 생성합니다.

5. 생성된 버킷의 속성 탭으로 이동해서 맨 아래로 스크롤을 내려서 정적 웹 사이트 호스팅 설정에 들어갑니다.
   ![](https://i.imgur.com/jFEf65W.png)


6. 정적 웹 사이트 호스팅 옵션을 활성화로 바꿔준 후 인덱스 문서와 오류 문서의 파일명을 index.html로 변경해줍니다.
   ![](https://i.imgur.com/RaBts6d.png)


7. 버킷의 권한 탭으로 이동해서 버킷 정책을 편집합니다.
   ![](https://i.imgur.com/vKENwai.png)

9. 버킷 ARN을 복사한 후 정책 생성기로 이동합니다.
   ![](https://i.imgur.com/4m0ewUv.png)


10. 아래와 같이 정책을 설정합니다.
    ![](https://i.imgur.com/fwrzkJo.png)


    - Select Type of Policy: S3정책이므로 S3 Bucket Policy를 선택합니다.
    - Principal의 * 은 모든 유저를 뜻합니다.
    - Actions는 `GetObject`를 선택합니다.
    - ARN에는 아까 복사했던 버킷 ARN 뒤에 `/*`를 붙여줍니다.

11. Generate Policy를 눌러서 생성된 정책을 복사합니다.
    ![](https://i.imgur.com/xAARawE.png)


12. 생성된 정책을 추가합니다.
    ![](Pasted%20image%2020240414154630.png)

#### S3로 올리는 Github Action 파일 작성하기

```yml
name: Deploy React App to Amazon S3

on:
  push:
    branches:
      - dev

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout Repository
        uses: actions/checkout@v2

      - name: Set up Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '18'

      - name: Change to FE directory
        run: cd ./FE

      - name: Install Dependencies
        run: yarn install
        working-directory: ./FE

      - name: Build
        run: yarn build
        working-directory: ./FE

      - name: Deploy to S3
        env:
          AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
          AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
        run: |
          aws s3 sync ./FE/dist/ s3://${{ secrets.AWS_S3_BUCKET }} --region ap-northeast-2 --delete
```

우리팀의 레포지토리는 아래와 같은 구조로 올라가있었기 때문에 FE 디렉터리로 이동하는 과정을 스크립트에 추가로 작성했습니다.

```
├── BE
├── FE
└── README.md
```

이 액션 파일에 필요한 환경변수는 아래와 같습니다.

- `AWS_ACCESS_KEY_ID`: 위에서 생성한 IAM 사용자의 엑세스 키 ID
  ![](https://i.imgur.com/hjgHVfp.png)

- `AWS_SECRET_ACCESS_KEY` : IAM 사용자의 엑세스 키를 처음 발급받을 때 받았던 시크릿 키
- `AWS_S3_BUCKET`:  S3 버킷의 이름

#### CloundFront에서 커스텀 에러 응답 설정하기

위와 같은 과정을 거치고 Github Action이 수행되고 나면 아래와 같이 S3 버킷에 빌드된 파일이 올라갑니다.
![](https://i.imgur.com/L9gG1Dm.png)


하지만 index.html에 접근해보면 우리의 페이지는 보이지 않고 404에러 메시지만 나타나게 됩니다.
![](https://i.imgur.com/h76bYpC.png)


다른 하위 경로로 접속해보면 403 에러가 발생하게 됩니다. 왜냐하면 S3 버킷에서 퍼블릭 접근은 index.html만 허용되어 있기 때문이죠.
![](https://i.imgur.com/o2mSpns.png)


이러한 문제점은 커스텀 에러 응답을 설정해서 해결할 수 있습니다.
글 초반부에서 설명했듯이 SPA에서 라우터가 정상적으로 동작하기 위해서는 웹서버 등에서 리다이랙션하는 과정이 필요한데요. CloundFront에서 에러 페이지를 index.html로 커스텀하면 이 동작을 구현할 수
있습니다.

1. CloudFront 배포 생성하기
   AWS CloudFront 서비스에 들어가서 S3로 배포된 웹사이트의 도메인을 입력합니다.
   ![](https://i.imgur.com/2ihQ2RT.png)


2. 웹 애플리케이션 방화벽은 비활성화 한 후 배포를 생성합니다. (방화벽 활성화하면 돈들어요!)
   ![](https://i.imgur.com/sLtOPXg.png)


3. 생성된 배포에서 사용자 정의 오류 응답 생성 버튼을 클릭합니다.
   ![](https://i.imgur.com/GYulxFp.png)


4. 아래와 같이 404 에러에 대해 index.html로 리다이랙션 시켜주고 200 응답을 내려주는 커스텀 응답을 생성합니다.
   ![](https://i.imgur.com/J0tnKfF.png)


5. 403 에러에 대해서도 동일한 처리를 해줍니다.

6. CloudFront의 배포 도메인으로 접속하면 페이지가 정상적으로 표시되는 것을 확인할 수 있습니다.
   ![](https://i.imgur.com/sXrobF4.png)


### S3와 CloudFront를 선택하지 않은 이유

위의 과정처럼 S3와 CloudFront에 대해 학습하고 배포하는 과정도 직접 수행했지만 이 방법을 선택하지 않았습니다. 왜냐하면 버전 관리 기능이 Cloudflare에 비해 빈약했기 때문인데요.
Cloudflare에서는 메인 브랜치로 PR이 머지될 때 마다 해당 버전에 대한 preview URL을 생성해주는 기능을 지원해줍니다.
이 밖에도 S3와 CloudFront에서 할 수 있는 일들의 상위 호환되는 작업을들 Cloudflare에서 수행할 수 있었기 때문에 S3와 CloudFront 대신 Cloudflare를 선택했습니다.

## Cloudflare로 배포하기

우리팀은 최종적으로 Cloudflare를 사용한 배포 방식을 채택했습니다.
왜냐하면 아래와 같은 장점들이 있었기 때문입니다.

- 레포지토리와 연결하는 것 만으로 배포를 할 수 있었고, CDN을 통한 캐싱도 자동으로 설정해줍니다.
- PR 버전별 웹사이트 스냅샷
  사실상 Cloudflare를 선택한 가장 주된 이유인데요. Cloudflare에서는 메인 브랜치로 PR을 보낼 때 마다 이에 해당하는 스냅샷 버전의 웹사이트를 생성해주는 기능을 제공해줍니다.
  이 기능을 통해 나중에 UX를 개선하거나 성능 최적화를 진행했을 때 이전 버전과 더 수월하게 비교할 수 있을 것이라고 판단했습니다.
  ![Cloudflare의 브랜치별 스냅샷 기능](https://i.imgur.com/NaCDZIZ.png)


### Cloudflare 배포 방법

1. Cloudflare에서 Workers & Pages 탭에 들어갑니다.
   ![](https://i.imgur.com/LUccTmo.png)

2. Pages 탭에서 `Connect to Git` 버튼을 눌러 레포지토리 저장소와 연결합니다.
   ![](https://i.imgur.com/ais7TCe.png)


3. Connect Github를 통해 깃허브와 연동합니다.
   ![](https://i.imgur.com/nbMLc5h.png)


4. 연결하고싶은 레포지토리를 선택한 후 설정을 마칩니다.
   ![](https://i.imgur.com/YFYQmab.png)


5. 프로젝트의 빌드 설정에 맞게 아래 값들을 설정해줍니다.
   ![](https://i.imgur.com/u93oht6.png)


6. Save and Deploy를 눌러주면 빌드 설정이 완료됩니다~!
   ![](https://i.imgur.com/iH7Elod.png)


# 마무리

Docker, S3와 CloudFront, Cloudflare를 통해 React 웹사이트를 배포해본 결과 Cloudflare를 사용해서 배포하는 방식을 채택했습니다.
지금까지 배포 업무를 진행할 때는 큰 학습 없이 "올리기만 하면 된다!" 라는 생각을 갖고 있었는데요. 이번 기회에 다양한 배포 방식에 대해 학습 해볼 수 있게 되어 유익했습니다.😊
학습한 내용에 비해 Cloudflare에서 너무 쉽게 배포를 진행할 수 있어서 허무하기도 했습니다. (~~로봇에게 일자리를 뺏긴 노동자가 된 기분~~)
앞으로 프로젝트를 진행하면서 Cloudflare의 다양한 기능에 대해 알게된다면 추가로 포스팅하겠습니다ㅎㅎ

# 참고 자료

[AWS S3로 React 배포하기](https://velog.io/@krkorklo58/AWS-S3%EB%A1%9C-React-%EB%B0%B0%ED%8F%AC%ED%95%98%EA%B8%B0)

