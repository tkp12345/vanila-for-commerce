import type { Product, PropsModel, StateModel } from '@/react/types/types'
import Component from '@/react/Component'
import Header from '@/components/Header'
import './../index.css'

interface ProductsState extends StateModel {
  products: any[]
  total: number
  page: number
  limit: number
  search: string
  cartCount: string | number
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
      cartCount: 0,
      allProducts: [],
      filteredProducts: [],
      limitOptions: [10, 20, 30], // 페이지당 제품 개수 선택 옵션
    }
  }

  componentDidMount() {
    this.fetchProducts()
    const cartCount = localStorage.getItem('cartCount') || '0'
    this.setState({
      cartCount: parseInt(cartCount, 10),
    })
    const $header = this.$target.querySelector('header')
    new Header($header as Element, { prevCount: this.state.cartCount })
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
    const { filteredProducts, page, total, limit, limitOptions, search = '' } = this.state
    const totalPages = Math.ceil(total / limit)
    const limitOptionsProducts =
      limitOptions &&
      limitOptions
        .map(
          (option) => `
      <option value="${option}" ${limit === option ? 'selected' : ''}>${option}개 보기</option>
    `,
        )
        .join('')

    const searchProducts = `
          <input type="text" class="search-input" placeholder="검색어를 입력하세요" value=${search}>
            <button class="search-button">검색</button>
    `

    const productList =
      filteredProducts &&
      filteredProducts
        .map(
          (product) => `
      <div class='product'>
        <img src='${product.thumbnail}' alt='${product.title}' />
        <h3>${product.title}</h3>
        <p>$${product.price}</p>
      </div>
    `,
        )
        .join('')

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
        <h1>Products</h1>
        <header></header>
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
    this.addEvent('click', '.page-button', (event: MouseEvent) => {
      const page = Number((event.target as HTMLButtonElement).dataset.page)
      this.handlePageChange(page)
    })

    this.addEvent('click', '.search-button', () => {
      const searchInput = this.$target.querySelector('.search-input') as HTMLInputElement
      const search = searchInput.value.trim()
      this.handleSearchChange(search)
    })

    this.addEvent('keyup', '.search-input', (event: KeyboardEvent) => {
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
  }
}
