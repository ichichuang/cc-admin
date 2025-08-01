/**
 * @copyright Copyright (c) 2025 chichuang
 * @license MIT
 * @description cc-admin 企业级后台管理框架 - vite.config
 * 本文件为 chichuang 原创，禁止擅自删除署名或用于商业用途。
 */

import { resolve } from 'path'
import { type ConfigEnv, defineConfig, loadEnv, type UserConfigExport } from 'vite'
import { exclude, include } from './build/optimize'
import { getPluginsList } from './build/plugins'
import { __APP_INFO__, wrapperEnv } from './build/utils'

export default ({ mode }: ConfigEnv): UserConfigExport => {
  // 直接使用全局@env.d.ts类型
  const env = wrapperEnv(loadEnv(mode, process.cwd()))
  const {
    VITE_PORT,
    VITE_PUBLIC_PATH,
    VITE_BUILD_SOURCEMAP,
    VITE_API_BASE_URL,
    VITE_APP_TITLE,
    VITE_APP_VERSION,
    VITE_APP_ENV,
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
    root: process.cwd(), // 使用当前工作目录作为根目录
    logLevel: isDev ? 'info' : 'warn', // 减少日志输出
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src'),
        '@cc/early-bird-core': resolve(__dirname, '../../packages/core'),
        '@cc/early-bird-ui': resolve(__dirname, '../../packages/ui'),
        '@cc/early-bird-types': resolve(__dirname, '../../packages/types'),
      },
      extensions: ['.mjs', '.ts', '.tsx', '.json', '.vue'],
    },
    server: {
      port: Number(VITE_PORT),
      host: '0.0.0.0',
      open: true,
      cors: true,
      strictPort: false,
      // 优化预热配置，减少启动时间
      warmup: {
        clientFiles: ['./index.html'],
      },
      hmr: {
        overlay: isDev,
        // 减少 HMR 超时时间，避免长时间等待
        timeout: 10000,
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
      // 添加预构建优化
      esbuildOptions: {
        target: 'es2020',
      },
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
          index: './index.html', // 使用相对路径
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
          // 暂时注释掉 PostCSS 配置，避免循环依赖
          // ...createPostcssConfigFromEnv(env).plugins,
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
