# API 管理指南

## 概述

CC-Admin 基于 Alova 构建了现代化的 API 管理系统，采用模块化设计，支持请求/响应拦截、错误处理、类型安全、缓存管理等企业级功能。

## 🏗️ 架构设计

### 目录结构

```
src/api/
├── index.ts              # 🚪 API 统一导出入口
└── modules/              # 📦 API 模块
    ├── auth.ts           # 认证相关 API
    ├── user.ts           # 用户管理 API
    ├── test.ts           # 测试 API
    └── ...               # 其他业务模块

src/utils/http/           # 🔧 HTTP 工具
├── index.ts              # HTTP 工具导出
├── instance.ts           # Alova 实例配置
├── interceptors.ts       # 请求/响应拦截器
├── methods.ts            # HTTP 方法封装
└── types.ts              # 类型定义
```

### 自动导入机制

```typescript
// src/api/index.ts
import { autoImportModulesSync } from '@/utils/moduleLoader'

// 自动导入所有 API 模块
const modules = import.meta.glob('./modules/**/*.ts', { eager: true })
const apiModules = autoImportModulesSync(modules)

// 统一导出所有 API
export * from './modules/auth'
export * from './modules/user'
export * from './modules/test'
```

## 🔧 HTTP 配置

### Alova 实例配置

```typescript
// src/utils/http/instance.ts
import { createAlova } from 'alova'
import { useUserStore } from '@/stores/modules/user'
import { requestInterceptor, responseInterceptor } from './interceptors'

/**
 * 创建 Alova 实例
 */
export const alovaInstance = createAlova({
  // 请求适配器
  requestAdapter: fetch(),

  // 基础配置
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: import.meta.env.VITE_API_TIMEOUT || 10000,

  // 全局请求头
  headers: {
    'Content-Type': 'application/json',
  },

  // 请求拦截器
  beforeRequest: requestInterceptor,

  // 响应拦截器
  responded: responseInterceptor,

  // 缓存配置
  cacheFor: {
    GET: 60 * 1000, // GET 请求缓存 1 分钟
    POST: 0, // POST 请求不缓存
    PUT: 0, // PUT 请求不缓存
    DELETE: 0, // DELETE 请求不缓存
  },

  // 共享请求配置
  shareRequest: true,
})

/**
 * 不需要 Token 的实例（用于登录等接口）
 */
export const publicAlovaInstance = createAlova({
  requestAdapter: fetch(),
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: import.meta.env.VITE_API_TIMEOUT || 10000,
  headers: {
    'Content-Type': 'application/json',
  },
  beforeRequest: method => {
    // 公共请求不添加 Token
    return method
  },
  responded: responseInterceptor,
})
```

### 请求/响应拦截器

```typescript
// src/utils/http/interceptors.ts
import type { Method } from 'alova'
import { useUserStore } from '@/stores/modules/user'
import { useAppStore } from '@/stores/modules/app'
import router from '@/router'

/**
 * 请求拦截器
 */
export const requestInterceptor = (method: Method) => {
  const userStore = useUserStore()
  const appStore = useAppStore()

  // 添加 Authorization 头
  if (userStore.accessToken) {
    method.config.headers.Authorization = `Bearer ${userStore.accessToken}`
  }

  // 添加请求 ID（用于追踪）
  method.config.headers['X-Request-ID'] = generateRequestId()

  // 添加用户信息
  if (userStore.userInfo?.id) {
    method.config.headers['X-User-ID'] = userStore.userInfo.id
  }

  // 显示全局加载状态
  if (method.config.showLoading !== false) {
    appStore.setLoading(true)
  }

  // 开发环境日志
  if (import.meta.env.DEV) {
    console.log(`🚀 API请求: ${method.type} ${method.url}`, {
      headers: method.config.headers,
      data: method.data,
    })
  }

  return method
}

/**
 * 响应拦截器
 */
export const responseInterceptor = {
  // 响应成功处理
  onSuccess: (response: Response, method: Method) => {
    const appStore = useAppStore()

    // 隐藏全局加载状态
    if (method.config.showLoading !== false) {
      appStore.setLoading(false)
    }

    // 开发环境日志
    if (import.meta.env.DEV) {
      console.log(`✅ API响应: ${method.type} ${method.url}`, {
        status: response.status,
        statusText: response.statusText,
      })
    }

    return response.json()
  },

  // 响应错误处理
  onError: (error: Error, method: Method) => {
    const appStore = useAppStore()
    const userStore = useUserStore()

    // 隐藏全局加载状态
    if (method.config.showLoading !== false) {
      appStore.setLoading(false)
    }

    // 根据错误类型进行处理
    if (error.message.includes('401')) {
      // Token 过期，清除用户信息并跳转登录
      userStore.clearUserData()
      router.push('/login')
      return Promise.reject(new Error('登录已过期，请重新登录'))
    }

    if (error.message.includes('403')) {
      // 权限不足
      router.push('/403')
      return Promise.reject(new Error('权限不足'))
    }

    if (error.message.includes('404')) {
      // 接口不存在
      return Promise.reject(new Error('请求的接口不存在'))
    }

    if (error.message.includes('500')) {
      // 服务器错误
      return Promise.reject(new Error('服务器内部错误'))
    }

    // 网络错误
    if (error.message.includes('Network')) {
      return Promise.reject(new Error('网络连接失败，请检查网络'))
    }

    // 超时错误
    if (error.message.includes('timeout')) {
      return Promise.reject(new Error('请求超时，请重试'))
    }

    // 其他错误
    console.error(`❌ API错误: ${method.type} ${method.url}`, error)
    return Promise.reject(error)
  },
}

/**
 * 生成请求 ID
 */
function generateRequestId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}
```

