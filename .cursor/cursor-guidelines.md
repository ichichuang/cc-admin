<!--
  @copyright Copyright (c) 2025 chichuang
  @license MIT
  @description cc-admin 企业级后台管理框架 - cursor-guidelines
  本文件为 chichuang 原创，禁止擅自删除署名或用于商业用途。
-->

# Cursor AI 编码指导规则

这个文件为 Cursor AI 提供项目特定的编码指导，确保生成的代码符合项目的命名规范和最佳实践。

## 📋 命名规范要求

### 文件命名

- **Vue页面文件**: 使用 `kebab-case`，如 `user-profile.vue`
- **Vue组件文件**: 使用 `PascalCase`，如 `UserCard.vue`
- **TypeScript/JavaScript文件**: 使用 `kebab-case`，如 `user-utils.ts`
- **目录名**: 使用 `kebab-case`，如 `user-management/`

### 代码命名

- **变量名**: 使用 `camelCase`，如 `userName`、`isUserLoggedIn`
- **函数名**: 使用 `camelCase`，如 `getUserInfo`、`handleFormSubmit`
- **常量名**: 使用 `SCREAMING_SNAKE_CASE`，如 `API_BASE_URL`、`MAX_RETRY_COUNT`
- **接口/类型**: 使用 `PascalCase`，如 `UserInfo`、`ApiResponse`
- **枚举**: 使用 `PascalCase`，如 `UserStatus`、`PaymentMethod`

## 🏗️ 项目结构规范

### 页面组织结构

为每个功能模块创建独立的目录结构：

```
src/views/feature-name/
├── index.vue           # 页面入口文件
├── components/         # 页面专用组件 (PascalCase)
├── views/             # 子页面 (kebab-case)
├── utils/             # 页面工具函数 (kebab-case文件名)
└── types/             # 页面类型定义 (kebab-case文件名)
```

### 路径别名使用

使用已配置的路径别名：

- `@/` -> `src/`
- `@test/` -> `src/views/test/`
- `@components/` -> `src/components/`
- `@utils/` -> `src/utils/`

## 🔧 开发最佳实践

### 1. 组件命名

- 组件文件名使用 `PascalCase.vue`
- 组件内部名称也使用 `PascalCase`
- 组件应该有清晰的功能描述性名称

### 2. 函数命名

- 事件处理函数使用 `handle` 前缀：`handleButtonClick`
- 异步函数使用动词开头：`fetchUserData`、`saveUserProfile`
- 布尔值函数使用 `is`、`has`、`can` 前缀：`isUserValid`、`hasPermission`

### 3. 变量命名

- 布尔变量使用 `is`、`has`、`can` 等前缀
- 数组变量使用复数形式：`userList`、`menuItems`
- 对象变量使用描述性名称：`userProfile`、`apiConfig`

### 4. 导入导出

```typescript
// 具名导出优于默认导出
export { UserService, ApiClient }

// 导入时保持原有命名
import { createApp } from 'vue'
import { UserService } from '@/services/user-service'
```

## 🚀 自动化工具

项目配置了以下自动化工具：

- **ESLint**: 实时检查命名规范
- **Prettier**: 自动代码格式化
- **命名检查脚本**: `pnpm naming-check`
- **Git Hooks**: 提交前自动检查

## ⚠️ 特别注意

1. **避免使用下划线命名**（除了常量和私有变量）
2. **组件名必须是多词组合**，避免与HTML元素冲突
3. **文件名和目录名不要使用中文**
4. **API相关的文件和函数使用统一的命名风格**
5. **测试文件应该与源文件保持相同的命名风格**

## 🎨 代码风格

- 使用 2 空格缩进
- 单引号字符串
- 行末不使用分号
- 对象和数组使用尾随逗号
- 最大行长度 100 字符

遵循这些规范，Cursor AI 将生成符合项目要求的高质量代码。
