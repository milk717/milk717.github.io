---
date: 2024-01-29
title: webpack에서 vite로 마이그레이션하기
excerpt: 
category: 개발
tags:
  - 곰터뷰
  - 네이버-부스트캠프
  - NDD
  - 프로젝트
thumbnail: https://i.imgur.com/nmHAxNB.png
slug: gomterview-6
---
# 서론
곰터뷰 프로젝트를 [the-NDD](https://github.com/the-NDD) organization으로 이전하게 되면서 기존 Webpack을 사용하던 프로젝트를 Vite로 마이그레이션했습니다.
곰터뷰 프로젝트 초기 세팅에서 웹팩을 선택한 주된 이유는 학습 경험을 중요하게 여겼기 때문이었습니다. 부스트캠프에서 6주간의 프로젝트 기간동안 웹팩을 통해 직접 프로젝트를 하나씩 세팅해보면서 CRA만 사용했다면 알지 못했을 것들에 대해 학습해봤습니다. 아직 웹팩에 대해 모르는 부분이 많겠지만, 기초적인 부분에 대해서는 충분히 학습했다고 판단했고, 이제는 더 빠르고 편리한 vite를 사용하기로 팀원들과 이야기를 나눴습니다. 
그리고 vite로 마이그레이션을 진행하는 과정 또한 하나의 학습 경험이 될 수 있다고 판단해서 vite로 마이그레이션을 진행하게 되었습니다.
# vite는 왜 Webpack보다 빠를까?
## vite 개발 서버 빌드 속도가 빠른 이유
vite의 개발 서버 빌드 속도는 Webpack이나 Parcel과 같은 기존 번들러보다 10배~100배 정도 빠른 속도를 제공합니다.
그 이유는 vite가 애플리케이션 모듈을 dependencies와 source code 두 가지 카테고리로 나누어서 빌드하기 때문입니다.
### dependencies
dependencies의 경우 source code에 비해 자주 변경되지 않지만 수많은 모듈 종속성이 포함되어 있기 때문에 많은 처리 시간이 소요됩니다. vite는 이러한 dependencies들을 go언어로 작성된 esbuild를 사용해 사전 번들링하기 때문에 기존 번들러보다 빠른 번들링 시간을 보여줍니다.
### source code
vite는 개발 서버에서 Native ESM을 사용해서 모듈을 로드합니다. 따라서 소스 코드가 변경 되었을 때 전체 애플리케이션을 다시 빌드하는 대신 변경된 모듈만 빠르게 업데이트합니다.  
![출처 - vite 공식문서(Vite를 사용해야 하는 이유)](https://i.imgur.com/M5hJQgB.png)
![출처 - vite 공식문서(Vite를 사용해야 하는 이유)](https://i.imgur.com/HVnl1Ad.png)


> [!info]
> **Native ESM이란?**
> Native ESM을 사용하면 별도의 번들러 없이 바닐라 JS와 브라우저 만으로 모듈 import를 사용할 수 있습니다.
> 
> ##### 사용 방법
> ```html
> <!DOCTYPE html> 
> <html lang="en">
> <head> 
> 	<meta charset="UTF-8"> 
> 	<title>ESM Example</title> 
> </head> 
> <body> 
> 	<script type="module" src="main.js"></script> 
> </body> 
> </html>
> ```
> html 파일에서 script 태그로 js 파일을 불러올 때 type을 module로 설정하면 Native ESM을 사용할 수 있습니다.
> 모듈을 불러오고 내보내는 문법은 번들러를 사용할 때와 마찬가지로 import/export를 사용합니다.
### Webpack과 Vite의 HMR
Native ESM을 사용하는 vite의 특징 덕분에 vite는 더 빠른 HMR을 제공합니다. 
Webpack의 HMR은 코드에 변경 사항이 있을 때 전체 의존성 트리를 재구성하고, 간혹 전체 애플리케이션을 다시 번들링하기도 합니다. 따라서 규모가 큰 프로젝트의 경우 HMR의 갱신 시간이 지연됩니다.
하지만 vite는 ESM을 사용한 HMR을 지원하기 때문에 코드가 수정되면 해당 부분과 관련된 모듈만 교체되어 브라우저에 전달합니다. 때문에 프로젝트의 사이즈가 커져도 HMR 갱신 시간에는 영향을 끼치지 않습니다.
# webpack에서 vite로 마이그레이션하기
위와 같은 이유로 개발 환경에서 빠른 빌드 속도를 위해 곰터뷰 프로젝트를 webpack에서 vite로 마이그레이션 하기로 결정했습니다. webpack에서 vite로 번들러를 교체하기 위해 다음과 같은 과정을 거쳤습니다.
## 1. 새로운 vite 프로젝트 생성
```shell
yarn create vite gomterview-fe --template react-ts
```
vite의 타입스크립트 템플릿을 사용해서 새로운 vite 프로젝트를 생성했습니다.
기존 프로젝트에서 번들러만 바꾸지 않고 아예 새로운 프로젝트를 만든 이유는 마이그레이션을 진행하다가 문제가 생겼을 때 기존 프로젝트 코드와 비교해보며 트러블 슈팅을 더 빠르게 할 수 있을 것이라고 판단했기 때문입니다.
## 2. 설정 파일과 패키지 파일을 이동
`.eslintrc.json`, `.prettierrc.json`, `tsconfig.json`, `vite.config.ts`등의 설정과 관련된 파일을 이동시킨 후 프로젝트가 정상적으로 동작하는지 테스트했습니다.
### eslint 설정 옮기기
vite 프로젝트를 생성하면 cjs 확장자의 eslint 설정파일이 생성됩니다. webpack을 사용하던 기존 곰터뷰 프로젝트는 json 확장자의 eslint 설정파일을 사용하고 있었기 때문에 cjs에서 json으로 확장자를 변경했습니다.
```json
{
	...
  "ignorePatterns": ["webpack.config.js"] -> ["vite.config.ts"],
	...
}
```
.eslintrc.json 파일 내용은 ignorePatterns 부분을 제외하곤 모두 동일한 설정을 사용했습니다.
ignorePatterns은 eslint가 검사하지 않을 파일에 대해 지정하는 설정입니다. 번들러의 설정파일을 eslint 검사에서 제외시킨 이유는 설정파일의 코드가 프로젝트의 eslint 규칙과 맞지 않는 부분이 있었기 때문입니다.
### tsconfig.json 설정 옮기기
vite 프로젝트 초기설정에는 `tsconfig.json`, `tsconfig.node.json`이렇게 두 가지 설정의 타입스크립트 설정파일이 존재합니다. 그 이유는 node.js 환경에서 실행할 때와 브라우저 환경에서 실행할 때의 설정을 분리하기 위함입니다. ([javascript - Vite가 tsconfig.json과 tsconfig.node.json이라는 두 개의 TypeScript 구성 파일을 생성하는 이유는 무엇입니까? - 스택 오버플로](https://stackoverflow.com/questions/72027949/why-does-vite-create-two-typescript-config-files-tsconfig-json-and-tsconfig-nod)) 
만약 곰터뷰 프로젝트를 서버사이드 랜더링으로 변경할 것을 염두해 두고 있다면 tsconfig.node.json 파일을 유지했겠지만, 그런 계획은 없기 때문에 `tsconfig.json`과 `tsconfig.node.json`을 하나의 파일로 합쳤습니다.
```json
{  
  "compilerOptions": {  
    "target": "ES2015", // 결과 파일 형식  
    "module": "es2020", // module 형식  
    "resolveJsonModule": true,  
    "esModuleInterop": true, // import시 namespace alias 가능  
    "moduleResolution": "bundler",  
    "jsx": "react-jsx",  
    "jsxImportSource": "@emotion/react",  
    "strict": true,  
    "noImplicitAny": true,  
    "baseUrl": ".",  
    "skipLibCheck": true,  
    "paths": {  
      "@common/*": ["./src/components/common/*"],  
      "@foundation/*": ["./src/components/foundation/*"],  
      "@components/*": ["./src/components/*"],  
      "@page/*": ["./src/page/*"],  
      "@constants/*": ["./src/constants/*"],  
      "@styles/*": ["./src/styles/*"],  
      "@assets/*": ["./src/assets/*"],  
      "@atoms/*": ["./src/atoms/*"],  
      "@hooks/*": ["./src/hooks/*"],  
      "@routes/*": ["./src/routes/*"],  
      "@/*": ["./src/*"]  
    }  
  },  
  "include": ["src"]  
}
```
### vite.config.ts 설정하기
기존 웹팩을 사용하던 프로젝트에서는 이미지 파일을 위한 `file-loader`, public Dir를 위한 `CopyPlugin` 등 다양한 설정들을 직접 세팅해야 했습니다. 하지만 vite에서는 이와 같은 설정을 자동으로 해주기 때문에 개발 환경 실행을 위한 dev server만 옮겨주었습니다.
#### webpack.config.js
```js
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const webpack = require('webpack');
const CopyPlugin = require('copy-webpack-plugin');
const Dotenv = require('dotenv-webpack');

module.exports = (env) => {
  const envMode = {
    production: '.env.production',
    development: '.env.development',
    local: '.env.local',
  };
  const envPath = envMode[env.mode];
  return {
    mode: process.env.production === 'true' ? 'production' : 'development',
    devtool: process.env.production === 'true' ? 'hidden-source-map' : 'eval',
    entry: './src/index.tsx',
    output: {
      publicPath: '/',
      path: path.resolve(__dirname, 'dist'),
      filename: '[hash].js',
      clean: true,
    },

    devServer: {
      historyApiFallback: true,
      port: 3000,
      hot: true,
      headers: {
        'Cross-Origin-Opener-Policy': 'same-origin',
        'Cross-Origin-Embedder-Policy': 'require-corp',
      },
      static: path.resolve(__dirname, 'dist'),
      proxy: {
        '/api': {
          target: 'https://dev.gomterview.com',
          changeOrigin: true,
        },
      },
    },
    resolve: {
      extensions: ['.ts', '.tsx', '.js', '.json'],
      alias: {
        // src 폴더를 '@' 별칭으로 설정
        '@': path.resolve(__dirname, 'src/'),
        '@components': path.resolve(__dirname, 'src/components/'),
        '@common': path.resolve(__dirname, 'src/components/common/'),
        '@foundation': path.resolve(__dirname, 'src/components/foundation/'),
        '@page': path.resolve(__dirname, 'src/page/'),
        '@constants': path.resolve(__dirname, 'src/constants/'),
        '@styles': path.resolve(__dirname, 'src/styles/'),
        '@assets': path.resolve(__dirname, 'src/assets/'),
        '@atoms': path.resolve(__dirname, 'src/atoms/'),
        '@hooks': path.resolve(__dirname, 'src/hooks/'),
        '@routes': path.resolve(__dirname, 'src/routes/'),
      },
    },

    plugins: [
      new HtmlWebpackPlugin({
        template: './public/index.html',
        filename: 'index.html',
        favicon: './public/favicon.ico',
      }),
      new webpack.HotModuleReplacementPlugin(),
      new CopyPlugin({
        patterns: [
          { from: 'public/mockServiceWorker.js', to: '' },
          { from: 'public/_headers', to: '' },
        ],
      }),
      new Dotenv({
        path: envPath,
      }),
    ],
    module: {
      rules: [
        {
          test: /\.(ts|tsx)$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
          },
        },
        {
          test: /\.(png|jpe?g|gif)$/i,
          loader: 'file-loader',
          options: {
            outputPath: 'assets/images',
          },
        },
      ],
    },
    ignoreWarnings: [/Critical dependency:/],
  };
};
```
#### vite.config.ts
```ts
import { defineConfig } from 'vite';  
import react from '@vitejs/plugin-react';  
import path from 'path';  
  
// https://vitejs.dev/config/  
export default defineConfig({  
  resolve: {  
    alias: {  
      '@common': path.resolve(__dirname, './src/components/common'),  
      '@foundation': path.resolve(__dirname, './src/components/foundation'),  
      '@components': path.resolve(__dirname, './src/components'),  
      '@page': path.resolve(__dirname, './src/page'),  
      '@constants': path.resolve(__dirname, './src/constants'),  
      '@styles': path.resolve(__dirname, './src/styles'),  
      '@assets': path.resolve(__dirname, './src/assets'),  
      '@atoms': path.resolve(__dirname, './src/atoms'),  
      '@hooks': path.resolve(__dirname, './src/hooks'),  
      '@routes': path.resolve(__dirname, './src/routes'),  
      '@': path.resolve(__dirname, './src'),  
    },  
  },  
  optimizeDeps: {  
    exclude: ['@ffmpeg/ffmpeg', '@ffmpeg/util'],  
  },  
  server: {  
    port: 3000,  
    headers: {  
      'Cross-Origin-Embedder-Policy': 'require-corp',  
      'Cross-Origin-Opener-Policy': 'same-origin',  
    },  
    proxy: {  
      '/api': {  
        target: 'https://dev.gomterview.com',  
        changeOrigin: true,  
      },  
    },  
  },  
  plugins: [react()],  
});
```

위와 같이 설정파일을 모두 이동시킨 후 프로젝트 빌드가 정상적으로 동작하는 것을 확인하고 다음 단계로 넘어갔습니다.
## 3. 코드 파일 이동
src 파일을 전부 복사해서 새로운 vite 프로젝트로 옮겼습니다. 
여기서 유의할 점은 webpack을 사용한 프로젝트는 public 디렉터리 안에 index.html 파일이 존재한다면, vite 프로젝트에서는 프로젝트의 root 디렉터리 안에 index.html이 존재하는 것 입니다.
그리고 vite 프로젝트의 진입점은 index.ts가 아닌 main.ts로 되어있으므로 이를 index.ts로 수정한 후 index.html에 있는 script의 주소도 변경해주었습니다.
## 4. 변경이 필요한 코드 수정
### env import 방식 수정
webpack 프로젝트에서는 `process.env.[env 변수명]` 형식으로 환경변수 파일의 내용을 가져옵니다.
하지만 vite는 `import.meta.env.[env 변수명]` 형식으로 환경변수를 가져와야합니다. 따라서 이에 맞게 코드를 변경했습니다.
### env 변수명 수정
vite에서는 일반 환경변수와 구분을 위해 환경변수 앞에 VITE_라는 접두사를 붙여야 합니다. 따라서 환경변수 이름도 수정했습니다.
# 마이그레이션 하면서 겪은 이슈
전체적인 마이그레이션 과정은 생각보다 순탄하게 진행되었는데요. 하지만 생각지도 못한 ffmpeg 모듈에서 이슈가 발생해서 이를 해결하는데 가장 많은 시간을 투자했습니다.
## ffmpeg 모듈이 로드되지 않음
곰터뷰 서비스에서는 사파리 지원을 위해 webm으로 촬영되는 영상을 모두 mp4로 인코딩하고 있습니다.
이를 위해 ffmpeg의 웹 어셈블리 버전인 ffmpeg.wasm을 사용하고 있는데요. vite로 마이그레이션을 진행한 후 ffmpeg 모듈이 정상적으로 다운로드는 인코딩이 수행되지 않는다는 문제가 발생했습니다. 
![ffmpeg 모듈 다운로드 요청](https://i.imgur.com/pQmMl0L.png)


가장 막막했던 점은 로직이 정상적으로 실행되지 않는데 ffmpeg에서 아무런 에러 메시지를 띄워주지 않는다는 것 입니다. 그래서 어쩔 수 없이 모듈을 로드하고 인코딩을 수행하는 함수에서 한줄 단위로 로그를 찍어보며 어디서 문제가 발생하는지 파악했습니다.
![mp4 인코딩을 수행하는 함수 내부](https://i.imgur.com/jiDjOut.png)

로그를 찍어본 결과 모듈을 다운로드 하는 곳에서는 문제가 없지만, 모듈을 load 하는 부분에서 문제가 발생한다는 것을 찾을 수 있었습니다. 도무지 감도 오지 않는 문제라서 정말 막막한 상황이었는데요. 기적적으로(?) 공식문서에서 봤던 내용을 기억해낼 수 있었습니다.
![ffmpeg.wasm 공식문서의 내용](https://i.imgur.com/2DqWNDD.png)
번들러로 vite를 사용하는 경우 모듈 umd가 아닌 esm 모듈을 주소를 사용해야 한다고 공식문서에 안내되어 있습니다.
위 내용에 따라 ffmpeg.wasm의 baseURL 주소를 esm으로 변경해서 모듈 로드 문제를 해결했습니다.
## typescript 에러 발생
![tsconfig target 이슈로 인한 타입 에러](https://i.imgur.com/y0xOfU8.png)
vite로 마이그레이션 후 프로덕션 빌드를 실행시켜보니 위와 같이 타입스크립트 에러가 발생했습니다.
그 이유는 react query 라이브러리 내부에서 private 클래스 멤버 변수를 위해 # 키워드를 사용하고 있는데 이는 ECMAScript 2015 이후부터 지원되는 문법입니다.
현재 곰터뷰 프로젝트 tsconfig.json의 target 설정은 es5로 되어있었기 때문에 이런 에러가 발생했던 것입니다.
따라서 target 설정을 ES2015로 올렸습니다. 
## cloudflare 빌드 실패
![동적 import에 대한 타입스크립트 에러](https://i.imgur.com/7MbVKPC.png)


곰터뷰에서는 개발 환경에서 쿠키를 사용한 토큰 발급을 위해 cookieGenerator라는 유틸을 사용하고 있습니다. 이는 개발 환경에서만 사용되는 코드라서 env 정보에 따라 동적 import를 사용해서 불러오고 있고, github에는 올리지 않고있습니다.
하지만 cloudflare에서 프로젝트 빌드 시 해당 파일이 존재하지 않아서 typescript 에러가 발생했습니다.

그런데 잠깐! 여기서 의문점이 있는데요. typescript 에러는 번들러와 상관이 없을텐데 왜 webpack을 사용할 때는 이런 문제가 없다가 vite로 마이그레이션한 후 문제가 발견되었을까요??
그건 바로 webpack을 사용하던 기존 프로젝트는 빌드시에 tsc로 타입 체크를 하지 않았기 때문입니다....! 
vite의 기본 설정에는 build 명령어에 자동으로 tsc가 포함되어 있어서 마이그레이션을 진행하면서 타입 검사를 하는 코드가 자동으로 추가되었고 이로 인해 문제를 발견하게 된 것입니다.

일단은 임시방편 해결책으로 webpack을 사용하던 시절처럼 빌드시에는 타입 검사를 하지 않도록 tsc를 제거해놓은 상태인데요. 동적 import시 타입 맞추기에 관한 내용은 해결 후 후속 포스팅으로 작성하겠습니다.
## 빌드 시간 비교
|  | webpack 프로덕션 빌드시간 | vite 프로덕션 빌드시간 | webpack 개발서버 빌드시간 | vite 개발서버 빌드시간 |
| ---- | ---- | ---- | ---- | ---- |
| 1 | 3481 ms | 2020 ms | 2656 ms | 116 ms |
| 2 | 3279 ms | 2120 ms | 2601 ms | 115 ms |
| 3 | 3327 ms | 2050 ms | 2625 ms | 118 ms |
| 4 | 3259 ms | 2040 ms | 2649 ms | 117 ms |
| 5 | 3090 ms | 2080 ms | 2520 ms | 116 ms |
프로뎍선 빌드시에는 vite는 개발 서버 빌드시에 사용했던 esbuild와 ESM 대신 rollup을 사용한 번들링 과정을 진행하기 때문에 웹팩을 사용할 때와 아주 큰 차이점은 없는 것을 볼 수 있습니다.
하지만 esbuild와 ESM을 사용하는 개발 서버 빌드시에는 기존 대비 약 20배정도 빨라진 것을 확인할 수 있었습니다.
# 참고 링크
- [Vite를 사용해야 하는 이유 | Vite](https://ko.vitejs.dev/guide/why.html)
- [javascript - Vite가 tsconfig.json과 tsconfig.node.json이라는 두 개의 TypeScript 구성 파일을 생성하는 이유는 무엇입니까? - 스택 오버플로](https://stackoverflow.com/questions/72027949/why-does-vite-create-two-typescript-config-files-tsconfig-json-and-tsconfig-nod)
- [Webpack → Vite: 번들러 마이그레이션 이야기](https://engineering.ab180.co/stories/webpack-to-vite)
- [Vite의 환경 변수와 모드 | Vite](https://ko.vitejs.dev/guide/env-and-mode.html)
- [Usage | ffmpeg.wasm](https://ffmpegwasm.netlify.app/docs/getting-started/usage)
- [ffmpeg.wasm/apps/react-vite-app/src/App.tsx at main · ffmpegwasm/ffmpeg.wasm](https://github.com/ffmpegwasm/ffmpeg.wasm/blob/main/apps/react-vite-app/src/App.tsx)
