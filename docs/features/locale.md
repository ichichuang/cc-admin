<!--
  @copyright Copyright (c) 2025 chichuang
  @license MIT
  @description CC-Admin 企业级后台管理框架 - locale
  本文件为 chichuang 原创，禁止擅自删除署名或用于商业用途。
-->

# 国际化指南

## 概述

CC-Admin 使用 Vue I18n 实现完整的国际化方案，支持多语言切换和类型安全的翻译。

## 🏗️ 架构设计

### 目录结构

```
src/locales/
├── index.ts              # 国际化配置入口
├── types.ts              # 类型定义
├── lang/                 # 语言包目录
│   ├── zh-CN.ts         # 中文简体
│   ├── zh-TW.ts         # 中文繁体
│   └── en-US.ts         # 英文
└── modules/              # 分模块翻译
    ├── common.ts         # 通用翻译
    ├── auth.ts           # 认证相关
    ├── dashboard.ts      # 仪表盘
    ├── router.ts         # 路由导航
    └── user.ts           # 用户管理
```

### 支持的语言

| 语言代码 | 语言名称 | 状态 |
| -------- | -------- | ---- |
| zh-CN    | 简体中文 | ✅   |
| en-US    | English  | ✅   |
| zh-TW    | 繁體中文 | ✅   |

## 🔧 配置和使用

### 基本配置

```typescript
// src/locales/index.ts
import { createI18n } from 'vue-i18n'
import enUS from './lang/en-US'
import zhCN from './lang/zh-CN'

const messages = {
  'zh-CN': zhCN,
  'en-US': enUS,
}

export const i18n = createI18n({
  locale: 'zh-CN',
  fallbackLocale: 'zh-CN',
  messages,
})
```

### 在组件中使用

```vue
<template>
  <div>
    <h1>{{ $t('common.welcome') }}</h1>
    <p>{{ $t('auth.login') }}</p>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t, locale } = useI18n()

// 切换语言
const switchLanguage = (lang: string) => {
  locale.value = lang
}
</script>
```

### 语言包结构

```typescript
// src/locales/modules/common.ts
export default {
  welcome: '欢迎使用',
  loading: '加载中...',
  error: '错误',
  success: '成功',
}
```

## 🎯 最佳实践

### 1. 模块化翻译

- 按功能模块组织翻译文件
- 使用嵌套结构避免 key 冲突
- 保持翻译 key 的语义化

### 2. 类型安全

- 使用 TypeScript 定义翻译类型
- 提供完整的类型推导
- 避免硬编码翻译 key

### 3. 动态语言切换

- 支持运行时语言切换
- 持久化用户语言偏好
- 自动检测浏览器语言

## 📋 开发规范

### 翻译 key 命名

- 使用点号分隔的层级结构
- 使用小写字母和下划线
- 保持语义化和可读性

### 翻译内容

- 保持简洁明了
- 考虑不同语言的表达习惯
- 注意文本长度差异

## 🔧 故障排除

### 常见问题

1. **翻译不显示** - 检查 key 是否正确
2. **语言切换失败** - 验证语言包配置
3. **类型错误** - 更新类型定义

### 调试技巧

```typescript
// 检查当前语言
console.log(i18n.global.locale.value)

// 检查翻译 key
console.log(i18n.global.t('common.welcome'))
```

通过这套国际化方案，CC-Admin 提供了完整的多语言支持。
