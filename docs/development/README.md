<!--
  @copyright Copyright (c) 2025 chichuang
  @license MIT
  @description CC-Admin 企业级后台管理框架 - 开发规范
  本文件为 chichuang 原创，禁止擅自删除署名或用于商业用途。
-->

# 开发规范

CC-Admin 项目的开发规范和最佳实践指南。

## 📋 开发规范

### 基本原则

- **代码质量**: 遵循 TypeScript 严格模式
- **一致性**: 统一的代码风格和命名规范
- **可维护性**: 清晰的代码结构和文档注释
- **性能优化**: 合理的代码分割和懒加载
- **测试覆盖**: 完善的单元测试和集成测试

### 技术栈要求

- **Node.js**: >= 22.x
- **pnpm**: >= 8.0.0
- **Vue**: 3.5+
- **TypeScript**: 5+
- **Vite**: 7+
- **UnoCSS**: 66+

## 🚀 项目设置

### 环境配置

```bash
# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev

# 构建生产版本
pnpm build

# 代码检查
pnpm check

# 代码格式化
pnpm fix
```

### 开发工具

```json
{
  "scripts": {
    "dev": "pnpm exec tsx scripts/dev-parallel.ts",
    "build": "vue-tsc --noEmit && vite build",
    "preview": "vite preview",
    "type-check": "vue-tsc --noEmit",
    "lint": "eslint . --fix",
    "format": "prettier --write src/",
    "naming-check": "pnpm exec tsx scripts/naming-rules.ts",
    "check": "pnpm type-check && pnpm lint && pnpm naming-check"
  }
}
```

## 📝 代码规范

### TypeScript 规范

```typescript
// 类型定义
interface User {
  id: string
  username: string
  email: string
  avatar?: string
  roles: string[]
  permissions: string[]
  createdAt: string
  updatedAt: string
}

// 函数定义
const getUserById = async (id: string): Promise<User | null> => {
  try {
    const response = await api.get(`/users/${id}`)
    return response.data
  } catch (error) {
    console.error('获取用户失败:', error)
    return null
  }
}

// 泛型使用
interface ApiResponse<T> {
  code: number
  message: string
  data: T
  timestamp: number
}

// 枚举定义
enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended',
}
```

### Vue 3 组件规范

```vue
<!-- 组件模板 -->
<template>
  <div class="user-card">
    <div class="user-avatar">
      <img
        :src="user.avatar"
        :alt="user.username"
      />
    </div>
    <div class="user-info">
      <h3 class="user-name">{{ user.username }}</h3>
      <p class="user-email">{{ user.email }}</p>
      <div class="user-roles">
        <span
          v-for="role in user.roles"
          :key="role"
          class="role-tag"
        >
          {{ role }}
        </span>
      </div>
    </div>
    <div class="user-actions">
      <button
        @click="handleEdit"
        class="btn-primary"
      >
        编辑
      </button>
      <button
        @click="handleDelete"
        class="btn-error"
      >
        删除
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
// 导入
import { ref, computed } from 'vue'
import type { User } from '@/types/user'

// Props 定义
interface Props {
  user: User
  editable?: boolean
  deletable?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  editable: true,
  deletable: true,
})

// Emits 定义
interface Emits {
  (e: 'edit', user: User): void
  (e: 'delete', userId: string): void
}

const emit = defineEmits<Emits>()

// 响应式数据
const isEditing = ref(false)
const isDeleting = ref(false)

// 计算属性
const canEdit = computed(() => props.editable && !isDeleting.value)
const canDelete = computed(() => props.deletable && !isEditing.value)

// 方法
const handleEdit = () => {
  if (canEdit.value) {
    emit('edit', props.user)
  }
}

const handleDelete = async () => {
  if (canDelete.value) {
    isDeleting.value = true
    try {
      await confirmDelete()
      emit('delete', props.user.id)
    } catch (error) {
      console.error('删除失败:', error)
    } finally {
      isDeleting.value = false
    }
  }
}

const confirmDelete = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (confirm('确定要删除这个用户吗？')) {
      resolve()
    } else {
      reject(new Error('用户取消删除'))
    }
  })
}
</script>

<style scoped>
.user-card {
  @apply bg-white dark:bg-gray-800 rounded-lg shadow-md p-4;
}

.user-avatar img {
  @apply w-12 h-12 rounded-full object-cover;
}

.user-name {
  @apply text-lg font-semibold text-gray-900 dark:text-white;
}

.user-email {
  @apply text-sm text-gray-600 dark:text-gray-300;
}

.role-tag {
  @apply inline-block px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded;
}

.user-actions {
  @apply flex space-x-2 mt-4;
}
</style>
```

