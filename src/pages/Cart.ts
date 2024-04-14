import type { Product, StateModel } from '@/react/types/types'
import Component from '@/react/Component'

interface CartState extends StateModel {
  cart: Product[]
}

export default class Cart extends Component<{}, CartState> {
  constructor($target: Element) {
    super($target, {})

    this.state = {
      cart: JSON.parse(localStorage.getItem('cart') || '[]'),
    }
  }

  template() {
    const { cart } = this.state
    const cartCount = cart?.length || 0

    const cartList =
      cart &&
      cart
        .map(
          (item) => `
          <div class='cart-item'>
            <img src='${item.thumbnail}' alt='${item.title}' />
            <div class='cart-item-details'>
              <p>${item.title}</p>
              <p>${item.quantity}개</p>
              <button class='remove-item' data-id='${item.id}'>삭제</button>
            </div>
          </div>
        `,
        )
        .join('')

    return `
      <div class='cart-container'>
        <div class='header-section'>
          <div class='cart-title-back' >
            <h1>◀ Cart</h1>
          </div>
          <div>장바구니 <span>${cartCount}</span> 개</div>
        </div>
           <div class="cart-item-section">
          ${cartCount ? cartList : `<div>장바구니가 비어있습니다</div>`}
          </div>
      </div>
    `
  }

  setEvent() {
    this.addEvent('click', '.cart-title-back', () => {
      window.history.back()
    })

    this.addEvent('click', '.remove-item', (event: any) => {
      const target = event.target as HTMLElement
      const itemId = target.dataset.id
      if (!itemId) return
      this.removeItem(itemId)
    })
  }

  removeItem(itemId: string) {
    const { cart } = this.state
    const newCart = cart.filter((item) => item.id.toString() !== itemId)
    this.setState({ cart: newCart })
    localStorage.setItem('cart', JSON.stringify(newCart))
  }
}
