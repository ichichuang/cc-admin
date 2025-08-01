/**
 * @copyright Copyright (c) 2025 chichuang
 * @license MIT
 * @description CC-Admin 企业级后台管理框架 - HTTP 配置模块
 * 本文件为 chichuang 原创，禁止擅自删除署名或用于商业用途。
 */

/**
 * HTTP 请求配置
 */
export const httpConfig = {
  // 请求超时时间（毫秒）
  timeout: 8000,

  // 重试次数
  retryCount: 3,

  // 重试延迟（毫秒）
  retryDelay: 1000,

  // 请求头配置
  headers: {
    'content-type': 'application/json',
    accept: 'application/json',
  },

  // 响应状态码
  status: {
    success: 200,
    created: 201,
    noContent: 204,
    badRequest: 400,
    unauthorized: 401,
    forbidden: 403,
    notFound: 404,
    internalServerError: 500,
  },
} as const

/**
 * API 端点配置
 */
export const apiEndpoints = {
  // 认证相关
  auth: {
    login: '/auth/login',
    logout: '/auth/logout',
    refresh: '/auth/refresh',
    profile: '/auth/profile',
  },

  // 用户相关
  user: {
    list: '/users',
    detail: '/users/:id',
    create: '/users',
    update: '/users/:id',
    delete: '/users/:id',
  },

  // 文件上传
  upload: {
    image: '/upload/image',
    file: '/upload/file',
  },
} as const

/**
 * 请求方法
 */
export const httpMethods = {
  get: 'GET',
  post: 'POST',
  put: 'PUT',
  patch: 'PATCH',
  delete: 'DELETE',
} as const

/**
 * 错误消息
 */
export const errorMessages = {
  networkError: '网络连接失败，请检查网络设置',
  timeoutError: '请求超时，请稍后重试',
  serverError: '服务器内部错误',
  unauthorized: '未授权，请重新登录',
  forbidden: '权限不足',
  notFound: '请求的资源不存在',
  validationError: '数据验证失败',
} as const
