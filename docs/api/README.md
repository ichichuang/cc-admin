<!--
  @copyright Copyright (c) 2025 chichuang
  @license MIT
  @description CC-Admin 企业级后台管理框架 - API文档
  本文件为 chichuang 原创，禁止擅自删除署名或用于商业用途。
-->

# API 文档

CC-Admin 使用 Alova 作为 HTTP 客户端，提供现代化的请求策略和缓存管理。

## 📋 API 规范

### 基本原则

- **类型安全**: 所有 API 请求都有完整的 TypeScript 类型定义
- **统一接口**: 使用统一的请求/响应格式
- **错误处理**: 完善的错误处理机制
- **缓存策略**: 智能的缓存和请求去重
- **拦截器**: 统一的请求/响应拦截器

### 文件组织

```
src/api/
├── index.ts              # API 入口文件
├── modules/              # API 模块目录
│   ├── auth.ts           # 认证相关 API
│   ├── user.ts           # 用户相关 API
│   └── common.ts         # 通用 API
└── types/                # API 类型定义
    ├── auth.ts           # 认证类型
    ├── user.ts           # 用户类型
    └── common.ts         # 通用类型
```

## 🚀 快速开始

### 基础配置

```typescript
// src/api/index.ts
import { createAlova } from 'alova'
import { VueHook } from 'alova/vue'
import { GlobalFetch } from 'alova/globalFetch'

const alova = createAlova({
  statesHook: VueHook,
  requestAdapter: GlobalFetch(),
  baseURL: import.meta.env.VITE_API_BASE_URL,
  beforeRequest: config => {
    // 添加认证头
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
  },
  responded: response => {
    // 统一响应处理
    if (response.status >= 400) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }
    return response.json()
  },
})

export default alova
```

### 创建 API 模块

```typescript
// src/api/modules/auth.ts
import { defineRequest } from '@/api'
import type { LoginRequest, LoginResponse, UserInfo } from '@/api/types/auth'

// 登录接口
export const login = defineRequest<LoginRequest, LoginResponse>({
  url: '/auth/login',
  method: 'POST',
})

// 获取用户信息
export const getUserInfo = defineRequest<void, UserInfo>({
  url: '/auth/user-info',
  method: 'GET',
  cache: {
    mode: 'memory',
    expire: 5 * 60 * 1000, // 5分钟缓存
  },
})

// 退出登录
export const logout = defineRequest<void, void>({
  url: '/auth/logout',
  method: 'POST',
})
```

## 📝 API 使用示例

### 基础请求

```vue
<template>
  <div class="api-demo">
    <button
      @click="handleLogin"
      :disabled="loading"
    >
      {{ loading ? '登录中...' : '登录' }}
    </button>
    <div v-if="userInfo">
      <h3>用户信息</h3>
      <p>用户名: {{ userInfo.username }}</p>
      <p>邮箱: {{ userInfo.email }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRequest } from 'alova/vue'
import { login, getUserInfo } from '@/api/modules/auth'
import type { UserInfo } from '@/api/types/auth'

const loading = ref(false)
const userInfo = ref<UserInfo | null>(null)

// 使用 useRequest 进行请求
const { send: sendLogin } = useRequest(login, {
  immediate: false,
  onSuccess: data => {
    console.log('登录成功:', data)
    // 保存 token
    localStorage.setItem('token', data.token)
    // 获取用户信息
    fetchUserInfo()
  },
  onError: error => {
    console.error('登录失败:', error)
  },
})

const { send: fetchUserInfo } = useRequest(getUserInfo, {
  immediate: false,
  onSuccess: data => {
    userInfo.value = data
  },
})

const handleLogin = async () => {
  loading.value = true
  try {
    await sendLogin({
      username: 'admin',
      password: '123456',
    })
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  // 页面加载时获取用户信息
  fetchUserInfo()
})
</script>
```

### 高级用法

