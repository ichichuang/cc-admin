# Mock 数据指南

## 概述

CC-Admin 使用 `vite-plugin-mock` 提供开发环境的接口模拟服务，支持认证、路由、用户管理等核心功能的 Mock 数据。

## 环境配置

### 启用 Mock 服务

```bash
# .env
VITE_MOCK_ENABLE=true
```

### 禁用 Mock 服务

```bash
VITE_MOCK_ENABLE=false
```

## Mock 模块

### 1. 认证模块 (`auth.ts`)

提供用户认证相关的 Mock 接口：

- `POST /auth/login` - 用户登录
- `GET /auth/userInfo` - 获取用户信息

**测试账户：**

- 用户名：`admin`
- 密码：`123456`

### 2. 路由模块 (`router.ts`)

提供路由配置的 Mock 接口：

- `GET /auth/routes` - 获取路由配置

## 使用示例

### 登录请求

```typescript
const response = await fetch('/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    username: 'admin',
    password: '123456',
  }),
})
```

### 获取用户信息

```typescript
const response = await fetch('/auth/userInfo', {
  headers: {
    Authorization: 'Bearer fake-jwt-token-123456',
  },
})
```

### 获取路由配置

```typescript
const response = await fetch('/auth/routes', {
  headers: {
    Authorization: 'Bearer fake-jwt-token-123456',
  },
})
```

## 响应格式

### 成功响应

```typescript
{
  success: true,
  message: '操作成功',
  data: { /* 数据 */ }
}
```

### 错误响应

```typescript
{
  success: false,
  message: '错误信息'
}
```

## 开发建议

### 1. 保持简洁

- 使用静态数据而非复杂的生成逻辑
- 专注于核心功能的 Mock 实现
- 避免过度复杂的业务逻辑

### 2. 类型安全

- 使用 TypeScript 定义接口类型
- 确保 Mock 数据与真实 API 格式一致
- 提供完整的类型定义

### 3. 环境隔离

- 开发环境启用 Mock 服务
- 生产环境禁用 Mock 服务
- 通过环境变量控制开关

## 故障排除

### Mock 服务未启动

检查环境变量：

```bash
echo $VITE_MOCK_ENABLE
```

### 接口返回 404

确认 Mock 配置正确：

```typescript
{
  url: '/auth/login',
  method: 'post',
  response: ({ body }) => ({ /* 响应数据 */ }),
}
```

## 总结

Mock 服务提供：

- ✅ 简化的认证流程
- ✅ 基础的路由配置
- ✅ 类型安全的接口定义
- ✅ 环境隔离的配置管理
- ✅ 清晰的错误处理

通过 Mock 服务，可以快速验证前端功能，提高开发效率。
