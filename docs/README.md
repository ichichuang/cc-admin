# CC-Admin 文档

## 📋 项目概述

CC-Admin 是基于 Vue3 + TypeScript + Vite 的企业级后台管理框架，采用模块化架构设计。

### 技术栈

- **前端框架**: Vue 3.5+
- **开发语言**: TypeScript 5+
- **构建工具**: Vite 7+
- **样式系统**: UnoCSS (兼容 Tailwind)
- **状态管理**: Pinia
- **HTTP 客户端**: Alova
- **包管理器**: pnpm

## 🚀 快速开始

### 环境要求

- Node.js >= 18
- pnpm >= 8

### 安装和运行

```bash
# 安装依赖
pnpm install

# 开发环境
pnpm dev

# 构建生产版本
pnpm build
```

## 📁 项目结构

```
src/
├── api/                 # API 接口管理
│   ├── index.ts        # 统一导出
│   └── modules/        # API 模块
├── stores/             # 状态管理
│   ├── index.ts        # 统一导出
│   └── modules/        # Store 模块
├── router/             # 路由管理
│   ├── index.ts        # 统一导出
│   └── modules/        # 路由模块
├── hooks/              # 组合式函数
│   ├── index.ts        # 统一导出
│   └── modules/        # Hook 模块
├── utils/              # 工具函数
├── components/         # 公共组件
├── layouts/            # 布局组件
├── views/              # 页面组件
├── locales/            # 国际化
├── mock/               # 模拟数据
└── Types/              # 类型定义
```

## 🔧 核心规范

### 1. 模块化规范

所有功能模块采用 `index.ts + modules/` 统一结构：

- `index.ts`: 统一导出入口
- `modules/`: 具体功能模块

### 2. 命名规范

- **文件命名**: 使用 kebab-case (如: `user-profile.ts`)
- **组件命名**: 使用 PascalCase (如: `UserProfile.vue`)
- **变量命名**: 使用 camelCase (如: `userName`)
- **常量命名**: 使用 UPPER_SNAKE_CASE (如: `API_BASE_URL`)

### 3. 目录规范

- `src/common`: 公共模块，使用 camelCase 命名
- `src/hooks`: 组合式函数，使用 camelCase 命名
- `src/router`: 路由配置，使用 camelCase 命名
- `src/stores`: 状态管理，使用 camelCase 命名
- `src/utils`: 工具函数，使用 camelCase 命名

## 📚 详细文档

### 核心功能

- [架构设计](./architecture-guide.md) - 项目架构和设计原则
- [API 管理](./api-guide.md) - HTTP 请求和接口管理
- [状态管理](./pinia-guide.md) - Pinia 状态管理
- [路由管理](./router-guide.md) - Vue Router 配置
- [组件开发](./component-guide.md) - 组件开发规范

### 开发工具

- [构建指南](./build-guide.md) - 项目构建和部署
- [样式系统](./unocss-guide.md) - UnoCSS 原子化 CSS
- [国际化](./locale.md) - 多语言支持
- [测试指南](./testing-guide.md) - 单元测试和 E2E 测试
- [Mock 数据](./mock-guide.md) - 开发环境接口模拟

### 高级功能

- [性能优化](./performance-guide.md) - 性能优化策略
- [安全指南](./security-guide.md) - 安全最佳实践
- [故障排除](./troubleshooting-guide.md) - 常见问题解决

## 🎯 开发流程

### 1. 创建新功能

```bash
# 创建功能分支
git checkout -b feat/your-feature-name

# 开发完成后提交
git add .
git commit -m "feat: add your feature"

# 推送到远程
git push origin feat/your-feature-name
```

### 2. 代码规范

- 使用 ESLint + Prettier 进行代码格式化
- 遵循 TypeScript 严格模式
- 提交前自动运行代码检查

### 3. 提交规范

- `feat`: 新功能
- `fix`: 修复问题
- `docs`: 文档更新
- `style`: 代码格式调整
- `refactor`: 代码重构
- `test`: 测试相关
- `chore`: 构建过程或辅助工具的变动

## 🔗 相关链接

- [Vue 3 官方文档](https://vuejs.org/)
- [TypeScript 官方文档](https://www.typescriptlang.org/)
- [Vite 官方文档](https://vitejs.dev/)
- [UnoCSS 官方文档](https://unocss.dev/)
- [Pinia 官方文档](https://pinia.vuejs.org/)
