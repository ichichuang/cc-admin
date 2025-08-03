/**
 * @copyright Copyright (c) 2025 chichuang
 * @license MIT
 * @description cc-admin 企业级后台管理框架 - 路由类型声明
 * 本文件为 chichuang 原创，禁止擅自删除署名或用于商业用途。
 */

import 'vue-router'

// 扩展 Vue Router 的 RouteMeta 接口
declare module 'vue-router' {
  interface RouteMeta {
    /** 页面标题（支持国际化 key） */
    title?: string
    /** 页面标题国际化 key */
    titleKey?: string
    /** 布局模式 */
    parent?: 'admin' | 'screen' | 'fullscreen'
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
}

// 声明全局类型
declare global {
  /** 布局模式类型 */
  type LayoutMode = 'admin' | 'screen' | 'fullscreen'

  /** 增强的路由配置接口 */
  interface RouteConfig extends Omit<import('vue-router').RouteRecordRaw, 'meta' | 'children'> {
    meta?: import('vue-router').RouteMeta
    children?: RouteConfig[]
  }

  /** 后端动态路由数据格式 */
  interface BackendRouteConfig {
    /** 路由路径 */
    path: string
    /** 路由名称 */
    name?: string
    /** 组件路径（相对于src/views） */
    component?: string
    /** 路由重定向 */
    redirect?: string
    /** 路由元信息 */
    meta: import('vue-router').RouteMeta
    /** 子路由 */
    children?: BackendRouteConfig[]
  }

  /** 路由模块导出类型 */
  type RouteModule = RouteConfig | RouteConfig[]

  /** 菜单项类型（用于菜单渲染） */
  interface MenuItem {
    path: string
    name?: string
    title: string
    icon?: string
    showLink: boolean
    rank: number
    roles?: string[]
    auths?: string[]
    children?: MenuItem[]
    meta?: import('vue-router').RouteMeta
  }

  /** 路由工具类型 */
  interface RouteUtils {
    /** 扁平化路由 */
    flatRoutes: RouteConfig[]
    /** 菜单树 */
    menuTree: MenuItem[]
    /** 面包屑映射 */
    breadcrumbMap: Map<string, string[]>
    /** 需要缓存的页面 name 列表 */
    keepAliveNames: string[]
  }

  /** 动态路由管理器接口 */
  interface DynamicRouteManager {
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

  /** 权限检查结果 */
  interface PermissionResult {
    /** 是否有权限 */
    hasPermission: boolean
    /** 缺少的权限 */
    missingPermissions?: string[]
    /** 错误信息 */
    errorMessage?: string
  }

  /** 缓存操作类型 */
  interface CacheOperation {
    /** 操作模式 */
    mode: 'add' | 'delete' | 'refresh'
    /** 路由名称 */
    name: string
  }
}

// 导出空对象使其成为外部模块
export {}
