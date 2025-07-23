# 路由配置指南

## 概述

CC-Admin 基于 Vue Router 4+ 构建了完整的路由管理系统，采用模块化设计，支持路由懒加载、权限控制、路由守卫等企业级功能。

## 🏗️ 架构设计

### 目录结构

```
src/router/
├── index.ts              # 🚪 路由器配置和导出
├── modules/              # 📦 路由模块
│   ├── core.ts           # 核心路由（登录、404等）
│   ├── dashboard.ts      # 仪表盘路由
│   ├── error.ts          # 错误页面路由
│   └── example.ts        # 示例页面路由
└── utils/                # 🔧 路由工具
    ├── customs.ts        # 自定义路由处理
    ├── helper.ts         # 路由辅助函数
    └── index.ts          # 工具函数导出
```

### 自动导入机制

```typescript
// src/router/index.ts
import { autoImportModulesSync } from '@/utils/moduleLoader'

// 自动导入所有路由模块
const modules = import.meta.glob('./modules/**/*.ts', { eager: true })
const routeModules = autoImportModulesSync<RouteRecordRaw[]>(modules)

// 扁平化路由配置
const routes: RouteRecordRaw[] = routeModules.flat()
```

## 📚 路由模块详解

### 1. 核心路由模块 (core.ts)

```typescript
// src/router/modules/core.ts
import type { RouteRecordRaw } from 'vue-router'

const coreRoutes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Root',
    redirect: `/dashboard`, // 从环境变量读取默认重定向
    meta: {
      title: '首页',
      hidden: true,
    },
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/login/index.vue'),
    meta: {
      title: '登录',
      hidden: true,
      requiresAuth: false, // 不需要登录
      layout: 'fullscreen', // 全屏布局
    },
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('@/views/dashboard/index.vue'),
    meta: {
      title: '仪表盘',
      icon: 'i-mdi:view-dashboard',
      requiresAuth: true,
      layout: 'admin',
      order: 1, // 菜单排序
    },
  },
]

export default coreRoutes
```

### 2. 业务路由模块 (example.ts)

```typescript
// src/router/modules/example.ts
const exampleRoutes: RouteRecordRaw[] = [
  {
    path: '/example',
    name: 'Example',
    component: () => import('@/views/example/index.vue'),
    meta: {
      title: '示例页面',
      icon: 'i-mdi:folder-multiple',
      requiresAuth: true,
      order: 2,
    },
    children: [
      {
        path: 'color',
        name: 'ExampleColor',
        component: () => import('@/views/example/views/example-color.vue'),
        meta: {
          title: '主题颜色',
          requiresAuth: true,
        },
      },
      {
        path: 'size',
        name: 'ExampleSize',
        component: () => import('@/views/example/views/example-size.vue'),
        meta: {
          title: '尺寸配置',
          requiresAuth: true,
        },
      },
      {
        path: 'i18n',
        name: 'ExampleI18n',
        component: () => import('@/views/example/views/example-i18n.vue'),
        meta: {
          title: '国际化',
          requiresAuth: true,
        },
      },
      {
        path: 'rem',
        name: 'ExampleRem',
        component: () => import('@/views/example/views/example-rem.vue'),
        meta: {
          title: 'Rem适配',
          requiresAuth: true,
        },
      },
    ],
  },
]

export default exampleRoutes
```

### 3. 错误页面路由 (error.ts)

```typescript
// src/router/modules/error.ts
const errorRoutes: RouteRecordRaw[] = [
  {
    path: '/403',
    name: 'Forbidden',
    component: () => import('@/views/notfound/forbidden-page.vue'),
    meta: {
      title: '权限不足',
      hidden: true,
      requiresAuth: false,
      layout: 'screen',
    },
  },
  {
    path: '/404',
    name: 'NotFound',
    component: () => import('@/views/notfound/not-found-page.vue'),
    meta: {
      title: '页面未找到',
      hidden: true,
      requiresAuth: false,
      layout: 'screen',
    },
  },
  {
    path: '/500',
    name: 'ServerError',
    component: () => import('@/views/notfound/server-error-page.vue'),
    meta: {
      title: '服务器错误',
      hidden: true,
      requiresAuth: false,
      layout: 'screen',
    },
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFoundCatch',
    redirect: '/404',
    meta: {
      hidden: true,
    },
  },
]

export default errorRoutes
```

