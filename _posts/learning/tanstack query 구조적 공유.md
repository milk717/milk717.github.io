---
date: 2025-08-19
title: TanStack Query의 구조적 공유와 React 리랜더링에 대한 학습과 관찰
excerpt: TanStack Query의 구조적 공유 동작을 분석하고, 컨테이너 참조 변화로 인한 불필요한 리렌더를 관찰했습니다. React Profiler 실험을 바탕으로 React.memo, select, 단건 쿼리 등 실제로 쓸 수 있는 최적화 방법과 장단점을 정리했습니다.
category: 학습
tags:
  - tanstack-query
thumbnail: https://i.imgur.com/Fm8Si32.png
slug: tanstack-query-structural-sharing
updated: 2025-08-26T00:13
---
TanStack Query를 쓰다가 문득 이런 의문이 들었습니다. 

> "서버에서 받아오는 데이터는 매번 새로운 JSON 객체로 내려와 참조값이 매번 달라질텐데, 이러면 TanStack Query가 리페치할 때마다 모든 하위 컴포넌트가 리렌더링되는 걸까??"

이 글은 이런 의문을 해소하기 위해 공부하고 테스트했던 과정을 정리한 기록입니다.
# Tanstack query의 구조적 공유

TanStack Query는 내용이 같으면 참조 동일성을 유지하도록 설계되어 있었습니다. 참조 동일성이란 무엇일까요?
아래 예시를 통해 설명하겠습니다.

> [!note]
> JS에서는 메모리 주소를 직접 볼 수 없지만, 설명 편의를 위해 임시로 메모리 주소를 표기했습니다.

```json
[
  { "id": 1, "title": "채팅 1" }, //@memory_address: 1
  { "id": 2, "title": "채팅 2" }, //@memory_address: 2
]
```

만약 id가 1인 채팅의 title이 `채팅 1` -> `채팅 123`으로 바뀌는 경우,

```diff
[
-    { "id": 1, "title": "채팅 1" }, //@memory_address: 1
+    { "id": 1, "title": "채팅 123" }, //@memory_address: 3
     { "id": 2, "title": "채팅 2" }, //@memory_address: 2
]
```

위 예시에서 `id:2` 항목은 내용이 바뀌지 않아 이전 참조값이 유지됩니다.
반면 `id:1` 항목은 내용이 바뀌어 새 참조로 교체됩니다.
TanStack Query는 값이 동일할 때 기존 객체의 참조를 재사용하는 구조적 공유로 내부 캐시가 최적화되어 있습니다.

# 실제 랜더링 살펴보기

그렇다면, 실제 랜더링이 수행될 때도 리스트에서 변경된 부분만 리랜더링이 발생할까요? 채팅방 목록을 조회하는 간단한 api를 예시로 들어 랜더링 동작을 관찰해보겠습니다.

```tsx
// 사용된 API 응답 구조
[
  // 리패치가 발생할 때 마다 id:1의 채팅방의 이름이 변경되는 동작으로 구현됨.
  { "id": 1, "title": "채팅 1" },
  { "id": 2, "title": "채팅 2" },
]

// 컴포넌트 랜더링 코드
function ChatList() {
  const { data: chatList } = useGetChatsSuspenseQuery(undefined, { refetchInterval: 500 });

  return (
    <div>
      <h3>채팅 목록</h3>
      <div className='flex flex-col gap-2 p-2 border max-h-70 overflow-y-auto'>
        {chatList.map((chat) => (
          <ChatItem key={chat.id} chat={chat} />
        ))}
      </div>
    </div>
  );
}

type Props = {
  chat: ChatResponseDto;
};

function ChatItem({ chat }: Props) {
  return <div className='flex flex-col gap-2 rounded border p-2'>{chat.title}</div>;
}
```

채팅방 목록을 조회하는 간단한 컴포넌트입니다. `refetchInterval: 500`을 사용해 0.5초마다 API가 리페치되도록 설정했습니다. TanStack Query의 구조적 공유에 따르면, `id:1` 채팅방만 리렌더링되고 `id:2` 채팅방은 리렌더링되지 않아야 합니다.

