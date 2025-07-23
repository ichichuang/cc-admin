# 构建配置指南

## 概述

CC-Admin 基于 Vite 7+ 构建现代化的前端工程化体系，提供高性能的开发体验和优化的生产构建。本指南详细介绍项目的构建配置、优化策略和部署方案。

## 🏗️ 构建架构

### 目录结构

```
build/                    # 🔧 构建配置目录
├── plugins.ts            # Vite 插件配置
├── utils.ts              # 构建工具函数
└── performance.ts        # 性能优化配置

vite.config.ts            # 🎯 Vite 主配置文件
tsconfig.json            # 📋 TypeScript 配置
tsconfig.app.json        # 📱 应用 TypeScript 配置
tsconfig.node.json       # 🔧 Node.js TypeScript 配置
uno.config.ts            # 🎨 UnoCSS 配置
eslint.config.ts         # 📏 ESLint 配置
```

### 技术栈

| 技术           | 版本  | 作用                 |
| -------------- | ----- | -------------------- |
| **Vite**       | 7+    | 构建工具和开发服务器 |
| **TypeScript** | 5+    | 类型检查和编译       |
| **UnoCSS**     | 0.66+ | 原子化CSS编译        |
| **ESLint**     | 9+    | 代码质量检查         |
| **Prettier**   | 3+    | 代码格式化           |

## ⚙️ Vite 配置详解

### 主配置文件

```typescript
// vite.config.ts
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import { createVitePlugins } from './build/plugins'
import { createProxy } from './build/utils'
import { env } from './src/utils/env'

export default defineConfig(({ command, mode }) => {
  // 加载环境变量
  const viteEnv = loadEnv(mode, process.cwd())
  const isBuild = command === 'build'

  return {
    // 🎯 基础配置
    base: env.publicPath,
    publicDir: 'public',

    // 📁 路径别名
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src'),
        '#': resolve(__dirname, 'src/types'),
        '~': resolve(__dirname, 'node_modules'),
      },
    },

    // 🔌 插件配置
    plugins: createVitePlugins(viteEnv, isBuild),

    // 🛠️ 开发服务器
    server: {
      host: '0.0.0.0',
      port: env.port,
      open: true,
      cors: true,
      // 代理配置
      proxy: createProxy(viteEnv),
      // 热更新
      hmr: {
        overlay: true,
      },
    },

    // 📦 构建配置
    build: {
      target: ['es2020', 'edge88', 'firefox78', 'chrome87', 'safari14'],
      outDir: 'dist',
      assetsDir: 'assets',
      sourcemap: env.buildSourcemap,

      // 🗜️ 压缩配置
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: env.dropConsole,
          drop_debugger: env.dropDebugger,
        },
      },

      // 📊 文件大小限制
      chunkSizeWarningLimit: 2000,

      // 🔄 代码分割
      rollupOptions: {
        input: {
          main: resolve(__dirname, 'index.html'),
        },
        output: {
          // 静态资源分类
          assetFileNames: assetInfo => {
            const info = assetInfo.name!.split('.')
            let extType = info[info.length - 1]

            if (/\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/i.test(assetInfo.name!)) {
              extType = 'media'
            } else if (/\.(png|jpe?g|gif|svg)(\?.*)?$/.test(assetInfo.name!)) {
              extType = 'images'
            } else if (/\.(woff2?|eot|ttf|otf)(\?.*)?$/i.test(assetInfo.name!)) {
              extType = 'fonts'
            }

            return `assets/${extType}/[name]-[hash][extname]`
          },

          // JS 文件分类
          chunkFileNames: chunkInfo => {
            const facadeModuleId = chunkInfo.facadeModuleId
              ? chunkInfo.facadeModuleId.split('/').pop()?.split('.')[0]
              : 'unknown'
            return `assets/js/[name]-[hash].js`
          },

          // 手动分割代码块
          manualChunks: {
            // Vue 生态
            vue: ['vue', 'vue-router', 'pinia'],

            // UI 库
            ui: ['@headlessui/vue', '@vueuse/core'],

            // 工具库
            utils: ['lodash-es', 'dayjs'],

            // 图表库
            charts: ['echarts', 'chart.js'],
          },
        },
      },
    },

    // 🔍 依赖预构建
    optimizeDeps: {
      include: ['vue', 'vue-router', 'pinia', 'vue-i18n', '@vueuse/core', 'lodash-es', 'alova'],
      exclude: ['@iconify/json'],
    },

    // 🎨 CSS 配置
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `@import "@/assets/styles/variables.scss";`,
        },
      },
      postcss: {
        plugins: [
          require('postcss-pxtorem')({
            rootValue: env.postcssRootValue,
            propList: ['*'],
            selectorBlackList: [
              // 排除 UnoCSS 工具类
              /^\.([whmp][tblrxysa]?-|text-|bg-|border-|rounded-|flex|grid)/,
              /^\.([0-9]+|xs|sm|md|lg|xl|2xl|3xl|4xl|5xl|6xl|7xl|8xl|9xl):/,
              /^:root$/,
              /no-rem/,
            ],
            mediaQuery: false,
            minPixelValue: 1,
          }),
        ],
      },
    },

    // 📋 TypeScript 配置
    esbuild: {
      pure: isBuild ? ['console.log', 'console.info'] : [],
      drop: isBuild ? ['console', 'debugger'] : [],
    },

    // 🧪 测试相关
    test: {
      globals: true,
      environment: 'jsdom',
    },
  }
})
```

