
<h1 align="center">SPA 쇼핑몰 구현 과제
</h1>

**** 

## 실행 
```typescript
    npm install
    npm run dev
```

</br>

## 구현

>패키지구조

```
jaranda_202312_박건욱
├
├─ src         
│  ├─ pages       // ├─ 페이지(컴포넌트) 패키지
│  └─ react       // └─ SPA(react) 의 기능을 하는 패키지

```
#### http-server 대신 webpack dev server 를 이용하여 프로젝트를 실행했습니다  </br>
 
####  모든 페이지의 구현은 내부적으로 구현된 컴포넌트, 라우터를 기조로 합니다  </br>

</br>

> 컴포넌트

```typescript
src / react / Component.ts

export default class Component {

    setup() {
    }

    //target 의 Element 요소를 반환
    template() {
        return ''
    }

    //HTML 생성하고 이를 DOM에 적용 (상태가 변경될 때마다 호출)
    render() {
    }

    mount() {
        this.render()
        this.componentDidMount()
    }

    update(): void {
        this.render()
        this.componentDidUpdate()
    }

    componentDidMount() {
    }

    componentDidUpdate() {
    }

    //state 관리 : 변한 state 만감지 (깊은복사)
    setState() {
    ...
    }

    /*
      Event 관리 :
        - setEvent : 이벤트 리스너들을 설정(추가) 메서드
        - addEvent : 이벤트를 DOM 요소에 바인딩 메서드
     */
    setEvent() {
    }

    addEvent() {
    }
}

```
react 생명주기를 참조한 Component class입니다 </br>
#### setup -> mount -> setEvent
- setState,props : 컴포넌트 내부 상태인 state 와 부모로부터 받는 Props 기능 
- setup : 렌더링 이전 처리 (api 호출 ,state 초기값 선언 )
- setEvent,addEvent : 컴포넌트에 이벤트를 추가, 바인딩 처리 

</br>

</br>
</br>

## 트러블 슈팅

> 1. 이벤트 리스너가 중복으로 추가되는 문제  (장바구니 담기 버튼 클릭시 이벤트 여러번 발생)

#### 같은 이벤트 유형과 선택자 조합에 대해 기존 리스너를 제거한 후 새 리스너를 추가합니다
```typescript
src / react / Component.ts 

  constructor($target: Element, props: Props){
    this.boundEvents = new Map()
        ...
    }
    addEvent(eventType: string, selector: string, handler: EventListener) {
        const children = [...this.$target.querySelectorAll(selector)]
            ...
    
        if (this.boundEvents.has(eventType + selector)) {
          this.$target.removeEventListener(eventType, this.boundEvents.get(eventType + selector) as EventListener)
        }
        this.$target.addEventListener(eventType, eventFunction)
        this.boundEvents.set(eventType + selector, eventFunction)
     }
```
#### 컴포넌트의 업데이트 후에도 이벤트를 제거하고 재설정하여 중복 이벤트가 생기지 않게됩니다 </br>
</br>

>2. url 입력시 오류 , 경로 변경시 error 발생
 #### webpack 이 경로를 찾아가지못해 publicPath 옵션을 '/'로 추가
```
webpack.config.js

   output: {
        ...
       publicPath: '/',
     },
```

</br>

####  사용자 ux를 고려하여 잘못된 페이지 접근시 메인페이지로 돌아가도록 핸들링처리 추가
```typescript
src / react / Roter.ts  

renderErrorPage() {
    this.$app.innerHTML = `
    <div class="error-page">
      <p>요청하신 페이지에 접근할 수 없거나 오류가 발생했습니다.</p>
      <button id="go-home">메인 페이지로 돌아가기</button>
    </div>
  `
    document.getElementById('go-home')?.addEventListener('click', () => {
        this.push('/')
    })
}

renderPage(path: string) {
  ...
    try {
      ...
    } catch (error) {
        this.renderErrorPage() // 오류 페이지 렌더링
    }
}
```

</br>

> 3. 과제 API - page , limit 필터조건 미지원

과제 API(https://dummyjson.com/products) 에서 queryParam 으로
필터들(page,limit)을 처리하려 했지만 지원을 하지 않는것처럼 보였습니다 </br>
 그래서 100개의 데이터를 client 에서 호출하여 client 에서 자체적으로 조건에 맞게 필터 하였습니다
