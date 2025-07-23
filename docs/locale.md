# 国际化配置指南

## 概述

CC-Admin 使用 Vue I18n 10+ 实现完整的国际化方案，支持多语言切换、动态语言检测、类型安全的翻译key等现代化国际化特性。

## 🏗️ 架构设计

### 目录结构

```
src/locales/
├── index.ts              # 🚪 国际化配置入口
├── types.ts              # 🏷️ 国际化类型定义
├── lang/                 # 🌍 语言包目录
│   ├── zh-CN.ts         # 中文简体
│   ├── zh-TW.ts         # 中文繁体
│   └── en-US.ts         # 英文
└── modules/              # 📦 分模块翻译
    ├── common.ts         # 通用翻译
    ├── auth.ts           # 认证相关
    ├── dashboard.ts      # 仪表盘
    ├── router.ts         # 路由导航
    └── user.ts           # 用户管理
```

### 支持的语言

| 语言代码 | 语言名称 | 国旗 | 文字方向 | 状态        |
| -------- | -------- | ---- | -------- | ----------- |
| zh-CN    | 简体中文 | 🇨🇳   | ltr      | ✅ 完整支持 |
| en-US    | English  | 🇺🇸   | ltr      | ✅ 完整支持 |
| zh-TW    | 繁體中文 | 🇹🇼   | ltr      | ✅ 完整支持 |

### 配置入口

```typescript
// src/locales/index.ts
import type { App } from 'vue'
import { createI18n } from 'vue-i18n'
import enUS from './lang/en-US'
import zhCN from './lang/zh-CN'
import zhTW from './lang/zh-TW'
import type { LocaleInfo, LocaleMessages, SupportedLocale } from './types'

// 支持的语言列表
export const supportedLocales: LocaleInfo[] = [
  {
    key: 'zh-CN',
    name: '简体中文',
    flag: '🇨🇳',
    direction: 'ltr',
  },
  {
    key: 'en-US',
    name: 'English',
    flag: '🇺🇸',
    direction: 'ltr',
  },
  {
    key: 'zh-TW',
    name: '繁體中文',
    flag: '🇹🇼',
    direction: 'ltr',
  },
]

// 语言包映射
const messages: Record<SupportedLocale, LocaleMessages> = {
  ['zh-CN']: zhCN,
  ['en-US']: enUS,
  ['zh-TW']: zhTW,
}

// 获取默认语言
function getDefaultLocale(): SupportedLocale {
  // 1. 从localStorage获取用户设置
  const savedLocale = localStorage.getItem('cc-admin-locale') as SupportedLocale
  if (savedLocale && messages[savedLocale]) {
    return savedLocale
  }

  // 2. 从浏览器语言检测
  const browserLang = navigator.language.toLowerCase()

  // 中文检测
  if (browserLang.includes('zh')) {
    if (browserLang.includes('tw') || browserLang.includes('hk') || browserLang.includes('hant')) {
      return 'zh-TW'
    }
    return 'zh-CN'
  }

  // 英文检测
  if (browserLang.includes('en')) {
    return 'en-US'
  }

  // 3. 默认中文
  return 'zh-CN'
}

// 创建 i18n 实例（简化版配置）
export const i18n = createI18n({
  legacy: false, // 使用组合式 API
  locale: getDefaultLocale(), // 默认语言
  fallbackLocale: 'zh-CN', // 回退语言
  messages: messages as any, // 语言包
  globalInjection: true, // 全局注入
  silentTranslationWarn: true, // 静默翻译警告
  silentFallbackWarn: true, // 静默回退警告
  missingWarn: import.meta.env.DEV, // 开发模式显示缺失警告
  fallbackWarn: import.meta.env.DEV, // 开发模式显示回退警告
})

// 自动检测语言
function getLocale(): string {
  const saved = localStorage.getItem('cc-admin-locale')
  if (saved) return saved

  const browser = navigator.language || 'zh-CN'
  const supported = ['zh-CN', 'zh-TW', 'en-US']

  return supported.find(lang => browser.startsWith(lang.split('-')[0])) || 'zh-CN'
}
```

## 🌍 语言包管理

### 主语言包结构

