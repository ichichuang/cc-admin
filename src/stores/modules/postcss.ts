import store from '@/stores'
import type { DeviceInfo } from '@/Types/global'
import { RemAdapter, type RemAdapterConfig } from '@/utils/remAdapter'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

/* PostCSS rem 适配 store */
export const usePostcssStore = defineStore(
  'postcss',
  () => {
    // State
    const remConfig = ref<RemAdapterConfig>({
      designWidth: 1920,
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
    })

    const currentRemBase = ref<number>(16)
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
          // 同步更新当前的 rem 基准值
          if (remAdapter.value && typeof remAdapter.value.getCurrentFontSize === 'function') {
            currentRemBase.value = remAdapter.value.getCurrentFontSize()
          }
          return latestDeviceInfo
        })

        // 添加自定义事件监听，用于同步状态
        const handleFontSizeChange = (_event: CustomEvent) => {
          if (remAdapter.value && typeof remAdapter.value.getCurrentFontSize === 'function') {
            currentRemBase.value = remAdapter.value.getCurrentFontSize()
          }
        }

        window.addEventListener('fontSizeChanged', handleFontSizeChange as EventListener)

        // 保存事件清理函数
        const originalCleanup = remCleanupFn.value
        remCleanupFn.value = () => {
          if (originalCleanup) {
            originalCleanup()
          }
          window.removeEventListener('fontSizeChanged', handleFontSizeChange as EventListener)
        }

        console.log('🎯 rem 适配器已初始化', await getRemAdapterInfoAsync())
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