### 文件命名规范

```bash
# Vue 组件文件
UserCard.vue              # 组件文件使用 PascalCase
user-list.vue             # 页面文件使用 kebab-case

# TypeScript 文件
userService.ts            # 服务文件使用 camelCase
user.types.ts             # 类型文件使用 camelCase
user-utils.ts             # 工具文件使用 kebab-case

# 目录命名
src/
├── components/           # 组件目录
│   ├── common/          # 通用组件
│   └── layout/          # 布局组件
├── views/               # 页面目录
│   ├── user/            # 用户相关页面
│   └── dashboard/       # 仪表板页面
├── stores/              # 状态管理
│   └── modules/         # 模块目录
├── api/                 # API 接口
│   └── modules/         # 模块目录
└── utils/               # 工具函数
```

## 🎯 最佳实践

### 组件设计

```vue
<!-- 可复用的组件设计 -->
<template>
  <div class="data-table">
    <!-- 表格头部 -->
    <div class="table-header">
      <div class="header-left">
        <slot name="header-left">
          <h3 class="table-title">{{ title }}</h3>
        </slot>
      </div>
      <div class="header-right">
        <slot name="header-right">
          <button
            @click="handleRefresh"
            class="btn-secondary"
          >
            刷新
          </button>
        </slot>
      </div>
    </div>

    <!-- 表格内容 -->
    <div class="table-content">
      <table class="table">
        <thead>
          <tr>
            <th
              v-for="column in columns"
              :key="column.key"
              :class="column.class"
            >
              {{ column.title }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="item in data"
            :key="item.id"
            @click="handleRowClick(item)"
            :class="{ selected: selectedId === item.id }"
          >
            <td
              v-for="column in columns"
              :key="column.key"
              :class="column.class"
            >
              <slot
                :name="`cell-${column.key}`"
                :item="item"
                :value="item[column.key]"
              >
                {{ formatCellValue(item[column.key], column) }}
              </slot>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- 分页 -->
    <div
      v-if="showPagination"
      class="table-pagination"
    >
      <slot
        name="pagination"
        :pagination="pagination"
      >
        <Pagination
          v-model:current="pagination.current"
          v-model:page-size="pagination.pageSize"
          :total="pagination.total"
          @change="handlePageChange"
        />
      </slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import Pagination from '@/components/common/Pagination.vue'

// Props
interface Column {
  key: string
  title: string
  class?: string
  formatter?: (value: any) => string
}

interface Props {
  title?: string
  columns: Column[]
  data: any[]
  loading?: boolean
  selectedId?: string
  showPagination?: boolean
  pagination?: {
    current: number
    pageSize: number
    total: number
  }
}

const props = withDefaults(defineProps<Props>(), {
  title: '数据表格',
  loading: false,
  showPagination: true,
})

// Emits
interface Emits {
  (e: 'row-click', item: any): void
  (e: 'refresh'): void
  (e: 'page-change', page: number, pageSize: number): void
}

const emit = defineEmits<Emits>()

// 方法
const handleRowClick = (item: any) => {
  emit('row-click', item)
}

const handleRefresh = () => {
  emit('refresh')
}

const handlePageChange = (page: number, pageSize: number) => {
  emit('page-change', page, pageSize)
}

const formatCellValue = (value: any, column: Column) => {
  if (column.formatter) {
    return column.formatter(value)
  }
  return value
}
</script>
```