```typescript
// src/locales/lang/zh-CN.ts
import { authZhCN } from '../modules/auth'
import { commonZhCN } from '../modules/common'
import { dashboardZhCN } from '../modules/dashboard'
import { routerZhCN } from '../modules/router'
import { userZhCN } from '../modules/user'

// 为了保持向后兼容，同时导出具名导出和默认导出
export const zhCN = {
  common: commonZhCN,
  auth: authZhCN,
  user: userZhCN,
  dashboard: dashboardZhCN,
  router: routerZhCN,
}

// i18n Ally 期望的默认导出
export default zhCN
```

### 模块化翻译

```typescript
// src/locales/modules/common.ts
export const commonZhCN: CommonLocaleMessages = {
  // 基础操作
  actions: {
    save: '保存',
    cancel: '取消',
    confirm: '确认',
    delete: '删除',
    edit: '编辑',
    add: '新增',
    search: '搜索',
    reset: '重置',
    submit: '提交',
    back: '返回',
    refresh: '刷新',
    export: '导出',
    import: '导入',
    close: '关闭',
    next: '下一步',
    previous: '上一步',
  },

  // 状态提示
  status: {
    loading: '加载中...',
    success: '操作成功',
    error: '操作失败',
    warning: '警告',
    info: '信息',
    pending: '等待中',
    completed: '已完成',
    failed: '失败',
    active: '启用',
    inactive: '禁用',
  },

  // 表单验证
  form: {
    required: '此字段为必填项',
    invalid: '输入格式不正确',
    tooShort: '输入内容过短',
    tooLong: '输入内容过长',
    invalidEmail: '邮箱格式不正确',
    invalidPhone: '手机号格式不正确',
    invalidUrl: '网址格式不正确',
    passwordMismatch: '两次密码输入不一致',
    pleaseSelect: '请选择',
    pleaseInput: '请输入',
  },

  // 表格相关
  table: {
    noData: '暂无数据',
    total: '共 {total} 条',
    page: '第 {page} 页',
    pageSize: '每页 {size} 条',
    itemsPerPage: '每页条数',
    goToPage: '跳转到',
    firstPage: '首页',
    lastPage: '尾页',
    previousPage: '上一页',
    nextPage: '下一页',
  },

  // 时间相关
  time: {
    now: '刚刚',
    today: '今天',
    yesterday: '昨天',
    tomorrow: '明天',
    thisWeek: '本周',
    thisMonth: '本月',
    thisYear: '今年',
    format: {
      date: 'YYYY-MM-DD',
      datetime: 'YYYY-MM-DD HH:mm:ss',
      time: 'HH:mm:ss',
    },
  },

  // 格式化示例（新增）
  format: {
    date: '当前日期',
    number: '数字格式化',
  },

  // 系统相关
  system: {
    title: 'CC-Admin',
    description: '企业级后台管理系统',
    version: '版本',
    copyright: '版权所有',
    loading: '系统加载中...',
    networkError: '网络连接失败',
    serverError: '服务器错误',
    unauthorized: '未授权访问',
    forbidden: '访问被拒绝',
    notFound: '页面不存在',
  },
}
```

## 🎯 类型安全

### 翻译键类型定义

```typescript
// src/locales/types.ts
/** 支持的语言类型 */
export type SupportedLocale = 'zh-CN' | 'en-US' | 'zh-TW'

/** 语言配置信息 */
export interface LocaleInfo {
  key: SupportedLocale
  name: string
  flag: string
  direction: 'ltr' | 'rtl'
}

/** 通用语言配置结构 */
export interface CommonLocaleMessages {
  // 操作相关
  actions: {
    confirm: string
    cancel: string
    save: string
    delete: string
    edit: string
    add: string
    search: string
    reset: string
    submit: string
    refresh: string
    export: string
    import: string
    close: string
    back: string
    next: string
    previous: string
  }

  // 状态相关
  status: {
    loading: string
    success: string
    error: string
    warning: string
    info: string
    pending: string
    completed: string
    failed: string
    active: string
    inactive: string
  }

  // 表格相关
  table: {
    noData: string
    total: string
    page: string
    pageSize: string
    itemsPerPage: string
    goToPage: string
    firstPage: string
    lastPage: string
    previousPage: string
    nextPage: string
  }

  // 时间相关
  time: {
    now: string
    today: string
    yesterday: string
    tomorrow: string
    thisWeek: string
    thisMonth: string
    thisYear: string
    format: {
      date: string
      datetime: string
      time: string
    }
  }

  // 格式化示例
  format: {
    date: string
    number: string
  }

  // 系统相关
  system: {
    title: string
    description: string
    version: string
    copyright: string
    loading: string
    networkError: string
    serverError: string
    unauthorized: string
    forbidden: string
    notFound: string
  }
}
```

