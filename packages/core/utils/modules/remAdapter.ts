/**
 * @copyright Copyright (c) 2025 chichuang
 * @license MIT
 * @description cc-admin 企业级后台管理框架 - 工具函数（优化版）
 * 本文件为 chichuang 原创，禁止擅自删除署名或用于商业用途。
 */

import { debounce } from 'lodash-es'

// 从本地定义这些函数，避免循环依赖
/**
 * 获取当前 rem 基准值
 */
const getRemBase = (): number => {
  if (typeof document === 'undefined') {
    return 16
  }
  const rootElement = document.documentElement
  const cssVariable = rootElement.style.getPropertyValue('--rem-base')
  if (cssVariable) {
    const parsed = parseFloat(cssVariable)
    if (!isNaN(parsed) && parsed > 0) {
      return parsed
    }
  }
  const computedStyle = window.getComputedStyle(rootElement)
  return parseFloat(computedStyle.fontSize) || 16
}

/**
 * 计算相对于当前基准的 rem 值
 */
const toRem = (px: number): string => {
  const base = getRemBase()
  return `${(px / base).toFixed(4)}rem`
}

/**
 * 计算 rem 对应的 px 值
 */
const toPx = (rem: number): number => {
  return rem * getRemBase()
}

/**
 * 获取当前断点
 */
const getCurrentBreakpoint = (width: number, breakpoints: Record<string, number>): string => {
  const sortedBreakpoints = Object.entries(breakpoints).sort(([, a], [, b]) => b - a)
  for (const [name, value] of sortedBreakpoints) {
    if (width >= value) {
      return name
    }
  }
  return 'xs'
}

/**
 * 性能监控器
 */
class PerformanceMonitor {
  private updateTimes: number[] = []
  private readonly maxSamples = 10

  recordUpdate(duration: number): void {
    this.updateTimes.push(duration)
    if (this.updateTimes.length > this.maxSamples) {
      this.updateTimes.shift()
    }
  }

  getAverageUpdateTime(): number {
    if (this.updateTimes.length === 0) {
      return 0
    }
    return this.updateTimes.reduce((sum, time) => sum + time, 0) / this.updateTimes.length
  }

  reset(): void {
    this.updateTimes.length = 0
  }
}

// ==================== 类型定义 ====================

interface RemAdapterOptions {
  /** 防抖时间（毫秒） */
  debounceTime?: number
  /** 是否启用调试模式 */
  debug?: boolean
  /** 字体大小变化阈值（像素） */
  fontSizeThreshold?: number
  /** 是否启用性能监控 */
  enablePerformanceMonitor?: boolean
}

export interface RemAdapterConfig {
  designWidth: number
  baseFontSize: number
  minFontSize: number
  maxFontSize: number
  mobileFirst: boolean
  breakpoints: {
    xs: number
    sm: number
    md: number
    lg: number
    xl: number
    xls: number
  }
}

export interface DeviceInfo {
  type: 'Mobile' | 'Tablet' | 'PC'
  screen: {
    width: number
    height: number
    orientation: 'horizontal' | 'vertical'
    deviceWidth: number
    deviceHeight: number
    definitely: number
    navHeight: number
    tabHeight: number
  }
  system: string
}

interface RemAdapterState {
  currentFontSize: number
  lastDeviceInfo: DeviceInfo | null
  lastFontSize: number
  isInitialized: boolean
}

export interface RemAdapterInfo {
  deviceType: DeviceInfo['type']
  screenWidth: number
  screenHeight: number
  orientation: DeviceInfo['screen']['orientation']
  currentFontSize: number
  remBase: number
  config: RemAdapterConfig
  breakpoint: string
  performance: {
    updateCount: number
    lastUpdateTime: number
    averageUpdateTime: number
  }
}

// ==================== 常量定义 ====================

