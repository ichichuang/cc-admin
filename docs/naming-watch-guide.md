# 文件命名规范实时监听功能

## 概述

CC-Admin 项目提供了实时监听文件命名规范的功能，可以在开发过程中自动检查新建或修改的文件是否符合项目的命名规范。

## 功能特点

- 🔍 **实时监听**：自动监听 `src/` 目录下的文件变化
- ⚡ **防抖优化**：避免频繁触发检查，提升性能
- 🎯 **智能过滤**：只监听相关文件类型，忽略不必要的文件
- 📊 **详细反馈**：提供清晰的检查结果和错误提示
- 🛠️ **优雅关闭**：支持 Ctrl+C 优雅停止监听

## 安装依赖

项目已自动安装所需依赖：

```bash
pnpm add -D chokidar @types/chokidar
```

## 使用方法

### 启动监听

```bash
# 单独启动监听
pnpm naming-watch

# 详细模式（显示更多日志信息）
pnpm naming-watch --verbose
# 或
pnpm naming-watch -v

# 同时启动开发服务器和监听（推荐）
pnpm dev
```

### 停止监听

按 `Ctrl+C` 即可优雅停止监听器。

## 监听规则

### 监听的文件类型

- `.vue` - Vue 组件文件
- `.ts` - TypeScript 文件

- `.tsx` - TSX 文件

### 忽略的文件

- `index.vue`、`index.ts`
- `types.ts`、`types.d.ts`
- 系统文件（`.DS_Store` 等）

### 忽略的目录

- `node_modules/`
- `.git/`
- `.vscode/`
- `.husky/`
- `dist/`
- `coverage/`
- `public/`

## 触发事件

监听器会在以下情况下触发命名规范检查：

1. **新增文件** (`add`) - 创建新文件时
2. **新增目录** (`addDir`) - 创建新目录时
3. **删除文件** (`unlink`) - 删除文件时
4. **删除目录** (`unlinkDir`) - 删除目录时
5. **修改文件** (`change`) - 修改文件内容时

## 防抖机制

为了避免频繁触发检查，监听器使用了 1 秒的防抖延迟。这意味着：

- 连续的文件操作会被合并为一次检查
- 检查会在最后一次操作后 1 秒执行
- 有效减少系统资源消耗

## 输出示例

### 正常情况

```
🚀 启动文件命名规范实时监听...
📁 监听目录: /src
⚙️  防抖延迟: 1000ms
🔍 详细模式: 关闭
💡 提示: 使用 --verbose 或 -v 参数开启详细日志
⏹️  按 Ctrl+C 停止监听

✅ 监听器已就绪，开始监听文件变化...

✅ 项目命名规范检查完成，一切正常！

📄 新增文件: /src/components/NewComponent.vue
✅ 命名规范检查通过 (245ms)
```

### 发现问题

```
📄 新增文件: /src/components/wrong-name.vue
❌ 发现 1 个命名规范问题：

📁 文件命名 (1个问题):
  /src/components/wrong-name.vue
    全局组件文件名应使用PascalCase命名：wrong-name.vue -> 建议：WrongName.vue

⏱️  检查耗时: 312ms
```

## 配置选项

监听器的配置选项位于 `scripts/watch-naming.ts` 文件中：

```typescript
const CONFIG = {
  // 监听目录
  watchDir: join(projectRoot, 'src'),
  // 忽略的文件/目录
  ignored: [
    /node_modules/,
    /\.git/,
    /\.vscode/,
    /\.husky/,
    /dist/,
    /coverage/,
    /public/,
    /\.DS_Store/,
    /\.log$/,
    /\.tmp$/,
  ],
  // 检查间隔（毫秒）
  debounceDelay: 1000,
  // 是否显示详细日志
  verbose: process.argv.includes('--verbose') || process.argv.includes('-v'),
}
```

## 与现有检查的集成

实时监听功能与现有的命名规范检查完全兼容：

- 使用相同的 `scripts/naming-rules.ts` 脚本
- 遵循相同的命名规范规则
- 提供一致的错误提示和建议

### 手动检查

```bash
# 手动执行一次检查
pnpm naming-check

# 在 CI/CD 中使用
pnpm check  # 包含命名检查
```

## 开发建议

1. **开发时启动监听**：在开发新功能时启动监听器，及时发现问题
2. **使用详细模式**：调试时使用 `--verbose` 参数获取更多信息
3. **结合 Git Hooks**：在提交前自动执行命名检查
4. **团队协作**：确保团队成员都了解命名规范

## 故障排除

### 常见问题

1. **监听器无法启动**
   - 检查是否安装了 `chokidar` 依赖
   - 确认 `scripts/naming-rules.ts` 文件存在

2. **检查结果不准确**
   - 确认文件路径正确
   - 检查文件权限

3. **性能问题**
   - 调整 `debounceDelay` 配置
   - 检查忽略规则是否合适

### 日志级别

- **基础模式**：只显示关键信息
- **详细模式**：显示所有操作和检查详情

## 相关文档

- [命名规范指南](./naming-conventions.md)
- [项目架构指南](./architecture-guide.md)
- [开发工具链指南](./toolchain-guide.md)
- [功能实现总结](./NAMING_WATCH_SUMMARY.md)
