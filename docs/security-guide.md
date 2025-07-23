# 安全和权限管理指南

## 概述

CC-Admin 采用多层次的安全架构，包括身份认证、权限控制、数据安全、前端安全防护等方面，确保企业级应用的安全性和数据保护。

## 🔐 身份认证系统

### JWT 认证架构

```typescript
// JWT 认证配置
interface AuthConfig {
  // Token 配置
  token: {
    accessTokenKey: 'access_token'
    refreshTokenKey: 'refresh_token'
    tokenExpiry: 15 * 60 * 1000      // 15分钟
    refreshExpiry: 7 * 24 * 60 * 60 * 1000  // 7天
  }

  // 加密配置
  encryption: {
    algorithm: 'HS256'
    secret: process.env.JWT_SECRET
  }
}

// 认证状态管理
export const useAuthStore = defineStore('auth', {
  state: () => ({
    accessToken: null as string | null,
    refreshToken: null as string | null,
    user: null as UserInfo | null,
    isAuthenticated: false,
    loginTime: null as Date | null
  }),

  getters: {
    // Token 是否即将过期（5分钟内）
    isTokenExpiringSoon: (state) => {
      if (!state.loginTime) return true
      const now = new Date().getTime()
      const loginTime = new Date(state.loginTime).getTime()
      const expiry = loginTime + (15 * 60 * 1000) // 15分钟
      return (expiry - now) < (5 * 60 * 1000) // 5分钟内过期
    },

    // 用户权限列表
    userPermissions: (state) => state.user?.permissions || [],

    // 用户角色
    userRole: (state) => state.user?.role || 'guest'
  },

  actions: {
    // 登录
    async login(credentials: LoginCredentials) {
      try {
        const { data } = await authAPI.login(credentials)

        this.setTokens(data.accessToken, data.refreshToken)
        this.setUser(data.user)
        this.isAuthenticated = true
        this.loginTime = new Date()

        // 启动Token刷新定时器
        this.startTokenRefreshTimer()

        return data
      } catch (error) {
        this.clearAuth()
        throw error
      }
    },

    // 刷新Token
    async refreshAccessToken() {
      if (!this.refreshToken) {
        throw new Error('No refresh token available')
      }

      try {
        const { data } = await authAPI.refreshToken(this.refreshToken)
        this.setTokens(data.accessToken, data.refreshToken)
        return data.accessToken
      } catch (error) {
        this.clearAuth()
        throw error
      }
    },

    // 登出
    async logout() {
      try {
        if (this.accessToken) {
          await authAPI.logout(this.accessToken)
        }
      } finally {
        this.clearAuth()
      }
    },

    // 设置Token
    setTokens(accessToken: string, refreshToken: string) {
      this.accessToken = accessToken
      this.refreshToken = refreshToken

      // 安全存储
      secureStorage.setItem('access_token', accessToken)
      secureStorage.setItem('refresh_token', refreshToken)
    },

    // 清除认证信息
    clearAuth() {
      this.accessToken = null
      this.refreshToken = null
      this.user = null
      this.isAuthenticated = false
      this.loginTime = null

      // 清除存储
      secureStorage.removeItem('access_token')
      secureStorage.removeItem('refresh_token')

      // 清除定时器
      this.stopTokenRefreshTimer()
    },

    // Token自动刷新定时器
    startTokenRefreshTimer() {
      const refreshInterval = setInterval(async () => {
        if (this.isTokenExpiringSoon && this.refreshToken) {
          try {
            await this.refreshAccessToken()
          } catch (error) {
            console.error('Token refresh failed:', error)
            this.clearAuth()
            // 跳转到登录页
            router.push('/login')
          }
        }
      }, 60 * 1000) // 每分钟检查一次

      // 存储定时器ID
      this.refreshTimerId = refreshInterval
    }
  },

  persist: {
    key: 'auth-store',
    storage: secureStorage,
    paths: ['user', 'isAuthenticated', 'loginTime']
  }
})
```

### 安全存储机制

