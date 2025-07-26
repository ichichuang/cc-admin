/**
 * Mock 示例类型定义
 */

export interface MockUser {
  id: number
  username: string
  email: string
  role: 'admin' | 'user'
  status: 'active' | 'inactive'
  createdAt: string
  updatedAt: string
}

export interface CreateUserRequest {
  username: string
  email: string
  role: 'admin' | 'user'
  status: 'active' | 'inactive'
}

export interface UpdateUserRequest {
  username?: string
  email?: string
  role?: 'admin' | 'user'
  status?: 'active' | 'inactive'
}

export interface ApiResponse<T = any> {
  code: number
  message: string
  data: T
}
