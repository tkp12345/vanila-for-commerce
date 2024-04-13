import type { PropsModel, StateModel } from '@/react/types/types'
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
}

export default class ProductsByQueryParam extends Component<PropsModel, ProductsState> {
  constructor($target: Element, props: PropsModel) {
    super($target, props)
    this.state = {
      products: [],
      total: 0,
      page: 1,
      limit: 10,
      search: '',
      cartCount: 0,
    }
  }

  componentDidMount(): void {
    this.setState({
      cartCount: parseInt(localStorage.getItem('cartCount') || '0', 10),
    })
    this.state = {
      products: [],
      total: 0,
      page: 1,
      limit: 10,
      search: '',
      cartCount: 0,
    }
    this.fetchProducts()
    const $header = this.$target.querySelector('header')
    new Header($header as Element, { prevCount: this.state.cartCount })
  }

  fetchProducts() {
    const { page, limit, search } = this.state

    const queryParams = new URLSearchParams({
      limit: String(limit),
      page: String(page),
      q: search,
    })

    fetch(`https://dummyjson.com/products?${queryParams}`)
      .then((response) => response.json())
      .then((data) => {
        console.log('data.porudcts:', data.products)
        this.setState({ products: data.products, total: data.total })
      })
      .catch((error) => {
        console.error('Error fetching products:', error)
      })
  }

  handlePageChange(page: number) {
    this.setState({ page: page })
    this.fetchProducts()
  }

  handleLimitChange(limit: number) {
    this.setState({ limit: limit, page: 1 })
    this.fetchProducts()
  }

  handleSearchChange(search) {
    this.setState({ search: search, page: 1 })
    this.fetchProducts()
  }

  template() {
    const { products, page, total, limit } = this.state

    const pageButtons = Array.from({ length: Math.ceil(total / limit) }, (_, i) => {
      const pageNumber = i + 1
      const isActive = pageNumber === page
      return `<button class="${isActive ? 'page-button active' : 'page-button'}" data-page="${pageNumber}">${pageNumber}</button>`
    }).join('')

    const productHtml =
      products &&
      products
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

    return `
      <div class='main-page'>
        <header></header>
        <h1>Products</h1>
        <input type="text" class="search-input" placeholder="Search..."/>
        <select class="limit-select">
          <option value="10">10개 보기</option>
          <option value="20">20개 보기</option>
          <option value="30">30개 보기</option>
        </select>
        <div class='products-container'>
          ${productHtml}
        </div>
        <div class="pagination">
          ${pageButtons}
        </div>
      </div>
    `
  }

  setEvent() {
    this.addEvent('click', '.page-button', (event) => {
      const page = Number((event.target as HTMLButtonElement).dataset.page)
      this.handlePageChange(page)
    })

    this.addEvent('input', '.search-input', (event) => {
      const search = event.target.value
      this.handleSearchChange(search)
    })

    this.addEvent('change', '.limit-select', (event) => {
      const limit = Number(event.target.value)
      this.handleLimitChange(limit)
    })
  }
}
