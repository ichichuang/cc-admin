# CC-Admin

基于 Vue 3 + TypeScript + Vite 的现代化前端项目模板

## 📖 项目简介

CC-Admin 是一个使用 `npm create vue@latest` 命令创建的标准 Vue 3 项目，集成了现代前端开发的最佳实践和工具链。项目采用 Composition API 编写风格，提供了完整的开发环境配置和严格的代码质量控制。

## 🚀 技术栈

### 核心框架

- **Vue.js**: 3.5.17 - 渐进式 JavaScript 框架
- **TypeScript**: 5.8.3 - JavaScript 的超集，提供静态类型检查
- **Vite**: 7.0.0 - 下一代前端构建工具

### 路由与状态管理

- **Vue Router**: 4.5.1 - Vue.js 官方路由管理器
- **Pinia**: 3.0.3 - Vue 3 推荐的状态管理库

### 开发工具

- **ESLint**: 9.30.0 - JavaScript 代码检查工具
- **Prettier**: 3.5.3 - 代码格式化工具
- **TypeScript ESLint**: 8.35.0 - TypeScript 专用检查规则
- **Vue DevTools**: 7.7.7 - Vue 开发者工具插件

### 代码质量保证

- **Husky**: 9.1.7 - Git 钩子管理工具
- **Lint-staged**: 16.1.2 - Git 暂存文件检查工具
- **Commitlint**: 19.8.1 - Git 提交信息规范检查
- **Commitizen**: 4.3.1 - 交互式提交信息生成工具

### 构建与打包

- **@vitejs/plugin-vue**: 6.0.0 - Vue 单文件组件支持
- **@vitejs/plugin-vue-jsx**: 5.0.0 - Vue JSX 支持
- **vue-tsc**: 2.2.10 - Vue TypeScript 编译器

## 📁 项目结构

```
CC-Admin/
├── public/                 # 静态资源目录
│   └── favicon.ico        # 网站图标
├── src/                   # 源代码目录
│   ├── assets/           # 静态资源
│   │   ├── base.css      # 基础样式
│   │   ├── main.css      # 主样式文件
│   │   └── logo.svg      # Vue Logo
│   ├── components/       # 公共组件
│   │   ├── icons/        # 图标组件目录
│   │   │   ├── IconCommunity.vue
│   │   │   ├── IconDocumentation.vue
│   │   │   ├── IconEcosystem.vue
│   │   │   ├── IconSupport.vue
│   │   │   └── IconTooling.vue
│   │   ├── HelloWorld.vue    # Hello World 示例组件
│   │   ├── TheWelcome.vue    # 欢迎页面组件
│   │   └── WelcomeItem.vue   # 欢迎页面子组件
│   ├── router/           # 路由配置
│   │   └── index.ts      # 路由配置文件
│   ├── stores/           # 状态管理
│   │   └── counter.ts    # 计数器状态示例
│   ├── views/            # 页面视图
│   │   ├── AboutView.vue # 关于页面
│   │   └── HomeView.vue  # 首页
│   ├── App.vue           # 根组件
│   └── main.ts           # 应用入口文件
├── .editorconfig         # 编辑器配置
├── .gitattributes        # Git 属性配置
├── .gitignore            # Git 忽略文件配置
├── .gitmessage           # Git 提交信息模板
├── .husky/               # Git 钩子配置
│   ├── pre-commit        # 提交前代码检查
│   └── commit-msg        # 提交信息检查
├── .npmrc                # pnpm 配置文件
├── .nvmrc                # Node.js 版本文件 (20.19.0)
├── .prettierrc.json      # Prettier 配置
├── .vscode/              # VSCode 配置
│   ├── extensions.json   # 推荐扩展
│   └── settings.json     # 编辑器设置
├── commitlint.config.js  # Commitlint 配置
├── env.d.ts              # 环境变量类型声明
├── eslint.config.ts      # ESLint 配置
├── index.html            # HTML 模板
├── package.json          # 项目依赖配置
├── pnpm-lock.yaml        # pnpm 锁定文件
├── tsconfig.app.json     # 应用 TypeScript 配置
├── tsconfig.json         # TypeScript 基础配置
├── tsconfig.node.json    # Node.js TypeScript 配置
├── vite.config.ts        # Vite 配置文件
└── README.md             # 项目说明文档
```

