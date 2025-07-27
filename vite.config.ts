import postcssPxToRem from 'postcss-pxtorem'
import { type ConfigEnv, defineConfig, loadEnv, type UserConfigExport } from 'vite'
import { exclude, include } from './build/optimize'
import { getPluginsList } from './build/plugins'
import { __APP_INFO__, alias, pathResolve, root, wrapperEnv } from './build/utils'

// 移除本地ViteEnv类型声明

export default ({ mode }: ConfigEnv): UserConfigExport => {
  // 直接使用全局@env.d.ts类型
  const env = wrapperEnv(loadEnv(mode, root))
  const {
    VITE_PORT,
    VITE_PUBLIC_PATH,
    VITE_BUILD_SOURCEMAP,
    VITE_API_BASE_URL,
    VITE_APP_TITLE,
    VITE_APP_VERSION,
    VITE_APP_ENV,
    VITE_PINIA_PERSIST_KEY_PREFIX,
    VITE_ROOT_REDIRECT,
    VITE_LOADING_SIZE,
    VITE_DEV_TOOLS,
    VITE_MOCK_ENABLE,
    VITE_CONSOLE_LOG,
    VITE_DEBUG,
    VITE_DROP_DEBUGGER,
    VITE_DROP_CONSOLE,
    VITE_COMPRESSION,
    VITE_LEGACY,
    VITE_CDN,
    VITE_API_TIMEOUT,
  } = env

  const isDev = mode === 'development'

  return defineConfig({
    base: VITE_PUBLIC_PATH,
    root,
    logLevel: isDev ? 'info' : 'info',
    resolve: {
      alias,
      extensions: ['.mjs', '.ts', '.tsx', '.json', '.vue'],
    },
    server: {
      port: Number(VITE_PORT),
      host: '0.0.0.0',
      open: true,
      cors: true,
      strictPort: false,
      warmup: {
        clientFiles: ['./index.html', './src/{views,components}/*'],
      },
      hmr: {
        overlay: isDev,
        // 优化HMR连接，减少扩展冲突
        timeout: 30000,
      },
      proxy: {
        ['/api']: {
          target: VITE_API_BASE_URL,
          changeOrigin: true,
          rewrite: path => path.replace(/^\/api/, ''),
          timeout: Number(VITE_API_TIMEOUT) || 10000,
        },
      },
    },
    plugins: getPluginsList({
      ...env,
      VITE_PORT: Number(env.VITE_PORT),
      VITE_CDN: env.VITE_CDN,
      VITE_LEGACY: env.VITE_LEGACY,
      VITE_COMPRESSION: (['none', 'gzip', 'brotli', 'both'].includes(env.VITE_COMPRESSION)
        ? env.VITE_COMPRESSION
        : 'none') as 'none' | 'gzip' | 'brotli' | 'both',
    }),
    optimizeDeps: {
      include,
      exclude,
      force: false,
    },
    build: {
      target: 'es2015',
      sourcemap: VITE_BUILD_SOURCEMAP,
      minify: 'terser',
      chunkSizeWarningLimit: 4000,
      terserOptions: {
        compress: {
          drop_console: VITE_DROP_CONSOLE,
          drop_debugger: VITE_DROP_DEBUGGER,
          // eslint-disable-next-line @typescript-eslint/naming-convention
          pure_funcs: VITE_DROP_CONSOLE ? ['console.log', 'console.info', 'console.debug'] : [],
        },
      },
      rollupOptions: {
        input: {
          index: pathResolve('./index.html', import.meta.url),
        },
        output: {
          chunkFileNames: 'static/ts/[name]-[hash].js',
          entryFileNames: 'static/ts/[name]-[hash].js',
          assetFileNames: 'static/[ext]/[name]-[hash].[ext]',
          manualChunks: {
            vue: ['vue', 'vue-router', 'pinia'],
            vendor: ['alova', 'lodash-es'],
          },
        },
      },
      // 确保不会 tree-shaking 掉 mock 相关代码
      commonjsOptions: {
        include: [/node_modules/],
      },
    },
    define: {
      __APP_INFO__: JSON.stringify(__APP_INFO__),

      processEnv: env,
      __VITE_APP_TITLE__: JSON.stringify(VITE_APP_TITLE),
      __VITE_APP_VERSION__: JSON.stringify(VITE_APP_VERSION),
      __VITE_APP_ENV__: JSON.stringify(VITE_APP_ENV),
      __VITE_PINIA_PERSIST_KEY_PREFIX__: JSON.stringify(VITE_PINIA_PERSIST_KEY_PREFIX),
      __VITE_ROOT_REDIRECT__: JSON.stringify(VITE_ROOT_REDIRECT),
      __VITE_LOADING_SIZE__: JSON.stringify(VITE_LOADING_SIZE),
      __VITE_DEV_TOOLS__: JSON.stringify(VITE_DEV_TOOLS),
      __VITE_MOCK_ENABLE__: JSON.stringify(VITE_MOCK_ENABLE),
      __VITE_CONSOLE_LOG__: JSON.stringify(VITE_CONSOLE_LOG),
      __VITE_DEBUG__: JSON.stringify(VITE_DEBUG),
      __VITE_COMPRESSION__: JSON.stringify(VITE_COMPRESSION),
      __VITE_LEGACY__: JSON.stringify(VITE_LEGACY),
      __VITE_CDN__: JSON.stringify(VITE_CDN),
    },
    css: {
      postcss: {
        plugins: [
          {
            postcssPlugin: 'internal:charset-removal',
            AtRule: {
              charset: atRule => {
                if (atRule.name === 'charset') {
                  atRule.remove()
                }
              },
            },
          },
          // postcss-pxtorem 配置
          postcssPxToRem({
            // 基准字体大小，从环境变量读取
            rootValue: Number(env.VITE_POSTCSS_ROOT_VALUE) || 16,
            // 需要转换的CSS属性，* 表示所有属性
            propList: [
              '*',
              // 不转换边框相关，避免出现 0.5px 等问题
              '!border',
              '!border-width',
              '!border-top-width',
              '!border-right-width',
              '!border-bottom-width',
              '!border-left-width',
            ],
            // 过滤不需要转换的选择器 - 修复设计稿映射兼容性
            selectorBlackList: [
              // ✅ 排除传统 UnoCSS 工具类（非数字值）
              /^\.w-(full|auto|screen|min|max|fit)/, // w-full, w-auto 等
              /^\.h-(full|auto|screen|min|max|fit)/, // h-full, h-auto 等
              /^\.text-(xs|sm|base|lg|xl|2xl|3xl|4xl|5xl|6xl|7xl|8xl|9xl)/, // text-sm, text-lg 等
              /^\.p-(auto|px|py)/, // p-auto, px-4 等
              /^\.m-(auto|px|py)/, // m-auto, mx-4 等

              // ✅ 排除其他 UnoCSS 工具类
              /^\.bg-/, // 背景颜色类
              /^\.border-(?![\d])/, // 边框类（排除 border-2 等数字）
              /^\.rounded-(?![\d])/, // 圆角类（排除 rounded-8 等数字）
              /^\.flex/, // 布局类
              /^\.grid/, // 网格类
              /^\.absolute|\.relative|\.fixed|\.sticky/, // 定位类
              /^\.justify-|\.items-|\.content-/, // 对齐类
              /^\.overflow-|\.cursor-|\.select-/, // 其他工具类

              // ✅ 排除响应式前缀
              /^\.([0-9]+|xs|sm|md|lg|xl|2xl|3xl|4xl|5xl|6xl|7xl|8xl|9xl):/,

              // ✅ 排除系统类
              /^html$/, // HTML 根元素
              /^:root$/, // CSS 根变量

              // ✅ 排除第三方组件
              /^\.el-/, // Element Plus
              /^\.ant-/, // Ant Design
              /^\.van-/, // Vant

              // ✅ 排除明确标记的类
              /no-rem/, // 明确不转换的类

              // ✅ 排除媒体查询
              /^@media.*\.(xs|sm|md|lg|xl|2xl):/,
            ],
            // 替换规则
            replace: true,
            // 允许在媒体查询中转换px
            mediaQuery: true,
            // 设置要转换的最小像素值
            minPixelValue: 1,
            // 保留单位精度
            unitPrecision: 4,
            // 排除文件或文件夹
            exclude: /node_modules/i,
          }),
        ],
      },
      preprocessorOptions: {
        scss: {
          charset: false,
        },
      },
    },
  })
}
