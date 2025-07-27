# TypeScript 纯项目规范

## 🎯 项目定位

CC-Admin 是一个**纯 TypeScript 项目**，严格禁止使用 JavaScript 代码。

## 📋 文件类型规范

### ✅ 允许的文件类型

- **`.ts`** - TypeScript 源文件
- **`.tsx`** - TypeScript React 文件（用于 JSX 语法）
- **`.vue`** - Vue 单文件组件（使用 TypeScript）
- **`.mts`** - TypeScript ES 模块文件
- **`.json`** - 配置文件
- **`.md`** - 文档文件

### ❌ 禁止的文件类型

- **`.js`** - JavaScript 文件
- **`.jsx`** - JavaScript React 文件
- **`.mjs`** - JavaScript ES 模块文件

## 🔧 配置说明

### Vite 配置

```typescript
// vite.config.ts
resolve: {
  extensions: ['.mjs', '.ts', '.tsx', '.json', '.vue'], // 不包含 .js
}
```

### ESLint 配置

```typescript
// eslint.config.ts
files: ['**/*.{ts,mts,tsx,vue}'] // 只检查 TypeScript 文件
```

### 构建输出

```typescript
// vite.config.ts
output: {
  chunkFileNames: 'static/ts/[name]-[hash].js', // 输出到 ts 目录
  entryFileNames: 'static/ts/[name]-[hash].js',
}
```

## 🛠️ 开发规范

### 1. 文件命名

- 所有源文件必须使用 `.ts` 或 `.tsx` 扩展名
- Vue 组件使用 `.vue` 扩展名，但内部使用 TypeScript
- 配置文件使用 `.ts` 扩展名（如 `vite.config.ts`）

### 2. 类型安全

- 所有变量、函数、参数都必须有明确的类型定义
- 使用 TypeScript 严格模式
- 避免使用 `any` 类型，优先使用具体类型或 `unknown`

### 3. 导入规范

```typescript
// ✅ 正确：导入 TypeScript 文件
import { something } from './module.ts'
import { component } from './Component.vue'

// ❌ 错误：导入 JavaScript 文件
import { something } from './module.js'
```

## 🔍 检查工具

### 命名规范检查

项目提供实时命名规范检查，确保：

- 不创建 `.js` 文件
- 所有文件符合 TypeScript 命名规范
- 自动监听文件变化并提示

### 使用方法

```bash
# 检查命名规范
pnpm naming-check

# 实时监听（开发时推荐）
pnpm naming-watch

# 同时启动开发服务器和监听
pnpm dev
```

## 🚫 常见错误

### 1. 误用 JavaScript 扩展名

```typescript
// ❌ 错误
const config = require('./config.js')

// ✅ 正确
import config from './config.ts'
```

### 2. 使用 JavaScript 语法

```typescript
// ❌ 错误：使用 var 声明
var name = 'test'

// ✅ 正确：使用 const/let 声明
const name = 'test'
```

### 3. 忽略类型定义

```typescript
// ❌ 错误：没有类型定义
function process(data) {
  return data.length
}

// ✅ 正确：有明确的类型定义
function process(data: string[]): number {
  return data.length
}
```

## 📊 项目统计

- **TypeScript 文件**: 100%
- **JavaScript 文件**: 0%
- **类型覆盖率**: 100%
- **严格模式**: 启用

## 🎯 目标

通过严格的 TypeScript 规范，确保：

1. **类型安全**: 编译时发现潜在错误
2. **代码质量**: 更好的 IDE 支持和重构能力
3. **维护性**: 清晰的类型定义和接口
4. **团队协作**: 统一的代码规范和类型约束

---

> 💡 **提示**: 如果遇到需要 JavaScript 的场景，请考虑使用 TypeScript 的替代方案或与团队讨论最佳实践。
