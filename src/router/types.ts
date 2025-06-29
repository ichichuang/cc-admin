import type { RouteRecordRaw } from 'vue-router'

/** 布局模式类型 */
export type LayoutMode = 'admin' | 'screen' | 'fullscreen'

/**
 * 扩展的路由 Meta 配置
 * 参考 Pure-Admin 但保持简洁实用
 */
export interface RouteMeta {
  /** 页面标题（支持国际化 key） */
  title: string

  /** 布局模式 */
  parent?: LayoutMode

  /** 菜单图标 */
  icon?: string

  /** 是否在菜单中显示（默认 true） */
  showLink?: boolean

  /** 菜单排序权重，数值越小越靠前 */
  rank?: number

  /** 页面级权限角色 */
  roles?: string[]

  /** 是否缓存页面（默认 false） */
  keepAlive?: boolean

  /** 是否隐藏面包屑（默认 false） */
  hideBreadcrumb?: boolean

  /** 是否为外链 */
  isLink?: boolean

  /** 外链地址 */
  linkUrl?: string

  /** 激活菜单路径（用于参数路由） */
  activeMenu?: string

  /** 页面描述信息 */
  description?: string
}

/**
 * 增强的路由配置接口
 */
export interface RouteConfig extends Omit<RouteRecordRaw, 'meta' | 'children'> {
  meta?: RouteMeta
  children?: RouteConfig[]
}

/**
 * 路由模块导出类型
 */
export type RouteModule = RouteConfig | RouteConfig[]

/**
 * 菜单项类型（用于菜单渲染）
 */
export interface MenuItem {
  path: string
  name?: string
  title: string
  icon?: string
  showLink: boolean
  rank: number
  roles?: string[]
  children?: MenuItem[]
}

/**
 * 路由工具类型
 */
export interface RouteUtils {
  /** 扁平化路由 */
  flatRoutes: RouteConfig[]
  /** 菜单树 */
  menuTree: MenuItem[]
  /** 面包屑映射 */
  breadcrumbMap: Map<string, string[]>
}
