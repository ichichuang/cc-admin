# 路由工具模块使用指南

## 概述

路由工具模块 (`@/common/modules/router.ts`) 提供了一套完整的路由操作工具函数，简化了 Vue Router 的使用，并与项目的增强版路由系统完美集成。

## 导入方式

### 方式 1: 从 common 模块导入

```typescript
import { router } from '@/common'

// 使用
router.goToRoute('dashboard')
router.goBack()
```

### 方式 2: 从 common 默认导入

```typescript
import common from '@/common'

// 使用
common.router.goToRoute('dashboard')
common.router.goBack()
```

### 方式 3: 直接从模块导入

```typescript
import { goToRoute, goBack, getBreadcrumbByRoute } from '@/common/modules/router'

// 使用
goToRoute('dashboard')
goBack()
```

## 核心功能

### 1. 路由导航

#### `goToRoute(name, query?, newWindow?, checkPermission?)`

跳转到指定路由

```typescript
// 基本跳转
router.goToRoute('dashboard')

// 带查询参数
router.goToRoute('dashboard', { from: 'test' })

// 新窗口打开
router.goToRoute('dashboard', {}, true)

// 启用权限检查
router.goToRoute('dashboard', {}, false, true)
```

#### `goBack()`

返回上一页（如果没有历史记录则跳转到首页）

```typescript
router.goBack()
```

#### `replaceRoute(path, query?)`

替换当前路由（不在历史记录中留下痕迹）

```typescript
router.replaceRoute('/dashboard', { tab: 'overview' })
```

#### `refreshCurrentRoute()`

刷新当前页面

```typescript
router.refreshCurrentRoute()
```

### 2. 路由查询

#### `getRouteByName(name?)`

根据路由名称获取路由信息

```typescript
// 获取指定路由
const dashboardRoutes = router.getRouteByName('dashboard')

// 获取当前路由（不传参数）
const currentRoutes = router.getRouteByName()
```

#### `getRouteByPath(path)`

根据路径获取路由信息

```typescript
const route = router.getRouteByPath('/dashboard')
```

#### `getRouteConfig(name)`

获取路由的完整配置信息（包含增强的 meta 信息）

```typescript
const config = router.getRouteConfig('dashboard')
console.log(config.meta.title) // 获取页面标题
```

#### `getCurrentRoute()`

获取当前路由信息

```typescript
const currentRoute = router.getCurrentRoute()
console.log(currentRoute.name, currentRoute.path)
```

#### `getCurrentRouteMeta()`

获取当前路由的 Meta 信息

```typescript
const meta = router.getCurrentRouteMeta()
console.log(meta.title) // 当前页面标题
```

### 3. 面包屑和菜单

#### `getBreadcrumbByRoute(name?)`

获取路由面包屑路径

```typescript
// 获取当前路由的面包屑
const breadcrumbs = router.getBreadcrumbByRoute()

// 获取指定路由的面包屑
const breadcrumbs = router.getBreadcrumbByRoute('dashboard')
console.log(breadcrumbs) // ['首页', '仪表板']
```

#### `getMenuTree()`

获取菜单树结构

```typescript
const menuTree = router.getMenuTree()
```

#### `getAuthorizedMenuTree(userRoles, menuTree?)`

根据权限过滤菜单树

```typescript
const userRoles = ['admin', 'user']
const authorizedMenus = router.getAuthorizedMenuTree(userRoles)
```

### 4. 权限相关

#### `checkCurrentRoutePermission(userRoles, routeName?)`

检查当前路由权限

```typescript
const userRoles = ['admin']
const hasPermission = router.checkCurrentRoutePermission(userRoles)
```

### 5. 外链相关

#### `isExternalLink(routeName)`

判断路由是否为外链

```typescript
const isExternal = router.isExternalLink('external-site')
```

#### `getExternalLinkUrl(routeName)`

获取外链地址

```typescript
const url = router.getExternalLinkUrl('external-site')
if (url) {
  window.open(url, '_blank')
}
```

### 6. 路由更新

#### `updateRoute(name, keyPath, value)`

动态更新路由信息