### 状态管理

```typescript
// stores/modules/user.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { User, LoginRequest } from '@/types/user'
import { userApi } from '@/api/modules/user'

export const useUserStore = defineStore(
  'user',
  () => {
    // 状态
    const user = ref<User | null>(null)
    const token = ref<string | null>(null)
    const loading = ref(false)
    const error = ref<string | null>(null)

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

    const setError = (errorMessage: string | null) => {
      error.value = errorMessage
    }

    const login = async (credentials: LoginRequest) => {
      loading.value = true
      error.value = null

      try {
        const response = await userApi.login(credentials)
        setUser(response.user)
        setToken(response.token)
        return response
      } catch (err) {
        const message = err instanceof Error ? err.message : '登录失败'
        setError(message)
        throw err
      } finally {
        loading.value = false
      }
    }

    const logout = () => {
      user.value = null
      token.value = null
      error.value = null
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
      loading,
      error,

      // 计算属性
      isLoggedIn,
      userRoles,
      userPermissions,

      // 方法
      setUser,
      setToken,
      setError,
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
      paths: ['user', 'token'],
    },
  }
)
```

### API 设计

```typescript
// api/modules/user.ts
import { defineRequest } from '@/api'
import type {
  User,
  LoginRequest,
  LoginResponse,
  UserListParams,
  UserListResponse,
} from '@/api/types/user'

// 登录
export const login = defineRequest<LoginRequest, LoginResponse>({
  url: '/auth/login',
  method: 'POST',
})

// 获取用户信息
export const getUserInfo = defineRequest<void, User>({
  url: '/auth/user-info',
  method: 'GET',
  cache: {
    mode: 'memory',
    expire: 5 * 60 * 1000, // 5分钟缓存
  },
})

// 获取用户列表
export const getUserList = defineRequest<UserListParams, UserListResponse>({
  url: '/users',
  method: 'GET',
  cache: {
    mode: 'memory',
    expire: 2 * 60 * 1000, // 2分钟缓存
    key: params => `user-list-${params.page}-${params.pageSize}`,
  },
})

// 创建用户
export const createUser = defineRequest<Partial<User>, User>({
  url: '/users',
  method: 'POST',
})

// 更新用户
export const updateUser = defineRequest<{ id: string; data: Partial<User> }, User>({
  url: '/users/:id',
  method: 'PUT',
})

// 删除用户
export const deleteUser = defineRequest<{ id: string }, void>({
  url: '/users/:id',
  method: 'DELETE',
})
```

### 错误处理

```typescript
// utils/error-handler.ts
export class AppError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode?: number,
    public details?: any
  ) {
    super(message)
    this.name = 'AppError'
  }
}

export const errorHandler = {
  // 处理 API 错误
  handleApiError(error: any): AppError {
    if (error instanceof AppError) {
      return error
    }

    if (error.response) {
      const { status, data } = error.response
      return new AppError(data.message || '请求失败', data.code || 'UNKNOWN_ERROR', status, data)
    }

    if (error.request) {
      return new AppError('网络连接失败', 'NETWORK_ERROR', 0)
    }

    return new AppError(error.message || '未知错误', 'UNKNOWN_ERROR')
  },

  // 显示错误消息
  showError(error: AppError) {
    console.error('应用错误:', error)

    // 根据错误类型显示不同的提示
    switch (error.code) {
      case 'AUTH_REQUIRED':
        // 跳转到登录页
        router.push('/login')
        break
      case 'PERMISSION_DENIED':
        // 显示权限不足提示
        showMessage('权限不足', 'error')
        break
      case 'NETWORK_ERROR':
        // 显示网络错误提示
        showMessage('网络连接失败，请检查网络设置', 'error')
        break
      default:
        // 显示通用错误提示
        showMessage(error.message, 'error')
    }
  },
}

// 在组件中使用
const handleSubmit = async () => {
  try {
    await userApi.createUser(formData)
    showMessage('创建成功', 'success')
  } catch (error) {
    const appError = errorHandler.handleApiError(error)
    errorHandler.showError(appError)
  }
}
```

