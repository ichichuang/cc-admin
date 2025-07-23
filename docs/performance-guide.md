# 性能优化指南

## 概述

CC-Admin 采用多层次的性能优化策略，从构建优化、运行时优化、网络优化到用户体验优化，全方位提升应用性能和用户体验。

## 🚀 构建优化

### Vite 构建优化

```typescript
// vite.config.ts - 构建优化配置
export default defineConfig({
  build: {
    // 代码分割策略
    rollupOptions: {
      output: {
        // 手动分包
        manualChunks: {
          // 框架代码
          'vue-vendor': ['vue', 'vue-router'],
          'pinia-vendor': ['pinia', 'pinia-plugin-persistedstate'],

          // UI库
          'ui-vendor': ['ant-design-vue'],

          // 工具库
          'utils-vendor': ['lodash-es', 'dayjs', 'axios'],

          // 图标库
          'icon-vendor': ['@iconify/vue'],

          // 业务模块按功能分包
          'user-module': [
            './src/views/user/index.vue',
            './src/api/modules/user.ts',
            './src/stores/modules/user.ts',
          ],
        },

        // 资源文件命名
        chunkFileNames: 'js/[name]-[hash].js',
        entryFileNames: 'js/[name]-[hash].js',
        assetFileNames: assetInfo => {
          const info = assetInfo.name!.split('.')
          const ext = info[info.length - 1]

          if (/\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/i.test(assetInfo.name!)) {
            return `media/[name]-[hash].${ext}`
          }
          if (/\.(png|jpe?g|gif|svg)(\?.*)?$/i.test(assetInfo.name!)) {
            return `images/[name]-[hash].${ext}`
          }
          if (/\.(woff2?|eot|ttf|otf)(\?.*)?$/i.test(assetInfo.name!)) {
            return `fonts/[name]-[hash].${ext}`
          }
          return `assets/[name]-[hash].${ext}`
        },
      },
    },

    // 压缩配置
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // 移除console
        drop_debugger: true, // 移除debugger
        pure_funcs: ['console.log', 'console.info'], // 移除特定函数调用
      },
      mangle: {
        safari10: true, // Safari 10 兼容
      },
    },

    // 启用 gzip 压缩
    reportCompressedSize: true,

    // 资源内联限制
    assetsInlineLimit: 4096, // 4KB以下的资源内联

    // 输出目录清理
    emptyOutDir: true,
  },

  // 依赖预构建优化
  optimizeDeps: {
    include: ['vue', 'vue-router', 'pinia', 'ant-design-vue', 'dayjs', 'lodash-es'],
    exclude: [
      // 排除大型依赖的预构建
      'some-large-package',
    ],
  },
})
```

### 代码分割策略

```typescript
// 路由级代码分割
const routes = [
  {
    path: '/dashboard',
    component: () =>
      import(
        /* webpackChunkName: "dashboard" */
        '@/views/dashboard/index.vue'
      ),
  },
  {
    path: '/user',
    component: () =>
      import(
        /* webpackChunkName: "user-management" */
        '@/views/user/index.vue'
      ),
  },
]

// 组件级代码分割
export default defineAsyncComponent({
  loader: () => import('./HeavyComponent.vue'),
  loadingComponent: LoadingSpinner,
  errorComponent: ErrorComponent,
  delay: 200,
  timeout: 3000,
})

// 模块级代码分割
const useHeavyFeature = async () => {
  const module = await import(
    /* webpackChunkName: "heavy-feature" */
    '@/modules/heavy-feature'
  )
  return module.default
}
```

## ⚡ 运行时优化

### Vue 性能优化

