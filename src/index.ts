import Products from '@/pages/Products'
import type Component from '@/react/Component'
import Cart from '@/pages/Cart'
import { initRouter, type Route } from '@/react/Roter'

const routes: Route[] = [
  { path: '/', page: Products as typeof Component },
  { path: '/Products', page: Products as typeof Component },
  { path: '/Cart', page: Cart as typeof Component },
]

const $app = document.querySelector('#app') as HTMLElement

initRouter({ $app, routes })
