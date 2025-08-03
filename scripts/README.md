# cc-admin 脚本目录

本目录包含 cc-admin 框架的各种工具脚本，已全部迁移为跨平台 TypeScript 版本。

## 📁 脚本文件

### 🔧 核心脚本

| 脚本名称          | 功能描述          | 执行命令             |
| ----------------- | ----------------- | -------------------- |
| `monitor.ts`      | 完整监控脚本      | `pnpm monitor`       |
| `test-token.ts`   | GitHub Token 测试 | `pnpm token:test`    |
| `quick-search.ts` | 快速搜索工具      | `pnpm monitor:quick` |

### 🛠️ 开发脚本

| 脚本名称          | 功能描述     | 执行命令            |
| ----------------- | ------------ | ------------------- |
| `dev-parallel.ts` | 并行开发环境 | `pnpm dev`          |
| `watch-naming.ts` | 命名规范监听 | `pnpm naming-watch` |
| `naming-rules.ts` | 命名规范检查 | `pnpm naming-check` |

### 🔒 版权保护脚本

| 脚本名称                  | 功能描述     | 执行命令             |
| ------------------------- | ------------ | -------------------- |
| `copyright-protection.ts` | 版权保护工具 | `pnpm copyright:add` |
| `check-env.ts`            | 环境检查工具 | `pnpm env-check`     |

## 🚀 跨平台特性

### ✅ 已解决的问题

1. **Shell 脚本兼容性**: 所有 `.sh` 脚本已迁移为 `.ts` 脚本
2. **路径分隔符**: 使用 `path.sep` 确保跨平台兼容
3. **文件系统操作**: 使用 Node.js `fs` 模块
4. **进程管理**: 使用 `child_process.spawn` 替代 shell 命令

### 🔧 技术实现

- **Shebang**: `#!/usr/bin/env -S npx tsx` 确保直接执行
- **TypeScript**: 提供类型安全和更好的开发体验
- **模块化**: 每个脚本都是独立的类，便于维护
- **错误处理**: 完善的错误处理和用户友好的提示

## 📋 使用示例

### 1. 完整监控

```bash
# 运行完整监控（生成详细报告）
pnpm monitor

# 输出示例：
# 🛡️ cc-admin 框架代码监控系统 (跨平台版)
# =======================================
# 监控时间: 2025-01-28 15:30:00
# 框架名称: cc-admin
# GitHub用户: ichichuang
# 仓库名称: cc-admin
# =======================================
# ✅ 环境检查通过
# 🚀 开始监控...
# 🔍 搜索版权违规...
# 🔍 搜索结构相似性...
# 🔍 搜索技术栈匹配...
# 📊 生成监控报告...
# ✅ 监控完成！
```

### 2. Token 测试

```bash
# 测试 GitHub Token
pnpm token:test

# 输出示例：
# 🔑 GitHub Token 测试工具 (跨平台版)
# =======================================
# 🔍 测试 GitHub Token 有效性...
# ✅ Token 格式正确
# 🔍 测试 Token 权限...
# ✅ Token 有效，用户: ichichuang
# 🔍 测试仓库访问权限...
# ✅ 可以访问仓库: cc-admin
# 🔍 测试搜索API权限...
# ✅ 搜索API权限正常
# 🔍 检查Token权限范围...
# ✅ Token 权限范围: repo,read:user,read:org
# ✅ Token 具有必要权限
# 🎉 Token 测试完成！
# ✅ 所有测试通过，Token 可以正常使用
```

### 3. 快速搜索

```bash
# 快速搜索相关项目
pnpm monitor:quick

# 输出示例：
# 🔍 cc-admin 快速搜索工具 (跨平台版)
# =======================================
# 搜索时间: 2025-01-28 15:30:00
# 框架名称: cc-admin
# =======================================
# ✅ 环境检查通过
# 🚀 开始快速搜索...
# 🔍 搜索: "cc-admin chichuang"
# ✅ 未发现相关结果
# 🔍 搜索: "vue3 typescript vite unocss"
# 📦 仓库搜索结果 (3 个):
#   - user1/vue3-admin: Vue3 Admin Framework
#   - user2/typescript-admin: TypeScript Admin
#   - user3/vite-admin: Vite Admin Template
# ✅ 快速搜索完成！
# 📊 总共发现 3 个相关结果
```

## 🔧 开发指南

### 添加新脚本

1. **创建脚本文件**:

   ```typescript
   #!/usr/bin/env -S npx tsx

   /**
    * @copyright Copyright (c) 2025 chichuang
    * @license MIT
    * @description cc-admin 企业级后台管理框架 - 脚本描述
    * 本文件为 chichuang 原创，禁止擅自删除署名或用于商业用途。
    */

   // 脚本内容...
   ```

2. **更新 package.json**:

   ```json
   {
     "scripts": {
       "new-script": "pnpm exec tsx scripts/new-script.ts"
     }
   }
   ```

3. **添加文档**: 更新本 README 文件

### 脚本最佳实践

1. **错误处理**: 使用 try-catch 包装所有异步操作
2. **用户反馈**: 提供清晰的进度提示和错误信息
3. **类型安全**: 定义接口和类型，避免 any 类型
4. **模块化**: 将复杂逻辑拆分为独立的方法
5. **跨平台**: 使用 Node.js 标准库，避免平台特定代码

## 📚 相关文档

- [跨平台兼容性指南](../docs/cross-platform-guide.md)
- [GitHub Token 配置指南](../docs/github-token-guide.md)
- [代码监控指南](../docs/code-monitoring-guide.md)

---

_本文档由 cc-admin 框架维护团队编写_
