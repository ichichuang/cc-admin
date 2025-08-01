<!--
  @copyright Copyright (c) 2025 chichuang
  @license 自定义商业限制许可证
  @description CC-Admin 企业级后台管理框架 - 文档

  本文件受版权保护，商业使用需要授权。
  联系方式: https://github.com/ichichuang/CC-Admin/issues

  This file is protected by copyright. Commercial use requires authorization.
  Contact: https://github.com/ichichuang/CC-Admin/issues
-->

# Package Scripts 文档

本文档详细说明了 `package.json` 中所有脚本的作用和用法。

## 开发相关脚本

### `dev`

```bash
pnpm dev
```

**作用**: 启动开发服务器，运行项目
**说明**: 使用并行开发模式启动项目，支持热重载和快速开发

### `build`

```bash
pnpm build
```

**作用**: 构建生产版本
**说明**: 执行 TypeScript 类型检查并构建生产环境的代码

### `build:analyze`

```bash
pnpm build:analyze
```

**作用**: 构建并分析打包结果
**说明**: 构建生产版本并生成打包分析报告，用于优化包体积

### `preview`

```bash
pnpm preview
```

**作用**: 预览生产构建结果
**说明**: 启动本地服务器预览构建后的生产版本

### `report`

```bash
pnpm report
```

**作用**: 查看打包分析报告
**说明**: 打开打包分析报告页面，查看模块大小和依赖关系

## 代码质量检查脚本

### `type-check`

```bash
pnpm type-check
```

**作用**: 执行 TypeScript 类型检查
**说明**: 检查代码中的类型错误，不生成输出文件

### `lint`

```bash
pnpm lint
```

**作用**: 代码格式检查和自动修复
**说明**: 使用 ESLint 检查代码规范并自动修复可修复的问题

### `format`

```bash
pnpm format
```

**作用**: 代码格式化
**说明**: 使用 Prettier 格式化 `src/` 目录下的代码

### `naming-check`

```bash
pnpm naming-check
```

**作用**: 检查命名规范
**说明**: 检查项目中的文件、组件、变量等命名是否符合规范

### `naming-watch`

```bash
pnpm naming-watch
```

**作用**: 监听命名规范
**说明**: 实时监听文件变化并检查命名规范

### `check`

```bash
pnpm check
```

**作用**: 执行完整的代码质量检查
**说明**: 依次执行类型检查、代码规范检查、命名规范检查、环境检查和版权检查

### `fix`

```bash
pnpm fix
```

**作用**: 自动修复代码格式问题
**说明**: 格式化代码并修复可修复的代码规范问题

## 环境检查脚本

### `env-check`

```bash
pnpm env-check
```

**作用**: 检查环境配置
**说明**: 验证项目环境变量和配置是否正确

## 版权保护脚本

### `copyright:add`

```bash
pnpm copyright:add
```

**作用**: 添加版权信息
**说明**: 为项目文件添加版权声明

### `copyright:check`

```bash
pnpm copyright:check
```

**作用**: 检查版权信息
**说明**: 检查项目文件是否包含正确的版权声明

### `copyright:validate`

```bash
pnpm copyright:validate
```

**作用**: 验证版权和环境
**说明**: 同时检查版权信息和环境配置

## Git 相关脚本

### `pre-commit`

```bash
pnpm pre-commit
```

**作用**: 提交前检查
**说明**: 在 Git 提交前执行代码质量检查和版权检查

### `commit`

```bash
pnpm commit
```

**作用**: 交互式提交
**说明**: 使用 git-cz 进行交互式的 Git 提交

### `prepare`

```bash
pnpm prepare
```

**作用**: 安装 Git hooks
**说明**: 安装 Husky Git hooks，用于自动化代码检查

## 项目监控脚本

### `monitor`

```bash
pnpm monitor
```

**作用**: 执行完整项目监控
**说明**: 监控项目代码质量、依赖更新、安全漏洞等

### `monitor:quick`

```bash
pnpm monitor:quick
```

**作用**: 快速项目检查
**说明**: 执行快速的项目状态检查

### `monitor:cleanup`

```bash
pnpm monitor:cleanup
```

**作用**: 清理监控报告
**说明**: 清理旧的监控报告文件

### `monitor:report`

```bash
pnpm monitor:report
```

**作用**: 查看最新监控报告
**说明**: 显示最新的项目监控报告内容

### `monitor:status`

```bash
pnpm monitor:status
```

**作用**: 查看监控状态
**说明**: 显示监控系统的当前状态和最新报告信息

### `monitor:setup`

```bash
pnpm monitor:setup
```

**作用**: 设置监控环境
**说明**: 显示监控系统的设置说明和配置要求

## 工具脚本

### `token:test`

```bash
pnpm token:test
```

**作用**: 测试 GitHub Token
**说明**: 验证 GitHub Token 是否有效和权限是否正确

### `init:project`

```bash
pnpm init:project
```

**作用**: 初始化项目
**说明**: 执行项目初始化设置和配置

## 常用脚本组合

### 开发流程

```bash
# 启动开发
pnpm dev

# 提交前检查
pnpm pre-commit

# 提交代码
pnpm commit
```

### 构建发布

```bash
# 检查代码质量
pnpm check

# 构建生产版本
pnpm build

# 预览构建结果
pnpm preview
```

### 代码维护

```bash
# 修复代码格式
pnpm fix

# 检查项目状态
pnpm monitor:status

# 查看监控报告
pnpm monitor:report
```

## 注意事项

1. **开发环境**: 推荐使用 `pnpm dev` 启动开发服务器
2. **代码提交**: 提交前会自动执行 `pre-commit` 检查
3. **质量保证**: 使用 `pnpm check` 确保代码质量
4. **监控维护**: 定期运行 `pnpm monitor` 检查项目状态
5. **版权保护**: 使用 `pnpm copyright:check` 确保版权信息正确

## 环境要求

- Node.js >= 16
- pnpm >= 7
- Git 已配置
- 可选：GitHub Token（用于监控功能）