### HTTP 方法封装

```typescript
// src/utils/http/methods.ts
import { alovaInstance, publicAlovaInstance } from './instance'
import type { APIResponse, RequestConfig } from './types'

/**
 * GET 请求
 */
export function GET<T = any>(url: string, params?: Record<string, any>, config?: RequestConfig) {
  return alovaInstance.Get<APIResponse<T>>(url, {
    params,
    ...config,
  })
}

/**
 * POST 请求
 */
export function POST<T = any>(url: string, data?: any, config?: RequestConfig) {
  return alovaInstance.Post<APIResponse<T>>(url, data, config)
}

/**
 * PUT 请求
 */
export function PUT<T = any>(url: string, data?: any, config?: RequestConfig) {
  return alovaInstance.Put<APIResponse<T>>(url, data, config)
}

/**
 * DELETE 请求
 */
export function DELETE<T = any>(url: string, params?: Record<string, any>, config?: RequestConfig) {
  return alovaInstance.Delete<APIResponse<T>>(url, {
    params,
    ...config,
  })
}

/**
 * PATCH 请求
 */
export function PATCH<T = any>(url: string, data?: any, config?: RequestConfig) {
  return alovaInstance.Patch<APIResponse<T>>(url, data, config)
}

/**
 * 公共 POST 请求（不需要 Token）
 */
export function PUBLIC_POST<T = any>(url: string, data?: any, config?: RequestConfig) {
  return publicAlovaInstance.Post<APIResponse<T>>(url, data, config)
}

/**
 * 文件上传
 */
export function UPLOAD<T = any>(
  url: string,
  formData: FormData,
  config?: RequestConfig & {
    onProgress?: (loaded: number, total: number) => void
  }
) {
  return alovaInstance.Post<APIResponse<T>>(url, formData, {
    ...config,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
}

/**
 * 文件下载
 */
export function DOWNLOAD(url: string, params?: Record<string, any>, filename?: string) {
  return alovaInstance
    .Get(url, {
      params,
      responseType: 'blob',
    })
    .then(blob => {
      const downloadUrl = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = downloadUrl
      link.download = filename || 'download'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(downloadUrl)
    })
}
```

### 类型定义

```typescript
// src/utils/http/types.ts
/**
 * API 响应格式
 */
export interface APIResponse<T = any> {
  /** 状态码 */
  code: number
  /** 响应消息 */
  message: string
  /** 响应数据 */
  data: T
  /** 是否成功 */
  success: boolean
  /** 时间戳 */
  timestamp: number
}

/**
 * 分页响应格式
 */
export interface PaginationResponse<T = any> {
  /** 列表数据 */
  list: T[]
  /** 总数 */
  total: number
  /** 当前页 */
  current: number
  /** 页大小 */
  size: number
  /** 总页数 */
  pages: number
  /** 是否有下一页 */
  hasNext: boolean
  /** 是否有上一页 */
  hasPrev: boolean
}

/**
 * 请求配置
 */
export interface RequestConfig {
  /** 是否显示加载状态 */
  showLoading?: boolean
  /** 是否显示错误提示 */
  showError?: boolean
  /** 缓存时间（毫秒） */
  cacheFor?: number
  /** 重试次数 */
  retry?: number
  /** 超时时间 */
  timeout?: number
  /** 自定义头部 */
  headers?: Record<string, string>
}

/**
 * 分页请求参数
 */
export interface PaginationParams {
  /** 当前页 */
  current?: number
  /** 页大小 */
  size?: number
  /** 排序字段 */
  sortField?: string
  /** 排序方向 */
  sortOrder?: 'asc' | 'desc'
}
```

