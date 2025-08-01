# GitHub Actions 工作流说明

## 📋 概述

cc-admin 项目使用 GitHub Actions 进行持续集成和持续部署（CI/CD），确保代码质量和自动化部署。

## 🚀 工作流文件

### 1. `deno.yml` - 主CI/CD工作流

**触发条件**:

- Push 到 `main` 或 `feature/*` 分支
- Pull Request 到 `main` 或 `feature/*` 分支

**包含任务**:

- 🔍 **代码质量检查**: ESLint、TypeScript、命名规范、环境变量检查
- 🏗️ **构建测试**: 项目构建和产物上传
- 📊 **构建分析**: 生成构建分析报告（仅PR）
- 🔒 **安全扫描**: 依赖安全审计
- 🚀 **部署预览**: 自动部署到预览环境（仅PR）
- 🌐 **生产部署**: 自动部署到生产环境（仅main分支）
- 📢 **通知**: 工作流状态通知

### 2. `release.yml` - 发布工作流

**触发条件**:

- 推送标签（格式：`v*`）

**包含任务**:

- 📦 **发布准备**: 代码检查、构建、生成变更日志
- 🚀 **生产部署**: 部署到生产环境
- 📝 **文档更新**: 更新CHANGELOG
- 📢 **发布通知**: 发布状态通知

## 🔧 环境配置

### 必需的环境变量

在 GitHub 仓库的 Settings > Secrets and variables > Actions 中配置：

```bash
# Vercel 部署配置
VERCEL_TOKEN=your_vercel_token
VERCEL_ORG_ID=your_vercel_org_id
VERCEL_PROJECT_ID=your_vercel_project_id

# 可选：代码覆盖率
CODECOV_TOKEN=your_codecov_token

# 可选：通知配置
SLACK_WEBHOOK_URL=your_slack_webhook_url
DISCORD_WEBHOOK_URL=your_discord_webhook_url
```

### 环境配置

项目支持多环境部署：

- **development**: 开发环境
- **staging**: 预发布环境
- **production**: 生产环境

## 📋 分支策略

### 分支命名规范

- `main`: 主分支，用于生产发布
- `feature/*`: 功能分支，用于新功能开发
- `hotfix/*`: 热修复分支，用于紧急修复
- `release/*`: 发布分支，用于版本发布准备

### 工作流触发规则

- **Push 到 main**: 触发完整CI/CD流程，包括生产部署
- **Push 到 feature/\***: 触发代码质量检查和构建测试
- **Pull Request**: 触发代码质量检查、构建测试和预览部署
- **Tag 推送**: 触发发布流程

## 🛠️ 本地开发

### 前置检查

在提交代码前，建议在本地运行以下命令：

```bash
# 安装依赖
pnpm install

# 代码质量检查
pnpm check

# 构建测试
pnpm build

# 预览构建
pnpm preview
```

### 提交规范

项目使用 Conventional Commits 规范：

```bash
# 新功能
git commit -m "feat: add user management module"

# 修复bug
git commit -m "fix: resolve login authentication issue"

# 文档更新
git commit -m "docs: update API documentation"

# 样式修改
git commit -m "style: improve button component styling"
```

## 📊 监控和报告

### 构建分析

- 构建分析报告在PR中自动生成
- 可在 Actions 页面下载构建产物
- 支持Bundle大小分析和优化建议

### 代码质量

- ESLint 检查结果在 Actions 日志中显示
- TypeScript 类型检查确保类型安全
- 命名规范检查确保代码一致性

### 安全扫描

- 自动扫描依赖包的安全漏洞
- 使用 `pnpm audit` 进行安全审计
- 发现高危漏洞时工作流会失败

## 🔄 工作流优化

### 缓存策略

- **pnpm 缓存**: 缓存依赖包，加速安装
- **构建缓存**: 缓存构建产物，减少重复构建
- **缓存键**: 基于文件哈希，确保缓存有效性

### 并行执行

- 代码质量检查、构建测试、安全扫描并行执行
- 部署任务依赖前置任务完成
- 优化工作流执行时间

### 条件执行

- 预览部署仅在PR时执行
- 生产部署仅在main分支时执行
- 构建分析仅在PR时执行

## 🚨 故障排除

### 常见问题

#### 1. 构建失败

```bash
# 检查本地构建
pnpm build

# 检查依赖
pnpm install

# 检查Node.js版本
node --version
```

#### 2. 类型检查失败

```bash
# 运行类型检查
pnpm type-check

# 检查TypeScript配置
cat tsconfig.json
```

#### 3. ESLint 检查失败

```bash
# 运行ESLint检查
pnpm lint

# 自动修复
pnpm lint --fix
```

#### 4. 命名规范检查失败

```bash
# 运行命名规范检查
pnpm naming-check

# 查看命名规则
cat scripts/naming-rules.ts
```

### 调试技巧

1. 查看 Actions 日志获取详细错误信息
2. 在本地复现问题并调试
3. 检查环境变量配置
4. 验证依赖版本兼容性

## 📚 相关文档

- [GitHub Actions 官方文档](https://docs.github.com/en/actions)
- [Vercel 部署文档](https://vercel.com/docs)
- [pnpm 官方文档](https://pnpm.io/)
- [Vue 3 官方文档](https://vuejs.org/)
- [TypeScript 官方文档](https://www.typescriptlang.org/)

## 🤝 贡献指南

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'feat: add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](../LICENSE) 文件了解详情。
