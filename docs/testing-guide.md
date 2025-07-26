# 测试指南

## 概述

CC-Admin 采用多层次的测试策略，包括单元测试、组件测试和端到端测试，确保代码质量和应用稳定性。

## 🧪 测试策略

### 测试金字塔

```
    🔺 E2E Tests (少量)
   🔺🔺 Integration Tests (适量)
  🔺🔺🔺 Component Tests (较多)
 🔺🔺🔺🔺 Unit Tests (大量)
```

### 测试配置

```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  test: {
    environment: 'jsdom',
    globals: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
    },
  },
})
```

## 🔬 单元测试

### 工具函数测试

```typescript
// test/utils/format.test.ts
import { describe, it, expect } from 'vitest'
import { formatCurrency } from '@/utils/format'

describe('formatCurrency', () => {
  it('should format number to currency', () => {
    expect(formatCurrency(1234.56)).toBe('¥1,234.56')
  })
})
```

### Store 测试

```typescript
// test/stores/user.test.ts
import { describe, it, expect } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useUserStore } from '@/stores/modules/user'

describe('User Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('should set user info', () => {
    const store = useUserStore()
    const user = { id: 1, name: 'Test' }

    store.setUser(user)
    expect(store.user).toEqual(user)
  })
})
```

## 🧩 组件测试

### Vue 组件测试

```typescript
// test/components/Button.test.ts
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Button from '@/components/ui/Button.vue'

describe('Button', () => {
  it('should render correctly', () => {
    const wrapper = mount(Button, {
      props: { type: 'primary' },
      slots: { default: 'Click me' },
    })

    expect(wrapper.text()).toBe('Click me')
    expect(wrapper.classes()).toContain('btn-primary')
  })

  it('should emit click event', async () => {
    const wrapper = mount(Button)

    await wrapper.trigger('click')
    expect(wrapper.emitted('click')).toBeTruthy()
  })
})
```

### 组合式函数测试

```typescript
// test/composables/useCounter.test.ts
import { describe, it, expect } from 'vitest'
import { useCounter } from '@/composables/useCounter'

describe('useCounter', () => {
  it('should increment counter', () => {
    const { count, increment } = useCounter()

    expect(count.value).toBe(0)
    increment()
    expect(count.value).toBe(1)
  })
})
```

## 🌐 端到端测试

### Playwright 配置

```typescript
// playwright.config.ts
import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: './tests/e2e',
  use: {
    baseURL: 'http://localhost:5173',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { browserName: 'chromium' },
    },
  ],
})
```

### E2E 测试示例

```typescript
// tests/e2e/login.spec.ts
import { test, expect } from '@playwright/test'

test('user can login', async ({ page }) => {
  await page.goto('/login')

  await page.fill('[data-testid="username"]', 'admin')
  await page.fill('[data-testid="password"]', '123456')
  await page.click('[data-testid="login-button"]')

  await expect(page).toHaveURL('/dashboard')
})
```

## 📊 测试覆盖率

### 覆盖率配置

```typescript
// vitest.config.ts
coverage: {
  provider: 'v8',
  reporter: ['text', 'json', 'html'],
  exclude: ['node_modules/', 'dist/', '**/*.d.ts'],
  thresholds: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
}
```

### 覆盖率报告

```bash
# 运行测试并生成覆盖率报告
pnpm test:coverage

# 查看 HTML 报告
open coverage/index.html
```

## 🚀 测试命令

### 常用命令

```bash
# 运行所有测试
pnpm test

# 运行测试并监听变化
pnpm test:watch

# 运行测试并生成覆盖率
pnpm test:coverage

# 运行 E2E 测试
pnpm test:e2e

# 运行特定测试文件
pnpm test utils/format.test.ts
```

### 调试测试

```bash
# 调试模式运行测试
pnpm test --reporter=verbose

# 运行单个测试
pnpm test --run utils/format.test.ts
```

## 🎯 最佳实践

### 1. 测试命名

- 使用描述性的测试名称
- 遵循 "should" 模式
- 清晰表达测试意图

### 2. 测试组织

- 按功能模块组织测试
- 使用 describe 块分组
- 保持测试文件结构清晰

### 3. 测试数据

- 使用工厂函数创建测试数据
- 避免硬编码测试数据
- 使用测试夹具（fixtures）

### 4. 异步测试

```typescript
it('should handle async operations', async () => {
  const result = await asyncFunction()
  expect(result).toBeDefined()
})
```

## 🔧 故障排除

### 常见问题

1. **测试环境问题** - 检查 jsdom 配置
2. **路径别名问题** - 验证 vitest 配置
3. **组件渲染问题** - 检查测试工具配置

### 调试技巧

```typescript
// 调试测试
it('should work', () => {
  console.log('Debug info')
  expect(true).toBe(true)
})
```

通过这套测试体系，CC-Admin 确保了代码质量和应用稳定性。
