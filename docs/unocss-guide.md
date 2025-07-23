# UnoCSS 使用指南

## 概述

CC-Admin 使用 UnoCSS 作为原子化 CSS 引擎，提供即时编译、高性能、高度可定制的样式解决方案。完美集成了主题系统、响应式设计和 rem 适配方案。

## 🚀 核心特性

- ✅ **即时编译**: 按需生成样式，零运行时开销
- ✅ **Tailwind 兼容**: 支持 Tailwind CSS 语法
- ✅ **原子化设计**: 小而专一的工具类
- ✅ **高度定制**: 灵活的配置和预设系统
- ✅ **性能优异**: 比传统 CSS 框架更小的包体积
- ✅ **开发友好**: VS Code 插件支持，智能提示

## 🛠️ 配置详解

### UnoCSS 配置文件

```typescript
// uno.config.ts
import {
  defineConfig,
  presetUno,
  presetAttributify,
  presetIcons,
  presetTypography,
  transformerDirectives,
  transformerVariantGroup,
} from 'unocss'

export default defineConfig({
  // 🎨 预设配置
  presets: [
    presetUno(), // 默认预设（兼容 Tailwind）
    presetAttributify(), // 属性化预设
    presetIcons({
      // 图标预设
      scale: 1.2,
      warn: true,
      extraProperties: {
        display: 'inline-block',
        'vertical-align': 'middle',
      },
    }),
    presetTypography(), // 排版预设
  ],

  // 🔧 转换器
  transformers: [
    transformerDirectives(), // 支持 @apply 指令
    transformerVariantGroup(), // 支持变量组语法
  ],

  // 🎯 断点配置
  theme: {
    breakpoints: {
      xs: '375px', // 超小屏（手机）
      sm: '768px', // 小屏（平板）
      md: '1024px', // 中屏（小桌面）
      lg: '1400px', // 大屏（大桌面）
      xl: '1660px', // 超大屏（大显示器）
      xls: '1920px', // 特大屏（4K显示器）
    },
    colors: {
      // 主题色系
      primary: 'var(--primary-color)',
      secondary: 'var(--secondary-color)',
      success: 'var(--success-color)',
      warning: 'var(--warning-color)',
      error: 'var(--error-color)',

      // 背景色系
      bg: {
        100: 'var(--bg-100)',
        200: 'var(--bg-200)',
        300: 'var(--bg-300)',
        400: 'var(--bg-400)',
        500: 'var(--bg-500)',
      },

      // 文字色系
      text: {
        100: 'var(--text-100)',
        200: 'var(--text-200)',
        300: 'var(--text-300)',
        400: 'var(--text-400)',
        500: 'var(--text-500)',
      },

      // 边框色系
      border: {
        100: 'var(--border-100)',
        200: 'var(--border-200)',
        300: 'var(--border-300)',
      },
    },
    spacing: {
      // 自定义间距
      gap: 'var(--gap)',
      'gap-sm': 'var(--gap-sm)',
      'gap-lg': 'var(--gap-lg)',
      'sidebar-width': 'var(--sidebar-width)',
      'header-height': 'var(--header-height)',
    },
  },

  // 📏 自定义规则
  rules: [
    // 设计稿映射规则 - 实现精确的设计稿到像素映射 + 响应式缩放
    [/^w-(\d+)$/, ([, d]) => ({ width: `${d}px` })], // w-200 → width: 200px
    [/^h-(\d+)$/, ([, d]) => ({ height: `${d}px` })], // h-100 → height: 100px
    [/^text-(\d+)$/, ([, d]) => ({ 'font-size': `${d}px` })], // text-16 → font-size: 16px
    [/^p-(\d+)$/, ([, d]) => ({ padding: `${d}px` })], // p-20 → padding: 20px
    [/^m-(\d+)$/, ([, d]) => ({ margin: `${d}px` })], // m-12 → margin: 12px
    [/^gap-(\d+)$/, ([, d]) => ({ gap: `${d}px` })], // gap-16 → gap: 16px

    // 渐变背景
    [
      /^bg-gradient-(.+)$/,
      ([, c]) => {
        const gradients: Record<string, string> = {
          primary:
            'linear-gradient(135deg, var(--primary-color) 0%, var(--primary-color-light) 100%)',
          success:
            'linear-gradient(135deg, var(--success-color) 0%, var(--success-color-light) 100%)',
          warning:
            'linear-gradient(135deg, var(--warning-color) 0%, var(--warning-color-light) 100%)',
          error: 'linear-gradient(135deg, var(--error-color) 0%, var(--error-color-light) 100%)',
        }
        return { background: gradients[c] }
      },
    ],

    // 玻璃效果
    [
      'glass',
      {
        'backdrop-filter': 'blur(10px)',
        background: 'rgba(255, 255, 255, 0.1)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
      },
    ],

    // 阴影效果
    [
      'shadow-glass',
      {
        'box-shadow': '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
      },
    ],
  ],

  // 🔀 快捷方式
  shortcuts: [
    // 布局快捷方式
    ['flex-center', 'flex justify-center items-center'],
    ['flex-between', 'flex justify-between items-center'],
    ['flex-around', 'flex justify-around items-center'],
    ['flex-col-center', 'flex flex-col justify-center items-center'],
    ['absolute-center', 'absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'],

    // 按钮快捷方式
    ['btn-base', 'px-4 py-2 rounded cursor-pointer transition-all duration-200 font-medium'],
    ['btn-primary', 'btn-base bg-primary text-white hover:bg-primary-600 active:bg-primary-700'],
    [
      'btn-secondary',
      'btn-base bg-secondary text-white hover:bg-secondary-600 active:bg-secondary-700',
    ],
    [
      'btn-outline-primary',
      'btn-base border border-primary text-primary hover:bg-primary hover:text-white',
    ],
    ['btn-ghost', 'btn-base hover:bg-bg-200 text-text-100'],

    // 卡片快捷方式
    ['card', 'bg-bg-100 rounded-lg shadow-sm border border-border-200'],
    ['card-hover', 'card hover:shadow-md transition-shadow duration-200'],

    // 输入框快捷方式
    [
      'input-base',
      'px-3 py-2 border border-border-200 rounded focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent',
    ],
    ['input-error', 'input-base border-error focus:ring-error'],

    // 文本快捷方式
    ['text-title', 'text-18 font-bold text-text-100'],
    ['text-subtitle', 'text-16 font-medium text-text-200'],
    ['text-body', 'text-14 text-text-300'],
    ['text-caption', 'text-12 text-text-400'],

    // 状态快捷方式
    ['status-success', 'bg-success-100 text-success-700 px-2 py-1 rounded text-12'],
    ['status-warning', 'bg-warning-100 text-warning-700 px-2 py-1 rounded text-12'],
    ['status-error', 'bg-error-100 text-error-700 px-2 py-1 rounded text-12'],
    ['status-info', 'bg-blue-100 text-blue-700 px-2 py-1 rounded text-12'],
  ],

  // 🎨 变体配置
  variants: [
    // 深色模式变体
    matcher => {
      if (!matcher.startsWith('dark:')) return matcher
      return {
        matcher: matcher.slice(5),
        selector: s => `.dark ${s}`,
      }
    },
  ],

  // 📁 内容扫描
  content: {
    filesystem: ['src/**/*.{vue,js,ts,jsx,tsx}'],
  },

  // 🔍 提取器配置
  extractors: [
    {
      name: 'vue-sfc',
      extractor: (code: string) => {
        // 从 Vue SFC 中提取类名
        const classRegex = /class="([^"]*?)"/g
        const classes = []
        let match
        while ((match = classRegex.exec(code)) !== null) {
          classes.push(...match[1].split(/\s+/))
        }
        return classes
      },
    },
  ],
})
```

