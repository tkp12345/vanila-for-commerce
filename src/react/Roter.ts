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
  static instance: Router | null = null

  constructor({ $app, routes, initUrl = '/' }: { $app: HTMLElement; routes: Route[]; initUrl?: string }) {
    this.$app = $app
    this.initUrl = initUrl.toLowerCase()

    routes.forEach((route: Route) => {
      this.routes[route.path] = route.page
    })

    this.initEvent()
  }

  //라우터 중복 생성 방지
  static getInstance(options: { $app: HTMLElement; routes: Route[] }): Router {
    if (!Router.instance) {
      Router.instance = new Router(options)
    }
    return Router.instance
  }
  initEvent() {
    document.addEventListener('changedRoutes', this.onChangedUrlHandler.bind(this) as EventListener)
    window.addEventListener('popstate', this.onPopState.bind(this))
  }
  //URL 변경시 호출
  onChangedUrlHandler(event: CustomEvent) {
    const path: string = event.detail.path
    history.pushState(event.detail, '', path)

    this.renderPage(path)
  }

  onPopState() {
    // 현재 URL을 기반으로 라우터의 상태를 업데이트하거나 페이지를 렌더링
    const path = window.location.pathname

    this.renderPage(path)
  }

  hasRoute(path: string) {
    return typeof this.routes[path.toLowerCase()] !== 'undefined'
  }

  getRoute(path: string) {
    return this.routes[path.toLowerCase()]
  }

  renderErrorPage() {
    this.$app.innerHTML = `
    <div class="error-page">
      <p>요청하신 페이지에 접근할 수 없거나 오류가 발생했습니다.</p>
      <button id="go-home">메인 페이지로 돌아가기</button>
    </div>
  `
    document.getElementById('go-home')?.addEventListener('click', () => {
      this.push('/')
    })
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

    try {
      const pageInstance = new route(this.$app, {})
      pageInstance.render()
    } catch (error) {
      console.error('Routing error:', error)
      this.renderErrorPage() // 오류 페이지 렌더링
    }
  }

  push(path: string) {
    _customEvent('changedRoutes', {
      ...history.state,
      path,
    })
  }
  back() {
    window.history.back()
  }
}

export let router: {
  push: (path: string) => void
  back: () => void
}

export function initRouter(options: { $app: HTMLElement; routes: Route[] }): void {
  const routerInstance = Router.getInstance(options)
  const currentPath = window.location.pathname
  router = {
    push: (path) => routerInstance.push(path),
    // back: () => routerInstance.back(),
    back: () => {
      // Prevent multiple renderPage calls when using router.back()
      const path = window.location.pathname
      if (currentPath !== path) {
        routerInstance.back()
      }
    },
  }

  //초기화시 현재 브라우저의 url에 해당하는 경로로 페이지를 렌더링
  _customEvent(
    'changedRoutes',
    history.state ?? {
      path: currentPath,
    },
  )
}
