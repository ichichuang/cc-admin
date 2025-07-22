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
      extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.vue'],
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
          chunkFileNames: 'static/js/[name]-[hash].js',
          entryFileNames: 'static/js/[name]-[hash].js',
          assetFileNames: 'static/[ext]/[name]-[hash].[ext]',
          manualChunks: {
            vue: ['vue', 'vue-router', 'pinia'],
            vendor: ['alova', 'lodash-es'],
            utils: ['dayjs', 'crypto-js'],
          },
        },
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
            // 基准字体大小，与 rem 适配器保持一致
            rootValue: 16,
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
            // 过滤不需要转换的选择器 - 修复 UnoCSS 兼容性
            selectorBlackList: [
              // 修复：正确排除 UnoCSS 工具类
              /^\.([whmp][tblrxysa]?-|text-|bg-|border-|rounded-|flex|grid|absolute|relative|fixed|sticky)/,
              /^\.([0-9]+|xs|sm|md|lg|xl|2xl|3xl|4xl|5xl|6xl|7xl|8xl|9xl):/,
              // HTML 根元素不转换
              /^html$/,
              // 根字体大小相关不转换
              /^:root$/,
              // 某些第三方组件不转换
              /^\.el-/,
              /^\.ant-/,
              /^\.van-/,
              // 不转换包含 'no-rem' 的类名
              /no-rem/,
              // 不转换 UnoCSS 生成的响应式前缀
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