## 🎨 主题集成

### CSS 变量集成

```css
/* src/assets/styles/variables.css */
:root {
  /* 主题色系 */
  --primary-color: #1890ff;
  --primary-color-light: #40a9ff;
  --secondary-color: #722ed1;
  --success-color: #52c41a;
  --warning-color: #faad14;
  --error-color: #f5222d;

  /* 背景色系 */
  --bg-100: #ffffff;
  --bg-200: #fafafa;
  --bg-300: #f5f5f5;
  --bg-400: #f0f0f0;
  --bg-500: #d9d9d9;

  /* 文字色系 */
  --text-100: #000000;
  --text-200: #262626;
  --text-300: #595959;
  --text-400: #8c8c8c;
  --text-500: #bfbfbf;

  /* 边框色系 */
  --border-100: #f0f0f0;
  --border-200: #d9d9d9;
  --border-300: #bfbfbf;

  /* 布局变量 */
  --sidebar-width: 240px;
  --sidebar-collapsed-width: 64px;
  --header-height: 64px;
  --gap: 16px;
  --gap-sm: 8px;
  --gap-lg: 24px;
}

/* 深色模式 */
.dark {
  --bg-100: #141414;
  --bg-200: #1f1f1f;
  --bg-300: #303030;
  --bg-400: #434343;
  --bg-500: #595959;

  --text-100: #ffffff;
  --text-200: #fafafa;
  --text-300: #d9d9d9;
  --text-400: #bfbfbf;
  --text-500: #8c8c8c;

  --border-100: #303030;
  --border-200: #434343;
  --border-300: #595959;
}
```

