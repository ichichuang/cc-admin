# 动态主题变量系统使用指南

## 🎨 概述

本项目采用基于CSS自定义属性（CSS Variables）的动态主题系统，相比传统的SCSS变量具有以下优势：

- ✅ **动态性**：可以在运行时动态修改变量值
- ✅ **响应式**：支持实时主题切换，无需重新编译
- ✅ **灵活性**：可以针对不同组件或页面设置不同的主题
- ✅ **兼容性**：现代浏览器原生支持，性能更好

## 🏗️ 系统架构

### Store 管理

- `src/stores/modules/theme.ts` - 主题变量管理中心
- 支持颜色变量和尺寸变量的统一管理
- 提供持久化存储，刷新页面后保持用户设置

### TypeScript 类型管理

为了更好地组织和管理主题相关的 TypeScript 类型定义，本项目采用统一的类型管理策略：

#### 类型文件结构

```
src/stores/types/
└── themes.ts  # 主题系统所有类型定义
```

#### 核心类型接口

所有主题相关的类型定义都统一放在 `src/stores/types/themes.ts` 中：

```typescript
// 从统一的类型文件导入
import type {
  FunctionalColor, // 功能色定义接口
  ColorVariables, // 颜色变量定义接口
  SizeVariables, // 尺寸变量定义接口
  ThemeMode, // 主题模式类型
  SizeOption, // 尺寸选项类型
  SizePreset, // 尺寸预设接口
  ThemePreset, // 预设主题接口
  ThemeState, // 主题store状态接口
  ThemeConfig, // 主题配置选项接口
  ThemeUpdateOptions, // 主题更新选项接口
  ThemeEvent, // 主题事件接口
  ThemeListener, // 主题监听器类型
} from '@/stores/types/themes'
```

#### 优势说明

1. **统一管理**：避免类型定义分散在多个文件中
2. **易于维护**：修改类型定义只需在一个地方进行
3. **类型安全**：确保所有引用都使用统一的类型定义
4. **开发体验**：IDE可以提供更好的类型提示和自动补全
5. **团队协作**：团队成员都从同一个地方导入类型，避免混乱

#### 使用示例

```typescript
// 在组件中使用
import type { ColorVariables, SizeVariables } from '@/stores/types/themes'
import { useThemeStore } from '@/stores/modules/theme'

// 自定义函数使用类型
const updateColors = (colors: Partial<ColorVariables>) => {
  const themeStore = useThemeStore()
  themeStore.updateColors(colors)
}

const updateSizes = (sizes: Partial<SizeVariables>) => {
  const themeStore = useThemeStore()
  themeStore.updateSizes(sizes)
}
```

## 🎭 主题模式

### 支持的主题模式

- `light` - 浅色主题
- `dark` - 深色主题
- `auto` - 跟随系统主题（未来扩展）

### 主题切换示例

```vue
<template>
  <div class="theme-switcher">
    <button
      @click="themeStore.setThemeMode('light')"
      :class="{ active: themeStore.mode === 'light' }"
    >
      🌞 浅色
    </button>
    <button
      @click="themeStore.setThemeMode('dark')"
      :class="{ active: themeStore.mode === 'dark' }"
    >
      🌙 深色
    </button>
    <button @click="themeStore.toggleTheme()">🔄 切换</button>
  </div>
</template>

<script setup lang="ts">
import { useThemeStore } from '@/stores/modules/theme'
const themeStore = useThemeStore()
</script>
```

## 📐 可用的CSS变量

### 颜色变量

#### 功能色系

```css
/* Primary 主色调 */
--theme-primary-color     /* 主色调 */
--theme-primary-hover     /* 悬停色 */
--theme-primary-active    /* 激活色 */
--theme-primary-disabled  /* 禁用色 */
--theme-primary-light     /* 浅色 */

/* Success 成功色 */
--theme-success-color     /* 成功色 */
--theme-success-hover     /* 悬停色 */
--theme-success-active    /* 激活色 */
--theme-success-disabled  /* 禁用色 */
--theme-success-light     /* 浅色 */

/* Warning 警告色 */
--theme-warning-color     /* 警告色 */
--theme-warning-hover     /* 悬停色 */
--theme-warning-active    /* 激活色 */
--theme-warning-disabled  /* 禁用色 */
--theme-warning-light     /* 浅色 */

/* Error 错误色 */
--theme-error-color       /* 错误色 */
--theme-error-hover       /* 悬停色 */
--theme-error-active      /* 激活色 */
--theme-error-disabled    /* 禁用色 */
--theme-error-light       /* 浅色 */

/* Info 信息色 */
--theme-info-color        /* 信息色 */
--theme-info-hover        /* 悬停色 */
--theme-info-active       /* 激活色 */
--theme-info-disabled     /* 禁用色 */
--theme-info-light        /* 浅色 */
```

