/**
 * @copyright Copyright (c) 2025 chichuang
 * @license MIT
 * @description cc-admin 企业级后台管理框架 - 认证API
 * 本文件为 chichuang 原创，禁止擅自删除署名或用于商业用途。
 */

// 本地定义 HTTP 方法，避免循环依赖
const get = async (url: string, config?: any) => {
  // 简单的 GET 请求实现
  const response = await fetch(url, {
    method: 'GET',
    ...config,
  })
  return response.json()
}

const post = async (url: string, data?: any, config?: any) => {
  // 简单的 POST 请求实现
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...config?.headers,
    },
    body: JSON.stringify(data),
    ...config,
  })
  return response.json()
}

// API 响应类型定义
interface ApiResponse<T = any> {
  success: boolean
  data: T
  message: string
}

interface LoginParams {
  username: string
  password: string
}

interface LoginResponse {
  token: string
}

export const login = (params: LoginParams) =>
  post('/auth/login', params) as Promise<ApiResponse<LoginResponse>>

export const getUserInfo = () => get('/auth/userInfo') as Promise<ApiResponse<UserInfo>>

export const logout = () => post('/auth/logout') as Promise<ApiResponse<null>>

/**
 * 获取动态路由
 * 根据用户权限返回可访问的路由配置
 * DynamicRouteManager 接口
 */
export const getAuthRoutes = () => get('/auth/routes') as Promise<ApiResponse<any[]>>