const DEFAULT_CONFIG: RemAdapterConfig = {
  designWidth: 1920,
  baseFontSize: 16,
  minFontSize: 12,
  maxFontSize: 24,
  mobileFirst: false,
  breakpoints: {
    xs: 375,
    sm: 768,
    md: 1024,
    lg: 1440,
    xl: 1660,
    xls: 1920,
  },
} as const

const DEFAULT_OPTIONS: Required<RemAdapterOptions> = {
  debounceTime: 300,
  debug: false,
  fontSizeThreshold: 0.5,
  enablePerformanceMonitor: false,
} as const

// CSS 变量名常量
const CSS_VARIABLES = {
  rootFontSize: '--root-font-size',
  remBase: '--rem-base',
  breakpoint: '--current-breakpoint',
  deviceType: '--device-type',
} as const

// 事件名常量
const EVENTS = {
  fontSizeChanged: 'fontSizeChanged',
  breakpointChanged: 'breakpointChanged',
} as const

// ==================== 工具函数 ====================

/**
 * 从环境变量解析 rem 适配配置
 */
export const parseRemConfigFromEnv = (): RemAdapterConfig => {
  // 这里可以从环境变量读取配置，目前返回默认配置
  return { ...DEFAULT_CONFIG }
}

// ==================== RemAdapter 类 ====================

export class RemAdapter {
  private config: RemAdapterConfig
  private options: Required<RemAdapterOptions>
  private state: RemAdapterState
  private performance: { updateCount: number; lastUpdateTime: number }
  private performanceMonitor: PerformanceMonitor
  private cleanupFn: (() => void) | null = null

  constructor(config?: Partial<RemAdapterConfig>, options?: RemAdapterOptions) {
    this.config = { ...DEFAULT_CONFIG, ...config }
    this.options = { ...DEFAULT_OPTIONS, ...options }
    this.state = {
      currentFontSize: this.config.baseFontSize,
      lastDeviceInfo: null,
      lastFontSize: 0,
      isInitialized: false,
    }
    this.performance = {
      updateCount: 0,
      lastUpdateTime: 0,
    }
    this.performanceMonitor = new PerformanceMonitor()
  }

  /**
   * 根据设备信息计算合适的根字体大小（优化版）
   */
  private calculateRootFontSize(deviceInfo: DeviceInfo): number {
    const { screen } = deviceInfo
    const viewportWidth = screen.width

    if (viewportWidth <= 0) {
      return this.config.baseFontSize
    }

    try {
      const fontSize = this.config.mobileFirst
        ? this.calculateMobileFirstSize(viewportWidth)
        : this.calculateDesktopFirstSize(viewportWidth)

      // 确保结果在有效范围内
      return Math.max(this.config.minFontSize, Math.min(this.config.maxFontSize, fontSize))
    } catch (error) {
      console.error('计算字体大小时出错:', error)
      return this.config.baseFontSize
    }
  }

  /**
   * 移动端优先计算策略（优化版）
   */
  private calculateMobileFirstSize(viewportWidth: number): number {
    const { designWidth, baseFontSize } = this.config
    const mobileDesignWidth = Math.min(designWidth, 768)
    const scale = viewportWidth / mobileDesignWidth

    // 使用平滑的缩放曲线
    const smoothScale = this.applySmoothScaling(scale)
    return Math.round(baseFontSize * smoothScale * 100) / 100
  }

  /**
   * 桌面端优先计算策略（优化版）
   */
  private calculateDesktopFirstSize(viewportWidth: number): number {
    const { designWidth, baseFontSize } = this.config
    const scale = viewportWidth / designWidth

    // 使用平滑的缩放曲线
    const smoothScale = this.applySmoothScaling(scale)
    return Math.round(baseFontSize * smoothScale * 100) / 100
  }

