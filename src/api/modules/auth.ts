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
