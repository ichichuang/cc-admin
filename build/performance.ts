import { performance } from 'node:perf_hooks'
import type { Plugin } from 'vite'

interface BuildStats {
  startTime: number
  endTime?: number
  duration?: number
  bundleSize?: string
}

/**
 * 构建性能监控插件
 */
export function createPerformancePlugin(): Plugin {
  const stats: BuildStats = {
    startTime: 0,
  }

  return {
    name: 'performance-monitor',
    buildStart() {
      stats.startTime = performance.now()
      console.log('🚀 构建开始...')
    },
    buildEnd() {
      stats.endTime = performance.now()
      stats.duration = stats.endTime - stats.startTime
      console.log(`⚡ 构建完成，耗时: ${(stats.duration / 1000).toFixed(2)}s`)
    },
    closeBundle() {
      // 获取构建产物大小
      import('../build/utils').then(({ getPackageSize }) => {
        getPackageSize({
          callback: size => {
            stats.bundleSize = size
            console.log(`📦 构建产物大小: ${size}`)
          },
        })
      })
    },
    generateBundle() {
      // 分析打包性能
      console.log('📊 正在分析打包性能...')
    },
  }
}

/**
 * Bundle 分析报告插件
 */
export function createBundleAnalyzerPlugin(open = false) {
  return {
    name: 'bundle-analyzer',
    apply: 'build' as const,
    async generateBundle() {
      if (process.env.ANALYZE) {
        try {
          const { visualizer } = await import('rollup-plugin-visualizer')
          return visualizer({
            filename: 'dist/report.html',
            open,
            gzipSize: true,
            brotliSize: true,
            template: 'treemap', // sunburst, treemap, network
          })
        } catch (error) {
          console.warn('Bundle analyzer 加载失败:', error)
        }
      }
    },
  }
}

/**
 * 构建信息展示
 */
export function showBuildInfo() {
  const nodeVersion = process.version
  const platform = process.platform
  const arch = process.arch

  console.log(`
🔧 构建环境信息:
   Node.js: ${nodeVersion}
   平台: ${platform}
   架构: ${arch}
   内存: ${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)}MB
`)
}
