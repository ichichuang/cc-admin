# 测试指南

## 概述

CC-Admin 采用多层次的测试策略，包括单元测试、组件测试、集成测试和端到端测试，确保代码质量和应用稳定性。

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
import path from 'path'

export default defineConfig({
  plugins: [vue()],

  test: {
    // 测试环境
    environment: 'jsdom',

    // 全局配置
    globals: true,

    // 覆盖率配置
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: ['node_modules/', 'dist/', '**/*.d.ts', 'test/', '**/*.config.*'],
      thresholds: {
        global: {
          branches: 80,
          functions: 80,
          lines: 80,
          statements: 80,
        },
      },
    },

    // 设置文件
    setupFiles: ['./test/setup.ts'],

    // 测试文件匹配
    include: ['**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    exclude: ['node_modules', 'dist', '.idea', '.git', '.cache'],
  },

  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
```

## 🔬 单元测试

### 工具函数测试

```typescript
// src/utils/format.ts
export const formatCurrency = (amount: number, currency = 'CNY'): string => {
  return new Intl.NumberFormat('zh-CN', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
  }).format(amount)
}

export const formatDate = (date: Date | string, format = 'YYYY-MM-DD'): string => {
  const d = new Date(date)

  if (isNaN(d.getTime())) {
    throw new Error('Invalid date')
  }

  return dayjs(d).format(format)
}

// test/utils/format.test.ts
import { describe, it, expect } from 'vitest'
import { formatCurrency, formatDate } from '@/utils/format'

describe('formatCurrency', () => {
  it('should format number to CNY currency', () => {
    expect(formatCurrency(1234.56)).toBe('¥1,234.56')
  })

  it('should format with different currency', () => {
    expect(formatCurrency(1234.56, 'USD')).toBe('US$1,234.56')
  })

  it('should handle zero amount', () => {
    expect(formatCurrency(0)).toBe('¥0.00')
  })

  it('should handle negative amount', () => {
    expect(formatCurrency(-1234.56)).toBe('-¥1,234.56')
  })
})

describe('formatDate', () => {
  it('should format Date object', () => {
    const date = new Date('2023-12-25')
    expect(formatDate(date)).toBe('2023-12-25')
  })

  it('should format date string', () => {
    expect(formatDate('2023-12-25')).toBe('2023-12-25')
  })

  it('should use custom format', () => {
    const date = new Date('2023-12-25')
    expect(formatDate(date, 'MM/DD/YYYY')).toBe('12/25/2023')
  })

  it('should throw error for invalid date', () => {
    expect(() => formatDate('invalid-date')).toThrow('Invalid date')
  })
})
```

### Pinia Store 测试

```typescript
// src/stores/modules/counter.ts
export const useCounterStore = defineStore('counter', {
  state: () => ({
    count: 0,
    history: [] as number[],
  }),

  getters: {
    doubleCount: state => state.count * 2,
    isEven: state => state.count % 2 === 0,
  },

  actions: {
    increment() {
      this.history.push(this.count)
      this.count++
    },

    decrement() {
      this.history.push(this.count)
      this.count--
    },

    incrementBy(amount: number) {
      this.history.push(this.count)
      this.count += amount
    },

    reset() {
      this.count = 0
      this.history = []
    },
  },
})

// test/stores/counter.test.ts
import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useCounterStore } from '@/stores/modules/counter'

describe('Counter Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('should initialize with default state', () => {
    const store = useCounterStore()

    expect(store.count).toBe(0)
    expect(store.history).toEqual([])
  })

  it('should increment count', () => {
    const store = useCounterStore()

    store.increment()

    expect(store.count).toBe(1)
    expect(store.history).toEqual([0])
  })

  it('should decrement count', () => {
    const store = useCounterStore()
    store.count = 5

    store.decrement()

    expect(store.count).toBe(4)
    expect(store.history).toEqual([5])
  })

  it('should increment by amount', () => {
    const store = useCounterStore()

    store.incrementBy(10)

    expect(store.count).toBe(10)
    expect(store.history).toEqual([0])
  })

  it('should calculate double count', () => {
    const store = useCounterStore()
    store.count = 5

    expect(store.doubleCount).toBe(10)
  })

  it('should check if count is even', () => {
    const store = useCounterStore()

    expect(store.isEven).toBe(true)

    store.increment()
    expect(store.isEven).toBe(false)
  })

  it('should reset state', () => {
    const store = useCounterStore()
    store.count = 10
    store.history = [1, 2, 3]

    store.reset()

    expect(store.count).toBe(0)
    expect(store.history).toEqual([])
  })
})
```

## 🧩 组件测试

### Vue 组件测试

```vue
<!-- src/components/UserCard.vue -->
<script setup lang="ts">
interface Props {
  user: {
    id: string
    name: string
    email: string
    avatar?: string
  }
  readonly?: boolean
}

