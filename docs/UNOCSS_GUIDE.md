# UnoCSS 使用指南

## 简介

UnoCSS 是一个即时原子化 CSS 引擎，提供高性能的样式开发体验。它兼容 Tailwind CSS 语法，同时提供更强的扩展性和性能。

## 项目配置

### 1. 依赖安装

项目已安装以下 UnoCSS 相关依赖：

```bash
pnpm add -D unocss @unocss/preset-uno @unocss/preset-attributify @unocss/preset-icons @unocss/preset-typography @unocss/transformer-directives @unocss/transformer-variant-group @unocss/reset @iconify/json
```

### 2. 配置文件

#### uno.config.ts

主配置文件包含了以下功能：

- **预设配置**：Uno、属性化、图标、排版预设
- **转换器**：指令转换器、变体组转换器
- **快捷方式**：布局、按钮、卡片、表单等常用样式组合
- **自定义规则**：多行截断、十六进制颜色、安全区域等
- **主题配置**：颜色系统、字体、断点、阴影、动画

#### Vite 插件配置

在 `build/plugins.ts` 中已添加 UnoCSS 插件：

```typescript
import UnoCSS from 'unocss/vite'

const plugins: PluginOption[] = [
  UnoCSS(), // 必须在 Vue 插件之前
  vue(),
  vueJsx(),
]
```

#### 样式导入

在 `src/main.ts` 中导入 UnoCSS 样式：

```typescript
import '@unocss/reset/tailwind.css'
import 'virtual:uno.css'
```

## 使用方法

### 1. 基础原子类

```vue
<template>
  <!-- 布局 -->
  <div class="flex items-center justify-center">
    <div class="w-64 h-32 bg-blue-500 rounded-lg shadow-md"></div>
  </div>

  <!-- 响应式 -->
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    <div class="p-4 bg-white rounded shadow">卡片内容</div>
  </div>

  <!-- 文本样式 -->
  <h1 class="text-2xl font-bold text-gray-800 mb-4">标题</h1>
  <p class="text-base text-gray-600 leading-relaxed">正文内容</p>
</template>
```

### 2. 属性化模式

```vue
<template>
  <!-- 使用属性代替类名 -->
  <div
    flex="~ col"
    items="center"
    justify="center"
    bg="gradient-to-r from-blue-500 to-purple-600"
    text="white center"
    p="6"
    rounded="lg"
    shadow="lg"
  >
    属性化模式示例
  </div>
</template>
```

### 3. 图标使用

```vue
<template>
  <!-- Carbon 图标集 -->
  <div class="i-carbon-home w-6 h-6 text-blue-500"></div>
  <div class="i-carbon-user w-8 h-8 text-green-500"></div>
  <div class="i-carbon-settings w-5 h-5 text-gray-600"></div>

  <!-- 其他图标集 -->
  <div class="i-heroicons-solid-home w-6 h-6"></div>
  <div class="i-mdi-account w-6 h-6"></div>
</template>
```

### 4. 快捷方式

项目预定义了多个快捷方式：

```vue
<template>
  <!-- 布局快捷方式 -->
  <div class="flex-center">居中布局</div>
  <div class="flex-between">
    <span>左侧</span>
    <span>右侧</span>
  </div>

  <!-- 按钮快捷方式 -->
  <button class="btn-primary">主要按钮</button>
  <button class="btn-secondary">次要按钮</button>
  <button class="btn-success">成功按钮</button>
  <button class="btn-danger">危险按钮</button>

  <!-- 卡片快捷方式 -->
  <div class="card">
    <div class="card-header">卡片标题</div>
    <div class="card-body">卡片内容</div>
  </div>

  <!-- 表单快捷方式 -->
  <input
    type="text"
    class="input"
    placeholder="普通输入框"
  />
  <input
    type="text"
    class="input-success"
    placeholder="成功状态"
  />
  <input
    type="text"
    class="input-error"
    placeholder="错误状态"
  />
</template>
```

### 5. 自定义规则

```vue
<template>
  <!-- 多行文本截断 -->
  <div class="line-clamp-2 w-64">这是一段很长的文本，会在第二行截断...</div>

  <!-- 十六进制颜色 -->
  <div class="bg-hex-6366f1 text-hex-ffffff p-4">自定义颜色</div>

  <!-- 安全区域适配 -->
  <div class="safe-top safe-bottom">适配刘海屏的内容</div>
</template>
```

### 6. 主题颜色

```vue
<template>
  <!-- 预定义颜色系统 -->
  <div class="bg-primary-500 text-white p-4">主色调</div>
  <div class="bg-success-500 text-white p-4">成功色</div>
  <div class="bg-warning-500 text-white p-4">警告色</div>
  <div class="bg-danger-500 text-white p-4">危险色</div>

  <!-- 颜色渐变 -->
  <div class="bg-primary-50 text-primary-900 p-4">浅色背景</div>
  <div class="bg-primary-900 text-primary-50 p-4">深色背景</div>
</template>
```

