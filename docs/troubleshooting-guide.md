# 故障排除指南

## 概述

本指南涵盖CC-Admin开发和生产环境中常见问题的诊断方法和解决方案，帮助开发者快速定位和解决问题。

## 🚀 环境相关问题

### Node.js 版本问题

**问题描述**：项目无法启动，提示Node.js版本不兼容

```bash
# 错误信息
Error: The engine "node" is incompatible with this module
Expected version ">=18.0.0". Got "16.14.0"
```

**解决方案**：

```bash
# 1. 检查当前Node.js版本
node --version

# 2. 使用nvm管理Node.js版本
# 安装nvm（如果未安装）
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# 安装并使用Node.js 18
nvm install 18
nvm use 18

# 3. 验证版本
node --version  # 应显示 v18.x.x
```

### pnpm 相关问题

**问题描述**：pnpm命令不存在或版本过低

```bash
# 错误信息
pnpm: command not found
# 或
This project requires pnpm version >=8.0.0
```

**解决方案**：

```bash
# 1. 安装最新版本pnpm
npm install -g pnpm@latest

# 2. 验证版本
pnpm --version

# 3. 清理缓存（如果遇到缓存问题）
pnpm store prune
```

### 依赖安装问题

**问题描述**：依赖安装失败或缓慢

```bash
# 错误信息
ERR_PNPM_FETCH_404 GET https://registry.npmjs.org/package: Not found
```

**解决方案**：

```bash
# 1. 清理依赖和缓存
rm -rf node_modules
rm pnpm-lock.yaml
pnpm store prune

# 2. 配置镜像源（中国用户）
pnpm config set registry https://registry.npmmirror.com

# 3. 重新安装
pnpm install

# 4. 如果仍有问题，检查网络和代理设置
pnpm config list
```

## 🔧 构建相关问题

### 构建失败

**问题描述**：构建过程中出现内存不足或超时错误

```bash
# 错误信息
FATAL ERROR: Ineffective mark-compacts near heap limit
JavaScript heap out of memory
```

**解决方案**：

```bash
# 1. 增加Node.js内存限制
export NODE_OPTIONS="--max-old-space-size=4096"
pnpm build

# 2. 或在package.json中配置
{
  "scripts": {
    "build": "NODE_OPTIONS='--max-old-space-size=4096' vite build"
  }
}

# 3. 检查是否有内存泄漏
pnpm build --mode development  # 开发模式构建测试
```

### TypeScript 编译错误

**问题描述**：TypeScript类型检查失败

```bash
# 错误信息
error TS2307: Cannot find module '@/components/UserCard' or its corresponding type declarations
```

**解决方案**：

```typescript
// 1. 检查路径别名配置 tsconfig.json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"],
      "@/components/*": ["src/components/*"]
    }
  }
}

// 2. 检查vite.config.ts中的alias配置
export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  }
})

// 3. 重新生成类型声明
pnpm type-check
```

### Vite 配置问题

**问题描述**：Vite配置导致的构建或开发服务器问题

```bash
# 错误信息
[vite:esbuild] The service was stopped
```

**解决方案**：

```typescript
// vite.config.ts 故障排除配置
export default defineConfig({
  // 1. 添加详细日志
  logLevel: 'info',

  // 2. 配置开发服务器
  server: {
    host: true,
    port: 5173,
    strictPort: true,
    hmr: {
      overlay: true,
    },
  },

  // 3. 优化依赖预构建
  optimizeDeps: {
    include: ['vue', 'vue-router', 'pinia'],
    exclude: ['@iconify/vue'],
  },

  // 4. 构建配置优化
  build: {
    // 增加资源文件大小限制警告阈值
    chunkSizeWarningLimit: 1000,

    // 详细的构建报告
    reportCompressedSize: true,
  },
})
```

## 🎯 运行时问题

### 路由相关问题

**问题描述**：页面刷新后出现404错误

```bash
# 问题：SPA路由在生产环境刷新页面时返回404
```

**解决方案**：

```nginx
# Nginx配置 - 支持SPA路由
server {
    listen 80;
    server_name your-domain.com;
    root /var/www/html;
    index index.html;

    # 关键配置：所有路由都指向index.html
    location / {
        try_files $uri $uri/ /index.html;
    }

    # API路由代理
    location /api/ {
        proxy_pass http://backend:3000;
    }
}
```

```typescript
// Vue Router配置检查
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  // 确保使用HTML5历史模式（不是hash模式）
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // 确保有404处理路由
    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: () => import('@/views/notfound/not-found-page.vue'),
    },
  ],
})
```

### 状态管理问题

**问题描述**：Pinia状态丢失或不同步

