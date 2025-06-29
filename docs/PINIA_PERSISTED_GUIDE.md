# Pinia 持久化存储指南

本指南详细介绍如何在 CC Admin 项目中使用 `pinia-plugin-persistedstate` 插件实现 Pinia 状态的持久化存储。

## 目录

- [简介](#简介)
- [安装与配置](#安装与配置)
- [基本使用](#基本使用)
- [配置选项](#配置选项)
- [高级用法](#高级用法)
- [实际示例](#实际示例)
- [最佳实践](#最佳实践)
- [常见问题](#常见问题)

## 简介

`pinia-plugin-persistedstate` 是一个为 Pinia 状态管理库提供持久化功能的插件。它允许你将 store 的状态自动保存到 localStorage、sessionStorage 或其他存储中，并在页面刷新时自动恢复。

### 主要特性

- 🔄 自动持久化和恢复状态
- ⚙️ 高度可配置（存储方式、序列化器、字段选择）
- 🚀 开箱即用的 SSR 支持
- 📦 体积小巧（<2kB minzipped）
- 🎯 支持多种存储配置

## 安装与配置

### 1. 安装插件

```bash
pnpm add pinia-plugin-persistedstate
```

### 2. 配置插件

在 `src/main.ts` 中配置插件：

```typescript
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import { createApp } from 'vue'

const app = createApp(App)

// 创建 Pinia 实例并配置持久化插件
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

app.use(pinia)
```

## 基本使用

### 简单启用持久化

在 store 中添加 `persist: true` 选项：

```typescript
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAppStore = defineStore(
  'app',
  () => {
    const theme = ref('light')
    const locale = ref('zh-CN')

    return {
      theme,
      locale,
    }
  },
  {
    persist: true, // 启用持久化
  }
)
```

这将：

- 使用 localStorage 作为存储
- 使用 store 的 id 作为存储键名
- 持久化所有状态

### 选择性持久化

只持久化特定字段：

```typescript
export const useAppStore = defineStore(
  'app',
  () => {
    const theme = ref('light')
    const locale = ref('zh-CN')
    const tempData = ref('') // 不需要持久化

    return {
      theme,
      locale,
      tempData,
    }
  },
  {
    persist: {
      pick: ['theme', 'locale'], // 只持久化这些字段
    },
  }
)
```

## 配置选项

### 基本配置选项

```typescript
export const useStore = defineStore(
  'store',
  () => {
    // store 内容
  },
  {
    persist: {
      key: 'custom-key', // 自定义存储键名
      storage: sessionStorage, // 存储方式
      pick: ['field1', 'field2'], // 选择持久化的字段
      omit: ['field3'], // 排除持久化的字段
      serializer: {
        // 自定义序列化器
        serialize: JSON.stringify,
        deserialize: JSON.parse,
      },
      beforeRestore: context => {
        // 恢复前的钩子
        console.log('即将恢复状态:', context)
      },
      afterRestore: context => {
        // 恢复后的钩子
        console.log('状态已恢复:', context)
      },
    },
  }
)
```

### 存储方式选项

```typescript
// 使用 localStorage（默认）
persist: {
  storage: localStorage,
}

// 使用 sessionStorage
persist: {
  storage: sessionStorage,
}

// 自定义存储
persist: {
  storage: {
    getItem: (key) => {
      // 自定义获取逻辑
      return customStorage.get(key)
    },
    setItem: (key, value) => {
      // 自定义设置逻辑
      customStorage.set(key, value)
    },
    removeItem: (key) => {
      // 自定义删除逻辑
      customStorage.remove(key)
    },
  },
}
```

## 高级用法

### 多个持久化配置

为同一个 store 配置多个持久化策略：

```typescript
export const useUserStore = defineStore(
  'user',
  () => {
    const userInfo = ref(null)
    const preferences = ref({})
    const tempData = ref('')

    return {
      userInfo,
      preferences,
      tempData,
    }
  },
  {
    persist: [
      // 配置1：用户信息使用 localStorage
      {
        key: 'user-auth',
        storage: localStorage,
        pick: ['userInfo'],
      },
      // 配置2：偏好设置使用 sessionStorage
      {
        key: 'user-preferences',
        storage: sessionStorage,
        pick: ['preferences'],
      },
      // tempData 不持久化
    ],
  }
)
```

### 自定义序列化器

```typescript
import CryptoJS from 'crypto-js'

const SECRET_KEY = 'your-secret-key'

export const useSecureStore = defineStore(
  'secure',
  () => {
    const sensitiveData = ref('')

    return {
      sensitiveData,
    }
  },
  {
    persist: {
      key: 'secure-data',
      serializer: {
        serialize: data => {
          // 加密数据
          return CryptoJS.AES.encrypt(JSON.stringify(data), SECRET_KEY).toString()
        },
        deserialize: encrypted => {
          // 解密数据
          const bytes = CryptoJS.AES.decrypt(encrypted, SECRET_KEY)
          return JSON.parse(bytes.toString(CryptoJS.enc.Utf8))
        },
      },
    },
  }
)
```

### 生命周期钩子

```typescript
export const useStore = defineStore(
  'store',
  () => {
    const data = ref('')

    return { data }
  },
  {
    persist: {
      beforeRestore: context => {
        console.log('准备恢复状态...')
        // 可以在这里进行数据验证或迁移
        if (context.store.data && typeof context.store.data !== 'string') {
          console.warn('数据格式不正确，将重置为默认值')
          context.store.data = ''
        }
      },
      afterRestore: context => {
        console.log('状态已恢复:', context.store.data)
        // 可以在这里触发其他操作
      },
    },
  }
)
```

## 实际示例

### 应用配置 Store

```typescript
// src/stores/modules/app.ts
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAppStore = defineStore(
  'app',
  () => {
    const theme = ref<'light' | 'dark'>('light')
    const locale = ref('zh-CN')
    const sidebarCollapsed = ref(false)
    const title = ref('CC Admin') // 不持久化，每次动态设置

    const toggleTheme = () => {
      theme.value = theme.value === 'light' ? 'dark' : 'light'
    }

    const toggleSidebar = () => {
      sidebarCollapsed.value = !sidebarCollapsed.value
    }

    return {
      theme,
      locale,
      sidebarCollapsed,
      title,
      toggleTheme,
      toggleSidebar,
    }
  },
  {
    persist: {
      key: 'cc-admin-app',
      pick: ['theme', 'locale', 'sidebarCollapsed'],
      // title 不持久化，因为它可能会动态变化
    },
  }
)
```

### 用户信息 Store

```typescript
// src/stores/modules/user.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

interface UserInfo {
  id: number
  username: string
  email: string
  roles: string[]
}

export const useUserStore = defineStore(
  'user',
  () => {
    const userInfo = ref<UserInfo | null>(null)
    const preferences = ref({
      fontSize: 'medium',
      autoSave: true,
      notifications: true,
    })
    const lastActivity = ref<Date | null>(null) // 不持久化

    const isLoggedIn = computed(() => !!userInfo.value)
    const isAdmin = computed(() => userInfo.value?.roles.includes('admin') || false)

    const login = (user: UserInfo) => {
      userInfo.value = user
      lastActivity.value = new Date()
    }

    const logout = () => {
      userInfo.value = null
      lastActivity.value = null
    }

    return {
      userInfo,
      preferences,
      lastActivity,
      isLoggedIn,
      isAdmin,
      login,
      logout,
    }
  },
  {
    persist: [
      // 用户基本信息 - localStorage
      {
        key: 'cc-admin-user-auth',
        storage: localStorage,
        pick: ['userInfo'],
      },
      // 用户偏好 - sessionStorage
      {
        key: 'cc-admin-user-preferences',
        storage: sessionStorage,
        pick: ['preferences'],
      },
      // lastActivity 不持久化
    ],
  }
)
```

## 最佳实践

### 1. 选择合适的存储方式

- **localStorage**：适用于需要长期保存的数据（用户设置、主题、语言等）
- **sessionStorage**：适用于会话期间的数据（临时偏好、表单数据等）
- **自定义存储**：适用于特殊需求（加密、服务器同步等）

### 2. 谨慎选择持久化字段

```typescript
// ✅ 好的做法
persist: {
  pick: ['theme', 'locale', 'userSettings'], // 只持久化必要的字段
}

// ❌ 避免的做法
persist: true, // 持久化所有字段，可能包含敏感或临时数据
```

### 3. 使用合适的键名

```typescript
// ✅ 好的做法
persist: {
  key: 'cc-admin-user-auth', // 使用项目前缀，避免冲突
}

// ❌ 避免的做法
persist: {
  key: 'user', // 可能与其他应用冲突
}
```

### 4. 处理数据迁移

```typescript
persist: {
  beforeRestore: (context) => {
    // 检查数据版本
    const stored = JSON.parse(localStorage.getItem('cc-admin-app') || '{}')
    if (stored.version !== '1.0') {
      // 执行数据迁移
      console.log('执行数据迁移...')
      // 迁移逻辑
    }
  },
}
```

### 5. 敏感数据处理

```typescript
// 对于敏感数据，不要持久化或使用加密
persist: {
  omit: ['password', 'token', 'sensitiveData'], // 排除敏感字段
}

// 或者使用加密存储
persist: {
  serializer: {
    serialize: (data) => encrypt(JSON.stringify(data)),
    deserialize: (encrypted) => JSON.parse(decrypt(encrypted)),
  },
}
```

## 常见问题

### Q: 为什么持久化的数据没有恢复？

A: 检查以下几点：

1. 确保插件已正确安装和配置
2. 检查 store 的 id 是否正确
3. 确认浏览器的存储功能是否被禁用
4. 检查 `pick` 配置是否包含要恢复的字段

### Q: 如何清空持久化数据？

A: 可以手动清空或在代码中清空：

```typescript
// 手动清空特定 store 的数据
localStorage.removeItem('cc-admin-app')

// 或者在 store 中添加清空方法
const clearPersistedData = () => {
  localStorage.removeItem('cc-admin-app')
  // 重置 store 状态
  $reset() // 如果使用 options API
}
```

### Q: 持久化数据过大怎么办？

A: 优化策略：

1. 使用 `pick` 只持久化必要字段
2. 使用压缩序列化器
3. 考虑使用 IndexedDB 替代 localStorage
4. 定期清理过期数据

### Q: 在 SSR 环境中如何使用？

A: 插件提供开箱即用的 SSR 支持：

```typescript
// 在 Nuxt 中
export default defineNuxtConfig({
  modules: ['@pinia/nuxt', 'pinia-plugin-persistedstate/nuxt'],
})
```

### Q: 如何处理存储容量限制？

A: 监控存储使用情况：

```typescript
const checkStorageUsage = () => {
  try {
    const used = JSON.stringify(localStorage).length
    const limit = 5 * 1024 * 1024 // 5MB
    if (used > limit * 0.8) {
      console.warn('存储使用率过高:', ((used / limit) * 100).toFixed(2) + '%')
    }
  } catch (error) {
    console.error('无法检查存储使用情况:', error)
  }
}
```

## 调试技巧

### 1. 开发环境调试

```typescript
persist: {
  debug: true, // 启用调试模式（如果插件支持）
  beforeRestore: (context) => {
    console.log('恢复前的状态:', context)
  },
  afterRestore: (context) => {
    console.log('恢复后的状态:', context)
  },
}
```

### 2. 浏览器开发者工具

- 打开开发者工具 → Application → Storage
- 查看 localStorage 和 sessionStorage 中的数据
- 可以手动编辑或删除存储数据进行测试

### 3. 状态查看器

创建一个调试组件来查看存储状态：

```vue
<template>
  <div
    v-if="isDev"
    class="debug-panel"
  >
    <h3>存储状态调试</h3>
    <pre>{{ storageDebugInfo }}</pre>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const isDev = process.env.NODE_ENV === 'development'

const storageDebugInfo = computed(() => {
  return {
    localStorage: Object.keys(localStorage).reduce((acc, key) => {
      if (key.startsWith('cc-admin-')) {
        acc[key] = JSON.parse(localStorage.getItem(key) || '{}')
      }
      return acc
    }, {}),
    sessionStorage: Object.keys(sessionStorage).reduce((acc, key) => {
      if (key.startsWith('cc-admin-')) {
        acc[key] = JSON.parse(sessionStorage.getItem(key) || '{}')
      }
      return acc
    }, {}),
  }
})
</script>
```

## 总结

`pinia-plugin-persistedstate` 为 Pinia 提供了强大而灵活的持久化功能。通过合理的配置和使用，可以显著提升用户体验，让应用状态在页面刷新后得以保持。

记住以下要点：

- 选择合适的存储方式和持久化字段
- 注意性能和安全性
- 处理好数据迁移和版本兼容
- 在开发过程中充分测试持久化功能

通过本指南的学习和实践，你应该能够熟练地在项目中使用 Pinia 持久化存储功能。
