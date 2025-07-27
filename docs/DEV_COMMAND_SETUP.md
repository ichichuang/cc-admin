# Dev 命令配置说明

## 🎯 配置目标

实现 `pnpm dev` 命令同时启动：

1. Vite 开发服务器
2. 文件命名规范实时监听

## ✅ 最终配置

### package.json 配置

```json
{
  "scripts": {
    "dev": "pnpm exec tsx scripts/dev-parallel.ts",
    "naming-watch": "pnpm exec tsx scripts/watch-naming.ts"
  },
  "devDependencies": {
    "chokidar": "^4.0.3",
    "tsx": "^4.20.3"
  }
}
```

### 依赖说明

- **tsx**: TypeScript 执行器，用于运行 TypeScript 脚本
- **chokidar**: 文件监听库，用于实时监听文件变化

## 🚀 使用方法

### 启动开发环境

```bash
# 同时启动开发服务器和命名规范监听
pnpm dev
```

### 单独使用

```bash
# 只启动开发服务器
pnpm exec vite

# 只启动命名规范监听
pnpm naming-watch

# 详细模式监听
pnpm naming-watch --verbose
```

## 📊 运行效果

当执行 `pnpm dev` 时，会看到类似以下输出：

```
🚀 启动文件命名规范实时监听...
📁 监听目录: /src
⚙️  防抖延迟: 1000ms
🔍 详细模式: 关闭
💡 提示: 使用 --verbose 或 -v 参数开启详细日志
⏹️  按 Ctrl+C 停止监听

✅ 监听器已就绪，开始监听文件变化...

🔍 开始检查项目命名规范...
📁 扫描目录: F:\GitHub\cc-admin\src
✅ 项目命名规范检查完成，一切正常！

  VITE v7.0.0  ready in 1234 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help
```

## 🔧 配置原理

### TypeScript 脚本工作原理

我们使用自定义的 TypeScript 脚本来并行执行多个命令：

```typescript
// 启动 Vite 开发服务器
const viteProcess = spawn('pnpm', ['exec', 'vite'], {
  stdio: 'inherit',
  shell: true,
})

// 启动命名规范监听
const namingWatchProcess = spawn('pnpm', ['naming-watch'], {
  stdio: 'inherit',
  shell: true,
})
```

脚本功能：

- 并行启动两个进程
- 统一的进程管理
- 优雅的错误处理
- 一致的退出机制

### 进程管理

- 两个进程并行运行
- 按 `Ctrl+C` 会同时停止两个进程
- 任一进程异常退出不会影响另一个进程

## 🎨 用户体验

### 优势

1. **一键启动**: 一个命令启动完整的开发环境
2. **实时反馈**: 开发过程中自动检查命名规范
3. **并行执行**: 两个服务同时运行，互不干扰
4. **优雅退出**: 统一的停止机制

### 开发流程

```bash
# 1. 启动开发环境
pnpm dev

# 2. 开始开发（自动检查命名规范）
# 3. 修改文件时自动触发检查
# 4. 按 Ctrl+C 停止所有服务
```

## 🔍 故障排除

### 常见问题

1. **tsx 未安装**

   ```bash
   pnpm add -D tsx
   ```

2. **端口冲突**
   - Vite 默认使用 5173 端口
   - 命名监听不占用端口

3. **权限问题**
   - 确保有文件系统访问权限
   - Windows 用户可能需要管理员权限

### 调试模式

```bash
# 详细模式启动
pnpm naming-watch --verbose

# 单独测试各个组件
pnpm exec vite
pnpm naming-watch
```

## 📝 更新记录

- **2024-12-XX**: 初始配置，使用 concurrently 实现并行执行
- **2024-12-XX**: 修复 ES 模块兼容性问题
- **2024-12-XX**: 优化用户体验和错误处理

## 🔗 相关文档

- [命名规范监听指南](./naming-watch-guide.md)
- [开发工具链指南](./toolchain-guide.md)
- [项目架构指南](./architecture-guide.md)
