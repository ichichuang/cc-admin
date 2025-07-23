# Pinia 状态管理指南

## 概述

CC-Admin 使用 Pinia 作为状态管理方案，采用模块化设计和统一的目录结构，提供类型安全的状态管理体验。

## 🏗️ 架构设计

### 目录结构

```
src/stores/
├── index.ts              # 🚪 统一导出入口
└── modules/              # 📦 具体 Store 模块
    ├── app.ts            # 应用全局状态
    ├── user.ts           # 用户信息管理
    ├── color.ts          # 主题颜色管理
    ├── size.ts           # 尺寸配置管理
    ├── layout.ts         # 布局状态管理
    ├── locale.ts         # 国际化状态
    ├── permission.ts     # 权限管理
    └── postcss.ts        # PostCSS 适配器
```

### 自动导入机制

通过 `index.ts` 统一导出所有 Store 模块：

```typescript
// src/stores/index.ts
export * from './modules/app'
export * from './modules/user'
export * from './modules/color'
export * from './modules/size'
export * from './modules/layout'
export * from './modules/locale'
export * from './modules/permission'
export * from './modules/postcss'
```

## 📚 核心 Store 模块

### 1. App Store - 应用全局状态

```typescript
// src/stores/modules/app.ts
export const useAppStore = defineStore('app', {
  state: () => ({
    /** 应用标题 */
    title: import.meta.env.VITE_APP_TITLE || 'CC-Admin',
    /** 应用版本 */
    version: import.meta.env.VITE_APP_VERSION || '1.0.0',
    /** 是否显示加载状态 */
    loading: false,
    /** 侧边栏是否折叠 */
    sidebarCollapsed: false,
    /** 全屏状态 */
    isFullscreen: false,
  }),

  getters: {
    /** 获取应用完整标题 */
    fullTitle: state => `${state.title} v${state.version}`,

    /** 是否为开发环境 */
    isDev: () => import.meta.env.DEV,

    /** 是否为生产环境 */
    isProd: () => import.meta.env.PROD,
  },

  actions: {
    /** 设置加载状态 */
    setLoading(loading: boolean) {
      this.loading = loading
    },

    /** 切换侧边栏折叠状态 */
    toggleSidebar() {
      this.sidebarCollapsed = !this.sidebarCollapsed
    },

    /** 进入全屏 */
    enterFullscreen() {
      this.isFullscreen = true
      document.documentElement.requestFullscreen?.()
    },

    /** 退出全屏 */
    exitFullscreen() {
      this.isFullscreen = false
      document.exitFullscreen?.()
    },
  },

  // 持久化配置
  persist: {
    key: 'cc-admin-app',
    storage: localStorage,
    pick: ['sidebarCollapsed'], // 只持久化部分状态
  },
})
```

### 2. User Store - 用户信息管理

```typescript
// src/stores/modules/user.ts
interface UserInfo {
  id: string
  username: string
  email: string
  avatar?: string
  roles: string[]
  permissions: string[]
}

export const useUserStore = defineStore('user', {
  state: () => ({
    /** 用户信息 */
    userInfo: null as UserInfo | null,
    /** 访问令牌 */
    accessToken: '',
    /** 刷新令牌 */
    refreshToken: '',
    /** 登录状态 */
    isLoggedIn: false,
  }),

  getters: {
    /** 获取用户角色 */
    userRoles: state => state.userInfo?.roles || [],

    /** 获取用户权限 */
    userPermissions: state => state.userInfo?.permissions || [],

    /** 是否为管理员 */
    isAdmin: state => state.userInfo?.roles.includes('admin') || false,

    /** 用户头像 */
    avatar: state => state.userInfo?.avatar || '/default-avatar.png',
  },

  actions: {
    /** 登录 */
    async login(credentials: LoginCredentials) {
      try {
        this.setLoading(true)
        const response = await authAPI.login(credentials)

        this.accessToken = response.accessToken
        this.refreshToken = response.refreshToken
        this.userInfo = response.userInfo
        this.isLoggedIn = true

        return response
      } catch (error) {
        console.error('登录失败:', error)
        throw error
      } finally {
        this.setLoading(false)
      }
    },

    /** 登出 */
    async logout() {
      try {
        await authAPI.logout()
      } catch (error) {
        console.error('登出失败:', error)
      } finally {
        this.clearUserData()
      }
    },

    /** 清除用户数据 */
    clearUserData() {
      this.userInfo = null
      this.accessToken = ''
      this.refreshToken = ''
      this.isLoggedIn = false
    },

    /** 更新用户信息 */
    updateUserInfo(userInfo: Partial<UserInfo>) {
      if (this.userInfo) {
        Object.assign(this.userInfo, userInfo)
      }
    },

    /** 检查权限 */
    hasPermission(permission: string): boolean {
      return this.userPermissions.includes(permission)
    },

    /** 检查角色 */
    hasRole(role: string): boolean {
      return this.userRoles.includes(role)
    },
  },

  persist: {
    key: 'cc-admin-user',
    storage: localStorage,
    pick: ['accessToken', 'refreshToken', 'userInfo', 'isLoggedIn'],
  },
})
```

