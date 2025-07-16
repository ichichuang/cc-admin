# 环境变量管理指南

## 概述

CC-Admin 项目采用分层环境变量管理方式，配备完整的类型安全支持和自动验证机制，确保配置的正确性和开发体验。

## 文件结构

```
├── .env                  # 基础配置文件（包含公共变量和默认值）
├── .env.development      # 开发环境配置（只覆盖特定配置）
├── .env.production       # 生产环境配置（只覆盖特定配置）
├── src/Types/env.d.ts    # TypeScript 类型定义
├── src/utils/env.ts      # 类型安全的环境变量工具
└── scripts/check-env.cjs # 环境变量验证脚本
```

## 核心特性

### 🔧 分层管理策略

**基础配置层（.env）**

- 包含所有环境变量的默认值和详细注释
- 作为配置的"真相之源"
- 提供合理的默认值

**环境特定配置层（.env.development/.env.production）**

- 只包含需要根据环境变化的配置
- 继承基础配置的默认值
- 清晰的环境差异对比

### 🔒 类型安全支持

**TypeScript 类型定义（env.d.ts）**

- 完整的环境变量类型定义
- 支持联合类型和枚举约束
- 提供智能提示和类型检查

**类型安全工具（utils/env.ts）**

- 自动类型转换（字符串 → 布尔值/数字）
- 类型安全的环境变量访问器
- 运行时验证和错误检查

### ✅ 自动验证机制

**验证脚本（scripts/check-env.cjs）**

- 类型定义完整性检查
- 必需变量存在性验证
- 值格式和范围验证
- 安全性检查和优化建议

## 环境变量配置

### 应用基础配置

| 变量名                          | 类型                            | 默认值          | 说明                         |
| ------------------------------- | ------------------------------- | --------------- | ---------------------------- |
| `VITE_APP_TITLE`                | `string`                        | `"CC-Admin"`    | 应用标题，显示在浏览器标题栏 |
| `VITE_APP_VERSION`              | `string`                        | `"1.0.0"`       | 应用版本号，用于版本控制     |
| `VITE_APP_ENV`                  | `"development" \| "production"` | `"development"` | 当前运行环境                 |
| `VITE_PINIA_PERSIST_KEY_PREFIX` | `string`                        | `"cc-admin"`    | Pinia 持久化存储 key 前缀    |
| `VITE_PUBLIC_PATH`              | `string`                        | `"/"`           | 应用根路径                   |
| `VITE_PORT`                     | `number`                        | `8888`          | 开发服务器端口               |
| `VITE_ROOT_REDIRECT`            | `string`                        | `"dashboard"`   | 登录后重定向路径             |
| `VITE_LOADING_SIZE`             | `number`                        | `5`             | Loading 组件大小             |

### API 接口配置

| 变量名              | 类型     | 说明                     |
| ------------------- | -------- | ------------------------ |
| `VITE_API_BASE_URL` | `string` | API 服务器基础地址       |
| `VITE_API_TIMEOUT`  | `number` | API 请求超时时间（毫秒） |

### 开发环境配置

| 变量名             | 类型      | 说明                  |
| ------------------ | --------- | --------------------- |
| `VITE_DEV_TOOLS`   | `boolean` | 是否启用 Vue DevTools |
| `VITE_MOCK_ENABLE` | `boolean` | 是否启用 Mock 数据    |
| `VITE_CONSOLE_LOG` | `boolean` | 是否启用控制台日志    |
| `VITE_DEBUG`       | `boolean` | 是否启用 debug 模式   |

### 构建优化配置

| 变量名                 | 类型                                     | 说明                      |
| ---------------------- | ---------------------------------------- | ------------------------- |
| `VITE_DROP_DEBUGGER`   | `boolean`                                | 生产环境是否移除 debugger |
| `VITE_DROP_CONSOLE`    | `boolean`                                | 生产环境是否移除 console  |
| `VITE_BUILD_ANALYZE`   | `boolean`                                | 是否启用构建分析          |
| `VITE_BUILD_SOURCEMAP` | `boolean`                                | 是否生成 sourcemap        |
| `VITE_COMPRESSION`     | `"none" \| "gzip" \| "brotli" \| "both"` | 构建产物压缩方式          |
| `VITE_LEGACY`          | `boolean`                                | 是否支持 legacy 浏览器    |
| `VITE_CDN`             | `boolean`                                | 是否启用 CDN              |

## 使用指南

### 在代码中使用（推荐方式）