```typescript
// 安全存储实现
class SecureStorage {
  private readonly encryptionKey: string

  constructor() {
    this.encryptionKey = this.generateEncryptionKey()
  }

  // 加密存储
  setItem(key: string, value: string): void {
    try {
      const encrypted = this.encrypt(value)
      localStorage.setItem(key, encrypted)
    } catch (error) {
      console.error('Failed to encrypt and store data:', error)
    }
  }

  // 解密读取
  getItem(key: string): string | null {
    try {
      const encrypted = localStorage.getItem(key)
      if (!encrypted) return null

      return this.decrypt(encrypted)
    } catch (error) {
      console.error('Failed to decrypt stored data:', error)
      return null
    }
  }

  // 删除数据
  removeItem(key: string): void {
    localStorage.removeItem(key)
  }

  // 加密方法（简化实现，生产环境建议使用更强的加密）
  private encrypt(text: string): string {
    // 使用Web Crypto API或第三方加密库
    return btoa(text) // 简化示例，实际应使用真正的加密
  }

  // 解密方法
  private decrypt(encryptedText: string): string {
    return atob(encryptedText) // 简化示例
  }

  // 生成加密密钥
  private generateEncryptionKey(): string {
    return crypto.randomUUID() + Date.now()
  }
}

export const secureStorage = new SecureStorage()
```

## 🛡️ 权限控制系统

### RBAC 权限模型

```typescript
// 权限系统类型定义
interface Permission {
  id: string
  name: string
  resource: string // 资源标识
  action: string // 操作类型
  conditions?: object // 权限条件
}

interface Role {
  id: string
  name: string
  permissions: Permission[]
  level: number // 角色等级
}

interface UserInfo {
  id: string
  username: string
  roles: Role[]
  permissions: Permission[] // 直接分配的权限
}

// 权限管理Store
export const usePermissionStore = defineStore('permission', {
  state: () => ({
    userPermissions: [] as Permission[],
    userRoles: [] as Role[],
    permissionTree: null as PermissionTree | null,
  }),

  getters: {
    // 获取所有权限（角色权限 + 直接权限）
    allPermissions: state => {
      const rolePermissions = state.userRoles.flatMap(role => role.permissions)

      return [...rolePermissions, ...state.userPermissions].filter(
        (permission, index, self) => self.findIndex(p => p.id === permission.id) === index
      )
    },

    // 检查是否有特定权限
    hasPermission: state => (resource: string, action: string) => {
      return state.allPermissions.some(
        permission => permission.resource === resource && permission.action === action
      )
    },

    // 检查是否有任一权限
    hasAnyPermission: state => (permissions: string[]) => {
      return permissions.some(permission => {
        const [resource, action] = permission.split(':')
        return state.hasPermission(resource, action)
      })
    },

    // 检查角色等级
    hasRoleLevel: state => (minLevel: number) => {
      return state.userRoles.some(role => role.level >= minLevel)
    },
  },

  actions: {
    // 设置用户权限
    setUserPermissions(permissions: Permission[], roles: Role[]) {
      this.userPermissions = permissions
      this.userRoles = roles
    },

    // 检查页面权限
    checkPagePermission(routeMeta: RouteMeta): boolean {
      if (!routeMeta.permissions) return true

      return this.hasAnyPermission(routeMeta.permissions)
    },

    // 检查操作权限
    checkActionPermission(action: string): boolean {
      const [resource, operation] = action.split(':')
      return this.hasPermission(resource, operation)
    },
  },
})
```

### 路由权限守卫

