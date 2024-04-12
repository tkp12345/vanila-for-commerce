import type { PropsModel, StateModel } from '@/react/types/types'
import Component from '@/react/Component'
import Header from '@/pages/Header'

export default class Products extends Component<PropsModel, StateModel> {
  componentDidMount(): void {
    const $header = this.$target.querySelector('header')
    new Header($header as Element, { props: '0' })
    // new Header($header as Element, { props: "subprop" });
  }
  template() {
    return `
      <div class='main-page'>
        <header></header>
        Products Page
      </div>
    `
  }
}
