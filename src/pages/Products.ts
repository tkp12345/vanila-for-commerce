import type { Product, PropsModel, StateModel } from '@/react/types/types'
import Component from '@/react/Component'
import './../index.css'
import { router } from '@/react/Roter'

interface ProductsState extends StateModel {
  products: any[]
  total: number
  page: number
  limit: number
  search: string
  cart: Product[]
  allProducts: Product[]
  filteredProducts: Product[]
  limitOptions: number[]
}

export default class Products extends Component<PropsModel, ProductsState> {
  constructor($target: Element, props: PropsModel) {
    super($target, props)
    this.state = {
      products: [],
      total: 0,
      page: 1,
      limit: 10,
      search: '',
      cart: JSON.parse(localStorage.getItem('cart') || '[]'),
      allProducts: [],
      filteredProducts: [],
      limitOptions: [10, 20, 30], // 페이지당 제품 개수 선택 옵션
    }
  }

  setup() {
    this.fetchProducts()
  }

  async fetchProducts() {
    try {
      const res = await fetch('https://dummyjson.com/products?limit=100')
      const data = await res.json()
      this.setState({
        allProducts: data.products,
        total: data.products.length,
      })
      this.mutationFilteredProducts() // setState 후에 즉시 호출
    } catch (error) {
      console.error('Error fetching products:', error)
    }
  }

  mutationFilteredProducts() {
    const { page, limit, search, allProducts } = this.state

    const filteredProducts = search
      ? allProducts.filter((product) => product.title.toLowerCase().includes(search.toLowerCase()))
      : allProducts

    const paginatedProducts = filteredProducts.slice((page - 1) * limit, page * limit)
    this.setState({
      filteredProducts: paginatedProducts,
      total: filteredProducts.length,
    })
  }

  handlePageChange(page: number) {
    this.setState({ page: page })
    this.mutationFilteredProducts()
  }

  handleLimitChange(limit: number) {
    this.setState({ limit: limit, page: 1 })
    this.mutationFilteredProducts()
  }

  handleSearchChange(search: string) {
    this.setState({ search: search, page: 1 })
    this.mutationFilteredProducts()
  }

  template() {
    const { filteredProducts, page, total, limit, limitOptions, search = '', cart } = this.state
    const cartCount = cart?.length || 0
    const totalPages = Math.ceil(total / limit)

    // 개수 선택 필터
    const limitOptionsProducts =
      limitOptions &&
      limitOptions
        .map(
          (option) => `
      <option value="${option}" ${limit === option ? 'selected' : ''}>${option}개 보기</option>
    `,
        )
        .join('')

    // 검색 필터
    const searchProducts = `
          <input type="text" class="search-input" placeholder="검색어를 입력하세요" value=${search}>
            <button class="search-button">검색</button>
    `

    // 상품 리스트
    const productList =
      filteredProducts &&
      filteredProducts
        .map(
          (product) => `
     <div class='product' data-id="${product.id}">
    <img src="${product.thumbnail}" alt="${product.title}" />
    <h3>${product.title}</h3>
    <p>$${product.price}</p>
  </div>
    `,
        )
        .join('')

    // 페이지 네이션 버튼
    const pageButtons = Array.from(
      { length: totalPages },
      (_, i) => `
      <button class="page-button ${page === i + 1 ? 'active' : ''}" data-page="${i + 1}">
        ${i + 1}
      </button>
    `,
    ).join('')

    return `
      <div class='main-page'>
      <div class='header-section'>
        <h1>Products</h1>
        <div class="cart-title">장바구니 <span>${cartCount}</span>  개</div>
      </div>
        <div class="products-header-section">
          <select class="limit-select">
            ${limitOptionsProducts}
          </select>
          
          <div class="search-container">
            ${searchProducts}
          </div>       
        </div>
        
        <div class='products-container'>
          ${productList}
        </div>
        
        <div class="pagination">
          ${pageButtons}
        </div>
      </div>
    `
  }

  setEvent() {
    this.addEvent('click', '.page-button', (event: any) => {
      const page = Number((event.target as HTMLButtonElement).dataset.page)
      this.handlePageChange(page)
    })

    this.addEvent('click', '.cart-title', () => {
      router.push(`/cart`)
    })

    this.addEvent('click', '.search-button', () => {
      const searchInput = this.$target.querySelector('.search-input') as HTMLInputElement
      const search = searchInput.value.trim()
      this.handleSearchChange(search)
    })

    this.addEvent('keyup', '.search-input', (event: any) => {
      if (event.key === 'Enter') {
        const searchInput = this.$target.querySelector('.search-input') as HTMLInputElement
        const search = searchInput.value.trim()
        this.handleSearchChange(search)
      }
    })

    this.addEvent('change', '.limit-select', (event: Event) => {
      const target = event.target as HTMLSelectElement // HTMLSelectElement로 타입 캐스팅
      const limit = Number(target.value)
      this.handleLimitChange(limit)
    })

    this.addEvent('click', '.product', (event: any) => {
      const productElement = (event.target as HTMLElement).closest('.product') as HTMLElement
      const productId = productElement ? productElement.dataset.id : null
      if (productId) {
        router.push(`/product/${productId}`)
      }
    })
  }
}
