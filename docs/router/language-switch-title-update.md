# 语言切换时标题动态更新解决方案

## 问题描述

在实现多语言标题功能后，发现当用户切换语言时，浏览器标签页的标题没有实时更新，需要刷新页面才能看到新的标题。

## 问题原因

路由守卫只在路由切换时执行，而语言切换不会触发路由变化，因此标题更新逻辑没有被触发。

## 解决方案

### 1. 监听语言切换事件

在 `useLocale` hook 中添加语言切换监听，当语言变化时直接更新当前页面标题：

```typescript
// src/hooks/modules/useLocale.ts
watch(
  () => getCurrentLocale(),
  newLocale => {
    // 语言切换时触发标题更新
    window.dispatchEvent(
      new CustomEvent('locale-changed', {
        detail: { locale: newLocale },
      })
    )

    // 直接更新当前页面标题
    const currentRoute = router?.currentRoute?.value
    if (currentRoute) {
      const appStore = useAppStoreWithOut()
      const env = import.meta.env
      const title = env.VITE_APP_TITLE || appStore.getTitle

      let pageTitle = title
      if (currentRoute.meta?.titleKey) {
        pageTitle = `${t(currentRoute.meta.titleKey)} - ${title}`
      } else if (currentRoute.meta?.title) {
        pageTitle = `${currentRoute.meta.title} - ${title}`
      }
      document.title = pageTitle
    }
  },
  { immediate: true }
)
```

### 2. 路由守卫中的事件监听

在路由守卫中添加语言切换事件监听，作为备用方案：

```typescript
// src/router/utils/customs.ts
export function registerRouterGuards(router: Router, options: {...}) {
  // 监听语言切换事件，动态更新页面标题
  window.addEventListener('locale-changed', () => {
    updateCurrentPageTitle(router)
  })

  // ... 其他路由守卫逻辑
}
```

### 3. 工具函数

创建专门的工具函数来处理标题更新：

```typescript
// src/router/utils/customs.ts
export const updateCurrentPageTitle = (router: Router) => {
  const appStore = useAppStoreWithOut()
  const env = import.meta.env
  const title = env.VITE_APP_TITLE || appStore.getTitle

  // 获取当前路由
  const currentRoute = router.currentRoute.value

  // 更新页面标题
  document.title = getRouteTitle(currentRoute, title)
}
```

## 实现效果

### 测试页面

创建了一个专门的测试页面 (`src/views/example/views/example-i18n.vue`) 来验证功能：

1. **语言切换按钮**：用户可以点击切换不同语言
2. **实时标题显示**：显示当前页面的标题
3. **浏览器标题监控**：实时显示浏览器标签页的标题
4. **刷新按钮**：手动刷新标题显示

### 测试步骤

1. 访问 `/example/i18n` 页面
2. 点击不同的语言按钮（中文、英文、繁体中文）
3. 观察浏览器标签页标题是否实时更新
4. 查看页面上的标题显示是否正确

## 技术细节

### 1. 事件机制

使用 `CustomEvent` 来触发语言切换事件：

```typescript
window.dispatchEvent(
  new CustomEvent('locale-changed', {
    detail: { locale: newLocale },
  })
)
```

### 2. 响应式监听

使用 Vue 的 `watch` 来监听语言变化：

```typescript
watch(
  () => getCurrentLocale(),
  newLocale => {
    // 处理语言切换逻辑
  }
)
```

### 3. 双重保障

- **主要方案**：在 `useLocale` 中直接更新标题
- **备用方案**：在路由守卫中监听事件更新标题

## 优势

1. **实时更新**：语言切换时标题立即更新，无需刷新页面
2. **双重保障**：两种更新机制确保功能可靠性
3. **性能优化**：只在语言切换时更新，不影响正常路由性能
4. **向后兼容**：不影响现有的路由和语言切换功能

## 注意事项

1. **路由依赖**：需要确保 `router` 实例可用
2. **语言包同步**：确保所有语言包都包含对应的翻译键
3. **错误处理**：添加适当的错误处理机制
4. **性能考虑**：避免频繁的标题更新操作

## 测试验证

### 功能测试

- [x] 语言切换时标题实时更新
- [x] 不同路由的标题正确显示
- [x] 动态路由的标题支持
- [x] 错误页面的标题支持

### 兼容性测试

- [x] 静态路由标题更新
- [x] 动态路由标题更新
- [x] 嵌套路由标题更新
- [x] 参数路由标题更新

## 未来优化

1. **性能优化**：考虑使用防抖机制避免频繁更新
2. **缓存机制**：缓存已翻译的标题避免重复计算
3. **调试工具**：添加标题更新的调试信息
4. **自动化测试**：添加单元测试和集成测试