#### 主题相关颜色

```css
--theme-color             /* 主题颜色（与primary.color相同） */
--theme-text-color        /* 主题文字颜色 */
```

#### 基础颜色

```css
--text-color              /* 默认文字颜色 */
--text-muted-color        /* 置灰文字颜色 */
--background-color        /* 默认背景颜色 */
--background-highlight-color /* 背景高亮色 */
```

#### 功能色系

```css
--theme-success         /* 成功色 */
--theme-success-hover   /* 成功悬停色 */
--theme-success-active  /* 成功激活色 */
--theme-success-light   /* 成功浅色 */

--theme-warning         /* 警告色 */
--theme-warning-hover   /* 警告悬停色 */
--theme-warning-active  /* 警告激活色 */
--theme-warning-light   /* 警告浅色 */

--theme-error          /* 错误色 */
--theme-error-hover    /* 错误悬停色 */
--theme-error-active   /* 错误激活色 */
--theme-error-light    /* 错误浅色 */

--theme-info          /* 信息色 */
--theme-info-hover    /* 信息悬停色 */
--theme-info-active   /* 信息激活色 */
--theme-info-light    /* 信息浅色 */
```

#### 中性色系

```css
--theme-text-primary     /* 主要文本色 */
--theme-text-secondary   /* 次要文本色 */
--theme-text-disabled    /* 禁用文本色 */
--theme-text-inverse     /* 反色文本 */
--theme-text-placeholder /* 占位符文本色 */

--theme-border-base      /* 基础边框色 */
--theme-border-light     /* 浅色边框 */
--theme-border-split     /* 分割线颜色 */

--theme-bg-base         /* 基础背景色 */
--theme-bg-light        /* 浅色背景 */
--theme-bg-dark         /* 深色背景 */
--theme-bg-hover        /* 悬停背景色 */
--theme-bg-disabled     /* 禁用背景色 */
```

#### 灰度色阶

```css
--theme-gray-1    /* 最浅灰 #ffffff */
--theme-gray-2    /* 浅灰 #fafafa */
--theme-gray-3    /* 浅灰 #f5f5f5 */
--theme-gray-4    /* 浅灰 #f0f0f0 */
--theme-gray-5    /* 中灰 #d9d9d9 */
--theme-gray-6    /* 中灰 #bfbfbf */
--theme-gray-7    /* 中灰 #8c8c8c */
--theme-gray-8    /* 深灰 #595959 */
--theme-gray-9    /* 最深灰 #262626 */
```

### 尺寸变量 (SizeVariables)

专注于布局相关和设计系统变量，避免与UI框架冲突：

#### 尺寸选项系统

系统提供三种预设尺寸选项：

```typescript
export type SizeOption = 'compact' | 'default' | 'comfortable'
```

- `compact` - 紧凑：适合信息密度高的场景
- `default` - 默认：标准的视觉舒适度
- `comfortable` - 舒适：适合长时间使用的场景

#### 布局相关尺寸

```css
--sidebar-width
--sidebar-collapsed-width
--header-height
--breadcrumb-height
--footer-height
--tabs-height
```

#### 设计系统 - 间距

```css
--gap-xs
--gap-sm
--gap-md
--gap-lg
--gap-xl
```

#### 设计系统 - 圆角

```css
--radius-xs
--radius-sm
--radius-md
--radius-lg
--radius-xl
--radius-round
```

## 🚀 基本使用

### 1. 在Vue组件中使用Store

```vue
<script setup lang="ts">
import { useThemeStore } from '@/stores/modules/theme'

const themeStore = useThemeStore()

// 切换主题
const toggleTheme = () => {
  themeStore.toggleTheme()
}

// 设置特定主题
const setLightTheme = () => {
  themeStore.setThemeMode('light')
}

// 动态修改颜色
const updatePrimaryColor = (color: string) => {
  themeStore.updateFunctionalColor('primary', { color })
}

// 或者更新整个功能色
const updatePrimaryColors = () => {
  themeStore.updateFunctionalColor('primary', {
    color: '#ff6b6b',
    hover: '#ff5252',
    active: '#e53e3e',
  })
}
</script>
```

