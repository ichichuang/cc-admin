<!--
  @copyright Copyright (c) 2025 chichuang
  @license MIT
  @description CC-Admin 企业级后台管理框架 - 状态管理文档
  本文件为 chichuang 原创，禁止擅自删除署名或用于商业用途。
-->

# 状态管理文档

CC-Admin 使用 Pinia 进行状态管理，提供类型安全、响应式的状态管理解决方案。

## 📋 状态管理规范

### 基本原则

- **类型安全**: 所有状态都有完整的 TypeScript 类型定义
- **模块化**: 按功能模块组织 store 文件
- **响应式**: 使用 Pinia 的响应式特性
- **持久化**: 支持状态持久化到 localStorage
- **组合式**: 使用 Composition API 风格

### 文件组织

```
src/stores/
├── index.ts              # Store 入口文件
├── modules/              # Store 模块目录
│   ├── app.ts            # 应用状态
│   ├── user.ts           # 用户状态
│   ├── layout.ts         # 布局状态
│   ├── permission.ts     # 权限状态
│   ├── locale.ts         # 国际化状态
│   ├── color.ts          # 主题状态
│   └── size.ts           # 尺寸状态
└── types/                # Store 类型定义
    ├── app.ts            # 应用类型
    ├── user.ts           # 用户类型
    └── common.ts         # 通用类型
```

## 🚀 快速开始

### 基础配置

```typescript
// src/stores/index.ts
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

const pinia = createPinia()

// 配置持久化插件
pinia.use(piniaPluginPersistedstate)

export default pinia

// 导出所有 store
export * from './modules/app'
export * from './modules/user'
export * from './modules/layout'
export * from './modules/permission'
export * from './modules/locale'
export * from './modules/color'
export * from './modules/size'
```

### Store 模块定义

```typescript
// src/stores/modules/user.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { User, LoginRequest, LoginResponse } from '@/stores/types/user'

export const useUserStore = defineStore(
  'user',
  () => {
    // 状态
    const user = ref<User | null>(null)
    const token = ref<string | null>(null)
    const refreshToken = ref<string | null>(null)
    const loading = ref(false)

    // 计算属性
    const isLoggedIn = computed(() => !!token.value)
    const userRoles = computed(() => user.value?.roles || [])
    const userPermissions = computed(() => user.value?.permissions || [])

    // 方法
    const setUser = (userData: User) => {
      user.value = userData
    }

    const setToken = (tokenData: string) => {
      token.value = tokenData
    }

    const login = async (credentials: LoginRequest): Promise<LoginResponse> => {
      loading.value = true
      try {
        // 调用登录 API
        const response = await loginApi(credentials)

        // 保存用户信息和 token
        setUser(response.user)
        setToken(response.token)
        refreshToken.value = response.refreshToken

        return response
      } finally {
        loading.value = false
      }
    }

    const logout = () => {
      user.value = null
      token.value = null
      refreshToken.value = null
    }

    const hasRole = (roles: string | string[]): boolean => {
      const userRolesList = userRoles.value
      const checkRoles = Array.isArray(roles) ? roles : [roles]
      return checkRoles.some(role => userRolesList.includes(role))
    }

    const hasPermission = (permissions: string | string[]): boolean => {
      const userPermissionsList = userPermissions.value
      const checkPermissions = Array.isArray(permissions) ? permissions : [permissions]
      return checkPermissions.some(permission => userPermissionsList.includes(permission))
    }

    return {
      // 状态
      user,
      token,
      refreshToken,
      loading,

      // 计算属性
      isLoggedIn,
      userRoles,
      userPermissions,

      // 方法
      setUser,
      setToken,
      login,
      logout,
      hasRole,
      hasPermission,
    }
  },
  {
    persist: {
      key: 'user-store',
      storage: localStorage,
      paths: ['user', 'token', 'refreshToken'],
    },
  }
)
```

## 📝 Store 使用示例

### 基础用法

```vue
<template>
  <div class="store-demo">
    <div
      v-if="userStore.isLoggedIn"
      class="user-info"
    >
      <h3>用户信息</h3>
      <p>用户名: {{ userStore.user?.username }}</p>
      <p>邮箱: {{ userStore.user?.email }}</p>
      <p>角色: {{ userStore.userRoles.join(', ') }}</p>

      <button
        @click="handleLogout"
        :disabled="userStore.loading"
      >
        {{ userStore.loading ? '退出中...' : '退出登录' }}
      </button>
    </div>

    <div
      v-else
      class="login-form"
    >
      <h3>登录</h3>
      <input
        v-model="username"
        placeholder="用户名"
      />
      <input
        v-model="password"
        type="password"
        placeholder="密码"
      />
      <button
        @click="handleLogin"
        :disabled="userStore.loading"
      >
        {{ userStore.loading ? '登录中...' : '登录' }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useUserStore } from '@/stores/modules/user'

const userStore = useUserStore()
const username = ref('')
const password = ref('')

const handleLogin = async () => {
  try {
    await userStore.login({
      username: username.value,
      password: password.value,
    })
    console.log('登录成功')
  } catch (error) {
    console.error('登录失败:', error)
  }
}

const handleLogout = () => {
  userStore.logout()
  console.log('退出登录')
}
</script>
```

