import type { PluginOption } from 'vite'

/**
 * 代码压缩配置
 * @param compress 压缩类型
 * @param deleteOriginFile 是否删除原文件
 */
export function configCompressPlugin(
  compress: 'gzip' | 'brotli' | 'both' | 'none',
  deleteOriginFile = false
): PluginOption | PluginOption[] {
  const plugins: PluginOption[] = []

  if (compress === 'none') {
    return []
  }

  const addCompressionPlugin = async () => {
    try {
      const { default: compression } = await import('vite-plugin-compression')

      if (compress === 'gzip' || compress === 'both') {
        plugins.push(
          compression({
            ext: '.gz',
            algorithm: 'gzip',
            deleteOriginFile,
            threshold: 1024, // 只压缩大于 1KB 的文件
            compressionOptions: {
              level: 9, // 最高压缩级别
            },
          })
        )
      }

      if (compress === 'brotli' || compress === 'both') {
        plugins.push(
          compression({
            ext: '.br',
            algorithm: 'brotliCompress',
            deleteOriginFile,
            threshold: 1024,
            compressionOptions: {
              // Brotli 高质量压缩
              level: 6,
            },
          })
        )
      }
    } catch (error) {
      console.warn('compression plugin load failed:', error)
    }
  }

  // 注意：这里需要返回 Promise
  void addCompressionPlugin()
  return plugins
}
