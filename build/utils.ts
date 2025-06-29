// import dayjs from 'dayjs'
import { readdir, stat } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { dependencies, devDependencies, engines, name, version } from '../package.json'

/** 启动 node 进程时所在工作目录的绝对路径 */
export const root: string = process.cwd()

/**
 * @description 根据可选的路径片段生成一个新的绝对路径
 * @param dir 路径片段，默认当前目录
 * @param metaUrl 模块的完整 url
 */
export const pathResolve = (dir = '.', metaUrl = import.meta.url) => {
  const currentFileDir = dirname(fileURLToPath(metaUrl))
  return resolve(currentFileDir, dir)
}

/** 设置别名 */
export const alias: Record<string, string> = {
  '@': pathResolve('../src'),
  '@build': pathResolve('../build'),
  '@types': pathResolve('../types'),
  '@assets': pathResolve('../src/assets'),
  '@components': pathResolve('../src/components'),
  '@views': pathResolve('../src/views'),
  '@utils': pathResolve('../src/utils'),
  '@stores': pathResolve('../src/stores'),
  '@router': pathResolve('../src/router'),
  '@api': pathResolve('../src/api'),
  '@hooks': pathResolve('../src/hooks'),
  '@common': pathResolve('../src/common'),
  '@test': pathResolve('../src/views/test'),
}

/** 应用信息 */
export const __APP_INFO__ = {
  pkg: { name, version, engines, dependencies, devDependencies },
  lastBuildTime: new Date().toLocaleString('zh-CN'),
}

/** 环境变量类型 */
export interface ViteEnv {
  VITE_PORT: number
  VITE_PUBLIC_PATH: string
  VITE_CDN: boolean
  VITE_COMPRESSION: 'none' | 'gzip' | 'brotli' | 'both'
  VITE_BUILD_SOURCEMAP: boolean
  VITE_BUILD_ANALYZE: boolean
  VITE_LEGACY: boolean
  VITE_API_BASE_URL: string
  VITE_APP_TITLE: string
}

/** 处理环境变量 */
export const wrapperEnv = (envConf: Record<string, unknown>): ViteEnv => {
  const ret: ViteEnv = {
    VITE_PORT: 5173,
    VITE_PUBLIC_PATH: '',
    VITE_CDN: false,
    VITE_COMPRESSION: 'none',
    VITE_BUILD_SOURCEMAP: false,
    VITE_BUILD_ANALYZE: false,
    VITE_LEGACY: false,
    VITE_API_BASE_URL: 'http://localhost:3003',
    VITE_APP_TITLE: 'Ant Design UI',
  }

  for (const envName of Object.keys(envConf)) {
    const envValue = String(envConf[envName])
    let realName: string | number | boolean = envValue.replace(/\\n/g, '\n')
    realName = realName === 'true' ? true : realName === 'false' ? false : realName

    if (envName === 'VITE_PORT') {
      realName = Number(realName)
    }

    if (envName in ret) {
      ;(ret as unknown as Record<string, string | number | boolean>)[envName] = realName
    }

    if (typeof realName === 'string') {
      process.env[envName] = realName
    } else if (typeof realName === 'object') {
      process.env[envName] = JSON.stringify(realName)
    }
  }

  return ret
}

/** 获取包大小 */
export const getPackageSize = (options: {
  folder?: string
  callback: (size: string) => void
  format?: boolean
}) => {
  const { folder = 'dist', callback, format = true } = options
  const fileListTotal: number[] = []

  const formatBytes = (bytes: number, decimals = 2) => {
    if (bytes === 0) {
      return '0 Bytes'
    }
    const k = 1024
    const dm = decimals < 0 ? 0 : decimals
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
  }

  const sum = (arr: number[]) => arr.reduce((prev, curr) => prev + curr, 0)

  readdir(folder, (err, files: string[]) => {
    if (err) {
      throw err
    }
    let count = 0
    const checkEnd = () => {
      ++count
      if (count === files.length) {
        callback(format ? formatBytes(sum(fileListTotal)) : String(sum(fileListTotal)))
      }
    }

    files.forEach((item: string) => {
      stat(`${folder}/${item}`, (err, stats) => {
        if (err) {
          throw err
        }
        if (stats.isFile()) {
          fileListTotal.push(stats.size)
          checkEnd()
        } else if (stats.isDirectory()) {
          getPackageSize({
            folder: `${folder}/${item}/`,
            callback: checkEnd,
          })
        }
      })
    })

    if (files.length === 0) {
      callback('0 Bytes')
    }
  })
}