## 📚 API 模块详解

### 1. 认证 API 模块

```typescript
// src/api/modules/auth.ts
import { POST, PUBLIC_POST } from '@/utils/http'
import type { APIResponse } from '@/utils/http/types'

/** 登录请求参数 */
export interface LoginRequest {
  username: string
  password: string
  captcha?: string
  rememberMe?: boolean
}

/** 登录响应数据 */
export interface LoginResponse {
  /** 访问令牌 */
  accessToken: string
  /** 刷新令牌 */
  refreshToken: string
  /** 用户信息 */
  userInfo: UserInfo
  /** 过期时间 */
  expiresIn: number
}

/** 用户信息 */
export interface UserInfo {
  id: string
  username: string
  email: string
  avatar?: string
  roles: string[]
  permissions: string[]
  lastLoginTime?: string
}

/**
 * 认证相关 API
 */
export const authAPI = {
  /**
   * 用户登录
   */
  login: (data: LoginRequest) => PUBLIC_POST<LoginResponse>('/auth/login', data),

  /**
   * 用户登出
   */
  logout: () => POST('/auth/logout'),

  /**
   * 刷新Token
   */
  refreshToken: (refreshToken: string) =>
    PUBLIC_POST<Pick<LoginResponse, 'accessToken' | 'expiresIn'>>('/auth/refresh', {
      refreshToken,
    }),

  /**
   * 获取用户信息
   */
  getUserInfo: () => GET<UserInfo>('/auth/userinfo'),

  /**
   * 修改密码
   */
  changePassword: (data: { oldPassword: string; newPassword: string }) =>
    POST('/auth/change-password', data),

  /**
   * 忘记密码
   */
  forgotPassword: (email: string) => PUBLIC_POST('/auth/forgot-password', { email }),

  /**
   * 重置密码
   */
  resetPassword: (data: { token: string; newPassword: string }) =>
    PUBLIC_POST('/auth/reset-password', data),

  /**
   * 获取验证码
   */
  getCaptcha: () => GET<{ captcha: string; token: string }>('/auth/captcha'),
}
```

### 2. 用户管理 API 模块

```typescript
// src/api/modules/user.ts
import { GET, POST, PUT, DELETE } from '@/utils/http'
import type { PaginationParams, PaginationResponse } from '@/utils/http/types'

/** 用户列表项 */
export interface UserListItem {
  id: string
  username: string
  email: string
  avatar?: string
  status: 'active' | 'inactive' | 'banned'
  roles: string[]
  createdAt: string
  updatedAt: string
  lastLoginTime?: string
}

/** 用户详情 */
export interface UserDetail extends UserListItem {
  phone?: string
  department?: string
  position?: string
  permissions: string[]
  profile: {
    nickname?: string
    bio?: string
    website?: string
    location?: string
  }
}

/** 创建用户请求 */
export interface CreateUserRequest {
  username: string
  email: string
  password: string
  roles: string[]
  status?: 'active' | 'inactive'
  profile?: {
    nickname?: string
    phone?: string
    department?: string
    position?: string
  }
}

/** 更新用户请求 */
export interface UpdateUserRequest {
  email?: string
  roles?: string[]
  status?: 'active' | 'inactive' | 'banned'
  profile?: {
    nickname?: string
    phone?: string
    department?: string
    position?: string
    bio?: string
    website?: string
    location?: string
  }
}

/** 用户查询参数 */
export interface UserQueryParams extends PaginationParams {
  keyword?: string
  status?: 'active' | 'inactive' | 'banned'
  role?: string
  department?: string
  dateRange?: [string, string]
}

/**
 * 用户管理 API
 */
export const userAPI = {
  /**
   * 获取用户列表
   */
  getUserList: (params?: UserQueryParams) =>
    GET<PaginationResponse<UserListItem>>('/users', params),

  /**
   * 获取用户详情
   */
  getUserDetail: (id: string) => GET<UserDetail>(`/users/${id}`),

  /**
   * 创建用户
   */
  createUser: (data: CreateUserRequest) => POST<UserDetail>('/users', data),

  /**
   * 更新用户
   */
  updateUser: (id: string, data: UpdateUserRequest) => PUT<UserDetail>(`/users/${id}`, data),

  /**
   * 删除用户
   */
  deleteUser: (id: string) => DELETE(`/users/${id}`),

  /**
   * 批量删除用户
   */
  batchDeleteUsers: (ids: string[]) => DELETE('/users/batch', { ids }),

  /**
   * 重置用户密码
   */
  resetUserPassword: (id: string) => POST<{ tempPassword: string }>(`/users/${id}/reset-password`),

  /**
   * 更新用户状态
   */
  updateUserStatus: (id: string, status: 'active' | 'inactive' | 'banned') =>
    PUT(`/users/${id}/status`, { status }),

  /**
   * 上传用户头像
   */
  uploadAvatar: (id: string, file: File) => {
    const formData = new FormData()
    formData.append('avatar', file)
    return UPLOAD<{ avatarUrl: string }>(`/users/${id}/avatar`, formData)
  },

  /**
   * 导出用户数据
   */
  exportUsers: (params?: UserQueryParams) => DOWNLOAD('/users/export', params, 'users.xlsx'),

  /**
   * 导入用户数据
   */
  importUsers: (file: File) => {
    const formData = new FormData()
    formData.append('file', file)
    return UPLOAD<{
      success: number
      failed: number
      errors: Array<{ row: number; message: string }>
    }>('/users/import', formData)
  },
}
```

