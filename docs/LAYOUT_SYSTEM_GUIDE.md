# Layout 系统使用指南 (已升级)

本指南介绍如何使用 CC Admin 的统一布局管理系统。系统已进行重大升级，支持更细化的布局配置。

## 系统概述

Layout 系统提供了三种不同的布局模式，每种模式都有独立的配置选项，通过路由 meta 配置自动选择合适的布局：

1. **Admin 模式** (`admin`) - 经典的后台管理布局，包含完整的导航和界面元素
2. **大屏模式** (`screen`) - 适用于新窗口打开的页面，只保留头部和底部
3. **纯大屏模式** (`fullscreen`) - 纯净的全屏布局，只包含预设菜单控制

## 🆕 新增功能

### 顶部预设设置菜单 (AppTopMenu)

- 🎨 **主题预设**：一键切换浅色/深色主题
- 📐 **布局预设**：完整/简洁/极简布局快速切换
- 🔧 **实时配置**：当前配置状态实时显示
- 💾 **一键应用**：快速应用预设配置

### 细化的布局配置

每种布局模式现在都有独立的配置选项，不再共享配置。

## 布局模式详解

### 1. Admin 模式 (默认)

**特点：**

- ✅ 头部导航
- ✅ 顶部预设设置菜单 _(新增)_
- ✅ 侧边栏菜单
- ✅ 面包屑导航
- ✅ 底部信息
- ✅ 标签页支持 _(预留)_
- ✅ 可配置各部分显示/隐藏

**适用场景：**

- 后台管理页面
- 数据管理界面
- 系统配置页面

**配置选项：**

```typescript
interface AdminLayoutConfig {
  showHeader: boolean // 是否显示头部
  showTopMenu: boolean // 是否显示顶部预设设置菜单
  showSidebar: boolean // 是否显示侧边栏
  showBreadcrumb: boolean // 是否显示面包屑
  showFooter: boolean // 是否显示底部
  showTabs: boolean // 是否显示标签页
}
```

### 2. 大屏模式 (screen)

**特点：**

- ✅ 头部导航
- ✅ 顶部预设设置菜单 _(可配置)_
- ✅ 底部信息
- ❌ 无侧边栏
- ❌ 无面包屑

**适用场景：**

- 报表展示页面
- 数据可视化页面
- 演示页面

**配置选项：**

```typescript
interface ScreenLayoutConfig {
  showHeader: boolean // 是否显示头部
  showTopMenu: boolean // 是否显示顶部预设设置菜单
  showFooter: boolean // 是否显示底部
}
```

### 3. 纯大屏模式 (fullscreen)

**特点：**

- ✅ 头部导航 _(可配置)_
- ✅ 顶部预设设置菜单 _(可配置)_
- ✅ 底部信息 _(可配置)_
- 🎯 完全自由的布局空间
- 🔧 最大灵活性，可根据需要显示框架组件

**适用场景：**

- 数据大屏
- 登录页面
- 独立的全屏应用
- 演示或展示页面

**配置选项：**

```typescript
interface FullscreenLayoutConfig {
  showHeader: boolean // 是否显示头部
  showTopMenu: boolean // 是否显示顶部预设设置菜单
  showFooter: boolean // 是否显示底部
}
```

## Layout Store 管理

### 基本用法

```typescript
import { useLayoutStore } from '@/stores/modules/layout'

const layoutStore = useLayoutStore()

// 获取当前布局模式
console.log(layoutStore.currentLayout) // 'admin' | 'screen' | 'fullscreen'

// 获取当前布局配置（动态）
console.log(layoutStore.currentConfig)

// 获取各布局配置
console.log(layoutStore.adminConfig)
console.log(layoutStore.screenConfig)
console.log(layoutStore.fullscreenConfig)

// 获取所有配置
console.log(layoutStore.layoutConfigs)
```

### 细化的布局配置

#### Admin 布局配置

```typescript
// 更新 Admin 布局配置
layoutStore.updateAdminConfig({
  showHeader: true, // 显示头部
  showTopMenu: true, // 显示顶部预设菜单
  showSidebar: true, // 显示侧边栏
  showBreadcrumb: false, // 隐藏面包屑
  showFooter: false, // 隐藏底部
  showTabs: false, // 隐藏标签页
})

// 切换侧边栏折叠
layoutStore.toggleSidebarCollapse()

// 移动端侧边栏控制
layoutStore.toggleMobileSidebar()
layoutStore.hideMobileSidebar()
```

#### Screen 布局配置

```typescript
// 更新 Screen 布局配置
layoutStore.updateScreenConfig({
  showHeader: true, // 显示头部
  showTopMenu: true, // 显示顶部预设菜单
  showFooter: true, // 显示底部
})
```

#### Fullscreen 布局配置

**纯大屏模式** - 无预设框架，只有一个配置选项：

```typescript
// 更新 Fullscreen 布局配置
layoutStore.updateFullscreenConfig({
  showTopMenu: true, // 是否显示顶部预设菜单
})
```

> 注意：Fullscreen 模式专为纯大屏应用设计，不包含头部和底部框架，提供最纯净的显示空间。

### 通用配置方法

```typescript
// 通用更新方法（类型安全）
layoutStore.updateLayoutConfig('admin', {
  showBreadcrumb: false,
})

layoutStore.updateLayoutConfig('screen', {
  showTopMenu: false,
})

// 重置所有配置
layoutStore.resetAllConfigs()

// 重置单个布局配置
layoutStore.resetAdminConfig()
```