```vue
<template>
  <div class="advanced-api-demo">
    <!-- 用户列表 -->
    <div class="user-list">
      <div
        v-for="user in users"
        :key="user.id"
        class="user-item"
      >
        <h4>{{ user.name }}</h4>
        <p>{{ user.email }}</p>
        <button
          @click="updateUser(user.id)"
          :disabled="updating === user.id"
        >
          更新
        </button>
        <button
          @click="deleteUser(user.id)"
          :disabled="deleting === user.id"
        >
          删除
        </button>
      </div>
    </div>

    <!-- 分页 -->
    <div class="pagination">
      <button
        @click="prevPage"
        :disabled="currentPage === 1"
      >
        上一页
      </button>
      <span>{{ currentPage }} / {{ totalPages }}</span>
      <button
        @click="nextPage"
        :disabled="currentPage === totalPages"
      >
        下一页
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRequest, useWatcher } from 'alova/vue'
import { getUsers, updateUser, deleteUser } from '@/api/modules/user'
import type { User, UserListResponse } from '@/api/types/user'

const currentPage = ref(1)
const pageSize = ref(10)
const users = ref<User[]>([])
const totalPages = ref(1)
const updating = ref<string | null>(null)
const deleting = ref<string | null>(null)

// 监听分页变化，自动重新请求
const { data: userListData, loading } = useWatcher(
  () => getUsers({ page: currentPage.value, pageSize: pageSize.value }),
  [currentPage, pageSize],
  {
    immediate: true,
    onSuccess: (data: UserListResponse) => {
      users.value = data.users
      totalPages.value = Math.ceil(data.total / pageSize.value)
    },
  }
)

const { send: sendUpdateUser } = useRequest(updateUser, {
  immediate: false,
  onSuccess: (data, { id }) => {
    console.log(`用户 ${id} 更新成功:`, data)
    // 重新获取用户列表
    userListData.value = null
  },
})

const { send: sendDeleteUser } = useRequest(deleteUser, {
  immediate: false,
  onSuccess: (data, { id }) => {
    console.log(`用户 ${id} 删除成功:`, data)
    // 重新获取用户列表
    userListData.value = null
  },
})

const updateUser = async (id: string) => {
  updating.value = id
  try {
    await sendUpdateUser({
      id,
      data: { name: 'Updated Name' },
    })
  } finally {
    updating.value = null
  }
}

const deleteUser = async (id: string) => {
  deleting.value = id
  try {
    await sendDeleteUser({ id })
  } finally {
    deleting.value = null
  }
}

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
  }
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
  }
}
</script>
```

## 🔧 类型定义

### 请求类型

```typescript
// src/api/types/auth.ts
export interface LoginRequest {
  username: string
  password: string
  remember?: boolean
}

export interface LoginResponse {
  token: string
  refreshToken: string
  expiresIn: number
}

export interface UserInfo {
  id: string
  username: string
  email: string
  avatar?: string
  roles: string[]
  permissions: string[]
}

export interface RefreshTokenRequest {
  refreshToken: string
}

export interface RefreshTokenResponse {
  token: string
  expiresIn: number
}
```

### 响应类型

```typescript
// src/api/types/common.ts
export interface ApiResponse<T = any> {
  code: number
  message: string
  data: T
  timestamp: number
}

export interface PaginationParams {
  page: number
  pageSize: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export interface PaginationResponse<T> {
  items: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

export interface ErrorResponse {
  code: number
  message: string
  details?: any
}
```

## 🎯 最佳实践

### 错误处理

```typescript
// src/api/interceptors.ts
import { createAlova } from 'alova'
import { VueHook } from 'alova/vue'
import { GlobalFetch } from 'alova/globalFetch'

const alova = createAlova({
  statesHook: VueHook,
  requestAdapter: GlobalFetch(),
  responded: {
    onSuccess: async response => {
      const data = await response.json()

      // 检查业务错误码
      if (data.code !== 0) {
        throw new Error(data.message || '请求失败')
      }

      return data.data
    },
    onError: error => {
      // 统一错误处理
      console.error('API 错误:', error)

      // 处理认证错误
      if (error.status === 401) {
        // 跳转到登录页
        window.location.href = '/login'
      }

      throw error
    },
  },
})
```

### 缓存策略

```typescript
// src/api/modules/user.ts
import { defineRequest } from '@/api'

// 用户信息缓存 10 分钟
export const getUserInfo = defineRequest<void, UserInfo>({
  url: '/user/info',
  method: 'GET',
  cache: {
    mode: 'memory',
    expire: 10 * 60 * 1000,
  },
})

// 用户列表缓存 5 分钟，支持分页
export const getUserList = defineRequest<PaginationParams, PaginationResponse<User>>({
  url: '/user/list',
  method: 'GET',
  cache: {
    mode: 'memory',
    expire: 5 * 60 * 1000,
    key: params => `user-list-${params.page}-${params.pageSize}`,
  },
})
```

### 请求去重

```typescript
// src/api/modules/common.ts
import { defineRequest } from '@/api'

// 防止重复提交
export const submitForm = defineRequest<FormData, void>({
  url: '/form/submit',
  method: 'POST',
  shareRequest: true, // 开启请求去重
  debounce: 1000, // 防抖 1 秒
})
```

## 📚 相关文档

- [组件文档](../components/README.md)
- [路由文档](../router/README.md)
- [状态管理](../stores/README.md)
- [开发规范](../development/README.md)
