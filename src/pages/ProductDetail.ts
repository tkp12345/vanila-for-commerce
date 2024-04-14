import type { Product, PropsModel, StateModel } from '@/react/types/types'
import Component from '@/react/Component'
import { router } from '@/react/Roter'

interface ProductDetailState extends StateModel {
  product: Product | null
  cart: Product[]
}

export default class ProductDetail extends Component<PropsModel, ProductDetailState> {
  constructor($target: Element, props: PropsModel) {
    super($target, props)

    this.state = {
      product: null,
      cart: JSON.parse(localStorage.getItem('cart') || '[]'),
    }
  }

  async componentDidMount() {
    const productId = new URL(window.location.href).pathname.split('/').pop()
    if (productId) {
      try {
        const response = await fetch(`https://dummyjson.com/products/${productId}`)
        const data = await response.json()
        this.setState({ product: data })
      } catch (error) {
        console.error('Error fetching product details:', error)
      }
    }
  }

  template() {
    const { product, cart } = this.state
    const cartCount = cart?.length || 0

    if (!product) return '<div>Loading...</div>' // Or any other loading state representation

    return `
      <div class='product-detail'>
        <div class='header-section'>
          <div class='product-product-detail-title-back'>
            <h1>◀ Product Details</h1>
          </div>
        <div class='cart-product-detail-title'>장바구니 <span>${cartCount}</span> 개</div>
        </div>
        <div class='products-detail-section'>
          <div class='product-detail-image'>
            <img src='${product.thumbnail}' alt='${product.title}' />
          </div>
          <div class='product-detail-info'>
            <p>title : ${product.title}</p>
            <p>brand: ${product.brand}</p>
            <p>category: ${product.category}</p>
            <p>price: $${product.price}</p>
            <p>stock: ${product.stock}</p>
            <p>description: ${product.description}</p>
            <p>discountPercentage: ${product.discountPercentage}</p>
            <div>
              <input type='number' min='1' class='product-quantity' value='1' />
              <button class='add-to-cart'>장바구니 담기</button>
            </div>
          </div>
          </div>
      </div>
    `
  }

  setEvent() {
    this.addEvent('click', '.product-product-detail-title-back', () => router.back())

    this.addEvent('click', '.cart-product-detail-title', () => router.push(`/cart`))

    this.addEvent('click', '.add-to-cart', () => {
      const inputElement = this.$target.querySelector('.product-quantity') as HTMLInputElement
      const quantity = parseInt(inputElement.value, 10)
      this.addToCart(this.state.product, quantity)
    })
  }

  // 카트 담기
  addToCart(product: Product | null, quantity: number) {
    if (!product || quantity < 1) return

    const cart = JSON.parse(localStorage.getItem('cart') || '[]')
    const existIndex = cart.findIndex((item: any) => item.id === product.id)
    if (existIndex !== -1) {
      cart[existIndex].quantity += quantity
    } else {
      product.quantity = quantity
      cart.push(product)
    }

    localStorage.setItem('cart', JSON.stringify(cart))
    this.setState({ cart: cart })
    alert(`해당상품 ${quantity}개가 장바구니에 추가되었습니다`)
  }
}