### 插件配置

```typescript
// build/plugins.ts
import type { PluginOption } from 'vite'
import vue from '@vitejs/plugin-vue'
import legacy from '@vitejs/plugin-legacy'
import { createHtmlPlugin } from 'vite-plugin-html'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import { visualizer } from 'rollup-plugin-visualizer'
import { compression } from 'vite-plugin-compression2'
import UnoCSS from 'unocss/vite'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { resolve } from 'path'
import { env } from '../src/utils/env'

export function createVitePlugins(
  viteEnv: Record<string, string>,
  isBuild: boolean
): PluginOption[] {
  const plugins: PluginOption[] = [
    // Vue 支持
    vue({
      script: {
        defineModel: true,
        propsDestructure: true,
      },
    }),

    // UnoCSS 原子化 CSS
    UnoCSS(),

    // HTML 模板处理
    createHtmlPlugin({
      minify: isBuild,
      inject: {
        data: {
          title: env.appTitle,
          description: 'CC-Admin 企业级后台管理框架',
        },
      },
    }),

    // 自动导入 Vue API
    AutoImport({
      imports: [
        'vue',
        'vue-router',
        'pinia',
        '@vueuse/core',
        {
          'vue-i18n': ['useI18n'],
        },
      ],
      dts: 'src/types/auto-imports.d.ts',
      dirs: ['src/composables/**', 'src/stores/modules', 'src/utils/**'],
      vueTemplate: true,
    }),

    // 自动导入组件
    Components({
      dts: 'src/types/components.d.ts',
      dirs: ['src/components/**'],
      extensions: ['vue'],
      deep: true,
      resolvers: [],
    }),

    // SVG 图标处理
    createSvgIconsPlugin({
      iconDirs: [resolve(process.cwd(), 'src/assets/icons')],
      symbolId: 'icon-[dir]-[name]',
      svgoOptions: {
        plugins: [
          {
            name: 'removeAttrs',
            params: {
              attrs: ['class', 'data-name'],
            },
          },
        ],
      },
    }),
  ]

  // 生产环境插件
  if (isBuild) {
    // Legacy 浏览器支持
    if (env.legacy) {
      plugins.push(
        legacy({
          targets: ['defaults', 'not IE 11'],
        })
      )
    }

    // 代码压缩
    if (env.compression !== 'none') {
      if (env.compression === 'gzip' || env.compression === 'both') {
        plugins.push(
          compression({
            algorithm: 'gzip',
            exclude: [/\.(br)$ /, /\.(gz)$/],
          })
        )
      }

      if (env.compression === 'brotli' || env.compression === 'both') {
        plugins.push(
          compression({
            algorithm: 'brotliCompress',
            exclude: [/\.(br)$ /, /\.(gz)$/],
          })
        )
      }
    }

    // 构建分析
    if (env.buildAnalyze) {
      plugins.push(
        visualizer({
          filename: 'dist/report.html',
          open: true,
          gzipSize: true,
          brotliSize: true,
        })
      )
    }
  }

  return plugins
}
```

### 构建工具函数

