# 主题变量系统使用指南

## 📋 概述

CC-Admin 采用了先进的动态主题变量系统，现已重构为独立的颜色管理(`color.ts`)和尺寸管理(`size.ts`)模块，提供更加清晰和易于维护的主题配置。

## 🎨 颜色配置 (Color Store)

### 基础概念

颜色配置通过 `useColorStore` 管理，支持：

- 🌓 三种主题模式（亮色/暗色/自动跟随系统）
- 🎯 5种功能色系（Primary、Success、Warning、Error、Info）
- 🎨 可自定义主题色和背景色
- 🔄 动态CSS变量实时更新
- 📱 响应式系统主题跟随

### 主题模式

```typescript
import { useColorStore } from '@/stores/modules/color'

const colorStore = useColorStore()

// 设置主题模式
colorStore.setMode('light') // 亮色主题
colorStore.setMode('dark') // 暗色主题
colorStore.setMode('auto') // 自动跟随系统

// 快速切换 light/dark
colorStore.toggleMode()

// 检查当前模式
console.log(colorStore.getMode) // 获取当前实际主题模式
console.log(colorStore.isDark) // 是否为暗色
console.log(colorStore.isLight) // 是否为亮色
console.log(colorStore.isAuto) // 是否为自动模式
```

### 主题色和背景色配置

```typescript
// 设置主题色
colorStore.setTheme('蓝色主题') // 从预设选项中选择
colorStore.setTheme('绿色主题')
colorStore.setTheme('红色主题')

// 设置背景色
colorStore.setBackground('白色背景')
colorStore.setBackground('深黑色背景')

// 获取可用选项
console.log(colorStore.getThemeOptions) // 主题色选项列表
console.log(colorStore.getBackgroundOptions) // 背景色选项列表
```

### 获取颜色值

```typescript
// 功能色获取
const primaryColor = colorStore.getPrimary
const primaryHover = colorStore.getPrimaryHover
const successColor = colorStore.getSuccess
const errorColor = colorStore.getError

// 主题相关颜色
const themeColor = colorStore.getTheme
const backgroundColor = colorStore.getBackground
const textColor = colorStore.getText
```

### CSS变量使用

```css
/* 功能色变量 */
.btn-primary {
  background-color: var(--primary-color);
  border-color: var(--primary-color);
}

.btn-primary:hover {
  background-color: var(--primary-hover-color);
}

.btn-success {
  background-color: var(--success-color);
}

/* 主题相关变量 */
.container {
  background-color: var(--background-color);
  color: var(--text-color);
}

.card {
  background-color: var(--background-highlight-color);
}
```

## 📏 尺寸配置 (Size Store)

### 基础概念

尺寸配置通过 `useSizeStore` 管理，支持：

- 📐 三种尺寸预设（紧凑、舒适、宽松）
- 🔧 完整的布局尺寸管理
- 📊 间距系统管理
- 🎯 动态尺寸变量

### 尺寸模式

```typescript
import { useSizeStore, type SizeOption } from '@/stores/modules/size'

const sizeStore = useSizeStore()

// 设置尺寸模式
sizeStore.setSize('compact') // 紧凑尺寸
sizeStore.setSize('comfortable') // 舒适尺寸（默认）
sizeStore.setSize('loose') // 宽松尺寸

// 检查当前模式
console.log(sizeStore.getSize) // 获取当前尺寸模式
console.log(sizeStore.isCompact) // 是否为紧凑模式
console.log(sizeStore.isComfortable) // 是否为舒适模式
console.log(sizeStore.isLoose) // 是否为宽松模式
```

### 布局尺寸获取

```typescript
// 获取布局尺寸
const sidebarWidth = sizeStore.getSidebarWidth // 侧边栏宽度
const headerHeight = sizeStore.getHeaderHeight // 头部高度
const footerHeight = sizeStore.getFooterHeight // 底部高度
const breadcrumbHeight = sizeStore.getBreadcrumbHeight // 面包屑高度
const tabsHeight = sizeStore.getTabsHeight // 标签页高度
```

### 间距系统

```typescript
// 设置间距大小
sizeStore.setGap('xs') // 超小间距
sizeStore.setGap('sm') // 小间距
sizeStore.setGap('md') // 中等间距（默认）
sizeStore.setGap('lg') // 大间距
sizeStore.setGap('xl') // 超大间距

// 获取间距信息
console.log(sizeStore.getGap) // 当前间距大小标识
console.log(sizeStore.getGapValue) // 当前间距的具体像素值
console.log(sizeStore.getGapOptions) // 可用间距选项
```