```vue
<!-- 组件优化示例 -->
<script setup lang="ts">
import { defineAsyncComponent, shallowRef, markRaw } from 'vue'

// 使用 shallowRef 减少深度响应式
const largeData = shallowRef<LargeDataType>({})

// 使用 markRaw 标记不需要响应式的对象
const chartInstance = markRaw(new Chart())

// 计算属性缓存
const expensiveComputed = computed(() => {
  // 复杂计算逻辑
  return processLargeData(largeData.value)
})

// 使用 watchEffect 替代多个 watch
watchEffect(() => {
  if (props.visible && data.value) {
    updateUI()
  }
})

// 异步组件优化
const HeavyChart = defineAsyncComponent({
  loader: () => import('./components/HeavyChart.vue'),
  loadingComponent: () => h('div', 'Loading chart...'),
  delay: 200,
})
</script>

<template>
  <!-- 使用 v-memo 缓存渲染结果 -->
  <div v-memo="[user.id, user.name]">{{ user.name }} - {{ user.email }}</div>

  <!-- 使用 key 强制更新 -->
  <component
    :is="currentComponent"
    :key="componentKey"
  />

  <!-- 使用 v-once 缓存静态内容 -->
  <div v-once>
    <h1>{{ title }}</h1>
    <p>{{ description }}</p>
  </div>

  <!-- 使用 v-show 替代频繁切换的 v-if -->
  <div v-show="isVisible">Frequently toggled content</div>
</template>
```

### 列表渲染优化

```vue
<!-- 虚拟滚动优化大列表 -->
<script setup lang="ts">
import { VirtualList } from '@tanstack/vue-virtual'

const items = ref<DataItem[]>([])
const containerRef = ref<HTMLElement>()

// 使用虚拟滚动处理大量数据
const virtualListOptions = {
  count: items.value.length,
  estimateSize: () => 60,
  overscan: 10,
}

// 分页加载优化
const { data, loading, loadMore } = useInfiniteScroll(
  async (page: number) => {
    const response = await api.getItems({ page, size: 50 })
    return response.data
  },
  {
    threshold: 300,
  }
)
</script>

<template>
  <div
    ref="containerRef"
    class="scroll-container"
  >
    <VirtualList
      :items="items"
      :item-height="60"
      :buffer="10"
      v-slot="{ item, index }"
    >
      <div
        :key="item.id"
        class="list-item"
      >
        {{ item.name }}
      </div>
    </VirtualList>
  </div>
</template>
```

### 状态管理优化

```typescript
// Pinia Store 性能优化
export const useOptimizedStore = defineStore('optimized', {
  state: () => ({
    // 使用 shallowRef 减少深度响应
    largeDataSet: shallowRef<Map<string, DataItem>>(new Map()),

    // 分离频繁变化的状态
    ui: {
      loading: false,
      error: null,
    },

    // 缓存计算结果
    cachedResults: new Map<string, any>(),
  }),

  getters: {
    // 使用缓存避免重复计算
    expensiveGetter: state => {
      return (id: string) => {
        const cacheKey = `expensive_${id}`

        if (state.cachedResults.has(cacheKey)) {
          return state.cachedResults.get(cacheKey)
        }

        const result = performExpensiveCalculation(id)
        state.cachedResults.set(cacheKey, result)

        return result
      }
    },
  },

  actions: {
    // 批量更新减少响应式触发
    async batchUpdateItems(items: DataItem[]) {
      const updates = new Map()

      items.forEach(item => {
        updates.set(item.id, item)
      })

      // 一次性更新
      this.largeDataSet = markRaw(updates)
    },

    // 防抖处理频繁操作
    debouncedUpdate: debounce(function (this: any, data: any) {
      this.updateData(data)
    }, 300),
  },
})
```

## 🌐 网络优化

### HTTP 请求优化

```typescript
// 请求优化配置
export const requestOptimizer = {
  // 请求合并
  batchRequests: new Map<string, Promise<any>>(),

  // 合并同类请求
  async batchGetUsers(ids: string[]): Promise<UserInfo[]> {
    const cacheKey = `batch_users_${ids.sort().join('_')}`

    if (this.batchRequests.has(cacheKey)) {
      return this.batchRequests.get(cacheKey)
    }

    const promise = api.batchGetUsers(ids)
    this.batchRequests.set(cacheKey, promise)

    // 清理缓存
    setTimeout(() => {
      this.batchRequests.delete(cacheKey)
    }, 5000)

    return promise
  },

  // 请求去重
  deduplicateRequests: new Map<string, Promise<any>>(),

  async request<T>(url: string, options?: RequestOptions): Promise<T> {
    const key = `${url}_${JSON.stringify(options)}`

    if (this.deduplicateRequests.has(key)) {
      return this.deduplicateRequests.get(key)
    }

    const promise = fetch(url, options).then(res => res.json())
    this.deduplicateRequests.set(key, promise)

    // 请求完成后清理
    promise.finally(() => {
      this.deduplicateRequests.delete(key)
    })

    return promise
  },
}

// Alova 缓存策略优化
export const optimizedAPI = {
  // 分层缓存策略
  getUserInfo: (id: string) =>
    alovaInstance.Get<UserInfo>(`/users/${id}`, {
      // L1: 内存缓存 - 5分钟
      cacheFor: {
        expire: 5 * 60 * 1000,
        mode: 'memory',
        tag: 'user',
      },

      // L2: 持久化缓存 - 30分钟
      localCache: {
        expire: 30 * 60 * 1000,
        mode: 'restore',
      },
    }),

  // 预加载策略
  preloadUserData: async (userId: string) => {
    // 预加载用户基本信息
    const userPromise = optimizedAPI.getUserInfo(userId)

    // 预加载相关数据
    const profilePromise = optimizedAPI.getUserProfile(userId)
    const settingsPromise = optimizedAPI.getUserSettings(userId)

    return Promise.all([userPromise, profilePromise, settingsPromise])
  },
}
```