### 高级用法

```vue
<template>
  <div class="advanced-store-demo">
    <!-- 主题切换 -->
    <div class="theme-section">
      <h3>主题设置</h3>
      <button @click="toggleTheme">
        切换到 {{ colorStore.getCurrentMode === 'dark' ? '浅色' : '深色' }} 主题
      </button>
      <div class="color-palette">
        <button
          v-for="color in themeColors"
          :key="color.name"
          :class="['color-btn', { active: colorStore.getCurrentThemeColor === color.value }]"
          :style="{ backgroundColor: color.value }"
          @click="setThemeColor(color.value)"
        >
          {{ color.name }}
        </button>
      </div>
    </div>

    <!-- 布局设置 -->
    <div class="layout-section">
      <h3>布局设置</h3>
      <div class="layout-options">
        <label>
          <input
            type="checkbox"
            v-model="layoutStore.getCollapsed"
            @change="layoutStore.setCollapsed"
          />
          侧边栏折叠
        </label>
        <label>
          <input
            type="checkbox"
            v-model="layoutStore.getShowBreadcrumb"
            @change="layoutStore.setShowBreadcrumb"
          />
          显示面包屑
        </label>
      </div>
    </div>

    <!-- 国际化 -->
    <div class="locale-section">
      <h3>语言设置</h3>
      <select
        v-model="currentLocale"
        @change="changeLocale"
      >
        <option value="zh-CN">中文</option>
        <option value="en-US">English</option>
        <option value="zh-TW">繁體中文</option>
      </select>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useColorStore } from '@/stores/modules/color'
import { useLayoutStore } from '@/stores/modules/layout'
import { useLocaleStore } from '@/stores/modules/locale'

const colorStore = useColorStore()
const layoutStore = useLayoutStore()
const localeStore = useLocaleStore()

const currentLocale = ref(localeStore.getCurrentLocale)

const themeColors = [
  { name: '蓝色', value: '#1890ff' },
  { name: '绿色', value: '#52c41a' },
  { name: '橙色', value: '#fa8c16' },
  { name: '红色', value: '#f5222d' },
  { name: '紫色', value: '#722ed1' },
]

const toggleTheme = () => {
  const newMode = colorStore.getCurrentMode === 'dark' ? 'light' : 'dark'
  colorStore.setCurrentMode(newMode)
}

const setThemeColor = (color: string) => {
  colorStore.setCurrentThemeColor(color)
}

const changeLocale = (event: Event) => {
  const locale = (event.target as HTMLSelectElement).value
  localeStore.setCurrentLocale(locale)
}
</script>
```

### 组合式 Store

```vue
<template>
  <div class="composable-store-demo">
    <div class="app-status">
      <h3>应用状态</h3>
      <p>加载状态: {{ appStore.getIsLoading ? '加载中' : '就绪' }}</p>
      <p>错误信息: {{ appStore.getError || '无错误' }}</p>
      <p>在线状态: {{ appStore.getIsOnline ? '在线' : '离线' }}</p>
    </div>

    <div class="permission-demo">
      <h3>权限演示</h3>
      <div
        v-if="permissionStore.hasRole('admin')"
        class="admin-only"
      >
        <p>管理员专属内容</p>
        <button @click="adminAction">管理员操作</button>
      </div>

      <div
        v-if="permissionStore.hasPermission('user:create')"
        class="create-permission"
      >
        <p>创建用户权限</p>
        <button @click="createUser">创建用户</button>
      </div>

      <div
        v-if="permissionStore.hasPermission('user:delete')"
        class="delete-permission"
      >
        <p>删除用户权限</p>
        <button @click="deleteUser">删除用户</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useAppStore } from '@/stores/modules/app'
import { usePermissionStore } from '@/stores/modules/permission'

const appStore = useAppStore()
const permissionStore = usePermissionStore()

const adminAction = () => {
  appStore.setLoading(true)
  setTimeout(() => {
    console.log('管理员操作执行')
    appStore.setLoading(false)
  }, 1000)
}

const createUser = () => {
  console.log('创建用户')
}

const deleteUser = () => {
  console.log('删除用户')
}

onMounted(() => {
  // 初始化应用状态
  appStore.initialize()
})
</script>
```