```typescript
// 使用类型安全的环境变量工具
import { env, isDev, isProd } from '@/utils/env'

// 获取 API 基础地址（自动类型转换）
const apiBaseUrl = env.apiBaseUrl

// 检查环境
if (isDev()) {
  console.log('开发环境')
}

// 获取数字类型（自动转换）
const port = env.port // number 类型
const timeout = env.apiTimeout // number 类型

// 获取布尔类型（自动转换）
const enableMock = env.mockEnable // boolean 类型
```

### 直接访问原始环境变量

```typescript
// 获取原始字符串值
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL

// 手动类型转换
const port = Number(import.meta.env.VITE_PORT)
const enableMock = import.meta.env.VITE_MOCK_ENABLE === 'true'
```

### 在 Vite 配置中使用

```typescript
// vite.config.ts
import { env } from './src/utils/env'

export default defineConfig({
  server: {
    port: env.port,
  },
  build: {
    sourcemap: env.buildSourcemap,
  },
})
```

## 验证和检查

### 运行环境变量检查

```bash
# 检查环境变量配置
pnpm run check-env

# 或者直接运行脚本
node scripts/check-env.cjs
```

### 验证内容包括

- ✅ 类型定义完整性
- ✅ 必需变量存在性
- ✅ 值格式正确性
- ✅ 数值范围验证
- ✅ 安全性检查
- ✅ 重复定义检测

## 最佳实践

### 1. 添加新环境变量

1. **在 `.env` 中添加变量和注释**

   ```env
   # 新功能开关
   VITE_NEW_FEATURE=false
   ```

2. **在 `env.d.ts` 中添加类型定义**

   ```typescript
   /** 是否启用新功能 */
   readonly VITE_NEW_FEATURE: BooleanString
   ```

3. **在 `utils/env.ts` 中添加访问器**

   ```typescript
   get newFeature(): boolean {
     return toBool(import.meta.env.VITE_NEW_FEATURE)
   }
   ```

4. **在验证脚本中添加规则（如需要）**
   ```javascript
   types: {
     'VITE_NEW_FEATURE': 'boolean',
   }
   ```

### 2. 环境变量命名规范

- ✅ 所有客户端变量必须以 `VITE_` 开头
- ✅ 使用大写字母和下划线分隔
- ✅ 名称具有描述性，清晰表达用途
- ✅ 按功能分组（APP*、API*、BUILD\_ 等）

### 3. 敏感信息处理

- 🔒 敏感信息放在 `.env.local` 文件中
- 🔒 `.env.local` 已被 `.gitignore` 忽略
- 🔒 在 `.env` 中提供占位符和说明

### 4. 类型安全实践

- 🎯 优先使用 `env` 工具而非直接访问 `import.meta.env`
- 🎯 为枚举类型定义联合类型
- 🎯 使用类型守卫进行运行时检查
- 🎯 在开发环境启用自动验证

## 故障排除

### 常见问题

**Q: 为什么环境变量是字符串类型？**
A: Vite 中所有环境变量都是字符串。使用 `env` 工具可以自动进行类型转换。

**Q: 如何在运行时验证环境变量？**
A: 使用 `EnvValidator.validateAll()` 进行完整验证，或使用 `env` 工具的自动验证。

**Q: 环境变量检查失败怎么办？**
A: 查看错误信息，按照提示修复配置，确保所有必需变量都已正确设置。

**Q: 如何禁用开发环境的自动验证？**
A: 修改 `utils/env.ts` 文件，注释掉底部的自动验证代码。

### 调试技巧

```typescript
// 打印所有环境变量
console.log('Environment:', import.meta.env)

// 检查特定变量
console.log('API URL:', env.apiBaseUrl)
console.log('Is Dev:', isDev())

// 手动触发验证
try {
  EnvValidator.validateAll()
  console.log('✅ 验证通过')
} catch (error) {
  console.error('❌ 验证失败:', error)
}
```

## 迁移指南

### 从旧版本迁移

1. **备份现有配置**

   ```bash
   cp .env .env.backup
   cp .env.development .env.development.backup
   cp .env.production .env.production.backup
   ```

2. **更新类型定义**
   - 使用新的 `env.d.ts` 类型定义
   - 更新代码中的环境变量访问方式

3. **使用新的工具**

   ```typescript
   // 旧方式
   const apiUrl = import.meta.env.VITE_API_BASE_URL
   const port = Number(import.meta.env.VITE_PORT)

   // 新方式
   import { env } from '@/utils/env'
   const apiUrl = env.apiBaseUrl
   const port = env.port
   ```

4. **运行验证**
   ```bash
   pnpm run check-env
   ```

通过这些改进，CC-Admin 的环境变量管理系统现在具备了企业级的完整性和可靠性！