```typescript
// 路由权限中间件
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()
  const permissionStore = usePermissionStore()

  // 1. 检查登录状态
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next({
      path: '/login',
      query: { redirect: to.fullPath },
    })
    return
  }

  // 2. 检查页面权限
  if (to.meta.permissions) {
    const hasPermission = permissionStore.checkPagePermission(to.meta)

    if (!hasPermission) {
      next('/403') // 无权限页面
      return
    }
  }

  // 3. 检查角色等级
  if (to.meta.minRoleLevel) {
    const hasRoleLevel = permissionStore.hasRoleLevel(to.meta.minRoleLevel)

    if (!hasRoleLevel) {
      next('/403')
      return
    }
  }

  // 4. 动态路由权限（根据用户权限动态生成路由）
  if (to.meta.dynamic) {
    const dynamicRoutes = await generateDynamicRoutes(permissionStore.allPermissions)

    // 添加动态路由
    dynamicRoutes.forEach(route => {
      router.addRoute(route)
    })
  }

  next()
})

// 动态路由生成
const generateDynamicRoutes = async (permissions: Permission[]) => {
  const routes: RouteRecordRaw[] = []

  // 根据权限生成路由
  permissions.forEach(permission => {
    if (permission.resource === 'page' && permission.action === 'view') {
      const route = {
        path: `/dynamic/${permission.id}`,
        component: () => import(`@/views/dynamic/${permission.id}.vue`),
        meta: {
          title: permission.name,
          permissions: [`${permission.resource}:${permission.action}`],
        },
      }
      routes.push(route)
    }
  })

  return routes
}
```

### 组件级权限控制

```vue
<!-- 权限组件包装器 -->
<script setup lang="ts">
interface Props {
  permission?: string
  permissions?: string[]
  role?: string
  roles?: string[]
  fallback?: string
  hideWhenNoPermission?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  hideWhenNoPermission: false,
  fallback: '无权限访问',
})

const permissionStore = usePermissionStore()

// 权限检查
const hasPermission = computed(() => {
  // 检查单个权限
  if (props.permission) {
    const [resource, action] = props.permission.split(':')
    return permissionStore.hasPermission(resource, action)
  }

  // 检查多个权限（任一满足）
  if (props.permissions) {
    return permissionStore.hasAnyPermission(props.permissions)
  }

  return true
})

// 角色检查
const hasRole = computed(() => {
  if (props.role) {
    return permissionStore.userRoles.some(r => r.name === props.role)
  }

  if (props.roles) {
    return permissionStore.userRoles.some(r => props.roles!.includes(r.name))
  }

  return true
})

// 最终权限判断
const canAccess = computed(() => hasPermission.value && hasRole.value)
</script>

<template>
  <div v-if="canAccess">
    <slot />
  </div>

  <div
    v-else-if="!hideWhenNoPermission"
    class="no-permission"
  >
    <slot name="fallback">
      {{ fallback }}
    </slot>
  </div>
</template>
```

```vue
<!-- 使用权限组件 -->
<template>
  <div>
    <!-- 基于权限显示按钮 -->
    <PermissionWrapper permission="user:create">
      <button @click="createUser">创建用户</button>
    </PermissionWrapper>

    <!-- 基于多个权限 -->
    <PermissionWrapper :permissions="['user:edit', 'user:delete']">
      <button @click="editUser">编辑用户</button>
    </PermissionWrapper>

    <!-- 基于角色 -->
    <PermissionWrapper role="admin">
      <AdminPanel />
    </PermissionWrapper>

    <!-- 无权限时隐藏 -->
    <PermissionWrapper
      permission="system:config"
      :hide-when-no-permission="true"
    >
      <SystemConfig />
    </PermissionWrapper>
  </div>
</template>
```

## 🔒 数据安全

### API 安全

```typescript
// HTTP请求拦截器
const securityInterceptor = {
  // 请求拦截
  request: (config: RequestConfig) => {
    const authStore = useAuthStore()

    // 1. 添加认证头
    if (authStore.accessToken) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${authStore.accessToken}`,
      }
    }

    // 2. 请求签名（防篡改）
    if (config.data) {
      const signature = generateRequestSignature(config.data)
      config.headers['X-Request-Signature'] = signature
    }

    // 3. 请求时间戳（防重放攻击）
    config.headers['X-Timestamp'] = Date.now().toString()

    // 4. 请求ID（防重复请求）
    config.headers['X-Request-ID'] = crypto.randomUUID()

    return config
  },

  // 响应拦截
  response: (response: ResponseType) => {
    // 1. 验证响应签名
    const signature = response.headers['X-Response-Signature']
    if (signature && !verifyResponseSignature(response.data, signature)) {
      throw new Error('Response signature verification failed')
    }

    // 2. 检查响应时效性
    const serverTime = response.headers['X-Server-Time']
    if (serverTime) {
      const timeDiff = Math.abs(Date.now() - parseInt(serverTime))
      if (timeDiff > 5 * 60 * 1000) {
        // 5分钟
        throw new Error('Response timestamp is too old')
      }
    }

    return response
  },

  // 错误处理
  error: (error: any) => {
    const authStore = useAuthStore()

    if (error.response?.status === 401) {
      // Token过期，尝试刷新
      return authStore
        .refreshAccessToken()
        .then(() => {
          // 重新发送原请求
          return request(error.config)
        })
        .catch(() => {
          // 刷新失败，跳转登录
          authStore.clearAuth()
          router.push('/login')
          throw error
        })
    }

    throw error
  },
}
```

### 数据加密

```typescript
// 敏感数据加密工具
class DataEncryption {
  private readonly key: CryptoKey

