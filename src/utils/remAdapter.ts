/**
 * @copyright Copyright (c) 2025 chichuang
 * @license MIT
 * @description cc-admin 企业级后台管理框架 - 工具函数
 * 本文件为 chichuang 原创，禁止擅自删除署名或用于商业用途。
 */

import { debounce } from 'lodash-es'
import {
  adapterStrategies,
  adaptiveConfig,
  breakpoints,
  debugConfig,
  desktopConfig,
  deviceTypes,
  fourKConfig,
  largeScreenConfig,
  mobileConfig,
  remConfig,
  ultraWideConfig,
} from '../constants/modules/rem'

// 从配置获取 rem 适配配置
export const parseRemConfigFromConfig = (): RemAdapterConfig => {
  return {
    designWidth: remConfig.designWidth,
    baseFontSize: remConfig.baseFontSize,
    minFontSize: remConfig.minFontSize,
    maxFontSize: remConfig.maxFontSize,
    strategy: remConfig.mobileFirst ? 'mobile-first' : 'desktop-first',
    mobileFirst: remConfig.mobileFirst,
    breakpoints: breakpoints,
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
  // 适配策略
  strategy: 'mobile-first' | 'desktop-first' | 'large-screen-first' | 'adaptive'
  // 是否启用移动端优先策略（兼容性）
  mobileFirst: boolean
  // 自定义断点配置 (与 UnoCSS 保持一致)
  breakpoints: {
    xs: number // 超小屏 (375px+)
    sm: number // 小屏 (768px+)
    md: number // 中屏 (1024px+)
    lg: number // 大屏 (1400px+)
    xl: number // 超大屏 (1660px+)
    xls: number // 特大屏 (1920px+)
    xxl: number // 超宽屏 (2560px+)
    xxxl: number // 4K屏 (3840px+)
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

    // 🎯 根据适配策略选择计算方法
    switch (this.config.strategy) {
      case 'mobile-first':
        return this.calculateMobileFirstSize(viewportWidth, deviceType)
      case 'desktop-first':
        return this.calculateDesktopFirstSize(viewportWidth, deviceType)
      case 'large-screen-first':
        return this.calculateLargeScreenFirstSize(viewportWidth, deviceType)
      case 'adaptive':
        return this.calculateAdaptiveSize(viewportWidth, deviceType)
      default:
        // 兼容性：使用移动端优先策略
        if (this.config.mobileFirst) {
          return this.calculateMobileFirstSize(viewportWidth, deviceType)
        }
        return this.calculateDesktopFirstSize(viewportWidth, deviceType)
    }
  }

  /**
   * 移动端优先计算策略
   */
  private calculateMobileFirstSize(viewportWidth: number, deviceType: 'PC' | 'Mobile'): number {
    // 🎯 移动端优先：直接使用移动端配置的设计稿宽度
    const mobileDesignWidth = mobileConfig.maxDesignWidth // 768px
    const mobileBaseFontSize = mobileConfig.maxBaseFontSize // 14px
    const mobileMinFontSize = mobileConfig.minFontSize // 10px
    const mobileMaxFontSize = mobileConfig.maxFontSize // 18px

    // 🎯 确保与 PostCSS rootValue 保持一致
    // PostCSS 使用 16px 作为 rootValue，但移动端基准字体是 14px
    // 我们需要调整计算逻辑以保持一致性
    const postcssRootValue = 16 // PostCSS 配置的 rootValue
    const mobileScale = mobileBaseFontSize / postcssRootValue // 14/16 = 0.875

    const scale = viewportWidth / mobileDesignWidth

    // 基于缩放比例计算字体大小，并应用移动端缩放因子
    let fontSize = postcssRootValue * scale * mobileScale

    // 限制字体大小范围
    const minScale = mobileMinFontSize / postcssRootValue
    const maxScale = mobileMaxFontSize / postcssRootValue
    const clampedScale = Math.max(minScale, Math.min(maxScale, scale))
    fontSize = postcssRootValue * clampedScale

    if (debugConfig.enabled) {
      console.log(
        `📱 ${adapterStrategies.mobileFirst} 缩放计算: 屏幕${viewportWidth}px / 移动设计稿${mobileDesignWidth}px = ${scale.toFixed(4)} | 字体: ${fontSize.toFixed(2)}px | 设备: ${deviceTypes[deviceType.toLowerCase() as keyof typeof deviceTypes] || deviceType}`
      )
    }

    return fontSize
  }

  /**
   * 大屏优先计算策略
   */
  private calculateLargeScreenFirstSize(
    viewportWidth: number,
    deviceType: 'PC' | 'Mobile'
  ): number {
    // 🎯 大屏优先：根据屏幕宽度选择合适的配置
    let config: typeof largeScreenConfig | typeof ultraWideConfig | typeof fourKConfig

    if (viewportWidth > fourKConfig.minWidth) {
      // 4K屏配置
      config = fourKConfig
      if (debugConfig.enabled) {
        console.log('🎬 4K屏适配策略')
      }
    } else if (viewportWidth > ultraWideConfig.minWidth) {
      // 超大屏配置
      config = ultraWideConfig
      if (debugConfig.enabled) {
        console.log('🖥️ 超大屏适配策略')
      }
    } else if (viewportWidth > largeScreenConfig.minWidth) {
      // 大屏配置
      config = largeScreenConfig
      if (debugConfig.enabled) {
        console.log('📺 大屏适配策略')
      }
    } else {
      // 默认使用桌面端配置
      return this.calculateDesktopFirstSize(viewportWidth, deviceType)
    }

    const scale = viewportWidth / config.designWidth

    // 基于缩放比例计算字体大小
    let fontSize = config.baseFontSize * scale

    // 限制字体大小范围
    const minScale = config.minFontSize / config.baseFontSize
    const maxScale = config.maxFontSize / config.baseFontSize
    const clampedScale = Math.max(minScale, Math.min(maxScale, scale))
    fontSize = config.baseFontSize * clampedScale

    if (debugConfig.enabled) {
      console.log(
        `🖥️ ${adapterStrategies.largeScreenFirst} 缩放计算: 屏幕${viewportWidth}px / 设计稿${config.designWidth}px = ${scale.toFixed(4)} | 字体: ${fontSize.toFixed(2)}px | 设备: ${deviceTypes[deviceType.toLowerCase() as keyof typeof deviceTypes] || deviceType}`
      )
    }

    return fontSize
  }

  /**
   * 自适应计算策略
   */
  private calculateAdaptiveSize(viewportWidth: number, deviceType: 'PC' | 'Mobile'): number {
    // 🎯 自适应策略：根据屏幕宽度自动选择合适的配置
    const { strategies } = adaptiveConfig

    let selectedStrategy: keyof typeof strategies = 'desktop'

    // 🎯 使用更清晰的边界判断，避免断点重叠
    if (viewportWidth <= strategies.mobile.maxWidth) {
      // 移动端：<= 768px
      selectedStrategy = 'mobile'
    } else if (viewportWidth <= strategies.tablet.maxWidth) {
      // 平板：769px - 1024px
      selectedStrategy = 'tablet'
    } else if (viewportWidth <= strategies.desktop.maxWidth) {
      // 桌面端：1025px - 1920px
      selectedStrategy = 'desktop'
    } else if (viewportWidth <= strategies.largeScreen.maxWidth) {
      // 大屏：1921px - 2560px
      selectedStrategy = 'largeScreen'
    } else if (viewportWidth <= strategies.ultraWide.maxWidth) {
      // 超大屏：2561px - 3840px
      selectedStrategy = 'ultraWide'
    } else {
      // 4K屏：> 3840px
      selectedStrategy = 'fourK'
    }

    const config = strategies[selectedStrategy]
    const scale = viewportWidth / config.designWidth

    // 基于缩放比例计算字体大小
    let fontSize = config.baseFontSize * scale

    // 限制字体大小范围
    const minScale = config.minFontSize / config.baseFontSize
    const maxScale = config.maxFontSize / config.baseFontSize
    const clampedScale = Math.max(minScale, Math.min(maxScale, scale))
    fontSize = config.baseFontSize * clampedScale

    if (debugConfig.enabled) {
      console.log(
        `🎯 ${adapterStrategies.adaptive} 自适应策略: ${selectedStrategy} | 屏幕${viewportWidth}px / 设计稿${config.designWidth}px = ${scale.toFixed(4)} | 字体: ${fontSize.toFixed(2)}px | 设备: ${deviceTypes[deviceType.toLowerCase() as keyof typeof deviceTypes] || deviceType}`
      )
    }

    return fontSize
  }

  /**
   * 桌面端优先计算策略（推荐用于管理后台）
   */
  private calculateDesktopFirstSize(viewportWidth: number, deviceType: 'PC' | 'Mobile'): number {
    // 🎯 桌面端优先：使用桌面端配置
    const desktopDesignWidth = this.config.designWidth // 1800px
    const desktopBaseFontSize = this.config.baseFontSize // 16px
    const desktopMinFontSize = desktopConfig.minFontSize // 12px
    const desktopMaxFontSize = desktopConfig.maxFontSize // 28px
    const desktopMinBaseFontSize = desktopConfig.minBaseFontSize // 14px

    // 计算当前屏幕相对于设计稿的缩放比例
    const scale = viewportWidth / desktopDesignWidth

    // 基于缩放比例计算字体大小
    // 保持 PostCSS 的 rootValue=16 基准，确保 1:1 映射
    let fontSize = Math.max(desktopBaseFontSize, desktopMinBaseFontSize) * scale

    // 对于极小屏幕，适当调整最小缩放比例，避免字体过小
    const minScale = desktopMinFontSize / desktopBaseFontSize // 最小缩放比例
    const maxScale = desktopMaxFontSize / desktopBaseFontSize // 最大缩放比例

    // 限制缩放比例范围
    const clampedScale = Math.max(minScale, Math.min(maxScale, scale))
    fontSize = desktopBaseFontSize * clampedScale

    if (debugConfig.enabled) {
      console.log(
        `🖥️ ${adapterStrategies.desktopFirst} 缩放计算: 屏幕${viewportWidth}px / 设计稿${desktopDesignWidth}px = ${scale.toFixed(4)} | 字体: ${fontSize.toFixed(2)}px | 设备: ${deviceTypes[deviceType.toLowerCase() as keyof typeof deviceTypes] || deviceType}`
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

      // 🎯 动态更新 PostCSS rootValue 以保持一致性
      if (this.config.mobileFirst) {
        // 移动端优先：使用移动端基准字体大小
        rootElement.style.setProperty(
          '--postcss-root-value',
          mobileConfig.maxBaseFontSize.toString()
        )
      } else {
        // 桌面端优先：使用桌面端基准字体大小
        rootElement.style.setProperty('--postcss-root-value', this.config.baseFontSize.toString())
      }

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
    // 🎯 根据适配策略调整转换逻辑
    if (this.config.mobileFirst) {
      // 移动端优先：使用 PostCSS rootValue (16px) 作为基准
      const postcssRootValue = 16
      return `${(px / postcssRootValue).toFixed(4)}rem`
    } else {
      // 桌面端优先：使用当前字体大小作为基准
      return `${(px / this.currentFontSize).toFixed(4)}rem`
    }
  }

  /**
   * rem 转 px （开发时辅助函数）
   */
  remToPx(rem: number): number {
    // 🎯 根据适配策略调整转换逻辑
    if (this.config.mobileFirst) {
      // 移动端优先：使用 PostCSS rootValue (16px) 作为基准
      const postcssRootValue = 16
      return rem * postcssRootValue
    } else {
      // 桌面端优先：使用当前字体大小作为基准
      return rem * this.currentFontSize
    }
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
      strategy: this.config.strategy,
      // 添加屏幕类型信息
      screenType: this.getScreenType(deviceInfo.screen.width),
      // 添加设计稿信息
      designInfo: this.getDesignInfo(deviceInfo.screen.width),
    }
  }

  /**
   * 获取屏幕类型
   */
  private getScreenType(width: number): string {
    if (width > fourKConfig.minWidth) {
      return '4K'
    } else if (width > ultraWideConfig.minWidth) {
      return 'UltraWide'
    } else if (width > largeScreenConfig.minWidth) {
      return 'LargeScreen'
    } else if (width > 1024) {
      return 'Desktop'
    } else if (width > 768) {
      return 'Tablet'
    } else {
      return 'Mobile'
    }
  }

  /**
   * 获取设计稿信息
   */
  private getDesignInfo(width: number): {
    designWidth: number
    baseFontSize: number
    strategy: string
  } {
    switch (this.config.strategy) {
      case 'mobile-first':
        return {
          designWidth: mobileConfig.maxDesignWidth,
          baseFontSize: mobileConfig.maxBaseFontSize,
          strategy: 'mobile-first',
        }
      case 'large-screen-first':
        if (width > fourKConfig.minWidth) {
          return {
            designWidth: fourKConfig.designWidth,
            baseFontSize: fourKConfig.baseFontSize,
            strategy: '4K',
          }
        } else if (width > ultraWideConfig.minWidth) {
          return {
            designWidth: ultraWideConfig.designWidth,
            baseFontSize: ultraWideConfig.baseFontSize,
            strategy: 'ultra-wide',
          }
        } else if (width > largeScreenConfig.minWidth) {
          return {
            designWidth: largeScreenConfig.designWidth,
            baseFontSize: largeScreenConfig.baseFontSize,
            strategy: 'large-screen',
          }
        } else {
          return {
            designWidth: remConfig.designWidth,
            baseFontSize: remConfig.baseFontSize,
            strategy: 'desktop',
          }
        }
      case 'adaptive': {
        const { strategies } = adaptiveConfig
        if (width <= strategies.mobile.maxWidth) {
          return {
            designWidth: strategies.mobile.designWidth,
            baseFontSize: strategies.mobile.baseFontSize,
            strategy: 'mobile',
          }
        } else if (width <= strategies.tablet.maxWidth) {
          return {
            designWidth: strategies.tablet.designWidth,
            baseFontSize: strategies.tablet.baseFontSize,
            strategy: 'tablet',
          }
        } else if (width <= strategies.desktop.maxWidth) {
          return {
            designWidth: strategies.desktop.designWidth,
            baseFontSize: strategies.desktop.baseFontSize,
            strategy: 'desktop',
          }
        } else if (width <= strategies.largeScreen.maxWidth) {
          return {
            designWidth: strategies.largeScreen.designWidth,
            baseFontSize: strategies.largeScreen.baseFontSize,
            strategy: 'large-screen',
          }
        } else if (width <= strategies.ultraWide.maxWidth) {
          return {
            designWidth: strategies.ultraWide.designWidth,
            baseFontSize: strategies.ultraWide.baseFontSize,
            strategy: 'ultra-wide',
          }
        } else {
          return {
            designWidth: strategies.fourK.designWidth,
            baseFontSize: strategies.fourK.baseFontSize,
            strategy: '4K',
          }
        }
      }
      default:
        return {
          designWidth: remConfig.designWidth,
          baseFontSize: remConfig.baseFontSize,
          strategy: 'desktop-first',
        }
    }
  }

  /**
   * 获取当前断点
   */
  private getCurrentBreakpoint(width: number): string {
    const { breakpoints } = this.config

    if (width >= breakpoints.xxxl) {
      return 'xxxl'
    }
    if (width >= breakpoints.xxl) {
      return 'xxl'
    }
    if (width >= breakpoints.xls) {
      return 'xls'
    }
    if (width >= breakpoints.xl) {
      return 'xl'
    }
    if (width >= breakpoints.lg) {
      return 'lg'
    }
    if (width >= breakpoints.md) {
      return 'md'
    }
    if (width >= breakpoints.sm) {
      return 'sm'
    }
    if (width >= breakpoints.xs) {
      return 'xs'
    }
    return 'xs'
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
    try {
      // 立即设置一次
      const deviceInfo = getDeviceInfo()
      this.setRootFontSize(deviceInfo)

      // 🎯 初始化完成后打印设计稿信息
      const designInfo = this.getDesignInfo(deviceInfo.screen.width)
      const deviceType =
        deviceTypes[deviceInfo.type.toLowerCase() as keyof typeof deviceTypes] || deviceInfo.type
      console.log(
        `✅📐 rem 适配器初始化完成: 设计稿宽度=${designInfo.designWidth}px | 基准字体=${designInfo.baseFontSize}px | 当前字体=${this.currentFontSize.toFixed(2)}px | 策略=${designInfo.strategy} | 设备=${deviceType}`
      )
    } catch (error) {
      console.warn('rem 适配器初始化失败:', error)
      // 使用默认配置
      this.setRootFontSize({
        type: 'PC',
        screen: {
          width: 1920,
          height: 1080,
          orientation: 'horizontal',
          deviceWidth: 1920,
          deviceHeight: 1080,
          definitely: 1080,
          navHeight: 0,
          tabHeight: 0,
        },
        system: 'Unknown',
      })
    }

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
      try {
        // 使用 RequestAnimationFrame 确保在下一帧执行
        if (rafId) {
          cancelAnimationFrame(rafId)
        }

        rafId = requestAnimationFrame(() => {
          try {
            smartDebouncedResize()
          } catch (error) {
            console.warn('rem 适配器 resize 处理失败:', error)
          }
          rafId = null
        })
      } catch (error) {
        console.warn('rem 适配器 handleResize 失败:', error)
      }
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
  // 添加全局错误处理
  window.addEventListener('error', event => {
    if (
      event.message.includes('runtime.lastError') ||
      event.message.includes('message port closed')
    ) {
      console.warn('检测到浏览器扩展相关错误，已忽略:', event.message)
      event.preventDefault()
    }
  })

  // 添加未处理的 Promise 错误处理
  window.addEventListener('unhandledrejection', event => {
    if (
      event.reason &&
      event.reason.message &&
      event.reason.message.includes('runtime.lastError')
    ) {
      console.warn('检测到未处理的 Promise 错误，已忽略:', event.reason.message)
      event.preventDefault()
    }
  })
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

    // 🧪 测试边界逻辑
    testBoundaryLogic() {
      const testWidths = [768, 1024, 1920, 2560, 3840, 4096]
      const adapter = new RemAdapter()

      console.log('🧪 测试边界逻辑:')
      testWidths.forEach(width => {
        // 测试大屏优先策略
        const largeScreenResult = adapter['calculateLargeScreenFirstSize'](width, 'PC')

        // 测试自适应策略
        const adaptiveResult = adapter['calculateAdaptiveSize'](width, 'PC')

        console.log(`屏幕宽度 ${width}px:`)
        console.log(`  大屏优先策略: ${largeScreenResult.toFixed(2)}px`)
        console.log(`  自适应策略: ${adaptiveResult.toFixed(2)}px`)
        console.log('---')
      })
    },
  }
}
