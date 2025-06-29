import { type ConfigEnv, defineConfig, loadEnv, type UserConfigExport } from 'vite'
import { exclude, include } from './build/optimize'
import { getPluginsList } from './build/plugins'
import { __APP_INFO__, alias, pathResolve, root, wrapperEnv } from './build/utils'

export default ({ mode }: ConfigEnv): UserConfigExport => {
  const env = wrapperEnv(loadEnv(mode, root))
  const { VITE_PORT, VITE_PUBLIC_PATH, VITE_BUILD_SOURCEMAP, VITE_API_BASE_URL } = env
  const isDev = mode === 'development'

  return defineConfig({
    base: VITE_PUBLIC_PATH,
    root,

    // 日志级别设置
    logLevel: isDev ? 'info' : 'info',

    resolve: {
      alias,
      // 扩展名解析优先级
      extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.vue'],
    },

    // 开发服务器配置
    server: {
      port: VITE_PORT,
      host: '0.0.0.0', // 监听所有网络接口
      open: true,
      cors: true,
      strictPort: false, // 如果端口被占用，尝试下一个端口
      // 预热文件以提前转换和缓存结果
      warmup: {
        clientFiles: ['./index.html', './src/{views,components}/*'],
      },
      // 减少HMR错误覆盖层的干扰
      hmr: {
        overlay: isDev, // 开发环境显示错误覆盖层
      },
      // 代理配置
      proxy: {
        ['/api']: {
          target: VITE_API_BASE_URL,
          changeOrigin: true,
          rewrite: path => path.replace(/^\/api/, ''),
        },
      },
    },

    // 插件配置
    plugins: getPluginsList(env),

    // 依赖优化
    optimizeDeps: {
      include,
      exclude,
      // 在开发中强制预构建依赖
      force: false,
    },

    // 构建配置
    build: {
      target: 'es2015',
      sourcemap: VITE_BUILD_SOURCEMAP,
      minify: 'terser',
      // 消除打包大小超过警告 (借鉴 Pure Admin 设置)
      chunkSizeWarningLimit: 4000,
      terserOptions: {
        compress: {
          // 生产环境移除 console 和 debugger
          drop_console: !isDev,
          drop_debugger: !isDev,
          // 移除无用代码
          ['pure_funcs']: !isDev ? ['console.log', 'console.info', 'console.debug'] : [],
        },
      },
      rollupOptions: {
        input: {
          index: pathResolve('./index.html', import.meta.url),
        },
        // 静态资源分类打包
        output: {
          chunkFileNames: 'static/js/[name]-[hash].js',
          entryFileNames: 'static/js/[name]-[hash].js',
          assetFileNames: 'static/[ext]/[name]-[hash].[ext]',
          // 手动分包优化
          manualChunks: {
            vue: ['vue', 'vue-router', 'pinia'],
            vendor: ['alova', 'lodash-es'],
            utils: ['dayjs', 'crypto-js'],
          },
        },
      },
    },

    // 全局常量定义
    define: {
      __APP_INFO__: JSON.stringify(__APP_INFO__),
    },

    // CSS 配置
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
