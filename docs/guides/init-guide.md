<!--
  @copyright Copyright (c) 2025 chichuang
  @license 自定义商业限制许可证
  @description CC-Admin 企业级后台管理框架 - 文档

  本文件受版权保护，商业使用需要授权。
  联系方式: https://github.com/ichichuang/CC-Admin/issues

  This file is protected by copyright. Commercial use requires authorization.
  Contact: https://github.com/ichichuang/CC-Admin/issues
-->

# CC-Admin 项目初始化指南

## 概述

CC-Admin 项目提供了一个完整的初始化脚本，用于自动化执行所有必要的初始化步骤，确保项目环境正确配置并符合项目规范。

## 快速开始

### 运行初始化脚本

```bash
pnpm init:project
```

这个命令会自动执行以下步骤：

1. **版权保护** - 为所有源代码文件添加版权声明
2. **环境检查** - 检查环境变量配置是否正确
3. **命名规范检查** - 检查项目命名规范是否符合要求
4. **代码格式检查** - 检查并修复代码格式问题
5. **类型检查** - 检查 TypeScript 类型定义
6. **依赖安装** - 安装项目依赖包
7. **Git Hooks 设置** - 设置 Git Hooks（husky）

## 初始化步骤详解

### 1. 版权保护 (copyright:add)

- **目的**: 为所有源代码文件添加版权声明
- **必需**: 是
- **失败处理**: 终止初始化

```bash
pnpm copyright:add
```

### 2. 环境检查 (env-check)

- **目的**: 检查环境变量配置是否正确
- **必需**: 是
- **失败处理**: 终止初始化

```bash
pnpm env-check
```

### 3. 命名规范检查 (naming-check)

- **目的**: 检查项目命名规范是否符合要求
- **必需**: 是
- **失败处理**: 终止初始化

```bash
pnpm naming-check
```

### 4. 代码格式检查 (lint)

- **目的**: 检查并修复代码格式问题
- **必需**: 否
- **失败处理**: 继续执行

```bash
pnpm lint
```

### 5. 类型检查 (type-check)

- **目的**: 检查 TypeScript 类型定义
- **必需**: 否
- **失败处理**: 继续执行

```bash
pnpm type-check
```

### 6. 依赖安装 (install)

- **目的**: 安装项目依赖包
- **必需**: 是
- **失败处理**: 终止初始化

```bash
pnpm install
```

### 7. Git Hooks 设置 (prepare)

- **目的**: 设置 Git Hooks（husky）
- **必需**: 否
- **失败处理**: 继续执行

```bash
pnpm prepare
```

## 环境要求

### 必需文件

- `package.json` - 项目配置文件
- `.env` 文件（推荐）- 环境变量配置

### 推荐文件

- `pnpm-lock.yaml` - 依赖锁定文件
- `.env.development` - 开发环境配置
- `.env.production` - 生产环境配置

## 输出说明

### 成功输出示例

```
🚀 CC-Admin 项目初始化脚本
==================================================

🔍 检查项目环境...
✅ 找到环境变量文件: .env, .env.development, .env.production
✅ 项目环境检查完成

🔄 正在执行: 版权保护
📝 描述: 为所有源代码文件添加版权声明
⚡ 执行命令: pnpm copyright:add
✅ 版权保护 执行成功

...

📊 初始化总结
==================================================

✅ 成功执行的步骤:
  1. 版权保护
  2. 环境检查
  3. 命名规范检查
  4. 代码格式检查
  5. 类型检查
  6. 依赖安装
  7. Git Hooks 设置

📋 后续建议:
1. 运行 pnpm dev 启动开发服务器
2. 运行 pnpm check 进行完整检查
3. 查看 docs/ 目录了解项目文档
4. 运行 pnpm monitor:setup 设置监控

🎉 初始化完成！项目已准备就绪
```

### 失败处理

如果某个必需步骤失败，初始化会终止并显示错误信息：

```
❌ 版权保护 执行失败
错误信息: [具体错误信息]
⚠️  版权保护 是必需步骤，初始化终止
```

## 后续步骤

初始化完成后，建议执行以下步骤：

### 1. 启动开发服务器

```bash
pnpm dev
```

### 2. 进行完整检查

```bash
pnpm check
```

### 3. 查看项目文档

项目文档位于 `docs/` 目录，包含：

- [架构指南](./architecture-guide.md)
- [工具链指南](./toolchain-guide.md)
- [API 指南](../features/api-guide.md)
- [组件指南](../features/component-guide.md)

### 4. 设置监控（可选）

```bash
pnpm monitor:setup
```

## 故障排除

### 常见问题

1. **环境变量文件缺失**
   - 创建 `.env` 文件
   - 参考 `.env.example` 模板

2. **依赖安装失败**
   - 检查 Node.js 版本（需要 >= 22.x）
   - 检查 pnpm 版本（需要 >= 8.0.0）
   - 清除缓存：`pnpm store prune`

3. **类型检查失败**
   - 检查 TypeScript 配置
   - 运行 `pnpm type-check` 查看详细错误

4. **命名规范检查失败**
   - 查看具体错误信息
   - 参考 [命名规范指南](../protection/code-monitoring-guide.md)

### 手动执行步骤

如果自动初始化失败，可以手动执行各个步骤：

```bash
# 1. 版权保护
pnpm copyright:add

# 2. 环境检查
pnpm env-check

# 3. 命名规范检查
pnpm naming-check

# 4. 代码格式检查
pnpm lint

# 5. 类型检查
pnpm type-check

# 6. 依赖安装
pnpm install

# 7. Git Hooks 设置
pnpm prepare
```

## 脚本位置

初始化脚本位于：`scripts/init.ts`

## 相关命令

- `pnpm check` - 完整项目检查
- `pnpm fix` - 自动修复代码格式
- `pnpm dev` - 启动开发服务器
- `pnpm build` - 构建生产版本
- `pnpm monitor:setup` - 设置项目监控

---

> 💡 **提示**: 初始化脚本设计为幂等操作，可以安全地多次运行。每次运行都会检查当前状态并只执行必要的步骤。
