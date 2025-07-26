# 环境变量管理指南

## 概述

CC-Admin 采用分层环境变量管理方式，配备类型安全支持和自动验证机制。

## 文件结构

```
├── .env                  # 基础配置文件
├── .env.development      # 开发环境配置
├── .env.production       # 生产环境配置
├── src/Types/env.d.ts    # TypeScript 类型定义
├── src/utils/env.ts      # 环境变量工具
└── scripts/check-env.cts # 验证脚本
```

## 核心特性

### 🔧 分层管理

- **基础配置** - 包含默认值和公共变量
- **环境配置** - 覆盖特定环境的配置
- **类型安全** - 完整的 TypeScript 类型支持
- **自动验证** - 运行时验证和错误检查

## 环境变量配置

### 应用基础配置

| 变量名           | 类型                            | 默认值          | 说明           |
| ---------------- | ------------------------------- | --------------- | -------------- |
| `VITE_APP_TITLE` | `string`                        | `"CC-Admin"`    | 应用标题       |
| `VITE_APP_ENV`   | `"development" \| "production"` | `"development"` | 运行环境       |
| `VITE_PORT`      | `number`                        | `8888`          | 开发服务器端口 |

### API 配置

| 变量名              | 类型     | 说明           |
| ------------------- | -------- | -------------- |
| `VITE_API_BASE_URL` | `string` | API 服务器地址 |
| `VITE_API_TIMEOUT`  | `number` | 请求超时时间   |

### 开发配置

| 变量名             | 类型      | 说明            |
| ------------------ | --------- | --------------- |
| `VITE_MOCK_ENABLE` | `boolean` | 启用 Mock 数据  |
| `VITE_DEBUG`       | `boolean` | 启用 debug 模式 |

## 使用指南

### 在代码中使用

```typescript
import { env, isDev, isProd } from '@/utils/env'

// 获取配置
const apiBaseUrl = env.apiBaseUrl
const port = env.port

// 检查环境
if (isDev()) {
  console.log('开发环境')
}
```

### 直接访问

```typescript
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL
const port = Number(import.meta.env.VITE_PORT)
```

## 验证和检查

### 运行验证

```bash
pnpm run check-env
```

### 验证内容

- ✅ 类型定义完整性
- ✅ 必需变量存在性
- ✅ 值格式正确性
- ✅ 安全性检查

## 最佳实践

### 1. 添加新变量

1. 在 `.env` 中添加变量
2. 在 `env.d.ts` 中添加类型定义
3. 在 `utils/env.ts` 中添加访问器
4. 运行验证脚本

### 2. 命名规范

- 所有变量以 `VITE_` 开头
- 使用大写字母和下划线
- 按功能分组命名

### 3. 安全处理

- 敏感信息放在 `.env.local`
- 提供占位符和说明
- 避免提交敏感配置

## 故障排除

### 常见问题

**Q: 环境变量是字符串类型？**
A: Vite 中所有环境变量都是字符串，使用 `env` 工具自动转换。

**Q: 验证失败怎么办？**
A: 查看错误信息，按照提示修复配置。

### 调试技巧

```typescript
// 打印所有环境变量
console.log('Environment:', import.meta.env)

// 检查特定变量
console.log('API URL:', env.apiBaseUrl)
```

通过这套环境变量管理系统，CC-Admin 确保了配置的正确性和开发体验。
