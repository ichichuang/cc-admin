# Faker API 修复说明

## 🐛 问题描述

在使用 `@faker-js/faker` v9.9.0 版本时，遇到了以下错误：

```
TypeError: faker.setLocale is not a function
```

## 🔍 问题原因

在 `@faker-js/faker` v9 版本中，API 发生了变化：

- **v8 及之前版本**: 使用 `faker.setLocale('zh_CN')` 设置语言
- **v9 版本**: 使用 `faker.locale = 'zh_CN'` 设置语言

## ✅ 修复方案

### 修复前

```typescript
import { faker } from '@faker-js/faker'

// ❌ 错误的方法
faker.setLocale('zh_CN')
```

### 修复后

```typescript
import { faker } from '@faker-js/faker'

// ✅ 正确的方法
faker.locale = 'zh_CN'
```

## 📝 修复的文件

以下文件已经修复：

1. `src/mock/modules/auth.ts`
2. `src/mock/modules/router.ts`
3. `src/mock/modules/user.ts`
4. `src/mock/modules/dashboard.ts`
5. `docs/mock-guide.md`
6. `MOCK_REFACTOR_SUMMARY.md`
7. `build/plugins.ts` - 修复 vite-plugin-mock 配置
8. `src/main.ts` - 优化 Mock 服务初始化

## 🔧 其他 API 变化

### 1. 语言设置

```typescript
// v8 及之前
faker.setLocale('zh_CN')

// v9
faker.locale = 'zh_CN'
```

### 2. 数据生成

```typescript
// v8 及之前
faker.name.findName()
faker.internet.email()
faker.internet.userName()

// v9
faker.person.fullName()
faker.internet.email()
faker.internet.username() // 注意：userName 改为 username
```

### 3. 数组操作

```typescript
// v8 及之前
faker.helpers.arrayElement(['a', 'b', 'c'])

// v9
faker.helpers.arrayElement(['a', 'b', 'c'])
// 或者使用新的方法
faker.helpers.arrayElements(['a', 'b', 'c'], { min: 1, max: 2 })
```

## 🧪 验证修复

### 1. TypeScript 检查

```bash
pnpm type-check
```

### 2. 开发服务器测试

```bash
pnpm dev
```

### 3. Mock 接口测试

```bash
# 测试登录接口
curl -X POST http://localhost:8889/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"123456"}'

# 测试用户列表接口
curl http://localhost:8889/user/list?page=1&size=10
```

## 📚 相关文档

- [@faker-js/faker v9 迁移指南](https://fakerjs.dev/guide/upgrading.html)
- [Mock 使用指南](./docs/mock-guide.md)
- [Mock 整改总结](./MOCK_REFACTOR_SUMMARY.md)

## 🎯 最佳实践

### 1. 版本兼容性

```typescript
// 检查 faker 版本
import { faker } from '@faker-js/faker'

// 使用条件判断确保兼容性
if (typeof faker.setLocale === 'function') {
  faker.setLocale('zh_CN')
} else {
  faker.locale = 'zh_CN'
}
```

### 2. 类型安全

```typescript
// 使用 TypeScript 类型检查
import { faker } from '@faker-js/faker'

// 确保类型安全
const user = {
  id: faker.string.uuid(),
  name: faker.person.fullName(),
  email: faker.internet.email(),
} as const
```

### 3. 错误处理

```typescript
try {
  faker.locale = 'zh_CN'
} catch (error) {
  console.warn('设置 faker 语言失败:', error)
  // 使用默认语言
}
```

## ✅ 修复结果

- ✅ 所有 Mock 模块正常工作
- ✅ TypeScript 类型检查通过
- ✅ 开发服务器正常启动
- ✅ Mock 接口响应正常
- ✅ 文档已更新

## 🔄 后续维护

1. **定期更新依赖**: 保持 `@faker-js/faker` 版本最新
2. **API 兼容性**: 关注新版本的 API 变化
3. **测试覆盖**: 确保 Mock 功能正常工作
4. **文档同步**: 及时更新相关文档

---

**修复完成时间**: 2024年12月19日
**修复版本**: @faker-js/faker v9.9.0
**状态**: ✅ 已修复