```typescript
// 问题诊断代码
import { storeToRefs } from 'pinia'

// 检查store是否正确创建
const store = useUserStore()
console.log('Store instance:', store)
console.log('Store state:', store.$state)

// 检查响应式是否工作
const { user } = storeToRefs(store)
watch(
  user,
  newUser => {
    console.log('User changed:', newUser)
  },
  { deep: true }
)
```

**解决方案**：

```typescript
// 1. 确保Pinia正确初始化
// main.ts
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

app.use(pinia)

// 2. 检查store定义
export const useUserStore = defineStore('user', {
  state: () => ({
    user: null as UserInfo | null,
  }),

  actions: {
    setUser(userData: UserInfo) {
      // 确保正确更新状态
      this.user = userData
    },
  },

  // 3. 持久化配置检查
  persist: {
    key: 'user-store',
    storage: localStorage,
    paths: ['user'], // 只持久化需要的字段
  },
})

// 4. 在组件中正确使用
const store = useUserStore()
const { user } = storeToRefs(store) // 保持响应式
```

### API 请求问题

**问题描述**：网络请求失败或超时

```typescript
// 错误信息
Network Error
Request timeout
CORS error
```

**解决方案**：

```typescript
// 1. 检查网络请求配置
// src/utils/http/instance.ts
import { createAlova } from 'alova'
import GlobalFetch from 'alova/GlobalFetch'
import VueHook from 'alova/vue'

const alovaInstance = createAlova({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  statesHook: VueHook,
  requestAdapter: GlobalFetch(),

  // 超时配置
  timeout: 10000,

  // 请求拦截器 - 调试信息
  beforeRequest(method) {
    console.log('Request:', method.url, method.config)

    // 添加认证头
    const token = localStorage.getItem('access_token')
    if (token) {
      method.config.headers.Authorization = `Bearer ${token}`
    }
  },

  // 响应拦截器 - 错误处理
  responded: {
    onSuccess(response) {
      console.log('Response success:', response)
      return response.json()
    },

    onError(error) {
      console.error('Response error:', error)

      // 根据错误类型处理
      if (error.name === 'TypeError') {
        // 网络错误
        throw new Error('网络连接失败，请检查网络设置')
      } else if (error.response?.status === 401) {
        // 认证错误
        throw new Error('登录已过期，请重新登录')
      } else if (error.response?.status >= 500) {
        // 服务器错误
        throw new Error('服务器错误，请稍后重试')
      }

      throw error
    },
  },
})

// 2. 网络问题诊断工具
export const diagNetwork = async () => {
  try {
    // 测试网络连通性
    const response = await fetch('/api/health', {
      method: 'GET',
      timeout: 5000,
    })

    console.log('Network test:', {
      status: response.status,
      ok: response.ok,
      headers: Object.fromEntries(response.headers.entries()),
    })

    return response.ok
  } catch (error) {
    console.error('Network diagnosis failed:', error)
    return false
  }
}
```

## 🎨 样式相关问题

### UnoCSS 样式不生效

**问题描述**：UnoCSS类名不生效或样式缺失

```vue
<!-- 问题：类名不生效 -->
<div class="flex items-center justify-center">
  Content not centered
</div>
```

**解决方案**：

```typescript
// 1. 检查UnoCSS配置 uno.config.ts
import { defineConfig, presetUno, presetAttributify } from 'unocss'

export default defineConfig({
  presets: [presetUno(), presetAttributify()],

  // 2. 添加自定义规则调试
  rules: [
    // 调试规则 - 显示所有匹配的类名
    [
      /^debug-(.*)$/,
      ([, name]) => {
        console.log(`UnoCSS matched: debug-${name}`)
        return { 'debug-name': name }
      },
    ],
  ],

  // 3. 配置扫描文件
  content: {
    pipeline: {
      include: ['src/**/*.{vue,ts,tsx,jsx}', 'index.html'],
    },
  },
})

// 4. 在main.ts中确保导入UnoCSS
import 'uno.css'
```

```bash
# 5. 开发环境调试命令
pnpm unocss --watch  # 监听样式变化
pnpm unocss --inspect  # 检查生成的CSS
```

### 主题切换问题

**问题描述**：深色/浅色模式切换不生效

```typescript
// 问题诊断
const colorStore = useColorStore()
console.log('Theme mode:', colorStore.mode)
console.log('CSS variables:', colorStore.cssVariables)

// 检查DOM中的类名和CSS变量
console.log('Body classes:', document.body.className)
console.log(
  'CSS custom properties:',
  getComputedStyle(document.documentElement).getPropertyValue('--primary-color')
)
```

**解决方案**：

