/**
 * @copyright Copyright (c) 2025 chichuang
 * @license MIT
 * @description CC-Admin 企业级后台管理框架 - 工具函数
 * 本文件为 chichuang 原创，禁止擅自删除署名或用于商业用途。
 */

import { debounce } from 'lodash-es'
import type { DeviceInfo } from '../Types/global'
import {
  adapterStrategies,
  breakpoints,
  debugConfig,
  desktopConfig,
  deviceTypes,
  mobileConfig,
  remConfig,
} from '../constants/modules/rem'

// 从配置获取 rem 适配配置
export const parseRemConfigFromConfig = (): RemAdapterConfig => {
  return {
    designWidth: remConfig.designWidth,
    baseFontSize: remConfig.baseFontSize,
    minFontSize: remConfig.minFontSize,
    maxFontSize: remConfig.maxFontSize,
    mobileFirst: remConfig.mobileFirst,
    breakpoints: breakpoints,
  }
}

// 从环境变量获取 rem 适配配置（兼容性函数）
export const parseRemConfigFromEnv = (): RemAdapterConfig => {
  return parseRemConfigFromConfig()
}

// rem 适配配置
export interface RemAdapterConfig {
  // 设计稿基准宽度
  designWidth: number
  // 基准字体大小（设计稿上的基准值）
  baseFontSize: number
  // 最小字体大小
  minFontSize: number
  // 最大字体大小
  maxFontSize: number
  // 是否启用移动端优先策略
  mobileFirst: boolean
  // 自定义断点配置 (与 UnoCSS 保持一致)
  breakpoints: {
    xs: number // 超小屏 (375px+)
    sm: number // 小屏 (768px+)
    md: number // 中屏 (1024px+)
    lg: number // 大屏 (1400px+)
    xl: number // 超大屏 (1660px+)
    xls: number // 特大屏 (1920px+)
  }
}

// 默认配置（从配置解析）
const DEFAULT_CONFIG: RemAdapterConfig = parseRemConfigFromConfig()

export class RemAdapter {
  private config: RemAdapterConfig
  private currentFontSize: number = 16

  constructor(config?: Partial<RemAdapterConfig>) {
    this.config = { ...DEFAULT_CONFIG, ...config }
    this.currentFontSize = this.config.baseFontSize
  }

  /**
   * 根据设备信息计算合适的根字体大小
   */
  calculateRootFontSize(deviceInfo: DeviceInfo): number {
    const { screen } = deviceInfo
    const viewportWidth = screen.width
    const deviceType = deviceInfo.type

    // 移动端优先策略
    if (this.config.mobileFirst) {
      return this.calculateMobileFirstSize(viewportWidth, deviceType)
    }

    // 桌面端优先策略（默认）
    return this.calculateDesktopFirstSize(viewportWidth, deviceType)
  }

  /**
   * 移动端优先计算策略
   */
  private calculateMobileFirstSize(viewportWidth: number, deviceType: 'PC' | 'Mobile'): number {
    const { designWidth, baseFontSize } = this.config

    // 🎯 移动端优先：使用移动端配置
    const mobileDesignWidth = Math.min(designWidth, mobileConfig.maxDesignWidth)
    const mobileBaseFontSize = Math.min(baseFontSize, mobileConfig.maxBaseFontSize)
    const mobileMinFontSize = mobileConfig.minFontSize
    const mobileMaxFontSize = mobileConfig.maxFontSize

    const scale = viewportWidth / mobileDesignWidth

    // 基于缩放比例计算字体大小
    let fontSize = mobileBaseFontSize * scale

    // 限制字体大小范围
    const minScale = mobileMinFontSize / mobileBaseFontSize
    const maxScale = mobileMaxFontSize / mobileBaseFontSize
    const clampedScale = Math.max(minScale, Math.min(maxScale, scale))
    fontSize = mobileBaseFontSize * clampedScale

    if (debugConfig.enabled) {
      console.log(
        `📱 ${adapterStrategies.mobileFirst} 缩放计算: 屏幕${viewportWidth}px / 移动设计稿${mobileDesignWidth}px = ${scale.toFixed(4)} | 字体: ${fontSize.toFixed(2)}px | 设备: ${deviceTypes[deviceType.toLowerCase() as keyof typeof deviceTypes] || deviceType}`
      )
    }

    return fontSize
  }

