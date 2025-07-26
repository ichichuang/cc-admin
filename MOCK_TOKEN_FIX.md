# Mock Token 修复说明

## 🐛 问题描述

在使用 Mock 服务时，遇到了以下错误：

```
Uncaught (in promise) Error: 未授权或 token 无效
    at responseHandler (interceptors.ts:46:13)
    at async handleResponseTask (alova.esm.js:501:34)
```

## 🔍 问题原因

Mock 服务中的 token 验证失败，主要原因：

1. **动态 Token 生成**: 每次 Mock 服务重启时，`MOCK_TOKEN` 都会重新生成
2. **Token 不匹配**: 前端保存的 token 与 Mock 服务中的 token 不一致
3. **验证失败**: 导致所有需要认证的接口都返回 "未授权或 token 无效" 错误

## ✅ 修复方案

### 修复前

```typescript
// ❌ 每次重启都会生成新的 token
const MOCK_TOKEN = 'fake-jwt-token-' + faker.string.alphanumeric(32)
```

### 修复后

```typescript
// ✅ 使用固定的 token
const MOCK_TOKEN = 'fake-jwt-token-mock-admin-123456'
```

## 📝 修复的文件

以下文件已经修复：

1. `src/mock/modules/auth.ts`
2. `src/mock/modules/router.ts`
3. `src/mock/modules/user.ts`
4. `src/mock/modules/dashboard.ts`

## 🔧 技术细节

### 1. Token 一致性

所有 Mock 模块现在使用相同的固定 token：

```typescript
const MOCK_TOKEN = 'fake-jwt-token-mock-admin-123456'
```

### 2. 验证逻辑

Mock 服务中的 token 验证逻辑：

```typescript
response: ({ headers }: { headers: { authorization: string } }) => {
  const auth = headers.authorization || ''
  const token = auth.replace(/^Bearer\s+/i, '')

  if (token !== MOCK_TOKEN) {
    return {
      success: false,
      message: '未授权或 token 无效',
      code: 40101,
    }
  }

  // 验证通过，返回数据
  return {
    success: true,
    message: '获取用户信息成功',
    code: 200,
    data: userInfo,
  }
}
```

### 3. 前端集成

前端使用 alova 发送请求时，会自动添加 token：

```typescript
// 请求拦截器自动添加 token
export const beforeRequest = (method: Method) => {
  const token = useUserStoreWithOut().getToken
  if (token) {
    method.config.headers.authorization = `Bearer ${token}`
  }
}
```

## 🧪 验证修复

### 1. 登录测试

```bash
curl -X POST http://localhost:8889/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"123456"}'
```

**预期响应**:

```json
{
  "success": true,
  "message": "登录成功",
  "code": 200,
  "data": {
    "token": "fake-jwt-token-mock-admin-123456",
    "refreshToken": "refresh-token-xxx",
    "expiresIn": 7200,
    "user": { ... }
  }
}
```

### 2. 用户信息测试

```bash
curl -X GET http://localhost:8889/auth/userInfo \
  -H "Authorization: Bearer fake-jwt-token-mock-admin-123456"
```

**预期响应**:

```json
{
  "success": true,
  "message": "获取用户信息成功",
  "code": 200,
  "data": { ... }
}
```

### 3. 前端测试

在前端应用中：

1. 使用测试账户登录：`admin` / `123456`
2. 登录成功后，前端会保存 token
3. 后续请求会自动携带 token
4. Mock 服务验证 token 并返回数据

## 🎯 最佳实践

### 1. Token 管理

```typescript
// 使用固定的 Mock token
const MOCK_TOKEN = 'fake-jwt-token-mock-admin-123456'

// 避免使用动态生成的 token
// const MOCK_TOKEN = 'fake-jwt-token-' + faker.string.alphanumeric(32)
```

### 2. 错误处理

```typescript
// Mock 服务中的错误处理
if (token !== MOCK_TOKEN) {
  return {
    success: false,
    message: '未授权或 token 无效',
    code: 40101,
  }
}
```

### 3. 调试技巧

```typescript
// 在开发环境中打印 token 信息
if (import.meta.env.DEV) {
  console.log('Mock Token:', MOCK_TOKEN)
  console.log('Request Token:', token)
}
```

## 📊 修复结果

### ✅ 验证通过的项目

- [x] 登录接口正常工作
- [x] 用户信息接口正常工作
- [x] 所有需要认证的接口正常工作
- [x] Token 验证逻辑正确
- [x] 前端请求正常处理

### 🎭 接口状态

- **认证模块**: ✅ 正常工作
  - `POST /auth/login` - 返回固定 token
  - `GET /auth/userInfo` - 验证固定 token
  - `POST /auth/logout` - 正常工作
  - `POST /auth/refresh` - 正常工作

- **其他模块**: ✅ 正常工作
  - 所有需要认证的接口都使用相同的 token 验证逻辑

## 🔄 后续维护

1. **Token 一致性**: 确保所有 Mock 模块使用相同的 token
2. **版本控制**: 如果需要更改 token，同时更新所有相关文件
3. **文档同步**: 及时更新相关文档和测试用例
4. **测试覆盖**: 确保所有认证相关的接口都有测试覆盖

## 📚 相关文档

- [Mock 使用指南](./docs/mock-guide.md)
- [Mock 整改总结](./MOCK_REFACTOR_SUMMARY.md)
- [Mock 最终修复总结](./MOCK_FINAL_FIX.md)
- [Faker API 修复说明](./FAKER_API_FIX.md)

## 🎉 总结

通过本次修复，我们成功解决了：

1. **Token 一致性问题**: 使用固定的 Mock token
2. **验证失败问题**: 确保前端和 Mock 服务的 token 匹配
3. **用户体验问题**: 避免频繁的认证失败
4. **开发效率问题**: 提供稳定的 Mock 环境

Mock 系统现在完全稳定可靠，可以支持项目的开发需求！

---

**修复完成时间**: 2024年12月19日
**修复版本**: @faker-js/faker v9.9.0
**状态**: ✅ 完全修复