### 3. Color Store - 主题颜色管理

```typescript
// src/stores/modules/color.ts
interface ColorConfig {
  /** 当前主题模式 */
  mode: 'light' | 'dark'
  /** 主题色 */
  primaryColor: string
  /** 自定义颜色变量 */
  customColors: Record<string, string>
}

export const useColorStore = defineStore('color', {
  state: (): ColorConfig => ({
    mode: 'light',
    primaryColor: '#1890ff',
    customColors: {},
  }),

  getters: {
    /** 是否为深色模式 */
    isDark: state => state.mode === 'dark',

    /** 是否为浅色模式 */
    isLight: state => state.mode === 'light',

    /** 获取当前主题色 */
    currentPrimaryColor: state => state.primaryColor,

    /** 获取所有 CSS 变量 */
    cssVariables: state => {
      const variables: Record<string, string> = {
        '--primary-color': state.primaryColor,
        ...state.customColors,
      }

      // 根据主题模式添加对应的颜色变量
      if (state.mode === 'dark') {
        variables['--bg-color'] = '#1a1a1a'
        variables['--text-color'] = '#ffffff'
      } else {
        variables['--bg-color'] = '#ffffff'
        variables['--text-color'] = '#000000'
      }

      return variables
    },
  },

  actions: {
    /** 切换主题模式 */
    toggleTheme() {
      this.mode = this.mode === 'light' ? 'dark' : 'light'
      this.applyTheme()
    },

    /** 设置主题模式 */
    setTheme(mode: 'light' | 'dark') {
      this.mode = mode
      this.applyTheme()
    },

    /** 设置主题色 */
    setPrimaryColor(color: string) {
      this.primaryColor = color
      this.applyTheme()
    },

    /** 设置自定义颜色 */
    setCustomColor(key: string, value: string) {
      this.customColors[key] = value
      this.applyTheme()
    },

    /** 应用主题到 DOM */
    applyTheme() {
      const root = document.documentElement
      const variables = this.cssVariables

      Object.entries(variables).forEach(([key, value]) => {
        root.style.setProperty(key, value)
      })

      // 更新 HTML 类名
      root.classList.toggle('dark', this.isDark)
    },

    /** 初始化主题 */
    initTheme() {
      // 检测系统主题偏好
      if (!this.mode) {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
        this.mode = prefersDark ? 'dark' : 'light'
      }

      this.applyTheme()
    },
  },

  persist: {
    key: 'cc-admin-color',
    storage: localStorage,
  },
})
```

### 4. Layout Store - 布局状态管理

```typescript
// src/stores/modules/layout.ts
interface LayoutConfig {
  /** 当前布局模式 */
  layoutMode: 'admin' | 'screen' | 'fullscreen'
  /** 侧边栏宽度 */
  sidebarWidth: number
  /** 侧边栏折叠宽度 */
  sidebarCollapsedWidth: number
  /** 头部高度 */
  headerHeight: number
  /** 标签页高度 */
  tabHeight: number
  /** 面包屑是否显示 */
  showBreadcrumb: boolean
  /** 标签页是否显示 */
  showTabs: boolean
}

export const useLayoutStore = defineStore('layout', {
  state: (): LayoutConfig => ({
    layoutMode: 'admin',
    sidebarWidth: 240,
    sidebarCollapsedWidth: 64,
    headerHeight: 64,
    tabHeight: 40,
    showBreadcrumb: true,
    showTabs: true,
  }),

  getters: {
    /** 当前侧边栏宽度 */
    currentSidebarWidth: state => {
      const appStore = useAppStore()
      return appStore.sidebarCollapsed ? state.sidebarCollapsedWidth : state.sidebarWidth
    },

    /** 主内容区域样式 */
    mainContentStyle: state => {
      const appStore = useAppStore()
      const marginLeft = appStore.sidebarCollapsed
        ? state.sidebarCollapsedWidth
        : state.sidebarWidth

      return {
        marginLeft: `${marginLeft}px`,
        paddingTop: `${state.headerHeight}px`,
      }
    },

    /** 是否为全屏布局 */
    isFullscreen: state => state.layoutMode === 'fullscreen',
  },

  actions: {
    /** 设置布局模式 */
    setLayoutMode(mode: 'admin' | 'screen' | 'fullscreen') {
      this.layoutMode = mode
    },

    /** 更新侧边栏宽度 */
    setSidebarWidth(width: number) {
      this.sidebarWidth = width
    },

    /** 更新头部高度 */
    setHeaderHeight(height: number) {
      this.headerHeight = height
    },

    /** 切换面包屑显示 */
    toggleBreadcrumb() {
      this.showBreadcrumb = !this.showBreadcrumb
    },

    /** 切换标签页显示 */
    toggleTabs() {
      this.showTabs = !this.showTabs
    },
  },

  persist: {
    key: 'cc-admin-layout',
    storage: localStorage,
  },
})
```

