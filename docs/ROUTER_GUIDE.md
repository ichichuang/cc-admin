# 增强版路由系统使用指南

## 🎯 概述

基于对 Pure-Admin-Thin 的深入分析，我们设计了一套既保持简洁又功能强大的增强版路由系统。该系统融合了 Pure-Admin 的优秀特性，同时保持了我们项目的统一架构风格。

## 🏗️ 核心特性

### ✨ 主要功能

1. **自动化模块导入** - 无需手动维护路由列表
2. **智能路由排序** - 基于 `rank` 权重自动排序
3. **权限控制支持** - 内置角色权限检查
4. **菜单自动生成** - 从路由配置自动生成菜单树
5. **面包屑支持** - 自动生成面包屑导航
6. **页面缓存控制** - 支持页面级缓存配置
7. **完整类型支持** - TypeScript 类型安全保障

### 🔄 与 Pure-Admin 对比

| 特性       | Pure-Admin | 我们的方案 | 优势           |
| ---------- | ---------- | ---------- | -------------- |
| 自动导入   | ✅         | ✅         | 保持一致       |
| 路由拍平   | ✅ 复杂    | ❌ 简化    | 更简洁，易维护 |
| 权限控制   | ✅ 完整    | ✅ 精简    | 保持核心功能   |
| 类型安全   | ✅         | ✅         | 完整支持       |
| 菜单生成   | ✅         | ✅         | 自动化处理     |
| 配置复杂度 | 🔸 高      | 🔸 中等    | 平衡功能与简洁 |

## 📋 路由配置格式

### 基础路由配置

```typescript
import type { RouteConfig } from '../types'

const routes: RouteConfig[] = [
  {
    path: '/dashboard',
    name: 'dashboard',
    component: () => import('@/views/dashboard/index.vue'),
    meta: {
      // 必需字段
      title: '仪表盘', // 页面标题

      // 可选字段
      icon: 'dashboard', // 菜单图标
      rank: 1, // 排序权重（数值越小越靠前）
      description: '系统主页面', // 页面描述
      showLink: true, // 是否在菜单中显示
      keepAlive: true, // 是否缓存页面
      roles: ['admin', 'user'], // 页面权限角色
      hideBreadcrumb: false, // 是否隐藏面包屑
      isLink: false, // 是否为外链
      linkUrl: '', // 外链地址
      activeMenu: '', // 激活菜单路径
    },
  },
]

export default routes
```

### 嵌套路由配置

```typescript
const routes: RouteConfig[] = [
  {
    path: '/system',
    name: 'system',
    component: () => import('@/layout/index.vue'),
    meta: {
      title: '系统管理',
      icon: 'system',
      rank: 100,
    },
    redirect: '/system/user',
    children: [
      {
        path: '/system/user',
        name: 'system-user',
        component: () => import('@/views/system/user/index.vue'),
        meta: {
          title: '用户管理',
          icon: 'user',
          roles: ['admin'],
          keepAlive: true,
        },
      },
      {
        path: '/system/role',
        name: 'system-role',
        component: () => import('@/views/system/role/index.vue'),
        meta: {
          title: '角色管理',
          icon: 'role',
          roles: ['admin'],
        },
      },
    ],
  },
]
```

## 🛠️ 使用方法

### 1. 创建路由模块

在 `src/router/modules/` 目录下创建新的路由文件：

```typescript
// src/router/modules/user.ts
import type { RouteConfig } from '../types'

const userRoutes: RouteConfig[] = [
  {
    path: '/user',
    name: 'user',
    component: () => import('@/views/user/index.vue'),
    meta: {
      title: '用户中心',
      icon: 'user-circle',
      rank: 50,
      showLink: true,
      keepAlive: true,
    },
  },
]

export default userRoutes
```

### 2. 自动导入生效

路由会自动被扫描和导入，无需手动配置。

### 3. 使用路由工具

```typescript
// 在组件中使用
import { routeUtils } from '@/router'

// 获取菜单树（用于渲染导航菜单）
const menuTree = routeUtils.menuTree

// 获取面包屑映射
const breadcrumbMap = routeUtils.breadcrumbMap

// 获取扁平化路由
const flatRoutes = routeUtils.flatRoutes
```

### 4. 权限控制

```typescript
// 在路由守卫中使用
import { filterAuthorizedRoutes, checkRoutePermission } from '@/router'

// 过滤用户有权限的路由
const userRoles = ['admin', 'user']
const authorizedRoutes = filterAuthorizedRoutes(routes, userRoles)

// 检查单个路由权限
const hasPermission = checkRoutePermission(route, userRoles)
```

