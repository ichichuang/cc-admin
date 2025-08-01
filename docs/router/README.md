<!--
  @copyright Copyright (c) 2025 chichuang
  @license MIT
  @description CC-Admin 企业级后台管理框架 - 路由文档
  本文件为 chichuang 原创，禁止擅自删除署名或用于商业用途。
-->

# 路由管理

## 概述

CC-Admin 使用 Vue Router 4 进行路由管理，支持静态路由和动态路由，并集成了多语言标题功能。

## 路由配置

### 静态路由

静态路由定义在 `src/router/modules/` 目录下，每个文件导出一个 `RouteConfig[]` 数组。

#### 基本配置

```typescript
const routes: RouteConfig[] = [
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('@/views/dashboard/index.vue'),
    meta: {
      titleKey: 'router.dashboard.dashboard', // 多语言标题 key
      rank: 1,
      roles: ['admin', 'user'],
    },
  },
]
```

#### 多语言标题配置

路由配置中支持两种标题设置方式：

1. **推荐方式：使用 `titleKey`**

   ```typescript
   meta: {
     titleKey: 'router.dashboard.dashboard', // 多语言 key
   }
   ```

2. **兼容方式：直接使用 `title`**
   ```typescript
   meta: {
     title: 'Dashboard', // 直接设置标题
   }
   ```

### 动态路由

动态路由从后端获取，支持相同的多语言标题配置：

```typescript
// 后端返回的路由数据结构
{
  path: '/user',
  name: 'User',
  component: 'views/user/index.vue',
  meta: {
    titleKey: 'router.user.user', // 多语言 key
    roles: ['admin'],
  },
}
```

## 多语言标题实现

### 路由守卫处理

在路由守卫中统一处理多语言标题转换：

```typescript
// src/router/utils/customs.ts
export const getRouteTitle = (route: any, appTitle: string): string => {
  if (route.meta?.titleKey) {
    // 使用 titleKey 获取多语言标题
    return `${t(route.meta.titleKey)} - ${appTitle}`
  } else if (route.meta?.title) {
    // 兼容直接设置 title 的情况
    return `${route.meta.title} - ${appTitle}`
  }
  return appTitle
}
```

### 语言包配置

在 `src/locales/modules/router.ts` 中配置多语言标题：

```typescript
export const routerZhCN: RouterLocaleMessages = {
  dashboard: {
    dashboard: '仪表盘',
  },
  example: {
    example: '示例',
    color: '主题',
    size: '尺寸',
  },
  error: {
    notFound: '页面未找到',
    forbidden: '访问被拒绝',
  },
}
```

## 路由类型定义

### RouteMeta 接口

```typescript
declare interface RouteMeta {
  /** 页面标题（支持国际化 key） */
  title?: string

  /** 页面标题国际化 key */
  titleKey?: string

  /** 布局模式 */
  parent?: LayoutMode

  /** 菜单图标 */
  icon?: string

  /** 是否在菜单中显示 */
  showLink?: boolean

  /** 菜单排序权重 */
  rank?: number

  /** 页面级权限角色 */
  roles?: string[]

  /** 按钮级权限设置 */
  auths?: string[]

  /** 是否缓存页面 */
  keepAlive?: boolean

  /** 是否隐藏面包屑 */
  hideBreadcrumb?: boolean

  /** 是否为外链 */
  isLink?: boolean

  /** 外链地址 */
  linkUrl?: string

  /** 激活菜单路径 */
  activeMenu?: string

  /** 页面描述信息 */
  description?: string

  /** 是否为后端动态路由 */
  backstage?: boolean

  /** 是否显示父级菜单 */
  showParent?: boolean

  /** 内嵌的iframe链接 */
  frameSrc?: string

  /** iframe页是否开启首次加载动画 */
  frameLoading?: boolean

  /** 动态路由可打开的最大数量 */
  dynamicLevel?: number

  /** 当前菜单名称是否禁止添加到标签页 */
  hiddenTag?: boolean

  /** 当前菜单名称是否固定显示在标签页且不可关闭 */
  fixedTag?: boolean

  /** 页面加载动画配置 */
  transition?: {
    name?: string
    enterTransition?: string
    leaveTransition?: string
  }
}
```

## 最佳实践

### 1. 使用 titleKey 而非 title

推荐在路由配置中使用 `titleKey`，这样可以：

- 支持多语言切换
- 便于维护和统一管理
- 支持动态路由的多语言标题

### 2. 语言包组织

将路由相关的多语言配置统一放在 `src/locales/modules/router.ts` 中：

```typescript
export const routerZhCN = {
  dashboard: {
    dashboard: '仪表盘',
  },
  user: {
    user: '用户管理',
    profile: '个人资料',
  },
  // ... 其他模块
}
```

### 3. 动态路由标题

对于从后端获取的动态路由，确保后端返回的数据包含 `titleKey` 字段：

```json
{
  "path": "/user/profile",
  "name": "UserProfile",
  "component": "views/user/profile.vue",
  "meta": {
    "titleKey": "router.user.profile",
    "roles": ["admin", "user"]
  }
}
```

### 4. 错误页面标题

错误页面的标题也应该使用多语言配置：

```typescript
// src/router/modules/error.ts
{
  path: '/404',
  name: '404',
  component: () => import('@/views/notfound/not-found-page.vue'),
  meta: {
    titleKey: 'router.error.notFound',
    showLink: false,
    parent: 'fullscreen',
  },
}
```

## 注意事项

1. **兼容性**：系统同时支持 `title` 和 `titleKey`，优先使用 `titleKey`
2. **动态路由**：动态路由的标题会在路由守卫中自动处理多语言转换
3. **性能**：标题转换在路由守卫中进行，不会影响页面渲染性能
4. **调试**：在开发环境下可以通过控制台查看路由标题的处理过程
