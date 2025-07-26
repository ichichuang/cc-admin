# Mock 示例使用指南

## 概述

本指南介绍 CC-Admin 框架中的 Mock 示例功能，展示如何使用自定义 Mock 服务进行用户管理的 CRUD 操作。

## 功能特性

### ✅ 完整的 CRUD 操作

- **Create**: 创建新用户
- **Read**: 获取用户列表和单个用户详情
- **Update**: 更新用户信息
- **Delete**: 删除用户

### ✅ 用户界面

- 响应式表单设计
- 实时操作反馈
- 用户友好的交互体验

## 快速开始

### 1. 访问示例页面

在浏览器中访问：`/example/mock`

### 2. 启用 Mock 服务

确保环境变量配置正确：

```bash
# .env
VITE_MOCK_ENABLE=true
```

### 3. 开始使用

页面会自动加载初始用户数据，包含：

- admin 用户（管理员）
- user1 用户（普通用户）
- user2 用户（禁用状态）

## 操作说明

### 创建用户

1. 在表单中填写用户信息：
   - 用户名
   - 邮箱
   - 角色（普通用户/管理员）
   - 状态（激活/禁用）

2. 点击"创建"按钮

3. 系统会显示操作结果，并自动刷新用户列表

### 编辑用户

1. 在用户列表中点击"编辑"按钮

2. 表单会自动填充当前用户信息

3. 修改需要更新的字段

4. 点击"更新"按钮保存更改

### 删除用户

1. 在用户列表中点击"删除"按钮

2. 确认删除操作

3. 用户将被从列表中移除

### 获取用户详情

点击"获取详情"按钮可以获取单个用户的详细信息，结果会在消息提示中显示。

## 技术实现

### Mock 接口

```typescript
// 用户管理接口
GET    /api/users          // 获取用户列表
GET    /api/users/:id      // 获取单个用户
POST   /api/users          // 创建用户
PUT    /api/users/:id      // 更新用户
DELETE /api/users/:id      // 删除用户
```

### 数据结构

```typescript
interface MockUser {
  id: number
  username: string
  email: string
  role: 'admin' | 'user'
  status: 'active' | 'inactive'
  createdAt: string
  updatedAt: string
}
```

### 响应格式

```typescript
interface ApiResponse<T> {
  code: number
  message: string
  data: T
}
```

## 开发参考

### 添加新的 Mock 接口

1. 在 `src/mock/modules/` 目录下创建新的模块文件

2. 定义接口类型和响应格式

3. 实现 Mock 响应逻辑

4. 在 `src/mock/index.ts` 中注册新模块

### 扩展用户管理功能

可以基于现有示例扩展更多功能：

- 用户搜索和筛选
- 批量操作
- 用户权限管理
- 数据导入导出

## 故障排除

### 常见问题

1. **页面显示"暂无用户数据"**
   - 检查 Mock 服务是否启用
   - 确认环境变量配置正确

2. **操作失败**
   - 检查浏览器控制台错误信息
   - 确认网络请求是否正常

3. **数据不更新**
   - 刷新页面重新加载数据
   - 检查 Mock 服务状态

### 调试方法

```typescript
// 在浏览器控制台中检查 Mock 服务状态
console.log('Mock 启用状态:', import.meta.env.VITE_MOCK_ENABLE)

// 检查用户数据
const response = await fetch('/api/users')
const result = await response.json()
console.log('用户数据:', result)
```

## 相关文档

- [Mock 数据指南](./mock-guide.md)
- [生产环境 Mock 配置](./mock-production-guide.md)
- [环境变量配置](./environment-variables.md)
