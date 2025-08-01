<!--
  @copyright Copyright (c) 2025 chichuang
  @license MIT
  @description CC-Admin 企业级后台管理框架 - 样式指南
  本文件为 chichuang 原创，禁止擅自删除署名或用于商业用途。
-->

# 样式指南

CC-Admin 使用 UnoCSS 作为样式解决方案，提供原子化 CSS 和主题系统。

## 📋 样式规范

### 基本原则

- **原子化**: 使用原子化 CSS 类名
- **响应式**: 支持移动端和桌面端适配
- **主题化**: 支持深色/浅色主题切换
- **一致性**: 统一的设计语言和视觉规范
- **可维护性**: 清晰的样式结构和命名规范

### 文件组织

```
unocss/
├── index.ts              # UnoCSS 配置入口
├── env.ts                # 环境变量配置
├── theme.ts              # 主题配置
├── rules/                # 自定义规则
│   ├── pixelRules.ts     # 像素相关规则
│   └── themeRules.ts     # 主题相关规则
├── shortcuts/            # 快捷方式
│   ├── index.ts          # 快捷方式入口
│   ├── button.ts         # 按钮样式
│   ├── layout.ts         # 布局样式
│   └── text.ts           # 文字样式
└── utils/                # 工具函数
    └── icons.ts          # 图标工具
```

## 🚀 快速开始

### 基础配置

```typescript
// uno.config.ts
import { defineConfig } from 'unocss'
import { presetUno, presetAttributify, presetIcons } from 'unocss'
import { theme } from './unocss/theme'
import { shortcuts } from './unocss/shortcuts'
import { rules } from './unocss/rules'

export default defineConfig({
  presets: [
    presetUno(),
    presetAttributify(),
    presetIcons({
      scale: 1.2,
      warn: true,
    }),
  ],
  theme,
  shortcuts,
  rules,
  safelist: ['btn-primary', 'btn-success', 'btn-warning', 'btn-error', 'btn-info'],
})
```

### 主题配置

```typescript
// unocss/theme.ts
export const theme = {
  colors: {
    primary: {
      50: '#e6f7ff',
      100: '#bae7ff',
      500: '#1890ff',
      600: '#096dd9',
      700: '#0050b3',
    },
    success: {
      50: '#f6ffed',
      100: '#d9f7be',
      500: '#52c41a',
      600: '#389e0d',
      700: '#237804',
    },
    warning: {
      50: '#fffbe6',
      100: '#fff1b8',
      500: '#faad14',
      600: '#d48806',
      700: '#ad6800',
    },
    error: {
      50: '#fff2f0',
      100: '#ffccc7',
      500: '#f5222d',
      600: '#cf1322',
      700: '#a8071a',
    },
  },
  spacing: {
    'header-height': 'var(--header-height)',
    'sidebar-width': 'var(--sidebar-width)',
    'content-height': 'var(--content-height)',
  },
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },
}
```

## 📝 样式使用示例

### 基础样式

```vue
<template>
  <div class="style-demo">
    <!-- 布局 -->
    <div class="flex items-center justify-between p-4 bg-white dark:bg-gray-800">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">样式演示</h1>
      <button class="btn-primary">主要按钮</button>
    </div>

    <!-- 颜色系统 -->
    <div class="grid grid-cols-5 gap-4 p-4">
      <div class="bg-primary-500 text-white p-4 rounded">Primary</div>
      <div class="bg-success-500 text-white p-4 rounded">Success</div>
      <div class="bg-warning-500 text-white p-4 rounded">Warning</div>
      <div class="bg-error-500 text-white p-4 rounded">Error</div>
      <div class="bg-info-500 text-white p-4 rounded">Info</div>
    </div>

    <!-- 响应式设计 -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
      <div class="bg-gray-100 dark:bg-gray-700 p-4 rounded">
        <h3 class="text-lg font-semibold mb-2">卡片 1</h3>
        <p class="text-gray-600 dark:text-gray-300">
          这是一个响应式卡片，在不同屏幕尺寸下会显示不同的列数。
        </p>
      </div>
      <div class="bg-gray-100 dark:bg-gray-700 p-4 rounded">
        <h3 class="text-lg font-semibold mb-2">卡片 2</h3>
        <p class="text-gray-600 dark:text-gray-300">移动端显示单列，平板显示双列，桌面显示三列。</p>
      </div>
      <div class="bg-gray-100 dark:bg-gray-700 p-4 rounded">
        <h3 class="text-lg font-semibold mb-2">卡片 3</h3>
        <p class="text-gray-600 dark:text-gray-300">使用 UnoCSS 的响应式前缀实现自适应布局。</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// 组件逻辑
</script>
```