### 批量设置方法

```typescript
// 批量更新布局尺寸
sizeStore.updateLayout({
  sidebarWidth: '220px',
  headerHeight: '65px',
})

// 重置为默认
sizeStore.resetToDefault()
sizeStore.resetSizes()
```

### CSS变量使用

```css
/* 布局尺寸变量 */
.sidebar {
  width: var(--sidebar-width);
}

.sidebar.collapsed {
  width: var(--sidebar-collapsed-width);
}

.header {
  height: var(--header-height);
}

/* 间距变量 */
.container {
  padding: var(--gap); /* 当前激活的间距值 */
  gap: var(--gap);
}

/* 使用具体间距大小 */
.small-padding {
  padding: var(--gap-sm); /* 小间距 */
}

.large-margin {
  margin: var(--gap-lg); /* 大间距 */
}
```

## 🎯 实际应用示例

### Vue 组件中的完整使用

```vue
<template>
  <div class="theme-demo">
    <!-- 主题控制区域 -->
    <div class="theme-controls">
      <!-- 主题模式切换 -->
      <div class="control-group">
        <label>主题模式：</label>
        <select :value="colorStore.mode" @change="handleModeChange">
          <option
            v-for="option in colorStore.getModeOptions"
            :key="option.value"
            :value="option.value"
          >
            {{ option.label }}
          </option>
        </select>
        <button @click="colorStore.toggleMode()">
          {{ colorStore.isDark ? '🌙' : '☀️' }} 快速切换
        </button>
      </div>

      <!-- 尺寸模式切换 -->
      <div class="control-group">
        <label>尺寸模式：</label>
        <select :value="sizeStore.getSize" @change="handleSizeChange">
          <option
            v-for="option in sizeStore.getSizeOptions"
            :key="option.value"
            :value="option.value"
          >
            {{ option.label }}
          </option>
        </select>
      </div>

      <!-- 主题色选择 -->
      <div class="control-group">
        <label>主题色：</label>
        <select @change="handleThemeChange">
          <option
            v-for="theme in colorStore.getThemeOptions"
            :key="theme.label"
            :value="theme.label"
          >
            {{ theme.label }}
          </option>
        </select>
      </div>

      <!-- 间距大小选择 -->
      <div class="control-group">
        <label>间距大小：</label>
        <select :value="sizeStore.getGap" @change="handleGapChange">
          <option
            v-for="gap in sizeStore.getGapOptions"
            :key="gap.label"
            :value="gap.label"
          >
            {{ gap.label.toUpperCase() }} ({{ gap.value }})
          </option>
        </select>
      </div>
    </div>

    <!-- 功能色演示 -->
    <div class="color-demo">
      <button class="btn btn-primary">主要按钮</button>
      <button class="btn btn-success">成功按钮</button>
      <button class="btn btn-warning">警告按钮</button>
      <button class="btn btn-error">错误按钮</button>
      <button class="btn btn-info">信息按钮</button>
    </div>

    <!-- 尺寸演示 */
    <div class="size-demo">
      <div class="demo-card">
        <h3>当前配置信息</h3>
        <p><strong>主题模式：</strong>{{ colorStore.getMode }}</p>
        <p><strong>尺寸模式：</strong>{{ sizeStore.getSize }}</p>
        <p><strong>间距大小：</strong>{{ sizeStore.getGap }} ({{ sizeStore.getGapValue }})</p>
        <p><strong>侧边栏宽度：</strong>{{ sizeStore.getSidebarWidth }}</p>
        <p><strong>头部高度：</strong>{{ sizeStore.getHeaderHeight }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useColorStore } from '@/stores/modules/color'
import { useSizeStore, type SizeOption } from '@/stores/modules/size'

const colorStore = useColorStore()
const sizeStore = useSizeStore()

// 主题模式切换
const handleModeChange = (event: Event) => {
  const target = event.target as HTMLSelectElement
  colorStore.setMode(target.value as any)
}

// 尺寸模式切换
const handleSizeChange = (event: Event) => {
  const target = event.target as HTMLSelectElement
  sizeStore.setSize(target.value as SizeOption)
}

// 主题色切换
const handleThemeChange = (event: Event) => {
  const target = event.target as HTMLSelectElement
  colorStore.setTheme(target.value)
}

// 间距大小切换
const handleGapChange = (event: Event) => {
  const target = event.target as HTMLSelectElement
  sizeStore.setGap(target.value as any)
}
</script>

<style scoped>
.theme-demo {
  padding: var(--gap);
  background-color: var(--background-color);
  color: var(--text-color);
  border-radius: 8px;
  border: 1px solid var(--background-highlight-color);
}

.theme-controls {
  display: flex;
  flex-direction: column;
  gap: var(--gap);
  margin-bottom: var(--gap);
  padding: var(--gap);
  background-color: var(--background-highlight-color);
  border-radius: 6px;
}

.control-group {
  display: flex;
  align-items: center;
  gap: var(--gap-sm);
}

.control-group label {
  min-width: 80px;
  font-weight: 500;
}

.color-demo {
  display: flex;
  gap: var(--gap);
  margin-bottom: var(--gap);
  flex-wrap: wrap;
}

.btn {
  padding: var(--gap-sm) var(--gap);
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s ease;
}

.btn-primary {
  background-color: var(--primary-color);
  color: var(--theme-text-color);
}

.btn-primary:hover {
  background-color: var(--primary-hover-color);
}

.btn-success {
  background-color: var(--success-color);
  color: white;
}

.btn-success:hover {
  background-color: var(--success-hover-color);
}

.btn-warning {
  background-color: var(--warning-color);
  color: white;
}

.btn-warning:hover {
  background-color: var(--warning-hover-color);
}

.btn-error {
  background-color: var(--error-color);
  color: white;
}

.btn-error:hover {
  background-color: var(--error-hover-color);
}

.btn-info {
  background-color: var(--info-color);
  color: white;
}

.btn-info:hover {
  background-color: var(--info-hover-color);
}

.demo-card {
  padding: var(--gap);
  background-color: var(--background-highlight-color);
  border-radius: 6px;
  border: 1px solid var(--text-muted-color);
}

.demo-card h3 {
  margin: 0 0 var(--gap-sm) 0;
  color: var(--theme-color);
}

.demo-card p {
  margin: var(--gap-xs) 0;
  color: var(--text-muted-color);
}
</style>
```

