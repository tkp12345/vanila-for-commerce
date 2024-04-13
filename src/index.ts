import Products from '@/pages/Products'
import type Component from '@/react/Component'
import Cart from '@/pages/Cart'
import ProductDetail from '@/pages/ProductDetail'
import { initRouter, type Route } from '@/react/Roter'

const routes: Route[] = [
  { path: '' || '/', page: Products as typeof Component },
  { path: '/products', page: Products as typeof Component },
  { path: '/product/:id', page: ProductDetail as typeof Component }, // 상세 페이지 경로 추가
  { path: '/cart', page: Cart as typeof Component },
]

const $app = document.querySelector('#app') as HTMLElement

initRouter({ $app, routes })