## 开发工具

### 1. VS Code 扩展

安装 "UnoCSS" 扩展获得：

- 智能提示
- 语法高亮
- 类名预览

### 2. UnoCSS 检查器

开发时访问 `http://localhost:5173/__unocss` 查看：

- 生成的 CSS
- 使用的类名
- 性能统计

### 3. 调试技巧

```vue
<script setup lang="ts">
// 开发时可以临时添加类名查看效果
const debugClasses = ['border-2', 'border-red-500', 'bg-red-100'].join(' ')
</script>

<template>
  <div :class="debugClasses">调试时使用红色边框和背景</div>
</template>
```

## 最佳实践

### 1. 类名组织

```vue
<template>
  <!-- 推荐：按功能分组 -->
  <div
    class="
    flex items-center justify-between
    w-full max-w-md mx-auto
    p-4 mb-6
    bg-white border border-gray-200
    rounded-lg shadow-sm
    hover:shadow-md transition-shadow
  "
  >
    内容
  </div>
</template>
```

### 2. 组件样式

```vue
<template>
  <div class="custom-component">
    <slot />
  </div>
</template>

<style>
/* 使用 @apply 指令 */
.custom-component {
  @apply p-4
    bg-white
    rounded-lg
    shadow-md
    border
    border-gray-200;
}

/* 复杂样式仍使用传统 CSS */
.custom-component::before {
  content: '';
  position: absolute;
  /* ... */
}
</style>
```

### 3. 响应式设计

```vue
<template>
  <!-- 移动端优先 -->
  <div
    class="
    text-sm md:text-base lg:text-lg
    p-2 md:p-4 lg:p-6
    grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3
    gap-2 md:gap-4 lg:gap-6
  "
  >
    响应式内容
  </div>
</template>
```

### 4. 主题切换

```vue
<script setup lang="ts">
import { ref } from 'vue'

const isDark = ref(false)

const toggleTheme = () => {
  isDark.value = !isDark.value
  document.documentElement.classList.toggle('dark', isDark.value)
}
</script>

<template>
  <div class="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
    <button
      @click="toggleTheme"
      class="btn-primary dark:btn-secondary"
    >
      切换主题
    </button>
  </div>
</template>
```

## 性能优化

### 1. 按需生成

UnoCSS 只会生成实际使用的样式，确保 CSS 文件最小化。

### 2. 预设优化

使用预设而不是手动配置以获得更好的性能：

```typescript
// 推荐
presets: [presetUno(), presetAttributify()]

// 避免过多自定义规则
rules: [
  // 只添加确实需要的规则
]
```

### 3. 开发体验

- 使用快捷方式减少重复代码
- 利用属性化模式简化类名编写
- 结合 TypeScript 获得类型安全

## 迁移指南

### 从 Tailwind CSS 迁移

UnoCSS 兼容大部分 Tailwind CSS 语法，可以直接使用：

```vue
<!-- Tailwind CSS 语法直接可用 -->
<div class="flex items-center space-x-4 bg-blue-500 text-white p-4 rounded-lg">
  <!-- 内容 -->
</div>
```

### 从传统 CSS 迁移

```css
/* 传统 CSS */
.button {
  padding: 12px 24px;
  background-color: #3b82f6;
  color: white;
  border-radius: 8px;
  border: none;
  cursor: pointer;
}

.button:hover {
  background-color: #2563eb;
}
```

```vue
<!-- UnoCSS 等效 -->
<button
  class="px-6 py-3 bg-blue-500 text-white rounded-lg border-none cursor-pointer hover:bg-blue-600"
>
  按钮
</button>

<!-- 或使用快捷方式 -->
<button class="btn-primary">
  按钮
</button>
```

## 故障排除

### 1. 样式不生效

- 检查是否正确导入 `virtual:uno.css`
- 确认类名拼写正确
- 检查配置文件语法

### 2. 图标不显示

- 确认图标名称正确
- 检查是否安装 `@iconify/json`
- 验证图标集是否存在

### 3. 构建问题

- 确保 UnoCSS 插件在 Vue 插件之前
- 检查 Node.js 版本兼容性
- 清除缓存重新构建

### 4. 类型错误

```typescript
// 添加 UnoCSS 类型声明
declare module 'virtual:uno.css' {
  const css: string
  export default css
}
```

## 参考资源

- [UnoCSS 官方文档](https://unocss.dev/)
- [Iconify 图标集](https://iconify.design/)
- [Tailwind CSS 文档](https://tailwindcss.com/docs)
- [项目示例页面](/test) - 查看完整的使用示例
