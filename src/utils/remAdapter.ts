const isDebug = import.meta.env.VITE_DEBUG === 'true'
/**
 * rem 适配系统
 *
 * 特点：
 * 1. 支持大屏、移动端、不同屏幕宽度适配
 * 2. 结合项目现有的设备信息系统
 * 3. 配合 postcss-pxtorem 和 UnoCSS 使用
 * 4. 提供多种适配策略
 */

import type { DeviceInfo } from '@/Types/global'
import { debounce } from 'lodash-es'

// 从环境变量解析 rem 适配配置
export const parseRemConfigFromEnv = (): RemAdapterConfig => {
  try {
    // 解析断点配置（JSON 格式）
    const breakpointsStr =
      import.meta.env.VITE_REM_BREAKPOINTS ||
      '{"xs":375,"sm":768,"md":1024,"lg":1400,"xl":1660,"xls":1920}'
    const breakpoints = JSON.parse(breakpointsStr)

    return {
      designWidth: Number(import.meta.env.VITE_REM_DESIGN_WIDTH) || 1920,
      baseFontSize: Number(import.meta.env.VITE_REM_BASE_FONT_SIZE) || 16,
      minFontSize: Number(import.meta.env.VITE_REM_MIN_FONT_SIZE) || 12,
      maxFontSize: Number(import.meta.env.VITE_REM_MAX_FONT_SIZE) || 24,
      mobileFirst: import.meta.env.VITE_REM_MOBILE_FIRST === 'true',
      breakpoints,
    }
  } catch (error) {
    if (isDebug) {
      console.warn('解析环境变量中的 rem 配置失败，使用默认配置:', error)
    }
    // fallback 到硬编码配置
    return {
      designWidth: 1800,
      baseFontSize: 16,
      minFontSize: 12,
      maxFontSize: 24,
      mobileFirst: false,
      breakpoints: {
        xs: 375,
        sm: 768,
        md: 1024,
        lg: 1400,
        xl: 1660,
        xls: 1920,
      },
    }
  }
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

// 默认配置（从环境变量解析）
const DEFAULT_CONFIG: RemAdapterConfig = parseRemConfigFromEnv()

if (isDebug) {
  console.log('🎯 rem 适配配置已从环境变量加载:', DEFAULT_CONFIG)
}

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
  private calculateMobileFirstSize(viewportWidth: number, _deviceType: 'PC' | 'Mobile'): number {
    const { designWidth, baseFontSize, minFontSize, maxFontSize } = this.config

    // 🎯 移动端优先：也使用比例缩放，但可以设置不同的基准
    // 对于移动端优先，可以考虑以较小的设计稿宽度为基准
    const mobileDesignWidth = Math.min(designWidth, 768) // 取设计稿宽度和768px的较小值
    const scale = viewportWidth / mobileDesignWidth

    // 基于缩放比例计算字体大小
    let fontSize = baseFontSize * scale

    // 限制字体大小范围
    const minScale = minFontSize / baseFontSize
    const maxScale = maxFontSize / baseFontSize
    const clampedScale = Math.max(minScale, Math.min(maxScale, scale))
    fontSize = baseFontSize * clampedScale

    if (isDebug) {
      console.log(
        `🎯 移动端缩放计算: 屏幕${viewportWidth}px / 移动设计稿${mobileDesignWidth}px = ${scale.toFixed(4)} | 字体: ${fontSize.toFixed(2)}px`
      )
    }

    return fontSize
  }

  /**
   * 桌面端优先计算策略（推荐用于管理后台）
   */
  private calculateDesktopFirstSize(viewportWidth: number, _deviceType: 'PC' | 'Mobile'): number {
    const { designWidth, baseFontSize, minFontSize, maxFontSize } = this.config

    // 🎯 核心修复：按照设计稿宽度进行比例缩放
    // 计算当前屏幕相对于设计稿的缩放比例
    const scale = viewportWidth / designWidth

    // 基于缩放比例计算字体大小
    // 保持 PostCSS 的 rootValue=16 基准，确保 1:1 映射
    let fontSize = baseFontSize * scale

    // 对于极小屏幕，适当调整最小缩放比例，避免字体过小
    const minScale = minFontSize / baseFontSize // 最小缩放比例
    const maxScale = maxFontSize / baseFontSize // 最大缩放比例

    // 限制缩放比例范围
    const clampedScale = Math.max(minScale, Math.min(maxScale, scale))
    fontSize = baseFontSize * clampedScale

    if (isDebug) {
      console.log(
        `🎯 rem 缩放计算: 屏幕${viewportWidth}px / 设计稿${designWidth}px = ${scale.toFixed(4)} | 字体: ${fontSize.toFixed(2)}px`
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

      if (isDebug) {
        console.log(
          `🎯 rem 适配已设置: ${fontSize.toFixed(2)}px (设备: ${deviceInfo.type}, 宽度: ${deviceInfo.screen.width}px)`
        )
      }
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
      deviceType: deviceInfo.type,
      screenWidth: deviceInfo.screen.width,
      screenHeight: deviceInfo.screen.height,
      orientation: deviceInfo.screen.orientation,
      currentFontSize: this.currentFontSize,
      remBase: this.currentFontSize,
      config: this.config,
      breakpoint: this.getCurrentBreakpoint(deviceInfo.screen.width),
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
   * 初始化适配器（节流 + 防抖双重保障）
   */
  init(getDeviceInfo: () => DeviceInfo, debounceTime: number = 300): () => void {
    // 立即设置一次
    this.setRootFontSize(getDeviceInfo())

    let throttleTimer: number = 0
    let isThrottled = false

    // 节流处理：确保拖拽过程中实时响应 (每100ms最多执行一次)
    const throttledResize = () => {
      if (!isThrottled) {
        this.setRootFontSize(getDeviceInfo())
        isThrottled = true
        throttleTimer = window.setTimeout(() => {
          isThrottled = false
        }, 100)
      }
    }

    // 使用 lodash 防抖：确保停止拖拽后最终执行一次
    const debouncedResize = debounce(() => {
      this.setRootFontSize(getDeviceInfo())
      if (isDebug) {
        console.log('🎯 防抖最终更新完成 (300ms)')
      }
    }, debounceTime)

    // 组合处理：节流 + 防抖
    const handleResize = () => {
      throttledResize() // 立即节流响应
      debouncedResize() // 延迟防抖确保最终更新
    }

    // 监听更全面的事件
    const events = [
      'resize', // 窗口大小变化
      'orientationchange', // 设备方向变化
      'pageshow', // 页面显示
      'visibilitychange', // 页面可见性变化
      'focus', // 窗口获得焦点
    ]

    events.forEach(event => {
      if (event === 'visibilitychange') {
        document.addEventListener(event, handleResize)
      } else {
        window.addEventListener(event, handleResize)
      }
    })

    if (isDebug) {
      console.log('🎯 rem 适配器事件监听已启动 (节流+防抖300ms)')
    }

    // 返回清理函数
    return () => {
      clearTimeout(throttleTimer)
      debouncedResize.cancel() // 取消 lodash debounce
      events.forEach(event => {
        if (event === 'visibilitychange') {
          document.removeEventListener(event, handleResize)
        } else {
          window.removeEventListener(event, handleResize)
        }
      })
      if (isDebug) {
        console.log('🎯 rem 适配器事件监听已清理')
      }
    }
  }
}

// 创建默认实例
export const remAdapter = new RemAdapter()

// 预设配置
export const createMobileFirstAdapter = (config?: Partial<RemAdapterConfig>) => {
  return new RemAdapter({
    ...config,
    mobileFirst: true,
    designWidth: 375,
    baseFontSize: 14,
    breakpoints: {
      xs: 375,
      sm: 768,
      md: 1024,
      lg: 1440,
      xl: 1660,
      xls: 1920,
      ...config?.breakpoints,
    },
  })
}

export const createLargeScreenAdapter = (config?: Partial<RemAdapterConfig>) => {
  return new RemAdapter({
    ...config,
    mobileFirst: false,
    designWidth: 1920,
    baseFontSize: 16,
    maxFontSize: 28,
    breakpoints: {
      xs: 375,
      sm: 768,
      md: 1024,
      lg: 1440,
      xl: 1660,
      xls: 1920,
      ...config?.breakpoints,
    },
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

示例：
remDebug.toRem(200) // "12.5000rem"
remDebug.toPx(12.5) // 200
remDebug.getRemBase() // 16
      `)
    },
  }

  if (isDebug) {
    console.log('🛠️ rem 调试工具已加载，输入 remDebug.help() 查看使用方法')
  }
}
