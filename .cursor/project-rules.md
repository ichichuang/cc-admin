<!--
  @copyright Copyright (c) 2025 chichuang
  @license MIT
  @description cc-admin 企业级后台管理框架 - project-rules
  本文件为 chichuang 原创，禁止擅自删除署名或用于商业用途。
-->

# cc-admin 项目配置规则说明

## 📋 概述

本文档详细记录了 cc-admin 项目的所有配置文件、开发规则和约定，确保团队成员和AI助手都能正确理解和使用项目配置。

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

## 📦 模块导出规范

### 统一导出策略

项目采用 `index.ts` 统一导出方式，简化导入路径，提高开发体验。

#### 1. 导出原则

```typescript
// ✅ 推荐：明确导出常用项
export { login, getUserInfo } from './modules/auth'
export { remConfig } from './modules/rem'

// ❌ 不推荐：导出所有（可能增加打包体积）
export * from './modules/auth'
```

#### 2. 适用场景

**✅ 推荐使用统一导出的模块：**

- API 模块 (`src/api/`)
- 工具函数 (`src/utils/`)
- 类型定义 (`src/types/`)
- 常量配置 (`src/constants/`)
- 状态管理 (`src/stores/`)

**⚠️ 需要谨慎的场景：**

- 大型组件库（可能增加打包体积）
- 第三方库集成（可能产生冲突）
- 性能敏感模块（需要按需加载）

#### 3. 导出规范

```typescript
// src/api/index.ts - API模块统一导出
export * from './modules/auth'
export { login, getUserInfo, getAuthRoutes } from './modules/auth'

// src/constants/index.ts - 常量模块分类导出
export { errorPages, routeWhiteList } from './modules/router'
export { remConfig, breakpoints, deviceTypes } from './modules/rem'

// src/stores/index.ts - 状态管理统一导出
export * from './modules/app'
export * from './modules/user'
export * from './modules/permission'

// src/common/index.ts - 公共模块统一导出（方法较多时使用 export *）
export * from './modules/date'
export * from './modules/function'
export * from './modules/helpers'
export * from './modules/router'
```

#### 4. 导出策略选择

**使用 `export *` 的场景：**

- 模块导出方法很多（如 `src/common/modules/date.ts` 有 50+ 个方法）
- 工具函数集合（如 lodash 风格的函数库）
- 类型定义模块（如 `src/Types/`）
- 常量配置模块（如 `src/constants/`）

**使用按需导出的场景：**

- 模块导出方法较少（如 API 模块通常只有几个方法）
- 需要明确控制导出的模块
- 性能敏感的场景（避免打包体积过大）

**混合策略：**

- 主要使用 `export *` 导出所有
- 同时按需导出常用项，便于使用

#### 4. 类型支持

```typescript
// 导出类型定义
export type { UserInfo, BackendRouteConfig } from './modules/auth'
export type { RemAdapterConfig } from './utils/remAdapter'
```

#### 5. 向后兼容

```typescript
// 支持多种导入方式
export { auth } from './modules/auth' // 命名空间导入
export { login } from './modules/auth' // 直接导入
```

#### 6. 最佳实践

- **明确导出常用项**，避免导出所有
- **提供良好的类型支持**
- **保持模块的独立性**
- **支持按需导入和统一导入**

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
| `.cursor/rules`         | Cursor开发规范   | 项目约定, 命名规范         |
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
  - Axios: 1.6+
  - 自定义拦截器

样式方案:
  - UnoCSS: 0.60+
  - PostCSS: 8+
  - SCSS: 1.69+

开发工具:
  - ESLint: 9+
  - Prettier: 3+
  - TypeScript: 5+
  - Vue DevTools: 7+
```

### 构建优化配置

```yaml
Vite优化:
  - 代码分割: 自动分包
  - 压缩: gzip/brotli
  - 缓存: 强缓存策略
  - 分析: 构建分析报告

UnoCSS优化:
  - 按需生成: 只生成使用的样式
  - 预设: 内置常用预设
  - 主题: 支持多主题切换
  - 图标: 自动导入图标

TypeScript优化:
  - 严格模式: 启用所有严格检查
  - 路径别名: 简化导入路径
  - 类型检查: 构建时类型检查
```

## 🎨 主题系统配置

### 多主题支持

```yaml
主题配置:
  - 浅色主题: 默认主题
  - 深色主题: 支持切换
  - 动态主题: CSS变量绑定
  - 主题持久化: 本地存储

颜色系统:
  - 主色调: 品牌色
  - 功能色: 成功/警告/错误
  - 中性色: 文字/背景/边框
  - 语义色: 状态/交互
```

### 响应式设计

```yaml
断点系统:
  - xs: 375px+ (超小屏)
  - sm: 768px+ (小屏)
  - md: 1024px+ (中屏)
  - lg: 1400px+ (大屏)
  - xl: 1660px+ (超大屏)
  - xls: 1920px+ (特大屏)
  - xxl: 2560px+ (超宽屏)
  - xxxl: 3840px+ (4K屏)

适配策略:
  - 移动端优先: 默认策略
  - 桌面端优先: 可选策略
  - 自适应: 根据屏幕自动选择
```

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

### 5. 模块导出约束

- **必须**: 使用 `index.ts` 统一导出
- **必须**: 明确导出常用项，避免导出所有
- **必须**: 提供类型支持
- **推荐**: 支持多种导入方式

### 6. 提交规范约束

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
