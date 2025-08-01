/**
 * @copyright Copyright (c) 2025 chichuang
 * @license MIT
 * @description cc-admin 企业级后台管理框架 - types
 * 本文件为 chichuang 原创，禁止擅自删除署名或用于商业用途。
 */

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