## 🔧 使用方式

### 1. 组合式 API

```vue
<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t, locale, availableLocales } = useI18n()

// 翻译函数
const title = t('dashboard.title')
const message = t('common.status.loading')

// 带参数的翻译
const welcome = t('user.welcome', { name: 'John' })

// 切换语言
const changeLocale = (newLocale: string) => {
  locale.value = newLocale
  localStorage.setItem('cc-admin-locale', newLocale)
}
</script>

<template>
  <div>
    <h1>{{ title }}</h1>
    <p>{{ message }}</p>

    <!-- 语言切换器 -->
    <select @change="changeLocale($event.target.value)">
      <option
        v-for="lang in availableLocales"
        :key="lang"
        :value="lang"
      >
        {{ t(`app.languages.${lang}`) }}
      </option>
    </select>
  </div>
</template>
```

### 2. 简化的日期和数字格式化

由于移除了复杂的 `dateTimeFormats` 和 `numberFormats` 配置，现在使用原生 JavaScript 方法进行格式化：

```vue
<script setup lang="ts">
import { computed } from 'vue'
import { useLocaleStore } from '@/stores/modules/locale'

const localeStore = useLocaleStore()

// 格式化日期
const currentDate = new Date()
const formattedDate = computed(() => {
  return currentDate.toLocaleString(localeStore.currentLocale)
})

// 格式化数字
const formattedNumber = computed(() => {
  return (1234.56).toLocaleString(localeStore.currentLocale, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
})
</script>

<template>
  <div>
    <p>{{ $t('common.format.date') }}: {{ formattedDate }}</p>
    <p>{{ $t('common.format.number') }}: {{ formattedNumber }}</p>
  </div>
</template>
```

### 📋 支持的全局函数

| 函数             | 说明           | 示例                      |
| :--------------- | :------------- | :------------------------ |
| $t(key, params?) | 翻译文本       | $t('common.actions.save') |
| $te(key)         | 检查键是否存在 | $te('user.profile.title') |

**注意**：简化版配置移除了 `$d` 和 `$n` 的复杂格式化支持，改用原生 JavaScript 的 `toLocaleString()` 方法。

## 🎨 高级特性

### 1. 插值和复数

```typescript
// 插值翻译
export const commonZhCN = {
  user: {
    welcome: '欢迎 {name}！',
    profile: '用户 {name} 的个人资料',
    lastLogin: '上次登录：{date}',
  },

  // 复数形式
  items: {
    apple: '没有苹果 | 一个苹果 | {count} 个苹果',
  },
}
```

```vue
<template>
  <!-- 插值使用 -->
  <p>{{ $t('user.welcome', { name: 'John' }) }}</p>

  <!-- 复数使用 -->
  <p>{{ $t('items.apple', appleCount) }}</p>
</template>
```

### 2. 原生格式化方法

```typescript
// 使用原生方法进行日期时间格式化
const formatDate = (date: Date, locale: string) => {
  return date.toLocaleDateString(locale, {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })
}

const formatDateTime = (date: Date, locale: string) => {
  return date.toLocaleString(locale, {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  })
}

// 使用原生方法进行数字格式化
const formatNumber = (number: number, locale: string) => {
  return number.toLocaleString(locale, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}

const formatCurrency = (amount: number, locale: string, currency: string) => {
  return amount.toLocaleString(locale, {
    style: 'currency',
    currency: currency,
  })
}
```

## 🔗 与 Pinia 集成

### 语言状态管理