### 主题切换

```vue
<template>
  <div class="theme-demo">
    <!-- 主题切换按钮 -->
    <div class="flex items-center space-x-4 p-4">
      <button
        @click="toggleTheme"
        class="btn-secondary flex items-center space-x-2"
      >
        <i class="i-carbon-sun dark:i-carbon-moon text-lg"></i>
        <span>{{ isDark ? '浅色模式' : '深色模式' }}</span>
      </button>
    </div>

    <!-- 主题演示 -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 p-4">
      <!-- 浅色主题内容 -->
      <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
        <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-4">浅色主题</h3>
        <p class="text-gray-600 dark:text-gray-300 mb-4">
          这是浅色主题下的内容，背景为白色，文字为深色。
        </p>
        <div class="space-y-2">
          <div class="bg-gray-100 dark:bg-gray-700 p-3 rounded">
            <span class="text-gray-700 dark:text-gray-300">次要内容</span>
          </div>
          <div class="bg-blue-50 dark:bg-blue-900 p-3 rounded">
            <span class="text-blue-700 dark:text-blue-300">提示内容</span>
          </div>
        </div>
      </div>

      <!-- 深色主题内容 -->
      <div class="bg-gray-800 dark:bg-gray-900 p-6 rounded-lg shadow-lg">
        <h3 class="text-xl font-bold text-white dark:text-gray-100 mb-4">深色主题</h3>
        <p class="text-gray-300 dark:text-gray-400 mb-4">
          这是深色主题下的内容，背景为深色，文字为浅色。
        </p>
        <div class="space-y-2">
          <div class="bg-gray-700 dark:bg-gray-600 p-3 rounded">
            <span class="text-gray-300 dark:text-gray-200">次要内容</span>
          </div>
          <div class="bg-blue-900 dark:bg-blue-800 p-3 rounded">
            <span class="text-blue-300 dark:text-blue-200">提示内容</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useColorStore } from '@/stores/modules/color'

const colorStore = useColorStore()
const isDark = computed(() => colorStore.getCurrentMode === 'dark')

const toggleTheme = () => {
  const newMode = isDark.value ? 'light' : 'dark'
  colorStore.setCurrentMode(newMode)
}
</script>
```

### 组件样式

```vue
<template>
  <div class="component-style-demo">
    <!-- 按钮样式 -->
    <div class="space-y-4 p-4">
      <h3 class="text-lg font-semibold">按钮样式</h3>
      <div class="flex flex-wrap gap-2">
        <button class="btn-primary">主要按钮</button>
        <button class="btn-secondary">次要按钮</button>
        <button class="btn-success">成功按钮</button>
        <button class="btn-warning">警告按钮</button>
        <button class="btn-error">错误按钮</button>
        <button class="btn-info">信息按钮</button>
      </div>
    </div>

    <!-- 表单样式 -->
    <div class="space-y-4 p-4">
      <h3 class="text-lg font-semibold">表单样式</h3>
      <form class="space-y-4 max-w-md">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            用户名
          </label>
          <input
            type="text"
            class="form-input w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
            placeholder="请输入用户名"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            邮箱
          </label>
          <input
            type="email"
            class="form-input w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
            placeholder="请输入邮箱"
          />
        </div>
        <button
          type="submit"
          class="btn-primary w-full"
        >
          提交
        </button>
      </form>
    </div>

    <!-- 卡片样式 -->
    <div class="space-y-4 p-4">
      <h3 class="text-lg font-semibold">卡片样式</h3>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div class="card">
          <div class="card-header">
            <h4 class="card-title">卡片标题</h4>
          </div>
          <div class="card-body">
            <p class="card-text">这是卡片的内容区域，可以包含各种内容。</p>
          </div>
          <div class="card-footer">
            <button class="btn-primary btn-sm">操作</button>
          </div>
        </div>

        <div class="card">
          <div class="card-header">
            <h4 class="card-title">另一个卡片</h4>
          </div>
          <div class="card-body">
            <p class="card-text">卡片支持自定义内容和操作按钮。</p>
          </div>
          <div class="card-footer">
            <button class="btn-secondary btn-sm">取消</button>
            <button class="btn-primary btn-sm">确认</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// 组件逻辑
</script>
```

