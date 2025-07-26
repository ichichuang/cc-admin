# 生产环境 Mock 配置指南

## 概述

CC-Admin 框架使用自定义 Mock 服务，支持在生产环境中提供 Mock 数据，无需额外的服务器配置。

## 核心特性

### ✅ 生产环境支持

- 自定义 Mock 服务通过拦截 `fetch` 请求提供数据
- 无需额外的代理服务器或后端服务
- 支持静态文件部署

### ✅ 环境控制

```bash
# 启用 Mock（开发/测试/生产环境）
VITE_MOCK_ENABLE=true

# 禁用 Mock
VITE_MOCK_ENABLE=false
```

## 配置步骤

### 1. 环境变量配置

```bash
# .env.production
VITE_MOCK_ENABLE=true  # 根据需要启用
VITE_API_BASE_URL=https://api.your-domain.com
VITE_APP_ENV=production
```

### 2. 构建和部署

```bash
# 构建项目
pnpm build

# 部署到静态文件服务器
# Mock 服务会在客户端自动初始化
```

## 使用示例

### 用户管理 CRUD

```typescript
// 获取用户列表
const getUsers = async () => {
  const response = await fetch('/api/users')
  const result = await response.json()
  return result.data
}

// 创建用户
const createUser = async userData => {
  const response = await fetch('/api/users', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData),
  })
  return await response.json()
}
```

## 故障排除

### 常见问题

1. **Mock 请求返回 404**
   - 检查 `VITE_MOCK_ENABLE` 环境变量
   - 确认 Mock 服务已正确初始化

2. **生产环境 Mock 不工作**
   - 检查构建时是否包含了 Mock 相关代码
   - 确认环境变量配置正确

### 调试方法

```typescript
// 检查 Mock 服务状态
console.log('Mock 启用状态:', import.meta.env.VITE_MOCK_ENABLE)
console.log('当前环境:', import.meta.env.VITE_APP_ENV)
```

## 最佳实践

### 1. 环境区分

```typescript
// 根据环境决定是否启用 Mock
const isMockEnabled = import.meta.env.VITE_MOCK_ENABLE === 'true'
```

### 2. 错误处理

```typescript
// Mock 服务错误处理
try {
  await initMockService()
} catch (error) {
  console.warn('Mock 服务初始化失败')
  // 降级到真实 API
}
```

## 部署检查清单

- [ ] 环境变量正确配置
- [ ] Mock 服务在生产环境中正常工作
- [ ] 静态文件服务器配置正确
- [ ] 错误处理和降级机制完善

## 相关文档

- [Mock 数据指南](./mock-guide.md)
- [环境变量配置](./environment-variables.md)
- [部署指南](./deployment-guide.md)
