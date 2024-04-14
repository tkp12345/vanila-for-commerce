import type { PropsModel, StateModel } from '@/react/types/types'

/*
 react 생명주기를 참조한 Component class
 */
export default class Component<Props extends PropsModel, State extends StateModel> {
  $target: Element
  props: Props
  state: State
  boundEvents: Map<string, Function>

  constructor($target: Element, props: Props) {
    this.$target = $target // 렌더링될 DOM 요소를 참조
    this.props = props // 컴포넌트에 전달된 속성
    this.state = {} as State // 컴포넌트의 상태를 저장
    this.boundEvents = new Map()

    this.setup()
    this.mount()
    this.setEvent()
    console.log('Component-constructor:', $target)
  }
  setup() {}

  /*
     target 의 Element 요소를 반환
   */
  template() {
    return ''
  }

  /*
     HTML 생성하고 이를 DOM에 적용 (상태가 변경될 때마다 호출)
     */
  render() {
    const template = this.template()
    if (template) {
      this.$target.innerHTML = template
    }
  }

  mount() {
    this.render()
    this.componentDidMount()
  }

  update(): void {
    this.render()
    this.componentDidUpdate()
  }

  componentDidMount() {}
  componentDidUpdate() {}

  /*
   state 관리 : 변한 state 만감지 (깊은복사)
   */
  setState(newState: Partial<State>, cb?: () => void) {
    const prevState = this.state
    const updatedState = { ...prevState, ...newState }

    // 비교를 위해 JSON 문자열화를 사용
    if (JSON.stringify(this.state) !== JSON.stringify(updatedState)) {
      this.state = updatedState
      this.update()
      if (cb) {
        cb()
      }
    }
  }

  /*
    Event 관리 :
      - setEvent : 이벤트 리스너들을 설정(추가) 메서드
      - addEvent : 이벤트를 DOM 요소에 바인딩 메서드
   */
  setEvent() {}
  addEvent(eventType: string, selector: string, handler: EventListener) {
    this.removeEvent(eventType, selector)

    const children = [...this.$target.querySelectorAll(selector)]

    const eventFunction = (event: Event) => {
      const targetElement = event.target as Element
      if (children.includes(targetElement) || targetElement.closest(selector)) {
        handler(event)
      }
    }

    if (this.boundEvents.has(eventType + selector)) {
      this.$target.removeEventListener(eventType, this.boundEvents.get(eventType + selector) as EventListener)
    }
    this.$target.addEventListener(eventType, eventFunction)
    this.boundEvents.set(eventType + selector, eventFunction)
  }

  // addEvent(eventType: string, selector: string, handler: EventListener) {
  //   const eventKey = eventType + selector
  //   if (this.boundEvents.has(eventKey)) {
  //     // 이미 이벤트 리스너가 등록되어 있는 경우 추가하지 않음
  //     return
  //   }
  //
  //   const eventFunction = (event: Event) => {
  //     const targetElement = event.target as Element
  //     if (targetElement.closest(selector)) {
  //       handler(event)
  //     }
  //   }
  //
  //   this.$target.addEventListener(eventType, eventFunction)
  //   this.boundEvents.set(eventKey, eventFunction)
  // }

  removeEvent(eventType: string, selector: string) {
    if (this.boundEvents.has(eventType + selector)) {
      this.$target.removeEventListener(eventType, this.boundEvents.get(eventType + selector) as EventListener)
      this.boundEvents.delete(eventType + selector)
    }
  }
}