### 3. 测试 API 模块

```typescript
// src/api/modules/test.ts
import { GET, POST } from '@/utils/http'

/**
 * 测试相关 API
 */
export const testAPI = {
  /**
   * 测试 GET 请求
   */
  testGet: () => GET<{ message: string; timestamp: number }>('/test/get'),

  /**
   * 测试 POST 请求
   */
  testPost: (data: { message: string }) => POST<{ echo: string }>('/test/post', data),

  /**
   * 测试网络延迟
   */
  testDelay: (delay: number = 1000) => GET<{ delay: number }>(`/test/delay/${delay}`),

  /**
   * 测试错误响应
   */
  testError: (code: number = 500) => GET(`/test/error/${code}`),

  /**
   * 测试文件上传
   */
  testUpload: (file: File) => {
    const formData = new FormData()
    formData.append('file', file)
    return UPLOAD<{
      filename: string
      size: number
      url: string
    }>('/test/upload', formData)
  },

  /**
   * 测试文件下载
   */
  testDownload: () => DOWNLOAD('/test/download', undefined, 'test-file.txt'),
}
```

## 🚀 高级功能

### 1. 自动重试机制

```typescript
// src/utils/http/retry.ts
import type { Method } from 'alova'

/**
 * 自动重试配置
 */
export interface RetryConfig {
  /** 重试次数 */
  count: number
  /** 重试延迟（毫秒） */
  delay: number
  /** 重试条件 */
  condition?: (error: Error) => boolean
}

/**
 * 添加重试机制
 */
export function withRetry<T>(method: Method<any, any, T>, config: RetryConfig): Promise<T> {
  let retryCount = 0

  const execute = async (): Promise<T> => {
    try {
      return await method
    } catch (error) {
      // 检查是否应该重试
      const shouldRetry =
        retryCount < config.count && (!config.condition || config.condition(error as Error))

      if (shouldRetry) {
        retryCount++
        console.log(`🔄 请求重试 ${retryCount}/${config.count}: ${method.url}`)

        // 延迟后重试
        await new Promise(resolve => setTimeout(resolve, config.delay))
        return execute()
      }

      throw error
    }
  }

  return execute()
}

// 使用示例
export const userAPIWithRetry = {
  getUserList: (params?: UserQueryParams) =>
    withRetry(userAPI.getUserList(params), {
      count: 3,
      delay: 1000,
      condition: error => error.message.includes('Network'),
    }),
}
```

### 2. 请求缓存管理

```typescript
// src/utils/http/cache.ts
import type { Method } from 'alova'

/**
 * 缓存管理器
 */
export class APICacheManager {
  private cache = new Map<
    string,
    {
      data: any
      timestamp: number
      ttl: number
    }
  >()

  /**
   * 设置缓存
   */
  set(key: string, data: any, ttl: number = 60000) {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl,
    })
  }

  /**
   * 获取缓存
   */
  get(key: string) {
    const item = this.cache.get(key)
    if (!item) return null

    // 检查是否过期
    if (Date.now() - item.timestamp > item.ttl) {
      this.cache.delete(key)
      return null
    }

    return item.data
  }

  /**
   * 删除缓存
   */
  delete(key: string) {
    this.cache.delete(key)
  }

  /**
   * 清空缓存
   */
  clear() {
    this.cache.clear()
  }

  /**
   * 清理过期缓存
   */
  cleanup() {
    const now = Date.now()
    for (const [key, item] of this.cache.entries()) {
      if (now - item.timestamp > item.ttl) {
        this.cache.delete(key)
      }
    }
  }
}

export const apiCacheManager = new APICacheManager()

// 定期清理过期缓存
setInterval(() => {
  apiCacheManager.cleanup()
}, 60000) // 每分钟清理一次
```

