---
date: 2025-07-19
title: tailwind v4와 최신 css 동향
excerpt:
category: 학습
tags:
  - tailwindCSS
thumbnail:
slug: /tailwind-v4
updated: 2025-09-01T00:11
---
# 최근들어 많이 발전한 CSS의 변화
- tailwind v3 -> v4의 변화를 보기에 앞서 css의 변화를 먼저 알고가야함
## 1. CSS @property 변수
> [!info]
> - 2024년 7월부터 baseline으로 채택되었음
> - Can I use 기준: 글로벌 지원 비율 약 **92.6%**
### 기존 CSS 변수의 문제점
- 타입 정의가 불가능해 모든 변수가 문자열로만 취급됨
- 트랜지션이나 애니메이션 적용 시 부드러운 값 변화가 불가능
```css
/* 기존 CSS 변수 방식 (부드러운 전환 불가능) */
.button {
  --my-color: hotpink;
  background-color: var(--my-color);
  transition: background-color 0.5s;
}

.button:hover {
  --my-color: lightseagreen; /* 즉각적인 색상 전환만 가능 */
}
```

### 달라진 CSS 변수 기능 (@property)
- 변수에 타입 지정이 가능해져 브라우저가 값의 유효성을 검사하고, 잘못된 값 입력 시 초기값으로 복구
- 타입 지정 (syntax)을 통해 커스텀 프로퍼티의 데이터 형식을 정의 가능 (e.g. \<color>, \<length>, \<number>)
- **초기값 (initial-value) 설정** 및 **상속 (inherits) 여부 지정**
- 트랜지션과 애니메이션 시 부드러운 보간(Interpolation)이 가능
```css
/* @property로 타입 지정 및 부드러운 전환 가능 */
@property --my-color {
  syntax: "<color>";
  inherits: false;
  initial-value: hotpink;
}

.button {
  background-color: var(--my-color);
  transition: --my-color 0.5s;
}

.button:hover {
  --my-color: lightseagreen; /* 부드러운 색상 전환 가능 */
}
```
## 2. 🚀CSS 중첩
> [!info]
> - 2023년 말부터 baseline으로 채택되었음
> - Can I use 기준: 글로벌 지원 비율 약 **91.23%**
### 중첩 기능이 생기기 전 css
- 과거 CSS에서는 선택자 중첩이 불가능했기 때문에, 계층적인 구조를 표현하려면 매번 전체 선택자를 반복해서 작성해야 했음.
- 이는 특히 컴포넌트 스타일이나 BEM 방식에서 가독성과 유지보수성을 저하시킴.
- Sass에서는 중첩 기능이 가능했기 때문에 .parent .child .label 같은 스타일을 구조적으로 표현할 수 있었음.

### 중첩 기능이란?
- 중첩이란, 부모 선택자 내부에 자식 선택자를 중첩해서 작성하는 방식.
- HTML 구조와 시각적으로 유사하게 CSS를 작성할 수 있어, 스타일의 계층 구조 파악이 쉬워지고, 관련 스타일을 그룹핑해서 관리할 수 있음.

```css
/* ❌ 중첩이 불가능했던 기존 CSS */
.card {
  padding: 1rem;
}

.card .title {
  font-weight: bold;
}

.card .content {
  color: #555;
}

/* ✅ Sass 중첩 문법 */
.card {
  padding: 1rem;

  .title {
    font-weight: bold;
  }

  .content {
    color: #555;
  }
}

```

### CSS 중첩의 네이티브 지원
- 이제 Sass 없이도 중첩된 구조를 CSS로 작성 가능.

```css
/* ✅ 네이티브 CSS 중첩 문법 (2024년 이후 지원) */
.card {
  padding: 1rem;

  .title {
    font-weight: bold;
  }

  .content {
    color: #555;
  }
}
```
## 3. 새로운 가상 클래스 셀렉터의 등장
### :is
> [!info]
> - 크롬브라우저 기준 2021년 1월에 baseline
> - Can I Use 기준 96.19% 지원률

