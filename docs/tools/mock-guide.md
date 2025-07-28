<!--
  @copyright Copyright (c) 2025 chichuang
  @license MIT
  @description CC-Admin 企业级后台管理框架 - mock-guide
  本文件为 chichuang 原创，禁止擅自删除署名或用于商业用途。
-->

# Mock 数据指南

## 概述

CC-Admin 使用自定义 Mock 服务提供接口模拟功能，支持开发和生产环境，包含认证、路由、用户管理等核心功能的 Mock 数据。

## 环境配置

### 启用 Mock 服务

```bash
# .env
VITE_MOCK_ENABLE=true
```

### 禁用 Mock 服务

```bash
# .env
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

### 3. 示例模块 (`expmple.ts`)

提供用户管理的 CRUD 操作示例：

- `GET /api/users` - 获取用户列表
- `GET /api/users/:id` - 获取单个用户
- `POST /api/users` - 创建用户
- `PUT /api/users/:id` - 更新用户
- `DELETE /api/users/:id` - 删除用户

## 使用示例

### 用户管理 CRUD 操作

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

// 更新用户
const updateUser = async (id, userData) => {
  const response = await fetch(`/api/users/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData),
  })
  return await response.json()
}

// 删除用户
const deleteUser = async id => {
  const response = await fetch(`/api/users/${id}`, {
    method: 'DELETE',
  })
  return await response.json()
}
```

### 认证请求

```typescript
// 登录
const login = async credentials => {
  const response = await fetch('/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  })
  return await response.json()
}
```

## 响应格式

### 成功响应

```typescript
{
  code: 200,
  message: '操作成功',
  data: { /* 数据 */ }
}
```

### 错误响应

```typescript
{
  code: 404,
  message: '资源不存在',
  data: null
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
- 生产环境可通过环境变量控制
- 支持生产环境使用

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
  url: '/api/users',
  method: 'GET',
  response: () => ({ code: 200, message: '成功', data: [] }),
}
```

## 总结

Mock 服务提供：

- ✅ 完整的 CRUD 操作示例
- ✅ 简化的认证流程
- ✅ 基础的路由配置
- ✅ 类型安全的接口定义
- ✅ 环境隔离的配置管理
- ✅ 生产环境支持

通过 Mock 服务，可以快速验证前端功能，提高开发效率。