  constructor() {
    this.initializeKey()
  }

  // 初始化加密密钥
  private async initializeKey() {
    this.key = await crypto.subtle.generateKey(
      {
        name: 'AES-GCM',
        length: 256,
      },
      true,
      ['encrypt', 'decrypt']
    )
  }

  // 加密敏感数据
  async encryptSensitiveData(data: string): Promise<string> {
    const encoder = new TextEncoder()
    const dataBuffer = encoder.encode(data)

    const iv = crypto.getRandomValues(new Uint8Array(12))

    const encryptedBuffer = await crypto.subtle.encrypt(
      {
        name: 'AES-GCM',
        iv: iv,
      },
      this.key,
      dataBuffer
    )

    // 组合IV和加密数据
    const combined = new Uint8Array(iv.length + encryptedBuffer.byteLength)
    combined.set(iv)
    combined.set(new Uint8Array(encryptedBuffer), iv.length)

    return btoa(String.fromCharCode(...combined))
  }

  // 解密敏感数据
  async decryptSensitiveData(encryptedData: string): Promise<string> {
    const combined = new Uint8Array(
      atob(encryptedData)
        .split('')
        .map(char => char.charCodeAt(0))
    )

    const iv = combined.slice(0, 12)
    const data = combined.slice(12)

    const decryptedBuffer = await crypto.subtle.decrypt(
      {
        name: 'AES-GCM',
        iv: iv,
      },
      this.key,
      data
    )

    const decoder = new TextDecoder()
    return decoder.decode(decryptedBuffer)
  }
}

export const dataEncryption = new DataEncryption()
```

## 🛡️ 前端安全防护

### XSS 防护

```typescript
// XSS 防护工具
class XSSProtection {
  // HTML 实体编码
  static escapeHtml(unsafe: string): string {
    return unsafe
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;')
  }

  // URL 编码
  static escapeUrl(url: string): string {
    return encodeURIComponent(url)
  }

