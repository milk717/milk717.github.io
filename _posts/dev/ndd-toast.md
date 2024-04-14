---
date: 2023-12-06
title: console.log처럼 쓸 수 있는 toast 만들기
excerpt: react-toastify 라이브러리의 내부 코드를 분석해보며 console.log처럼 사용할 수 있는 토스트를 만드는 과정입니다.
category: 개발
tags:
  - 곰터뷰
  - 네이버-부스트캠프
  - NDD
  - 프로젝트
thumbnail: https://i.imgur.com/ks5ODiY.png
---

곰터뷰 서비스에서는 좀 더 나은 사용자 경험을 위해 토스트 컴포넌트를 도입하기로 결정했습니다.
라이브러리를 사용해서 토스트를 도입할 수도 있었지만, 토스트를 구현해보는 것은 이전부터 정말 해보고싶었던 작업이라서 직접 구현하게 되었습니다. 

# 어떤 토스트를 구현할 것인가?
토스트를 구현하기에 앞서 제가 생각하는 토스트의 정의란 다음과 같습니다.

- 토스트는 로그를 출력하듯이 간단한 문자열만 파라미터로 넘기더라도 호출할 수 있어야 합니다.
- 토스트는 다른 DOM 요소에 관계 없이 일정한 위치에 랜더링돼야 합니다.
- 토스트는 위치에 제약 없이 모든 곳에서 호출할 수 있어야 합니다. 만약 토스트가 훅으로 구성되어 있다면 컴포넌트나 훅 내부에서만 호출할 수 있겠죠. `console.log`를 호출할 수 있는 곳이라면 토스트 또한 호출할 수 있어야 합니다.

