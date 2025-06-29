# CC Admin - Vue 3 企业级后台管理系统

基于 Vue 3 + TypeScript + Vite 构建的现代化企业级后台管理系统，采用最新的前端技术栈和开发规范。

## 🚀 技术栈

- **框架**: Vue 3.5+ (Composition API)
- **语言**: TypeScript 5.0+
- **构建工具**: Vite 6.0+
- **包管理器**: pnpm [[memory:4990196707575276801]]
- **样式解决方案**: UnoCSS (原子化 CSS)
- **HTTP 客户端**: Alova (替代 axios)
- **状态管理**: Pinia
- **路由**: Vue Router 4
- **代码规范**: ESLint + Prettier + EditorConfig

## ✨ 项目特色

### 🎨 UnoCSS 原子化 CSS

- 兼容 Tailwind CSS 语法
- 支持属性化模式编写
- 内置图标系统 (Carbon + Iconify)
- 自定义快捷方式和主题
- 按需生成，极致性能

### 🌐 现代化 HTTP 客户端

- 使用 Alova 替代传统 axios
- 内置请求/响应状态管理
- 支持 TypeScript 类型推导
- 自动错误处理和重试

### 📦 完整的工程化配置

- Vite 深度优化配置
- 环境变量管理
- 代码分包策略
- 构建性能优化

### 🔧 开发体验

- TypeScript 严格模式
- ESLint + Prettier 代码规范
- Git Hooks 自动检查
- VS Code 开发配置

## 🛠️ 开始使用

### 环境要求

- Node.js >= 18.0.0
- pnpm >= 8.0.0

### 安装依赖

```bash
pnpm install
```

### 启动开发服务器

```bash
pnpm dev
```

### 构建项目

```bash
pnpm build
```

### 预览构建结果

```bash
pnpm preview
```

### 代码检查

```bash
# ESLint 检查
pnpm lint

# TypeScript 类型检查
pnpm type-check

# 命名规范检查
pnpm check-naming
```

## 🎯 项目结构

```
cc-admin/
├── build/                  # 构建配置
│   ├── plugins.ts         # Vite 插件配置
│   └── utils.ts           # 构建工具函数
├── docs/                  # 项目文档
│   ├── ENVIRONMENT_VARIABLES.md
│   ├── NAMING_CONVENTIONS.md
│   └── UNOCSS_GUIDE.md    # UnoCSS 使用指南
├── public/                # 静态资源
├── scripts/               # 工具脚本
│   └── naming-rules.js    # 命名规范检查
├── src/
│   ├── api/               # API 接口管理
│   │   ├── test/          # 测试相关接口
│   │   └── index.ts       # API 统一导出
│   ├── assets/            # 资源文件
│   │   └── styles/        # 全局样式
│   ├── components/        # 公共组件
│   ├── router/            # 路由配置
│   ├── stores/            # 状态管理
│   ├── utils/             # 工具函数
│   │   ├── api.ts         # API 工具
│   │   ├── env.ts         # 环境变量
│   │   └── http.ts        # HTTP 配置
│   └── views/             # 页面组件
│       ├── dashboard/     # 首页
│       └── test/          # 测试页面
├── uno.config.ts          # UnoCSS 配置
├── vite.config.ts         # Vite 配置
└── tsconfig.json          # TypeScript 配置
```

## 🎨 UnoCSS 使用

### 基础原子类

```vue
<template>
  <div class="flex items-center justify-center p-4 bg-blue-500 text-white rounded-lg">基础样式</div>
</template>
```

### 属性化模式

```vue
<template>
  <div
    flex="~ col"
    items="center"
    bg="gradient-to-r from-blue-500 to-purple-600"
  >
    属性化样式
  </div>
</template>
```

### 图标使用

```vue
<template>
  <!-- Carbon 图标集 -->
  <div class="i-carbon-home w-6 h-6 text-blue-500"></div>
  <div class="i-carbon-user w-8 h-8 text-green-500"></div>
</template>
```