## 🔐 路由元信息 (Meta)

### Route Meta 接口定义

```typescript
// src/Types/router.d.ts
declare module 'vue-router' {
  interface RouteMeta {
    /** 页面标题 */
    title?: string
    /** 图标 */
    icon?: string
    /** 是否在菜单中隐藏 */
    hidden?: boolean
    /** 是否需要登录认证 */
    requiresAuth?: boolean
    /** 需要的权限列表 */
    permissions?: string[]
    /** 需要的角色列表 */
    roles?: string[]
    /** 布局类型 */
    layout?: 'admin' | 'screen' | 'fullscreen'
    /** 菜单排序 */
    order?: number
    /** 是否缓存页面 */
    keepAlive?: boolean
    /** 面包屑路径 */
    breadcrumb?: string[]
    /** 是否为外链 */
    external?: boolean
    /** 外链地址 */
    externalUrl?: string
    /** 页面加载模式 */
    loading?: boolean
  }
}
```

### Meta 字段说明

| 字段名         | 类型                                  | 说明             | 默认值    |
| -------------- | ------------------------------------- | ---------------- | --------- |
| `title`        | `string`                              | 页面标题         | -         |
| `icon`         | `string`                              | 菜单图标         | -         |
| `hidden`       | `boolean`                             | 是否在菜单中隐藏 | `false`   |
| `requiresAuth` | `boolean`                             | 是否需要登录认证 | `true`    |
| `permissions`  | `string[]`                            | 需要的权限列表   | `[]`      |
| `roles`        | `string[]`                            | 需要的角色列表   | `[]`      |
| `layout`       | `'admin' \| 'screen' \| 'fullscreen'` | 布局类型         | `'admin'` |
| `order`        | `number`                              | 菜单排序         | `999`     |
| `keepAlive`    | `boolean`                             | 是否缓存页面     | `false`   |
| `breadcrumb`   | `string[]`                            | 自定义面包屑路径 | -         |
| `external`     | `boolean`                             | 是否为外链       | `false`   |
| `externalUrl`  | `string`                              | 外链地址         | -         |

## 🛡️ 路由守卫

### 全局前置守卫

```typescript
// src/router/index.ts
import { useUserStore } from '@/stores/modules/user'
import { usePermissionStore } from '@/stores/modules/permission'

router.beforeEach(async (to, from, next) => {
  const userStore = useUserStore()
  const permissionStore = usePermissionStore()

  // 🔄 设置页面标题
  document.title = to.meta.title ? `${to.meta.title} - CC-Admin` : 'CC-Admin'

  // 🔐 权限检查
  if (to.meta.requiresAuth !== false) {
    // 需要登录的页面
    if (!userStore.isLoggedIn) {
      next({
        path: '/login',
        query: { redirect: to.fullPath },
      })
      return
    }

    // 角色权限检查
    if (to.meta.roles?.length) {
      const hasRole = to.meta.roles.some(role => userStore.hasRole(role))
      if (!hasRole) {
        next('/403')
        return
      }
    }

    // 功能权限检查
    if (to.meta.permissions?.length) {
      const hasPermission = to.meta.permissions.some(permission =>
        userStore.hasPermission(permission)
      )
      if (!hasPermission) {
        next('/403')
        return
      }
    }
  }

  // 📊 记录路由访问
  if (import.meta.env.DEV) {
    console.log(`🧭 路由导航: ${from.path} → ${to.path}`)
  }

  next()
})
```

### 全局后置守卫

```typescript
router.afterEach((to, from) => {
  // 📈 页面访问统计
  if (to.meta.title) {
    // 可以在这里添加页面访问统计
    console.log(`📊 页面访问: ${to.meta.title}`)
  }

  // 🔄 更新面包屑
  const layoutStore = useLayoutStore()
  layoutStore.updateBreadcrumb(to)

  // 💾 保存访问历史
  const visitHistory = JSON.parse(localStorage.getItem('visit-history') || '[]')
  visitHistory.unshift({
    path: to.path,
    title: to.meta.title,
    timestamp: Date.now(),
  })
  localStorage.setItem('visit-history', JSON.stringify(visitHistory.slice(0, 10)))
})
```