### 3. 请求防抖和节流

```typescript
// src/utils/http/throttle.ts
import { debounce, throttle } from 'lodash-es'

/**
 * 防抖请求
 */
export function debounceRequest<T extends (...args: any[]) => any>(
  requestFn: T,
  delay: number = 300
): T {
  return debounce(requestFn, delay) as T
}

/**
 * 节流请求
 */
export function throttleRequest<T extends (...args: any[]) => any>(
  requestFn: T,
  delay: number = 1000
): T {
  return throttle(requestFn, delay) as T
}

// 使用示例
export const debouncedSearch = debounceRequest(
  (keyword: string) => userAPI.getUserList({ keyword }),
  500
)

export const throttledRefresh = throttleRequest(() => userAPI.getUserList(), 2000)
```

### 4. 请求队列管理

```typescript
// src/utils/http/queue.ts
/**
 * 请求队列管理器
 */
export class RequestQueueManager {
  private queue: Array<{
    id: string
    request: () => Promise<any>
    priority: number
  }> = []

  private processing = false
  private concurrency = 3 // 并发数
  private running = 0

  /**
   * 添加请求到队列
   */
  add<T>(id: string, request: () => Promise<T>, priority: number = 0): Promise<T> {
    return new Promise((resolve, reject) => {
      this.queue.push({
        id,
        request: async () => {
          try {
            const result = await request()
            resolve(result)
            return result
          } catch (error) {
            reject(error)
            throw error
          }
        },
        priority,
      })

      // 按优先级排序
      this.queue.sort((a, b) => b.priority - a.priority)

      this.process()
    })
  }

  /**
   * 处理队列
   */
  private async process() {
    if (this.processing || this.running >= this.concurrency) {
      return
    }

    const item = this.queue.shift()
    if (!item) return

    this.running++
    this.processing = true

    try {
      await item.request()
    } catch (error) {
      console.error(`请求失败: ${item.id}`, error)
    } finally {
      this.running--
      this.processing = false

      // 继续处理队列
      if (this.queue.length > 0 && this.running < this.concurrency) {
        this.process()
      }
    }
  }

  /**
   * 清空队列
   */
  clear() {
    this.queue = []
  }

  /**
   * 获取队列状态
   */
  getStatus() {
    return {
      waiting: this.queue.length,
      running: this.running,
      processing: this.processing,
    }
  }
}

export const requestQueueManager = new RequestQueueManager()
```

## 🔧 最佳实践

### 1. API 模块组织规范

```typescript
// ✅ 推荐的 API 模块结构
export const moduleAPI = {
  // 📋 列表查询
  getList: (params?: QueryParams) => GET<PaginationResponse<Item>>('/items', params),

  // 🔍 详情查询
  getDetail: (id: string) => GET<ItemDetail>(`/items/${id}`),

  // ➕ 创建
  create: (data: CreateRequest) => POST<ItemDetail>('/items', data),

  // ✏️ 更新
  update: (id: string, data: UpdateRequest) => PUT<ItemDetail>(`/items/${id}`, data),

  // 🗑️ 删除
  delete: (id: string) => DELETE(`/items/${id}`),

  // 🔄 批量操作
  batchDelete: (ids: string[]) => DELETE('/items/batch', { ids }),
  batchUpdate: (updates: Array<{ id: string; data: Partial<UpdateRequest> }>) =>
    PUT('/items/batch', { updates }),

  // 📤 导出
  export: (params?: QueryParams) => DOWNLOAD('/items/export', params, 'items.xlsx'),

  // 📥 导入
  import: (file: File) => {
    const formData = new FormData()
    formData.append('file', file)
    return UPLOAD<ImportResult>('/items/import', formData)
  },
}
```

### 2. 错误处理最佳实践

