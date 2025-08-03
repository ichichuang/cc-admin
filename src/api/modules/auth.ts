/**
 * @copyright Copyright (c) 2025 chichuang
 * @license MIT
 * @description cc-admin 企业级后台管理框架 - API接口
 * 本文件为 chichuang 原创，禁止擅自删除署名或用于商业用途。
 */

import { get, post } from '@/utils/http'

/**
 * 用户登录
 */

export const login = (params: { username: string; password: string }) =>
  post<{ token: string }>('/auth/login', params)

/**
 * 获取用户信息
 */

export const getUserInfo = () => get<UserInfo>('/auth/userInfo')

/**
 * 获取动态路由
 * 根据用户权限返回可访问的路由配置
 * DynamicRouteManager 接口
 */
export const getAuthRoutes = () => get<BackendRouteConfig[]>('/auth/routes')