### 性能优化

```typescript
// 组件懒加载
const UserList = () => import('@/views/user/list.vue')
const UserDetail = () => import('@/views/user/detail.vue')

// 路由懒加载
const routes = [
  {
    path: '/user',
    component: () => import('@/views/user/index.vue'),
    children: [
      {
        path: 'list',
        component: UserList,
      },
      {
        path: 'detail/:id',
        component: UserDetail,
      },
    ],
  },
]

// 虚拟滚动
import { useVirtualList } from '@vueuse/core'

const { list, containerProps, wrapperProps } = useVirtualList(items, {
  itemHeight: 60,
  overscan: 10,
})

// 防抖和节流
import { debounce, throttle } from 'lodash-es'

const debouncedSearch = debounce((query: string) => {
  searchUsers(query)
}, 300)

const throttledScroll = throttle(() => {
  // 处理滚动事件
}, 100)
```

## 🧪 测试规范

### 单元测试

```typescript
// tests/components/UserCard.test.ts
import { mount } from '@vue/test-utils'
import { describe, it, expect, vi } from 'vitest'
import UserCard from '@/components/UserCard.vue'
import type { User } from '@/types/user'

describe('UserCard', () => {
  const mockUser: User = {
    id: '1',
    username: 'testuser',
    email: 'test@example.com',
    roles: ['user'],
    permissions: ['read'],
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
  }

  it('renders user information correctly', () => {
    const wrapper = mount(UserCard, {
      props: { user: mockUser },
    })

    expect(wrapper.find('.user-name').text()).toBe('testuser')
    expect(wrapper.find('.user-email').text()).toBe('test@example.com')
  })

  it('emits edit event when edit button is clicked', async () => {
    const wrapper = mount(UserCard, {
      props: { user: mockUser, editable: true },
    })

    await wrapper.find('.btn-primary').trigger('click')

    expect(wrapper.emitted('edit')).toBeTruthy()
    expect(wrapper.emitted('edit')?.[0]).toEqual([mockUser])
  })

  it('emits delete event when delete button is clicked', async () => {
    const wrapper = mount(UserCard, {
      props: { user: mockUser, deletable: true },
    })

    await wrapper.find('.btn-error').trigger('click')

    expect(wrapper.emitted('delete')).toBeTruthy()
    expect(wrapper.emitted('delete')?.[0]).toEqual(['1'])
  })
})
```

### 集成测试

```typescript
// tests/integration/user-flow.test.ts
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { describe, it, expect, beforeEach } from 'vitest'
import UserManagement from '@/views/user/index.vue'
import { useUserStore } from '@/stores/modules/user'

describe('User Management Flow', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('should display user list and allow user creation', async () => {
    const wrapper = mount(UserManagement)
    const userStore = useUserStore()

    // 模拟用户已登录
    userStore.setUser({
      id: '1',
      username: 'admin',
      email: 'admin@example.com',
      roles: ['admin'],
      permissions: ['user:create', 'user:read'],
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01',
    })

    await wrapper.vm.$nextTick()

    // 检查用户列表是否显示
    expect(wrapper.find('.user-list').exists()).toBe(true)

    // 检查创建按钮是否显示
    expect(wrapper.find('.create-user-btn').exists()).toBe(true)
  })
})
```

## 📚 相关文档

- [组件文档](../components/README.md)
- [API 文档](../api/README.md)
- [路由文档](../router/README.md)
- [状态管理](../stores/README.md)
- [样式指南](../styles/README.md)