## 🔧 Store 配置

### 类型定义

```typescript
// src/stores/types/user.ts
export interface User {
  id: string
  username: string
  email: string
  avatar?: string
  roles: string[]
  permissions: string[]
  lastLoginTime?: string
}

export interface LoginRequest {
  username: string
  password: string
  remember?: boolean
}

export interface LoginResponse {
  user: User
  token: string
  refreshToken: string
  expiresIn: number
}

export interface UserState {
  user: User | null
  token: string | null
  refreshToken: string | null
  loading: boolean
}
```

### 持久化配置

```typescript
// src/stores/modules/user.ts
export const useUserStore = defineStore(
  'user',
  () => {
    // ... store 实现
  },
  {
    persist: {
      key: 'user-store',
      storage: localStorage,
      paths: ['user', 'token', 'refreshToken'], // 只持久化指定字段
      serializer: {
        serialize: value => JSON.stringify(value),
        deserialize: value => JSON.parse(value),
      },
    },
  }
)
```

### Store 组合

```typescript
// src/stores/composables/useAuth.ts
import { computed } from 'vue'
import { useUserStore } from '@/stores/modules/user'
import { usePermissionStore } from '@/stores/modules/permission'

export function useAuth() {
  const userStore = useUserStore()
  const permissionStore = usePermissionStore()

  const isAuthenticated = computed(() => userStore.isLoggedIn)
  const currentUser = computed(() => userStore.user)
  const userRoles = computed(() => userStore.userRoles)
  const userPermissions = computed(() => userStore.userPermissions)

  const hasRole = (roles: string | string[]) => {
    return userStore.hasRole(roles)
  }

  const hasPermission = (permissions: string | string[]) => {
    return userStore.hasPermission(permissions)
  }

  const login = async (credentials: LoginRequest) => {
    const result = await userStore.login(credentials)
    // 登录成功后初始化权限
    await permissionStore.initializePermissions()
    return result
  }

  const logout = () => {
    userStore.logout()
    permissionStore.clearPermissions()
  }

  return {
    isAuthenticated,
    currentUser,
    userRoles,
    userPermissions,
    hasRole,
    hasPermission,
    login,
    logout,
  }
}
```

## 🎯 最佳实践

### Store 模块化

```typescript
// src/stores/modules/app.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAppStore = defineStore('app', () => {
  const loading = ref(false)
  const error = ref<string | null>(null)
  const isOnline = ref(navigator.onLine)

  const isLoading = computed(() => loading.value)
  const hasError = computed(() => !!error.value)

  const setLoading = (value: boolean) => {
    loading.value = value
  }

  const setError = (message: string | null) => {
    error.value = message
  }

  const clearError = () => {
    error.value = null
  }

  const initialize = () => {
    // 监听在线状态
    window.addEventListener('online', () => {
      isOnline.value = true
    })
    window.addEventListener('offline', () => {
      isOnline.value = false
    })
  }

  return {
    loading,
    error,
    isOnline,
    isLoading,
    hasError,
    setLoading,
    setError,
    clearError,
    initialize,
  }
})
```

### 异步操作处理

```typescript
// src/stores/modules/user.ts
export const useUserStore = defineStore('user', () => {
  const loading = ref(false)
  const error = ref<string | null>(null)

  const login = async (credentials: LoginRequest) => {
    loading.value = true
    error.value = null

    try {
      const response = await loginApi(credentials)
      setUser(response.user)
      setToken(response.token)
      return response
    } catch (err) {
      error.value = err instanceof Error ? err.message : '登录失败'
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    loading,
    error,
    login,
  }
})
```

### Store 测试

```typescript
// tests/stores/user.test.ts
import { setActivePinia, createPinia } from 'pinia'
import { useUserStore } from '@/stores/modules/user'

describe('User Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('should initialize with default state', () => {
    const store = useUserStore()
    expect(store.user).toBeNull()
    expect(store.token).toBeNull()
    expect(store.isLoggedIn).toBe(false)
  })

  it('should set user and token on login', async () => {
    const store = useUserStore()
    const mockUser = { id: '1', username: 'test' }
    const mockToken = 'mock-token'

    store.setUser(mockUser)
    store.setToken(mockToken)

    expect(store.user).toEqual(mockUser)
    expect(store.token).toBe(mockToken)
    expect(store.isLoggedIn).toBe(true)
  })
})
```

## 📚 相关文档

- [组件文档](../components/README.md)
- [API 文档](../api/README.md)
- [路由文档](../router/README.md)
- [开发规范](../development/README.md)
