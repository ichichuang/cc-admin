# 多语言标题使用指南

## 概述

CC-Admin 支持在路由配置中使用多语言标题，通过 `titleKey` 字段实现国际化。这种方式特别适合动态路由场景，因为标题的翻译逻辑在路由守卫中统一处理。

## 实现原理

### 1. 路由配置中使用 titleKey

```typescript
// src/router/modules/dashboard.ts
const dashboardRoutes: RouteConfig[] = [
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('@/views/dashboard/index.vue'),
    meta: {
      titleKey: 'router.dashboard.dashboard', // 多语言 key
      rank: 1,
      roles: ['admin', 'user'],
    },
  },
]
```

### 2. 路由守卫中处理多语言转换

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

### 3. 语言包配置

```typescript
// src/locales/modules/router.ts
export const routerZhCN: RouterLocaleMessages = {
  dashboard: {
    dashboard: '仪表盘',
  },
  example: {
    example: '示例',
    color: '主题',
    size: '尺寸',
    i18n: '国际化',
    rem: 'rem 适配',
    mock: 'Mock 示例',
  },
  error: {
    notFound: '页面未找到',
    forbidden: '访问被拒绝',
    serverError: '服务器错误',
  },
}

export const routerEnUS: RouterLocaleMessages = {
  dashboard: {
    dashboard: 'Dashboard',
  },
  example: {
    example: 'Example',
    color: 'Theme',
    size: 'Size',
    i18n: 'I18n',
    rem: 'rem Adapter',
    mock: 'Mock Example',
  },
  error: {
    notFound: 'Page Not Found',
    forbidden: 'Forbidden',
    serverError: 'Server Error',
  },
}
```

## 动态路由示例

### 后端返回的路由数据结构

```json
{
  "routes": [
    {
      "path": "/user",
      "name": "User",
      "component": "views/user/index.vue",
      "meta": {
        "titleKey": "router.user.user",
        "icon": "user",
        "roles": ["admin"],
        "rank": 2
      },
      "children": [
        {
          "path": "list",
          "name": "UserList",
          "component": "views/user/list.vue",
          "meta": {
            "titleKey": "router.user.list",
            "roles": ["admin"]
          }
        },
        {
          "path": "profile",
          "name": "UserProfile",
          "component": "views/user/profile.vue",
          "meta": {
            "titleKey": "router.user.profile",
            "roles": ["admin", "user"]
          }
        }
      ]
    },
    {
      "path": "/system",
      "name": "System",
      "component": "views/system/index.vue",
      "meta": {
        "titleKey": "router.system.system",
        "icon": "setting",
        "roles": ["admin"],
        "rank": 3
      },
      "children": [
        {
          "path": "settings",
          "name": "SystemSettings",
          "component": "views/system/settings.vue",
          "meta": {
            "titleKey": "router.system.settings",
            "roles": ["admin"]
          }
        }
      ]
    }
  ]
}
```

### 对应的语言包配置

```typescript
// src/locales/modules/router.ts
export const routerZhCN: RouterLocaleMessages = {
  // ... 现有配置
  user: {
    user: '用户管理',
    list: '用户列表',
    profile: '个人资料',
  },
  system: {
    system: '系统管理',
    settings: '系统设置',
  },
}

export const routerEnUS: RouterLocaleMessages = {
  // ... 现有配置
  user: {
    user: 'User Management',
    list: 'User List',
    profile: 'User Profile',
  },
  system: {
    system: 'System Management',
    settings: 'System Settings',
  },
}
```

## 使用场景

### 1. 静态路由

对于预定义的路由，直接在路由配置中使用 `titleKey`：

```typescript
// src/router/modules/example.ts
const exampleRoutes: RouteConfig[] = [
  {
    path: '/example',
    name: 'Example',
    component: () => import('@/views/example/index.vue'),
    redirect: '/example/color',
    meta: {
      titleKey: 'router.example.example',
      rank: 1,
      parent: 'fullscreen',
    },
    children: [
      {
        path: 'color',
        name: 'ExampleColor',
        component: () => import('@/views/example/views/example-color.vue'),
        meta: {
          titleKey: 'router.example.color',
          rank: 1,
        },
      },
    ],
  },
]
```