```typescript
// src/stores/modules/color.ts - 修复主题切换
export const useColorStore = defineStore('color', {
  state: () => ({
    mode: 'light' as 'light' | 'dark',
  }),

  actions: {
    toggleTheme() {
      this.mode = this.mode === 'light' ? 'dark' : 'light'
      this.applyTheme()
    },

    applyTheme() {
      const root = document.documentElement

      // 移除旧的主题类
      root.classList.remove('light', 'dark')

      // 添加新的主题类
      root.classList.add(this.mode)

      // 应用CSS变量
      Object.entries(this.cssVariables).forEach(([key, value]) => {
        root.style.setProperty(key, value)
      })

      // 强制重绘（某些情况下需要）
      root.style.display = 'none'
      root.offsetHeight // 触发重排
      root.style.display = ''

      // 调试日志
      console.log(`Theme applied: ${this.mode}`)
    },
  },
})
```

## 🔍 性能问题诊断

### 页面加载缓慢

**问题描述**：首屏加载时间过长

**诊断工具**：

```typescript
// 性能诊断工具
export const performanceDiag = {
  // 测量页面加载性能
  measurePageLoad() {
    window.addEventListener('load', () => {
      const navigation = performance.getEntriesByType(
        'navigation'
      )[0] as PerformanceNavigationTiming

      const metrics = {
        DNS: navigation.domainLookupEnd - navigation.domainLookupStart,
        TCP: navigation.connectEnd - navigation.connectStart,
        Request: navigation.responseStart - navigation.requestStart,
        Response: navigation.responseEnd - navigation.responseStart,
        DOMParse: navigation.domInteractive - navigation.responseEnd,
        Load: navigation.loadEventEnd - navigation.loadEventStart,
      }

      console.table(metrics)

      // 检查慢加载资源
      const resources = performance
        .getEntriesByType('resource')
        .filter(r => r.duration > 1000) // 超过1秒的资源
        .sort((a, b) => b.duration - a.duration)

      if (resources.length > 0) {
        console.warn('Slow loading resources:', resources)
      }
    })
  },

  // 监控内存使用
  monitorMemory() {
    if ('memory' in performance) {
      const memory = (performance as any).memory

      const info = {
        used: `${(memory.usedJSHeapSize / 1024 / 1024).toFixed(2)} MB`,
        total: `${(memory.totalJSHeapSize / 1024 / 1024).toFixed(2)} MB`,
        limit: `${(memory.jsHeapSizeLimit / 1024 / 1024).toFixed(2)} MB`,
      }

      console.log('Memory usage:', info)

      // 内存使用率超过80%时警告
      const usage = memory.usedJSHeapSize / memory.jsHeapSizeLimit
      if (usage > 0.8) {
        console.warn('High memory usage detected:', `${(usage * 100).toFixed(2)}%`)
      }
    }
  },

  // 监控组件渲染性能
  measureComponentRender(name: string, fn: () => void) {
    const start = performance.now()
    fn()
    const duration = performance.now() - start

    if (duration > 16) {
      // 超过一帧时间
      console.warn(`Slow component render: ${name} - ${duration.toFixed(2)}ms`)
    }

    return duration
  },
}

// 在应用启动时启用诊断
if (import.meta.env.DEV) {
  performanceDiag.measurePageLoad()

  // 定期监控内存
  setInterval(() => {
    performanceDiag.monitorMemory()
  }, 30000)
}
```

**优化方案**：

```typescript
// 1. 代码分割优化
const routes = [
  {
    path: '/dashboard',
    component: () =>
      import(
        /* webpackChunkName: "dashboard" */
        /* webpackPreload: true */
        '@/views/dashboard/index.vue'
      ),
  },
]

// 2. 资源预加载
export const preloadResources = () => {
  // 预加载关键资源
  const criticalResources = ['/api/user/profile', '/api/system/config']

  criticalResources.forEach(url => {
    const link = document.createElement('link')
    link.rel = 'prefetch'
    link.href = url
    document.head.appendChild(link)
  })
}

// 3. 图片懒加载
export const lazyLoadImages = () => {
  const images = document.querySelectorAll('img[data-src]')
  const imageObserver = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target as HTMLImageElement
          img.src = img.dataset.src!
          img.classList.add('loaded')
          imageObserver.unobserve(img)
        }
      })
    },
    {
      rootMargin: '50px 0px',
    }
  )

  images.forEach(img => imageObserver.observe(img))
}
```

### 内存泄漏

**问题描述**：页面使用一段时间后变慢，内存持续增长

**诊断方法**：

