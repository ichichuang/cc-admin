<!--
  @copyright Copyright (c) 2025 chichuang
  @license MIT
  @description CC-Admin 企业级后台管理框架 - project-rules
  本文件为 chichuang 原创，禁止擅自删除署名或用于商业用途。
-->

# CC-Admin 项目配置规则说明

## 📋 概述

本文档详细记录了 CC-Admin 项目的所有配置文件、开发规则和约定，确保团队成员和AI助手都能正确理解和使用项目配置。

## 🔧 包管理器配置

### 强制使用 pnpm

项目强制使用 `pnpm` 作为包管理器，配置分布在以下文件：

#### 1. package.json

```json
{
  "packageManager": "pnpm@10.12.4",
  "engines": {
    "node": ">=24.3.0",
    "pnpm": ">=8.0.0"
  }
}
```

#### 2. .cursor/settings.json

```json
{
  "npm.packageManager": "pnpm"
}
```

#### 3. .vscode/settings.json

```json
{
  "npm.packageManager": "pnpm"
}
```

#### 4. 约束规则

- ✅ **允许**: `pnpm install`, `pnpm dev`, `pnpm build`
- ❌ **禁止**: `npm install`, `yarn install`, `npm run dev`
- 🤖 **AI规则**: AI助手必须使用 `pnpm` 命令，不得使用 `npm` 或 `yarn`

## 🎯 项目配置文件一览

### 核心配置文件

| 文件               | 作用           | 重要配置                         |
| ------------------ | -------------- | -------------------------------- |
| `package.json`     | 项目依赖和脚本 | packageManager, engines, scripts |
| `tsconfig.json`    | TypeScript配置 | 严格模式, 路径别名               |
| `vite.config.ts`   | Vite构建配置   | 插件配置, 构建优化               |
| `uno.config.ts`    | UnoCSS样式配置 | 预设, 规则, 主题                 |
| `eslint.config.ts` | ESLint代码检查 | Vue, TypeScript规则              |

### 编辑器配置文件

| 文件                    | 作用             | 关键设置                   |
| ----------------------- | ---------------- | -------------------------- |
| `.cursor/settings.json` | Cursor编辑器配置 | pnpm, Vue, TypeScript      |
| `.cursor/cursor-rules`  | Cursor开发规范   | 项目约定, 命名规范         |
| `.vscode/settings.json` | VS Code配置      | 格式化, 智能提示, 文件嵌套 |

### Git & 代码质量

| 文件                      | 作用         | 功能                 |
| ------------------------- | ------------ | -------------------- |
| `commitlint.config.ts`    | 提交信息规范 | Conventional Commits |
| `.prettierrc.json`        | 代码格式化   | 统一代码风格         |
| `scripts/naming-rules.ts` | 命名规范检查 | 自动验证文件命名     |

## 🏗️ 技术栈配置

### 前端技术栈

```yaml
核心框架:
  - Vue: 3.5+
  - TypeScript: 5+
  - Vite: 7+

状态管理:
  - Pinia: 3+
  - pinia-plugin-persistedstate: 4+

路由系统:
  - Vue Router: 4+

HTTP客户端:
  - Alova: 3+

样式方案:
  - UnoCSS: 66+
  - @unocss/preset-uno
  - @unocss/preset-attributify
  - @unocss/preset-icons
  - @unocss/preset-typography

代码质量:
  - ESLint: 9+
  - Prettier: 3+
  - TypeScript ESLint: 8+
  - Commitizen + Commitlint
```

### 开发工具链

```yaml
包管理: pnpm 10.12.4
构建工具: Vite 7+
类型检查: vue-tsc 2+
代码检查: ESLint 9+
格式化: Prettier 3+
Git钩子: Husky + lint-staged
```

## 📁 目录结构规范

### 统一的模块组织方式

项目采用 `index.ts + modules/` 模式：

```
src/
├── api/                    # API管理
│   ├── index.ts           # 自动导入API模块
│   └── modules/           # 具体API实现
├── stores/                # 状态管理
│   ├── index.ts           # 自动导入Store模块
│   ├── modules/           # 具体Store实现
│   └── types/             # Store类型定义
├── router/                # 路由管理
│   ├── index.ts           # 自动导入路由模块
│   ├── modules/           # 具体路由配置
│   ├── types.ts           # 路由类型
│   └── utils.ts           # 路由工具
├── hooks/                 # 组合式函数
│   └── index.ts           # 自动导入hooks
├── common/                # 公共模块
│   ├── index.ts           # 自动导入公共模块
│   └── modules/           # 具体公共功能
├── layouts/               # 布局组件
├── views/                 # 页面组件
└── utils/                 # 工具函数
```