### 快捷方式

```vue
<template>
  <!-- 预定义的快捷方式 -->
  <button class="btn-primary">主要按钮</button>
  <div class="card">
    <div class="card-header">卡片标题</div>
    <div class="card-body">卡片内容</div>
  </div>
</template>
```

详细使用指南请查看: [UnoCSS 使用指南](./docs/UNOCSS_GUIDE.md)

## 🌐 HTTP 客户端 (Alova)

### API 定义

```typescript
// src/api/test/index.ts
import { alova } from '@/utils/http'

export const testAPI = {
  // GET 请求
  getData: () => alova.Get('/test'),

  // POST 请求
  postData: (data: any) => alova.Post('/test', data),
}
```

### 组件中使用

```vue
<script setup lang="ts">
import { useRequest } from 'alova/client'
import { testAPI } from '@api/test'

// 自动管理加载状态
const { data, loading, error, send } = useRequest(testAPI.getData(), {
  immediate: false,
})

const handleSubmit = () => {
  send()
}
</script>
```

## 📝 开发规范

### 命名约定

- **文件名**: kebab-case (my-component.vue)
- **组件名**: PascalCase (MyComponent)
- **变量/函数**: camelCase (myFunction)
- **常量**: UPPER_SNAKE_CASE (API_BASE_URL)

### 提交规范

使用 Conventional Commits:

```bash
git commit -m "feat: 添加新功能"
git commit -m "fix: 修复bug"
git commit -m "docs: 更新文档"
```

## 🔧 环境配置

### 环境变量

```bash
# 开发环境 .env.development
VITE_API_BASE_URL=http://localhost:3003
VITE_API_TIMEOUT=30000

# 生产环境 .env.production
VITE_API_BASE_URL=https://api.example.com
VITE_API_TIMEOUT=30000
```

### VS Code 配置

推荐安装以下扩展:

- Vue - Official
- UnoCSS
- TypeScript Importer
- ESLint
- Prettier

## 🚀 部署

### 构建优化

项目已配置完整的构建优化:

- 代码分包
- 资源压缩 (Gzip/Brotli)
- Tree-shaking
- 依赖预构建

### 部署命令

```bash
# 构建
pnpm build

# 预览
pnpm preview

# 分析构建结果
pnpm report
```

## 🔍 开发工具

### UnoCSS 检查器

开发时访问: `http://localhost:5173/__unocss`

### Vite 构建分析

```bash
pnpm report
```

### TypeScript 检查

```bash
pnpm type-check
```

## 📖 相关文档

- [环境变量配置](./docs/ENVIRONMENT_VARIABLES.md)
- [命名规范指南](./docs/NAMING_CONVENTIONS.md)
- [UnoCSS 使用指南](./docs/UNOCSS_GUIDE.md)
- [动态主题变量指南](./docs/THEME_VARIABLES_GUIDE.md)
- [布局系统指南](./docs/LAYOUT_SYSTEM_GUIDE.md)
- [Pinia 持久化指南](./docs/PINIA_PERSISTED_GUIDE.md)
- [Vite 优化说明](./VITE_OPTIMIZATION.md)

## 🤝 贡献指南

1. Fork 项目
2. 创建功能分支: `git checkout -b feat/new-feature`
3. 提交更改: `git commit -m "feat: 添加新功能"`
4. 推送分支: `git push origin feat/new-feature`
5. 提交 Pull Request

## 📄 许可证

MIT License

## 🎯 路线图

- [x] ✅ 基础项目架构
- [x] ✅ Vite 深度优化配置
- [x] ✅ 代码规范和检查工具
- [x] ✅ UnoCSS 原子化 CSS 集成
- [x] ✅ Alova HTTP 客户端集成
- [ ] 🔄 组件库集成
- [ ] 🔄 国际化支持
- [ ] 🔄 主题切换功能
- [ ] 🔄 PWA 支持

---

💡 **提示**: 访问 `/test` 页面查看完整的技术栈演示和使用示例。
