// 路由相关类型集中定义
export interface RouteMeta {
  title: string
  icon?: string
  roles?: string[]
  auths?: string[]
  showLink?: boolean
  rank?: number
  [key: string]: any
}

export interface RouteConfig {
  path: string
  name?: string
  component?: any
  redirect?: string
  meta?: RouteMeta
  children?: RouteConfig[]
}

export interface BackendRouteConfig extends RouteConfig {
  component: string | undefined // 后端返回的组件名，允许为undefined
}

export interface MenuItem {
  path: string
  name: string
  title: string
  icon?: string
  showLink: boolean
  rank: number
  roles?: string[]
  auths?: string[]
  children?: MenuItem[]
  meta?: RouteMeta
}