### 2. 动态路由

对于从后端获取的动态路由，确保后端返回的数据包含 `titleKey` 字段：

```typescript
// 后端 API 返回的数据结构
interface BackendRouteConfig {
  path: string
  name?: string
  component?: string
  redirect?: string
  meta: {
    titleKey: string // 多语言标题 key
    icon?: string
    roles?: string[]
    rank?: number
    // ... 其他元信息
  }
  children?: BackendRouteConfig[]
}
```

### 3. 错误页面

错误页面也支持多语言标题：

```typescript
// src/router/modules/error.ts
const errorRoutes: RouteConfig[] = [
  {
    path: '/404',
    name: '404',
    component: () => import('@/views/notfound/not-found-page.vue'),
    meta: {
      titleKey: 'router.error.notFound',
      showLink: false,
      parent: 'fullscreen',
    },
  },
  {
    path: '/403',
    name: '403',
    component: () => import('@/views/notfound/forbidden-page.vue'),
    meta: {
      titleKey: 'router.error.forbidden',
      showLink: false,
      parent: 'fullscreen',
    },
  },
]
```

## 最佳实践

### 1. 语言包组织

将路由相关的多语言配置按模块组织：

```typescript
// src/locales/modules/router.ts
export const routerZhCN: RouterLocaleMessages = {
  // 核心模块
  core: {
    login: '登录',
  },

  // 仪表盘模块
  dashboard: {
    dashboard: '仪表盘',
  },

  // 示例模块
  example: {
    example: '示例',
    color: '主题',
    size: '尺寸',
    i18n: '国际化',
    rem: 'rem 适配',
    mock: 'Mock 示例',
  },

  // 用户模块
  user: {
    user: '用户管理',
    list: '用户列表',
    profile: '个人资料',
    create: '创建用户',
    edit: '编辑用户',
  },

  // 系统模块
  system: {
    system: '系统管理',
    settings: '系统设置',
    logs: '系统日志',
  },

  // 错误页面
  error: {
    notFound: '页面未找到',
    forbidden: '访问被拒绝',
    serverError: '服务器错误',
  },
}
```

### 2. 命名规范

- 使用点分隔的命名方式：`router.module.action`
- 模块名使用小写字母
- 动作名使用小写字母
- 保持命名的一致性和可读性

### 3. 类型安全

确保语言包的类型定义完整：

```typescript
// src/locales/types.ts
export interface RouterLocaleMessages {
  core: {
    login: string
  }
  dashboard: {
    dashboard: string
  }
  example: {
    example: string
    color: string
    size: string
    i18n: string
    rem: string
    mock: string
  }
  user: {
    user: string
    list: string
    profile: string
    create: string
    edit: string
  }
  system: {
    system: string
    settings: string
    logs: string
  }
  error: {
    notFound: string
    forbidden: string
    serverError: string
  }
}
```

## 调试和测试

### 1. 检查标题是否正确显示

在浏览器开发者工具中检查页面标题：

```javascript
// 在控制台中检查当前页面标题
console.log(document.title)

// 检查路由元信息
console.log(router.currentRoute.value.meta)
```

### 2. 测试多语言切换

```typescript
// 在组件中测试多语言切换
import { useLocale } from '@/hooks'

const { locale, setLocale } = useLocale()

// 切换语言
setLocale('en-US')
setLocale('zh-CN')
```

### 3. 动态路由测试

```typescript
// 测试动态路由的标题处理
const testDynamicRoute = {
  path: '/test',
  name: 'Test',
  component: 'views/test/index.vue',
  meta: {
    titleKey: 'router.test.test',
    roles: ['admin'],
  },
}

// 添加测试路由
router.addRoute(testDynamicRoute)
```

## 注意事项

1. **性能考虑**：标题转换在路由守卫中进行，不会影响页面渲染性能
2. **兼容性**：系统同时支持 `title` 和 `titleKey`，优先使用 `titleKey`
3. **动态路由**：确保后端返回的动态路由数据包含 `titleKey` 字段
4. **语言包同步**：添加新的路由时，记得同步更新语言包配置
5. **类型安全**：使用 TypeScript 确保语言包的类型定义完整