## 🔧 高级用法

### 1. 监听主题变化

```typescript
import { watch } from 'vue'

// 监听颜色模式变化
watch(
  () => colorStore.getMode,
  newMode => {
    console.log('主题模式已切换为:', newMode)
    // 执行相关逻辑
  }
)

// 监听尺寸模式变化
watch(
  () => sizeStore.getSize,
  newSize => {
    console.log('尺寸模式已切换为:', newSize)
    // 执行相关逻辑
  }
)
```

### 2. 计算属性优化

```typescript
import { computed } from 'vue'

// 缓存主题相关计算
const themeInfo = computed(() => ({
  mode: colorStore.getMode,
  isDark: colorStore.isDark,
  primary: colorStore.getPrimary,
  background: colorStore.getBackground,
}))

// 缓存尺寸相关计算
const sizeInfo = computed(() => ({
  size: sizeStore.getSize,
  gap: sizeStore.getGapValue,
  sidebarWidth: sizeStore.getSidebarWidth,
}))
```

### 3. 在 Pinia 外部使用

```typescript
import { useColorStoreWithOut } from '@/stores/modules/color'
import { useSizeStoreWithOut } from '@/stores/modules/size'

// 在非组件环境中使用
const colorStore = useColorStoreWithOut()
const sizeStore = useSizeStoreWithOut()

colorStore.setMode('dark')
sizeStore.setSize('loose')
```

## 📊 可用的CSS变量列表

### 颜色相关变量

```css
/* 功能色 */
--primary-color                 /* 主色 */
--primary-hover-color          /* 主色悬停 */
--primary-active-color         /* 主色激活 */
--primary-disabled-color       /* 主色禁用 */
--primary-light-color          /* 主色浅色背景 */

--success-color                /* 成功色 */
--success-hover-color          /* 成功色悬停 */
/* ... 其他功能色类似 ... */

--warning-color                /* 警告色 */
--error-color                  /* 错误色 */
--info-color                   /* 信息色 */

/* 主题色 */
--theme-color                  /* 主题颜色 */
--theme-text-color             /* 主题文字颜色 */

/* 基础色 */
--text-color                   /* 文字颜色 */
--text-muted-color             /* 弱化文字颜色 */
--background-color             /* 背景颜色 */
--background-highlight-color   /* 高亮背景颜色 */
```

