import type { PropsModel, StateModel } from '@/react/types/types'

/*
 react 생명주기를 참조한 Component calss
 */
export default class Component<Props extends PropsModel, State extends StateModel> {
  $target: Element
  props: Props
  state: State

  constructor($target: Element, props: Props) {
    this.$target = $target // 렌더링될 DOM 요소를 참조
    this.props = props // 컴포넌트에 전달된 속성
    this.state = {} as State // 컴포넌트의 상태를 저장

    this.setup()
    this.mount()
    this.setEvent()
  }

  setup() {}
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
  setState(newState: Partial<State>) {
    const prevState = this.state

    const _state = { ...prevState, ...newState }
    if (JSON.stringify(this.state) === JSON.stringify(_state)) {
      return
    }
    this.state = _state
    this.update()
  }

  /*
      Event 관리 :
        - setEvent : 이벤트 리스너들을 설정(추가) 메서드
        - addEvent : 이벤트를 DOM 요소에 바인딩 메서드
     */
  setEvent() {}
  addEvent(eventType: string, selector: string, cb: Function) {
    //부모 요소들
    const children: Element[] = [...this.$target.querySelectorAll(selector)]

    const existTarget = ($target: Element) => children.includes($target) || $target.closest(selector)

    //DOM 요소 바인딩 - 이벤트 위임 감지
    this.$target.addEventListener(eventType, (event: any) => {
      if (!existTarget(event.target)) return false
      cb(event)
    })
  }
}
