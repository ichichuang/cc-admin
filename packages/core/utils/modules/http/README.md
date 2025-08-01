/\*\*

- @copyright Copyright (c) 2025 chichuang
- @license MIT
- @description cc-admin 企业级后台管理框架 - HTTP 模块使用指南
- 本文件为 chichuang 原创，禁止擅自删除署名或用于商业用途。
  \*/

# HTTP 模块使用指南

## 概述

本模块提供了基于 Alova 的 HTTP 请求封装，支持动态配置，适用于 monorepo 架构中的多个子项目。

## 特性

- ✅ 支持动态配置 baseURL 和 timeout
- ✅ 支持全局配置和实例级配置
- ✅ 自动处理认证头
- ✅ 类型安全的配置接口
- ✅ 适用于多项目架构

## 基本使用

### 1. 设置全局配置（推荐）

在子项目的入口文件中设置全局配置：

```typescript
import { setHttpConfig } from '@cc-early-bird/core/utils/http'

// 设置全局配置
setHttpConfig({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000',
  timeout: import.meta.env.VITE_API_TIMEOUT || 10000,
  headers: {
    'X-Project': 'admin',
  },
})
```

### 2. 使用默认 HTTP 方法

```typescript
import { get, post, put, del, patch } from '@cc-early-bird/core/utils/http'

// GET 请求
const users = await get('/api/users', { page: 1, size: 10 })

// POST 请求
const newUser = await post('/api/users', { name: 'John', email: 'john@example.com' })

// PUT 请求
const updatedUser = await put('/api/users/1', { name: 'John Updated' })

// DELETE 请求
await del('/api/users/1')

// PATCH 请求
const patchedUser = await patch('/api/users/1', { email: 'newemail@example.com' })
```

### 3. 创建带自定义配置的 HTTP 方法

```typescript
import { createHttpMethods } from '@cc-early-bird/core/utils/http'

// 创建特定配置的 HTTP 方法
const adminHttp = createHttpMethods({
  baseURL: 'http://admin-api.example.com',
  timeout: 15000,
  headers: {
    'X-API-Version': 'v2',
  },
})

// 使用自定义配置的 HTTP 方法
const adminUsers = await adminHttp.get('/users')
const adminUser = await adminHttp.post('/users', userData)
```

### 4. 创建独立的 HTTP 实例

```typescript
import { createHttpInstance } from '@cc-early-bird/core/utils/http'

// 创建独立的 HTTP 实例
const customInstance = createHttpInstance({
  baseURL: 'http://custom-api.example.com',
  timeout: 20000,
})

// 直接使用实例
const data = await customInstance.Get('/api/data')
```

## 配置选项

### HttpConfig 接口

```typescript
interface HttpConfig {
  baseURL?: string // API 基础地址
  timeout?: number // 请求超时时间（毫秒）
  headers?: Record<string, string> // 默认请求头
}
```

## 最佳实践

### 1. 在子项目中初始化配置

```typescript
// apps/admin/src/main.ts
import { setHttpConfig } from '@cc-early-bird/core/utils/http'

// 根据环境设置配置
const config = {
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: Number(import.meta.env.VITE_API_TIMEOUT) || 10000,
}

setHttpConfig(config)
```

### 2. 为不同服务创建专用实例

```typescript
// 用户服务
const userHttp = createHttpMethods({
  baseURL: import.meta.env.VITE_USER_API_URL,
  headers: { 'X-Service': 'user' },
})

// 订单服务
const orderHttp = createHttpMethods({
  baseURL: import.meta.env.VITE_ORDER_API_URL,
  headers: { 'X-Service': 'order' },
})
```

### 3. 环境变量配置

在子项目的 `.env` 文件中：

```env
# API 配置
VITE_API_BASE_URL=http://localhost:3000
VITE_API_TIMEOUT=10000

# 不同服务的 API 地址
VITE_USER_API_URL=http://user-api.example.com
VITE_ORDER_API_URL=http://order-api.example.com
```

## 注意事项

1. **配置优先级**：实例配置 > 全局配置 > 默认配置
2. **认证头**：会自动从 localStorage 中读取 token 并添加到请求头
3. **错误处理**：建议在响应拦截器中统一处理错误
4. **类型安全**：所有配置都有完整的 TypeScript 类型支持

## 迁移指南

### 从旧版本迁移

如果你之前使用的是硬编码配置，现在需要：

1. 移除对 `env` 模块的依赖
2. 在应用入口处调用 `setHttpConfig`
3. 其他代码无需修改

```typescript
// 旧版本
import { env } from '../env'
// 使用 env.apiBaseUrl, env.apiTimeout

// 新版本
import { setHttpConfig } from '@cc-early-bird/core/utils/http'
setHttpConfig({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: import.meta.env.VITE_API_TIMEOUT,
})
```