## 🔧 路由工具函数

### 路由辅助函数

```typescript
// src/router/utils/helper.ts
import type { RouteRecordRaw, RouteLocationNormalized } from 'vue-router'

/**
 * 生成面包屑数据
 */
export function generateBreadcrumb(route: RouteLocationNormalized) {
  const breadcrumbList: Array<{ title: string; path: string }> = []

  // 自定义面包屑
  if (route.meta.breadcrumb) {
    return route.meta.breadcrumb.map((title, index) => ({
      title,
      path: index === route.meta.breadcrumb!.length - 1 ? route.path : '#',
    }))
  }

  // 自动生成面包屑
  const pathArray = route.path.split('/').filter(Boolean)
  let currentPath = ''

  pathArray.forEach((path, index) => {
    currentPath += `/${path}`
    const matchedRoute = router.resolve(currentPath)

    if (matchedRoute.meta.title) {
      breadcrumbList.push({
        title: matchedRoute.meta.title,
        path: index === pathArray.length - 1 ? route.path : currentPath,
      })
    }
  })

  return breadcrumbList
}

/**
 * 获取菜单树结构
 */
export function generateMenuTree(routes: RouteRecordRaw[]): MenuItem[] {
  return routes
    .filter(route => !route.meta?.hidden)
    .sort((a, b) => (a.meta?.order || 999) - (b.meta?.order || 999))
    .map(route => ({
      key: route.name as string,
      title: route.meta?.title || (route.name as string),
      icon: route.meta?.icon,
      path: route.path,
      children: route.children ? generateMenuTree(route.children) : undefined,
    }))
}

/**
 * 检查路由权限
 */
export function checkRoutePermission(
  route: RouteRecordRaw,
  userPermissions: string[],
  userRoles: string[]
): boolean {
  // 检查角色权限
  if (route.meta?.roles?.length) {
    const hasRole = route.meta.roles.some(role => userRoles.includes(role))
    if (!hasRole) return false
  }

  // 检查功能权限
  if (route.meta?.permissions?.length) {
    const hasPermission = route.meta.permissions.some(permission =>
      userPermissions.includes(permission)
    )
    if (!hasPermission) return false
  }

  return true
}

/**
 * 过滤用户可访问的路由
 */
export function filterAccessibleRoutes(
  routes: RouteRecordRaw[],
  userPermissions: string[],
  userRoles: string[]
): RouteRecordRaw[] {
  return routes.filter(route => {
    const hasAccess = checkRoutePermission(route, userPermissions, userRoles)

    if (hasAccess && route.children) {
      route.children = filterAccessibleRoutes(route.children, userPermissions, userRoles)
    }

    return hasAccess
  })
}
```

### 路由跳转工具

```typescript
// src/router/utils/customs.ts
import type { Router } from 'vue-router'

/**
 * 编程式导航工具类
 */
export class NavigationHelper {
  constructor(private router: Router) {}

  /**
   * 安全跳转（带错误处理）
   */
  async safePush(to: string | object) {
    try {
      await this.router.push(to)
    } catch (error: any) {
      if (error.name !== 'NavigationDuplicated') {
        console.error('路由跳转失败:', error)
      }
    }
  }

  /**
   * 替换当前路由
   */
  async safeReplace(to: string | object) {
    try {
      await this.router.replace(to)
    } catch (error: any) {
      console.error('路由替换失败:', error)
    }
  }

  /**
   * 返回上一页
   */
  goBack() {
    window.history.length > 1 ? this.router.go(-1) : this.router.push('/')
  }

  /**
   * 刷新当前页面
   */
  refresh() {
    const { fullPath } = this.router.currentRoute.value
    this.router.replace({ path: '/redirect' + fullPath })
  }

  /**
   * 打开新标签页
   */
  openInNewTab(to: string | object) {
    const resolved = this.router.resolve(to)
    window.open(resolved.href, '_blank')
  }

  /**
   * 获取路由参数
   */
  getParams<T = Record<string, string>>(): T {
    return this.router.currentRoute.value.params as T
  }

  /**
   * 获取查询参数
   */
  getQuery<T = Record<string, string>>(): T {
    return this.router.currentRoute.value.query as T
  }
}

// 导出实例
export const navigationHelper = new NavigationHelper(router)
```