## 路由配置

### 基本路由配置（无变化）

```typescript
// src/router/modules/example.ts
import type { RouteConfig } from '../types'

const exampleRoutes: RouteConfig[] = [
  {
    path: '/example',
    name: 'Example',
    component: () => import('@/views/example/index.vue'),
    meta: {
      title: '示例页面',
      parent: 'admin', // 指定布局模式
      icon: '📝',
      rank: 1,
    },
  },
]

export default exampleRoutes
```

### 不同布局示例

```typescript
const routes: RouteConfig[] = [
  // Admin 布局（默认）
  {
    path: '/dashboard',
    meta: {
      title: '仪表盘',
      parent: 'admin', // 使用admin配置
    },
  },

  // 大屏布局
  {
    path: '/report',
    meta: {
      title: '报表页',
      parent: 'screen', // 使用screen配置
    },
  },

  // 全屏布局
  {
    path: '/bigscreen',
    meta: {
      title: '数据大屏',
      parent: 'fullscreen', // 使用fullscreen配置
    },
  },
]
```

## 🆕 组件结构（已更新）

```
src/layouts/
├── index.vue                 # 布局管理器（根据路由选择布局）
└── components/
    ├── AdminLayout.vue       # Admin 布局容器
    ├── ScreenLayout.vue      # 大屏布局容器
    ├── FullScreenLayout.vue  # 全屏布局容器
    ├── AppHeader.vue         # 头部组件
    ├── AppSidebar.vue        # 侧边栏组件
    ├── AppBreadcrumb.vue     # 面包屑组件
    ├── AppFooter.vue         # 底部组件
    └── AppTopMenu.vue        # 🆕 顶部预设设置菜单
```

## 使用示例

### 1. 基本使用

在组件中直接使用 Layout Store：

```vue
<script setup lang="ts">
import { useLayoutStore } from '@/stores/modules/layout'

const layoutStore = useLayoutStore()

// 动态控制布局
const toggleSidebar = () => {
  layoutStore.updateAdminConfig({
    showSidebar: !layoutStore.adminConfig.showSidebar,
  })
}
</script>
```

### 2. 预设配置

使用顶部预设菜单快速切换配置，或者编程式应用预设：

```typescript
// 应用完整布局预设
layoutStore.updateAdminConfig({
  showHeader: true,
  showTopMenu: true,
  showSidebar: true,
  showBreadcrumb: true,
  showFooter: true,
  showTabs: false,
})

// 应用简洁布局预设
layoutStore.updateAdminConfig({
  showHeader: true,
  showTopMenu: true,
  showSidebar: true,
  showBreadcrumb: false,
  showFooter: false,
  showTabs: false,
})
```

## 演示页面

系统提供了演示页面来展示不同布局模式的效果：

- **Admin 布局测试**：`/test` - 包含所有配置的动态控制
- **Admin 布局**：`/dashboard`
- **大屏布局**：`/layout-demo/screen`
- **全屏布局**：`/layout-demo/fullscreen`

## 最佳实践

### 1. 布局选择建议

- **管理类页面**：使用 `admin` 布局，启用完整功能
- **展示类页面**：使用 `screen` 布局，专注内容展示
- **独立应用**：使用 `fullscreen` 布局，根据需要配置组件

### 2. 配置策略

- **开发阶段**：使用 `/test` 页面动态调试布局配置
- **生产环境**：使用顶部预设菜单让用户自定义体验
- **特殊需求**：针对不同布局模式单独配置

### 3. 性能优化

- 布局配置会自动持久化到 localStorage
- 组件按需加载，减少初始加载时间
- 响应式设计自动适配不同设备

## 故障排除

### 1. 配置不生效

检查是否在正确的布局模式下更新配置：

```typescript
// ❌ 错误：在Screen模式下更新Admin配置
layoutStore.updateAdminConfig({ showSidebar: false })

// ✅ 正确：根据当前布局模式更新
if (layoutStore.currentLayout === 'admin') {
  layoutStore.updateAdminConfig({ showSidebar: false })
}
```

### 2. 配置状态异常

```typescript
// 重置所有配置
layoutStore.resetAllConfigs()

// 或重置特定布局
layoutStore.resetAdminConfig()
```

### 3. 顶部菜单不显示

确保相应的布局配置中 `showTopMenu` 为 `true`。

## 版本更新

### v2.0 更新内容

- ✅ 新增顶部预设设置菜单
- ✅ 支持每种布局模式的独立配置
- ✅ 新增Screen和Fullscreen布局的配置选项
- ✅ 改进的Store管理和类型安全
- ✅ 更丰富的演示和测试页面

### v2.1 更新内容

- ✅ **重构 Fullscreen 布局模式**：简化为纯大屏模式，移除头部和底部框架
- ✅ 只保留 `showTopMenu` 配置选项，专注于预设菜单控制
- ✅ 更新相关文档和测试页面，明确 Fullscreen 模式的定位

## 总结

升级后的 Layout 系统提供了更加细化和灵活的布局管理能力。通过独立的配置选项和直观的预设菜单，开发者和用户都能轻松地定制最适合的界面布局。系统设计保持了向下兼容性，同时为未来扩展预留了充足的空间。
