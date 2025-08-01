import type { Plugin } from 'vite'
import { getPackageSize, __APP_INFO__ } from './utils'

const welcomeMessage = `
🎉 欢迎使用 ${__APP_INFO__.pkg.name}
📦 版本: ${__APP_INFO__.pkg.version}
⚡ 基于 Vue ${__APP_INFO__.pkg.dependencies.vue} + Vite 构建
🕒 构建时间: ${__APP_INFO__.lastBuildTime}
`

export function viteBuildInfo(): Plugin {
  let config: { command: string }
  let startTime: number
  let endTime: number
  let outDir: string

  return {
    name: 'vite:buildInfo',
    configResolved(resolvedConfig) {
      config = resolvedConfig
      outDir = resolvedConfig.build?.outDir ?? 'dist'
    },
    buildStart() {
      console.log(welcomeMessage)
      if (config.command === 'build') {
        startTime = Date.now()
      }
    },
    closeBundle() {
      if (config.command === 'build') {
        endTime = Date.now()
        getPackageSize({
          folder: outDir,
          callback: (size: string) => {
            const duration = ((endTime - startTime) / 1000).toFixed(2)
            console.log(`
🎉 构建完成！
📦 打包大小: ${size}
⏰ 构建耗时: ${duration}秒
📁 输出目录: ${outDir}
            `)
          },
        })
      }
    },
  }
}