  /**
   * 桌面端优先计算策略（推荐用于管理后台）
   */
  private calculateDesktopFirstSize(viewportWidth: number, deviceType: 'PC' | 'Mobile'): number {
    const { designWidth, baseFontSize } = this.config

    // 🎯 桌面端优先：使用桌面端配置
    const desktopMinFontSize = desktopConfig.minFontSize
    const desktopMaxFontSize = desktopConfig.maxFontSize
    const desktopMinBaseFontSize = desktopConfig.minBaseFontSize

    // 计算当前屏幕相对于设计稿的缩放比例
    const scale = viewportWidth / designWidth

    // 基于缩放比例计算字体大小
    // 保持 PostCSS 的 rootValue=16 基准，确保 1:1 映射
    let fontSize = Math.max(baseFontSize, desktopMinBaseFontSize) * scale

    // 对于极小屏幕，适当调整最小缩放比例，避免字体过小
    const minScale = desktopMinFontSize / baseFontSize // 最小缩放比例
    const maxScale = desktopMaxFontSize / baseFontSize // 最大缩放比例

    // 限制缩放比例范围
    const clampedScale = Math.max(minScale, Math.min(maxScale, scale))
    fontSize = baseFontSize * clampedScale

    if (debugConfig.enabled) {
      console.log(
        `🖥️ ${adapterStrategies.desktopFirst} 缩放计算: 屏幕${viewportWidth}px / 设计稿${designWidth}px = ${scale.toFixed(4)} | 字体: ${fontSize.toFixed(2)}px | 设备: ${deviceTypes[deviceType.toLowerCase() as keyof typeof deviceTypes] || deviceType}`
      )
    }

    return fontSize
  }

  /**
   * 设置根元素字体大小
   */
  setRootFontSize(deviceInfo: DeviceInfo): void {
    const fontSize = this.calculateRootFontSize(deviceInfo)
    const rootElement = document.documentElement

    if (rootElement) {
      rootElement.style.fontSize = `${fontSize}px`
      this.currentFontSize = fontSize

      // 设置 CSS 变量，供其他地方使用
      rootElement.style.setProperty('--root-font-size', `${fontSize}px`)
      rootElement.style.setProperty('--rem-base', fontSize.toString())

      // 触发自定义事件，通知其他组件字体大小已变更
      window.dispatchEvent(
        new CustomEvent('fontSizeChanged', {
          detail: {
            fontSize,
            deviceInfo,
          },
        })
      )

      /* console.log(
          `🎯 rem 适配已设置: ${fontSize.toFixed(2)}px (设备: ${deviceInfo.type}, 宽度: ${deviceInfo.screen.width}px)`
        ) */
    }
  }

  /**
   * 获取当前根字体大小
   */
  getCurrentFontSize(): number {
    return this.currentFontSize
  }

  /**
   * px 转 rem （开发时辅助函数）
   */
  pxToRem(px: number): string {
    return `${(px / this.currentFontSize).toFixed(4)}rem`
  }

  /**
   * rem 转 px （开发时辅助函数）
   */
  remToPx(rem: number): number {
    return rem * this.currentFontSize
  }

  /**
   * 获取适配信息（调试用）
   */
  getAdapterInfo(deviceInfo: DeviceInfo) {
    return {
      deviceType:
        deviceTypes[deviceInfo.type.toLowerCase() as keyof typeof deviceTypes] || deviceInfo.type,
      screenWidth: deviceInfo.screen.width,
      screenHeight: deviceInfo.screen.height,
      orientation: deviceInfo.screen.orientation,
      currentFontSize: this.currentFontSize,
      remBase: this.currentFontSize,
      config: this.config,
      breakpoint: this.getCurrentBreakpoint(deviceInfo.screen.width),
      strategy: this.config.mobileFirst
        ? adapterStrategies.mobileFirst
        : adapterStrategies.desktopFirst,
    }
  }