### 与 Pinia Store 集成

```vue
<!-- 在组件中使用主题 -->
<template>
  <div :class="themeClasses">
    <div class="card p-6">
      <h1 class="text-title mb-4">主题切换示例</h1>
      <div class="flex gap-4">
        <button
          class="btn-primary"
          @click="colorStore.toggleTheme()"
        >
          切换主题
        </button>
        <button
          class="btn-outline-primary"
          @click="colorStore.setPrimaryColor('#52c41a')"
        >
          更改主题色
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useColorStore } from '@/stores/modules/color'

const colorStore = useColorStore()

const themeClasses = computed(() => ({
  dark: colorStore.isDark,
  'bg-bg-200': true,
  'min-h-screen': true,
  'transition-colors': true,
  'duration-300': true,
}))
</script>
```

## 📱 响应式设计

### 断点系统

```html
<!-- 响应式布局示例 -->
<div
  class="
  grid
  grid-cols-1
  sm:grid-cols-2
  md:grid-cols-3
  lg:grid-cols-4
  xl:grid-cols-5
  gap-4
"
>
  <div class="card p-4">卡片 1</div>
  <div class="card p-4">卡片 2</div>
  <div class="card p-4">卡片 3</div>
</div>

<!-- 响应式文字大小 -->
<h1
  class="
  text-20
  sm:text-24
  md:text-28
  lg:text-32
  xl:text-36
  font-bold
"
>
  响应式标题
</h1>

<!-- 响应式间距 -->
<div
  class="
  p-4
  sm:p-6
  md:p-8
  lg:p-10
  xl:p-12
"
>
  响应式内边距
</div>
```

### 移动端优先设计

```html
<!-- 移动端优先的响应式设计 -->
<div
  class="
  flex-col-center
  sm:flex-row
  sm:justify-between
  gap-4
  sm:gap-6
"
>
  <div class="w-full sm:w-auto">
    <input
      class="input-base w-full"
      placeholder="搜索..."
    />
  </div>
  <div class="flex gap-2 w-full sm:w-auto">
    <button class="btn-primary flex-1 sm:flex-none">新增</button>
    <button class="btn-outline-primary flex-1 sm:flex-none">导出</button>
  </div>
</div>
```

## 🎨 组件样式模式

### 1. 布局组件