interface Emits {
  edit: [id: string]
  delete: [id: string]
}

const props = withDefaults(defineProps<Props>(), {
  readonly: false,
})

const emit = defineEmits<Emits>()

const handleEdit = () => {
  emit('edit', props.user.id)
}

const handleDelete = () => {
  if (confirm('确定要删除吗？')) {
    emit('delete', props.user.id)
  }
}
</script>

<template>
  <div
    class="user-card"
    data-testid="user-card"
  >
    <img
      v-if="user.avatar"
      :src="user.avatar"
      :alt="user.name"
      class="avatar"
      data-testid="user-avatar"
    />

    <div class="user-info">
      <h3 data-testid="user-name">{{ user.name }}</h3>
      <p data-testid="user-email">{{ user.email }}</p>
    </div>

    <div
      v-if="!readonly"
      class="actions"
    >
      <button
        @click="handleEdit"
        data-testid="edit-button"
      >
        编辑
      </button>

      <button
        @click="handleDelete"
        data-testid="delete-button"
        class="danger"
      >
        删除
      </button>
    </div>
  </div>
</template>
```

```typescript
// test/components/UserCard.test.ts
import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import UserCard from '@/components/UserCard.vue'

// Mock window.confirm
Object.defineProperty(window, 'confirm', {
  writable: true,
  value: vi.fn(),
})

describe('UserCard', () => {
  const mockUser = {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    avatar: 'https://example.com/avatar.jpg',
  }

  it('should render user information', () => {
    const wrapper = mount(UserCard, {
      props: { user: mockUser },
    })

    expect(wrapper.find('[data-testid="user-name"]').text()).toBe('John Doe')
    expect(wrapper.find('[data-testid="user-email"]').text()).toBe('john@example.com')
    expect(wrapper.find('[data-testid="user-avatar"]').attributes('src')).toBe(mockUser.avatar)
  })

  it('should not render avatar when not provided', () => {
    const userWithoutAvatar = { ...mockUser, avatar: undefined }
    const wrapper = mount(UserCard, {
      props: { user: userWithoutAvatar },
    })

    expect(wrapper.find('[data-testid="user-avatar"]').exists()).toBe(false)
  })

  it('should render action buttons when not readonly', () => {
    const wrapper = mount(UserCard, {
      props: { user: mockUser },
    })

    expect(wrapper.find('[data-testid="edit-button"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="delete-button"]').exists()).toBe(true)
  })

  it('should not render action buttons when readonly', () => {
    const wrapper = mount(UserCard, {
      props: { user: mockUser, readonly: true },
    })

    expect(wrapper.find('[data-testid="edit-button"]').exists()).toBe(false)
    expect(wrapper.find('[data-testid="delete-button"]').exists()).toBe(false)
  })

  it('should emit edit event when edit button clicked', async () => {
    const wrapper = mount(UserCard, {
      props: { user: mockUser },
    })

    await wrapper.find('[data-testid="edit-button"]').trigger('click')

    expect(wrapper.emitted('edit')).toBeTruthy()
    expect(wrapper.emitted('edit')?.[0]).toEqual([mockUser.id])
  })

  it('should emit delete event when confirmed', async () => {
    vi.mocked(window.confirm).mockReturnValue(true)

    const wrapper = mount(UserCard, {
      props: { user: mockUser },
    })

    await wrapper.find('[data-testid="delete-button"]').trigger('click')

    expect(window.confirm).toHaveBeenCalledWith('确定要删除吗？')
    expect(wrapper.emitted('delete')).toBeTruthy()
    expect(wrapper.emitted('delete')?.[0]).toEqual([mockUser.id])
  })

  it('should not emit delete event when cancelled', async () => {
    vi.mocked(window.confirm).mockReturnValue(false)

    const wrapper = mount(UserCard, {
      props: { user: mockUser },
    })

    await wrapper.find('[data-testid="delete-button"]').trigger('click')

    expect(window.confirm).toHaveBeenCalled()
    expect(wrapper.emitted('delete')).toBeFalsy()
  })
})
```

### 组合式函数测试

```typescript
// src/hooks/modules/useCounter.ts
export const useCounter = (initialValue = 0) => {
  const count = ref(initialValue)
  const history = ref<number[]>([])

  const increment = () => {
    history.value.push(count.value)
    count.value++
  }

  const decrement = () => {
    history.value.push(count.value)
    count.value--
  }

  const reset = () => {
    count.value = initialValue
    history.value = []
  }

  const doubleCount = computed(() => count.value * 2)
  const isEven = computed(() => count.value % 2 === 0)

  return {
    count: readonly(count),
    history: readonly(history),
    doubleCount,
    isEven,
    increment,
    decrement,
    reset,
  }
}

