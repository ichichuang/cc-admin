const isDebug = import.meta.env.VITE_DEBUG && false
import store from '@/stores'
import type { DeviceInfo } from '@/Types/global'
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
    const getRemConfig = computed(() => remConfig.value)
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
        const { useLayoutStoreWithOut } = await import('@/stores/modules/layout')
        const layoutStore = useLayoutStoreWithOut()
        const deviceInfo = layoutStore.deviceInfo

        // 🎯 根据设备类型自动设置移动端优先模式
        const isMobile = deviceInfo.type === 'Mobile'
        const shouldUpdateMobileFirst = remConfig.value.mobileFirst !== isMobile

        if (shouldUpdateMobileFirst) {
          remConfig.value.mobileFirst = isMobile
          if (isDebug) {
            console.log(
              `🎯 自动切换适配模式: ${isMobile ? '移动端优先' : '桌面端优先'} (设备: ${deviceInfo.type})`
            )
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
            remConfig.value.mobileFirst = currentIsMobile
            if (isDebug) {
              console.log(
                `🔄 设备类型变化，自动切换适配模式: ${currentIsMobile ? '移动端优先' : '桌面端优先'}`
              )
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
            if (isDebug) {
              console.log('🎯 主动刷新适配器：', newDeviceInfo.screen.width + 'px')
            }
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
                if (isDebug) {
                  console.log('🎯 检测到根字体变化：', newFontSize + 'px')
                }
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

        if (isDebug) {
          console.log('🎯 rem 适配器已初始化 (增强响应)', await getRemAdapterInfoAsync())
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
          const { useLayoutStoreWithOut } = await import('@/stores/modules/layout')
          const layoutStore = useLayoutStoreWithOut()
          const deviceInfo = layoutStore.deviceInfo

          // 🎯 检测设备类型变化，自动调整适配模式
          const isMobile = deviceInfo.type === 'Mobile'
          if (remConfig.value.mobileFirst !== isMobile) {
            remConfig.value.mobileFirst = isMobile
            if (isDebug) {
              console.log(
                `🔄 设备变化，自动切换适配模式: ${isMobile ? '移动端优先' : '桌面端优先'} (设备: ${deviceInfo.type})`
              )
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
          const { useLayoutStoreWithOut } = await import('@/stores/modules/layout')
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
        const { useLayoutStoreWithOut } = await import('@/stores/modules/layout')
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
        const { useLayoutStoreWithOut } = await import('@/stores/modules/layout')
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

          if (isDebug) {
            console.log('🔄 手动刷新适配器完成：', currentRemBase.value + 'px')
          }
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
      key: `${import.meta.env.VITE_PINIA_PERSIST_KEY_PREFIX}-postcss`,
      storage: localStorage,
    },
  }
)

export const usePostcssStoreWithOut = () => {
  return usePostcssStore(store)
}
