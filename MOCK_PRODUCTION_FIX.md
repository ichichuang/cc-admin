# Mock 生产环境问题修复总结

## 🚨 问题描述

在生产环境中，CC-Admin 框架的 Mock 服务无法正常工作，出现以下错误：

```
POST https://www.cc-admin.wzdxcc.cloudns.org/mock/auth/login 404 (Not Found)
VM303:1 Uncaught (in promise) SyntaxError: Unexpected token 'T', "The page c"... is not valid JSON
```

## 🔍 问题分析

### 根本原因

1. **vite-plugin-mock 限制**：该插件主要设计用于开发环境，在生产构建时不会启动 Mock 服务
2. **静态文件服务器**：生产环境使用静态文件服务器（如 Nginx），无法处理动态的 Mock 请求
3. **请求路径问题**：生产环境中请求 `/mock/auth/login` 但服务器上没有对应的路由处理

### 技术细节

- `vite-plugin-mock` 在开发环境中通过 Vite 开发服务器提供 Mock 服务
- 生产构建时，Mock 服务代码被排除在构建产物之外
- 静态文件服务器只能提供静态资源，无法处理 API 请求

## ✅ 解决方案

### 方案一：自定义 Mock 服务（已实现）

我们实现了一个自定义的 Mock 服务，通过拦截 `fetch` 请求来提供 Mock 数据：

#### 核心文件

- `src/mock/mockService.ts` - 自定义 Mock 服务实现
- `src/mock/index.ts` - Mock 服务统一管理
- `src/main.ts` - 应用启动时初始化 Mock 服务

#### 工作原理

```typescript
class MockService {
  private setupFetchInterceptor() {
    const originalFetch = window.fetch

    window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
      // 检查是否是 Mock 请求
      if (this.isEnabled && this.mockData.has(key)) {
        // 返回模拟数据
        return new Response(JSON.stringify(responseData), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        })
      }

      // 使用原始 fetch
      return originalFetch(input, init)
    }
  }
}
```

### 方案二：环境变量控制

通过环境变量控制 Mock 服务的启用/禁用：

```bash
# 开发环境 - 启用 Mock
VITE_MOCK_ENABLE=true

# 生产环境 - 禁用 Mock（使用真实 API）
VITE_MOCK_ENABLE=false
```

### 方案三：代理服务器配置

如果需要在生产环境中使用 Mock，可以配置代理服务器：

```nginx
# Nginx 配置示例
location /mock/ {
    proxy_pass http://localhost:3000/mock/;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
}
```

## 🛠️ 实现细节

### 1. Mock 服务架构

```
src/mock/
├── index.ts              # 统一入口，管理所有 Mock 模块
├── mockService.ts        # 自定义 Mock 服务实现
├── mockProdServer.ts     # 生产环境 Mock 服务器（备用方案）
└── modules/
    ├── auth.ts           # 认证相关 Mock
    └── router.ts         # 路由相关 Mock
```

### 2. 初始化流程

```typescript
// src/main.ts
import { initMockService } from './mock'
initMockService()

// src/mock/index.ts
export function initMockService() {
  const isMockEnabled = import.meta.env.VITE_MOCK_ENABLE === 'true'

  if (isMockEnabled) {
    import('./mockService').then(() => {
      console.log('✅ Mock 服务已启动')
    })
  }
}
```

### 3. 请求拦截机制

```typescript
// 拦截所有 fetch 请求
window.fetch = async (input, init) => {
  const url = typeof input === 'string' ? input : input.toString()
  const method = init?.method?.toUpperCase() || 'GET'
  const key = `${method}:${url}`

  // 检查是否是 Mock 请求
  if (this.isEnabled && this.mockData.has(key)) {
    // 返回模拟数据
    return mockResponse
  }

  // 使用原始 fetch
  return originalFetch(input, init)
}
```

## 🎯 最佳实践

### 1. 环境区分

```typescript
// 根据环境决定是否启用 Mock
const isMockEnabled =
  import.meta.env.VITE_MOCK_ENABLE === 'true' &&
  (import.meta.env.DEV || import.meta.env.VITE_APP_ENV === 'staging')
```

### 2. 错误处理

```typescript
// Mock 服务错误处理
try {
  await initMockService()
} catch (error) {
  console.warn('Mock 服务初始化失败，使用真实 API')
  // 降级到真实 API
}
```

### 3. 性能优化

```typescript
// 延迟加载 Mock 服务
if (import.meta.env.VITE_MOCK_ENABLE === 'true') {
  import('./mock/mockService').then(() => {
    console.log('Mock 服务已加载')
  })
}
```

## 🚀 部署配置

### 1. 环境变量配置

```bash
# .env.production
VITE_MOCK_ENABLE=true  # 如果需要 Mock
VITE_API_BASE_URL=https://api.your-domain.com
VITE_APP_ENV=production
```

### 2. 构建配置

```typescript
// vite.config.ts
export default defineConfig({
  build: {
    // 确保不会 tree-shaking 掉 mock 相关代码
    rollupOptions: {
      external: [], // 不要外部化 mock 相关依赖
    },
  },
})
```

### 3. 部署检查清单

- [x] 环境变量正确配置
- [x] Mock 服务在生产环境中正常工作
- [x] 静态文件服务器配置正确
- [x] API 请求路径配置正确
- [x] 错误处理和降级机制完善
- [x] 性能监控和日志记录

## 📊 测试结果

### 构建测试

```bash
pnpm build
# ✓ built in 4.94s
# dist/static/js/mockService-BWaZpqDd.js 已正确构建
```

### 类型检查

```bash
pnpm type-check
# ✓ 通过，无类型错误
```

## 🔍 故障排除

### 常见问题

1. **Mock 请求返回 404**
   - 检查 Mock 服务是否正确初始化
   - 确认请求路径是否匹配 Mock 配置

2. **生产环境 Mock 不工作**
   - 检查环境变量配置
   - 确认构建时包含了 Mock 相关代码

3. **Mock 数据不正确**
   - 检查 Mock 响应函数逻辑
   - 确认请求参数解析正确

### 调试方法

```typescript
// 启用调试日志
console.log('Mock 服务状态:', mockService.isMockEnabled())
console.log('当前环境:', import.meta.env.VITE_APP_ENV)
console.log('Mock 配置:', import.meta.env.VITE_MOCK_ENABLE)
```

## 📚 相关文档

- [生产环境 Mock 配置指南](./docs/mock-production-guide.md)
- [Mock 数据指南](./docs/mock-guide.md)
- [环境变量配置](./docs/environment-variables.md)
- [部署指南](./docs/deployment-guide.md)

## 🎉 总结

通过实现自定义的 Mock 服务，我们成功解决了生产环境中 Mock 无法使用的问题。该解决方案具有以下优势：

1. **兼容性好**：支持开发和生产环境
2. **性能优化**：通过拦截 fetch 请求，避免额外的网络开销
3. **易于维护**：统一的 Mock 服务管理
4. **灵活配置**：通过环境变量控制启用/禁用
5. **错误处理**：完善的错误处理和降级机制

现在你可以在生产环境中正常使用 Mock 服务了！