// test/hooks/useCounter.test.ts
import { describe, it, expect } from 'vitest'
import { useCounter } from '@/hooks/modules/useCounter'

describe('useCounter', () => {
  it('should initialize with default value', () => {
    const { count, history, doubleCount, isEven } = useCounter()

    expect(count.value).toBe(0)
    expect(history.value).toEqual([])
    expect(doubleCount.value).toBe(0)
    expect(isEven.value).toBe(true)
  })

  it('should initialize with custom value', () => {
    const { count, doubleCount } = useCounter(10)

    expect(count.value).toBe(10)
    expect(doubleCount.value).toBe(20)
  })

  it('should increment count', () => {
    const { count, history, increment } = useCounter()

    increment()

    expect(count.value).toBe(1)
    expect(history.value).toEqual([0])
  })

  it('should decrement count', () => {
    const { count, history, decrement } = useCounter(5)

    decrement()

    expect(count.value).toBe(4)
    expect(history.value).toEqual([5])
  })

  it('should reset to initial value', () => {
    const { count, history, increment, reset } = useCounter(3)

    increment()
    increment()
    reset()

    expect(count.value).toBe(3)
    expect(history.value).toEqual([])
  })

  it('should calculate double count reactively', () => {
    const { doubleCount, increment } = useCounter(2)

    expect(doubleCount.value).toBe(4)

    increment()
    expect(doubleCount.value).toBe(6)
  })

  it('should check even/odd reactively', () => {
    const { isEven, increment } = useCounter(0)

    expect(isEven.value).toBe(true)

    increment()
    expect(isEven.value).toBe(false)

    increment()
    expect(isEven.value).toBe(true)
  })
})
```

## 🔗 集成测试

### API 集成测试

```typescript
// test/integration/api.test.ts
import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { setupServer } from 'msw/node'
import { rest } from 'msw'
import { userAPI } from '@/api/modules/user'

// Mock 服务器
const server = setupServer(
  rest.get('/api/users/:id', (req, res, ctx) => {
    const { id } = req.params

    if (id === '1') {
      return res(
        ctx.json({
          id: '1',
          name: 'John Doe',
          email: 'john@example.com',
        })
      )
    }

    return res(ctx.status(404), ctx.json({ error: 'User not found' }))
  }),

  rest.post('/api/users', (req, res, ctx) => {
    return res(
      ctx.json({
        id: '2',
        name: 'Jane Doe',
        email: 'jane@example.com',
      })
    )
  })
)

describe('User API Integration', () => {
  beforeEach(() => server.listen())
  afterEach(() => server.resetHandlers())

  it('should fetch user successfully', async () => {
    const { data } = await userAPI.getUserInfo('1').send()

    expect(data).toEqual({
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
    })
  })

  it('should handle user not found', async () => {
    await expect(userAPI.getUserInfo('999').send()).rejects.toThrow('User not found')
  })

  it('should create user successfully', async () => {
    const userData = {
      name: 'Jane Doe',
      email: 'jane@example.com',
    }

    const { data } = await userAPI.createUser(userData).send()

    expect(data).toEqual({
      id: '2',
      name: 'Jane Doe',
      email: 'jane@example.com',
    })
  })
})
```

### 状态管理集成测试

```typescript
// test/integration/store-integration.test.ts
import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useUserStore } from '@/stores/modules/user'
import { useAuthStore } from '@/stores/modules/auth'

