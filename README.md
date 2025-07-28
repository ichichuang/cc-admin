<!--
  @copyright Copyright (c) 2025 chichuang
  @license MIT
  @description Early Bird · 由池闯打造的 Vue3 前端框架 - README
  本文件为 chichuang 原创，禁止擅自删除署名或用于商业用途。
-->

# Early Bird · 由池闯打造的 Vue3 前端框架

[![Vue](https://img.shields.io/badge/Vue-3.5+-green.svg)](https://vuejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5+-blue.svg)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-7+-yellow.svg)](https://vitejs.dev/)
[![UnoCSS](https://img.shields.io/badge/UnoCSS-66.3+-purple.svg)](https://unocss.dev/)
[![pnpm](https://img.shields.io/badge/pnpm-Workspace-orange.svg)](https://pnpm.io/)

> 基于 Vue 3.5+ 和 TypeScript 5+ 的现代化企业级后台管理框架，采用 Monorepo 架构

## 🚀 特性

### ✨ 核心特性

- **🎯 Monorepo 架构**: 基于 pnpm Workspace 的现代化多包管理
- **⚡ 高性能**: Vue 3.5+ + TypeScript 5+ + Vite 7+ 技术栈
- **🎨 原子化 CSS**: UnoCSS 提供强大的样式系统
- **🛡️ 类型安全**: 完整的 TypeScript 类型支持
- **🔄 代码共享**: 跨包模块复用和类型定义共享

### 📦 包结构

```
cc-early-bird/
├── packages/           # 共享包
│   ├── core/          # 核心框架包 (API、Stores、Router、Utils)
│   ├── ui/            # UI组件库包 (Components、Layouts、Styles)
│   └── types/         # 类型定义包 (全局类型定义)
├── apps/              # 应用包
│   └── admin/         # 主管理后台应用
├── tools/             # 开发工具
└── docs/              # 文档
```

### 🛠️ 技术栈

- **前端框架**: Vue 3.5+
- **开发语言**: TypeScript 5+
- **构建工具**: Vite 7+
- **包管理器**: pnpm Workspace
- **样式系统**: UnoCSS
- **状态管理**: Pinia
- **路由管理**: Vue Router 4
- **HTTP 客户端**: Alova

## 📦 快速开始

### 环境要求

- Node.js >= 22.x
- pnpm >= 8.0.0

### 安装依赖

```bash
pnpm install
```

### 开发模式

```bash
# 启动主应用
pnpm dev

# 启动特定应用
pnpm dev:admin
```

### 构建应用

```bash
# 构建主应用
pnpm build

# 构建分析
pnpm build:analyze
```

### 代码检查

```bash
# 类型检查
pnpm type-check

# 代码检查
pnpm lint

# 代码格式化
pnpm format
```

## 🏗️ 架构说明

### Monorepo 优势

1. **代码共享**: 跨包模块复用，避免重复代码
2. **类型安全**: 统一的类型定义，完整的类型检查
3. **独立构建**: 每个应用可以独立构建和部署
4. **版本管理**: 统一的版本控制和依赖管理
5. **开发体验**: 统一的开发工具链和规范

### 包说明

#### @cc/early-bird-core

核心框架包，包含：

- **API 管理**: 统一的接口管理和请求封装
- **状态管理**: 基于 Pinia 的状态管理
- **路由管理**: 动态路由和权限控制
- **工具函数**: 通用工具函数和模块加载器

#### @cc/early-bird-ui

UI组件库包，包含：

- **通用组件**: 可复用的业务组件
- **布局组件**: 页面布局和导航组件
- **样式系统**: UnoCSS 配置和主题系统

#### @cc/early-bird-types

类型定义包，包含：

- **全局类型**: 应用级别的类型定义
- **环境变量类型**: 环境配置的类型定义
- **路由类型**: 路由相关的类型定义
- **用户类型**: 用户相关的类型定义

#### @cc/early-bird-app-admin

主管理后台应用，包含：

- **页面视图**: 业务页面和组件
- **应用配置**: 应用特定的配置
- **业务逻辑**: 具体的业务实现

## 🔧 开发指南

### 添加新包

1. 在 `packages/` 下创建新目录
2. 创建 `package.json` 配置
3. 添加导出入口 `index.ts`
4. 更新工作空间配置

### 添加新应用

1. 在 `apps/` 下创建新目录
2. 配置应用特定的依赖
3. 设置构建和开发脚本
4. 更新根目录脚本

### 包间依赖

```typescript
// 导入核心包
import { store, router } from '@cc/early-bird-core'

// 导入UI组件
import { Loading, LayoutAdmin } from '@cc/early-bird-ui'

// 导入类型
import type { UserInfo } from '@cc/early-bird-types'
```

## 📚 文档

- [Monorepo 架构指南](./docs/monorepo-guide.md)
- [开发规范](./docs/guides/architecture-guide.md)
- [API 文档](./docs/features/api-guide.md)
- [组件文档](./docs/features/component-guide.md)
- [路由配置](./docs/features/router-guide.md)
- [状态管理](./docs/features/pinia-guide.md)
- [样式系统](./docs/features/unocss-guide.md)

## 🎯 开发命令

### 根目录命令

```bash
# 开发模式
pnpm dev                    # 启动主应用
pnpm dev:admin             # 启动管理后台

# 构建
pnpm build                 # 构建主应用
pnpm build:analyze         # 构建分析

# 代码检查
pnpm type-check           # 类型检查
pnpm lint                 # 代码检查
pnpm format               # 代码格式化

# 工作空间管理
pnpm workspace:install    # 安装依赖
pnpm workspace:clean      # 清理并重新安装
```

### 应用特定命令

```bash
# 管理后台应用
pnpm --filter @cc/early-bird-app-admin dev
pnpm --filter @cc/early-bird-app-admin build
pnpm --filter @cc/early-bird-app-admin type-check
```

## 🚀 部署

### 构建生产版本

```bash
pnpm build
```

### 预览构建结果

```bash
pnpm preview
```

### 部署到服务器

```bash
# 构建应用
pnpm build

# 将 dist 目录部署到服务器
```

## 🤝 贡献指南

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开 Pull Request

## 📄 许可证

本项目采用 [MIT 许可证](./LICENSE)。

## 🙏 致谢

感谢所有为这个项目做出贡献的开发者！

---

**Early Bird** - 由池闯打造的 Vue3 前端框架，让开发更简单、更高效！