```vue
<!-- 管理布局组件 -->
<template>
  <div class="admin-layout min-h-screen bg-bg-200">
    <!-- 侧边栏 -->
    <aside
      class="
      fixed left-0 top-0
      w-sidebar-width h-full
      bg-bg-100 border-r border-border-200
      transition-all duration-300
    "
    >
      <div class="p-4">
        <h1 class="text-title">CC-Admin</h1>
      </div>
      <nav class="px-2">
        <a
          v-for="item in menuItems"
          :key="item.key"
          class="
            flex items-center gap-3
            px-3 py-2 mb-1
            rounded-lg text-text-300
            hover:bg-bg-200 hover:text-text-100
            transition-colors duration-200
          "
          :class="{ 'bg-primary text-white': item.active }"
        >
          <i :class="item.icon"></i>
          <span>{{ item.title }}</span>
        </a>
      </nav>
    </aside>

    <!-- 主内容区 -->
    <main
      class="
      ml-sidebar-width
      min-h-screen
      transition-all duration-300
    "
    >
      <!-- 头部 -->
      <header
        class="
        h-header-height
        bg-bg-100 border-b border-border-200
        flex-between px-6
      "
      >
        <div class="flex items-center gap-4">
          <button class="btn-ghost">
            <i class="i-mdi:menu"></i>
          </button>
          <h2 class="text-subtitle">仪表盘</h2>
        </div>
        <div class="flex items-center gap-3">
          <button class="btn-ghost">
            <i class="i-mdi:bell"></i>
          </button>
          <div class="w-8 h-8 bg-primary rounded-full"></div>
        </div>
      </header>

      <!-- 内容区域 -->
      <div class="p-6">
        <slot />
      </div>
    </main>
  </div>
</template>
```

### 2. 表单组件

```vue
<!-- 表单组件样式 -->
<template>
  <form class="space-y-6">
    <!-- 输入组 -->
    <div class="form-group">
      <label class="block text-14 font-medium text-text-200 mb-2"> 用户名 </label>
      <input
        class="input-base w-full"
        :class="{ 'input-error': errors.username }"
        v-model="form.username"
        placeholder="请输入用户名"
      />
      <span
        v-if="errors.username"
        class="text-12 text-error mt-1 block"
      >
        {{ errors.username }}
      </span>
    </div>

    <!-- 选择框组 -->
    <div class="form-group">
      <label class="block text-14 font-medium text-text-200 mb-2"> 角色 </label>
      <select class="input-base w-full">
        <option>管理员</option>
        <option>编辑器</option>
        <option>查看者</option>
      </select>
    </div>

    <!-- 开关组 -->
    <div class="form-group">
      <label class="flex items-center gap-3">
        <input
          type="checkbox"
          class="form-checkbox"
        />
        <span class="text-14 text-text-200">启用账户</span>
      </label>
    </div>

    <!-- 按钮组 -->
    <div class="flex gap-3 pt-4">
      <button
        type="submit"
        class="btn-primary"
      >
        保存
      </button>
      <button
        type="button"
        class="btn-outline-primary"
      >
        取消
      </button>
    </div>
  </form>
</template>

<style scoped>
.form-group {
  @apply space-y-2;
}

.form-checkbox {
  @apply w-4 h-4 text-primary bg-bg-100 border-border-300 rounded focus:ring-primary;
}
</style>
```

### 3. 数据表格

