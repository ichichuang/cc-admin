/** 布局模式类型
 * admin: 后台布局
 * screen: 全屏布局
 * fullscreen: 全屏布局
 */
declare type LayoutMode = 'admin' | 'screen' | 'fullscreen'

/**
 * 扩展的路由 Meta 配置
 * 参考 Pure-Admin 但保持简洁实用
 */
declare interface RouteMeta {
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

  /** 按钮级权限设置 */
  auths?: string[]

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

  /** 是否为后端动态路由 */
  backstage?: boolean

  /** 是否显示父级菜单 */
  showParent?: boolean

  /** 内嵌的iframe链接 */
  frameSrc?: string

  /** iframe页是否开启首次加载动画（默认true） */
  frameLoading?: boolean

  /** 动态路由可打开的最大数量 */
  dynamicLevel?: number

  /** 当前菜单名称或自定义信息禁止添加到标签页（默认false） */
  hiddenTag?: boolean

  /** 当前菜单名称是否固定显示在标签页且不可关闭（默认false） */
  fixedTag?: boolean

  /** 页面加载动画配置 */
  transition?: {
    /** 当前路由动画效果 */
    name?: string
    /** 进场动画 */
    enterTransition?: string
    /** 离场动画 */
    leaveTransition?: string
  }
}

/**
 * 增强的路由配置接口
 */
declare interface RouteConfig extends Omit<RouteRecordRaw, 'meta' | 'children'> {
  meta?: RouteMeta
  children?: RouteConfig[]
}

/**
 * 后端动态路由数据格式
 */
declare interface BackendRouteConfig {
  /** 路由路径 */
  path: string
  /** 路由名称 */
  name?: string
  /** 组件路径（相对于src/views） */
  component?: string
  /** 路由重定向 */
  redirect?: string
  /** 路由元信息 */
  meta: RouteMeta
  /** 子路由 */
  children?: BackendRouteConfig[]
}

/**
 * 路由模块导出类型
 */
declare type RouteModule = RouteConfig | RouteConfig[]

/**
 * 菜单项类型（用于菜单渲染）
 */
declare interface MenuItem {
  path: string
  name?: string
  title: string
  icon?: string
  showLink: boolean
  rank: number
  roles?: string[]
  auths?: string[]
  children?: MenuItem[]
  meta?: RouteMeta
}

/**
 * 路由工具类型
 */
declare interface RouteUtils {
  /** 扁平化路由 */
  flatRoutes: RouteConfig[]
  /** 菜单树 */
  menuTree: MenuItem[]
  /** 面包屑映射 */
  breadcrumbMap: Map<string, string[]>
}

/**
 * 动态路由管理器接口
 */
declare interface DynamicRouteManager {
  /** 添加动态路由 */
  addRoute: (route: RouteConfig) => void
  /** 批量添加动态路由 */
  addRoutes: (routes: RouteConfig[]) => void
  /** 移除动态路由 */
  removeRoute: (name: string) => void
  /** 清空所有动态路由 */
  clearRoutes: () => void
  /** 获取所有动态路由 */
  getRoutes: () => RouteConfig[]
  /** 重置路由 */
  resetRouter: () => void
}

/**
 * 权限检查结果
 */
declare interface PermissionResult {
  /** 是否有权限 */
  hasPermission: boolean
  /** 缺少的权限 */
  missingPermissions?: string[]
  /** 错误信息 */
  errorMessage?: string
}

/**
 * 缓存操作类型
 */
declare interface CacheOperation {
  /** 操作模式 */
  mode: 'add' | 'delete' | 'refresh'
  /** 路由名称 */
  name: string
}

/**
 * 用户信息接口
 */
declare interface UserInfo {
  /** 用户ID */
  userId: string
  /** 用户名 */
  username: string
  /** 用户角色 */
  roles: string[]
  /** 用户权限 */
  permissions: string[]
  /** 其他用户信息 */
  [key: string]: any
}

// 声明全局类型
declare global {
  interface Window {
    /** 全局路由工具 */
    $routeUtils?: RouteUtils
    /** 全局权限检查函数 */
    $hasAuth?: (value: string | string[]) => boolean
  }
}
