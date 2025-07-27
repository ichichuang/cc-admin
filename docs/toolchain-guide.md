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

- TypeScript 单引号配置
- 保存时自动格式化
- ESLint 自动修复
- pnpm 包管理器配置

### VS Code 扩展推荐

- **Vue Language Features (Volar)**
- **TypeScript Vue Plugin (Volar)**
- **ESLint**
- **Prettier**
- **UnoCSS**
- **GitLens**

## 🔧 代码质量工具

### ESLint 配置

- TypeScript 和 Vue 支持
- 自定义规则配置
- 自动修复功能
- 集成到编辑器

### Prettier 配置

- 代码格式化规则
- 与 ESLint 集成
- 保存时自动格式化
- 团队代码风格统一

## 🔍 类型检查

### TypeScript 配置

- 严格模式启用
- 模块解析配置
- 路径别名支持
- 类型检查优化

## 🐙 Git 工作流

### Husky 配置

- Git Hooks 自动安装
- 提交前代码检查
- lint-staged 集成
- 自动化工作流

### 提交规范

- 语义化提交信息
- 类型前缀规范
- 描述信息要求
- 团队协作标准

## 📦 包管理

### pnpm 配置

- 快速安装依赖
- 磁盘空间优化
- 严格的依赖管理
- 工作空间支持

## 🚀 构建工具

### Vite 配置

- Vue 3 支持
- UnoCSS 集成
- 路径别名配置
- 开发服务器优化

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

- 检查 ESLint 配置
- 验证 TypeScript 配置
- 分析依赖关系
- 查看工具日志

通过这套工具链，CC-Admin 提供了高效的开发体验和代码质量保证。