## 🔧 最佳实践

### 1. Store 模块创建规范

```typescript
// 📁 新建 Store 模块模板
export const useExampleStore = defineStore('example', {
  // 🎯 state: 使用函数返回初始状态
  state: () => ({
    loading: false,
    data: null as ExampleData | null,
    config: {
      enabled: true,
      timeout: 5000,
    },
  }),

  // 🧮 getters: 计算属性，支持类型推导
  getters: {
    isEnabled: state => state.config.enabled,
    hasData: state => state.data !== null,

    // 支持其他 Store 的访问
    fullInfo(state) {
      const userStore = useUserStore()
      return {
        ...state.data,
        userName: userStore.userInfo?.username,
      }
    },
  },

  // ⚡ actions: 异步操作和状态修改
  actions: {
    async fetchData() {
      this.loading = true
      try {
        const response = await api.getData()
        this.data = response.data
        return response
      } catch (error) {
        console.error('获取数据失败:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    updateConfig(config: Partial<ExampleConfig>) {
      Object.assign(this.config, config)
    },

    reset() {
      this.$reset() // Pinia 内置重置方法
    },
  },

  // 💾 persist: 持久化配置
  persist: {
    key: 'cc-admin-example',
    storage: localStorage,
    pick: ['config'], // 选择性持久化
  },
})
```

### 2. 在组件中使用 Store

```vue
<template>
  <div class="example-component">
    <!-- 直接使用 store 数据 -->
    <div v-if="userStore.isLoggedIn">欢迎，{{ userStore.userInfo?.username }}!</div>

    <!-- 使用 getter -->
    <div :class="{ dark: colorStore.isDark }">主题模式: {{ colorStore.mode }}</div>

    <!-- 使用 action -->
    <button @click="handleLogin">
      {{ userStore.loading ? '登录中...' : '登录' }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { useUserStore, useColorStore } from '@/stores'

// 🎯 在 setup 中直接使用
const userStore = useUserStore()
const colorStore = useColorStore()

// 📊 响应式解构（需要使用 storeToRefs）
import { storeToRefs } from 'pinia'
const { userInfo, isLoggedIn } = storeToRefs(userStore)
const { mode, isDark } = storeToRefs(colorStore)

// ⚡ 调用 actions
const handleLogin = async () => {
  try {
    await userStore.login({ username: 'admin', password: '123456' })
    // 登录成功处理
  } catch (error) {
    // 错误处理
  }
}

// 🔄 监听状态变化
watch(
  () => userStore.isLoggedIn,
  newValue => {
    if (newValue) {
      console.log('用户已登录')
    }
  }
)
</script>
```

### 3. Store 间的通信

```typescript
// 在一个 Store 中使用另一个 Store
export const useExampleStore = defineStore('example', {
  actions: {
    async performAction() {
      // 获取其他 Store
      const userStore = useUserStore()
      const appStore = useAppStore()

      // 检查权限
      if (!userStore.hasPermission('example:action')) {
        throw new Error('权限不足')
      }

      // 显示加载状态
      appStore.setLoading(true)

      try {
        // 执行操作
        const result = await api.performExample()
        return result
      } finally {
        appStore.setLoading(false)
      }
    },
  },
})
```

### 4. 类型安全的 Store 定义

```typescript
// 📋 定义清晰的类型接口
interface UserState {
  userInfo: UserInfo | null
  accessToken: string
  refreshToken: string
  isLoggedIn: boolean
}

interface UserGetters {
  userRoles: string[]
  userPermissions: string[]
  isAdmin: boolean
  avatar: string
}

interface UserActions {
  login(credentials: LoginCredentials): Promise<LoginResponse>
  logout(): Promise<void>
  clearUserData(): void
  updateUserInfo(userInfo: Partial<UserInfo>): void
  hasPermission(permission: string): boolean
  hasRole(role: string): boolean
}

// 🎯 完整的类型定义
export const useUserStore = defineStore<'user', UserState, UserGetters, UserActions>('user', {
  // 实现...
})
```

## 🚀 高级功能

### 1. Store 插件扩展

```typescript
// plugins/storeLogger.ts
export function storeLogger() {
  return ({ store }: { store: any }) => {
    store.$subscribe((mutation: any, state: any) => {
      console.log(`🔄 [${store.$id}] ${mutation.type}:`, mutation.payload)
    })
  }
}

// main.ts
import { createPinia } from 'pinia'
import { storeLogger } from './plugins/storeLogger'

const pinia = createPinia()
pinia.use(storeLogger())
```