## 🔧 样式配置

### 快捷方式定义

```typescript
// unocss/shortcuts/index.ts
export const shortcuts = {
  // 按钮样式
  btn: 'px-4 py-2 rounded-md font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2',
  'btn-primary': 'btn bg-primary-500 text-white hover:bg-primary-600 focus:ring-primary-500',
  'btn-secondary': 'btn bg-gray-500 text-white hover:bg-gray-600 focus:ring-gray-500',
  'btn-success': 'btn bg-success-500 text-white hover:bg-success-600 focus:ring-success-500',
  'btn-warning': 'btn bg-warning-500 text-white hover:bg-warning-600 focus:ring-warning-500',
  'btn-error': 'btn bg-error-500 text-white hover:bg-error-600 focus:ring-error-500',
  'btn-info': 'btn bg-info-500 text-white hover:bg-info-600 focus:ring-info-500',
  'btn-sm': 'px-3 py-1 text-sm',
  'btn-lg': 'px-6 py-3 text-lg',

  // 卡片样式
  card: 'bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700',
  'card-header': 'px-6 py-4 border-b border-gray-200 dark:border-gray-700',
  'card-title': 'text-lg font-semibold text-gray-900 dark:text-white',
  'card-body': 'px-6 py-4',
  'card-text': 'text-gray-600 dark:text-gray-300',
  'card-footer':
    'px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex justify-end space-x-2',

  // 表单样式
  'form-input':
    'block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white',
  'form-label': 'block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1',

  // 布局样式
  container: 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8',
  section: 'py-8',
  'section-title': 'text-2xl font-bold text-gray-900 dark:text-white mb-6',
}
```

### 自定义规则

```typescript
// unocss/rules/pixelRules.ts
export const pixelRules = [
  // 像素值规则
  [/^p-(\d+)$/, ([, d]) => ({ padding: `${d}px` })],
  [/^m-(\d+)$/, ([, d]) => ({ margin: `${d}px` })],
  [/^w-(\d+)$/, ([, d]) => ({ width: `${d}px` })],
  [/^h-(\d+)$/, ([, d]) => ({ height: `${d}px` })],

  // 字体大小规则
  [/^text-(\d+)$/, ([, d]) => ({ 'font-size': `${d}px` })],
  [/^line-height-(\d+)$/, ([, d]) => ({ 'line-height': `${d}px` })],

  // 边框规则
  [/^border-(\d+)$/, ([, d]) => ({ 'border-width': `${d}px` })],
  [/^rounded-(\d+)$/, ([, d]) => ({ 'border-radius': `${d}px` })],
]

// unocss/rules/themeRules.ts
export const themeRules = [
  // 主题颜色规则
  [/^bg-theme-(\w+)$/, ([, color]) => ({ 'background-color': `var(--${color}-color)` })],
  [/^text-theme-(\w+)$/, ([, color]) => ({ color: `var(--${color}-color)` })],
  [/^border-theme-(\w+)$/, ([, color]) => ({ 'border-color': `var(--${color}-color)` })],

  // 主题尺寸规则
  [/^w-theme-(\w+)$/, ([, size]) => ({ width: `var(--${size}-width)` })],
  [/^h-theme-(\w+)$/, ([, size]) => ({ height: `var(--${size}-height)` })],

  // 主题间距规则
  [/^p-theme-(\w+)$/, ([, space]) => ({ padding: `var(--${space}-padding)` })],
  [/^m-theme-(\w+)$/, ([, space]) => ({ margin: `var(--${space}-margin)` })],
]
```

### 主题变量

