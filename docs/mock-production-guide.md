# 生产环境 Mock 配置指南

## 概述

本指南介绍如何在 CC-Admin 框架的生产环境中正确配置和使用 Mock 数据服务。

## 🚨 问题说明

### 原始问题

在生产环境中，`vite-plugin-mock` 插件默认不会工作，导致以下错误：

```
POST https://www.cc-admin.wzdxcc.cloudns.org/mock/auth/login 404 (Not Found)
```

### 原因分析

1. `vite-plugin-mock` 主要设计用于开发环境
2. 生产构建时，Mock 服务不会启动
3. 静态文件服务器无法处理 Mock 请求

## ✅ 解决方案

### 方案一：自定义 Mock 服务（推荐）

我们已经在框架中实现了自定义的 Mock 服务，支持生产环境：

```typescript
// src/mock/mockService.ts
class MockService {
  // 通过拦截 fetch 请求来提供 Mock 数据
  private setupFetchInterceptor() {
    const originalFetch = window.fetch

    window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
      // 检查是否是 Mock 请求并返回模拟数据
    }
  }
}
```

### 方案二：环境变量配置

在生产环境中，通过环境变量控制 Mock 服务：

```bash
# 启用 Mock（开发/测试环境）
VITE_MOCK_ENABLE=true

# 禁用 Mock（生产环境）
VITE_MOCK_ENABLE=false
```

### 方案三：代理服务器配置

如果需要在生产环境中使用 Mock，可以配置代理服务器：

```nginx
# Nginx 配置示例
server {
    listen 80;
    server_name your-domain.com;

    # 静态文件服务
    location / {
        root /path/to/your/dist;
        try_files $uri $uri/ /index.html;
    }

    # Mock API 代理
    location /mock/ {
        proxy_pass http://localhost:3000/mock/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    # 真实 API 代理
    location /api/ {
        proxy_pass http://your-backend-server/api/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

## 🔧 配置步骤

### 1. 环境变量配置

创建生产环境配置文件：

```bash
# .env.production
VITE_MOCK_ENABLE=true  # 如果需要 Mock
VITE_API_BASE_URL=https://api.your-domain.com
VITE_APP_ENV=production
```

### 2. 构建配置

确保构建时包含 Mock 相关代码：

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

### 3. 部署配置

#### 静态文件部署

```bash
# 构建项目
pnpm build

# 部署到静态文件服务器
# 确保 Mock 服务在客户端正确初始化
```

#### Docker 部署

```dockerfile
# Dockerfile
FROM nginx:alpine

# 复制构建结果
COPY dist/ /usr/share/nginx/html/

# 复制 Nginx 配置
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
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

## 🚀 部署检查清单

- [ ] 环境变量正确配置
- [ ] Mock 服务在生产环境中正常工作
- [ ] 静态文件服务器配置正确
- [ ] API 请求路径配置正确
- [ ] 错误处理和降级机制完善
- [ ] 性能监控和日志记录

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

- [Mock 数据指南](./mock-guide.md)
- [环境变量配置](./environment-variables.md)
- [部署指南](./deployment-guide.md)
- [故障排除指南](./troubleshooting-guide.md)
