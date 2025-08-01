/**
 * @copyright Copyright (c) 2025 chichuang
 * @license MIT
 * @description CC-Admin 企业级后台管理框架 - 路由配置模块
 * 本文件为 chichuang 原创，禁止擅自删除署名或用于商业用途。
 */

/**
 * 路由配置
 */
export const routerConfig = {
  // 路由模式
  mode: 'history' as const,

  // 路由基础路径
  base: '/',

  // 路由滚动行为
  scrollBehavior: 'smooth' as const,
} as const

/**
 * 路由白名单配置
 * 不需要登录验证的页面路径
 */
export const routeWhiteList = ['/login', '/register'] as const

/**
 * 错误页面配置
 * 系统错误页面的路径
 */
export const errorPages = ['/404', '/403', '/500'] as const

/**
 * 路由权限配置
 */
export const routePermissionConfig = {
  // 默认重定向路径
  defaultRedirect: '/dashboard',

  // 登录页面路径
  loginPath: '/login',

  // 未授权页面路径
  forbiddenPath: '/403',

  // 页面不存在路径
  notFoundPath: '/404',

  // 服务器错误页面路径
  serverErrorPath: '/500',
} as const

/**
 * 路由元信息配置
 */
export const routeMetaConfig = {
  // 默认页面标题
  defaultTitle: 'CC-Admin',

  // 标题分隔符
  titleSeparator: ' - ',

  // 是否需要登录验证
  requiresAuth: true,

  // 是否需要权限验证
  requiresPermission: true,
} as const
