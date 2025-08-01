import { performance } from 'node:perf_hooks'
import type { Plugin } from 'vite'

interface BuildStats {
  startTime: number
  endTime?: number
  duration?: number
  bundleSize?: string
  memoryUsage: {
    start: NodeJS.MemoryUsage
    peak: NodeJS.MemoryUsage
    end?: NodeJS.MemoryUsage
  }
  chunks: {
    count: number
    sizes: Record<string, number>
  }
  assets: {
    count: number
    totalSize: number
    byType: Record<string, { count: number; size: number }>
  }
}

interface PerformanceThresholds {
  buildTime: number // 秒
  bundleSize: number // MB
  chunkCount: number
  memoryUsage: number // MB
}

/**
 * 性能阈值配置
 */
const DEFAULT_THRESHOLDS: PerformanceThresholds = {
  buildTime: 60, // 1分钟
  bundleSize: 5, // 5MB
  chunkCount: 50,
  memoryUsage: 512, // 512MB
}

/**
 * 格式化字节数
 */
function formatBytes(bytes: number): string {
  if (bytes === 0) {
    return '0 B'
  }
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`
}

/**
 * 格式化时间
 */
function formatTime(ms: number): string {
  if (ms < 1000) {
    return `${ms.toFixed(0)}ms`
  }
  return `${(ms / 1000).toFixed(2)}s`
}

/**
 * 获取内存使用情况
 */
function getMemoryUsage(): NodeJS.MemoryUsage {
  return process.memoryUsage()
}

/**
 * 分析内存使用变化
 */
function analyzeMemoryUsage(start: NodeJS.MemoryUsage, end: NodeJS.MemoryUsage) {
  const heapUsedDiff = end.heapUsed - start.heapUsed
  const heapTotalDiff = end.heapTotal - start.heapTotal
  const rssDiff = end.rss - start.rss

  return {
    heapUsed: {
      start: formatBytes(start.heapUsed),
      end: formatBytes(end.heapUsed),
      diff: formatBytes(heapUsedDiff),
      increased: heapUsedDiff > 0,
    },
    heapTotal: {
      start: formatBytes(start.heapTotal),
      end: formatBytes(end.heapTotal),
      diff: formatBytes(heapTotalDiff),
      increased: heapTotalDiff > 0,
    },
    rss: {
      start: formatBytes(start.rss),
      end: formatBytes(end.rss),
      diff: formatBytes(rssDiff),
      increased: rssDiff > 0,
    },
  }
}

/**
 * 生成性能报告
 */
function generatePerformanceReport(stats: BuildStats, thresholds: PerformanceThresholds) {
  const duration = stats.duration || 0
  const memoryAnalysis = stats.memoryUsage.end
    ? analyzeMemoryUsage(stats.memoryUsage.start, stats.memoryUsage.end)
    : null

  console.log('\n📊 构建性能报告:')
  console.log('='.repeat(50))

  // 时间统计
  console.log('\n⏱️  时间统计:')
  console.log(`   总耗时: ${formatTime(duration)}`)

  if (duration > thresholds.buildTime * 1000) {
    console.log(`   ⚠️  构建时间超过阈值 ${thresholds.buildTime}s`)
  } else {
    console.log(`   ✅ 构建时间在合理范围内`)
  }

  // 内存统计
  if (memoryAnalysis) {
    console.log('\n💾 内存使用:')
    console.log(
      `   堆内存: ${memoryAnalysis.heapUsed.start} → ${memoryAnalysis.heapUsed.end} (${memoryAnalysis.heapUsed.increased ? '+' : ''}${memoryAnalysis.heapUsed.diff})`
    )
    console.log(
      `   总内存: ${memoryAnalysis.heapTotal.start} → ${memoryAnalysis.heapTotal.end} (${memoryAnalysis.heapTotal.increased ? '+' : ''}${memoryAnalysis.heapTotal.diff})`
    )
    console.log(
      `   RSS: ${memoryAnalysis.rss.start} → ${memoryAnalysis.rss.end} (${memoryAnalysis.rss.increased ? '+' : ''}${memoryAnalysis.rss.diff})`
    )

    const peakMemoryMB = stats.memoryUsage.peak.heapUsed / 1024 / 1024
    if (peakMemoryMB > thresholds.memoryUsage) {
      console.log(
        `   ⚠️  峰值内存使用超过阈值 ${thresholds.memoryUsage}MB (当前: ${peakMemoryMB.toFixed(2)}MB)`
      )
    }
  }

  // 产物统计
  console.log('\n📦 构建产物:')
  if (stats.bundleSize) {
    console.log(`   总大小: ${stats.bundleSize}`)
  }
  console.log(`   文件数量: ${stats.assets.count}`)
  console.log(`   代码块数量: ${stats.chunks.count}`)

  if (stats.chunks.count > thresholds.chunkCount) {
    console.log(`   ⚠️  代码块数量过多，可能影响加载性能`)
  }

  // 文件类型分析
  if (Object.keys(stats.assets.byType).length > 0) {
    console.log('\n📂 文件类型分布:')
    Object.entries(stats.assets.byType).forEach(([type, info]) => {
      console.log(`   ${type}: ${info.count} 个文件, ${formatBytes(info.size)}`)
    })
  }

  // 性能建议
  generateOptimizationSuggestions(stats, thresholds)
}

/**
 * 生成优化建议
 */
function generateOptimizationSuggestions(stats: BuildStats, thresholds: PerformanceThresholds) {
  const suggestions: string[] = []
  const duration = stats.duration || 0

  // 构建时间建议
  if (duration > thresholds.buildTime * 1000) {
    suggestions.push('构建时间过长，建议检查依赖优化配置')
    suggestions.push('考虑启用持久化缓存或增加并行处理')
  }

  // 内存使用建议
  const peakMemoryMB = stats.memoryUsage.peak.heapUsed / 1024 / 1024
  if (peakMemoryMB > thresholds.memoryUsage) {
    suggestions.push('内存使用过高，建议优化大型依赖或分割构建任务')
  }

  // 代码块建议
  if (stats.chunks.count > thresholds.chunkCount) {
    suggestions.push('代码块过多，建议调整 chunk splitting 策略')
  }

  // 文件类型建议
  const jsSize = stats.assets.byType['.js']?.size || 0
  const cssSize = stats.assets.byType['.css']?.size || 0

  if (jsSize > 2 * 1024 * 1024) {
    // 2MB
    suggestions.push('JavaScript 文件过大，建议启用代码分割')
  }

  if (cssSize > 500 * 1024) {
    // 500KB
    suggestions.push('CSS 文件过大，建议启用 CSS 代码分割')
  }

  if (suggestions.length > 0) {
    console.log('\n💡 优化建议:')
    suggestions.forEach((suggestion, index) => {
      console.log(`   ${index + 1}. ${suggestion}`)
    })
  } else {
    console.log('\n✅ 构建性能良好，无需优化')
  }
}

/**
 * 构建性能监控插件
 */
export function createPerformancePlugin(thresholds: Partial<PerformanceThresholds> = {}): Plugin {
  const finalThresholds: PerformanceThresholds = { ...DEFAULT_THRESHOLDS, ...thresholds }
  const stats: BuildStats = {
    startTime: 0,
    memoryUsage: {
      start: getMemoryUsage(),
      peak: getMemoryUsage(),
    },
    chunks: {
      count: 0,
      sizes: {},
    },
    assets: {
      count: 0,
      totalSize: 0,
      byType: {},
    },
  }

  // 监控内存峰值
  const memoryMonitor = setInterval(() => {
    const current = getMemoryUsage()
    if (current.heapUsed > stats.memoryUsage.peak.heapUsed) {
      stats.memoryUsage.peak = current
    }
  }, 1000)

  return {
    name: 'performance-monitor',
    buildStart() {
      stats.startTime = performance.now()
      stats.memoryUsage.start = getMemoryUsage()
      console.log('🚀 构建开始，启动性能监控...')
    },
    generateBundle(options, bundle) {
      // 分析构建产物
      stats.chunks.count = 0
      stats.assets.count = 0
      stats.assets.totalSize = 0
      stats.assets.byType = {}

      Object.entries(bundle).forEach(([fileName, chunk]) => {
        if (chunk.type === 'chunk') {
          stats.chunks.count++
          stats.chunks.sizes[fileName] = 'code' in chunk ? chunk.code.length : 0
        }

        stats.assets.count++
        const size =
          'code' in chunk ? chunk.code.length : 'source' in chunk ? chunk.source.length : 0
        stats.assets.totalSize += size

        // 按文件类型分类
        const ext = fileName.substring(fileName.lastIndexOf('.'))
        if (!stats.assets.byType[ext]) {
          stats.assets.byType[ext] = { count: 0, size: 0 }
        }
        stats.assets.byType[ext].count++
        stats.assets.byType[ext].size += size
      })
    },
    buildEnd() {
      clearInterval(memoryMonitor)
      stats.endTime = performance.now()
      stats.duration = stats.endTime - stats.startTime
      stats.memoryUsage.end = getMemoryUsage()

      console.log(`⚡ 构建完成，耗时: ${formatTime(stats.duration)}`)
    },
    closeBundle() {
      // 获取构建产物大小
      import('./utils')
        .then(({ getPackageSize }) => {
          getPackageSize({
            callback: size => {
              stats.bundleSize = size
              generatePerformanceReport(stats, finalThresholds)
            },
          })
        })
        .catch(() => {
          generatePerformanceReport(stats, finalThresholds)
        })
    },
  }
}

/**
 * Bundle 分析报告插件
 */
export function createBundleAnalyzerPlugin(open = false): Plugin {
  return {
    name: 'bundle-analyzer',
    apply: 'build' as const,
    async closeBundle() {
      if (process.env.ANALYZE || process.env.VITE_BUILD_ANALYZE === 'true') {
        try {
          const { visualizer } = await import('rollup-plugin-visualizer')
          // 直接调用 visualizer 生成报告
          await visualizer({
            filename: 'dist/report.html',
            open,
            gzipSize: true,
            brotliSize: true,
            template: 'treemap',
            title: 'cc-admin 构建分析报告',
          })

          console.log('📊 构建分析报告已生成: dist/report.html')
          if (open) {
            console.log('🌐 正在打开分析报告...')
          }
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
export function showBuildInfo(): void {
  const nodeVersion = process.version
  const platform = process.platform
  const arch = process.arch
  const memory = Math.round(process.memoryUsage().heapUsed / 1024 / 1024)

  console.log(`
🔧 构建环境信息:
   Node.js: ${nodeVersion}
   平台: ${platform}
   架构: ${arch}
   内存: ${memory}MB
   时间: ${new Date().toLocaleString('zh-CN')}
`)
}