### 图片资源优化

```typescript
// 图片优化工具
export class ImageOptimizer {
  // 图片懒加载
  static observeImages(): void {
    const imageObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target as HTMLImageElement
            const src = img.dataset.src

            if (src) {
              img.src = src
              img.removeAttribute('data-src')
              observer.unobserve(img)
            }
          }
        })
      },
      {
        rootMargin: '50px 0px', // 提前50px开始加载
        threshold: 0.01,
      }
    )

    document.querySelectorAll('img[data-src]').forEach(img => {
      imageObserver.observe(img)
    })
  }

  // WebP 格式支持检测
  static async supportsWebP(): Promise<boolean> {
    const canvas = document.createElement('canvas')
    canvas.width = 1
    canvas.height = 1

    return new Promise(resolve => {
      canvas.toBlob(blob => {
        resolve(blob?.type === 'image/webp')
      }, 'image/webp')
    })
  }

  // 响应式图片URL生成
  static generateResponsiveUrl(baseUrl: string, width: number, quality = 80): string {
    const supportsWebP = this.supportsWebP()
    const format = supportsWebP ? 'webp' : 'jpg'

    return `${baseUrl}?w=${width}&q=${quality}&f=${format}`
  }
}

// Vue 图片组件优化
const OptimizedImage = defineComponent({
  props: {
    src: String,
    alt: String,
    width: Number,
    height: Number,
  },

  setup(props) {
    const imgRef = ref<HTMLImageElement>()
    const loaded = ref(false)
    const error = ref(false)

    // 预加载图片
    const preloadImage = (src: string) => {
      return new Promise<void>((resolve, reject) => {
        const img = new Image()
        img.onload = () => resolve()
        img.onerror = reject
        img.src = src
      })
    }

    // 响应式图片源
    const responsiveSrc = computed(() => {
      if (!props.src || !props.width) return props.src

      return ImageOptimizer.generateResponsiveUrl(props.src, props.width)
    })

    return {
      imgRef,
      loaded,
      error,
      responsiveSrc,
    }
  },

  template: `
    <div class="optimized-image">
      <img
        ref="imgRef"
        :src="responsiveSrc"
        :alt="alt"
        :width="width"
        :height="height"
        @load="loaded = true"
        @error="error = true"
        :class="{ loaded, error }"
      />
      <div v-if="!loaded && !error" class="image-placeholder">
        Loading...
      </div>
    </div>
  `,
})
```

## 🎯 用户体验优化

### 加载状态优化

```vue
<!-- 骨架屏组件 -->
<script setup lang="ts">
interface Props {
  loading?: boolean
  rows?: number
  avatar?: boolean
  title?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  loading: true,
  rows: 3,
  avatar: false,
  title: true,
})
</script>

<template>
  <div
    v-if="loading"
    class="skeleton"
  >
    <div
      v-if="avatar"
      class="skeleton-avatar"
    ></div>

    <div class="skeleton-content">
      <div
        v-if="title"
        class="skeleton-title"
      ></div>

      <div
        v-for="i in rows"
        :key="i"
        class="skeleton-line"
        :style="{ width: i === rows ? '60%' : '100%' }"
      ></div>
    </div>
  </div>

  <div v-else>
    <slot />
  </div>
</template>

<style scoped>
.skeleton {
  @apply flex items-start space-x-4;
}

.skeleton-avatar {
  @apply w-12 h-12 bg-gray-200 rounded-full animate-pulse;
}

.skeleton-content {
  @apply flex-1 space-y-2;
}

.skeleton-title {
  @apply h-5 bg-gray-200 rounded animate-pulse;
}

.skeleton-line {
  @apply h-4 bg-gray-200 rounded animate-pulse;
}
</style>
```