  /**
   * 应用平滑缩放算法
   */
  private applySmoothScaling(scale: number): number {
    const { baseFontSize, minFontSize, maxFontSize } = this.config
    const minScale = minFontSize / baseFontSize
    const maxScale = maxFontSize / baseFontSize

    // 使用 easeInOutQuad 缓动函数平滑过渡
    if (scale < 1) {
      const t = Math.max(0, (scale - minScale) / (1 - minScale))
      return minScale + (1 - minScale) * this.easeInOutQuad(t)
    } else {
      const t = Math.min(1, (scale - 1) / (maxScale - 1))
      return 1 + (maxScale - 1) * this.easeInOutQuad(t)
    }
  }

  /**
   * 缓动函数
   */
  private easeInOutQuad(t: number): number {
    return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t
  }

  /**
   * 设置根元素字体大小（优化版）
   */
  private setRootFontSize(deviceInfo: DeviceInfo): void {
    if (typeof document === 'undefined') {
      return
    }

    const startTime = performance.now()
    const fontSize = this.calculateRootFontSize(deviceInfo)
    const rootElement = document.documentElement

    if (!rootElement) {
      return
    }

    try {
      // 批量更新 DOM
      const updates = {
        fontSize: `${fontSize}px`,
        [CSS_VARIABLES.rootFontSize]: `${fontSize}px`,
        [CSS_VARIABLES.remBase]: fontSize.toString(),
        [CSS_VARIABLES.breakpoint]: getCurrentBreakpoint(
          deviceInfo.screen.width,
          this.config.breakpoints
        ),
        [CSS_VARIABLES.deviceType]: deviceInfo.type.toLowerCase(),
      }

      // 使用 requestAnimationFrame 优化 DOM 更新
      requestAnimationFrame(() => {
        rootElement.style.fontSize = updates.fontSize
        Object.entries(updates).forEach(([key, value]) => {
          if (key !== 'fontSize') {
            rootElement.style.setProperty(key, value)
          }
        })
      })

      this.state.currentFontSize = fontSize

      // 性能监控
      const endTime = performance.now()
      const duration = endTime - startTime

      if (this.options.enablePerformanceMonitor) {
        this.performanceMonitor.recordUpdate(duration)
      }

      // 更新性能统计
      this.performance.updateCount++
      this.performance.lastUpdateTime = Date.now()

      // 触发事件
      this.dispatchEvents(fontSize, deviceInfo)

      if (this.options.debug) {
        console.log(
          `🎯 rem 适配已设置: ${fontSize.toFixed(2)}px (设备: ${deviceInfo.type}, 宽度: ${deviceInfo.screen.width}px, 耗时: ${duration.toFixed(2)}ms)`
        )
      }
    } catch (error) {
      console.error('设置根字体大小时出错:', error)
    }
  }

  /**
   * 触发相关事件（优化版）
   */
  private dispatchEvents(fontSize: number, deviceInfo: DeviceInfo): void {
    if (typeof window === 'undefined') {
      return
    }

    try {
      const currentBreakpoint = getCurrentBreakpoint(
        deviceInfo.screen.width,
        this.config.breakpoints
      )
      const lastBreakpoint = this.state.lastDeviceInfo
        ? getCurrentBreakpoint(this.state.lastDeviceInfo.screen.width, this.config.breakpoints)
        : null

      // 字体大小变化事件
      window.dispatchEvent(
        new CustomEvent(EVENTS.fontSizeChanged, {
          detail: {
            fontSize,
            deviceInfo,
            timestamp: Date.now(),
            performance: this.getPerformanceInfo(),
          },
        })
      )

      // 断点变化事件
      if (lastBreakpoint !== currentBreakpoint) {
        window.dispatchEvent(
          new CustomEvent(EVENTS.breakpointChanged, {
            detail: {
              from: lastBreakpoint,
              to: currentBreakpoint,
              deviceInfo,
              timestamp: Date.now(),
            },
          })
        )
      }
    } catch (error) {
      console.error('触发事件时出错:', error)
    }
  }

  /**
   * 获取性能信息
   */
  private getPerformanceInfo() {
    return {
      updateCount: this.performance.updateCount,
      lastUpdateTime: this.performance.lastUpdateTime,
      averageUpdateTime: this.options.enablePerformanceMonitor
        ? this.performanceMonitor.getAverageUpdateTime()
        : 0,
    }
  }