describe('Store Integration', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('should integrate auth and user stores', async () => {
    const authStore = useAuthStore()
    const userStore = useUserStore()

    // 模拟登录
    await authStore.login({
      username: 'admin',
      password: 'password',
    })

    expect(authStore.isAuthenticated).toBe(true)
    expect(userStore.currentUser).toBeTruthy()
    expect(userStore.permissions).toContain('user:read')
  })

  it('should clear user data on logout', async () => {
    const authStore = useAuthStore()
    const userStore = useUserStore()

    // 设置初始状态
    authStore.isAuthenticated = true
    userStore.currentUser = { id: '1', name: 'Test User' }

    // 登出
    await authStore.logout()

    expect(authStore.isAuthenticated).toBe(false)
    expect(userStore.currentUser).toBeNull()
  })
})
```

## 🌐 端到端测试

### Playwright E2E 测试

```typescript
// playwright.config.ts
import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',

  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],

  webServer: {
    command: 'pnpm dev',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
  },
})
```

```typescript
// e2e/login.spec.ts
import { test, expect } from '@playwright/test'

test.describe('Login Flow', () => {
  test('should login successfully with valid credentials', async ({ page }) => {
    await page.goto('/login')

    // 填写登录表单
    await page.fill('[data-testid="username-input"]', 'admin')
    await page.fill('[data-testid="password-input"]', 'password')
    await page.click('[data-testid="login-button"]')

    // 验证跳转到仪表盘
    await expect(page).toHaveURL('/dashboard')
    await expect(page.locator('[data-testid="welcome-message"]')).toBeVisible()
  })

  test('should show error with invalid credentials', async ({ page }) => {
    await page.goto('/login')

    await page.fill('[data-testid="username-input"]', 'invalid')
    await page.fill('[data-testid="password-input"]', 'invalid')
    await page.click('[data-testid="login-button"]')

    // 验证错误消息
    await expect(page.locator('[data-testid="error-message"]')).toBeVisible()
    await expect(page.locator('[data-testid="error-message"]')).toContainText('用户名或密码错误')
  })

  test('should validate required fields', async ({ page }) => {
    await page.goto('/login')

    await page.click('[data-testid="login-button"]')

    // 验证验证消息
    await expect(page.locator('[data-testid="username-error"]')).toBeVisible()
    await expect(page.locator('[data-testid="password-error"]')).toBeVisible()
  })
})

// e2e/user-management.spec.ts
import { test, expect } from '@playwright/test'

test.describe('User Management', () => {
  test.beforeEach(async ({ page }) => {
    // 登录
    await page.goto('/login')
    await page.fill('[data-testid="username-input"]', 'admin')
    await page.fill('[data-testid="password-input"]', 'password')
    await page.click('[data-testid="login-button"]')

    // 导航到用户管理页面
    await page.click('[data-testid="user-menu"]')
  })

  test('should display user list', async ({ page }) => {
    await expect(page.locator('[data-testid="user-table"]')).toBeVisible()
    await expect(page.locator('[data-testid="user-row"]')).toHaveCount.greaterThan(0)
  })

  test('should create new user', async ({ page }) => {
    await page.click('[data-testid="add-user-button"]')

    // 填写用户表单
    await page.fill('[data-testid="user-name-input"]', 'Test User')
    await page.fill('[data-testid="user-email-input"]', 'test@example.com')
    await page.selectOption('[data-testid="user-role-select"]', 'user')

    await page.click('[data-testid="save-user-button"]')

    // 验证用户创建成功
    await expect(page.locator('[data-testid="success-message"]')).toBeVisible()
    await expect(page.locator('text=Test User')).toBeVisible()
  })

  test('should edit existing user', async ({ page }) => {
    // 点击第一个用户的编辑按钮
    await page
      .locator('[data-testid="user-row"]')
      .first()
      .locator('[data-testid="edit-button"]')
      .click()

    // 修改用户信息
    await page.fill('[data-testid="user-name-input"]', 'Updated User')
    await page.click('[data-testid="save-user-button"]')

    // 验证更新成功
    await expect(page.locator('[data-testid="success-message"]')).toBeVisible()
    await expect(page.locator('text=Updated User')).toBeVisible()
  })

  test('should delete user', async ({ page }) => {
    const initialCount = await page.locator('[data-testid="user-row"]').count()

    // 点击删除按钮
    await page
      .locator('[data-testid="user-row"]')
      .first()
      .locator('[data-testid="delete-button"]')
      .click()

    // 确认删除
    await page.click('[data-testid="confirm-delete-button"]')

    // 验证用户被删除
    await expect(page.locator('[data-testid="user-row"]')).toHaveCount(initialCount - 1)
  })
})
```

## 🔍 测试工具和助手

### 测试工具函数

```typescript
// test/utils/helpers.ts
import { mount, VueWrapper } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'
import { vi } from 'vitest'

// 创建测试用的 Pinia
export const createMockPinia = () => {
  return createTestingPinia({
    createSpy: vi.fn,
    stubActions: false,
  })
}

