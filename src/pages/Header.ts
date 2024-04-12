import Component from '@/react/Component'
import { router } from '@/react/Roter'

interface HeaderProps {
  props: string | number
}
interface HeaderState {
  cartCount: string | number
}

export default class Header extends Component<HeaderProps, HeaderState> {
  setup() {
    // 로컬스토리지에서 카트 개수를 가져오기
    const cartCount = localStorage.getItem('cartCount') || '0'
    this.state = {
      cartCount: cartCount,
    }
  }
  componentDidMount() {
    const { props }: HeaderProps = this.props
    this.setState({ cartCount: this.state.cartCount || 0 })
    // this.setState({ cartCount: this.state.cartCount || 0 + props.toString() })
  }
  template() {
    const { cartCount } = this.state
    return `
    <div class='header'>
      장바구니 ${cartCount || 0}개
    </div>
    `
  }

  setEvent() {
    this.addEvent('click', '.header', () => {
      router.push('/Cart')
    })
  }
}