  // JavaScript 字符串转义
  static escapeJS(str: string): string {
    return str
      .replace(/\\/g, '\\\\')
      .replace(/'/g, "\\'")
      .replace(/"/g, '\\"')
      .replace(/\n/g, '\\n')
      .replace(/\r/g, '\\r')
      .replace(/\t/g, '\\t')
  }

  // 清理危险标签
  static sanitizeHtml(html: string): string {
    const dangerousTags = ['script', 'iframe', 'object', 'embed', 'link', 'style', 'meta', 'form']

    let sanitized = html

    dangerousTags.forEach(tag => {
      const regex = new RegExp(`<${tag}[^>]*>.*?</${tag}>`, 'gi')
      sanitized = sanitized.replace(regex, '')

      const selfClosingRegex = new RegExp(`<${tag}[^>]*/>`, 'gi')
      sanitized = sanitized.replace(selfClosingRegex, '')
    })

    return sanitized
  }

  // 验证和清理用户输入
  static validateAndCleanInput(input: string, type: 'html' | 'url' | 'js' = 'html'): string {
    if (!input || typeof input !== 'string') {
      return ''
    }

    switch (type) {
      case 'html':
        return this.sanitizeHtml(this.escapeHtml(input))
      case 'url':
        return this.escapeUrl(input)
      case 'js':
        return this.escapeJS(input)
      default:
        return this.escapeHtml(input)
    }
  }
}

// Vue 插件形式使用
const xssProtectionPlugin = {
  install(app: App) {
    app.config.globalProperties.$xss = XSSProtection

    // 全局过滤器
    app.config.globalProperties.$filters = {
      escapeHtml: XSSProtection.escapeHtml,
      sanitizeHtml: XSSProtection.sanitizeHtml,
    }
  },
}
```

### CSP 内容安全策略

```typescript
// CSP 配置
export const cspConfig = {
  // 开发环境 CSP
  development: {
    'default-src': ["'self'"],
    'script-src': [
      "'self'",
      "'unsafe-eval'", // Vite HMR 需要
      "'unsafe-inline'", // 开发环境允许内联脚本
    ],
    'style-src': [
      "'self'",
      "'unsafe-inline'", // 样式内联
      'https://fonts.googleapis.com',
    ],
    'img-src': ["'self'", 'data:', 'https:'],
    'font-src': ["'self'", 'https://fonts.gstatic.com'],
    'connect-src': [
      "'self'",
      'ws://localhost:*', // HMR WebSocket
      'http://localhost:*',
    ],
  },

  // 生产环境 CSP
  production: {
    'default-src': ["'self'"],
    'script-src': [
      "'self'",
      // 只允许特定的外部脚本域名
      'https://cdn.example.com',
    ],
    'style-src': [
      "'self'",
      'https://fonts.googleapis.com',
      "'sha256-HASH_OF_INLINE_STYLES'", // 内联样式哈希
    ],
    'img-src': ["'self'", 'data:', 'https://cdn.example.com'],
    'font-src': ["'self'", 'https://fonts.gstatic.com'],
    'connect-src': ["'self'", 'https://api.example.com'],
    'frame-ancestors': ["'none'"], // 防止页面被嵌入
    'base-uri': ["'self'"], // 限制 base 标签
    'object-src': ["'none'"], // 禁止 object/embed
    'upgrade-insecure-requests': true, // 自动升级到 HTTPS
  },
}

// 动态设置 CSP
const setCSP = () => {
  const env = import.meta.env.PROD ? 'production' : 'development'
  const config = cspConfig[env]

  const cspString = Object.entries(config)
    .map(([directive, sources]) => {
      if (typeof sources === 'boolean') {
        return sources ? directive : ''
      }
      return `${directive} ${sources.join(' ')}`
    })
    .filter(Boolean)
    .join('; ')

  // 设置 CSP meta 标签
  const metaTag = document.createElement('meta')
  metaTag.httpEquiv = 'Content-Security-Policy'
  metaTag.content = cspString
  document.head.appendChild(metaTag)
}
```

### CSRF 防护

```typescript
// CSRF Token 管理
class CSRFProtection {
  private token: string | null = null

  // 获取 CSRF Token
  async getCSRFToken(): Promise<string> {
    if (this.token) {
      return this.token
    }

    try {
      const response = await fetch('/api/csrf-token', {
        method: 'GET',
        credentials: 'include',
      })

      const data = await response.json()
      this.token = data.token

      return this.token
    } catch (error) {
      console.error('Failed to get CSRF token:', error)
      throw error
    }
  }

  // 验证请求是否需要 CSRF Token
  private needsCSRFToken(method: string): boolean {
    const safeMethods = ['GET', 'HEAD', 'OPTIONS', 'TRACE']
    return !safeMethods.includes(method.toUpperCase())
  }

  // HTTP 拦截器
  interceptor = async (config: RequestConfig) => {
    if (this.needsCSRFToken(config.method || 'GET')) {
      const token = await this.getCSRFToken()
      config.headers = {
        ...config.headers,
        'X-CSRF-Token': token,
      }
    }

    return config
  }

  // 清除 Token（登出时调用）
  clearToken(): void {
    this.token = null
  }
}

export const csrfProtection = new CSRFProtection()
```

## 🔍 安全监控

### 安全事件监控

```typescript
// 安全事件监控
class SecurityMonitor {
  private events: SecurityEvent[] = []
  private maxEvents = 1000

  // 记录安全事件
  logEvent(event: SecurityEvent): void {
    const eventWithTimestamp = {
      ...event,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      ip: this.getClientIP(),
    }

    this.events.unshift(eventWithTimestamp)

    // 限制事件数量
    if (this.events.length > this.maxEvents) {
      this.events = this.events.slice(0, this.maxEvents)
    }

    // 严重事件立即上报
    if (event.severity === 'high') {
      this.reportSecurityEvent(eventWithTimestamp)
    }
  }

  // 登录失败监控
  trackLoginFailure(username: string, reason: string): void {
    this.logEvent({
      type: 'auth_failure',
      severity: 'medium',
      details: {
        username,
        reason,
        attempts: this.getLoginAttempts(username),
      },
    })

    // 检查是否需要锁定账户
    const attempts = this.getLoginAttempts(username)
    if (attempts >= 5) {
      this.logEvent({
        type: 'account_locked',
        severity: 'high',
        details: { username, attempts },
      })
    }
  }

  // 权限违规监控
  trackPermissionViolation(action: string, resource: string): void {
    this.logEvent({
      type: 'permission_violation',
      severity: 'high',
      details: {
        action,
        resource,
        userId: this.getCurrentUserId(),
      },
    })
  }

  // 异常请求监控
  trackSuspiciousRequest(request: RequestDetails): void {
    this.logEvent({
      type: 'suspicious_request',
      severity: 'medium',
      details: request,
    })
  }

  // 上报安全事件
  private async reportSecurityEvent(event: SecurityEvent): Promise<void> {
    try {
      await fetch('/api/security/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(event),
      })
    } catch (error) {
      console.error('Failed to report security event:', error)
    }
  }

  // 获取登录尝试次数
  private getLoginAttempts(username: string): number {
    const recentEvents = this.events.filter(
      event =>
        event.type === 'auth_failure' &&
        event.details?.username === username &&
        this.isRecentEvent(event.timestamp)
    )

    return recentEvents.length
  }

  // 检查是否为近期事件（1小时内）
  private isRecentEvent(timestamp: string): boolean {
    const eventTime = new Date(timestamp).getTime()
    const now = new Date().getTime()
    return now - eventTime < 60 * 60 * 1000 // 1小时
  }

  // 获取客户端IP（通过代理头获取）
  private getClientIP(): string {
    // 这里需要后端配合提供真实IP
    return 'unknown'
  }

  // 获取当前用户ID
  private getCurrentUserId(): string {
    const authStore = useAuthStore()
    return authStore.user?.id || 'anonymous'
  }
}

// 安全事件类型定义
interface SecurityEvent {
  type: 'auth_failure' | 'permission_violation' | 'suspicious_request' | 'account_locked'
  severity: 'low' | 'medium' | 'high'
  details?: Record<string, any>
  timestamp?: string
  userAgent?: string
  ip?: string
}

export const securityMonitor = new SecurityMonitor()
```

## 🔐 密码安全

### 密码强度验证

```typescript
// 密码强度验证器
class PasswordValidator {
  // 密码强度规则
  private readonly rules = {
    minLength: 8,
    maxLength: 128,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSpecialChars: true,
    forbiddenPatterns: [
      /^(.)\1{2,}$/, // 重复字符
      /^(012|123|234|345|456|567|678|789|890)/, // 连续数字
      /^(abc|bcd|cde|def|efg|fgh|ghi|hij|ijk|jkl|klm|lmn|mno|nop|opq|pqr|qrs|rst|stu|tuv|uvw|vwx|wxy|xyz)/i, // 连续字母
    ],
  }