## 🎨 最佳实践

### 1. 路由命名规范

```typescript
// ✅ 推荐：使用语义化的路由名称
{
  path: '/user/profile',
  name: 'user-profile',     // kebab-case 命名
  meta: { title: '个人资料' }
}

// ❌ 不推荐：使用简短或不明确的名称
{
  path: '/user/profile',
  name: 'profile',          // 容易冲突
  meta: { title: '个人资料' }
}
```

### 2. 路由排序策略

```typescript
// 系统核心页面：1-10
{
  meta: {
    rank: 1
  }
} // 首页/仪表盘

// 业务功能页面：10-100
{
  meta: {
    rank: 20
  }
} // 用户管理
{
  meta: {
    rank: 30
  }
} // 订单管理

// 系统管理页面：100+
{
  meta: {
    rank: 100
  }
} // 系统设置
{
  meta: {
    rank: 110
  }
} // 权限管理
```

### 3. 权限设计

```typescript
// 基于角色的权限控制
{
  meta: {
    roles: ['admin'],           // 仅管理员可访问
  }
}

{
  meta: {
    roles: ['admin', 'editor'], // 管理员和编辑者可访问
  }
}

// 公开页面（无权限要求）
{
  meta: {
    // 不设置 roles 字段
  }
}
```

### 4. 页面缓存策略

```typescript
// 需要缓存的页面（如列表页）
{
  meta: {
    keepAlive: true,    // 缓存页面状态
  }
}

// 不需要缓存的页面（如表单页）
{
  meta: {
    keepAlive: false,   // 每次进入都重新加载
  }
}
```

## 🔧 高级功能

### 1. 外链路由

```typescript
{
  path: '/external',
  name: 'external',
  meta: {
    title: '外部链接',
    icon: 'external-link',
    isLink: true,
    linkUrl: 'https://github.com',
    showLink: true,
  },
}
```

### 2. 隐藏菜单路由

```typescript
{
  path: '/user/detail/:id',
  name: 'user-detail',
  component: () => import('@/views/user/detail.vue'),
  meta: {
    title: '用户详情',
    showLink: false,        // 不在菜单中显示
    activeMenu: '/user',    // 激活父级菜单
  },
}
```

### 3. 面包屑控制

```typescript
{
  path: '/dashboard',
  meta: {
    title: '仪表盘',
    hideBreadcrumb: true,   // 不显示在面包屑中
  },
}
```

## 📚 API 参考

### 路由工具函数

- `sortRoutes(routes)` - 路由排序
- `flattenRoutes(routes)` - 路由扁平化
- `generateMenuTree(routes)` - 生成菜单树
- `filterAuthorizedRoutes(routes, roles)` - 权限过滤
- `checkRoutePermission(route, roles)` - 权限检查
- `findRouteByPath(routes, path)` - 路径查找
- `transformToVueRoutes(routes)` - 格式转换

### 类型定义

- `RouteConfig` - 增强路由配置
- `RouteMeta` - 路由元信息
- `MenuItem` - 菜单项类型
- `RouteUtils` - 路由工具集

## 🚀 迁移指南

### 从原始路由系统迁移

1. **更新导入类型**：

   ```typescript
   // 旧版本
   import type { RouteRecordRaw } from 'vue-router'

   // 新版本
   import type { RouteConfig } from '../types'
   ```

2. **增强 Meta 配置**：

   ```typescript
   // 旧版本
   meta: {
     title: '页面标题',
     description: '页面描述',
   }

   // 新版本
   meta: {
     title: '页面标题',
     description: '页面描述',
     icon: 'page-icon',
     rank: 10,
     showLink: true,
     keepAlive: false,
   }
   ```

3. **使用路由工具**：
   ```typescript
   // 在需要菜单数据的组件中
   import { routeUtils } from '@/router'
   const menuData = routeUtils.menuTree
   ```

## 💡 总结

这套增强版路由系统在保持简洁性的同时，提供了企业级应用所需的核心功能：

- ✅ **简单易用** - 保持学习成本低
- ✅ **功能完整** - 满足大部分业务需求
- ✅ **可扩展性** - 支持自定义扩展
- ✅ **类型安全** - 完整的 TypeScript 支持
- ✅ **自动化** - 减少手动维护工作

相比 Pure-Admin 的复杂度，我们的方案更适合中小型项目，同时保留了核心的企业级特性。