```typescript
// build/utils.ts
import type { ProxyOptions } from 'vite'

/**
 * 创建代理配置
 */
export function createProxy(viteEnv: Record<string, string>): Record<string, ProxyOptions> {
  const proxy: Record<string, ProxyOptions> = {}

  // API 代理
  if (viteEnv.VITE_API_BASE_URL) {
    proxy['/api'] = {
      target: viteEnv.VITE_API_BASE_URL,
      changeOrigin: true,
      rewrite: path => path.replace(/^\/api/, ''),
    }
  }

  // WebSocket 代理
  if (viteEnv.VITE_WS_URL) {
    proxy['/ws'] = {
      target: viteEnv.VITE_WS_URL,
      ws: true,
      changeOrigin: true,
    }
  }

  return proxy
}

/**
 * 获取构建时间
 */
export function getBuildTime(): string {
  return new Date().toLocaleString('zh-CN', {
    timeZone: 'Asia/Shanghai',
  })
}

/**
 * 获取Git信息
 */
export function getGitInfo(): { branch: string; commit: string; date: string } {
  try {
    const { execSync } = require('child_process')

    const branch = execSync('git rev-parse --abbrev-ref HEAD').toString().trim()

    const commit = execSync('git rev-parse --short HEAD').toString().trim()

    const date = execSync('git log -1 --format=%cd --date=format:"%Y-%m-%d %H:%M:%S"')
      .toString()
      .trim()

    return { branch, commit, date }
  } catch (error) {
    console.warn('获取Git信息失败:', error)
    return { branch: 'unknown', commit: 'unknown', date: 'unknown' }
  }
}

/**
 * 创建环境变量定义
 */
export function createDefine(viteEnv: Record<string, string>): Record<string, string> {
  const define: Record<string, string> = {}

  // 构建信息
  const buildInfo = {
    time: getBuildTime(),
    ...getGitInfo(),
  }

  define.__BUILD_TIME__ = JSON.stringify(buildInfo.time)
  define.__GIT_BRANCH__ = JSON.stringify(buildInfo.branch)
  define.__GIT_COMMIT__ = JSON.stringify(buildInfo.commit)
  define.__GIT_DATE__ = JSON.stringify(buildInfo.date)

  // 环境变量
  Object.keys(viteEnv).forEach(key => {
    define[`process.env.${key}`] = JSON.stringify(viteEnv[key])
  })

  return define
}
```

## 🚀 性能优化配置

### 代码分割策略

```typescript
// build/performance.ts
import type { ManualChunksOption } from 'rollup'

/**
 * 创建手动代码分割配置
 */
export function createManualChunks(): ManualChunksOption {
  return (id: string) => {
    // Node modules 分割
    if (id.includes('node_modules')) {
      // Vue 生态系统
      if (id.includes('vue') || id.includes('pinia') || id.includes('vue-router')) {
        return 'vue-vendor'
      }

      // UI 组件库
      if (id.includes('@headlessui') || id.includes('@vueuse')) {
        return 'ui-vendor'
      }

      // 工具库
      if (id.includes('lodash') || id.includes('dayjs') || id.includes('axios')) {
        return 'utils-vendor'
      }

      // 图标库
      if (id.includes('@iconify') || id.includes('lucide')) {
        return 'icons-vendor'
      }

      // 图表库
      if (id.includes('echarts') || id.includes('chart.js')) {
        return 'charts-vendor'
      }

      // 其他第三方库
      return 'vendor'
    }

    // 项目代码分割
    if (id.includes('src/')) {
      // 路由页面
      if (id.includes('src/views/')) {
        return 'views'
      }

      // 组件
      if (id.includes('src/components/')) {
        return 'components'
      }

      // Store
      if (id.includes('src/stores/')) {
        return 'stores'
      }

      // 工具函数
      if (id.includes('src/utils/')) {
        return 'utils'
      }

      // API
      if (id.includes('src/api/')) {
        return 'api'
      }
    }
  }
}

/**
 * 创建构建优化配置
 */
export function createBuildOptimization() {
  return {
    // 预构建配置
    optimizeDeps: {
      include: [
        'vue',
        'vue-router',
        'pinia',
        'vue-i18n',
        '@vueuse/core',
        '@vueuse/head',
        'lodash-es',
        'dayjs',
        'alova',
      ],
      exclude: ['@iconify/json'],
    },

    // 构建缓存
    cache: {
      type: 'filesystem' as const,
      cacheDirectory: 'node_modules/.vite',
      buildDependencies: {
        config: [__filename],
      },
    },

    // 并行构建
    build: {
      target: ['es2020', 'edge88', 'firefox78', 'chrome87', 'safari14'],

      // Rollup 选项
      rollupOptions: {
        output: {
          // 手动分割
          manualChunks: createManualChunks(),

          // 优化分割策略
          experimentalMinChunkSize: 20000,
        },

        // 外部依赖
        external: (id: string) => {
          // CDN 依赖
          if (process.env.VITE_CDN === 'true') {
            return ['vue', 'vue-router', 'pinia'].some(dep => id.includes(dep))
          }
          return false
        },
      },
    },
  }
}
```