```typescript
// 在 Vue 组件中使用 API
export default {
  async setup() {
    const loading = ref(false)
    const error = ref<string | null>(null)
    const data = ref(null)

    const fetchData = async () => {
      try {
        loading.value = true
        error.value = null

        const response = await userAPI.getUserList()
        data.value = response.data
      } catch (err: any) {
        error.value = err.message || '请求失败'
        console.error('获取用户列表失败:', err)
      } finally {
        loading.value = false
      }
    }

    // 组件挂载时自动请求数据
    onMounted(fetchData)

    return {
      loading,
      error,
      data,
      refresh: fetchData,
    }
  },
}
```

### 3. 类型安全实践

```typescript
// 定义完整的类型接口
interface APIModule<T, CreateT, UpdateT, QueryT> {
  getList: (params?: QueryT) => Promise<APIResponse<PaginationResponse<T>>>
  getDetail: (id: string) => Promise<APIResponse<T>>
  create: (data: CreateT) => Promise<APIResponse<T>>
  update: (id: string, data: UpdateT) => Promise<APIResponse<T>>
  delete: (id: string) => Promise<APIResponse<void>>
}

// 实现类型安全的 API 模块
export const typedUserAPI: APIModule<
  UserListItem,
  CreateUserRequest,
  UpdateUserRequest,
  UserQueryParams
> = {
  getList: params => GET('/users', params),
  getDetail: id => GET(`/users/${id}`),
  create: data => POST('/users', data),
  update: (id, data) => PUT(`/users/${id}`, data),
  delete: id => DELETE(`/users/${id}`),
}
```

### 4. 请求优化策略

```typescript
// 使用组合式函数封装 API 逻辑
export function useUserAPI() {
  const userList = ref<UserListItem[]>([])
  const userDetail = ref<UserDetail | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  // 获取用户列表（带缓存）
  const getUserList = async (params?: UserQueryParams, useCache = true) => {
    const cacheKey = `user-list-${JSON.stringify(params)}`

    if (useCache) {
      const cached = apiCacheManager.get(cacheKey)
      if (cached) {
        userList.value = cached
        return cached
      }
    }

    try {
      loading.value = true
      const response = await userAPI.getUserList(params)
      userList.value = response.data.list

      // 缓存结果
      apiCacheManager.set(cacheKey, response.data.list, 300000) // 5分钟

      return response.data.list
    } catch (err: any) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  // 防抖搜索
  const searchUsers = debounceRequest((keyword: string) => getUserList({ keyword }, false), 500)

  return {
    userList: readonly(userList),
    userDetail: readonly(userDetail),
    loading: readonly(loading),
    error: readonly(error),
    getUserList,
    searchUsers,
  }
}
```

## 📋 API 模块清单

### 核心模块

| 模块     | 文件路径          | 描述         | 主要功能              |
| -------- | ----------------- | ------------ | --------------------- |
| **auth** | `modules/auth.ts` | 认证授权模块 | 登录、登出、刷新Token |
| **user** | `modules/user.ts` | 用户管理模块 | 用户CRUD、权限管理    |
| **test** | `modules/test.ts` | 测试接口模块 | API测试、错误模拟     |

### 工具模块

| 模块             | 文件路径                     | 描述          |
| ---------------- | ---------------------------- | ------------- |
| **instance**     | `utils/http/instance.ts`     | Alova实例配置 |
| **interceptors** | `utils/http/interceptors.ts` | 拦截器配置    |
| **methods**      | `utils/http/methods.ts`      | HTTP方法封装  |
| **types**        | `utils/http/types.ts`        | 类型定义      |
| **cache**        | `utils/http/cache.ts`        | 缓存管理      |
| **retry**        | `utils/http/retry.ts`        | 重试机制      |
| **queue**        | `utils/http/queue.ts`        | 请求队列管理  |

## 🎯 总结

CC-Admin 的 API 管理系统具有以下特点：

- ✅ **现代化架构**: 基于 Alova 的现代化请求库
- ✅ **模块化设计**: 按业务模块拆分 API 接口
- ✅ **类型安全**: 完整的 TypeScript 类型定义
- ✅ **自动导入**: 通过工具函数自动加载 API 模块
- ✅ **拦截器机制**: 统一的请求/响应处理
- ✅ **错误处理**: 完善的错误处理和重试机制
- ✅ **缓存管理**: 智能的请求缓存策略
- ✅ **性能优化**: 防抖、节流、队列管理等优化
- ✅ **开发友好**: 丰富的调试信息和开发工具

通过统一的架构设计和最佳实践，确保 API 管理的可维护性和开发效率！🚀