### 路由过渡优化

```vue
<!-- 路由过渡效果 -->
<script setup lang="ts">
import { TransitionGroup } from 'vue'

// 路由过渡配置
const transitionConfig = {
  name: 'page',
  mode: 'out-in',

  // 过渡钩子优化
  onBeforeEnter(el: Element) {
    // 预处理DOM
    ;(el as HTMLElement).style.opacity = '0'
  },

  onEnter(el: Element, done: () => void) {
    // 使用 requestAnimationFrame 优化动画
    requestAnimationFrame(() => {
      ;(el as HTMLElement).style.opacity = '1'
      done()
    })
  },

  onLeave(el: Element, done: () => void) {
    // 离开动画
    ;(el as HTMLElement).style.opacity = '0'
    setTimeout(done, 300)
  },
}
</script>

<template>
  <router-view v-slot="{ Component, route }">
    <transition
      :name="transitionConfig.name"
      :mode="transitionConfig.mode"
      @before-enter="transitionConfig.onBeforeEnter"
      @enter="transitionConfig.onEnter"
      @leave="transitionConfig.onLeave"
    >
      <component
        :is="Component"
        :key="route.path"
      />
    </transition>
  </router-view>
</template>

<style scoped>
.page-enter-active,
.page-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.page-enter-from {
  opacity: 0;
  transform: translateX(20px);
}

.page-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}
</style>
```

## 📊 性能监控

### 性能指标收集

```typescript
// 性能监控工具
export class PerformanceMonitor {
  private metrics: PerformanceMetric[] = []

  // 页面性能指标
  static measurePagePerformance(): PerformanceMetrics {
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
    const paint = performance.getEntriesByType('paint')

    return {
      // 核心性能指标
      FCP: paint.find(p => p.name === 'first-contentful-paint')?.startTime || 0,
      LCP: this.getLCP(),
      FID: this.getFID(),
      CLS: this.getCLS(),

      // 网络性能
      DNS: navigation.domainLookupEnd - navigation.domainLookupStart,
      TCP: navigation.connectEnd - navigation.connectStart,
      Request: navigation.responseStart - navigation.requestStart,
      Response: navigation.responseEnd - navigation.responseStart,

      // 页面渲染
      DOMParse: navigation.domInteractive - navigation.responseEnd,
      DOMReady: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
      Load: navigation.loadEventEnd - navigation.loadEventStart,
    }
  }

  // 组件渲染性能
  static measureComponentRender(name: string, fn: () => void): number {
    const start = performance.now()
    fn()
    const end = performance.now()

    const duration = end - start

    // 记录慢渲染
    if (duration > 16) {
      // 60fps = 16.67ms
      console.warn(`Slow render: ${name} took ${duration.toFixed(2)}ms`)
    }

    return duration
  }

  // 内存使用监控
  static monitorMemoryUsage(): MemoryInfo | null {
    if ('memory' in performance) {
      const memory = (performance as any).memory
      return {
        used: memory.usedJSHeapSize,
        total: memory.totalJSHeapSize,
        limit: memory.jsHeapSizeLimit,
      }
    }
    return null
  }

  // 资源加载性能
  static getResourceTimings(): ResourceTiming[] {
    return performance
      .getEntriesByType('resource')
      .map(entry => ({
        name: entry.name,
        duration: entry.duration,
        size: (entry as any).transferSize || 0,
        type: this.getResourceType(entry.name),
      }))
      .sort((a, b) => b.duration - a.duration)
  }

  private static getResourceType(url: string): string {
    if (url.includes('.js')) return 'script'
    if (url.includes('.css')) return 'style'
    if (url.match(/\.(png|jpg|jpeg|gif|svg|webp)$/)) return 'image'
    if (url.match(/\.(woff|woff2|ttf|eot)$/)) return 'font'
    return 'other'
  }
}

// 性能数据上报
export const performanceReporter = {
  // 定期上报性能数据
  startReporting(): void {
    // 页面加载完成后上报
    window.addEventListener('load', () => {
      setTimeout(() => {
        this.reportPagePerformance()
      }, 3000) // 等待3秒获取更准确的指标
    })

    // 页面卸载时上报
    window.addEventListener('beforeunload', () => {
      this.reportSessionMetrics()
    })
  },

  async reportPagePerformance(): Promise<void> {
    const metrics = PerformanceMonitor.measurePagePerformance()
    const memory = PerformanceMonitor.monitorMemoryUsage()
    const resources = PerformanceMonitor.getResourceTimings()

    const report = {
      url: location.href,
      userAgent: navigator.userAgent,
      timestamp: Date.now(),
      metrics,
      memory,
      resources: resources.slice(0, 10), // 只上报前10个最慢的资源
    }

    // 使用 sendBeacon 确保数据能发送
    navigator.sendBeacon('/api/performance', JSON.stringify(report))
  },

  async reportSessionMetrics(): Promise<void> {
    const sessionData = {
      duration: Date.now() - performance.timing.navigationStart,
      interactions: this.getInteractionCount(),
      errors: this.getErrorCount(),
    }

    navigator.sendBeacon('/api/session', JSON.stringify(sessionData))
  },
}
```