### 自动导入机制

通过 `autoImportModulesSync` 函数实现模块自动导入：

- 扫描 `modules/` 目录下的所有模块
- 自动合并导出内容
- 支持类型安全的模块导入

## 🎨 样式系统配置

### UnoCSS 配置特性

```typescript
// uno.config.ts 主要配置
{
  presets: [
    presetUno(),           // 基础工具类
    presetAttributify(),   // 属性化模式
    presetIcons(),         // 图标系统
    presetTypography()     // 排版预设
  ],

  theme: {
    colors: {
      // 深色主题
      dark: { /* 颜色定义 */ },
      // 浅色主题
      light: { /* 颜色定义 */ }
    }
  },

  shortcuts: {
    // 快捷类定义
  },

  rules: [
    // 自定义规则
  ]
}
```

### 主题系统

- **双主题**: 支持深色/浅色模式切换
- **动态颜色**: CSS变量绑定主题颜色
- **类型安全**: TypeScript类型定义完整的主题配置

## 📝 命名规范配置

### 自动化命名检查

通过 `scripts/naming-rules.ts` 实现：

- 检查文件命名规范
- 验证目录结构
- Git提交前自动执行

### 命名约定详情

```yaml
文件命名:
  Vue页面: kebab-case (user-profile.vue)
  Vue组件: PascalCase (UserCard.vue)
  TS文件: camelCase (userService.ts)
  目录: kebab-case (user-management/)

代码命名:
  变量函数: camelCase (getUserInfo)
  常量: SCREAMING_SNAKE_CASE (API_BASE_URL)
  接口类型: PascalCase (UserInfo)
  组件: PascalCase + 多词 (UserDetailCard)
  事件处理: handle前缀 (handleSubmit)
  Composable: use前缀 (useUserStore)
```

## 🚀 开发命令配置

### package.json 脚本说明

```json
{
  "scripts": {
    "dev": "vite", // 开发服务器
    "build": "vue-tsc --noEmit && vite build", // 类型检查 + 构建
    "build:analyze": "... --mode analyze", // 构建分析
    "preview": "vite preview", // 预览构建结果
    "lint": "eslint . --fix", // ESLint检查修复
    "format": "prettier --write src/", // 代码格式化
    "type-check": "vue-tsc --noEmit", // TypeScript检查
    "naming-check": "node scripts/naming-rules.ts", // 命名检查
    "code-check": "pnpm type-check && pnpm lint && pnpm naming-check", // 综合检查
    "code-fix": "pnpm format && pnpm lint", // 代码修复
    "pre-commit": "pnpm code-check", // Git提交前检查
    "commit": "git-cz" // 规范化提交
  }
}
```

## 🔒 强制执行的规则

### 1. 包管理器约束

- **检查点**: package.json engines, .cursor/settings.json, .vscode/settings.json
- **执行**: AI助手强制使用pnpm命令
- **验证**: 项目启动时检查包管理器

### 2. 代码质量门禁

- **Git Hooks**: 提交前强制执行 `pnpm code-check`
- **检查项**: ESLint, TypeScript类型, 命名规范
- **阻止**: 不符合规范的代码无法提交

### 3. 类型安全要求

- **必须**: 所有公共API定义TypeScript类型
- **必须**: 组件Props定义完整类型
- **推荐**: 使用泛型提高代码复用性

### 4. 目录结构约束

- **必须**: 新模块遵循 `index.ts + modules/` 结构
- **必须**: 使用自动导入机制
- **禁止**: 深层次嵌套目录

### 5. 提交规范约束

- **必须**: 使用 `pnpm commit` 生成提交信息
- **格式**: 遵循 Conventional Commits 规范
- **检查**: commitlint 自动验证提交信息格式

## 📚 配置文档索引

### 详细文档位置

### 配置更新流程

1. **修改配置**: 更新相关配置文件
2. **更新文档**: 同步更新对应的文档文件
3. **验证配置**: 执行 `pnpm code-check` 验证
4. **提交变更**: 使用 `pnpm commit` 规范提交

---

> **注意**: 本文档是项目配置的单一真实来源，所有团队成员和AI助手都应以此为准。如发现配置不一致，请及时更新并同步到所有相关文件。