### 开发环境优化

```typescript
// vite.config.ts - 开发环境配置
export default defineConfig(({ command, mode }) => {
  const isDev = command === 'serve'

  return {
    // 开发服务器优化
    server: {
      // 启用 HTTP/2
      https: false,

      // 预热频繁使用的文件
      warmup: {
        clientFiles: [
          './src/main.ts',
          './src/App.vue',
          './src/router/index.ts',
          './src/stores/index.ts',
        ],
      },

      // 文件系统缓存
      fs: {
        cachedChecks: false,
      },
    },

    // 开发环境依赖预构建
    optimizeDeps: {
      // 强制预构建
      force: false,

      // 预构建包含项
      include: [
        'vue',
        'vue-router',
        'pinia',
        'vue-i18n',
        '@vueuse/core',
        'lodash-es',
        'dayjs',
        'alova',
      ],

      // ESBuild 选项
      esbuildOptions: {
        target: 'es2020',
      },
    },

    // TypeScript 编译优化
    esbuild: {
      target: 'es2020',
      jsxFactory: 'h',
      jsxFragment: 'Fragment',
    },
  }
})
```

## 🔍 TypeScript 配置

### 主配置文件

```json
// tsconfig.json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "lib": ["ES2023", "DOM", "DOM.Iterable"],
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "preserve",

    // 严格模式
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,

    // 路径映射
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"],
      "#/*": ["src/types/*"],
      "~/*": ["node_modules/*"]
    },

    // 类型定义
    "types": ["vite/client", "node", "@vue/runtime-core", "@vueuse/core"]
  },

  "include": ["src/**/*.ts", "src/**/*.tsx", "src/**/*.vue", "build/**/*.ts", "*.config.ts"],

  "exclude": ["node_modules", "dist", "**/*.js"],

  "references": [{ "path": "./tsconfig.app.json" }, { "path": "./tsconfig.node.json" }]
}
```

### 应用配置

```json
// tsconfig.app.json
{
  "extends": "./tsconfig.json",
  "compilerOptions": {
    "composite": true,
    "tsBuildInfoFile": "./node_modules/.tmp/tsconfig.app.tsbuildinfo"
  },
  "include": ["src/**/*.ts", "src/**/*.tsx", "src/**/*.vue"]
}
```

### Node.js 配置

```json
// tsconfig.node.json
{
  "extends": "./tsconfig.json",
  "compilerOptions": {
    "composite": true,
    "noEmit": false,
    "tsBuildInfoFile": "./node_modules/.tmp/tsconfig.node.tsbuildinfo",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "types": ["node"]
  },
  "include": ["build/**/*.ts", "*.config.ts"]
}
```

## 🎨 CSS 构建配置

### PostCSS 配置

```javascript
// postcss.config.js
module.exports = {
  plugins: {
    // CSS 嵌套
    'postcss-nested': {},

    // 自定义属性
    'postcss-custom-properties': {},

    // px 转 rem
    'postcss-pxtorem': {
      rootValue: 16,
      propList: ['*'],
      selectorBlackList: [
        // 排除 UnoCSS 工具类
        /^\.([whmp][tblrxysa]?-|text-|bg-|border-|rounded-|flex|grid)/,
        /^\.([0-9]+|xs|sm|md|lg|xl|2xl|3xl|4xl|5xl|6xl|7xl|8xl|9xl):/,
        /^:root$/,
        /no-rem/,
      ],
      mediaQuery: false,
      minPixelValue: 1,
    },

    // 浏览器前缀
    autoprefixer: {
      overrideBrowserslist: ['Chrome >= 87', 'Firefox >= 78', 'Safari >= 14', 'Edge >= 88'],
    },

    // 生产环境优化
    ...(process.env.NODE_ENV === 'production'
      ? {
          cssnano: {
            preset: [
              'default',
              {
                discardComments: {
                  removeAll: true,
                },
              },
            ],
          },
        }
      : {}),
  },
}
```

