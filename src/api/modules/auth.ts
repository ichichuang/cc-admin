import alovaInstance, { get, post } from '@/utils/http'

/**
 * 用户登录
 */

export const login = (params: { username: string; password: string }) =>
  alovaInstance.Post<{ token: string }>('/auth/login', params)

/**
 * 用户登出
 */
export const logout = () => {
  return post('/auth/logout')
}

/**
 * 获取用户信息
 */

export const getUserInfo = () => alovaInstance.Get<UserInfo>('/auth/userInfo')

/**
 * 刷新 token
 */
export const refreshToken = (refreshToken: string) => {
  return post('/auth/refresh', { refreshToken })
}

/**
 * 获取动态路由
 * 根据用户权限返回可访问的路由配置
 * DynamicRouteManager 接口
 */
export const getAuthRoutes = () => alovaInstance.Get<BackendRouteConfig[]>('/auth/routes')

/**
 * 获取用户菜单
 * 返回用户可访问的菜单列表
 */
export const getUserMenus = () => {
  return get('/auth/menus')
}

/**
 * 获取用户权限
 * 返回用户的权限列表
 */
export const getUserPermissions = () => {
  return get('/auth/permissions')
}

/**
 * 验证用户是否有指定权限
 */
export const checkPermission = (permissions: string[]) => {
  return post('/auth/check-permission', { permissions })
}

/**
 * 获取验证码
 */
export const getCaptcha = () => {
  return get('/auth/captcha')
}
