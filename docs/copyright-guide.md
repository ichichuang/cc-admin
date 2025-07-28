# 版权保护指南

## 概述

CC-Admin 项目采用完善的版权保护机制，确保项目知识产权得到有效保护。本文档详细说明了版权保护的措施和使用方法。

## 版权保护措施

### 1. License 文件

项目使用 **MIT License**，在根目录的 `LICENSE` 文件中明确声明：

```text
MIT License

Copyright (c) 2025 chichuang

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.
```

### 2. README 版权声明

在 `README.md` 中包含详细的版权声明和使用条款：

- **版权声明**: 明确标注作者为 chichuang
- **使用条款**: 详细说明允许和禁止的行为
- **商业授权**: 提供商业使用的联系方式
- **保护措施**: 列出已采取的版权保护措施

### 3. 源码文件版权注释

所有关键源码文件都包含版权注释，格式如下：

#### TypeScript/JavaScript 文件

```typescript
/**
 * @copyright Copyright (c) 2025 chichuang
 * @license MIT
 * @description CC-Admin 企业级后台管理框架 - 文件描述
 * 本文件为 chichuang 原创，禁止擅自删除署名或用于商业用途。
 */
```

#### Vue 文件

```vue
<!--
  @copyright Copyright (c) 2025 chichuang
  @license MIT
  @description CC-Admin 企业级后台管理框架 - 文件描述
  本文件为 chichuang 原创，禁止擅自删除署名或用于商业用途。
-->
```

#### SCSS/CSS 文件

```scss
/**
 * @copyright Copyright (c) 2025 chichuang
 * @license MIT
 * @description CC-Admin 企业级后台管理框架 - 文件描述
 * 本文件为 chichuang 原创，禁止擅自删除署名或用于商业用途。
 */
```

### 4. 自动化版权保护

#### 版权保护脚本

项目提供自动化版权保护脚本 `scripts/copyright-protection.ts`：

```bash
# 为所有源码文件添加版权注释
pnpm copyright

# 检查版权保护状态
pnpm copyright-check
```

#### GitHub Actions 自动检查

配置了 GitHub Actions 工作流 `.github/workflows/copyright-check.yml`，在每次提交时自动检查：

- 关键文件是否包含版权注释
- 版权信息是否完整
- 自动报告缺失的版权保护

## 使用条款

### 允许的行为

✅ **个人学习、研究使用**

- 可以自由下载、学习、研究项目代码
- 可以在个人项目中参考和使用

✅ **开源项目中的非商业使用**

- 可以在开源项目中使用，但需保留版权声明
- 可以 Fork 和贡献代码

✅ **在保留版权声明的前提下修改和分发**

- 可以修改代码，但必须保留原作者署名
- 可以分发修改后的代码，但必须包含原始版权声明

### 禁止的行为

❌ **商业用途**

- 未经授权不得用于商业项目或收费服务
- 不得用于盈利性产品或服务

❌ **删除署名**

- 不得删除或修改原作者版权信息
- 不得移除源码文件中的版权注释

❌ **冒充原创**

- 不得声称是原创作品
- 不得删除原作者署名

❌ **恶意抄袭**

- 不得直接复制项目结构、UI设计用于商业产品
- 不得大规模复制代码用于商业项目

## 商业授权

如需商业使用或合作，请联系：

- **作者**: chichuang
- **项目**: CC-Admin 企业级后台管理框架
- **联系方式**: [请通过 GitHub Issues 联系](https://github.com/你的用户名/cc-admin/issues)

## 版权保护工具

### 1. 版权保护脚本

```bash
# 安装依赖
pnpm install

# 为所有源码文件添加版权注释
pnpm copyright

# 检查版权保护状态
pnpm copyright-check
```

### 2. 手动添加版权注释

对于新创建的文件，可以手动添加版权注释：

#### TypeScript/JavaScript 文件

```typescript
/**
 * @copyright Copyright (c) 2025 chichuang
 * @license MIT
 * @description CC-Admin 企业级后台管理框架 - 你的文件描述
 * 本文件为 chichuang 原创，禁止擅自删除署名或用于商业用途。
 */
```

#### Vue 文件

```vue
<!--
  @copyright Copyright (c) 2025 chichuang
  @license MIT
  @description CC-Admin 企业级后台管理框架 - 你的文件描述
  本文件为 chichuang 原创，禁止擅自删除署名或用于商业用途。
-->
```

### 3. 版权检查

项目配置了多种版权检查机制：

#### 本地检查

```bash
# 检查所有文件的版权保护状态
pnpm copyright-check
```

#### CI/CD 检查

- GitHub Actions 自动检查
- 提交前自动验证
- 构建时版权检查

## 版权保护最佳实践

### 1. 开发流程

1. **创建新文件时**：立即添加版权注释
2. **提交代码前**：运行 `pnpm copyright-check` 检查
3. **定期检查**：使用 `pnpm copyright` 更新版权保护

### 2. 文件命名规范

- 使用描述性的文件名
- 遵循项目的命名规范
- 确保文件名能反映文件功能

### 3. 版权注释规范

- 使用统一的版权注释格式
- 包含完整的版权信息
- 添加清晰的文件描述

## 常见问题

### Q: 如何为现有文件添加版权注释？

A: 运行 `pnpm copyright` 命令，脚本会自动为所有符合条件的文件添加版权注释。

### Q: 版权注释会影响代码性能吗？

A: 不会。版权注释只在开发阶段存在，构建时会自动移除，不会影响运行时性能。

### Q: 如何检查某个文件是否包含版权注释？

A: 运行 `pnpm copyright-check` 命令，或者查看文件头部是否包含版权信息。

### Q: 商业使用需要什么条件？

A: 商业使用需要获得作者授权，请联系作者商议具体条款。

## 法律声明

本版权保护机制旨在保护项目知识产权，但不构成法律建议。如有法律纠纷，请咨询专业律师。

---

**注意**: 本项目的所有代码和文档均受版权法保护，未经授权不得用于商业用途。
