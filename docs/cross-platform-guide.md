<!--
  @copyright Copyright (c) 2025 chichuang
  @license 自定义商业限制许可证
  @description CC-Admin 企业级后台管理框架 - 文档

  本文件受版权保护，商业使用需要授权。
  联系方式: https://github.com/ichichuang/CC-Admin/issues

  This file is protected by copyright. Commercial use requires authorization.
  Contact: https://github.com/ichichuang/CC-Admin/issues
-->

# CC-Admin 跨平台兼容性指南

## 概述

CC-Admin 框架设计为跨平台兼容，支持 macOS、Windows 和 Linux 系统。本文档说明框架的兼容性特性和注意事项。

## ✅ 兼容性特性

### 1. 技术栈兼容性

- **Vue 3.5+**: 完全跨平台
- **TypeScript 5+**: 完全跨平台
- **Vite 7+**: 完全跨平台
- **UnoCSS**: 完全跨平台
- **Pinia**: 完全跨平台
- **pnpm**: 支持所有主要平台

### 2. 路径处理兼容性

项目中的所有路径处理都使用了 Node.js 的 `path` 模块，确保跨平台兼容：

```typescript
// ✅ 正确：使用 path.sep 而不是硬编码分隔符
const segments = relativePath.split(path.sep)

// ✅ 正确：使用 path.join 进行路径拼接
const filePath = path.join(dir, file)
```

### 3. 文件系统操作兼容性

所有文件系统操作都使用了 Node.js 的 `fs` 模块，确保跨平台兼容：

```typescript
// ✅ 正确：使用 fs.existsSync 检查文件存在
if (!fs.existsSync(filePath)) {
  return
}

// ✅ 正确：使用 fs.readFileSync 读取文件
const content = fs.readFileSync(filePath, 'utf-8')
```

## ⚠️ 已知兼容性问题

### 1. Shell 脚本兼容性

**问题**: 部分 `.sh` 脚本在 Windows 上无法直接运行

**影响文件**:

- `scripts/cc-admin-monitor.sh` → 已迁移到 `scripts/monitor.ts`
- `scripts/test-github-token.sh` → 已迁移到 `scripts/test-token.ts`
- `scripts/advanced-search.sh` → 已迁移到 `scripts/quick-search.ts`

**解决方案**:

1. ✅ **使用跨平台版本**：
   - `scripts/monitor.ts` - 完整监控脚本
   - `scripts/test-token.ts` - Token 测试脚本
   - `scripts/quick-search.ts` - 快速搜索脚本
2. 在 Windows 上安装 WSL 或 Git Bash
3. 使用 Docker 容器运行

### 2. 依赖工具兼容性

**问题**: 某些脚本依赖 Unix/Linux 工具

**依赖工具**:

- `curl`: HTTP 请求
- `jq`: JSON 处理
- `python3`: 数据处理

**解决方案**:

1. 在 Windows 上安装相应工具
2. 使用跨平台 Node.js 版本
3. 使用 WSL 环境

## 🔧 跨平台开发建议

### 1. 路径处理最佳实践

```typescript
// ✅ 推荐：使用 path 模块
import { join, sep, relative } from 'path'

const filePath = join(__dirname, 'file.txt')
const segments = filePath.split(sep)
const relativePath = relative(process.cwd(), filePath)
```

### 2. 文件系统操作最佳实践

```typescript
// ✅ 推荐：使用 fs 模块
import { existsSync, readFileSync, writeFileSync } from 'fs'

if (existsSync(filePath)) {
  const content = readFileSync(filePath, 'utf-8')
  writeFileSync(filePath, newContent, 'utf-8')
}
```

### 3. 进程管理最佳实践

```typescript
// ✅ 推荐：使用 child_process.spawn
import { spawn } from 'child_process'

const process = spawn('pnpm', ['exec', 'vite'], {
  stdio: 'inherit',
  shell: true,
})
```

## 🚀 跨平台脚本使用

### 监控脚本

```bash
# 完整监控（生成详细报告）
pnpm monitor

# 快速搜索（快速检查）
pnpm monitor:quick

# Token 测试
pnpm token:test
```

### 脚本功能对比

| 功能       | Shell 脚本             | TypeScript 脚本   | 状态      |
| ---------- | ---------------------- | ----------------- | --------- |
| 完整监控   | `cc-admin-monitor.sh`  | `monitor.ts`      | ✅ 已迁移 |
| Token 测试 | `test-github-token.sh` | `test-token.ts`   | ✅ 已迁移 |
| 快速搜索   | `advanced-search.sh`   | `quick-search.ts` | ✅ 已迁移 |

### 跨平台优势

1. **统一执行方式**: 所有脚本都使用 `pnpm exec tsx` 执行
2. **类型安全**: TypeScript 提供编译时类型检查
3. **更好的错误处理**: 更详细的错误信息和调试支持
4. **模块化设计**: 可以轻松扩展和维护
5. **跨平台兼容**: 在 Windows、macOS、Linux 上都能正常运行

## 🚀 跨平台开发环境设置

### macOS 用户

```bash
# 安装依赖
brew install node pnpm

# 克隆项目
git clone https://github.com/ichichuang/CC-Admin.git
cd CC-Admin

# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev
```

### Windows 用户

```bash
# 安装 Node.js 和 pnpm
# 下载并安装 Node.js: https://nodejs.org/
# 安装 pnpm: npm install -g pnpm

# 克隆项目
git clone https://github.com/ichichuang/CC-Admin.git
cd CC-Admin

# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev
```

### Linux 用户

```bash
# 安装依赖
sudo apt update
sudo apt install nodejs npm
npm install -g pnpm

# 克隆项目
git clone https://github.com/ichichuang/CC-Admin.git
cd CC-Admin

# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev
```

## 📋 兼容性检查清单

### 开发前检查

- [ ] Node.js 版本 >= 22.x
- [ ] pnpm 版本 >= 8.0.0
- [ ] Git 已安装
- [ ] 代码编辑器已配置

### 构建检查

- [ ] `pnpm install` 成功
- [ ] `pnpm type-check` 通过
- [ ] `pnpm lint` 通过
- [ ] `pnpm build` 成功

### 功能检查

- [ ] 开发服务器启动正常
- [ ] 热更新功能正常
- [ ] 路由功能正常
- [ ] 状态管理正常
- [ ] 样式系统正常

## 🐛 常见问题解决

### 1. 权限问题

**问题**: 脚本执行权限不足

**解决方案**:

```bash
# macOS/Linux
chmod +x scripts/*.sh

# Windows (使用 Git Bash)
git update-index --chmod=+x scripts/*.sh
```

### 2. 路径问题

**问题**: 路径分隔符不兼容

**解决方案**: 使用 `path` 模块处理所有路径

### 3. 编码问题

**问题**: 文件编码不兼容

**解决方案**: 统一使用 UTF-8 编码

## 📞 技术支持

如果遇到跨平台兼容性问题，请：

1. 检查 Node.js 和 pnpm 版本
2. 查看错误日志
3. 尝试使用跨平台版本脚本
4. 提交 Issue 到 GitHub 仓库

---

_本文档由 CC-Admin 框架维护团队编写_