1번, 2번 조건을 만족시키는 것은 함수의 파라미터와 css만 조금 조정하면 되니 그다지 어렵지 않습니다.
하지만 3번 조건은 좀 까다로운데요.
토스트도 결국 내부를 보면 컴포넌트인데, 컴포넌트의 랜더링을 컴포넌트나 훅이 아닌 곳에서 제어할 수 있어야 하기 때문이죠. 그래서 이를 구현하기 위해 아래와 같은 구조로 토스트를 설계했습니다.
# 토스트의 구조
![토스트를 console.log처럼 사용하기 위해 eventManger 도입](https://i.imgur.com/zUQFwcE.png)
ToastContainer와 ToastItem은 그냥 컴포넌트간 부모 자식 관계라서 익숙하지만 eventManger가 약간 생소할텐데요. eventManger를 도입한 이유는 사용처와 상관 없이 `toast.info("토스트의 내용")`과 같은 문법으로 화면에 랜더링되는 요소를 관리하기 위함입니다.

ToastContainer에서 토스트의 추가, 삭제에 대한 이벤트를 구독하고 있기 때문에 프로젝트의 어느 곳에서든 toast 이벤트 dispatch 함수를 실행해서 UI를 제어할 수 있게 되는것이죠.
## EventManger
```ts
import { EventManager } from '@foundation/Toast/type';  
  
export const eventManager: EventManager = {  
  list: new Map(), // 이벤트 리스너 저장  
  emitQueue: new Map(), // 이벤트 지연을 위한 큐  
  
  // 새로운 이벤트 리스너 등록  
  on(event, callback) {  
    this.list.has(event)  
      ? this.list.get(event)!.push(callback)  
      : this.list.set(event, [callback]);  
  
    return this;  
  },  
  
  // 콜백이 있는경우 해당하는 리스너 제거, 없는 경우 이벤트에 대한 모든 리스너 제거  
  off(event, callback) {  
    if (callback) {  
      const cb = this.list.get(event)?.filter((cb) => cb !== callback);  
      cb && this.list.set(event, cb);  
      return this;  
    }  
    this.list.delete(event);  
  
    return this;  
  },  
  
  //대기중인 이벤트를 취소시킬 때 필요함  
  cancelEmit(event) {  
    const timers = this.emitQueue.get(event);  
    if (timers) {  
      timers.forEach(clearTimeout);  
      this.emitQueue.delete(event);  
    }  
  
    return this;  
  },  
  
  // 이벤트 발생시키기  
  // 타입문제는 일단 보류중! (라이브러리 내부도 해결 안되어있음)  
  emit(event, ...args: never[]) {  
    this.list.has(event) &&  
      this.list.get(event)!.forEach((callback) => {  
        const timer = setTimeout(() => {  
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment  
          // @ts-expect-error          
          callback(...args);  
        }, 0);  
  
        this.emitQueue.has(event)  
          ? this.emitQueue.get(event)!.push(timer)  
          : this.emitQueue.set(event, [timer]);  
      });  
  },  
};
```
토스트 이벤트를 관리하기 위해 위와같은 eventManger를 구현했습니다. on, off 부분은 일반적인 이벤트 매니저 구조와 동일하니 설명하지 않고 넘어가겠습니다.
여기서 중심적으로 봐야할 것은 `emitQueue` 입니다. 이미 list에서 이벤트를 관리하고 있는데 왜 별도의 `emitQueue`가 필요할까요? 바로 이벤트의 콜백함수가 동기함수가 아닐 경우를 대비하기 위함입니다.

emit으로 이벤트 dispatch시 이벤트 list에서 콜백함수를 `setTimeout`에 넣어서 비동기적으로 실행하고 있습니다. 이렇게 하면 이벤트 루프 내에서 콜백 함수를 다음 주기로 밀어내서 현재 실행중인 동기 작업이 모두 종료된 이후에 콜백이 실행될 수 있도록 합니다. 이 때 `emitQueue`를 사용해서 타이머에 대한 정보를 별도의 큐로 관리하고, `cancelEmit`에서 대기중인 이벤트를 취소할 수 있습니다.

아직은 토스트를 띄우고 제거할 때 동기 함수만 사용하기 때문에 `emitQueue`와 `cancelEmit`은 필요하지 않습니다. 하지만 추후 토스트에서 Promise의 상태를 표시하는 기획이 추가될 것을 염두하고 있기 때문에 이 부분을 추가했습니다.
## ToastContainer 구현
### useToastContainer
ToastContainer에서는 아래 `useToastContainer` 훅을 사용해 토스트의 생성, 삭제 이벤트를 구독해 이에 맞는 동작을 수행할 수 있도록 합니다. 그리고 toastList를 통해 현재 화면에 띄워진 토스트를 관리합니다.
```ts
const useToastContainer = () => {  
  const [toastList, setToastList] = useState(new Map<string, ToastProps>());  
  
  // 토스트 추가  
  const addToast = (props: ToastProps) => {  
    setToastList((prev) => new Map(prev).set(props.toastId, props));  
  };  
  
  // 토스트 삭제  
  const deleteToast = (id: string) => {  
    setToastList((prev) => {  
      const newMap = new Map(prev);  
      newMap.delete(id);  
      return newMap;  
    });  
  };  
  
  useEffect(() => {  
    eventManager.on(ToastEvent.Add, addToast);  
    eventManager.on(ToastEvent.Delete, deleteToast);  
  
    // 컴포넌트 언마운트 시 리스너 해제  
    return () => {  
      eventManager.off(ToastEvent.Add, addToast);  
      eventManager.off(ToastEvent.Delete, deleteToast);  
    };  
  }, []);  
  
  const toastListToArray = () => {  
    return Array.from(toastList);  
  };  
  
  const getToastPositionGroupToRender = () => {  
    const list = toastListToArray();  
    const positionGroup = new Map<ToastPosition, ToastProps[]>();  
    list.forEach(([_, toastProps]) => {  
      const position = toastProps.position || 'topRight';  
      positionGroup.has(position)  
        ? positionGroup.get(position)!.push(toastProps)  
        : positionGroup.set(position, [toastProps]);  
    });  
    return positionGroup;  
  };  
  
  return { getToastPositionGroupToRender };  
};  
  
export default useToastContainer;
```

### ToastContainer
```tsx
export const ToastContainer = () => {  
  const { getToastPositionGroupToRender } = useToastContainer();  
  const positionGroup = getToastPositionGroupToRender();  
  
  return Array.from(positionGroup).map(([position, toasts]) => (  
    <div  
      key={position}  
      css={[  
        css`  
					position: fixed;
					display: flex;          
					flex-direction: column;          
					row-gap: 0.5rem;          
					z-index: 9999;        
					`,  
					ToastPositionStyle[position],  
					]} >      
					{toasts.map((toastProps) => (  
						<ToastItem key={toastProps.toastId} {...toastProps} />  
		      ))}  
    </div>  
  ));  
};
```
토스트 컨테이너에서는 위 훅을 사용해서 현재 랜더링해야하는 토스트의 정보를 position별 Map 형태로 받아옵니다. 그리고 각 포지션에 맞는 컨테이너 박스를 생성해서 알맞은 위치에 ToastItem을 띄워줍니다.
## toast 컴포넌트 구현
### 토스트가 일정 시간만큼 화면에 나타내고 이후에 사라지기
토스트는 사용자에게 간단한 정보를 표시해주기 위한 UI로 일정 시간이 지나면 사라져야 합니다.
이 기능을 구현하기 위한 선택지는 두 가지가 있는데요. 첫 번째는 `setTimeout`을 사용해 일정 시간 이후 토스트가 돔에서 제거되도록 하는 것이고, 두 번째는 animationend 이벤트를 활용하는 것 입니다.

이 중에 저는 `animationend` 이벤트를 활용하는 방식을 선택했습니다. toast 하단에 나타나는 프로그래스바를 표시하기 위해서는 이에 대한 애니메이션을 일정 시간만큼 보여줘야합니다. 따라서 별도의 타이머를 두는 것 보다 하나의 애니메이션 시간에 종속성되도록 구현하는 것이 더 효율적이라고 생각했기 때문입니다.
#### 토스트에 프로그래스바 애니메이션 달기
아래 코드는 설명을 위해 필요한 부분만 남기고 토스트를 간소화한 코드입니다.
```tsx
export const ToastProgressBarAnimation = keyframes`  
  from {  
    transform: scaleX(1);  
  }  
  to {  
    transform: scaleX(0);  
  }  
`;
  
const ToastItem: React.FC<ToastProps> = ({  
  toastId,  
  text,  
  autoClose = 3000,  
  closeOnClick = true,  
  type = 'default',  
  pauseOnHover = true,  
}) => {  
  const toastRef = useRef<HTMLDivElement>(null);  
  const [isExiting, setIsExiting] = useState(false);  
  const [isPaused, setIsPaused] = useState(false);  
  
  const handleExitingAnimationEnd = () => {
	  // 다음 내용에서 설명
  };   
  
	const handleProgressAnimationEnd = () => {  
	  autoClose && setIsExiting(true);  
	};  
	  
	const handleClick = () => {  
	  closeOnClick && handleProgressAnimationEnd();  
	};  
	  
	const handleMouseEnter = () => {  
	  pauseOnHover && autoClose && setIsPaused(true);  
	};  
	  
	const handleMouseLeave = () => {  
	  if (pauseOnHover && autoClose) {  
		setIsPaused(false);  
	  }  
	};
  
  return (  
    <div ref={toastRef}>  
      <Box  
        onClick={handleClick}  
        onMouseEnter={handleMouseEnter}  
        onMouseLeave={handleMouseLeave}  
        onAnimationEnd={handleExitingAnimationEnd}
        css={css`  
          animation: ${isExiting  
            ? css`${ToastFadeOutUpAnimation} 0.8s forwards`  
            : 'none'};  
        `}  
      >  
        {text}  
        <div  
          onAnimationEnd={handleProgressAnimationEnd}
          css={css`  
            transform-origin: left;            
            animation: ${autoClose  
              ? css`${ToastProgressBarAnimation} ${autoClose}ms linear forwards` 
              : 'none'};  
            animation-play-state: ${isPaused ? 'paused' : 'running'};  
          `}  
        />  
      </Box>  
    </div>  
  );  
};  
  
export default ToastItem;
```

토스트의 시간이 경과함에 따라 progressBar를 표시해주기 위해 ToastProgressBarAnimation 을 keyframe으로 추가했습니다. ToastProgressBarAnimation은 width 속성이 아니라 scaleX 속성을 사용했는데요.
width속성은 element의 실제 크기를 변화시키기 때문에 애니메이션이 진행되는 동안 reflow 과정이 발생하게 됩니다. 반면 scaleX 속성은 transform 속성의 일부로, 실제 크기를 변화시키지 않은 채 변형만 일어납니다. 또한 GPU 가속을 활용할 수 있기 때문에 성능적으로 더 우수합니다.

onAnimationEnd를 사용해서 애니메이션 종료시 종료 상태를 나타내는 isExiting 상태를 true로 업데이트 해줬습니다. 토스트를 바로 제거하지 않고 `isExiting`를 따로 둔 이유는 아래에서 자세히 설명하겠지만, 요약하자면 토스트가 서서히 사라지는 애니메이션을 주기 위함입니다.

`animation-play-state` 속성과 onMouseEnter, onMouseLeave 이벤트 리스너를 사용해서 토스트에 마우스 호버시 프로그래스바 애니메이션이 정지하도록 구현했습니다.
### toast가 사라질 때 fade out 애니메이션 넣기
토스트의 지속시간이 종료되었을 때 갑자기 컴포넌트가 "휙~" 사라져버리면 부자연스럽고 좋지 않은 사용자 경험을 제공한다고 생각합니다. 그래서 토스트가 자연스럽게 "샤샤샥~" 하며 사라질 수 있도록 keyframe을 사용해서fade-out 애니메이션을 넣었습니다.

```css
animation: ${isExiting  
            ? css`${ToastFadeOutUpAnimation} 0.8s forwards`  
            : 'none'};  
```

프로그래스바 애니메이션이 종료되면 `isExiting` 상태가 true가 되고, ToastFadeOutUpAnimation 애니메이션이 실행되게 됩니다. 이 애니메이션은 아래와 같이 구성되어있습니다.

```tsx
export const ToastFadeOutUpAnimation = keyframes`  
  from {  
    opacity: 1;    
    transform: translateY(0);  
  }  
  to {  
    opacity: 0;    
    transform: translateY(-1.5rem);  
  }  
`;

// 위 애니메이션에 대한 animationend 이벤트 콜백함수
const handleExitingAnimationEnd = () => {  
  eventManager.emit(ToastEvent.Delete, toastId);  
};
```

토스트 아이템이 점점 투명해지면서 위로 사라지도록 fade-out 애니메이션을 넣었습니다..
그리고 이 애니메이션에 대한 `animationend` 이벤트가 감지되면 실제 돔에서도 toast가 제거도되록 구현했는데요. 여기서 살짝 이슈가 생겼습니다.
#### fade-out에서 끊김 현상 발생
![fade-out시 뚝뚝 끊기는 현상 발생](https://i.imgur.com/NpAGpu9.png)

현재 각 position에 따른 toastContainer의 위치는 fixed 속성으로 관리되지만, 내부에 있는 토스트들의 리스트는 flexbox 속성으로 관리되고 있습니다.
top 속성을 가진 토스트들의 배열에서는 시간 순서에 따라 위쪽에 있는 toast가 먼저 제거되는데요. 이 때문에 fade-out 이후 DOM에서 토스트 제거시 flexbox의 높이가 줄어들면서 렌더 트리의 각 요소의 크기와 위치를 계산하는 reflow과정이 일어나게 됩니다.
때문에 토스트의 높이가 변하는 동작과 애니메이션이 합쳐져서 저런 뚝뚝 끊기는 현상이 발생하게 되었죠. 
#### requestAnimationFrame 적용하기
위 문제를 해결하기 위해 `requestAnimationFrame`을 도입했습니다. `requestAnimationFrame`은 브라우저의 렌더링 사이클에 맞춰 함수를 실행해서 레이아웃 계산이나 DOM 조작 연산을 효율적으로 수행할 수 있게 도와줍니다. 
아래와 같은 방식으로 `requestAnimationFrame` 함수를 사용할 수 있습니다.
```tsx
const handleAnimationEnd = () => {  
  requestAnimationFrame(() =>  
    eventManager.emit(ToastEvent.Delete, toastId)  
  );  
};
```

`requestAnimationFrame`을 적용했음에도 불구하고 여전히 뚝뚝 끊기는 듯한 느낌이 사라지지 않았습니다.
왜냐하면 근본적으로 flexbox의 사이즈가 줄어들면서 토스트 위치가 위로 올라간다는 사실은 변하지 않았기 때문인데요. 
#### collapseToast 적용하기
```tsx
export function collapseToast(  
  node: HTMLDivElement,  
  done: () => void,  
  duration = 20000  
) {  
  const { scrollHeight, style } = node;  
  
  requestAnimationFrame(() => {  
    style.height = scrollHeight + 'px';  
    style.transition = `all ${duration}ms`;  
  
    requestAnimationFrame(() => {  
      style.height = '0';  
      setTimeout(done, duration);  
    });  
  });  
}
```
위 유틸을 생성해서, 토스트의 높이를 변경하는 동작도 애니메이션으로 처리되도록 구현했습니다. height 속성을 `requestAnimationFrame` 을 통해 적용했기 때문에 브라우저 랜더링 사이클에 맞게 스무스한 박스 사이즈 변경이 일어납니다.

```tsx
const handleExitingAnimationEnd = () => {  
  collapseToast(toastRef.current!, () => {  
    eventManager.emit(ToastEvent.Delete, toastId);  
  });  
};
```

`handleExitingAnimationEnd` 함수에 `collapseToast` 유틸을 적용한 모습입니다.
![스무스해진 토스트 제거](https://i.imgur.com/VyWs5mn.png)
한번 더 요약하자면 아래와 같은 과정이 일어나서 제거 애니메이션이 부드럽게 변합니다.

- fade-out 애니메이션이 실행되면서 토스트가 점차 투명해지고 위로 올라갑니다.
- 위 이벤트가 끝나면 requestAnimationFrame을 사용해서 height의 속성을 브라우저 랜더링 사이클에 맞추어 점차 줄입니다.
- height가 줄어들면서 toast container 영역의 flexbox도 랜더링 사이클에 맞춰 스무스하게 줄어들며 뚝뚝 끊기는 느낌이 사라집니다.

## ToastUtils
```ts
const generateUniqueId = () => {  
  return Date.now().toString(36) + Math.random().toString(36).substring(4);  
};  
  
const emitToast = (type: ToastType, toastProps: ToastFunctionProps) => {  
  const id = generateUniqueId();  
  eventManager.emit(ToastEvent.Add, {  
    ...toastProps,  
    toastId: id,  
    type,  
  });  
};  
  
export const toast = {  
  default: (text: string, toastOptions?: ToastOptions) =>  
    emitToast('default', { text: text, ...toastOptions }),  
  info: (text: string, toastOptions?: ToastOptions) =>  
    emitToast('info', { text: text, ...toastOptions }),  
  success: (text: string, toastOptions?: ToastOptions) =>  
    emitToast('success', { text: text, ...toastOptions }),  
  warning: (text: string, toastOptions?: ToastOptions) =>  
    emitToast('warning', { text: text, ...toastOptions }),  
  error: (text: string, toastOptions?: ToastOptions) =>  
    emitToast('error', { text: text, ...toastOptions }),  
};
```

이제 토스트를 `console.log`와 같은 형식으로 호출하는 함수를 만드는 일만 남았습니다. 이를 위해 toast 유틸 함수를 객체 형태로 선언하고, 각 타입에 맞는 함수를 생성했습니다. 
# 토스트 사용 방법
이제 아래와 같은 형태로 토스트를 호출할 수 있습니다.
```ts
toast.defualt("토스트에 들어갈 내용입니다");
toast.info("토스트에 들어갈 내용입니다");
toast.success("토스트에 들어갈 내용입니다");
toast.warning("토스트에 들어갈 내용입니다");
toast.error("토스트에 들어갈 내용입니다");
```

![토스트 이쁘죠?](https://i.imgur.com/ks5ODiY.png)


위쪽부터 차례대로 default, info, success, warning, error 에 대한 디자인입니다.
### 토스트 옵션
토스트 출력시 두번째 인자로 옵션 객체를 넘길 수 있습니다. 옵션에는 다음과 같은 설정이 있습니다.
```ts
export type ToastOption = {
  autoClose?: false | number; 
  closeOnClick?: boolean;
  pauseOnHover?: boolean;
  position?: ToastPosition;
};
```
- `autoClose`: 토스트가 자동으로 닫힐지 여부. 기본값은 3초, false를 넣으면 클릭할 때 까지 토스트가 닫히지 않습니다.
- `closeOnClick`: 클릭해서 토스트를 닫을 수 있는지 여부입니다.
- `pauseOnHover`: 토스트에 마우스 호버시 토스트가 멈출지 여부입니다.
- `position`: 토스트의 위치를 결정합니다. (topLeft, topRight, topCenter, bottomLeft, bottomRight, bottomCenter)가 있습니다.
# 후기
토스트를 `console.log` 처럼 사용하기 위해 react-toastify 라이브러리의 내부 코드를 분석하며 위 토스트를 구현했습니다. 라이브러리 내부를 처음 열어봤을 때 갑자기 등장한 eventManger로 인해 엄청 어렵게만 느껴졌는데요. 왜 eventManger를 사용했어야 했는가에 대해서 중점적으로 코드를 분석해보니 생각보다 어렵지 않은 것을 알 수 있었습니다. eventManger를 통해 토스트의 UI를 관리하는 것은 pub/sub 패턴이라는 것을 깨닫고 난 이후부터는 코드가 술술 읽히기 시작했습니다. 덕분에 이렇게 사용하기 편리하면서도 이쁜 토스트를 구현할 수 있었습니다.

아직 UX를 다듬기 전이라 toast가 적극적으로 사용되고 있지 않아서 토스트의 사용 경험에 대한 피드백은 듣지 못한 상황인데요. 토스트를 잠깐 사용해보신 성인님 아주 극찬을 해주셔서 굉장히 뿌듯합니다 ㅎㅎ

![토스트 사용 후기!!!](https://i.imgur.com/w15JxuM.png)

추후 프로젝트에서 toast가 적극적으로 사용될 때 토스트에 대한 후기에 대해 더 남겨보도록 할게요!

> 이 토스트 코드는 아래 PR에서 확인할 수 있습니다.
> [gomterview](https://github.com/boostcampwm2023/web14-gomterview/pull/171)

# 참고 링크
[React-toastify | React-Toastify](https://fkhadra.github.io/react-toastify/introduction/)
[fkhadra/react-toastify: React notification made easy 🚀 !](https://github.com/fkhadra/react-toastify#readme)
[requestAnimationFrame 활용 (상)](https://velog.io/@younghwanjoe/requestAnimationFrame%EC%9D%84-%EC%82%AC%EC%9A%A9%ED%95%98%EC%97%AC-%EC%95%A0%EB%8B%88%EB%A9%94%EC%9D%B4%EC%85%98-%EA%B5%AC%ED%98%84%ED%95%98%EA%B8%B0-%EC%83%81)