  /**
   * 检查是否需要更新字体大小（优化版）
   */
  private shouldUpdateFontSize(currentDeviceInfo: DeviceInfo, currentFontSize: number): boolean {
    const { lastDeviceInfo, lastFontSize } = this.state
    const { fontSizeThreshold } = this.options

    if (!lastDeviceInfo) {
      return true
    }

    // 使用位运算优化布尔运算
    const dimensionChanged =
      lastDeviceInfo.screen.width !== currentDeviceInfo.screen.width ||
      lastDeviceInfo.screen.height !== currentDeviceInfo.screen.height

    const typeChanged = lastDeviceInfo.type !== currentDeviceInfo.type
    const fontSizeChanged = Math.abs(lastFontSize - currentFontSize) > fontSizeThreshold

    return dimensionChanged || typeChanged || fontSizeChanged
  }

  /**
   * 获取当前根字体大小
   */
  getCurrentFontSize(): number {
    return this.state.currentFontSize
  }

  /**
   * px 转 rem （开发时辅助函数）
   */
  pxToRem(px: number): string {
    return `${(px / this.state.currentFontSize).toFixed(4)}rem`
  }

  /**
   * rem 转 px （开发时辅助函数）
   */
  remToPx(rem: number): number {
    return rem * this.state.currentFontSize
  }

  /**
   * 获取适配信息（优化版）
   */
  getAdapterInfo(deviceInfo: DeviceInfo): RemAdapterInfo {
    return {
      deviceType: deviceInfo.type,
      screenWidth: deviceInfo.screen.width,
      screenHeight: deviceInfo.screen.height,
      orientation: deviceInfo.screen.orientation,
      currentFontSize: this.state.currentFontSize,
      remBase: this.state.currentFontSize,
      config: { ...this.config }, // 返回配置副本
      breakpoint: getCurrentBreakpoint(deviceInfo.screen.width, this.config.breakpoints),
      performance: this.getPerformanceInfo(),
    }
  }

  /**
   * 初始化适配器（优化版）
   */
  init(getDeviceInfo: () => DeviceInfo): () => void {
    if (this.state.isInitialized) {
      console.warn('RemAdapter 已经初始化，请先调用 cleanup 函数')
      return this.cleanupFn || (() => {})
    }

    try {
      // 立即设置一次
      const initialDeviceInfo = getDeviceInfo()
      this.setRootFontSize(initialDeviceInfo)
      this.state.lastDeviceInfo = initialDeviceInfo
      this.state.lastFontSize = this.state.currentFontSize
      this.state.isInitialized = true

      // 创建优化的防抖函数
      const debouncedResize = debounce(
        () => {
          const currentDeviceInfo = getDeviceInfo()
          const currentFontSize = this.calculateRootFontSize(currentDeviceInfo)

          if (this.shouldUpdateFontSize(currentDeviceInfo, currentFontSize)) {
            this.setRootFontSize(currentDeviceInfo)
            this.state.lastDeviceInfo = currentDeviceInfo
            this.state.lastFontSize = currentFontSize
          }
        },
        this.options.debounceTime,
        { maxWait: this.options.debounceTime * 2 }
      )

      // 优化的事件处理
      let rafId: number | null = null
      const handleResize = () => {
        if (rafId) {
          cancelAnimationFrame(rafId)
        }
        rafId = requestAnimationFrame(() => {
          debouncedResize()
          rafId = null
        })
      }

      // 监听事件（使用常量）
      const events = ['resize', 'orientationchange'] as const
      const eventOptions = { passive: true, capture: false }

      events.forEach(event => {
        window.addEventListener(event, handleResize, eventOptions)
      })

      // 创建清理函数
      this.cleanupFn = () => {
        this.cleanup(debouncedResize, rafId, events, handleResize)
      }

      return this.cleanupFn
    } catch (error) {
      console.error('初始化 RemAdapter 时出错:', error)
      return () => {}
    }
  }