  // 常见弱密码列表
  private readonly commonPasswords = [
    'password',
    '123456',
    '12345678',
    'qwerty',
    'abc123',
    'password123',
    'admin',
    'letmein',
    'welcome',
    'monkey',
  ]

  // 验证密码强度
  validatePassword(password: string): PasswordValidationResult {
    const result: PasswordValidationResult = {
      isValid: true,
      score: 0,
      errors: [],
      suggestions: [],
    }

    // 长度检查
    if (password.length < this.rules.minLength) {
      result.errors.push(`密码长度至少${this.rules.minLength}位`)
      result.isValid = false
    }

    if (password.length > this.rules.maxLength) {
      result.errors.push(`密码长度不能超过${this.rules.maxLength}位`)
      result.isValid = false
    }

    // 字符类型检查
    if (this.rules.requireUppercase && !/[A-Z]/.test(password)) {
      result.errors.push('密码必须包含大写字母')
      result.isValid = false
    } else if (/[A-Z]/.test(password)) {
      result.score += 1
    }

    if (this.rules.requireLowercase && !/[a-z]/.test(password)) {
      result.errors.push('密码必须包含小写字母')
      result.isValid = false
    } else if (/[a-z]/.test(password)) {
      result.score += 1
    }

    if (this.rules.requireNumbers && !/\d/.test(password)) {
      result.errors.push('密码必须包含数字')
      result.isValid = false
    } else if (/\d/.test(password)) {
      result.score += 1
    }

    if (this.rules.requireSpecialChars && !/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
      result.errors.push('密码必须包含特殊字符')
      result.isValid = false
    } else if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
      result.score += 1
    }

