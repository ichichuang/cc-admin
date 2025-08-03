/**
 * @copyright Copyright (c) 2025 chichuang
 * @license MIT
 * @description cc-admin 企业级后台管理框架 - 状态管理
 * 本文件为 chichuang 原创，禁止擅自删除署名或用于商业用途。
 */

import store from '@/stores'
import { useLayoutStoreWithOut } from '@/stores/modules/layout'
import { env } from '@/utils/env'
import { RemAdapter, type RemAdapterConfig, parseRemConfigFromEnv } from '@/utils/remAdapter'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

/* PostCSS rem 适配 store */
export const usePostcssStore = defineStore(
  'postcss',
  () => {
    // State - 使用环境变量配置
    const remConfig = ref<RemAdapterConfig>(parseRemConfigFromEnv())

    const currentRemBase = ref<number>(remConfig.value.baseFontSize)
    const remAdapter = ref<RemAdapter | null>(null)
    const remCleanupFn = ref<(() => void) | null>(null)

    // Getters
    const getRemConfig = computed(() => {
      // 🎯 确保响应式更新，返回完整的配置对象
      const layoutStore = useLayoutStoreWithOut()
      const deviceInfo = layoutStore.deviceInfo
      const screenWidth = deviceInfo.screen.width

      // 根据策略计算当前设计稿信息
      let currentDesignInfo = {
        width: remConfig.value.designWidth,
        description: '桌面端',
      }

      switch (remConfig.value.strategy) {
        case 'mobile-first':
          currentDesignInfo = {
            width: 768,
            description: '移动端',
          }
          break
        case 'large-screen-first':
          if (screenWidth >= 3840) {
            currentDesignInfo = {
              width: 3840,
              description: '4K屏',
            }
          } else if (screenWidth >= 2560) {
            currentDesignInfo = {
              width: 3200,
              description: '超大屏',
            }
          } else if (screenWidth >= 1920) {
            currentDesignInfo = {
              width: 2560,
              description: '大屏',
            }
          } else {
            currentDesignInfo = {
              width: remConfig.value.designWidth,
              description: '桌面端',
            }
          }
          break
        case 'adaptive':
          if (screenWidth <= 768) {
            currentDesignInfo = {
              width: 768,
              description: '移动端',
            }
          } else if (screenWidth <= 1024) {
            currentDesignInfo = {
              width: 1024,
              description: '平板',
            }
          } else if (screenWidth <= 1920) {
            currentDesignInfo = {
              width: 1800,
              description: '桌面端',
            }
          } else if (screenWidth <= 2560) {
            currentDesignInfo = {
              width: 2560,
              description: '大屏',
            }
          } else if (screenWidth <= 3840) {
            currentDesignInfo = {
              width: 3200,
              description: '超大屏',
            }
          } else {
            currentDesignInfo = {
              width: 3840,
              description: '4K屏',
            }
          }
          break
        default:
          currentDesignInfo = {
            width: remConfig.value.designWidth,
            description: '桌面端',
          }
      }

      return {
        ...remConfig.value,
        // 添加当前设备类型信息，便于调试
        currentDeviceType: deviceInfo.type,
        // 添加当前屏幕宽度信息
        currentScreenWidth: screenWidth,
        // 添加当前设计稿信息
        currentDesignInfo,
        // 添加屏幕类型信息
        screenType: getScreenType(screenWidth),
      }
    })

    // 获取屏幕类型的辅助函数
    const getScreenType = (width: number): string => {
      if (width >= 3840) {
        return '4K'
      }
      if (width >= 2560) {
        return 'UltraWide'
      }
      if (width >= 1920) {
        return 'LargeScreen'
      }
      if (width >= 1024) {
        return 'Desktop'
      }
      if (width >= 768) {
        return 'Tablet'
      }
      return 'Mobile'
    }
    const getCurrentRemBase = computed(() => currentRemBase.value)
    const getRemAdapterAvailable = computed(() => !!remAdapter.value)

    const getCurrentBreakpoint = computed(() => {
      return (deviceInfo: DeviceInfo) => {
        const width = deviceInfo.screen.width
        const { breakpoints } = remConfig.value

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
    })

    // Actions
    const initRemAdapter = async () => {
      try {
        // 获取设备信息
        const layoutStore = useLayoutStoreWithOut()
        const deviceInfo = layoutStore.deviceInfo

        // 🎯 根据设备类型和屏幕宽度自动设置适配策略
        const isMobile = deviceInfo.type === 'Mobile'
        const screenWidth = deviceInfo.screen.width

        // 智能适配策略选择
        let newStrategy: 'mobile-first' | 'desktop-first' | 'large-screen-first' | 'adaptive'
        let shouldUpdateStrategy = false

        if (isMobile) {
          newStrategy = 'mobile-first'
        } else if (screenWidth >= 1920) {
          // 大屏及以上使用大屏优先策略
          newStrategy = 'large-screen-first'
        } else {
          // 桌面端使用自适应策略
          newStrategy = 'adaptive'
        }

        shouldUpdateStrategy = remConfig.value.strategy !== newStrategy

        if (shouldUpdateStrategy) {
          // 🎯 使用响应式更新方式，确保 getRemConfig 能够实时更新
          remConfig.value = {
            ...remConfig.value,
            strategy: newStrategy,
            mobileFirst: isMobile, // 保持兼容性
          }
        }

        // 设置全局变量供调试工具使用
        if (typeof window !== 'undefined') {
          ;(window as any).__POSTCSS_STORE__ = {
            forceRefreshAdapter,
            getAdapterStatus,
          }
        }

        // 清理旧的适配器
        cleanupRemAdapter()

        // 创建新的适配器实例
        remAdapter.value = new RemAdapter(remConfig.value)

        // 立即设置一次根字体大小
        remAdapter.value.setRootFontSize(deviceInfo)
        currentRemBase.value = remAdapter.value.getCurrentFontSize()

        // 初始化适配器并保存清理函数
        remCleanupFn.value = remAdapter.value.init(() => {
          // 获取最新的设备信息
          const latestDeviceInfo = layoutStore.deviceInfo

          // 🎯 检测设备类型变化，动态调整适配模式
          const currentIsMobile = latestDeviceInfo.type === 'Mobile'
          if (remConfig.value.mobileFirst !== currentIsMobile) {
            // 🎯 使用响应式更新方式，确保 getRemConfig 能够实时更新
            remConfig.value = {
              ...remConfig.value,
              mobileFirst: currentIsMobile,
            }

            // 重新创建适配器实例以应用新配置
            if (remAdapter.value) {
              remAdapter.value = new RemAdapter(remConfig.value)
            }
          }

          // 同步更新当前的 rem 基准值
          if (remAdapter.value && typeof remAdapter.value.getCurrentFontSize === 'function') {
            currentRemBase.value = remAdapter.value.getCurrentFontSize()
          }
          return latestDeviceInfo
        }, 300) // 使用 300ms 防抖延迟

        // 添加自定义事件监听，用于同步状态
        const handleFontSizeChange = (_event: CustomEvent) => {
          if (remAdapter.value && typeof remAdapter.value.getCurrentFontSize === 'function') {
            currentRemBase.value = remAdapter.value.getCurrentFontSize()
          }
        }

        // 添加主动刷新机制：监听 layout store 的变化
        const handleLayoutChange = () => {
          if (remAdapter.value && typeof remAdapter.value.setRootFontSize === 'function') {
            const newDeviceInfo = layoutStore.deviceInfo
            remAdapter.value.setRootFontSize(newDeviceInfo)
            currentRemBase.value = remAdapter.value.getCurrentFontSize()
          }
        }

        window.addEventListener('fontSizeChanged', handleFontSizeChange as EventListener)

        // 添加更多事件监听，确保及时响应
        window.addEventListener('resize', handleLayoutChange)
        window.addEventListener('orientationchange', handleLayoutChange)

        // 使用 MutationObserver 监听根字体大小的实际变化
        let rootFontObserver: MutationObserver | null = null
        if (typeof MutationObserver !== 'undefined') {
          rootFontObserver = new MutationObserver(() => {
            if (remAdapter.value && typeof remAdapter.value.getCurrentFontSize === 'function') {
              const newFontSize = remAdapter.value.getCurrentFontSize()
              if (Math.abs(newFontSize - currentRemBase.value) > 0.1) {
                currentRemBase.value = newFontSize
              }
            }
          })

          rootFontObserver.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['style'],
          })
        }

        // 保存事件清理函数
        const originalCleanup = remCleanupFn.value
        remCleanupFn.value = () => {
          if (originalCleanup) {
            originalCleanup()
          }
          window.removeEventListener('fontSizeChanged', handleFontSizeChange as EventListener)
          window.removeEventListener('resize', handleLayoutChange)
          window.removeEventListener('orientationchange', handleLayoutChange)
          if (rootFontObserver) {
            rootFontObserver.disconnect()
          }
        }

        if (env.debug) {
          console.log('✅ rem 适配器已初始化')
        }
      } catch (error) {
        console.error('Failed to initialize rem adapter:', error)
      }
    }

    const updateRemAdapter = async () => {
      if (
        remAdapter.value &&
        typeof remAdapter.value.setRootFontSize === 'function' &&
        typeof remAdapter.value.getCurrentFontSize === 'function'
      ) {
        try {
          const layoutStore = useLayoutStoreWithOut()
          const deviceInfo = layoutStore.deviceInfo

          // 🎯 检测设备类型变化，自动调整适配模式
          const isMobile = deviceInfo.type === 'Mobile'
          if (remConfig.value.mobileFirst !== isMobile) {
            // 🎯 使用响应式更新方式，确保 getRemConfig 能够实时更新
            remConfig.value = {
              ...remConfig.value,
              mobileFirst: isMobile,
            }
            // 重新创建适配器实例以应用新配置
            remAdapter.value = new RemAdapter(remConfig.value)
          }

          remAdapter.value.setRootFontSize(deviceInfo)
          currentRemBase.value = remAdapter.value.getCurrentFontSize()
        } catch (error) {
          console.warn('Failed to update rem adapter:', error)
        }
      }
    }

    const updateRemConfig = (newConfig: Partial<RemAdapterConfig>) => {
      remConfig.value = { ...remConfig.value, ...newConfig }
      // 重新初始化适配器以应用新配置
      initRemAdapter()
    }

    const cleanupRemAdapter = () => {
      if (remCleanupFn.value) {
        remCleanupFn.value()
        remCleanupFn.value = null
      }
      remAdapter.value = null
    }

    const pxToRem = (px: number): string => {
      if (remAdapter.value && typeof remAdapter.value.pxToRem === 'function') {
        return remAdapter.value.pxToRem(px)
      }
      return `${px / 16}rem` // 默认基准
    }

    const remToPx = (rem: number): number => {
      if (remAdapter.value && typeof remAdapter.value.remToPx === 'function') {
        return remAdapter.value.remToPx(rem)
      }
      return rem * 16 // 默认基准
    }

    const getRemAdapterInfoAsync = async () => {
      if (remAdapter.value && typeof remAdapter.value.getAdapterInfo === 'function') {
        try {
          const layoutStore = useLayoutStoreWithOut()
          return remAdapter.value.getAdapterInfo(layoutStore.deviceInfo)
        } catch (error) {
          console.warn('Failed to get adapter info:', error)
          return null
        }
      }
      return null
    }

    const getCurrentBreakpointAsync = async (): Promise<string> => {
      try {
        const layoutStore = useLayoutStoreWithOut()
        return getCurrentBreakpoint.value(layoutStore.deviceInfo)
      } catch (error) {
        console.warn('Failed to get current breakpoint:', error)
        return 'desktop'
      }
    }

    // 手动刷新适配器（强制更新）
    const forceRefreshAdapter = async () => {
      try {
        const layoutStore = useLayoutStoreWithOut()
        const deviceInfo = layoutStore.deviceInfo

        if (remAdapter.value && typeof remAdapter.value.setRootFontSize === 'function') {
          remAdapter.value.setRootFontSize(deviceInfo)
          currentRemBase.value = remAdapter.value.getCurrentFontSize()

          // 触发自定义事件通知其他组件
          window.dispatchEvent(
            new CustomEvent('remAdapterRefreshed', {
              detail: {
                fontSize: currentRemBase.value,
                deviceInfo,
                timestamp: Date.now(),
              },
            })
          )

          return true
        }
        return false
      } catch (error) {
        console.error('Failed to force refresh adapter:', error)
        return false
      }
    }

    // 获取适配状态信息（调试用）
    const getAdapterStatus = () => {
      return {
        isInitialized: !!remAdapter.value,
        currentRemBase: currentRemBase.value,
        config: remConfig.value,
        deviceType: '', // 将在组件中动态获取
        autoMobileFirst: true, // 标识启用了自动切换
        timestamp: Date.now(),
      }
    }

    return {
      // State
      remConfig,
      currentRemBase,
      remAdapter,
      remCleanupFn,

      // Getters
      getRemConfig,
      getCurrentRemBase,
      getRemAdapterAvailable,
      getCurrentBreakpoint,

      // Actions
      initRemAdapter,
      updateRemAdapter,
      updateRemConfig,
      cleanupRemAdapter,
      pxToRem,
      remToPx,
      getRemAdapterInfoAsync,
      getCurrentBreakpointAsync,
      forceRefreshAdapter,
      getAdapterStatus,
    }
  },
  {
    persist: {
      key: `${env.piniaKeyPrefix}-postcss`,
      storage: localStorage,
    },
  }
)

export const usePostcssStoreWithOut = () => {
  return usePostcssStore(store)
}
