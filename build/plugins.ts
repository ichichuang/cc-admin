import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import UnoCSS from 'unocss/vite'
import type { PluginOption } from 'vite'
import { name, version } from '../package.json'
import type { ViteEnv } from './utils'

/**
 * 自定义启动信息插件
 * 在开发服务器启动时显示项目信息
 */
function startupInfoPlugin(): PluginOption {
  return {
    name: 'startup-info',
    configureServer(server) {
      const originalListen = server.listen
      server.listen = function (...args) {
        const result = originalListen.apply(this, args)

        // 在服务器启动后显示自定义信息
        result.then(() => {
          console.log()
          console.log(`\x1b[36m╭─────────────────────────────────────────╮\x1b[0m`)
          console.log(
            `\x1b[36m│\x1b[0m \x1b[1m\x1b[32m${name.toUpperCase()}\x1b[0m \x1b[90mv${version}\x1b[0m`
          )
          console.log(`\x1b[36m│\x1b[0m \x1b[90m现代化的 Vue3 + TypeScript 管理后台\x1b[0m    `)
          console.log(`\x1b[36m╰─────────────────────────────────────────╯\x1b[0m`)
          console.log()
        })

        return result
      }
    },
  }
}

export function getPluginsList(env: ViteEnv): PluginOption[] {
  const { VITE_COMPRESSION, VITE_BUILD_ANALYZE } = env
  const lifecycle = process.env.npm_lifecycle_event

  const plugins: PluginOption[] = [
    // 启动信息插件
    startupInfoPlugin(),
    // UnoCSS 原子化 CSS - 必须在 Vue 插件之前
    UnoCSS(),
    // Vue 支持
    vue(),
    // JSX/TSX 语法支持
    vueJsx(),
  ]

  // 注：Vite 7 已内置 Vue DevTools 支持，无需额外插件

  // 生产环境插件
  if (lifecycle === 'build' && VITE_COMPRESSION !== 'none') {
    // 代码压缩 - 动态导入避免类型错误
    const addCompressionPlugin = async () => {
      try {
        const compression = await import('vite-plugin-compression')
        if (VITE_COMPRESSION === 'gzip' || VITE_COMPRESSION === 'both') {
          plugins.push(compression.default({ ext: '.gz', algorithm: 'gzip' }))
        }
        if (VITE_COMPRESSION === 'brotli' || VITE_COMPRESSION === 'both') {
          plugins.push(compression.default({ ext: '.br', algorithm: 'brotliCompress' }))
        }
      } catch (_e) {
        console.warn('vite-plugin-compression not available')
      }
    }
    // 注：这里使用 void 避免未使用的 Promise 警告
    void addCompressionPlugin()
  }

  // 构建分析
  if (lifecycle === 'report' || VITE_BUILD_ANALYZE) {
    const addAnalyzerPlugin = async () => {
      try {
        const { visualizer } = await import('rollup-plugin-visualizer')
        plugins.push(
          visualizer({
            filename: 'dist/report.html',
            open: true,
            brotliSize: true,
            gzipSize: true,
          })
        )
      } catch (_e) {
        console.warn('rollup-plugin-visualizer not available')
      }
    }
    void addAnalyzerPlugin()
  }

  return plugins
}