### SCSS 全局变量

```scss
// src/assets/styles/variables.scss
// 主题色系变量
$primary-color: #1890ff;
$success-color: #52c41a;
$warning-color: #faad14;
$error-color: #f5222d;

// 布局变量
$sidebar-width: 240px;
$sidebar-collapsed-width: 64px;
$header-height: 64px;

// 断点变量
$breakpoints: (
  xs: 375px,
  sm: 768px,
  md: 1024px,
  lg: 1400px,
  xl: 1660px,
  xls: 1920px,
);

// 混入函数
@mixin respond-to($breakpoint) {
  @if map-has-key($breakpoints, $breakpoint) {
    @media (min-width: map-get($breakpoints, $breakpoint)) {
      @content;
    }
  }
}
```

## 📦 构建命令详解

### package.json 脚本

```json
{
  "scripts": {
    // 开发相关
    "dev": "vite --mode development",
    "dev:test": "vite --mode test",
    "dev:prod": "vite --mode production",

    // 构建相关
    "build": "npm run type-check && vite build",
    "build:dev": "vite build --mode development",
    "build:test": "vite build --mode test",
    "build:analyze": "npm run build && npm run preview:analyze",

    // 预览相关
    "preview": "vite preview",
    "preview:analyze": "vite-bundle-analyzer dist",

    // 代码质量
    "type-check": "vue-tsc --noEmit --skipLibCheck",
    "lint": "eslint . --ext .vue,.js,.jsx,.cjs,.mjs,.ts,.tsx,.cts,.mts --fix",
    "format": "prettier --write .",

    // 综合检查
    "check": "npm run type-check && npm run lint && npm run naming-check",

    // 清理缓存
    "clean": "rimraf dist node_modules/.vite node_modules/.cache",
    "clean:deps": "rimraf node_modules pnpm-lock.yaml && pnpm install",

    // Git 提交
    "commit": "git-cz",
    "prepare": "husky install"
  }
}
```

### 构建环境配置

```bash
# .env.production
NODE_ENV=production
VITE_APP_ENV=production

# 构建优化
VITE_DROP_CONSOLE=true
VITE_DROP_DEBUGGER=true
VITE_BUILD_SOURCEMAP=false
VITE_BUILD_ANALYZE=false

# 压缩配置
VITE_COMPRESSION=gzip
VITE_LEGACY=false

# CDN 配置
VITE_CDN=false
```

## 🔧 构建优化策略

### 1. 包体积优化

```typescript
// 动态导入优化
const asyncRoutes = [
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
        /* webpackChunkName: "user" */
        '@/views/user/index.vue'
      ),
  },
]

// Tree Shaking 优化
import { pick } from 'lodash-es' // ✅ 只导入需要的函数
// import _ from 'lodash' // ❌ 导入整个库

// 第三方库按需导入
import { createApp } from 'vue'
import { createRouter } from 'vue-router'
import { createPinia } from 'pinia'
```

### 2. 缓存策略

```typescript
// vite.config.ts
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        // 文件名哈希
        entryFileNames: 'assets/js/[name]-[hash].js',
        chunkFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: 'assets/[ext]/[name]-[hash].[ext]',

        // 手动分割长期缓存
        manualChunks: {
          // 框架代码 - 变化频率低
          framework: ['vue', 'vue-router', 'pinia'],

          // 工具库 - 变化频率低
          vendor: ['lodash-es', 'dayjs', '@vueuse/core'],

          // UI 组件 - 变化频率中等
          ui: ['@headlessui/vue'],
        },
      },
    },
  },
})
```

### 3. 构建速度优化

```typescript
// 并行构建
export default defineConfig({
  build: {
    // 启用并行构建
    minify: 'terser',
    terserOptions: {
      parallel: true,
    },

    // 增量构建
    cache: {
      type: 'filesystem',
      buildDependencies: {
        config: [__filename],
      },
    },
  },

  // 预构建优化
  optimizeDeps: {
    // 预构建缓存
    force: false,

    // 并发处理
    esbuildOptions: {
      target: 'esnext',
    },
  },
})
```