```typescript
// src/stores/modules/locale.ts
import { defineStore } from 'pinia'
import { computed } from 'vue'
import type { SupportedLocale } from '@/locales/types'
import { supportedLocales, setLocale, getCurrentLocale } from '@/locales'

export const useLocaleStore = defineStore('locale', {
  state: () => ({
    locale: getCurrentLocale(),
  }),

  getters: {
    currentLocale: state => state.locale,
    currentLocaleInfo: state => supportedLocales.find(item => item.key === state.locale),
    availableLocales: () => supportedLocales,
    isChineseLang: state => state.locale.startsWith('zh'),
    isRTL: state => {
      const localeInfo = supportedLocales.find(item => item.key === state.locale)
      return localeInfo?.direction === 'rtl'
    },
  },

  actions: {
    switchLocale(newLocale: SupportedLocale) {
      if (this.locale !== newLocale) {
        setLocale(newLocale)
        this.locale = newLocale
      }
    },

    toggleLocale() {
      const currentIndex = supportedLocales.findIndex(item => item.key === this.locale)
      const nextIndex = (currentIndex + 1) % supportedLocales.length
      const nextLocale = supportedLocales[nextIndex].key
      this.switchLocale(nextLocale)
    },
  },
})
```

## 🌟 最佳实践

### 1. 翻译键命名规范

```typescript
// ✅ 推荐的命名方式
const translations = {
  // 模块.功能.具体内容
  user: {
    profile: {
      title: '个人资料',
      form: {
        name: '姓名',
        email: '邮箱',
        phone: '手机号',
      },
    },
  },

  // 通用内容使用 common 前缀
  common: {
    actions: {
      save: '保存',
      cancel: '取消',
    },
    format: {
      date: '当前日期',
      number: '数字格式化',
    },
  },
}

// ❌ 避免的命名方式
const badTranslations = {
  saveBtn: '保存', // 不要在key中包含UI元素
  userNameLabel: '用户名', // 避免过于具体的UI描述
  msg1: '消息1', // 避免无意义的命名
}
```

### 2. 格式化最佳实践

```typescript
// ✅ 推荐：使用计算属性缓存格式化结果
const formattedValues = computed(() => {
  const locale = localeStore.currentLocale
  return {
    date: new Date().toLocaleDateString(locale),
    number: (1234.56).toLocaleString(locale, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }),
    currency: (9999.99).toLocaleString(locale, {
      style: 'currency',
      currency: locale === 'zh-CN' ? 'CNY' : 'USD',
    }),
  }
})

// ✅ 推荐：创建格式化工具函数
const formatUtils = {
  date: (date: Date, locale: string) => date.toLocaleDateString(locale),
  dateTime: (date: Date, locale: string) => date.toLocaleString(locale),
  number: (num: number, locale: string) => num.toLocaleString(locale),
  currency: (amount: number, locale: string, currency: string) =>
    amount.toLocaleString(locale, { style: 'currency', currency }),
}
```

### 3. 处理动态内容

```typescript
// 使用插值处理动态内容
const translations = {
  user: {
    greeting: '您好，{name}！今天是 {date}',
    itemCount: '共找到 {count} 条记录',
    status: '当前状态：{status}',
  },
}

// 在组件中使用
const message = t('user.greeting', {
  name: userName.value,
  date: new Date().toLocaleDateString(),
})
```

## ⚠️ 重要变更说明

### 从复杂格式化到简化版本

为了减少配置复杂性和提高维护性，CC-Admin 的国际化配置已经简化：

**移除的功能：**

- ❌ 复杂的 `dateTimeFormats` 配置
- ❌ 复杂的 `numberFormats` 配置
- ❌ `$d()` 和 `$n()` 函数的格式化参数支持

**新增的功能：**

- ✅ `common.format.date` 和 `common.format.number` 翻译键
- ✅ 使用原生 JavaScript 格式化方法
- ✅ 更简洁的配置和更好的性能

**迁移指南：**

```typescript
// ❌ 旧版本（已移除）
const formattedDate = $d(new Date(), 'datetime')
const formattedNumber = $n(1234.56, 'decimal')

// ✅ 新版本（推荐）
const formattedDate = new Date().toLocaleString(currentLocale.value)
const formattedNumber = (1234.56).toLocaleString(currentLocale.value, {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})
```

## 📚 总结

CC-Admin 的简化国际化系统提供了：

- 🏗️ **清晰架构** - 简化的配置和模块化结构
- 🎯 **类型安全** - 完整的 TypeScript 支持
- 🔧 **易于维护** - 移除复杂配置，使用标准方法
- 🌟 **最佳实践** - 规范的命名和组织方式
- ⚡ **更好性能** - 简化配置带来更快的加载速度

通过这套简化的系统，您可以轻松实现多语言支持，并保持代码的可维护性和扩展性。