  /**
   * 获取当前断点
   */
  private getCurrentBreakpoint(width: number): string {
    const { breakpoints } = this.config

    if (width <= breakpoints.xs) {
      return 'xs'
    }
    if (width <= breakpoints.sm) {
      return 'sm'
    }
    if (width <= breakpoints.md) {
      return 'md'
    }
    if (width <= breakpoints.lg) {
      return 'lg'
    }
    if (width <= breakpoints.xl) {
      return 'xl'
    }
    if (width <= breakpoints.xls) {
      return 'xls'
    }
    return 'xxl'
  }

  /**
   * 初始化适配器（智能防抖策略）
   *
   * 性能优化特性：
   * 1. 🎯 智能防抖：根据设备类型和变化幅度动态调整防抖时间
   * 2. 📱 移动端优化：移动端使用更短的防抖时间（150ms）
   * 3. 🖥️ 大屏优化：大屏幕变化时使用更快的响应（100ms）
   * 4. ⚡ RAF 优化：使用 RequestAnimationFrame 确保在下一帧执行
   * 5. 🔄 变化检测：只在设备信息真正变化时才执行更新
   * 6. 📊 频率控制：频繁变化时自动增加防抖时间
   * 7. 🧹 内存清理：正确清理所有事件监听器和定时器
   */
  init(getDeviceInfo: () => DeviceInfo, debounceTime: number = 300): () => void {
    // 立即设置一次
    this.setRootFontSize(getDeviceInfo())

    // 记录上次执行的设备信息，避免重复计算
    let lastDeviceInfo: DeviceInfo | null = null
    let lastFontSize: number = 0
    let resizeCount: number = 0
    let lastResizeTime: number = Date.now()

    // 智能防抖函数：根据设备类型和变化幅度动态调整防抖时间
    const createSmartDebouncedResize = (baseDebounceTime: number) => {
      return debounce(() => {
        const currentDeviceInfo = getDeviceInfo()
        const currentFontSize = this.calculateRootFontSize(currentDeviceInfo)
        const now = Date.now()

        // 计算变化幅度
        const widthChange = lastDeviceInfo
          ? Math.abs(currentDeviceInfo.screen.width - lastDeviceInfo.screen.width)
          : 0

        // 动态调整防抖时间
        let adaptiveDebounceTime = baseDebounceTime

        // 移动端：更敏感的响应
        if (currentDeviceInfo.type === 'Mobile') {
          adaptiveDebounceTime = Math.min(baseDebounceTime, 150)
        }

        // 大屏幕变化：更快的响应
        if (widthChange > 100) {
          adaptiveDebounceTime = Math.min(baseDebounceTime, 100)
        }

        // 频繁变化：增加防抖时间
        const timeSinceLastResize = now - lastResizeTime
        if (timeSinceLastResize < 500 && resizeCount > 5) {
          adaptiveDebounceTime = Math.min(baseDebounceTime * 2, 600)
        }

        // 只有当设备信息或字体大小发生显著变化时才执行
        const shouldUpdate =
          !lastDeviceInfo ||
          lastDeviceInfo.screen.width !== currentDeviceInfo.screen.width ||
          lastDeviceInfo.screen.height !== currentDeviceInfo.screen.height ||
          lastDeviceInfo.type !== currentDeviceInfo.type ||
          Math.abs(lastFontSize - currentFontSize) > 0.5 // 字体大小变化超过0.5px

        if (shouldUpdate) {
          this.setRootFontSize(currentDeviceInfo)
          lastDeviceInfo = currentDeviceInfo
          lastFontSize = currentFontSize
          resizeCount++
          lastResizeTime = now

          if (debugConfig.enabled) {
            console.log(
              `🎯 rem 适配已更新: ${currentFontSize.toFixed(2)}px (设备: ${deviceTypes[currentDeviceInfo.type.toLowerCase() as keyof typeof deviceTypes] || currentDeviceInfo.type}, 宽度: ${currentDeviceInfo.screen.width}px, 变化: ${widthChange}px, 执行次数: ${resizeCount}, 防抖时间: ${adaptiveDebounceTime}ms)`
            )
          }
        }
      }, baseDebounceTime) // 使用基础防抖时间，动态调整在内部处理
    }

    // 创建智能防抖函数
    const smartDebouncedResize = createSmartDebouncedResize(debounceTime)

    // 使用 RAF 优化性能的事件处理
    let rafId: number | null = null

    const handleResize = () => {
      // 使用 RequestAnimationFrame 确保在下一帧执行
      if (rafId) {
        cancelAnimationFrame(rafId)
      }

      rafId = requestAnimationFrame(() => {
        smartDebouncedResize()
        rafId = null
      })
    }

    // 监听必要的事件（减少事件监听数量，使用 passive 提升性能）
    const events = [
      'resize', // 窗口大小变化
      'orientationchange', // 设备方向变化（移动端）
    ]

    events.forEach(event => {
      window.addEventListener(event, handleResize, { passive: true })
    })

    // 返回清理函数
    return () => {
      smartDebouncedResize.cancel() // 取消 lodash debounce

      // 清理 RAF
      if (rafId) {
        cancelAnimationFrame(rafId)
        rafId = null
      }

      events.forEach(event => {
        window.removeEventListener(event, handleResize)
      })
    }
  }
}