### 2. 在CSS中使用变量

```vue
<style scoped>
.my-component {
  /* 使用颜色变量 */
  color: var(--text-color);
  background-color: var(--background-color);
  border: 1px solid var(--theme-primary-color);

  /* 使用尺寸变量 */
  padding: var(--gap-md);
  border-radius: var(--radius-md);
  font-size: var(--font-size-base);
}

.primary-button {
  background: var(--theme-primary-color);
  color: var(--theme-text-color);
  border: none;
  padding: var(--gap-sm) var(--gap-md);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all 0.3s ease;
}

.primary-button:hover {
  background: var(--theme-primary-hover);
}

.primary-button:active {
  background: var(--theme-primary-active);
}

.primary-button:disabled {
  background: var(--theme-primary-disabled);
  cursor: not-allowed;
}
</style>
```

### 3. 直接操作CSS变量

```javascript
// 设置单个变量
document.documentElement.style.setProperty('--theme-primary-color', '#ff6b6b')

// 或使用Store方法
themeStore.setCSSVariable('theme-primary-color', '#ff6b6b')

// 批量设置
themeStore.setCSSVariables({
  'theme-primary-color': '#ff6b6b',
  'theme-success-color': '#51cf66',
  'gap-md': '20px',
})

// 更新功能色（推荐方式）
themeStore.updateFunctionalColor('primary', {
  color: '#ff6b6b',
  hover: '#ff5252',
})

// 更新尺寸变量
themeStore.updateSizes({
  sidebarWidth: '240px',
  gapMd: '20px',
  radiusMd: '8px',
})

// 设置尺寸选项（会应用对应的预设尺寸）
themeStore.setSizeOption('compact') // 紧凑模式
themeStore.setSizeOption('default') // 默认模式
themeStore.setSizeOption('comfortable') // 舒适模式

// 应用尺寸预设（与setSizeOption相同）
themeStore.applySizePreset('comfortable')

// 获取当前尺寸选项
console.log(themeStore.currentSizeOption) // 'default'
console.log(themeStore.currentSizePreset.label) // '默认'

// 设置单个CSS变量
```

## 🎭 主题模式

### 支持的主题模式

- `light` - 浅色主题
- `dark` - 深色主题
- `auto` - 跟随系统主题（未来扩展）

### 主题切换示例

```vue
<template>
  <div class="theme-switcher">
    <button
      @click="themeStore.setThemeMode('light')"
      :class="{ active: themeStore.mode === 'light' }"
    >
      🌞 浅色
    </button>
    <button
      @click="themeStore.setThemeMode('dark')"
      :class="{ active: themeStore.mode === 'dark' }"
    >
      🌙 深色
    </button>
    <button @click="themeStore.toggleTheme()">🔄 切换</button>
  </div>
</template>

<script setup lang="ts">
import { useThemeStore } from '@/stores/modules/theme'
const themeStore = useThemeStore()
</script>
```

## 📐 可用的CSS变量

### 颜色变量

#### 功能色系

```css
/* Primary 主色调 */
--theme-primary-color     /* 主色调 */
--theme-primary-hover     /* 悬停色 */
--theme-primary-active    /* 激活色 */
--theme-primary-disabled  /* 禁用色 */
--theme-primary-light     /* 浅色 */

/* Success 成功色 */
--theme-success-color     /* 成功色 */
--theme-success-hover     /* 悬停色 */
--theme-success-active    /* 激活色 */
--theme-success-disabled  /* 禁用色 */
--theme-success-light     /* 浅色 */

/* Warning 警告色 */
--theme-warning-color     /* 警告色 */
--theme-warning-hover     /* 悬停色 */
--theme-warning-active    /* 激活色 */
--theme-warning-disabled  /* 禁用色 */
--theme-warning-light     /* 浅色 */

/* Error 错误色 */
--theme-error-color       /* 错误色 */
--theme-error-hover       /* 悬停色 */
--theme-error-active      /* 激活色 */
--theme-error-disabled    /* 禁用色 */
--theme-error-light       /* 浅色 */

/* Info 信息色 */
--theme-info-color        /* 信息色 */
--theme-info-hover        /* 悬停色 */
--theme-info-active       /* 激活色 */
--theme-info-disabled     /* 禁用色 */
--theme-info-light        /* 浅色 */
```