// 组件挂载助手
export const mountComponent = <T>(component: T, options: Record<string, any> = {}) => {
  return mount(component as any, {
    global: {
      plugins: [createMockPinia()],
      stubs: {
        'router-link': true,
        'router-view': true,
      },
    },
    ...options,
  })
}

// 等待异步更新
export const flushPromises = () => {
  return new Promise(resolve => setTimeout(resolve, 0))
}

// 模拟 API 响应
export const mockApiResponse = <T>(data: T, delay = 0) => {
  return new Promise<{ data: T }>(resolve => {
    setTimeout(() => {
      resolve({ data })
    }, delay)
  })
}

// 模拟错误响应
export const mockApiError = (message: string, status = 500) => {
  return Promise.reject({
    response: {
      status,
      data: { message },
    },
  })
}
```

### 测试数据工厂

```typescript
// test/factories/user.factory.ts
export const createMockUser = (overrides?: Partial<UserInfo>): UserInfo => {
  return {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    role: 'user',
    createdAt: '2023-01-01',
    updatedAt: '2023-01-01',
    ...overrides,
  }
}

export const createMockUserList = (count = 5): UserInfo[] => {
  return Array.from({ length: count }, (_, index) =>
    createMockUser({
      id: String(index + 1),
      name: `User ${index + 1}`,
      email: `user${index + 1}@example.com`,
    })
  )
}

// test/factories/api.factory.ts
export const createMockApiResponse = <T>(data: T) => {
  return {
    data,
    status: 200,
    statusText: 'OK',
    headers: {},
    config: {},
  }
}
```

## 📊 测试覆盖率和质量

### 覆盖率配置

```typescript
// vitest.config.ts 中的覆盖率配置
export default defineConfig({
  test: {
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],

      // 覆盖率阈值
      thresholds: {
        global: {
          branches: 80,
          functions: 80,
          lines: 80,
          statements: 80,
        },

        // 特定文件的阈值
        './src/utils/': {
          branches: 90,
          functions: 90,
          lines: 90,
          statements: 90,
        },

        './src/stores/': {
          branches: 85,
          functions: 85,
          lines: 85,
          statements: 85,
        },
      },

      // 排除文件
      exclude: [
        'node_modules/',
        'dist/',
        'coverage/',
        '**/*.d.ts',
        '**/*.config.*',
        'test/',
        'e2e/',
        'src/main.ts',
        'src/App.vue',
      ],
    },
  },
})
```

### 测试质量检查

```json
// package.json 中的测试脚本
{
  "scripts": {
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:run": "vitest run",
    "test:coverage": "vitest run --coverage",
    "test:watch": "vitest watch",
    "e2e": "playwright test",
    "e2e:ui": "playwright test --ui",
    "test:all": "pnpm test:run && pnpm test:coverage && pnpm e2e"
  }
}
```

## 🚀 CI/CD 中的测试

### GitHub Actions 配置

```yaml
# .github/workflows/test.yml
name: Test Suite

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'pnpm'

      - name: Install dependencies
        run: pnpm install

      - name: Run unit tests
        run: pnpm test:run

      - name: Run coverage
        run: pnpm test:coverage

      - name: Upload coverage reports
        uses: codecov/codecov-action@v3

      - name: Install Playwright browsers
        run: pnpm exec playwright install --with-deps

      - name: Run E2E tests
        run: pnpm e2e

      - name: Upload E2E test results
        uses: actions/upload-artifact@v3
        if: failure()
        with:
          name: playwright-report
          path: playwright-report/
```

## 📋 测试最佳实践

### 1. 测试组织

- ✅ 按功能模块组织测试文件
- ✅ 使用描述性的测试名称
- ✅ 遵循 AAA 模式（Arrange, Act, Assert）
- ✅ 保持测试独立性

### 2. 测试数据

- ✅ 使用工厂函数创建测试数据
- ✅ 避免硬编码测试数据
- ✅ 使用 Mock 隔离外部依赖
- ✅ 清理测试副作用

### 3. 测试覆盖

- ✅ 关注关键业务逻辑
- ✅ 测试边界条件和错误场景
- ✅ 覆盖率作为参考，不是目标
- ✅ 优先级：单元 > 组件 > 集成 > E2E

### 4. 测试维护

- ✅ 保持测试简单和可读
- ✅ 定期更新测试用例
- ✅ 重构测试代码
- ✅ 监控测试执行时间

通过这套完整的测试体系，CC-Admin 能够确保代码质量，减少回归错误，提升开发效率。