```vue
<!-- 数据表格组件 -->
<template>
  <div class="table-container">
    <!-- 表格工具栏 -->
    <div class="flex-between mb-4">
      <div class="flex items-center gap-3">
        <input
          class="input-base w-64"
          placeholder="搜索用户..."
          v-model="searchKeyword"
        />
        <button class="btn-primary">
          <i class="i-mdi:plus mr-2"></i>
          新增用户
        </button>
      </div>
      <div class="flex items-center gap-2">
        <button class="btn-ghost">
          <i class="i-mdi:refresh"></i>
        </button>
        <button class="btn-ghost">
          <i class="i-mdi:download"></i>
        </button>
      </div>
    </div>

    <!-- 表格 -->
    <div class="card overflow-hidden">
      <table class="w-full">
        <thead class="bg-bg-200">
          <tr>
            <th class="table-th">
              <input
                type="checkbox"
                class="form-checkbox"
              />
            </th>
            <th class="table-th text-left">用户名</th>
            <th class="table-th text-left">邮箱</th>
            <th class="table-th text-left">角色</th>
            <th class="table-th text-left">状态</th>
            <th class="table-th text-center">操作</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="user in userList"
            :key="user.id"
            class="border-b border-border-200 hover:bg-bg-100 transition-colors"
          >
            <td class="table-td">
              <input
                type="checkbox"
                class="form-checkbox"
              />
            </td>
            <td class="table-td">
              <div class="flex items-center gap-3">
                <img
                  :src="user.avatar"
                  class="w-8 h-8 rounded-full bg-bg-300"
                />
                <span class="font-medium">{{ user.username }}</span>
              </div>
            </td>
            <td class="table-td text-text-300">{{ user.email }}</td>
            <td class="table-td">
              <span class="status-info">{{ user.role }}</span>
            </td>
            <td class="table-td">
              <span
                class="px-2 py-1 rounded text-12 font-medium"
                :class="getStatusClass(user.status)"
              >
                {{ getStatusText(user.status) }}
              </span>
            </td>
            <td class="table-td text-center">
              <div class="flex items-center justify-center gap-2">
                <button class="btn-ghost p-1">
                  <i class="i-mdi:pencil"></i>
                </button>
                <button class="btn-ghost p-1 text-error">
                  <i class="i-mdi:delete"></i>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- 分页 -->
    <div class="flex-between mt-4">
      <span class="text-14 text-text-400"> 共 {{ total }} 条记录 </span>
      <div class="flex items-center gap-2">
        <button class="btn-ghost px-3 py-1">上一页</button>
        <span class="px-3 py-1 bg-primary text-white rounded">1</span>
        <button class="btn-ghost px-3 py-1">2</button>
        <button class="btn-ghost px-3 py-1">3</button>
        <button class="btn-ghost px-3 py-1">下一页</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.table-th {
  @apply px-4 py-3 text-14 font-medium text-text-200;
}

.table-td {
  @apply px-4 py-3 text-14;
}
</style>
```

## 🎯 自定义工具类

### 设计稿精确映射

```html
<!-- 精确像素映射 + 响应式缩放 -->
<div class="w-300 h-200 p-24">
  <!-- 在 1920px 屏幕显示 300×200px，其他屏幕按比例缩放 -->
  <h2 class="text-18 font-bold mb-12">卡片标题</h2>
  <p class="text-14 text-text-300">卡片内容</p>
  <button class="w-120 h-36 text-16 bg-primary text-white rounded mt-16">按钮</button>
</div>

<!-- 混合使用：设计稿映射 + UnoCSS 工具类 -->
<div class="w-400 flex flex-col justify-between p-20">
  <div class="text-20 font-bold">主标题</div>
  <div class="flex gap-12">
    <button class="btn-primary w-80 h-32">确定</button>
    <button class="btn-outline-primary w-80 h-32">取消</button>
  </div>
</div>
```

### 玻璃效果和特殊样式

```html
<!-- 玻璃效果卡片 -->
<div class="glass p-6 rounded-xl shadow-glass">
  <h3 class="text-title text-white mb-4">玻璃效果卡片</h3>
  <p class="text-white opacity-80">这是一个具有玻璃效果的卡片组件</p>
</div>

<!-- 渐变背景 -->
<div class="bg-gradient-primary p-6 rounded-xl text-white">
  <h3 class="text-title mb-4">渐变背景</h3>
  <p>主题色渐变背景效果</p>
</div>

<!-- 状态标签 -->
<div class="flex gap-2">
  <span class="status-success">成功</span>
  <span class="status-warning">警告</span>
  <span class="status-error">错误</span>
  <span class="status-info">信息</span>
</div>
```

## 🔧 最佳实践

### 1. 组件样式组织