```typescript
// 内存泄漏检测工具
export const memoryLeakDetector = {
  // 监听器泄漏检测
  checkEventListeners() {
    const originalAddEventListener = EventTarget.prototype.addEventListener
    const originalRemoveEventListener = EventTarget.prototype.removeEventListener
    const listeners = new Map()

    EventTarget.prototype.addEventListener = function (type, listener, options) {
      const key = `${this.constructor.name}_${type}`
      listeners.set(key, (listeners.get(key) || 0) + 1)
      console.log(`Add listener: ${key}, total: ${listeners.get(key)}`)

      return originalAddEventListener.call(this, type, listener, options)
    }

    EventTarget.prototype.removeEventListener = function (type, listener, options) {
      const key = `${this.constructor.name}_${type}`
      listeners.set(key, Math.max(0, (listeners.get(key) || 0) - 1))
      console.log(`Remove listener: ${key}, total: ${listeners.get(key)}`)

      return originalRemoveEventListener.call(this, type, listener, options)
    }

    // 定期报告监听器数量
    setInterval(() => {
      console.table(Object.fromEntries(listeners))
    }, 10000)
  },

  // 定时器泄漏检测
  checkTimers() {
    const originalSetInterval = window.setInterval
    const originalSetTimeout = window.setTimeout
    const originalClearInterval = window.clearInterval
    const originalClearTimeout = window.clearTimeout

    const activeTimers = new Set()

    window.setInterval = function (callback, delay) {
      const id = originalSetInterval.call(this, callback, delay)
      activeTimers.add(`interval_${id}`)
      console.log(`Active timers: ${activeTimers.size}`)
      return id
    }

    window.clearInterval = function (id) {
      activeTimers.delete(`interval_${id}`)
      console.log(`Active timers: ${activeTimers.size}`)
      return originalClearInterval.call(this, id)
    }

    // 类似地处理setTimeout
  },

  // Vue组件实例泄漏检测
  checkVueInstances() {
    if (import.meta.env.DEV) {
      let instanceCount = 0

      const originalCreateApp = createApp
      createApp.prototype = new Proxy(originalCreateApp.prototype, {
        construct(target, args) {
          instanceCount++
          console.log(`Vue instances: ${instanceCount}`)
          return new target(...args)
        },
      })
    }
  },
}

// 在开发环境启用泄漏检测
if (import.meta.env.DEV) {
  memoryLeakDetector.checkEventListeners()
  memoryLeakDetector.checkTimers()
}
```

## 🛠️ 调试工具

### Vue DevTools 问题

**问题描述**：Vue DevTools无法连接或显示不正常

**解决方案**：

```typescript
// main.ts - 开发环境配置
if (import.meta.env.DEV) {
  // 启用Vue DevTools
  app.config.performance = true

  // 全局错误处理
  app.config.errorHandler = (err, vm, info) => {
    console.error('Vue Error:', err)
    console.error('Component:', vm)
    console.error('Info:', info)
  }

  // 警告处理
  app.config.warnHandler = (msg, vm, trace) => {
    console.warn('Vue Warning:', msg)
    console.warn('Trace:', trace)
  }
}

// 手动连接DevTools（如果自动连接失败）
if (import.meta.env.DEV && window.__VUE_DEVTOOLS_GLOBAL_HOOK__) {
  window.__VUE_DEVTOOLS_GLOBAL_HOOK__.Vue = app
}
```

### 控制台调试

```typescript
// 开发环境调试工具
if (import.meta.env.DEV) {
  // 暴露调试接口到全局
  window.__DEBUG__ = {
    // 获取所有store实例
    stores: {
      user: useUserStore,
      color: useColorStore,
      // ... 其他stores
    },

    // 性能监控
    perf: performanceDiag,

    // 内存检测
    memory: memoryLeakDetector,

    // 网络诊断
    network: diagNetwork,

    // 重置应用状态
    reset() {
      localStorage.clear()
      sessionStorage.clear()
      location.reload()
    },
  }

  console.log('Debug tools available at window.__DEBUG__')
}
```

## 📋 故障排除清单

### 开发环境问题

- ✅ 检查Node.js版本 (>=18.0.0)
- ✅ 检查pnpm版本 (>=8.0.0)
- ✅ 清理node_modules和lock文件
- ✅ 检查环境变量配置
- ✅ 验证端口占用情况
- ✅ 检查网络和代理设置

### 构建问题

- ✅ 检查内存限制设置
- ✅ 验证TypeScript配置
- ✅ 检查路径别名配置
- ✅ 验证环境变量
- ✅ 清理构建缓存
- ✅ 检查依赖版本兼容性

### 运行时问题

- ✅ 检查浏览器控制台错误
- ✅ 验证网络请求状态
- ✅ 检查路由配置
- ✅ 验证状态管理
- ✅ 检查权限配置
- ✅ 监控内存使用

### 性能问题

- ✅ 分析加载时间
- ✅ 检查资源大小
- ✅ 监控内存泄漏
- ✅ 优化组件渲染
- ✅ 检查网络请求
- ✅ 验证缓存策略

通过这套完整的故障排除体系，开发者能够快速诊断和解决CC-Admin开发和部署过程中遇到的各种问题。