### 尺寸相关变量

```css
/* 布局尺寸 */
--sidebar-width                /* 侧边栏宽度 */
--sidebar-collapsed-width      /* 侧边栏折叠宽度 */
--header-height                /* 头部高度 */
--breadcrumb-height            /* 面包屑高度 */
--footer-height                /* 底部高度 */
--tabs-height                  /* 标签页高度 */

/* 间距系统 */
--gap                          /* 当前激活的间距值 */
--gap-size                     /* 当前间距大小标识 */
--gap-xs                       /* 超小间距 */
--gap-sm                       /* 小间距 */
--gap-md                       /* 中等间距 */
--gap-lg                       /* 大间距 */
--gap-xl                       /* 超大间距 */
```

## 🚀 最佳实践

### 1. 模块化导入

```typescript
// ✅ 推荐：按需导入
import { useColorStore } from '@/stores/modules/color'
import { useSizeStore, type SizeOption } from '@/stores/modules/size'

// ❌ 避免：导入整个 stores
import stores from '@/stores'
```

### 2. 性能优化

```typescript
// ✅ 使用计算属性缓存
const themeStyles = computed(() => ({
  '--custom-primary': colorStore.getPrimary,
  '--custom-gap': sizeStore.getGapValue,
}))

// ❌ 避免：在模板中频繁调用方法
// 直接在模板中使用 colorStore.getPrimary 会导致频繁计算
```

### 3. 类型安全

```typescript
// ✅ 使用导出的类型
import type { SizeOption } from '@/stores/modules/size'

const setSizeOption = (option: SizeOption) => {
  sizeStore.setSize(option) // 类型安全
}

// ✅ 利用 TypeScript 的智能提示
const themeOptions = colorStore.getThemeOptions // 自动推断类型
```

### 4. 初始化建议

```typescript
// 在应用启动时初始化主题
import { useColorStore } from '@/stores/modules/color'
import { useSizeStore } from '@/stores/modules/size'

const initTheme = () => {
  const colorStore = useColorStore()
  const sizeStore = useSizeStore()

  // 初始化颜色配置
  colorStore.init()

  // 初始化尺寸配置
  sizeStore.init()
}

// 在 main.ts 中调用
initTheme()
```

## 📚 迁移指南

如果您正在从旧版本迁移，请注意以下变化：

### API 变化

```typescript
// 🔄 旧版本 -> 新版本

// 主题切换
// colorStore.toggleTheme() -> colorStore.toggleMode()

// 尺寸设置
// sizeStore.setSizeOption() -> sizeStore.setSize()

// 间距设置
// sizeStore.setActiveGapSize() -> sizeStore.setGap()

// 获取器变化
// colorStore.isDark -> colorStore.isDark (保持不变，但逻辑优化)
// sizeStore.currentGapValue -> sizeStore.getGapValue
```

### CSS变量变化

```css
/* 🔄 旧版本 -> 新版本 */

/* 间距变量简化 */
/* var(--theme-active-gap-size) -> var(--gap) */
/* var(--theme-active-radius-size) -> 已移除，现在专注于间距 */

/* 布局变量简化 */
/* var(--theme-active-sidebar-width) -> var(--sidebar-width) */
```

## 📚 总结

新的主题系统具有以下优势：

1. **🎯 职责清晰**：颜色和尺寸管理完全分离
2. **💪 类型安全**：完整的 TypeScript 类型支持
3. **🔄 响应式**：自动跟随系统主题变化
4. **⚡ 性能优化**：高效的 CSS 变量更新机制
5. **🛠️ 易于维护**：清晰的 API 设计和代码结构
6. **📱 现代化**：支持最新的设计系统理念

通过这个全新的主题系统，您可以：

- 🎨 轻松实现深色/浅色主题切换，支持自动跟随系统
- 📐 灵活配置三种尺寸预设和精细的布局控制
- 🔄 享受实时的主题变化响应
- 💼 构建专业级的企业管理后台界面
- 🚀 提升开发效率和用户体验