```vue
<template>
  <div class="user-card">
    <!-- 使用语义化的类名组合 -->
    <div class="user-card__header">
      <img
        class="user-card__avatar"
        :src="user.avatar"
        :alt="user.name"
      />
      <div class="user-card__info">
        <h3 class="user-card__name">{{ user.name }}</h3>
        <span class="user-card__role">{{ user.role }}</span>
      </div>
    </div>

    <div class="user-card__content">
      <p class="user-card__description">{{ user.description }}</p>
    </div>

    <div class="user-card__actions">
      <button class="btn-primary">编辑</button>
      <button class="btn-outline-primary">查看</button>
    </div>
  </div>
</template>

<style scoped>
.user-card {
  @apply card p-6 space-y-4;
}

.user-card__header {
  @apply flex items-center gap-4;
}

.user-card__avatar {
  @apply w-12 h-12 rounded-full bg-bg-300;
}

.user-card__info {
  @apply flex-1;
}

.user-card__name {
  @apply text-title;
}

.user-card__role {
  @apply status-info;
}

.user-card__description {
  @apply text-body leading-relaxed;
}

.user-card__actions {
  @apply flex gap-2 pt-2;
}
</style>
```

### 2. 响应式设计模式

```html
<!-- 响应式网格布局 -->
<div class="responsive-grid">
  <div class="grid-item">项目 1</div>
  <div class="grid-item">项目 2</div>
  <div class="grid-item">项目 3</div>
  <div class="grid-item">项目 4</div>
</div>

<style scoped>
  .responsive-grid {
    @apply grid gap-4
    grid-cols-1
    sm:grid-cols-2
    lg:grid-cols-3
    xl:grid-cols-4;
  }

  .grid-item {
    @apply card p-4
    min-h-32
    flex-center
    text-subtitle;
  }
</style>

<!-- 响应式导航 -->
<nav class="responsive-nav">
  <div class="nav-brand">
    <h1 class="text-title">Logo</h1>
  </div>

  <div class="nav-menu">
    <a
      href="#"
      class="nav-item"
      >首页</a
    >
    <a
      href="#"
      class="nav-item"
      >产品</a
    >
    <a
      href="#"
      class="nav-item"
      >关于</a
    >
    <a
      href="#"
      class="nav-item"
      >联系</a
    >
  </div>

  <button class="nav-toggle md:hidden">
    <i class="i-mdi:menu"></i>
  </button>
</nav>

<style scoped>
  .responsive-nav {
    @apply flex items-center justify-between
    p-4 bg-bg-100 border-b border-border-200;
  }

  .nav-menu {
    @apply hidden md:flex
    items-center gap-6;
  }

  .nav-item {
    @apply text-text-300 hover:text-text-100
    transition-colors duration-200;
  }

  .nav-toggle {
    @apply btn-ghost p-2;
  }
</style>
```

### 3. 主题切换支持

```vue
<template>
  <div class="theme-aware-component">
    <div class="content-card">
      <h2 class="card-title">主题感知组件</h2>
      <p class="card-description">这个组件会根据当前主题自动调整样式</p>
      <div class="action-buttons">
        <button class="btn-primary">主要操作</button>
        <button class="btn-secondary">次要操作</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.theme-aware-component {
  @apply p-6 bg-bg-200 min-h-screen transition-colors duration-300;
}

.content-card {
  @apply card p-8 max-w-md mx-auto
    hover:shadow-lg transition-all duration-300;
}

.card-title {
  @apply text-title mb-4
    text-text-100;
}

.card-description {
  @apply text-body mb-6
    text-text-300;
}

.action-buttons {
  @apply flex gap-3;
}

/* 深色模式特殊处理 */
.dark .content-card {
  @apply shadow-2xl;
}
</style>
```

### 4. 动画和过渡

