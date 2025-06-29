import { alovaInstance } from './http'

// 类型定义
export interface DataItem {
  id: number
  title: string
  content: string
  createdAt: string
}

export interface User {
  id: number
  name: string
  email: string
  age: number
  createdAt: string
}

export interface ApiResponse<T = any> {
  success: boolean
  message?: string
  data?: T
}

export interface PaginationResponse<T = any> extends ApiResponse {
  data: T[]
  pagination: {
    current: number
    limit: number
    total: number
    pages: number
  }
}

// 服务器状态 API
export const serverAPI = {
  // 获取服务器基本信息
  getServerInfo: () => alovaInstance.Get('/'),

  // 健康检查
  healthCheck: () => alovaInstance.Get('/health'),

  // 获取 API 端点列表
  getApiEndpoints: () => alovaInstance.Get('/api'),
}

// 数据管理 API
export const dataAPI = {
  // 获取数据列表（支持分页和搜索）
  getDataList: (params: { page?: number; limit?: number; search?: string } = {}) =>
    alovaInstance.Get('/api/data', { params }),

  // 获取单条数据
  getDataById: (id: number) => alovaInstance.Get(`/api/data/${id}`),

  // 创建数据
  createData: (data: Omit<DataItem, 'id' | 'createdAt'>) => alovaInstance.Post('/api/data', data),

  // 更新数据
  updateData: (id: number, data: Partial<Omit<DataItem, 'id' | 'createdAt'>>) =>
    alovaInstance.Put(`/api/data/${id}`, data),

  // 删除数据
  deleteData: (id: number) => alovaInstance.Delete(`/api/data/${id}`),
}

// 用户管理 API
export const userAPI = {
  // 获取用户列表（支持分页和搜索）
  getUserList: (params: { page?: number; limit?: number; search?: string } = {}) =>
    alovaInstance.Get('/api/users', { params }),

  // 获取单个用户
  getUserById: (id: number) => alovaInstance.Get(`/api/users/${id}`),

  // 创建用户
  createUser: (user: Omit<User, 'id' | 'createdAt'>) => alovaInstance.Post('/api/users', user),

  // 更新用户
  updateUser: (id: number, user: Partial<Omit<User, 'id' | 'createdAt'>>) =>
    alovaInstance.Put(`/api/users/${id}`, user),

  // 删除用户
  deleteUser: (id: number) => alovaInstance.Delete(`/api/users/${id}`),
}

// 组合 API
export const api = {
  server: serverAPI,
  data: dataAPI,
  user: userAPI,
}

export default api
