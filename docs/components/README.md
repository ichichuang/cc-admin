<!--
  @copyright Copyright (c) 2025 chichuang
  @license MIT
  @description CC-Admin 企业级后台管理框架 - 组件文档
  本文件为 chichuang 原创，禁止擅自删除署名或用于商业用途。
-->

# 组件文档

CC-Admin 提供了一套完整的组件库，遵循 Vue 3 Composition API 和 TypeScript 最佳实践。

## 📋 组件规范

### 基本原则

- **简洁明了**: 组件代码尽可能简洁，聚焦展示一个功能点
- **即用性**: 用户可以直接复制代码到项目中使用
- **完整性**: 包含必要的 import 语句和类型定义
- **可读性**: 代码结构清晰，注释适度
- **响应式**: 展示响应式设计和移动端适配
- **主题兼容**: 支持深色/浅色主题切换

### 文件组织

```
src/components/ComponentName/
├── index.vue              # 组件主文件
├── types.ts               # 组件类型定义
├── demo/                  # 演示目录
│   ├── basic.vue          # 基础用法
│   ├── advanced.vue       # 高级用法
│   ├── custom-theme.vue   # 主题定制
│   ├── responsive.vue     # 响应式演示
│   └── with-loading.vue   # 加载状态
└── README.md              # 组件文档
```

## 🧩 组件列表

### 布局组件

#### LayoutAdmin

管理后台主布局组件，包含侧边栏、顶部导航、面包屑等。

**Props**

| 属性      | 类型              | 默认值  | 说明           |
| --------- | ----------------- | ------- | -------------- |
| collapsed | boolean           | false   | 侧边栏折叠状态 |
| theme     | 'light' \| 'dark' | 'light' | 主题模式       |

**Events**

| 事件            | 参数                 | 说明             |
| --------------- | -------------------- | ---------------- |
| collapse-change | (collapsed: boolean) | 折叠状态变更事件 |

**Slots**

| 插槽    | 参数 | 说明             |
| ------- | ---- | ---------------- |
| header  | -    | 自定义头部内容   |
| sidebar | -    | 自定义侧边栏内容 |
| footer  | -    | 自定义底部内容   |

#### LayoutScreen

全屏布局组件，适用于大屏展示。

**Props**

| 属性       | 类型    | 默认值 | 说明         |
| ---------- | ------- | ------ | ------------ |
| fullscreen | boolean | true   | 是否全屏显示 |
| background | string  | -      | 背景图片URL  |

**Events**

| 事件              | 参数                  | 说明             |
| ----------------- | --------------------- | ---------------- |
| fullscreen-change | (fullscreen: boolean) | 全屏状态变更事件 |

#### LayoutFullScreen

无边框全屏布局，适用于登录页等。

**Props**

| 属性       | 类型    | 默认值 | 说明         |
| ---------- | ------- | ------ | ------------ |
| showHeader | boolean | false  | 是否显示头部 |
| showFooter | boolean | false  | 是否显示底部 |

### 通用组件

#### LanguageSwitch

语言切换组件，支持多语言切换。

**Props**

| 属性     | 类型                           | 默认值   | 说明         |
| -------- | ------------------------------ | -------- | ------------ |
| showText | boolean                        | true     | 是否显示文字 |
| showIcon | boolean                        | true     | 是否显示图标 |
| size     | 'small' \| 'medium' \| 'large' | 'medium' | 组件尺寸     |

**Events**

| 事件   | 参数             | 说明         |
| ------ | ---------------- | ------------ |
| change | (locale: string) | 语言切换事件 |

#### Loading

加载状态组件，支持多种加载样式。

**Props**

| 属性 | 类型                           | 默认值      | 说明     |
| ---- | ------------------------------ | ----------- | -------- |
| type | 'spinner' \| 'dots' \| 'bars'  | 'spinner'   | 加载类型 |
| size | 'small' \| 'medium' \| 'large' | 'medium'    | 加载尺寸 |
| text | string                         | '加载中...' | 加载文字 |

## 📝 组件使用示例

### 基础用法

```vue
<template>
  <LayoutAdmin
    :collapsed="isCollapsed"
    @collapse-change="handleCollapse"
  >
    <template #header>
      <div class="custom-header">自定义头部</div>
    </template>
  </LayoutAdmin>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import LayoutAdmin from '@/layouts/components/LayoutAdmin.vue'

const isCollapsed = ref(false)

const handleCollapse = (collapsed: boolean) => {
  console.log('侧边栏状态:', collapsed)
}
</script>
```

### 响应式设计

```vue
<template>
  <div class="responsive-container">
    <LanguageSwitch
      :show-text="showText"
      :size="switchSize"
      @change="handleLanguageChange"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useWindowSize } from '@/hooks/useWindowSize'
import LanguageSwitch from '@/components/common/LanguageSwitch.vue'

const { width } = useWindowSize()

const showText = computed(() => width.value > 768)
const switchSize = computed(() => (width.value < 480 ? 'small' : 'medium'))

const handleLanguageChange = (locale: string) => {
  console.log('切换到语言:', locale)
}
</script>
```

### 主题定制

```vue
<template>
  <div
    class="theme-container"
    :class="themeClass"
  >
    <Loading
      :type="loadingType"
      :size="loadingSize"
      :text="loadingText"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useColorStore } from '@/stores/modules/color'
import Loading from '@/components/layout/Loading.vue'

const colorStore = useColorStore()
const loadingType = ref<'spinner' | 'dots' | 'bars'>('spinner')
const loadingSize = ref<'small' | 'medium' | 'large'>('medium')
const loadingText = ref('加载中...')

const themeClass = computed(() => ({
  'dark-theme': colorStore.getCurrentMode === 'dark',
  'light-theme': colorStore.getCurrentMode === 'light',
}))
</script>
```

## 🎨 样式定制

### CSS 变量

组件使用 CSS 变量进行主题定制：

```css
:root {
  --primary-color: #1890ff;
  --success-color: #52c41a;
  --warning-color: #faad14;
  --error-color: #f5222d;
  --text-color: #333333;
  --bg-color: #ffffff;
}

[data-theme='dark'] {
  --text-color: #ffffff;
  --bg-color: #1f1f1f;
}
```

### UnoCSS 工具类

组件支持 UnoCSS 工具类：

```vue
<template>
  <div class="flex items-center justify-between p-4 bg-white dark:bg-gray-800">
    <LanguageSwitch class="text-primary hover:text-primary-dark" />
    <Loading class="text-success" />
  </div>
</template>
```

## 🔧 开发指南

### 创建新组件

1. 在 `src/components/` 下创建组件目录
2. 创建 `index.vue` 主组件文件
3. 创建 `types.ts` 类型定义文件
4. 创建 `demo/` 目录并添加演示文件
5. 创建 `README.md` 组件文档

### 组件命名规范

- 组件名使用 PascalCase
- 文件名使用 PascalCase
- 目录名使用 kebab-case

### TypeScript 类型定义

```typescript
// types.ts
export interface ComponentProps {
  prop1?: string
  prop2?: number
  prop3?: boolean
}

export interface ComponentEmits {
  (e: 'change', value: string): void
  (e: 'update', value: any): void
}

export interface ComponentSlots {
  default?: () => VNode[]
  header?: () => VNode[]
  footer?: () => VNode[]
}
```

## 📚 相关文档

- [API 文档](../api/README.md)
- [路由文档](../router/README.md)
- [状态管理](../stores/README.md)
- [样式指南](../styles/README.md)
