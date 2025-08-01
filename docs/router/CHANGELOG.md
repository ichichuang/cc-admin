# 路由系统变更日志

## [2025-01-XX] - 多语言标题功能实现

### 新增功能

#### 1. 多语言标题支持

- **功能描述**: 在路由配置中使用 `titleKey` 字段实现多语言标题
- **实现方式**: 在路由守卫中统一处理多语言标题转换
- **兼容性**: 同时支持 `title` 和 `titleKey`，优先使用 `titleKey`

#### 2. 路由守卫优化

- **新增函数**: `getRouteTitle()` - 统一处理路由标题的多语言转换
- **优化逻辑**: 在路由守卫中自动处理标题的国际化转换
- **性能优化**: 标题转换在路由守卫中进行，不影响页面渲染性能

#### 3. 类型定义更新

- **新增字段**: `RouteMeta` 接口新增 `titleKey?: string` 字段
- **类型安全**: 确保多语言标题配置的类型安全

### 修改的文件

#### 核心文件

1. **src/Types/router.d.ts**
   - 新增 `titleKey?: string` 字段到 `RouteMeta` 接口
   - 将 `title` 字段改为可选

2. **src/router/utils/customs.ts**
   - 新增 `getRouteTitle()` 工具函数
   - 优化路由守卫中的标题处理逻辑
   - 添加多语言支持导入

#### 路由模块文件

3. **src/router/modules/dashboard.ts**
   - 将 `title: t('router.dashboard.dashboard')` 改为 `titleKey: 'router.dashboard.dashboard'`
   - 移除未使用的 `t` 导入

4. **src/router/modules/example.ts**
   - 将所有 `title` 字段改为 `titleKey`
   - 移除未使用的 `t` 导入

5. **src/router/modules/core.ts**
   - 将 `title: t('router.core.login')` 改为 `titleKey: 'router.core.login'`
   - 移除未使用的 `t` 导入

6. **src/router/modules/error.ts**
   - 将所有错误页面的 `title` 字段改为 `titleKey`
   - 移除未使用的 `t` 导入

#### 文档文件

7. **docs/router/README.md**
   - 更新路由管理文档
   - 添加多语言标题配置说明
   - 更新最佳实践指南

8. **docs/router/multilingual-titles.md** (新增)
   - 详细的多语言标题使用指南
   - 包含实现原理、使用场景、最佳实践
   - 提供调试和测试方法

### 使用方式

#### 静态路由配置

```typescript
// 推荐方式：使用 titleKey
const routes: RouteConfig[] = [
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

#### 动态路由配置

```typescript
// 后端返回的路由数据结构
{
  "path": "/user",
  "name": "User",
  "component": "views/user/index.vue",
  "meta": {
    "titleKey": "router.user.user", // 多语言 key
    "roles": ["admin"],
  },
}
```

#### 语言包配置

```typescript
// src/locales/modules/router.ts
export const routerZhCN: RouterLocaleMessages = {
  dashboard: {
    dashboard: '仪表盘',
  },
  user: {
    user: '用户管理',
  },
  // ... 其他模块
}
```

### 技术实现

#### 1. 路由守卫处理

```typescript
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

#### 2. 类型定义

```typescript
declare interface RouteMeta {
  /** 页面标题（支持国际化 key） */
  title?: string

  /** 页面标题国际化 key */
  titleKey?: string

  // ... 其他字段
}
```

### 优势

1. **统一管理**: 所有路由标题的多语言配置统一在语言包中管理
2. **动态支持**: 完美支持动态路由的多语言标题
3. **类型安全**: 完整的 TypeScript 类型定义
4. **性能优化**: 标题转换在路由守卫中进行，不影响渲染性能
5. **向后兼容**: 同时支持 `title` 和 `titleKey`，确保平滑升级

### 注意事项

1. **语言包同步**: 添加新的路由时，记得同步更新语言包配置
2. **命名规范**: 使用点分隔的命名方式，如 `router.module.action`
3. **动态路由**: 确保后端返回的动态路由数据包含 `titleKey` 字段
4. **类型定义**: 确保语言包的类型定义完整

### 迁移指南

#### 从旧版本迁移

1. **静态路由**: 将 `title: t('key')` 改为 `titleKey: 'key'`
2. **移除导入**: 移除路由文件中的 `import { t } from '@/locales'`
3. **语言包**: 确保语言包中包含对应的翻译键值
4. **测试**: 测试所有路由的标题是否正确显示

#### 示例迁移

```typescript
// 迁移前
import { t } from '@/locales'
const routes: RouteConfig[] = [
  {
    path: '/dashboard',
    meta: {
      title: t('router.dashboard.dashboard'),
    },
  },
]

// 迁移后
const routes: RouteConfig[] = [
  {
    path: '/dashboard',
    meta: {
      titleKey: 'router.dashboard.dashboard',
    },
  },
]
```

### 未来计划

1. **自动生成**: 考虑自动生成语言包类型定义
2. **工具函数**: 添加更多路由相关的工具函数
3. **性能监控**: 添加路由性能监控功能
4. **调试工具**: 开发路由调试工具