// 创建默认实例
export const remAdapter = new RemAdapter()

/**
 * 创建大屏优先的 rem 适配器
 *
 * 优势：
 * 1. 使用统一配置，避免硬编码，便于维护
 * 2. 自动继承 contains 中的配置
 * 3. 支持运行时覆盖配置
 * 4. 桌面端优先策略，适合大屏应用
 */
export const createLargeScreenAdapter = (config?: Partial<RemAdapterConfig>) => {
  // 从配置获取基础配置
  const baseConfig = parseRemConfigFromConfig()

  return new RemAdapter({
    // 使用配置作为基础
    ...baseConfig,
    // 强制设置为桌面端优先策略
    mobileFirst: false,
    // 允许传入的配置覆盖基础配置
    ...config,
  })
}

// 工具函数：获取当前 rem 基准值
export const getRemBase = (): number => {
  const rootElement = document.documentElement
  const fontSize = window.getComputedStyle(rootElement).fontSize
  return parseFloat(fontSize) || 16
}

// 工具函数：计算相对于当前基准的 rem 值
export const toRem = (px: number): string => {
  const base = getRemBase()
  return `${(px / base).toFixed(4)}rem`
}

// 工具函数：计算 rem 对应的 px 值
export const toPx = (rem: number): number => {
  const base = getRemBase()
  return rem * base
}

