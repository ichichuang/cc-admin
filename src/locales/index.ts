/**
 * @copyright Copyright (c) 2025 chichuang
 * @license MIT
 * @description cc-admin 企业级后台管理框架 - 国际化
 * 本文件为 chichuang 原创，禁止擅自删除署名或用于商业用途。
 */

/**
 * 国际化配置入口文件
 */
import { env } from '@/utils/env'
import type { App } from 'vue'
import { createI18n } from 'vue-i18n'
import enUS from './lang/en-US'
import zhCN from './lang/zh-CN'
import zhTW from './lang/zh-TW'
import type { LocaleInfo, LocaleMessages, SupportedLocale } from './types'

// 支持的语言列表
export const supportedLocales: LocaleInfo[] = [
  {
    key: 'zh-CN',
    name: '简体中文',
    flag: '🇨🇳',
    direction: 'ltr',
  },
  {
    key: 'en-US',
    name: 'English',
    flag: '🇺🇸',
    direction: 'ltr',
  },
  {
    key: 'zh-TW',
    name: '繁體中文',
    flag: '🇹🇼',
    direction: 'ltr',
  },
]

// 语言包映射
const messages: Record<SupportedLocale, LocaleMessages> = {
  ['zh-CN']: zhCN,
  ['en-US']: enUS,
  ['zh-TW']: zhTW,
}

// 获取默认语言
function getDefaultLocale(): SupportedLocale {
  // 1. 从localStorage获取用户设置
  const savedLocale = localStorage.getItem('cc-admin-locale') as SupportedLocale
  if (savedLocale && messages[savedLocale]) {
    return savedLocale
  }

  // 2. 从浏览器语言检测
  const browserLang = navigator.language.toLowerCase()

  // 中文检测
  if (browserLang.includes('zh')) {
    if (browserLang.includes('tw') || browserLang.includes('hk') || browserLang.includes('hant')) {
      return 'zh-TW'
    }
    return 'zh-CN'
  }

  // 英文检测
  if (browserLang.includes('en')) {
    return 'en-US'
  }

  // 3. 默认中文
  return 'zh-CN'
}

// 创建 i18n 实例
export const i18n = createI18n({
  legacy: false,
  locale: getDefaultLocale(),
  fallbackLocale: 'zh-CN',
  messages: messages as any,
  globalInjection: true,
  silentTranslationWarn: true,
  silentFallbackWarn: true,
  missingWarn: env.devTools,
  fallbackWarn: env.devTools,
})

// 安装插件
export function setupI18n(app: App) {
  app.use(i18n)
}

// 获取当前语言
export function getCurrentLocale(): SupportedLocale {
  return (i18n.global.locale as any).value
}

// 设置语言
export function setLocale(locale: SupportedLocale) {
  if (messages[locale]) {
    ;(i18n.global.locale as any).value = locale
    localStorage.setItem('cc-admin-locale', locale)

    // 更新HTML lang属性
    document.documentElement.lang = locale

    // 更新HTML dir属性
    const localeInfo = supportedLocales.find(item => item.key === locale)
    document.documentElement.dir = localeInfo?.direction || 'ltr'

    // 触发语言变更事件
    window.dispatchEvent(
      new CustomEvent('locale-changed', {
        detail: { locale },
      })
    )
  }
}

// 获取翻译文本
export function t(key: string, params?: Record<string, any>): string {
  return i18n.global.t(key, params || {})
}

// 格式化日期
export function d(date: Date | number, format?: string): string {
  return format ? i18n.global.d(date, format) : i18n.global.d(date)
}

// 格式化数字
export function n(number: number, format?: string): string {
  return format ? i18n.global.n(number, format) : i18n.global.n(number)
}

// 按需导出常用国际化函数，便于使用
export { getDefaultLocale, messages }
export type { LocaleInfo, LocaleMessages, SupportedLocale }
