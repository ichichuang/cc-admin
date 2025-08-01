/\*\*

- @copyright Copyright (c) 2025 chichuang
- @license MIT
- @description cc-admin 企业级后台管理框架 - HTTP 模块重构迁移指南
- 本文件为 chichuang 原创，禁止擅自删除署名或用于商业用途。
  \*/

# HTTP 模块重构迁移指南

## 问题背景

在 monorepo 架构中，核心包的 HTTP 实例配置存在以下问题：

1. **硬编码环境变量**：核心包依赖 `../env` 模块，但该模块不存在
2. **配置不灵活**：所有子项目都使用相同的 baseURL 和 timeout
3. **架构不合理**：核心包不应该依赖特定项目的环境变量

## 解决方案

### 1. 重构 HTTP 实例配置

**之前的问题代码：**

```typescript
// packages/core/utils/modules/http/instance.ts
import { env } from '../env' // ❌ 不存在的模块

export const alovaInstance = createAlova({
  baseURL: env.apiBaseUrl, // ❌ 硬编码配置
  timeout: env.apiTimeout, // ❌ 硬编码配置
  // ...
})
```

**重构后的解决方案：**

```typescript
// packages/core/utils/modules/http/instance.ts
export interface HttpConfig {
  baseURL?: string
  timeout?: number
  headers?: Record<string, string>
}

// 支持动态配置的工厂函数
export const createHttpInstance = (config: HttpConfig = {}) => {
  const mergedConfig = { ...defaultConfig, ...globalConfig, ...config }
  return createAlova({
    baseURL: mergedConfig.baseURL,
    timeout: mergedConfig.timeout,
    // ...
  })
}

// 全局配置设置
export const setHttpConfig = (config: HttpConfig) => {
  globalConfig = { ...globalConfig, ...config }
}
```

### 2. 在子项目中初始化配置

**在子项目的入口文件中：**

```typescript
// apps/admin/src/main.ts
import { setHttpConfig } from '@cc-early-bird/core/utils/http'

// 初始化 HTTP 配置
setHttpConfig({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3003',
  timeout: Number(import.meta.env.VITE_API_TIMEOUT) || 10000,
  headers: {
    'X-Project': 'admin',
  },
})
```

### 3. 支持多种使用方式

#### 方式一：使用全局配置（推荐）

```typescript
import { get, post } from '@cc-early-bird/core/utils/http'

// 使用全局配置的 HTTP 方法
const users = await get('/api/users')
const newUser = await post('/api/users', userData)
```

#### 方式二：创建自定义配置的 HTTP 方法

```typescript
import { createHttpMethods } from '@cc-early-bird/core/utils/http'

// 为不同服务创建专用实例
const userHttp = createHttpMethods({
  baseURL: 'http://user-api.example.com',
  headers: { 'X-Service': 'user' },
})

const orderHttp = createHttpMethods({
  baseURL: 'http://order-api.example.com',
  headers: { 'X-Service': 'order' },
})
```

#### 方式三：创建独立的 HTTP 实例

```typescript
import { createHttpInstance } from '@cc-early-bird/core/utils/http'

const customInstance = createHttpInstance({
  baseURL: 'http://custom-api.example.com',
  timeout: 20000,
})

const data = await customInstance.Get('/api/data')
```

## 配置优先级

1. **实例配置**：`createHttpInstance(config)` 中的配置
2. **全局配置**：`setHttpConfig(config)` 设置的配置
3. **默认配置**：内置的默认值

```typescript
const mergedConfig = { ...defaultConfig, ...globalConfig, ...config }
```

## 迁移步骤

### 1. 更新核心包

- ✅ 已重构 `packages/core/utils/modules/http/instance.ts`
- ✅ 已更新 `packages/core/utils/modules/http/methods.ts`
- ✅ 已更新 `packages/core/utils/modules/http/index.ts`

### 2. 在子项目中初始化配置

```typescript
// apps/admin/src/main.ts
import { setHttpConfig } from '@cc-early-bird/core/utils/http'

setHttpConfig({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3003',
  timeout: Number(import.meta.env.VITE_API_TIMEOUT) || 10000,
  headers: {
    'X-Project': 'admin',
  },
})
```

### 3. 更新环境变量

在子项目的 `.env` 文件中：

```env
VITE_API_BASE_URL=http://localhost:3003
VITE_API_TIMEOUT=10000
```

### 4. 测试验证

- ✅ 已创建示例页面 `apps/admin/src/views/example/views/example-mock.vue`
- ✅ 包含基础 HTTP 方法测试
- ✅ 包含自定义配置测试
- ✅ 包含多服务测试

## 优势

1. **架构合理**：核心包不再依赖特定项目的环境变量
2. **配置灵活**：每个子项目可以有自己的 API 配置
3. **类型安全**：完整的 TypeScript 类型支持
4. **向后兼容**：现有的 HTTP 方法调用无需修改
5. **扩展性强**：支持多种配置方式和多服务架构

## 注意事项

1. **初始化时机**：必须在应用启动时调用 `setHttpConfig`
2. **配置合并**：实例配置会覆盖全局配置
3. **认证头**：会自动从 localStorage 读取 token
4. **错误处理**：建议在响应拦截器中统一处理

## 测试验证

运行以下命令测试重构后的功能：

```bash
# 启动开发服务器
pnpm dev

# 访问示例页面
http://localhost:8888/example/mock
```

在示例页面中可以测试：

- 基础 HTTP 方法（GET、POST、PUT、DELETE）
- 自定义配置的 HTTP 方法
- 多服务并行请求
- 当前 HTTP 配置查看