    // 禁用模式检查
    this.rules.forbiddenPatterns.forEach(pattern => {
      if (pattern.test(password)) {
        result.errors.push('密码不能包含简单重复或连续字符')
        result.isValid = false
      }
    })

    // 常见密码检查
    if (this.commonPasswords.includes(password.toLowerCase())) {
      result.errors.push('密码过于常见，请选择更安全的密码')
      result.isValid = false
    }

    // 计算密码强度
    result.score += this.calculateComplexityScore(password)
    result.strength = this.getPasswordStrength(result.score)

    // 提供建议
    if (result.score < 6) {
      result.suggestions.push('考虑增加密码长度')
      result.suggestions.push('使用不同类型的字符组合')
    }

    return result
  }

  // 计算复杂度分数
  private calculateComplexityScore(password: string): number {
    let score = 0

    // 长度加分
    if (password.length >= 12) score += 2
    else if (password.length >= 10) score += 1

    // 字符种类多样性加分
    const charTypes = [
      /[a-z]/.test(password), // 小写字母
      /[A-Z]/.test(password), // 大写字母
      /\d/.test(password), // 数字
      /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password), // 特殊字符
    ].filter(Boolean).length

    score += charTypes

    return score
  }

  // 获取密码强度等级
  private getPasswordStrength(score: number): 'weak' | 'medium' | 'strong' | 'very-strong' {
    if (score <= 3) return 'weak'
    if (score <= 5) return 'medium'
    if (score <= 7) return 'strong'
    return 'very-strong'
  }
}

interface PasswordValidationResult {
  isValid: boolean
  score: number
  strength?: 'weak' | 'medium' | 'strong' | 'very-strong'
  errors: string[]
  suggestions: string[]
}

export const passwordValidator = new PasswordValidator()
```

## 🚨 安全最佳实践

### 1. 认证安全

- **多因素认证**: 支持短信、邮箱、TOTP等多种验证方式
- **会话管理**: 合理的会话超时和自动刷新机制
- **密码策略**: 强密码要求和定期更换提醒
- **账户锁定**: 防暴力破解的自动锁定机制

### 2. 权限安全

- **最小权限原则**: 用户只获得必要的最小权限
- **权限分离**: 敏感操作需要多重验证
- **动态权限**: 基于上下文的动态权限控制
- **权限审计**: 定期审查和清理无用权限

### 3. 数据安全

- **数据分类**: 根据敏感程度分类处理
- **加密存储**: 敏感数据加密存储
- **安全传输**: HTTPS和数据传输加密
- **数据脱敏**: 日志中敏感信息脱敏

### 4. 前端安全

- **输入验证**: 严格的用户输入验证和过滤
- **输出编码**: 防止XSS攻击的输出编码
- **CSP策略**: 严格的内容安全策略
- **安全头**: 完整的HTTP安全头配置

### 5. 监控告警

- **实时监控**: 安全事件的实时监控
- **异常检测**: 基于行为的异常检测
- **告警机制**: 及时的安全告警通知
- **应急响应**: 完善的安全事件响应流程

通过这套完整的安全体系，CC-Admin 能够有效防范各种安全威胁，保护企业数据和用户隐私的安全。