## 📦 依赖说明

### 生产依赖 (dependencies)

```json
{
  "pinia": "^3.0.3", // 状态管理库
  "vue": "^3.5.17", // Vue.js 核心库
  "vue-router": "^4.5.1" // Vue 路由管理
}
```

### 开发依赖 (devDependencies)

```json
{
  "@tsconfig/node22": "^22.0.2", // Node.js 22 TypeScript 配置
  "@types/node": "^22.15.34", // Node.js 类型定义
  "@typescript-eslint/eslint-plugin": "^8.35.0", // TypeScript ESLint 插件
  "@typescript-eslint/parser": "^8.35.0", // TypeScript ESLint 解析器
  "@vitejs/plugin-vue": "^6.0.0", // Vite Vue 插件
  "@vitejs/plugin-vue-jsx": "^5.0.0", // Vite Vue JSX 插件
  "@vue/eslint-config-prettier": "^10.2.0", // Vue ESLint Prettier 配置
  "@vue/eslint-config-typescript": "^14.5.1", // Vue ESLint TypeScript 配置
  "@vue/tsconfig": "^0.7.0", // Vue TypeScript 配置
  "eslint": "^9.30.0", // ESLint 代码检查
  "eslint-plugin-vue": "^10.2.0", // Vue ESLint 插件
  "husky": "^9.1.7", // Git 钩子管理
  "jiti": "^2.4.2", // TypeScript 运行时
  "lint-staged": "^16.1.2", // Git 暂存文件检查
  "@commitlint/cli": "^19.8.1", // Commitlint 命令行工具
  "@commitlint/config-conventional": "^19.8.1", // 约定式提交配置
  "commitizen": "^4.3.1", // 交互式提交工具
  "cz-conventional-changelog": "^3.3.0", // Conventional 提交适配器
  "npm-run-all2": "^8.0.4", // 并行运行脚本工具
  "prettier": "^3.5.3", // 代码格式化工具
  "typescript": "^5.8.3", // TypeScript 编译器
  "vite": "^7.0.0", // Vite 构建工具
  "vite-plugin-vue-devtools": "^7.7.7", // Vue 开发者工具
  "vue-tsc": "^2.2.10" // Vue TypeScript 编译器
}
```

## 🛠️ 开发环境配置

### 包管理器

此项目使用 **pnpm** 作为包管理器，请确保已安装：

```bash
npm install -g pnpm
```

### Node.js 版本要求

- Node.js >= 20.19.0
- pnpm >= 8.0.0

### IDE 推荐

