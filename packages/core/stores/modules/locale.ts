/**
 * @copyright Copyright (c) 2025 chichuang
 * @license MIT
 * @description cc-admin 企业级后台管理框架 - 状态管理
 * 本文件为 chichuang 原创，禁止擅自删除署名或用于商业用途。
 */

/**
 * 多语言状态管理
 */
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { env } from '../../utils/env'
import type { SupportedLocale } from '../../utils/locale'
import { getCurrentLocale, setLocale, supportedLocales } from '../../utils/locale'

// 临时定义LocaleInfo类型
interface LocaleInfo {
  key: string
  label: string
  direction: string
}

interface LocaleState {
  locale: SupportedLocale
  loading: boolean
}

export const useLocaleStore = defineStore(
  'locale',
  () => {
    // 状态
    const state = ref<LocaleState>({
      locale: getCurrentLocale(),
      loading: false,
    })

    // 计算属性
    const currentLocale = computed(() => state.value.locale)

    const currentLocaleInfo = computed(() =>
      supportedLocales.find(item => item.key === state.value.locale)
    )

    const isChineseLang = computed(() => state.value.locale.startsWith('zh'))

    const isRTL = computed(() => false) // 临时设置为false，因为所有语言都是LTR

    const availableLocales = computed(() => supportedLocales)

    // 动作
    const switchLocale = async (newLocale: SupportedLocale) => {
      if (state.value.locale === newLocale) {
        return
      }

      state.value.loading = true

      try {
        setLocale(newLocale)
        state.value.locale = newLocale

        // 触发自定义事件
        window.dispatchEvent(
          new CustomEvent('locale-store-changed', {
            detail: { locale: newLocale },
          })
        )
      } catch (error) {
        console.error('Failed to switch locale:', error)
        throw error
      } finally {
        state.value.loading = false
      }
    }

    const initLocale = () => {
      const current = getCurrentLocale()
      state.value.locale = current

      // 确保HTML属性设置正确
      document.documentElement.lang = current
      const localeInfo = supportedLocales.find(item => item.key === current)
      document.documentElement.dir = localeInfo?.direction || 'ltr'
    }

    const getLocaleInfo = (locale: SupportedLocale): LocaleInfo | undefined => {
      return supportedLocales.find(item => item.key === locale)
    }

    return {
      // 状态
      state,

      // 计算属性
      currentLocale,
      currentLocaleInfo,
      isChineseLang,
      isRTL,
      availableLocales,
      loading: computed(() => state.value.loading),

      // 动作
      switchLocale,
      initLocale,
      getLocaleInfo,
    }
  },
  {
    persist: {
      key: `${env.piniaKeyPrefix}-locale`,
      storage: localStorage,
    },
  }
)