## 📊 构建分析工具

### 1. Bundle Analyzer

```typescript
// build/analyzer.ts
import { visualizer } from 'rollup-plugin-visualizer'
import type { PluginOption } from 'vite'

export function createAnalyzer(): PluginOption {
  return visualizer({
    filename: 'dist/stats.html',
    open: true,
    gzipSize: true,
    brotliSize: true,
    template: 'treemap', // sunburst, treemap, network
  })
}
```

### 2. 构建性能监控

```typescript
// build/monitor.ts
import type { Plugin } from 'vite'

export function createBuildMonitor(): Plugin {
  let startTime: number

  return {
    name: 'build-monitor',
    buildStart() {
      startTime = Date.now()
      console.log('🚀 开始构建...')
    },

    generateBundle(options, bundle) {
      const files = Object.keys(bundle)
      console.log(`📦 生成 ${files.length} 个文件`)
    },

    writeBundle() {
      const duration = Date.now() - startTime
      console.log(`✅ 构建完成，耗时 ${duration}ms`)
    },

    buildError(error) {
      console.error('❌ 构建失败:', error)
    },
  }
}
```

### 3. 构建报告

```bash
# 生成构建报告
pnpm build:analyze

# 查看报告内容
cat dist/build-report.json | jq '.'
```

## 🚀 部署构建

### 1. Docker 构建

```dockerfile
# Dockerfile
FROM node:18-alpine as builder

WORKDIR /app

# 安装 pnpm
RUN npm install -g pnpm

# 复制依赖文件
COPY package.json pnpm-lock.yaml ./

# 安装依赖
RUN pnpm install --frozen-lockfile

# 复制源代码
COPY . .

# 构建应用
RUN pnpm build

# 生产镜像
FROM nginx:alpine

# 复制构建产物
COPY --from=builder /app/dist /usr/share/nginx/html

# 复制 Nginx 配置
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

### 2. CI/CD 构建

```yaml
# .github/workflows/build.yml
name: Build and Deploy

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Setup pnpm
        uses: pnpm/action-setup@v2
        with:
          version: latest

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: Type check
        run: pnpm type-check

      - name: Lint
        run: pnpm lint

      - name: Build
        run: pnpm build

      - name: Upload artifacts
        uses: actions/upload-artifact@v3
        with:
          name: dist
          path: dist/
```

## 📋 构建清单

### 环境配置

| 环境            | 模式 | 特点               | 用途     |
| --------------- | ---- | ------------------ | -------- |
| **development** | 开发 | 热更新、源码映射   | 本地开发 |
| **test**        | 测试 | 模拟数据、调试工具 | 测试环境 |
| **production**  | 生产 | 代码压缩、优化     | 生产部署 |

### 构建产物

| 类型           | 路径                  | 说明             |
| -------------- | --------------------- | ---------------- |
| **HTML**       | `dist/index.html`     | 应用入口文件     |
| **JavaScript** | `dist/assets/js/`     | 编译后的 JS 文件 |
| **CSS**        | `dist/assets/css/`    | 样式文件         |
| **Images**     | `dist/assets/images/` | 图片资源         |
| **Fonts**      | `dist/assets/fonts/`  | 字体文件         |

### 性能指标

| 指标         | 目标值  | 说明             |
| ------------ | ------- | ---------------- |
| **首屏加载** | < 2s    | 首次内容绘制时间 |
| **包体积**   | < 1MB   | gzip 压缩后大小  |
| **构建时间** | < 60s   | 完整构建时间     |
| **热更新**   | < 500ms | 开发环境更新时间 |

## 🎯 总结

CC-Admin 的构建系统具有以下特点：

- ✅ **现代化工具链**: 基于 Vite 7+ 的高性能构建
- ✅ **完整的 TypeScript 支持**: 严格的类型检查和编译
- ✅ **智能代码分割**: 基于路由和依赖的自动分割
- ✅ **多环境配置**: 开发、测试、生产环境的差异化配置
- ✅ **性能优化**: 预构建、缓存、压缩等多重优化
- ✅ **构建分析**: 详细的构建报告和性能监控
- ✅ **部署就绪**: Docker 和 CI/CD 的完整支持
- ✅ **开发体验**: 热更新、自动导入等现代化特性

通过精心设计的构建配置，CC-Admin 实现了高效的开发体验和优化的生产构建！🚀
