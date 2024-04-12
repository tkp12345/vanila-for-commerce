import { _customEvent } from '@/react/utils/utils'
import type Component from '@/react/Component'

export type Route = {
  path: string
  page: typeof Component
}

/*
 BrowserRouter(history API) 를 이용한 라우터
 */
class Router {
  $app: HTMLElement
  routes: {
    [key: string]: typeof Component
  } = {}
  initUrl: string = '/'

  constructor({ $app, routes, initUrl = '/' }: { $app: HTMLElement; routes: Route[]; initUrl?: string }) {
    this.$app = $app
    this.initUrl = initUrl

    routes.forEach((route: Route) => {
      this.routes[route.path] = route.page
    })

    this.initEvent()
  }

  initEvent() {
    document.addEventListener('changedRoutes', this.onChangedUrlHandler.bind(this) as EventListener)
  }

  //URL 변경시 호출
  onChangedUrlHandler(event: CustomEvent) {
    const path: string = event.detail.path
    history.pushState(event.detail, '', path)

    this.renderPage(path)
  }

  hasRoute(path: string) {
    return typeof this.routes[path] !== 'undefined'
  }

  getRoute(path: string) {
    return this.routes[path]
  }

  //페이지 렌더링
  renderPage(path: string) {
    let route

    // 동적 라우팅 처리 (:id)
    const regex = /\w{1,}$/

    if (this.hasRoute(path)) {
      route = this.getRoute(path)
    } else if (regex.test(path)) {
      // 동적 라우팅
      route = this.getRoute(path.replace(regex, ':id'))
    } else {
      // not found page
      route = this.getRoute(this.initUrl)
    }

    new route(this.$app, {})
  }

  push(path: string) {
    _customEvent('changedRoutes', {
      ...history.state,
      path,
    })
  }
}

export let router: {
  push: (path: string) => void
}

export function initRouter(options: { $app: HTMLElement; routes: Route[] }): void {
  const routerObj = new Router(options)
  const currentPath = window.location.pathname

  router = {
    push: (path) => routerObj.push(path),
  }

  //초기화시 현재 브라우저의 url에 해당하는 경로로 페이지를 렌더링
  _customEvent(
    'changedRoutes',
    history.state ?? {
      path: currentPath,
    },
  )
}