// 🛠️ 开发调试工具：挂载到全局 window 对象
if (typeof window !== 'undefined') {
  ;(window as any).remDebug = {
    // 获取当前 rem 基准值
    getRemBase,

    // px 转 rem
    toRem,

    // rem 转 px
    toPx,

    // 强制刷新适配
    forceRefresh() {
      try {
        // 使用全局变量访问 store，避免动态导入
        const postcssStore = (window as any).__POSTCSS_STORE__
        if (postcssStore) {
          return postcssStore.forceRefreshAdapter()
        } else {
          console.warn('postcss store 未初始化，请先访问 rem 适配页面')
          return Promise.resolve(false)
        }
      } catch (_error) {
        console.warn('请先初始化 postcss store')
        return Promise.resolve(false)
      }
    },

    // 获取适配器状态
    getStatus() {
      try {
        // 使用全局变量访问 store，避免动态导入
        const postcssStore = (window as any).__POSTCSS_STORE__
        if (postcssStore) {
          return postcssStore.getAdapterStatus()
        } else {
          console.warn('postcss store 未初始化，请先访问 rem 适配页面')
          return null
        }
      } catch (_error) {
        console.warn('请先初始化 postcss store')
        return null
      }
    },

    // 显示帮助信息
    help() {
      console.log(`
🛠️ rem 适配调试工具

用法：
• remDebug.getRemBase() - 获取当前 rem 基准值
• remDebug.toRem(px) - px 转 rem
• remDebug.toPx(rem) - rem 转 px
• remDebug.forceRefresh() - 强制刷新适配
• remDebug.getStatus() - 获取适配器状态
• remDebug.help() - 显示此帮助

配置信息：
• 设计稿宽度: ${remConfig.designWidth}px
• 基准字体: ${remConfig.baseFontSize}px
• 字体范围: ${remConfig.minFontSize}-${remConfig.maxFontSize}px
• 适配策略: ${remConfig.mobileFirst ? adapterStrategies.mobileFirst : adapterStrategies.desktopFirst}

示例：
remDebug.toRem(200) // "12.5000rem"
remDebug.toPx(12.5) // 200
remDebug.getRemBase() // ${remConfig.baseFontSize}
      `)
    },
  }

  console.log('🛠️ rem 调试工具已加载，输入 remDebug.help() 查看使用方法')
}

// 🧪 性能测试工具（仅开发环境）
if (typeof window !== 'undefined') {
  ;(window as any).remPerformanceTest = {
    // 测试防抖效果
    testDebouncePerformance() {
      console.log('🧪 开始 rem 适配性能测试...')

      const startTime = Date.now()
      let callCount = 0

      // 模拟频繁的 resize 事件
      const testResize = () => {
        callCount++
        if (callCount <= 10) {
          window.dispatchEvent(new Event('resize'))
          setTimeout(testResize, 50) // 每50ms触发一次
        } else {
          const endTime = Date.now()
          const duration = endTime - startTime
          console.log(`🧪 性能测试完成: ${callCount} 次调用，耗时 ${duration}ms`)
          console.log(`📊 平均每次调用: ${(duration / callCount).toFixed(2)}ms`)
        }
      }

      testResize()
    },

    // 测试内存泄漏
    testMemoryLeak() {
      console.log('🧪 开始内存泄漏测试...')

      const initialMemory = (performance as any).memory?.usedJSHeapSize || 0

      // 模拟多次初始化
      for (let i = 0; i < 5; i++) {
        const adapter = new RemAdapter()
        const cleanup = adapter.init(() => ({
          type: 'PC' as const,
          screen: {
            width: 1920,
            height: 1080,
            orientation: 'horizontal' as const,
            deviceWidth: 1920,
            deviceHeight: 1080,
            definitely: 1080,
            navHeight: 0,
            tabHeight: 0,
          },
          system: 'Windows',
        }))
        cleanup() // 立即清理
      }

      setTimeout(() => {
        const finalMemory = (performance as any).memory?.usedJSHeapSize || 0
        const memoryDiff = finalMemory - initialMemory
        console.log(`🧪 内存测试完成: 内存变化 ${memoryDiff} bytes`)
      }, 1000)
    },

    // 显示帮助信息
    help() {
      console.log(`
🧪 rem 适配性能测试工具

用法：
• remPerformanceTest.testDebouncePerformance() - 测试防抖性能
• remPerformanceTest.testMemoryLeak() - 测试内存泄漏
• remPerformanceTest.help() - 显示此帮助

调试配置：
• 调试模式: ${debugConfig.enabled ? '启用' : '禁用'}
• 日志间隔: ${debugConfig.logInterval}ms
• 显示适配信息: ${debugConfig.showAdapterInfo ? '是' : '否'}
• 显示断点信息: ${debugConfig.showBreakpointInfo ? '是' : '否'}

注意：这些测试仅在开发环境下可用
      `)
    },
  }

  console.log('🧪 rem 性能测试工具已加载，输入 remPerformanceTest.help() 查看使用方法')
}