### 2. 条件持久化

```typescript
export const useExampleStore = defineStore('example', {
  // ...
  persist: {
    key: 'cc-admin-example',
    storage: localStorage,
    // 🎯 自定义序列化
    serializer: {
      serialize: JSON.stringify,
      deserialize: JSON.parse,
    },
    // 🔍 条件持久化
    beforeRestore: context => {
      console.log('恢复数据前:', context)
    },
    afterRestore: context => {
      console.log('恢复数据后:', context)
    },
  },
})
```

### 3. Store 重置和清理

```typescript
export const useExampleStore = defineStore('example', {
  actions: {
    // 🔄 重置到初始状态
    resetStore() {
      this.$reset()
    },

    // 🧹 自定义清理逻辑
    cleanup() {
      // 清理定时器
      if (this.timer) {
        clearInterval(this.timer)
        this.timer = null
      }

      // 清理事件监听
      window.removeEventListener('resize', this.handleResize)

      // 重置状态
      this.$reset()
    },
  },
})
```

### 4. Store 状态订阅

```typescript
// 在组件中订阅状态变化
export default {
  setup() {
    const userStore = useUserStore()

    // 🎯 订阅整个 store 的变化
    userStore.$subscribe((mutation, state) => {
      console.log('Store 发生变化:', mutation.type, mutation.payload)

      // 可以在这里执行副作用
      if (mutation.type === 'direct' && mutation.events?.key === 'isLoggedIn') {
        // 登录状态改变时的处理逻辑
      }
    })

    // 🎯 订阅特定状态的变化
    watch(
      () => userStore.isLoggedIn,
      (newValue, oldValue) => {
        console.log(`登录状态从 ${oldValue} 变为 ${newValue}`)
      }
    )
  },
}
```

## 🔧 调试和开发工具

### 1. Pinia DevTools

在开发环境中，Pinia 会自动连接到 Vue DevTools：

```typescript
// main.ts
import { createPinia } from 'pinia'

const pinia = createPinia()

// 开发环境启用 DevTools
if (import.meta.env.DEV) {
  pinia.use(({ store }) => {
    store.$id = store.$id.replace(/([A-Z])/g, '-$1').toLowerCase()
  })
}
```

### 2. Store 状态调试

```typescript
// 在控制台调试 Store 状态
declare global {
  interface Window {
    $stores: any
  }
}

// main.ts
if (import.meta.env.DEV) {
  window.$stores = {
    user: useUserStore,
    app: useAppStore,
    color: useColorStore,
    // 添加更多 store
  }
}

// 在浏览器控制台使用：
// window.$stores.user().userInfo
// window.$stores.app().toggleSidebar()
```

### 3. 状态持久化调试

```typescript
export const useDebugStore = defineStore('debug', {
  state: () => ({
    logs: [] as string[],
  }),

  actions: {
    log(message: string) {
      this.logs.push(`[${new Date().toISOString()}] ${message}`)
      console.log(message)
    },

    clearLogs() {
      this.logs = []
    },
  },

  persist: {
    key: 'cc-admin-debug',
    storage: localStorage,
    debug: true, // 启用持久化调试
  },
})
```

## 📋 Store 模块清单

| Store 模块     | 描述          | 主要功能                   | 持久化 |
| -------------- | ------------- | -------------------------- | ------ |
| **app**        | 应用全局状态  | 加载状态、侧边栏、全屏控制 | ✅部分 |
| **user**       | 用户信息管理  | 登录、权限、用户信息       | ✅     |
| **color**      | 主题颜色管理  | 深浅色主题、主题色设置     | ✅     |
| **size**       | 尺寸配置管理  | 组件尺寸、间距配置         | ✅     |
| **layout**     | 布局状态管理  | 布局模式、侧边栏、头部配置 | ✅     |
| **locale**     | 国际化状态    | 语言切换、本地化配置       | ✅     |
| **permission** | 权限管理      | 路由权限、按钮权限         | ✅     |
| **postcss**    | PostCSS适配器 | rem适配、响应式断点        | ✅部分 |

## 🎯 总结

CC-Admin 的 Pinia 状态管理系统具有以下特点：

- ✅ **模块化设计**: 每个功能模块独立管理状态
- ✅ **类型安全**: 完整的 TypeScript 类型支持
- ✅ **持久化**: 自动本地存储重要状态
- ✅ **开发友好**: 丰富的调试工具和开发体验
- ✅ **性能优化**: 按需加载和响应式更新
- ✅ **可扩展**: 支持插件和自定义功能

通过统一的架构设计和最佳实践，确保状态管理的可维护性和开发效率！🚀
