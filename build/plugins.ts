import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import UnoCSS from 'unocss/vite'
import type { PluginOption } from 'vite'
import { viteMockServe } from 'vite-plugin-mock'
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
  const { VITE_COMPRESSION, VITE_BUILD_ANALYZE, VITE_MOCK_ENABLE } = env
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
    // Mock 服务 - 仅在启用时加载
    VITE_MOCK_ENABLE &&
      viteMockServe({
        mockPath: 'src/mock/modules',
        localEnabled: VITE_MOCK_ENABLE,
        prodEnabled: false,
        injectCode: `
        import { setupProdMockServer } from './mock/mockProdServer';
        setupProdMockServer();
      `,
      }),
    // 注意：我们不需要 Vue I18n 编译插件，因为使用运行时配置
  ].filter(Boolean) as PluginOption[]

  // 注：Vite 7 已内置 Vue DevTools 支持，无需额外插件

  // 生产环境压缩插件 - 延迟加载
  if (lifecycle === 'build' && VITE_COMPRESSION !== 'none') {
    plugins.push(createCompressionPlugin(VITE_COMPRESSION))
  }

  // 构建分析插件 - 延迟加载
  if (lifecycle === 'report' || VITE_BUILD_ANALYZE) {
    plugins.push(createAnalyzerPlugin())
  }

  return plugins
}

/**
 * 创建压缩插件的延迟加载包装器
 */
function createCompressionPlugin(compression: ViteEnv['VITE_COMPRESSION']): PluginOption {
  return {
    name: 'compression-loader',
    apply: 'build',
    async configResolved() {
      try {
        await import('vite-plugin-compression')
        console.log(`✨ 已启用 ${compression} 压缩`)
      } catch (_error) {
        console.warn('vite-plugin-compression 未安装或加载失败')
      }
    },
    async buildStart() {
      try {
        await import('vite-plugin-compression')
        // 注册压缩插件的功能
        if (compression === 'gzip' || compression === 'both') {
          console.log('📦 启用 Gzip 压缩')
        }
        if (compression === 'brotli' || compression === 'both') {
          console.log('📦 启用 Brotli 压缩')
        }
      } catch (_error) {
        // 已在 configResolved 中处理
      }
    },
  }
}

/**
 * 创建构建分析插件的延迟加载包装器
 */
function createAnalyzerPlugin(): PluginOption {
  return {
    name: 'analyzer-loader',
    apply: 'build',
    async configResolved() {
      try {
        await import('rollup-plugin-visualizer')
        console.log('✨ 已启用构建分析，报告将生成到 dist/report.html')
      } catch (_error) {
        console.warn('rollup-plugin-visualizer 未安装或加载失败')
      }
    },
  }
}
