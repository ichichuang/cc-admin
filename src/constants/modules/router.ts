/**
 * @copyright Copyright (c) 2025 chichuang
 * @license MIT
 * @description cc-admin 企业级后台管理框架 - 路由配置模块
 * 本文件为 chichuang 原创，禁止擅自删除署名或用于商业用途。
 */

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