```html
<!-- 过渡动画 -->
<div class="animated-list">
  <div
    v-for="item in items"
    :key="item.id"
    class="list-item"
  >
    {{ item.name }}
  </div>
</div>

<style scoped>
  .animated-list {
    @apply space-y-2;
  }

  .list-item {
    @apply card p-4
    transform transition-all duration-300 ease-out
    hover:scale-105 hover:shadow-lg
    active:scale-95;
  }

  /* 入场动画 */
  .list-item {
    animation: slideInUp 0.3s ease-out;
  }

  @keyframes slideInUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
</style>

<!-- 加载状态 -->
<div class="loading-container">
  <div class="loading-spinner"></div>
  <span class="loading-text">加载中...</span>
</div>

<style scoped>
  .loading-container {
    @apply flex-center gap-3 p-8;
  }

  .loading-spinner {
    @apply w-6 h-6 border-2 border-border-300 border-t-primary
    rounded-full animate-spin;
  }

  .loading-text {
    @apply text-body text-text-400;
  }
</style>
```

## 🚀 性能优化

### 1. 按需生成

```typescript
// vite.config.ts
import { defineConfig } from 'vite'
import UnoCSS from 'unocss/vite'

export default defineConfig({
  plugins: [
    UnoCSS({
      // 只扫描使用的样式
      include: ['src/**/*.vue', 'src/**/*.ts'],
      // 排除不需要的文件
      exclude: ['node_modules/**/*'],
    }),
  ],
})
```

### 2. 样式优化

```css
/* 避免复杂的选择器 */
/* ❌ 不推荐 */
.card .header .title .text {
  @apply text-lg font-bold;
}

/* ✅ 推荐：使用原子化类名 */
<h3 class="text-lg font-bold">标题</h3>

/* 合理使用 @apply */
.custom-button {
  @apply btn-base bg-blue-500 text-white hover:bg-blue-600;
  /* 只在必要时添加自定义样式 */
  box-shadow: 0 4px 6px rgba(59, 130, 246, 0.1);
}
```

### 3. 开发体验优化

```json
// .vscode/settings.json
{
  "unocss.root": "uno.config.ts",
  "editor.quickSuggestions": {
    "strings": true
  },
  "editor.autoClosingQuotes": "always"
}
```

## 📋 UnoCSS 类名速查

### 布局类名

| 类名              | CSS                           | 说明         |
| ----------------- | ----------------------------- | ------------ |
| `flex`            | `display: flex`               | 弹性布局     |
| `flex-center`     | `justify-center items-center` | 居中对齐     |
| `grid`            | `display: grid`               | 网格布局     |
| `absolute-center` | `top/left: 50%; transform`    | 绝对定位居中 |

### 间距类名

| 类名    | CSS             | 说明         |
| ------- | --------------- | ------------ |
| `p-4`   | `padding: 1rem` | 内边距       |
| `m-4`   | `margin: 1rem`  | 外边距       |
| `gap-4` | `gap: 1rem`     | 间距         |
| `p-20`  | `padding: 20px` | 精确像素间距 |

### 颜色类名

| 类名                | CSS                   | 说明       |
| ------------------- | --------------------- | ---------- |
| `bg-primary`        | `background: var(--)` | 主题背景色 |
| `text-text-100`     | `color: var(--text)`  | 主要文字色 |
| `border-border-200` | `border-color: var()` | 边框色     |

### 响应式类名

| 类名             | 断点    | 说明       |
| ---------------- | ------- | ---------- |
| `sm:text-lg`     | ≥768px  | 小屏及以上 |
| `md:grid-cols-3` | ≥1024px | 中屏及以上 |
| `lg:p-8`         | ≥1400px | 大屏及以上 |

## 🎯 总结

CC-Admin 的 UnoCSS 配置具有以下特点：

- ✅ **即时编译**: 按需生成，零运行时开销
- ✅ **主题集成**: 完美集成主题系统和 CSS 变量
- ✅ **响应式设计**: 统一的断点系统和响应式工具
- ✅ **设计稿映射**: 精确的像素映射 + 响应式缩放
- ✅ **丰富工具类**: 布局、组件、状态等常用样式
- ✅ **开发友好**: VS Code 插件支持和智能提示
- ✅ **性能优化**: 按需生成和构建优化
- ✅ **高度定制**: 灵活的配置和扩展能力

通过 UnoCSS 的强大功能和精心的配置，CC-Admin 实现了高效、可维护、可扩展的样式系统！🚀
