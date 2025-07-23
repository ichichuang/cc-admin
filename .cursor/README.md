# CC-Admin Cursor 配置说明

## 📋 配置文件总览

本目录包含了 CC-Admin 项目在 Cursor 编辑器中的完整配置，确保最佳的开发体验和代码质量。

### 📁 配置文件列表

| 文件名                 | 说明              | 作用                                |
| ---------------------- | ----------------- | ----------------------------------- |
| `settings.json`        | Cursor 编辑器配置 | IDE 行为设置、插件配置、显示效果等  |
| `cursor-rules`         | Cursor AI 规则    | AI 编码约束、项目特定指令、行为规范 |
| `cursor-guidelines.md` | AI 编码指导       | 命名规范、代码风格、最佳实践指导    |
| `project-rules.md`     | 项目配置规则      | 完整的项目配置说明、技术栈文档      |
| `rules/`               | 扩展规则目录      | 更多细分的配置规则（可选）          |

## 🎯 配置核心要点

### 1. 包管理器强制约定

**配置位置**: `settings.json` + `cursor-rules`

```json
{
  "npm.packageManager": "pnpm"
}
```

**约束规则**:

- ✅ 必须使用 `pnpm` 命令
- ❌ 禁止使用 `npm` 或 `yarn`
- 🤖 AI 助手强制遵循此约定

### 2. 命名规范强制执行

**配置位置**: `cursor-guidelines.md` + 自动化脚本

- **文件命名**: kebab-case / PascalCase（根据文件类型）
- **代码命名**: camelCase / PascalCase / SCREAMING_SNAKE_CASE
- **自动检查**: 提交前强制验证命名规范

### 3. TypeScript 严格模式

**配置特点**:

- 启用所有严格类型检查
- 强制类型注解
- 路径别名自动补全
- 实时错误提示

### 4. Vue 3 + Composition API 优化

**IDE 支持**:

- Vue 3 语法高亮和智能提示
- `<script setup>` 语法支持
- 组合式 API 自动导入
- 模板类型检查

## 🚀 开发体验优化

### 智能提示增强

```json
{
  "editor.suggest.showStatusBar": true,
  "editor.inlineSuggest.enabled": true,
  "github.copilot.enable": {
    "*": true,
    "vue": true,
    "typescript": true
  }
}
```

### 终端集成优化

- 默认使用 `zsh` 终端
- 强制颜色输出支持
- 自动设置工作目录
- pnpm 命令自动完成

### 文件监听和热更新

- 智能文件监听
- 快速热更新
- 自动保存格式化
- Git 集成优化

## 📚 详细配置说明

### settings.json 核心配置

```json
{
  // 包管理器配置
  "npm.packageManager": "pnpm",

  // 终端配置
  "terminal.integrated.defaultProfile.osx": "zsh",

  // 编辑器配置
  "editor.fontFamily": "JetBrains Mono, Monaco",
  "editor.fontSize": 14,
  "editor.tabSize": 2,

  // Vue 支持
  "vue.inlayHints.missingProps": true,
  "vue.inlayHints.inlineHandlerLeading": true,

  // 自动格式化
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  }
}
```

### cursor-rules 核心约束

```yaml
核心约束:
  - 强制使用 pnpm 包管理器
  - 遵循项目命名规范
  - 使用 Vue 3 Composition API
  - 保持代码类型安全
  - 遵循 ESLint 规则

AI 行为:
  - 不修改核心框架配置
  - 专注于业务逻辑开发
  - 自动应用最佳实践
  - 提供类型安全的代码
```

## 🔧 自定义配置

### 个人设置覆盖

如需个人化配置，请创建：

- `.cursor/settings.local.json` （本地设置，不提交到仓库）
- 在 `.gitignore` 中添加 `*.local.*` 忽略规则

### 团队设置同步

所有团队共享的配置都在版本控制中，确保：

- 新成员克隆后即可使用
- 配置变更全团队同步
- 开发体验保持一致

## ⚠️ 重要说明

1. **不要随意修改配置文件** - 可能影响整个团队的开发体验
2. **配置文件变更需要团队讨论** - 重大改动需要全员同意
3. **本地配置使用 `.local` 后缀** - 避免个人配置提交到仓库
4. **定期更新配置** - 跟随 Cursor 版本更新优化配置

## 📖 相关文档

- [项目配置规则详解](./project-rules.md)
- [AI 编码指导规范](./cursor-guidelines.md)
- [框架开发文档](../README.md)
- [技术栈配置说明](../docs/)

---

> **配置原则**: 确保开发体验的一致性、提高代码质量、优化 AI 辅助开发效果