## 🚀 高级功能

### 1. 动态路由

```typescript
// 动态添加路由
export function addDynamicRoutes(routes: RouteRecordRaw[]) {
  routes.forEach(route => {
    router.addRoute(route)
  })
}

// 根据用户权限动态生成路由
export async function generateDynamicRoutes(userPermissions: string[]) {
  const dynamicRoutes: RouteRecordRaw[] = []

  // 根据权限生成路由配置
  if (userPermissions.includes('admin:user')) {
    dynamicRoutes.push({
      path: '/admin/users',
      name: 'AdminUsers',
      component: () => import('@/views/admin/users.vue'),
      meta: {
        title: '用户管理',
        permissions: ['admin:user'],
      },
    })
  }

  addDynamicRoutes(dynamicRoutes)
  return dynamicRoutes
}
```

### 2. 路由懒加载组

```typescript
// 按模块分组懒加载
const lazyLoadGroups = {
  // 用户模块
  user: () => import('@/views/user/index.vue'),
  userProfile: () => import('@/views/user/profile.vue'),
  userSettings: () => import('@/views/user/settings.vue'),

  // 管理模块
  admin: () => import('@/views/admin/index.vue'),
  adminUsers: () => import('@/views/admin/users.vue'),
  adminRoles: () => import('@/views/admin/roles.vue'),
}

// 使用魔法注释进行分组
const routeComponents = {
  Dashboard: () => import(/* webpackChunkName: "dashboard" */ '@/views/dashboard/index.vue'),
  UserProfile: () => import(/* webpackChunkName: "user" */ '@/views/user/profile.vue'),
  AdminPanel: () => import(/* webpackChunkName: "admin" */ '@/views/admin/index.vue'),
}
```

### 3. 路由缓存管理

```typescript
// src/router/utils/cache.ts
export class RouteCacheManager {
  private cacheList = new Set<string>()

  /**
   * 添加缓存
   */
  addCache(name: string) {
    this.cacheList.add(name)
  }

  /**
   * 移除缓存
   */
  removeCache(name: string) {
    this.cacheList.delete(name)
  }

  /**
   * 清空缓存
   */
  clearCache() {
    this.cacheList.clear()
  }

  /**
   * 获取缓存列表
   */
  getCacheList() {
    return Array.from(this.cacheList)
  }

  /**
   * 检查是否应该缓存
   */
  shouldCache(route: RouteLocationNormalized): boolean {
    return route.meta.keepAlive === true && route.name !== undefined
  }
}

export const routeCacheManager = new RouteCacheManager()
```

### 4. 路由预加载

```typescript
// 路由预加载策略
export function preloadRoutes(routes: string[]) {
  routes.forEach(routeName => {
    const route = router.resolve({ name: routeName })
    if (route.matched.length) {
      // 预加载组件
      route.matched.forEach(match => {
        if (typeof match.components?.default === 'function') {
          ;(match.components.default as Function)()
        }
      })
    }
  })
}

// 在用户 hover 菜单时预加载
export function setupPreloadOnHover() {
  document.addEventListener('mouseover', event => {
    const target = event.target as HTMLElement
    const routeLink = target.closest('[data-route-name]')

    if (routeLink) {
      const routeName = routeLink.getAttribute('data-route-name')
      if (routeName) {
        preloadRoutes([routeName])
      }
    }
  })
}
```

## 🔧 最佳实践

### 1. 路由命名规范

```typescript
// ✅ 推荐的路由命名
const routes: RouteRecordRaw[] = [
  {
    name: 'Dashboard', // 大驼峰，简洁明了
    path: '/dashboard', // 小写，用短横线分隔
    // ...
  },
  {
    name: 'UserProfile', // 模块+功能的组合
    path: '/user/profile',
    // ...
  },
  {
    name: 'AdminUserManagement', // 明确的层级关系
    path: '/admin/users',
    // ...
  },
]

// ❌ 避免的命名方式
const badRoutes: RouteRecordRaw[] = [
  {
    name: 'dashboard_page', // 下划线分隔
    path: '/Dashboard', // 大写路径
  },
  {
    name: 'page1', // 无意义的名称
    path: '/p1', // 无意义的路径
  },
]
```

