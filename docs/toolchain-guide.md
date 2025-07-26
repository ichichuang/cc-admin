# 开发工具链指南

## 概述

CC-Admin 采用现代化的前端开发工具链，提供完整的代码质量保证和开发体验优化。

## 🛠️ 工具链架构

### 核心工具

| 分类         | 工具               | 作用             |
| ------------ | ------------------ | ---------------- |
| **编辑器**   | Cursor, VS Code    | 代码编写和调试   |
| **代码质量** | ESLint, Prettier   | 代码检查和格式化 |
| **类型检查** | TypeScript         | 静态类型检查     |
| **Git 工具** | Husky, lint-staged | Git Hooks 管理   |
| **提交规范** | Commitizen         | 规范化提交信息   |
| **包管理**   | pnpm               | 依赖包管理       |
| **构建工具** | Vite               | 开发服务器和构建 |

## 🎯 代码编辑器配置

### Cursor 配置

```json
// .cursor/settings.json
{
  "typescript.preferences.quoteStyle": "single",
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit"
  },
  "npm.packageManager": "pnpm"
}
```

### VS Code 扩展推荐

- **Vue Language Features (Volar)**
- **TypeScript Vue Plugin (Volar)**
- **ESLint**
- **Prettier**
- **UnoCSS**
- **GitLens**

## 🔧 代码质量工具

### ESLint 配置

```javascript
// eslint.config.ts
import js from '@eslint/js'
import typescript from '@typescript-eslint/eslint-plugin'
import typescriptParser from '@typescript-eslint/parser'
import vue from 'eslint-plugin-vue'

export default [
  js.configs.recommended,
  {
    files: ['**/*.{js,ts,vue}'],
    languageOptions: {
      parser: typescriptParser,
    },
    plugins: {
      '@typescript-eslint': typescript,
      vue,
    },
    rules: {
      // 自定义规则
    },
  },
]
```

### Prettier 配置

```json
// .prettierrc
{
  "semi": false,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5"
}
```

## 🔍 类型检查

### TypeScript 配置

```json
// tsconfig.json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "strict": true,
    "jsx": "preserve",
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "skipLibCheck": true
  }
}
```

## 🐙 Git 工作流

### Husky 配置

```json
// package.json
{
  "scripts": {
    "prepare": "husky install"
  },
  "lint-staged": {
    "*.{js,ts,vue}": ["eslint --fix", "prettier --write"]
  }
}
```

### 提交规范

```bash
# 提交类型
feat:     新功能
fix:      修复问题
docs:     文档更新
style:    代码格式调整
refactor: 代码重构
test:     测试相关
chore:    构建过程或辅助工具的变动
```

## 📦 包管理

### pnpm 配置

```bash
# 安装依赖
pnpm install

# 添加依赖
pnpm add package-name

# 开发依赖
pnpm add -D package-name

# 运行脚本
pnpm dev
pnpm build
pnpm test
```

## 🚀 构建工具

### Vite 配置

```typescript
// vite.config.ts
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import UnoCSS from 'unocss/vite'

export default defineConfig({
  plugins: [vue(), UnoCSS()],
  resolve: {
    alias: {
      '@': '/src',
    },
  },
})
```

## 🔧 开发脚本

### 常用命令

```bash
# 开发环境
pnpm dev

# 构建生产版本
pnpm build

# 代码检查
pnpm lint

# 类型检查
pnpm type-check

# 运行测试
pnpm test

# 格式化代码
pnpm format
```

## 🎯 最佳实践

### 1. 代码规范

- 使用 ESLint 和 Prettier 保持代码一致性
- 遵循 TypeScript 严格模式
- 使用语义化的提交信息

### 2. 开发流程

- 创建功能分支进行开发
- 提交前运行代码检查
- 使用 Pull Request 进行代码审查

### 3. 工具集成

- 配置编辑器自动格式化
- 启用 Git Hooks 自动检查
- 使用 CI/CD 自动化流程

## 🔧 故障排除

### 常见问题

1. **ESLint 配置冲突** - 检查配置文件优先级
2. **TypeScript 类型错误** - 运行 `pnpm type-check`
3. **Prettier 格式化问题** - 检查 `.prettierrc` 配置

### 调试技巧

```bash
# 检查 ESLint 配置
pnpm lint --debug

# 检查 TypeScript 配置
pnpm tsc --noEmit

# 检查依赖关系
pnpm why package-name
```

通过这套工具链，CC-Admin 提供了高效的开发体验和代码质量保证。