![](https://i.imgur.com/sMQNXcI.gif)


예상과 달리 React DevTools로 컴포넌트 리렌더링을 시각적으로 확인해보니, 리페치가 발생할 때마다 모든 `ChatItem`이 리렌더링되는 것을 확인했습니다.

왜 그럴까요? 
바로 `id:1`을 제외한 항목들은 각 아이템의 참조는 유지되지만, 상위의 chatList 배열 자체는 새 객체이기 때문인데요.

TanStack Query의 구조적 비교를 수행하는 [replaceEqualDeep](https://github.com/TanStack/query/blob/b6516bd25edcc67dfaced09412f52c9660386a9b/packages/query-core/src/utils.ts#L253-L292)함수를 살펴보겠습니다. 
이 함수는 **객체/배열일 때** 하위 항목을 재귀적으로 비교해서 가능한 서브트리를 재사용하고, 변경된 부분만 새로 만들어 새 컨테이너에 조합합니다.
그 결과 동일한 내용의 하위 노드는 이전 참조를 유지하더라도 컨테이너 자체는 새로 생성되어 주소가 달라집니다.

```ts
/**
 * This function returns `a` if `b` is deeply equal.
 * If not, it will replace any deeply equal children of `b` with those of `a`.
 * This can be used for structural sharing between JSON values for example.
 */
export function replaceEqualDeep<T>(a: unknown, b: T): T
export function replaceEqualDeep(a: any, b: any): any {
  if (a === b) {
    return a
  }

  const array = isPlainArray(a) && isPlainArray(b)

  if (array || (isPlainObject(a) && isPlainObject(b))) {
    const aItems = array ? a : Object.keys(a)
    const aSize = aItems.length
    const bItems = array ? b : Object.keys(b)
    const bSize = bItems.length
    const copy: any = array ? [] : {}  // copy를 생성하기 때문에 참조 달라짐
    const aItemsSet = new Set(aItems)

    let equalItems = 0

    for (let i = 0; i < bSize; i++) {
      const key = array ? i : bItems[i]
      if (
        ((!array && aItemsSet.has(key)) || array) &&
        a[key] === undefined &&
        b[key] === undefined
      ) {
        copy[key] = undefined
        equalItems++
      } else {
        copy[key] = replaceEqualDeep(a[key], b[key])
        if (copy[key] === a[key] && a[key] !== undefined) {
          equalItems++
        }
      }
    }

    return aSize === bSize && equalItems === aSize ? a : copy
  }

  return b
}
```

이로 인해 ChatList가 리렌더되고, React에서 부모가 리렌더될 경우 React.memo 등 별도의 최적화가 적용되어 있지 않으면 자식 컴포넌트들이 모두 다시 렌더됩니다. 결과적으로 모든 ChatItem 컴포넌트에 리랜더링이 발생합니다.

## 그렇다면 구조적 공유가 소용 없는거 아닌가?

위 동작을 보면 구조적 공유의 효과가 없는 것처럼 느껴질 수 있습니다. 하지만 **구조적 공유는 여전히 중요**합니다. 구조적 공유가 있기에 변경된 서브트리만 새 참조를 가지도록 하고, React.memo나 select 같은 수단으로 그 이점을 실제 렌더링 최적화로 연결할 수 있습니다. 구조적 공유가 없다면 모든 항목이 무조건 새 객체가 되어 어떤 방어도 불가능했을 것입니다.
### React.Memo를 사용한 리랜더링 최적화

```tsx
function ChatList() {
  const { data: chatList } = useGetChatsSuspenseQuery(undefined, { refetchInterval: 500 });

  return (
    <div>
      <h3>채팅 목록</h3>
      <div className='flex flex-col gap-2 p-2 border max-h-70 overflow-y-auto'>
        {chatList.map((chat) => (
          <ChatMemo key={chat.id} chat={chat} />
        ))}
      </div>
    </div>
  );
}

type Props = {
  chat: ChatResponseDto;
};

const ChatMemo = React.memo(function Chat({ chat }: Props) {
  return <div className='flex flex-col gap-2 rounded border p-2'>{chat.title}</div>;
});
```

ChatItem을 React.memo로 감싸면, 부모(ChatList)가 리렌더되더라도 **자식은 전달된 props의 얕은 비교 결과가 같을 때만** 렌더를 건너뜁니다. 구조적 공유 덕분에 변경되지 않은 항목의 참조는 유지되므로, 실제로는 `id:1`처럼 참조가 바뀐 항목만 리렌더됩니다.

![](https://i.imgur.com/q2jmLNb.gif)

위 이미지는 ChatItem을 React.memo로 감쌌을 때의 동작입니다. ChatList가 리렌더되더라도 props가 동일한 항목들은 렌더를 건너뛰고, id:1처럼 props가 바뀐 항목만 다시 렌더링됩니다.

>[!hint] 하지만 저는 메모를 그다지 선호하지 않는데요. — 이유는 아래에서.
### select를 사용한 선택적 구독

```tsx
function ChatList() {
  const { data: chatList } = useGetChatsSuspenseQuery(undefined, {
    select: (list) => list.map((c) => c.id),
  });

  return (
    <div className='p-4'>
      <h3>채팅 목록 (select)</h3>
      <div className='flex flex-col gap-2 p-2 border max-h-70 overflow-y-auto'>
        {/* 부모는 ids만 계산해서 넘김 */}
        {chatList.map((id) => (
          <ChatBySelect key={id} id={id} />
        ))}
      </div>
    </div>
  );
}

type Props = {
  chat: ChatResponseDto;
};

/**
 * ChatBySelect: 자식 내부에서 useGetChatsSuspenseQuery의 select로 자기 항목만 구독
 * - select는 원본 객체를 그대로 반환해야 참조 보존의 이점이 있다.
 */
function ChatBySelect({ id, render }: { id: number; render: (key: string) => React.ReactNode }) {
  const { data: chat } = useGetChatsSuspenseQuery(undefined, {
    select: (list) => list.find((c) => c.id === id),
  });

  if (!chat) return null;
  return <div className='flex flex-col gap-2 rounded border p-2'>{chat.title}</div>;
}
```

select를 사용하면 ChatList는 id 목록만 구독하고, 자식 컴포넌트(ChatBySelect)는 자신이 사용하는 항목만 select로 구독하도록 구성할 수 있습니다. 

![](https://i.imgur.com/daDiwuc.gif)

React.Memo를 사용했던 예시와 다르게 부모 컴포넌트에서도 리렌더링이 발생하지 않는 것을 확인할 수 있습니다. 왜냐하면 chatList 배열 자체의 참조가 렌더 전후에 동일하게 유지되기 때문이죠. 그 결과 자식 컴포넌트는 변경된 항목만 감지해 다시 렌더링하므로, 이 경우에는 `id:1`인 채팅 항목만 리렌더링됩니다.

## 각각의 성능을 비교해 볼까요? 

100개, 50000개의 chat item을 불러와서  React Profiler로 렌더링 속도를 측정해 보았습니다. 결과 원시 데이터는 아래 이미지와 같습니다.

![랜더링 속도 측정 RAW 데이터](https://i.imgur.com/9dE96B9.png)

이 데이터를 바탕으로 생성한 차트로 현상을 분석하겠습니다.

### 단일 item 랜더링 비교

![단일 item 랜더링 시간 비교](https://i.imgur.com/Fm8Si32.png)
단일 item 관점에서는 **아무것도 하지 않음 < React.Memo 적용 < select 사용** 순으로 평균 렌더 시간이 길어지는 것을 확인할 수 있었습니다리스트 크기가 100개에서 50k로 늘어나면 차이가 더 확연히 드러났습니다.

왜냐하면 memo는 props 참조를 얕게 비교하는 비용이 추가로 들고, select는 `find()` 같은 탐색을 수행하므로 아이템 수에 비례한 추가 비용이 발생합니다.
### 전체 리스트 랜더링 비교

![전체 리스트 랜더링 시간 비교](https://i.imgur.com/KVWM5KS.png)
전체 리스트 관점에서는 다른 결과를 확인할 수 있었습니다.
#### size: 100
select < memo < nothing 순으로 전체 소요 시간이 작았습니다.

이유는 select의 경우 부모는 리랜더되지 않고 변경된 자식 컴포넌트에서 100개 정도의 `find()` 비용이 발생합니다. 이 비용이 memo로 인한 비교 비용과 부모 리렌더 영향을 합친 비용보다 작게 작용했기 때문이죠.

#### size: 50k
단, 항목이 매우 많은(5만개 정도)인 경우 select가 월등히 느려진 것을 확인할 수 있었는데요. 이는 find() 비용이 데이터 수에 따라 급격히 커졌기 때문입니다. 하지만 마운트 시점을 제외하면 상황이 달라졌습니다. 초기 마운트 시에는 item의 개수의 제곱만큼 즉 O(N^2)의 시간복잡도가 소요되어 비용이 크게 들어가지만, 리랜더링 단계에서는 변경된 부분만 반영되므로 상대적으로 저렴해집니다. 

## 그럼 언제 memo를 쓰고, 언제 select를 쓸까?

React.memo만으로는 부모 컴포넌트의 리렌더링을 막을 수 없습니다. 부모가 리렌더되면 기본적으로 자식들도 다시 평가되며, 이때 자식이 React.memo로 감싸져 있고 전달된 props의 **참조가 동일할 때에만** 렌더를 건너뛸 수 있습니다.
부모가 리랜더링될 때 자식의 memo는 생각보다 깨지기 쉽습니다. props 스프래드, JSX children 전달, 콜백 함수 등을 안정화하지 않은 경우이죠. 따라서 props의 참조 안정화를 신경 써야 합니다.

반면 select를 사용하면 구독 범위를 item 단위로 좁혀 부모가 아예 리랜더되지 않도록 할 수 있기 때문에 부모 리렌더로 인한 하위 트리의 사이드 이펙트를 원천적으로 줄일 수 있습니다. 다만, 앞서 언급했듯이 select는 항목을 찾는 등의 비용이 추가될 수 있으므로 트레이드오프를 고려해야 합니다.

- **React.memo**
    - 장점: 얕은 비교 비용이 작고 구현이 간단합니다.
    - 단점: 부모가 넘기는 props를 안정화해야 해서 유지보수 복잡도가 올라갑니다.
- **select**
    - 장점: 구독 범위를 축소해 부모 레벨의 불필요한 리렌더를 피합니다.
    - 단점: 검색/변환 비용(예: find, map 생성 등)이 발생할 수 있습니다.

만약 서버 응답을 정규화해서 저장하면, select의 검색 비용을 O(1)으로 크게 줄일 수 있어 더 효율적으로 처리할 수 있겠죠. 이런 이유로 api 응답이 obejct인 경우 select를 사용하는 방식이 더 유용합니다.
### object의 경우
```tsx
/**
 * 서버 응답 가정
 */
type ServerResponse = {
  id: number;
  title: string;
  user: {
    id: number;
    name: string;
  };
};

function ChatMetaInfoWidget({ id }: { id: number }) {
  return (
    <section className='chat-meta-widget'>
      <ChatTitle id={id} />
      <ChatParticipants id={id} />
    </section>
  );
}

/**
 * 자식 1: 제목만 구독
 * - select로 title만 골라서 구독 -> title이 바뀔 때만 리렌더
 */
function ChatTitle({ id }: { id: number }) {
  const { data: title } = useGetChatMetaByIdSuspenseQuery(
    { id },
    {
      select: (chat) => chat.title,
    },
  );

  return <h3>{title}</h3>;
}

/**
 * 자식 2: 참여자 이름
 * - select로 user.name만 골라서 구독 -> user.name이 바뀔 때만 리렌더
 */
function ChatParticipants({ id }: { id: number }) {
  const { data: user } = useGetChatMetaByIdSuspenseQuery(
    { id },
    {
      select: (chat) => chat.user,
    },
  );

  return <div>{user.name}</div>;
}
```
위 예시처럼 부모가 서버 데이터를 불러와서 직접 props로 내려주는 구조였다면, 제목 하나만 바뀌어도 부모가 리렌더되며 모든 하위 컴포넌트가 다시 평가됩니다. React.memo로 자식을 감싸면 일부 방어는 되지만, 그럴 경우 모든 하위 컴포넌트에 대해 메모를 적용하거나 전달되는 props를 꼼꼼히 안정화해줘야 하므로 코드 복잡도가 크게 올라갑니다.

반면 select를 사용해 자식이 필요한 필드만 구독하게 구성하면, 제목 변경은 ChatTitle만, 이름 변경은 ChatParticipants만 리렌더되도록 범위를 축소할 수 있습니다.

>[!summary] 정리하자면
>React.memo는 **얕은 비교 비용 + 유지보수 비용**을 치르며 얻는 최적화입니다. 반면 select는 구독 범위를 축소해 부모 레벨의 불필요한 리렌더를 피하는 전략입니다.
# 랜더링 최적화는 꼭 해야할까?
결론부터 말하면, **리랜더링 자체는 나쁜 것이 아니다**라고 생각합니다.

컴포넌트가 리렌더된다는 건 단지 컴포넌트 함수가 다시 실행되는 것일 뿐이고, 실제 DOM 변경은 가상돔을 사용해 실제 변경된 부분만 반영됩니다. 문제는 리랜더링 자체가 아니라 **한 번의 렌더가 느려서 프레임을 지연시키는 경우**입니다. 즉, “자주 렌더되더라도 괜찮게” 설계하는 것이 더 올바른 방향이라고 생각합니다.

또한 대부분의 경우 섣부른 최적화는 독이 됩니다.  [LABjs](https://reacttraining.com/blog/react-inline-functions-and-performance#premature-optimization-is-the-root-of-all-evil)의 사례처럼 최적화가 오히려 성능 문제를 일으키는 경우도 있습니다. 측정 없이 최적화하면 성능이 개선되는지조차 알기 어렵고, 오히려 악영향을 줄 수 있습니다.

# 그럼 언제 최적화를 하면 좋을까?

## Performance로 느린 랜더링 확인하기

브라우저 Performance 탭으로 렌더링 시간을 측정하세요. 60fps 기준 한 프레임은 약 **16.7ms**입니다. 만약 한 프레임이 16.7ms를 꾸준히 넘는다면 “사용자가 체감하는 느린 렌더링”입니다.

이때는 컴포넌트 함수가 느려서 발생한 문제인지, 아니면 레이아웃/스타일/페인트 등 브라우저 렌더 단계의 병목인지를 먼저 구분해야 합니다.

## 구조적 개선을 먼저 시도하기

Performance에서 병목이 자주 발생하는 지점이 나왔어도 memo나 select 같은 기법을 바로 도입하지 마세요. 단순히 구조를 바꾸는 것 만으로도 근본 원인이 해결될 수 있습니다.

- 컴포넌트 분리: 무거운 연산이 있는 부분을 별도의 컴포넌트로 분리해서 리랜더 최적화
- 쿼리 키/캐시 재설계: 불필요한 invalidate 방지

이런 구조적 개선으로 문제가 풀리면 코드도 깔끔해지고 유지보수 비용도 늘리지 않으면서 성능 문제를 해결할 수 있습니다.

## React Profiler로 React 컴포넌트 랜더링 시간 확인하기
구조적 개선 후에도 리랜더링이 병목이면 React Profiler를 켜서 어떤 컴포넌트가 render에 시간을 많이 쓰는지 확인하세요. React Profiler를 통해 컴포넌트의 리랜더링 횟수와 시간을 확인할 수 있습니다.

여기서 중요한 점은 브라우저의 Performance로 확인하는 것은 실제 DOM에 반영되는 비용이고, React Profiler를 통해 확인하는 것은 React 내부의 render/commit 단계입니다. 즉 "컴포넌트 함수가 실행되는 것"에 대한 성능 측정이고 DOM 반영과 다른 의미입니다.
# 마무리
TanStack Query를 쓰다가 든 의문에서 시작해 공부를 진행하다 보니, 구조적 공유부터 React 리렌더링 최적화 방법, 그리고 언제 최적화를 해야 하는지까지 정리할 수 있었습니다. 학습하다보니 개인적으로 한 가지 판단이 들었는데요. 바로 **“리렌더링 횟수 자체를 줄이는 것”은 우선순위가 높지 않다** 라는 것입니다.

나쁜 성능은 나중에 개선할 수 있지만, **구조적인 결함 때문에 발생한 성능 문제는 나중에 고치기 어렵다**고 느꼈습니다. 그래서 개발할 때는 세세한 최적화에 매몰되기보다 전체 구조와 설계를 먼저 단단하게 만드는 것이 더 중요하다고 생각합니다.

물론 상황에 따라 다릅니다만, 제 기준은 다음과 같습니다.
- **성능 개선은 실제 문제가 있을 때 하자.** 측정 없이 미리 손대면 불필요한 복잡도만 쌓인다.
- **구조 문제를 먼저 고치자.** 컴포넌트를 잘 분리하고 합치는 것은 설계 수준의 문제라서, 구조가 잘못되면 어떤 미세 최적화도 근본적 해결이 되지 않는다.
- 그래도 여전히 느리다면 select, React.memo, API 응답 정규화 같은 방법을 쓰자.
 
긴 글 읽어주셔서 감사합니다. 궁금한 점이나 피드백은 언제든지 환영합니다.