```typescript
// 更新页面标题
router.updateRoute('dashboard', 'meta.title', '新的仪表板标题')

// 更新路由名称
router.updateRoute('dashboard', 'name', 'new-dashboard')
```

### 7. 工具函数

#### `getFlatRouteList(menuList?)`

获取扁平化的路由列表

```typescript
const flatRoutes = router.getFlatRouteList()
```

#### `getHistoryLength()`

获取浏览器历史记录数量

```typescript
const historyCount = router.getHistoryLength()
```

## 在组件中使用

### Composition API

```vue
<template>
  <div>
    <h1>{{ currentRouteMeta.title }}</h1>
    <nav>
      <span
        v-for="(crumb, index) in breadcrumbs"
        :key="index"
      >
        {{ crumb }}
        <span v-if="index < breadcrumbs.length - 1"> > </span>
      </span>
    </nav>
    <button @click="navigateToDashboard">跳转到仪表板</button>
    <button @click="handleGoBack">返回</button>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { router } from '@/common'

// 计算属性
const currentRouteMeta = computed(() => router.getCurrentRouteMeta())
const breadcrumbs = computed(() => router.getBreadcrumbByRoute())

// 方法
const navigateToDashboard = () => {
  router.goToRoute('dashboard', { from: 'current-page' })
}

const handleGoBack = () => {
  router.goBack()
}
</script>
```

### Options API

```vue
<script>
import { router } from '@/common'

export default {
  computed: {
    currentRouteMeta() {
      return router.getCurrentRouteMeta()
    },
    breadcrumbs() {
      return router.getBreadcrumbByRoute()
    },
  },
  methods: {
    navigateToDashboard() {
      router.goToRoute('dashboard')
    },
    handleGoBack() {
      router.goBack()
    },
  },
}
</script>
```

## 兼容性别名

为了保持与原有代码的兼容性，提供了以下别名：

```typescript
// 原名称 -> 新名称
router.getRouter === router.getRouteByName
router.goName === router.goToRoute
router.getParentRoute === router.getBreadcrumbByRoute
```

## 最佳实践

### 1. 路由跳转

```typescript
// ✅ 推荐：使用路由名称跳转
router.goToRoute('dashboard')

// ❌ 不推荐：直接使用 $router.push
this.$router.push('/dashboard')
```

### 2. 权限检查

```typescript
// ✅ 推荐：在跳转时检查权限
router.goToRoute('admin-panel', {}, false, true)

// ✅ 推荐：手动检查权限
const userRoles = ['admin']
if (router.checkCurrentRoutePermission(userRoles, 'admin-panel')) {
  router.goToRoute('admin-panel')
}
```

### 3. 面包屑生成

```typescript
// ✅ 推荐：使用工具函数生成面包屑
const breadcrumbs = computed(() => router.getBreadcrumbByRoute())

// ❌ 不推荐：手动维护面包屑
const breadcrumbs = ref(['首页', '用户管理'])
```

### 4. 外链处理

```typescript
// ✅ 推荐：先检查是否为外链
if (router.isExternalLink(routeName)) {
  const url = router.getExternalLinkUrl(routeName)
  window.open(url, '_blank')
} else {
  router.goToRoute(routeName)
}
```

## 注意事项

1. **权限检查**: 权限检查功能需要配合用户状态管理一起使用
2. **面包屑映射**: 面包屑会优先使用路由系统的映射，然后回退到名称解析
3. **新窗口打开**: 新窗口功能基于当前域名和路由路径
4. **历史记录**: `goBack()` 会检查历史记录状态，没有记录时跳转到首页

## API 参考

完整的 API 列表和类型定义请参考源码中的 TypeScript 类型注释。

## 错误处理

路由工具会在控制台输出警告信息，帮助调试：

```typescript
// 路由不存在时
router.goToRoute('non-existent-route')
// 控制台输出: 路由 "non-existent-route" 未找到

// 更新不存在的路由时
router.updateRoute('non-existent-route', 'meta.title', 'New Title')
// 控制台输出: 路由 "non-existent-route" 未找到，无法更新
```

---

这个路由工具模块为项目提供了强大而灵活的路由操作能力，与增强版路由系统完美集成，既保持了简洁性，又具备了企业级应用所需的各种功能。