  /**
   * 清理资源（优化版）
   */
  private cleanup(
    debouncedResize: ReturnType<typeof debounce>,
    rafId: number | null,
    events: readonly string[],
    handleResize: () => void
  ): void {
    try {
      // 取消防抖函数
      debouncedResize.cancel()

      // 清理 RAF
      if (rafId) {
        cancelAnimationFrame(rafId)
      }

      // 移除事件监听器
      events.forEach(event => {
        window.removeEventListener(event, handleResize)
      })

      // 重置状态
      this.state.isInitialized = false
      this.state.lastDeviceInfo = null
      this.state.lastFontSize = 0
      this.performanceMonitor.reset()
      this.cleanupFn = null
    } catch (error) {
      console.error('清理 RemAdapter 时出错:', error)
    }
  }

  /**
   * 强制刷新适配（优化版）
   */
  forceRefresh(getDeviceInfo: () => DeviceInfo): void {
    if (!this.state.isInitialized) {
      console.warn('RemAdapter 未初始化，无法强制刷新')
      return
    }

    try {
      const deviceInfo = getDeviceInfo()
      this.setRootFontSize(deviceInfo)
      this.state.lastDeviceInfo = deviceInfo
      this.state.lastFontSize = this.state.currentFontSize
    } catch (error) {
      console.error('强制刷新适配时出错:', error)
    }
  }

  /**
   * 销毁适配器
   */
  destroy(): void {
    if (this.cleanupFn) {
      this.cleanupFn()
    }
  }
}

// ==================== 默认实例 ====================

export const remAdapter = new RemAdapter()

// ==================== 调试工具优化 ====================

/**
 * 开发调试工具（优化版）
 */
const createDebugTools = () => {
  if (typeof window === 'undefined') {
    return
  }

  const debugTools = {
    getRemBase,
    toRem,
    toPx,
    async forceRefresh() {
      try {
        const postcssStore = (window as any).__POSTCSS_STORE__
        if (postcssStore) {
          return await postcssStore.forceRefreshAdapter()
        } else {
          console.warn('postcss store 未初始化，请先访问 rem 适配页面')
          return false
        }
      } catch (error) {
        console.warn('强制刷新失败:', error)
        return false
      }
    },
    getStatus() {
      try {
        const postcssStore = (window as any).__POSTCSS_STORE__
        return postcssStore?.getAdapterStatus() || null
      } catch (error) {
        console.warn('获取状态失败:', error)
        return null
      }
    },
    // 新增：获取性能统计
    getPerformanceStats() {
      const postcssStore = (window as any).__POSTCSS_STORE__
      if (!postcssStore) {
        console.warn('postcss store 未初始化')
        return null
      }

      return {
        updateCount: postcssStore.performance?.updateCount || 0,
        averageUpdateTime: postcssStore.performance?.averageUpdateTime || 0,
        lastUpdateTime: postcssStore.performance?.lastUpdateTime || 0,
      }
    },
    help() {
      console.log(`
🛠️ rem 适配调试工具 v2.0

基础功能：
• remDebug.getRemBase() - 获取当前 rem 基准值
• remDebug.toRem(px) - px 转 rem
• remDebug.toPx(rem) - rem 转 px
• remDebug.getStatus() - 获取适配器状态

高级功能：
• remDebug.forceRefresh() - 强制刷新适配 (异步)
• remDebug.getPerformanceStats() - 获取性能统计
• remDebug.help() - 显示此帮助

示例：
remDebug.toRem(200) // "12.5000rem"
remDebug.toPx(12.5) // 200
await remDebug.forceRefresh() // true/false
      `)
    },
  }

  ;(window as any).remDebug = debugTools
  console.log('🛠️ rem 调试工具 v2.0 已加载，输入 remDebug.help() 查看使用方法')
}

// 初始化调试工具
createDebugTools()