#### 主题相关颜色

```css
--theme-color             /* 主题颜色（与primary.color相同） */
--theme-text-color        /* 主题文字颜色 */
```

#### 基础颜色

```css
--text-color              /* 默认文字颜色 */
--text-muted-color        /* 置灰文字颜色 */
--background-color        /* 默认背景颜色 */
--background-highlight-color /* 背景高亮色 */
```

#### 功能色系

```css
--theme-success         /* 成功色 */
--theme-success-hover   /* 成功悬停色 */
--theme-success-active  /* 成功激活色 */
--theme-success-light   /* 成功浅色 */

--theme-warning         /* 警告色 */
--theme-warning-hover   /* 警告悬停色 */
--theme-warning-active  /* 警告激活色 */
--theme-warning-light   /* 警告浅色 */

--theme-error          /* 错误色 */
--theme-error-hover    /* 错误悬停色 */
--theme-error-active   /* 错误激活色 */
--theme-error-light    /* 错误浅色 */

--theme-info          /* 信息色 */
--theme-info-hover    /* 信息悬停色 */
--theme-info-active   /* 信息激活色 */
--theme-info-light    /* 信息浅色 */
```

#### 中性色系

```css
--theme-text-primary     /* 主要文本色 */
--theme-text-secondary   /* 次要文本色 */
--theme-text-disabled    /* 禁用文本色 */
--theme-text-inverse     /* 反色文本 */
--theme-text-placeholder /* 占位符文本色 */

--theme-border-base      /* 基础边框色 */
--theme-border-light     /* 浅色边框 */
--theme-border-split     /* 分割线颜色 */

--theme-bg-base         /* 基础背景色 */
--theme-bg-light        /* 浅色背景 */
--theme-bg-dark         /* 深色背景 */
--theme-bg-hover        /* 悬停背景色 */
--theme-bg-disabled     /* 禁用背景色 */
```

#### 灰度色阶

```css
--theme-gray-1    /* 最浅灰 #ffffff */
--theme-gray-2    /* 浅灰 #fafafa */
--theme-gray-3    /* 浅灰 #f5f5f5 */
--theme-gray-4    /* 浅灰 #f0f0f0 */
--theme-gray-5    /* 中灰 #d9d9d9 */
--theme-gray-6    /* 中灰 #bfbfbf */
--theme-gray-7    /* 中灰 #8c8c8c */
--theme-gray-8    /* 深灰 #595959 */
--theme-gray-9    /* 最深灰 #262626 */
```

### 尺寸变量

#### 布局相关尺寸

```css
--sidebar-width
--sidebar-collapsed-width
--header-height
--breadcrumb-height
--footer-height
--tabs-height
```

#### 设计系统 - 间距

```css
--gap-xs
--gap-sm
--gap-md
--gap-lg
--gap-xl
```

#### 设计系统 - 圆角

```css
--radius-xs
--radius-sm
--radius-md
--radius-lg
--radius-xl
--radius-round
```

## 🔧 高级用法

### 1. 自定义主题预设

```typescript
// 创建自定义主题
const customColors: ColorVariables = {
  primary: '#ff6b6b',
  primaryHover: '#ff5252',
  primaryActive: '#ff1744',
  // ... 其他颜色
}

// 应用自定义主题
themeStore.updateColors(customColors)

// 保存自定义主题
themeStore.saveCustomTheme('我的主题')
```

### 2. 响应式主题

```vue
<style scoped>
.responsive-component {
  padding: var(--gap-sm);
  font-size: var(--font-size-sm);
}

@media (min-width: 768px) {
  .responsive-component {
    padding: var(--gap-md);
    font-size: var(--font-size-base);
  }
}

@media (min-width: 1024px) {
  .responsive-component {
    padding: var(--gap-lg);
    font-size: var(--font-size-lg);
  }
}
</style>
```

### 3. 主题感知组件