```css
/* src/assets/styles/theme.css */
:root {
  /* 颜色变量 */
  --primary-color: #1890ff;
  --success-color: #52c41a;
  --warning-color: #faad14;
  --error-color: #f5222d;
  --info-color: #1890ff;

  /* 尺寸变量 */
  --header-height: 64px;
  --sidebar-width: 200px;
  --content-height: calc(100vh - var(--header-height));

  /* 间距变量 */
  --spacing-xs: 4px;
  --spacing-sm: 8px;
  --spacing-md: 16px;
  --spacing-lg: 24px;
  --spacing-xl: 32px;

  /* 字体变量 */
  --font-size-xs: 12px;
  --font-size-sm: 14px;
  --font-size-md: 16px;
  --font-size-lg: 18px;
  --font-size-xl: 20px;
}

[data-theme='dark'] {
  --primary-color: #177ddc;
  --success-color: #49aa19;
  --warning-color: #d89614;
  --error-color: #d32029;
  --info-color: #177ddc;
}
```

## 🎯 最佳实践

### 响应式设计

```vue
<template>
  <div class="responsive-demo">
    <!-- 响应式网格 -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      <div class="bg-blue-100 p-4 rounded">项目 1</div>
      <div class="bg-green-100 p-4 rounded">项目 2</div>
      <div class="bg-yellow-100 p-4 rounded">项目 3</div>
      <div class="bg-red-100 p-4 rounded">项目 4</div>
    </div>

    <!-- 响应式文本 -->
    <div class="mt-8">
      <h1 class="text-2xl sm:text-3xl lg:text-4xl font-bold">响应式标题</h1>
      <p class="text-sm sm:text-base lg:text-lg mt-4">这段文字在不同屏幕尺寸下会显示不同的大小。</p>
    </div>

    <!-- 响应式间距 -->
    <div class="mt-8 p-2 sm:p-4 lg:p-6 bg-gray-100 rounded">
      <p>这个容器的内边距会根据屏幕尺寸变化。</p>
    </div>
  </div>
</template>
```

### 主题切换

```vue
<template>
  <div class="theme-switch-demo">
    <div class="flex items-center space-x-4 mb-6">
      <button
        @click="setTheme('light')"
        :class="['btn', currentTheme === 'light' ? 'btn-primary' : 'btn-secondary']"
      >
        浅色主题
      </button>
      <button
        @click="setTheme('dark')"
        :class="['btn', currentTheme === 'dark' ? 'btn-primary' : 'btn-secondary']"
      >
        深色主题
      </button>
    </div>

    <div class="theme-preview bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
      <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-4">主题预览</h3>
      <p class="text-gray-600 dark:text-gray-300 mb-4">
        当前使用的是 {{ currentTheme === 'light' ? '浅色' : '深色' }} 主题。
      </p>
      <div class="space-y-2">
        <div class="bg-gray-100 dark:bg-gray-700 p-3 rounded">
          <span class="text-gray-700 dark:text-gray-300">次要内容</span>
        </div>
        <div class="bg-blue-50 dark:bg-blue-900 p-3 rounded">
          <span class="text-blue-700 dark:text-blue-300">提示内容</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useColorStore } from '@/stores/modules/color'

const colorStore = useColorStore()
const currentTheme = ref(colorStore.getCurrentMode)

const setTheme = (theme: 'light' | 'dark') => {
  colorStore.setCurrentMode(theme)
  currentTheme.value = theme
}
</script>
```

### 性能优化

```typescript
// unocss/utils/optimization.ts
export const optimizationConfig = {
  // 预生成常用类名
  safelist: [
    // 布局类
    'container',
    'flex',
    'grid',
    'block',
    'inline-block',
    // 间距类
    'p-4',
    'm-4',
    'px-4',
    'py-4',
    'mx-4',
    'my-4',
    // 颜色类
    'bg-white',
    'bg-gray-100',
    'text-gray-900',
    'text-gray-600',
    // 响应式类
    'sm:grid-cols-2',
    'lg:grid-cols-3',
    'md:text-lg',
  ],

  // 排除不需要的类名
  blocklist: ['hover:bg-red-500', 'focus:bg-red-500', 'active:bg-red-500'],
}
```

## 📚 相关文档

- [组件文档](../components/README.md)
- [API 文档](../api/README.md)
- [路由文档](../router/README.md)
- [状态管理](../stores/README.md)
- [开发规范](../development/README.md)
