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

// 默认配置
const DEFAULT_CONFIG: RemAdapterConfig = {
  designWidth: 1920, // 设计稿宽度（大屏优先）
  baseFontSize: 16, // 基准字体大小
  minFontSize: 12, // 最小字体大小
  maxFontSize: 24, // 最大字体大小
  mobileFirst: false, // 是否移动端优先
  breakpoints: {
    xs: 375, // 超小屏断点 (UnoCSS: xs)
    sm: 768, // 小屏断点 (UnoCSS: sm)
    md: 1024, // 中屏断点 (UnoCSS: md)
    lg: 1400, // 大屏断点 (UnoCSS: lg)
    xl: 1660, // 超大屏断点 (UnoCSS: xl)
    xls: 1920, // 特大屏断点 (UnoCSS: xls)
  },
}

export class RemAdapter {
  private config: RemAdapterConfig
  private currentFontSize: number = 16
  private resizeTimer: number = 0

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
    const { breakpoints, baseFontSize, minFontSize, maxFontSize } = this.config

    let fontSize: number

    if (deviceType === 'Mobile' || viewportWidth <= breakpoints.xs) {
      // 超小屏：基于 375px 计算
      fontSize = (viewportWidth / 375) * 14
    } else if (viewportWidth <= breakpoints.sm) {
      // 小屏：基于 768px 计算
      fontSize = (viewportWidth / 768) * 15
    } else if (viewportWidth <= breakpoints.md) {
      // 中屏：基于 1024px 计算
      fontSize = (viewportWidth / 1024) * baseFontSize
    } else if (viewportWidth <= breakpoints.lg) {
      // 大屏：基于 1400px 计算
      fontSize = (viewportWidth / 1400) * (baseFontSize + 2)
    } else if (viewportWidth <= breakpoints.xl) {
      // 超大屏：基于 1660px 计算
      fontSize = (viewportWidth / 1660) * (baseFontSize + 3)
    } else {
      // 特大屏：基于 1920px 计算
      fontSize = (viewportWidth / breakpoints.xls) * (baseFontSize + 4)
    }

    // 限制字体大小范围
    return Math.max(minFontSize, Math.min(maxFontSize, fontSize))
  }

  /**
   * 桌面端优先计算策略（推荐用于管理后台）
   */
  private calculateDesktopFirstSize(viewportWidth: number, deviceType: 'PC' | 'Mobile'): number {
    const { breakpoints, baseFontSize, minFontSize, maxFontSize } = this.config

    let fontSize: number

    if (deviceType === 'Mobile' || viewportWidth <= breakpoints.xs) {
      // 超小屏：使用较小的字体保证内容显示
      fontSize = (viewportWidth / 375) * 13
    } else if (viewportWidth <= breakpoints.sm) {
      // 小屏
      fontSize = (viewportWidth / 768) * 14
    } else if (viewportWidth <= breakpoints.md) {
      // 中屏
      fontSize = baseFontSize
    } else if (viewportWidth <= breakpoints.lg) {
      // 大屏
      fontSize = (viewportWidth / 1400) * baseFontSize
    } else if (viewportWidth <= breakpoints.xl) {
      // 超大屏
      fontSize = (viewportWidth / 1660) * baseFontSize
    } else if (viewportWidth <= breakpoints.xls) {
      // 特大屏
      fontSize = (viewportWidth / 1920) * baseFontSize
    } else {
      // 4K及以上超大屏：适当放大
      fontSize = (viewportWidth / this.config.designWidth) * baseFontSize * 1.2
    }

    // 限制字体大小范围
    return Math.max(minFontSize, Math.min(maxFontSize, fontSize))
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

      console.log(
        `🎯 rem 适配已设置: ${fontSize.toFixed(2)}px (设备: ${deviceInfo.type}, 宽度: ${deviceInfo.screen.width}px)`
      )
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
   * 初始化适配器（带防抖）
   */
  init(getDeviceInfo: () => DeviceInfo, debounceTime: number = 200): () => void {
    // 立即设置一次
    this.setRootFontSize(getDeviceInfo())

    // 防抖处理的 resize 事件
    const debouncedResize = () => {
      clearTimeout(this.resizeTimer)
      this.resizeTimer = window.setTimeout(() => {
        this.setRootFontSize(getDeviceInfo())
      }, debounceTime)
    }

    // 监听相关事件
    const events = ['resize', 'orientationchange', 'pageshow']
    events.forEach(event => {
      window.addEventListener(event, debouncedResize)
    })

    // 返回清理函数
    return () => {
      clearTimeout(this.resizeTimer)
      events.forEach(event => {
        window.removeEventListener(event, debouncedResize)
      })
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