## 🔧 优化工具和插件

### 构建分析工具

```typescript
// 构建分析插件
import { defineConfig } from 'vite'
import { visualizer } from 'rollup-plugin-visualizer'
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer'

export default defineConfig({
  plugins: [
    // Rollup Bundle Analyzer
    visualizer({
      filename: 'dist/stats.html',
      open: true,
      gzipSize: true,
      brotliSize: true,
    }),

    // 自定义分析插件
    {
      name: 'performance-analyzer',
      generateBundle(options, bundle) {
        const chunks = Object.entries(bundle)
          .filter(([, chunk]) => chunk.type === 'chunk')
          .map(([name, chunk]) => ({
            name,
            size: chunk.code.length,
            modules: chunk.modules ? Object.keys(chunk.modules).length : 0,
          }))
          .sort((a, b) => b.size - a.size)

        console.table(chunks.slice(0, 10))
      },
    },
  ],
})
```

### 开发时性能监控

```typescript
// 开发环境性能监控
if (import.meta.env.DEV) {
  // Vue DevTools 性能插件
  import('@vue/devtools-api').then(({ setupDevtoolsPlugin }) => {
    setupDevtoolsPlugin(
      {
        id: 'performance-monitor',
        label: 'Performance Monitor',
        app: app,
      },
      api => {
        // 监控组件渲染时间
        api.on.componentUpdated(payload => {
          if (payload.renderTime > 16) {
            console.warn(`Slow component: ${payload.name} - ${payload.renderTime}ms`)
          }
        })
      }
    )
  })

  // 热更新性能监控
  if (import.meta.hot) {
    import.meta.hot.on('vite:beforeUpdate', () => {
      console.time('HMR Update')
    })

    import.meta.hot.on('vite:afterUpdate', () => {
      console.timeEnd('HMR Update')
    })
  }
}
```

## 📋 性能优化清单

### 构建优化

- ✅ 代码分割和懒加载
- ✅ Tree Shaking 去除无用代码
- ✅ 资源压缩和混淆
- ✅ 图片资源优化
- ✅ 字体子集化
- ✅ CDN 资源加速

### 运行时优化

- ✅ 组件懒加载
- ✅ 虚拟滚动
- ✅ 防抖节流
- ✅ 缓存优化
- ✅ 内存泄漏防护
- ✅ 事件监听器清理

### 网络优化

- ✅ HTTP/2 多路复用
- ✅ 资源预加载
- ✅ 请求合并
- ✅ 响应缓存
- ✅ 离线策略
- ✅ 数据分页

### 用户体验

- ✅ 加载状态指示
- ✅ 骨架屏占位
- ✅ 渐进式加载
- ✅ 错误边界处理
- ✅ 无障碍访问
- ✅ 响应式设计

通过这套完整的性能优化体系，CC-Admin 能够提供流畅、快速的用户体验，满足企业级应用的性能要求。