```vue
<template>
  <div :class="['card', { 'card--dark': themeStore.isDark }]">
    <h3>主题感知卡片</h3>
    <p>当前主题：{{ themeStore.mode }}</p>
  </div>
</template>

<script setup lang="ts">
import { useThemeStore } from '@/stores/modules/theme'
const themeStore = useThemeStore()
</script>

<style scoped>
.card {
  background: var(--theme-bg-base);
  color: var(--theme-text-primary);
  border: 1px solid var(--theme-border-base);
  border-radius: var(--radius-base);
  padding: var(--gap-lg);
  transition: all 0.3s ease;
}

.card--dark {
  box-shadow: 0 4px 12px rgba(255, 255, 255, 0.1);
}
</style>
```

### 4. 动态计算颜色

```typescript
// 在store中扩展方法
const generateHoverColor = (baseColor: string, factor: number = 0.1) => {
  // 实现颜色计算逻辑
  // 可以使用第三方库如 tinycolor2
  return adjustColor(baseColor, factor)
}

// 自动生成相关颜色
const updatePrimaryColorWithVariants = (primaryColor: string) => {
  themeStore.updateColors({
    primary: primaryColor,
    primaryHover: generateHoverColor(primaryColor, 0.1),
    primaryActive: generateHoverColor(primaryColor, -0.1),
    primaryLight: generateHoverColor(primaryColor, 0.8),
  })
}
```

## 📱 响应式设计

### 结合媒体查询使用

```css
.responsive-layout {
  padding: var(--gap-sm);
  gap: var(--gap-sm);
}

@media (min-width: 768px) {
  .responsive-layout {
    padding: var(--gap-md);
    gap: var(--gap-md);
  }
}

@media (min-width: 1024px) {
  .responsive-layout {
    padding: var(--gap-lg);
    gap: var(--gap-lg);
  }
}
```

### 动态调整尺寸

```typescript
// 根据屏幕尺寸动态调整变量
const updateSizesForScreen = () => {
  const width = window.innerWidth

  if (width < 768) {
    themeStore.updateSizes({
      gap-md: '12px',
      font-size-base: '13px',
    })
  } else if (width < 1024) {
    themeStore.updateSizes({
      gap-md: '16px',
      font-size-base: '14px',
    })
  } else {
    themeStore.updateSizes({
      gap-md: '20px',
      font-size-base: '15px',
    })
  }
}
```

## 🎯 最佳实践

### 1. 命名规范

- 颜色变量：`--theme-[category]-[variant]`
- 尺寸变量：`--[property]-[size]`
- 语义化命名，避免使用具体的颜色名称

### 2. 性能优化

- 避免频繁修改CSS变量，考虑批量更新
- 使用`themeStore.setCSSVariables()`进行批量设置
- 在组件卸载时清理监听器

### 3. 兼容性处理

- 为不支持CSS变量的浏览器提供回退值

```css
.component {
  color: #000000; /* 回退值 */
  color: var(--theme-text-primary, #000000); /* CSS变量 + 回退值 */
}
```

### 4. 类型安全

- 使用TypeScript接口确保类型安全
- 定义严格的颜色和尺寸类型
- 使用枚举定义预设主题

## 🔍 调试技巧

### 1. 查看当前变量值

```javascript
// 在浏览器控制台中查看
getComputedStyle(document.documentElement).getPropertyValue('--theme-primary')

// 或者使用store
console.log(themeStore.colors.primary)
```

### 2. 实时调试

访问 `/test/theme-variables` 页面，可以：

- 实时切换主题模式
- 动态修改颜色和尺寸
- 查看所有变量的当前值
- 测试组件在不同主题下的表现

### 3. 开发者工具

在浏览器开发者工具中，可以直接修改CSS变量：

1. 打开Elements面板
2. 选择`<html>`元素
3. 在Styles面板中查看和修改`--theme-*`变量

## 🚀 未来扩展

### 计划中的功能

- [ ] 更多内置主题预设
- [ ] 主题动画过渡效果
- [ ] 主题配置导入/导出
- [ ] 基于AI的智能配色建议
- [ ] 无障碍性主题支持
- [ ] 主题编辑器可视化界面

## 📞 技术支持

如果在使用过程中遇到问题：

1. 查看浏览器控制台是否有错误信息
2. 确认CSS变量名称是否正确
3. 检查主题store是否正确初始化
4. 访问演示页面确认功能是否正常

## 相关链接

- [演示页面](/test/theme-variables)
- [布局系统指南](./LAYOUT_SYSTEM_GUIDE.md)
- [Pinia状态管理文档](./PINIA_PERSISTED_GUIDE.md)
