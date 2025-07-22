/**
 * 多语言切换的Composable函数
 */
import { getCurrentLocale, setLocale, supportedLocales } from '@/locales'
import type { SupportedLocale } from '@/locales/types'
import { computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'

export function useLocale() {
  const { t, d, n } = useI18n()

  // 当前语言信息
  const currentLocale = computed(() =>
    supportedLocales.find(item => item.key === getCurrentLocale())
  )

  // 是否为中文
  const isChineseLang = computed(() => getCurrentLocale().startsWith('zh'))

  // 是否为RTL语言
  const isRTL = computed(() => currentLocale.value?.direction === 'rtl')

  // 切换语言
  const switchLocale = async (newLocale: SupportedLocale) => {
    const current = getCurrentLocale()
    if (current === newLocale) {
      return
    }

    try {
      setLocale(newLocale)

      // 通知其他模块语言已切换
      console.log(`Language switched to: ${newLocale}`)
    } catch (error) {
      console.error('Failed to switch locale:', error)
    }
  }

  // 获取翻译文本（带类型安全）
  const $t = (key: string, params?: Record<string, any>) => {
    return t(key, params || {})
  }

  // 格式化日期
  const $d = (date: Date | number, format?: string) => {
    return format ? d(date, format) : d(date)
  }

  // 格式化数字
  const $n = (number: number, format?: string) => {
    return format ? n(number, format) : n(number)
  }

  // 监听语言变化，更新相关状态
  watch(
    () => getCurrentLocale(),
    newLocale => {
      console.log('Locale changed to:', newLocale)
    },
    { immediate: true }
  )

  return {
    // 响应式数据
    locale: computed(() => getCurrentLocale()),
    currentLocale,
    isChineseLang,
    isRTL,
    supportedLocales,

    // 方法
    switchLocale,
    $t,
    $d,
    $n,
  }
}