### 2. 组件懒加载优化

```typescript
// 使用 webpackChunkName 进行分组
const optimizedRoutes: RouteRecordRaw[] = [
  {
    path: '/user',
    component: () =>
      import(
        /* webpackChunkName: "user" */
        '@/views/user/index.vue'
      ),
    children: [
      {
        path: 'profile',
        component: () =>
          import(
            /* webpackChunkName: "user" */
            '@/views/user/profile.vue'
          ),
      },
      {
        path: 'settings',
        component: () =>
          import(
            /* webpackChunkName: "user" */
            '@/views/user/settings.vue'
          ),
      },
    ],
  },
]
```

### 3. 路由参数验证

```typescript
// 路由参数验证器
export function createRouteValidator(rules: Record<string, (value: string) => boolean>) {
  return (route: RouteLocationNormalized): boolean => {
    for (const [param, validator] of Object.entries(rules)) {
      const value = route.params[param] as string
      if (!validator(value)) {
        return false
      }
    }
    return true
  }
}

// 使用示例
const userRouteValidator = createRouteValidator({
  id: value => /^\d+$/.test(value), // 必须是数字
  slug: value => /^[a-z0-9-]+$/.test(value), // 只能包含小写字母、数字、短横线
})

const userRoutes: RouteRecordRaw[] = [
  {
    path: '/user/:id(\\d+)/:slug',
    name: 'UserDetail',
    component: () => import('@/views/user/detail.vue'),
    beforeEnter: (to, from, next) => {
      if (userRouteValidator(to)) {
        next()
      } else {
        next('/404')
      }
    },
  },
]
```

### 4. 错误边界处理

```typescript
// 路由级别的错误处理
router.onError((error, to, from) => {
  console.error('路由错误:', error)

  // 根据错误类型进行不同处理
  if (error.message.includes('Loading chunk')) {
    // 模块加载失败，可能是版本更新导致
    window.location.reload()
  } else {
    // 其他错误，跳转到错误页面
    router.push('/500')
  }
})
```

## 📋 路由配置清单

### 路由模块清单

| 模块        | 文件路径             | 描述         | 包含路由                |
| ----------- | -------------------- | ------------ | ----------------------- |
| **core**    | `modules/core.ts`    | 核心路由模块 | 首页、登录、仪表盘      |
| **error**   | `modules/error.ts`   | 错误页面路由 | 403、404、500、通配符   |
| **example** | `modules/example.ts` | 示例页面路由 | 颜色、尺寸、国际化、rem |
| **admin**   | `modules/admin.ts`   | 管理后台路由 | 用户、角色、权限管理    |
| **user**    | `modules/user.ts`    | 用户相关路由 | 个人资料、设置          |

### 工具函数清单

| 函数名                   | 文件路径           | 描述           |
| ------------------------ | ------------------ | -------------- |
| `generateBreadcrumb`     | `utils/helper.ts`  | 生成面包屑导航 |
| `generateMenuTree`       | `utils/helper.ts`  | 生成菜单树结构 |
| `checkRoutePermission`   | `utils/helper.ts`  | 检查路由权限   |
| `filterAccessibleRoutes` | `utils/helper.ts`  | 过滤可访问路由 |
| `NavigationHelper`       | `utils/customs.ts` | 导航辅助工具类 |
| `RouteCacheManager`      | `utils/cache.ts`   | 路由缓存管理器 |

## 🎯 总结

CC-Admin 的路由系统具有以下特点：

- ✅ **模块化设计**: 按功能模块拆分路由配置
- ✅ **自动导入**: 通过工具函数自动加载路由模块
- ✅ **权限控制**: 基于角色和权限的路由守卫
- ✅ **懒加载**: 支持组件级别的懒加载和分组
- ✅ **类型安全**: 完整的 TypeScript 类型定义
- ✅ **工具丰富**: 提供丰富的路由操作工具函数
- ✅ **性能优化**: 路由预加载和缓存管理
- ✅ **开发友好**: 完善的错误处理和调试功能

通过统一的架构设计和最佳实践，确保路由系统的可维护性和扩展性！🚀