- [Visual Studio Code](https://code.visualstudio.com/)
- [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) 插件 (请禁用 Vetur)

## 🚀 快速开始

### 安装依赖

```bash
pnpm install
```

### 启动开发服务器

```bash
pnpm dev
```

开发服务器将在 http://localhost:5173 启动

### 构建生产版本

```bash
pnpm build
```

### 预览构建结果

```bash
pnpm preview
```

### TypeScript 类型检查

```bash
pnpm type-check
```

### 代码检查和修复

```bash
pnpm lint
```

### 代码格式化

```bash
pnpm format
```

### 完整代码质量检查

```bash
pnpm code-check
```

### 快速修复代码格式和规范

```bash
pnpm code-fix
```

### 交互式提交（推荐）

```bash
pnpm commit
```

使用交互式界面生成规范的提交信息

### 检查提交信息格式

```bash
pnpm commitlint
```

## 📝 可用脚本

| 脚本                | 描述                                 |
| ------------------- | ------------------------------------ |
| `pnpm dev`          | 启动开发服务器，支持热重载           |
| `pnpm build`        | 构建生产版本，包含类型检查           |
| `pnpm build-only`   | 仅构建，不进行类型检查               |
| `pnpm preview`      | 预览构建后的应用                     |
| `pnpm type-check`   | 运行 TypeScript 类型检查             |
| `pnpm lint`         | 运行 ESLint 检查并自动修复           |
| `pnpm lint:check`   | 仅检查代码规范，不自动修复           |
| `pnpm format`       | 使用 Prettier 格式化代码             |
| `pnpm format:check` | 检查代码格式，不自动修复             |
| `pnpm code-check`   | 完整的代码质量检查（格式+规范+类型） |
| `pnpm code-fix`     | 自动修复代码格式和规范问题           |
| `pnpm commit`       | 交互式提交（推荐使用）               |
| `pnpm commitlint`   | 检查提交信息格式                     |

## 🔧 项目配置

### 代码格式化配置

项目配置了完整的代码格式化和质量控制系统：

#### Prettier 配置 (.prettierrc.json)

- 不使用分号
- 使用单引号
- 行宽限制为100字符
- 使用2个空格缩进
- 尾随逗号（ES5风格）
- Vue组件单行属性

#### ESLint 配置 (eslint.config.ts)

- Vue 3 推荐规则
- TypeScript 严格检查
- **未使用变量规则**：以 `_` 开头的变量不会报错

  ```typescript
  // ✅ 不会报错
  const _unusedVar = 'test'
  function handleClick(_event: Event) {}

  // ❌ 会报错
  const unusedVar = 'test'
  ```

#### Git 钩子配置

- **pre-commit**: 自动运行代码格式化和检查
- **commit-msg**: 检查提交信息格式规范

#### Commitlint 配置 (commitlint.config.js)

- 严格的约定式提交规范
- 支持的提交类型：feat, fix, docs, style, refactor, perf, test, build, ci, chore, revert, wip, release
- 作用域枚举：components, utils, api, types, styles, router, store, config, deps, build, docs, test, ci, release
- 标题长度限制：10-72字符
- 主题描述限制：4-50字符

### Vite 配置

- 支持 Vue 单文件组件
- 支持 Vue JSX 语法
- 集成 Vue DevTools
- 配置路径别名 `@` 指向 `src` 目录

### TypeScript 配置

- 严格类型检查
- 支持 `.vue` 文件的类型推导
- 路径映射配置

### VSCode 配置

- 保存时自动格式化
- 保存时自动修复ESLint错误
- 自动组织导入语句
- 禁用TypeScript内置格式化器
- **文件嵌套分组**：相关配置文件自动分组显示，保持目录整洁

## 🌟 特性

- ⚡️ **极速开发**: Vite 提供秒级热重载
- 🎯 **TypeScript**: 完整的类型安全支持
- 📱 **响应式设计**: 移动端友好的 CSS 样式
- 🎨 **现代化 UI**: 清爽的界面设计
- 🔀 **路由管理**: 基于 Vue Router 4 的路由系统
- 📊 **状态管理**: 使用 Pinia 进行状态管理
- 🔍 **代码质量**: ESLint + Prettier 保证代码质量
- 🛠️ **开发体验**: Vue DevTools 集成
- 🚀 **自动化**: Git 钩子自动进行代码检查和格式化
- 📦 **pnpm**: 快速、节省磁盘空间的包管理器

## 🎯 代码规范

### 变量命名规范

- 未使用的变量、参数、错误对象可以用 `_` 前缀来避免ESLint警告：

  ```typescript
  // 函数参数
  function onClick(_event: MouseEvent) {
    // 不使用event参数也不会报错
  }

  // 变量
  const _tempData = getData() // 临时不用但后续可能会用

  // 错误处理
  try {
    doSomething()
  } catch (_error) {
    // 不处理具体错误信息
  }
  ```

### Git 提交信息规范

#### 推荐提交流程

**方式一：交互式提交（推荐）**

1. 修改代码
2. `pnpm commit` 使用交互式界面
3. 按提示选择提交类型、作用域、填写描述
4. **自动触发**：
   - ESLint 检查和修复
   - Prettier 格式化
   - TypeScript 类型检查
   - Commitlint 提交信息格式检查
5. 检查通过后完成提交

**方式二：传统提交**

1. 修改代码
2. `git add .` 添加到暂存区
3. `git commit -m "type(scope): subject"`
4. **自动触发**：同上检查流程

#### 提交信息格式

```
<type>(<scope>): <subject>

<body>

<footer>
```

#### 提交类型 (type)

| 类型       | 描述          | 示例                                              |
| ---------- | ------------- | ------------------------------------------------- |
| `feat`     | ✨ 新功能     | `feat(components): add user profile component`    |
| `fix`      | 🐛 修复错误   | `fix(api): handle network timeout error`          |
| `docs`     | 📝 文档更新   | `docs(readme): update installation guide`         |
| `style`    | 💄 代码格式化 | `style(components): format code with prettier`    |
| `refactor` | ♻️ 代码重构   | `refactor(utils): simplify date helper functions` |
| `perf`     | ⚡️ 性能优化  | `perf(router): lazy load route components`        |
| `test`     | ✅ 添加测试   | `test(utils): add unit tests for validation`      |
| `build`    | 📦 构建相关   | `build(deps): upgrade vue to 3.5.17`              |
| `ci`       | 👷 持续集成   | `ci(github): add automated testing workflow`      |
| `chore`    | 🔧 其他更改   | `chore(config): update eslint rules`              |
| `revert`   | ⏪ 撤销提交   | `revert: feat(components): add user profile`      |
| `wip`      | 🚧 开发中     | `wip(feature): work in progress on new layout`    |
| `release`  | 🔖 发布版本   | `release: bump version to 1.0.0`                  |

#### 作用域 (scope)

- `components` - Vue组件相关
- `utils` - 工具函数
- `api` - API相关
- `types` - 类型定义
- `styles` - 样式相关
- `router` - 路由相关
- `store` - 状态管理
- `config` - 配置文件
- `docs` - 文档
- `deps` - 依赖相关
- `build` - 构建相关
- `test` - 测试相关
- `ci` - 持续集成
- `release` - 发布相关

#### 提交信息示例

```bash
# ✅ 好的提交信息
feat(components): add user authentication form
fix(api): resolve login timeout issue
docs(readme): update project setup instructions
perf(router): implement lazy loading for routes
test(utils): add unit tests for date formatter

# ❌ 不好的提交信息
update code
fix bug
add feature
changed files
```

#### 完整提交信息示例

```
feat(components): add user profile component

Add a new UserProfile component with the following features:
- Avatar display and upload functionality
- User information editing form
- Password change capability
- Responsive design for mobile devices

The component includes proper TypeScript types and comprehensive
unit tests. It integrates with the existing authentication system.

Closes #123
BREAKING CHANGE: UserInfo interface now requires avatar field
```

## 📚 学习资源

- [Vue 3 官方文档](https://cn.vuejs.org/)
- [Vite 配置参考](https://cn.vitejs.dev/config/)
- [Vue Router 文档](https://router.vuejs.org/zh/)
- [Pinia 状态管理](https://pinia.vuejs.org/zh/)
- [TypeScript 手册](https://www.typescriptlang.org/docs/)
- [pnpm 官方文档](https://pnpm.io/zh/)

## 🤝 贡献

欢迎提交 Issue 和 Pull Request 来改进项目！

提交代码前请确保：

- 代码通过 `pnpm code-check` 检查
- 遵循项目的代码规范
- 添加必要的测试（如适用）

## 📄 许可证

[MIT License](https://opensource.org/licenses/MIT)

---

> 此项目使用 `npm create vue@latest` 创建，配置了严格的代码质量控制和现代化的开发工具链。使用 pnpm 作为包管理器，提供更好的性能和磁盘空间利用率。