`:is()` 사용법 & 예시
 
```css
/* :is() 적용 X */
article > p {
  margin: 1em 0;
}
article > blockquote {
  margin: 1em 0;
}

/* :is() 적용 */
article > :is(p, blockquote) {
  margin: 1em 0;
}
```
- 장점
	- 공통 부분 중복 제거 → 코드 간결
### :has()
> [!info]
> - 크롬브라우저 기준 2023년 12월에 baseline
> - Can I Use 기준 93.2% 지원률

`:has()` 사용법 & 예시

```css
/* 자식 버튼 키보드 포커스 기반 부모 스타일링 */
.card:has(button:focus-visible) {
  outline: 2px solid var(--color-primary);
}
```
- focus-within vs has(button:focus-visible)
	- focus-within: 자식에 포커스만 있으면 작동
	- :has()는 버튼이 keyboard 포커스일 때만 작동  ￼ ￼

```css
/* 형제 요소 관계 기반 스타일링 */
h1:has(+ h2) {
  margin-bottom: 0.25rem;
}
```
- h1의 다음 형제 요소가 h2인 경우 h1 스타일링
- `has` 없는 기존의 `h1 + h2 { ... }`는 h1 다음 형제 요소가 h2인 경우 h2를 스타일링 하는 것만 가능
### :is() + :has() 조합 예시

```css
:is(h1, h2, h3):has(+ :is(h2, h3, h4)) {
  margin-bottom: 0.25rem;
}
```
- :is()로 그룹화, :has()로 컨텍스트 조건을 동시에 적용하여 복잡한 로직을 단 한 줄의 CSS로 처리 가능  ￼ ￼
## 4. 🚀[컨테이너 쿼리](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_containment/Container_queries)
> [!info]
> - 크롬브라우저 기준 2022년 9월에 baseline
> - Can I Use 기준 92.9% 지원률

- **컨테이너 컨텍스트 지정**: 스타일을 적용할 부모 요소에 `container-type: size|inline-size|normal`을 선언하면, 해당 요소가 컨테이너로 인식
- **조건에 따라 스타일 지정**: 이후 `@container (min-width: 700px) { ... }` 규칙을 사용해 요소들의 내부 스타일을 부모 크기에 따라 동적으로 변경됨
```css
.card-wrapper {
  container-type: inline-size;
}

@container (min-width: 40rem) {
  .card {
    display: flex;
    gap: 1em;
  }
}
```
## 5. 🚀[Cascade Layers](https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Styling_basics/Cascade_layers)
> [!info]
> - 크롬브라우저 기준 2022년 3월에 baseline
> - Can I Use 기준 94.6% 지원률

@layer는 CSS 선택자 특이도나 선언 순서보다 상위 수준에서 스타일 우선순위를 제어할 수 있는 기능
### layer 등장으로 변화한 css 우선순위 체계
1. 중요도(!important)
2. 원본(author/user/브라우저)
3. **레이어 순서**
	- @layer로 지정된 스타일 블록은 레이어 선언 순서에 따라 적용. (후순위 레이어가 우선)
	- 동일 레이어 내부에서는 기존 css 규칙을 따라감
4. 선택자 특이도
5. 선언 순서
### layer 코드 예제
```css
/* 레이어 우선순위 설정 */
@layer reset, base, components, utilities, overrides;

/* reset 레이어 */
@layer reset {
  * { box-sizing: border-box; margin: 0; padding: 0; }
}

/* base 레이어 */
@layer base {
  body { font-family: sans-serif; color: #333; }
}

/* components 레이어 */
@layer components {
  .btn { background: blue; color: white; padding: 0.5rem 1rem; }
}

/* utilities 레이어 */
@layer utilities {
  .mt-4 { margin-top: 1rem; }
}

/* overrides 레이어 */
@layer overrides {
  .btn { background: green; } /* components보다 우선 적용됨 */
}
```
### 장점
- 코드 출처(리셋, 프레임워크, 컴포넌트, 유틸리티 등)에 따라 스타일 순서를 정의할 수 있음
- 개발자가 불필요하게 특이도를 높일 필요 없이 레이어로 우선순위 조정
- 외부 라이브러리와 기본 스타일 충돌 시 @layer로 분리된 관리 가능 
- 동일 레이어 이름을 사용해 여러 블록에서 스타일 추가/병합 가능
```css
/* src/components/button.css */
@layer components {
  .btn {
    background: blue;
  }
}

/* src/components/card.css */
@layer components {
  .card {
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  }
}
```
- 다른 파일에 있어도 layer 이름만 통일하면 지정된 순서에 맞게 우선순위 적용됨.
# Tailwind v3 -> v4
## Tailwind v3 -> v4 개발 편의성과 성능 향상
### 🚀Tailwind v3의 설치부터 빌드까지 동작 과정
#### [설정 과정](<[Install Tailwind CSS using PostCSS - Tailwind CSS](https://v3.tailwindcss.com/docs/installation/using-postcss)>)
1. `tailwindcss, postcss, autoprefixer`를 설치 ([devDependencies](https://stackoverflow.com/questions/74780955/tailwind-being-installed-as-dev-dependency-rather-than-dependency))
2. `postcss.config.js`에 `postcss, tailwindcss, autoprefixer`를 등록
    - postCSS란? → CSS를 AST로 파싱 후 플러그인 기반으로 변환해주는 도구
    - autoprefixer란? → CSS 속성에 필요한 벤더 접두사(-webkit-, -ms- 등)를 자동으로 추가해주는 postCSS 플러그인
3. `tailwind.config.js`에 tailwind 커스텀 설정을 작성
4. css 파일에서 @tailwind 지시문을 사용해서 레이어를 정의
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```
#### 빌드 시 동작 과정
1. Tailwind 플러그인(postcss 기반 파서)이 모든 가능한 유틸리티 클래스(예: `bg-blue-500, mt-4`)를 AST에 삽입
2. `@layer` 순서에 따라 레이어 블록이 PostCSS 단계에서 병합됨
3. [JIT](https://v2.tailwindcss.com/docs/just-in-time-mode)가 활성화되며 Tree-Shaking이 실행되면서 content 설정 파일을 분석, 실제 사용하는 클래스만 남음
4. autoprefixer가 실행되어 호환성 위해 벤더 프리픽스 추가
5. 최종 정적 CSS 파일이 생성되어 배포에 사용됨
### 🚀Tailwind v4의 설치부터 빌드까지 동작 과정
#### [설정 과정](https://tailwindcss.com/docs/installation/using-vite) (vite 기준)
1. `tailwindcss @tailwindcss/vite` 개발 종속성으로 설치
2. `vite.config.ts`에 tailwind 플러그인을 설정
```ts
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
export default defineConfig({
  plugins: [
    tailwindcss(),
  ],
})
```
3. css 파일에서 tailwind를 가져옴
```css
@import "tailwindcss";
```
#### 빌드 시 동작 과정
1. tailwind의 자체 제작 엔진 **Oxide**(코어 부분 [Lightning CSS](https://lightningcss.dev/) 사용)가 `@import "tailwindcss"` 부분을 분석해 핵심 스타일을 AST에 삽입
2. 자동 콘텐츠 검색 기반으로 content 설정이 없어도 `.gitignore`, 이미지, 바이너리 파일 등은 자동 제외하며, 실제 사용하는 클래스만 JIT로 분석해 포함
3. [Lightning CSS](https://lightningcss.dev/)가 내장되어 있어 별도 플러그인 없이도 CSS 병합과 벤더 프리픽스를 처리
4. 최종 정적 CSS 파일이 생성되어 배포에 사용됨
### 🚀Lightning CSS 엔진을 통한 성능 향상
|                                     | v3.4  | v4.0  | Improvement |
| ----------------------------------- | ----- | ----- | ----------- |
| Full build                          | 378ms | 100ms | 3.78x       |
| Incremental rebuild with new CSS    | 44ms  | 5ms   | 8.8x        |
| Incremental rebuild with no new CSS | 35ms  | 192µs | 182x        |
- 전체 빌드 시간 3.5배 단축
- 증분 빌드 시간 8배 단축
- 변경 없는 증분 빌드 시간 거의 즉시
## 최신 CSS가 반영된 Tailwind v4의 기능 살펴보기
### 🚀`tailwind.config.js` 대신 css 우선 설정
- `tailwind.config.js`가 필수가 아니고 css 파일에서 `@theme` 규칙을 사용해 테마 정의 가능
- 위에서 언급했던 것 처럼 css 변수에 `@property`를 통해 타입이 생기면서 css 변수 기반으로 유틸리티 클래스 생성 가능
#### `@theme` 키워드의 역할
- `@theme` 스코프 안에서 정의된 css 변수들은 tailwind 빌드 엔진에 의해 유틸리티 클래스로 변환됨
```css
@theme inline {
  --color-primary: var(--primary);
  --spacing-base: 1rem;
}
```
- [tailwind 공식문서의 namespace 규칙](https://tailwindcss.com/docs/theme#theme-variable-namespaces)을 참고해서 유틸리티 클래스를 생성하면 `tailwind.config.js`를 사용할 때 처럼 커스텀 유틸리티 정의 가능
#### css 기반 설정의 장점
런타임에서 변수를 가져오거나 동적으로 변경 가능
```js
let styles = getComputedStyle(document.documentElement);
let shadow = styles.getPropertyValue("--shadow-xl");
```
### 🚀동적 유틸리티 클래스
- tailwind v4부터 동적 유틸리티 클래스 생성이 가능해짐. 이전에는 왜 불가능했고, tailwind v4부터는 어떻게 가능해졌을까?
#### tailwind v3의 [Arbitrary values](https://v3.tailwindcss.com/docs/space?utm_source=chatgpt.com#arbitrary-values) 동작 과정
1. tailwind v3는 `tailwind.config.js`에서 사전에 정의된 값을 기반으로 `w-1, w-2` 등의 유틸리티 클래스가 생성됨
2. 단위 없는 `w-[17]`은 지원되지 않음
	- tailwind v3는 PostCSS 기반으로 정확한 CSS 값만 처리하기 때문에, `w-[17px], h-[4rem], bg-[#1da1f2]`처럼 단위 포함이 있어야 컴파일됨
3. 왜냐하면, PostCSS를 통해 빌드되는 시점에 문자열 그대로 유효한 CSS로 변환하기 때문에 단위가 포함돼야만 안전한 처리가 가능했음. PostCSS에서는 유효하지 않은 CSS를 빌드 시점에 제거함
#### tailwind v4의 동적 유틸리티 클래스 동작 과정
1. `--spacing`과 같은 값이 css 변수로 선언되어있음
2. tailwind 자체 엔진이 `w-17`과 같은 클래스 이름을 해석해서 아래와 같은 유틸리티 클래스를 생성함
```css
.w-17 {
    width: calc(var(--spacing) * 17);
}
```
3. 덕분에 사전 정의되지 않은 유틸리티 클래스도 사용 가능
#### tailwind v3에서도 v4 방식으로 유틸리티 클래스를 생성하면 되는거 아닌가?
- `--spacing` 변수 같은 CSS 변수는 `tailwind.config.js`에서 선언되었기 때문에 CSS에서 사용이 불가능함
- v3 시절의 CSS 변수는 `@property`가 지원되지 않아 모두 문자열로만 처리되었고 타입이 없기 때문에 `--spacing` 변수에 저장된 값이 유효하다는 것을 보장할 수 없음
### 🚀Cascade Layers 도입
- 위에서 설명했던 최신 css 기능인 layer가 도입됨
#### Tailwind v3의 레이어
- `@layer base, @layer components, @layer utilities`는 PostCSS 플러그인 차원에서 구현된 개념. 즉, 브라우저 관점에선 모두 “같은 권한의 스타일”
- @layer modal 등 새로운 레이어 이름을 HTML/CSS 파일에 추가해도, 브라우저는 인식하지 않고 기존 tailwind 레이어 뒤에 병합
- 여러 파일에서 동일한 레이어를 사용하거나 외부 CSS를 함께 사용할 때 스타일 충돌이나 우선순위 이슈가 발생
##### [충돌 이슈 발생 시나리오](https://www.linkedin.com/posts/david-codina-b7b015230_tailwind-v4-brings-native-cascade-layers-activity-7269822467915866113-6RG7/)
```css
/* src/styles/main.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

/* src/components/Modal/modal.css */
@layer modal {
  .modal { background: red; }
}
```
- 의도는 modal 레이어가 components나 utilities보다 나중에 적용되어야 하는데,
- v3 빌드 시엔 PostCSS 로직이 modal 레이어를 인정하지 않고, components 레이어 안으로 합쳐짐
- -> tailwind의 base(preflight) 스타일이 이 modal보다 우선 적용될 수 있는 구조적 오류가 발생
#### Tailwind v4의 Native Cascade Layers
- v4부터는 `@layer` 지시어를 네이티브 CSS 기능으로 전환
- `@layer base, components, utilities, modal` 등을 브라우저가 직접 인식, 정확한 CSS 우선순위를 자동으로 적용
- 아래와 같이 명시적으로 지정된 레이어 순서에 따라 우선순위가 적용됨
```css
@import "tailwindcss";
@import "./platte.css" layer(theme);
@import "./animation.css" layer(utilities);
```

>[!summary] 정리하자면
> “v3에서는 @layer가 빌드 후 일반 스타일로 평평하게 flatten 되었다면, v4에서는 계층 구조를 유지하며 브라우저가 이해할 수 있다”
### 🚀color-mix() 등 최신 색상 함수 활용
- v3에서는 `bg-blue-500/50` 같은 경우, 컴파일 타임에 미리 RGBA 값으로 `background-color: rgba(..., 0.5)` 형태로 결정
- v4부터는 color-mix()를 사용해 `background-color: color‑mix(in oklab, var(--color-blue-500) 50%, transparent);`형태로 런타임에 색상 혼합
#### color-mix()의 이점
1. css 변수 및 currentColor와 조합 가능

*css 변수를 사용해 투명도 조합*
```css
.bg-blue-500\/10 {
    background-color: color-mix(in oklab, var(--color-blue-500) 10%, transparent);
}
```

*currentColor와 조합해서 텍스트 색에 따라 배경을 반투명하게 조정*
```html
<button class="text-red-600 border border-current/50">
  Click me
</button>
```
2.  oklch 등의 색 공간 지원으로 자연스러운 색상 품질 제공
### 🚀컨테이너 쿼리 지원
- 위에서 설명한 컨테이너 쿼리가 tailwind에서 지원됨
- @container 클래스를 부모 요소에 지정하면 해당 요소가 컨테이너 쿼리 기준이 됨.
- 이후 자식 요소에 @sm:, @lg: 등의 접두사를 붙여 컨테이너의 크기 조건에 따라 스타일을 적용할 수 있음.

*컨테이너 쿼리 동작 예시*
```html
<div class="@container">
  <div class="flex flex-col @md:flex-row">
    <!-- 평소엔 세로, container 너비가 md(약 28rem)이 넘으면 가로 정렬 -->
  </div>
</div>
```

*여러 컨테이너가 동시에 동작하는 경우 명명된 컨테이너 사용*
```css
<div class="@container/main"> … 
  <p class="@lg/main:text-xl">…</p>
</div>
```
### 🚀드디어 지원되는 not 의사클래스
- :not() 의사클래스를 활용하여, 특정 조건이 아닌 경우에 스타일 적용이 가능
```html
<button class="not-hover:opacity-75">
  버튼
</button>
```

## Tailwind는 왜 OKLCH 색상 프로파일을 채택했을까?
### oklch(L C H / a) 색상 포맷
> [!quote]
> - `L`은 눈에 보이는 밝기(`0`-`1`)를 의미합니다. 여기서 “눈에 보이는”라는 표현은, `hsl()`의 `L`과 달리 사람이 느끼기에 일관된 밝기를 유지한다는 뜻입니다.
>- `C`는 채도를 나타내며, 무채색(회색)부터 가장 선명한 색까지의 범위를 가집니다.
>- `H`는 색상의 각도이며, `0`도부터 `360`도까지의 값을 가집니다.
>- `a`는 불투명도를 나타내며, `0`부터 `1` 또는 `0%`부터 `100%` 사이의 값을 사용할 수 있습니다.
>
>출처: [Medium](https://siosio3103.medium.com/%EC%99%9C-%EC%9A%B0%EB%A6%AC%EB%8A%94-rgb%EC%99%80-hsl%EC%97%90%EC%84%9C-oklch%EB%A1%9C-%EC%A0%84%ED%99%98%ED%96%88%EC%9D%84%EA%B9%8C%EC%9A%94-329816984db5)

### oklch() 색상 포맷의 장점
#### 더 자연스러운 밝기
OKLCH의 명도(L)는 인간의 시각 인지와 거의 일치 → HSL보다 의도한 밝기 조절이 가능
![[tailwind v4와 최신 css 동향-2025-07-21-1.png]]
##### HSL의 문제점
1. **색상별 최대 채도 왜곡**
    - HSL은 모든 색이 채도 100%까지 표현 가능하다고 가정하지만,
        현실에선 사람 눈이나 디스플레이가 특정 색상에서는 높은 채도를 표현하기 어려움.
    - 예: 노란색은 같은 채도에서도 더 밝게 느껴지고, 파란색은 어둡게 느껴짐.
2. **밝기(Lightness)의 왜곡**
    - L 값이 동일하더라도 색상에 따라 실제 밝기는 달라짐.
    - 이미지 예시처럼, HSL에서는 L=50%로 설정해도 파랑은 어둡고 노랑은 밝음.
    - 이는 접근성 문제를 야기하고, 예상치 못한 색상 변화로 디자인 일관성을 해침
3. **수정/자동화 어려움**
    - 색상 간의 변화가 비선형적으로 왜곡되어 있어서, darken(), lighten() 등의 조작 결과가 예측과 다르게 나오는 경우가 많음.
##### OKLCH는?
1. **인간 시각과 일치하는 밝기**
    - L 값이 실제로 보이는 밝기와 거의 일치하도록 설계됨.
    - 즉, L=0.5는 항상 “중간 밝기”로 체감됨 → 디자인 일관성 & 접근성 향상
2. **채도 표현의 현실성**
    - 색상마다 가질 수 있는 최대 채도가 실제 시각 인지 모델에 맞게 제한됨
    - 색상 왜곡 없이 명확하고 예측 가능한 팔레트 생성 가능
3. **자동화와 조작에 유리**
    - 색상 사이의 차이가 논리적으로 수치화되므로, 팔레트 생성 시 공식으로 계산 가능
    - 디자이너가 일일이 색을 고르지 않아도, 수학적으로 명도/채도 유지하며 팔레트 구성 가능

![[tailwind v4와 최신 css 동향-2025-07-21-2.png]]
#### P3 색공간 지원
![[tailwind v4와 최신 css 동향-2025-07-21.png]]
- sRGB가 표현하지 못하는 광색역(P3)의 선명한 색들도 OKLCH로 지정 가능. 
- 최신 애플 기기 등은 P3 색영역을 지원하는데, OKLCH를 사용하면 이러한 기기에서 더 풍부한 색 표현이 가능
- Tailwind v4의 팔레트 전환 또한 이러한 현대 디스플레이의 능력을 활용하기 위한 것
# 마무리
- native css 기능이 발전함에 따라서 tailwind v4도 함께 발전했다.
- tailwind v4는 모던 웹을 타겟으로 하기 때문에 구형 브라우저를 지원하려면 폴리필 설정을 해야한다.
	- Chrome 111+, Safari 16.4+, Firefox 128+ 이상 버전의 모던 웹만 가능하다.
	- 글로벌 지원 90% 이상 커버로 추정된다.
- JS 기반 config에서 벗어나 CSS 내부에서 정의하는 구조로 바뀐 점이 정말 마음에 든다. CSS가 CSS답게 변한 것 같다.
- 요즘 드는 생각으로는 Native다운게 가장 좋다는 생각을 갖고 있는데, tailwindCSS의 이런 발전 방향이 마음에 든다.
	- 특히, 런타임에 무언가를 하는것이 아니라 컴파일 단계가 따로 존재해서 개발 편의성을 지원하면서도 native 웹과 통합되는 방법이 마음에 든다.
- react나 혹은 웹 프레임워크도 런타임의 복잡도가 너무 높다고 생각하는데, 컴파일 과정이 도입되거나 혹은 native웹과 통합하기에 친화적인 프레임워크가 나왔으면 좋겠다.
- 웹이 웹다워지면 바램이 개인적인 의견
- 이런 흐름에서 컴파일되는 웹 프레임워크인 스벨트가 궁금해진다.
# 참고 자료
-  [Install Tailwind CSS v3 using PostCSS - Tailwind CSS](https://v3.tailwindcss.com/docs/installation/using-postcss)
- [Just-in-Time Mode - Tailwind CSS](https://v2.tailwindcss.com/docs/just-in-time-mode)
- [reactjs - Tailwind being installed as dev dependency rather than dependency - Stack Overflow](https://stackoverflow.com/questions/74780955/tailwind-being-installed-as-dev-dependency-rather-than-dependency)
- [Installing Tailwind CSS v4 with Vite - Tailwind CSS](https://tailwindcss.com/docs/installation/using-vite)
- [Open-sourcing our progress on Tailwind CSS v4.0 - Tailwind CSS](https://tailwindcss.com/blog/tailwindcss-v4-alpha)
- [Theme variables - Core concepts - Tailwind CSS](https://tailwindcss.com/docs/theme#theme-variable-namespaces)
- [Arbitrary values](https://v3.tailwindcss.com/docs/space?utm_source=chatgpt.com#arbitrary-values)
- [Tailwind: v4 Brings Native Cascade Layers \| David Codina](https://www.linkedin.com/posts/david-codina-b7b015230_tailwind-v4-brings-native-cascade-layers-activity-7269822467915866113-6RG7/)
- [Hello, CSS Cascade Layers](https://ishadeed.com/article/cascade-layers/)
- [@layer - CSS \| MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/%40layer)
- [Lightning CSS](https://lightningcss.dev/)
- [[번역] tailwind CSS v4.0: 최신 웹 개발의 완벽한 게임 체인저 | by 조영제 | Jun, 2025 | Medium](https://siosio3103.medium.com/tailwind-css-v4-0-%EC%B5%9C%EC%8B%A0-%EC%9B%B9-%EA%B0%9C%EB%B0%9C%EC%9D%98-%EC%99%84%EB%B2%BD%ED%95%9C-%EA%B2%8C%EC%9E%84-%EC%B2%B4%EC%9D%B8%EC%A0%80-c51c886efaa5)
- [왜 우리는 RGB와 HSL에서 OKLCH로 전환했을까요?. 원문… | by 조영제 | Medium](https://siosio3103.medium.com/%EC%99%9C-%EC%9A%B0%EB%A6%AC%EB%8A%94-rgb%EC%99%80-hsl%EC%97%90%EC%84%9C-oklch%EB%A1%9C-%EC%A0%84%ED%99%98%ED%96%88%EC%9D%84%EA%B9%8C%EC%9A%94-329816984db5)