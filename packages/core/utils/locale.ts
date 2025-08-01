/**
 * @copyright Copyright (c) 2025 chichuang
 * @license MIT
 * @description cc-admin 企业级后台管理框架 - 国际化工具函数
 * 本文件为 chichuang 原创，禁止擅自删除署名或用于商业用途。
 */

// 支持的语言列表
export const supportedLocales = [
  {
    key: 'en-US',
    label: 'English',
    direction: 'ltr',
  },
  {
    key: 'zh-CN',
    label: '简体中文',
    direction: 'ltr',
  },
  {
    key: 'zh-TW',
    label: '繁體中文',
    direction: 'ltr',
  },
] as const

export type SupportedLocale = (typeof supportedLocales)[number]['key']

// 默认语言
const DEFAULT_LOCALE: SupportedLocale = 'zh-CN'

// 本地存储键名
const LOCALE_STORAGE_KEY = 'cc-admin-locale'

/**
 * 获取当前语言
 */
export function getCurrentLocale(): SupportedLocale {
  // 优先从本地存储获取
  const stored = localStorage.getItem(LOCALE_STORAGE_KEY)
  if (stored && isSupportedLocale(stored)) {
    return stored
  }

  // 从浏览器语言获取
  const browserLang = navigator.language
  const matchedLocale = supportedLocales.find(
    locale => browserLang.startsWith(locale.key) || browserLang.startsWith(locale.key.split('-')[0])
  )

  if (matchedLocale) {
    return matchedLocale.key
  }

  // 默认返回中文
  return DEFAULT_LOCALE
}

/**
 * 设置语言
 */
export function setLocale(locale: SupportedLocale): void {
  if (!isSupportedLocale(locale)) {
    console.warn(`不支持的语言: ${locale}`)
    return
  }

  // 保存到本地存储
  localStorage.setItem(LOCALE_STORAGE_KEY, locale)

  // 设置i18n语言（这里需要在实际使用时传入i18n实例）
  // if (i18n.global) {
  //   i18n.global.locale.value = locale
  // }

  // 设置HTML lang属性
  document.documentElement.lang = locale
  document.documentElement.setAttribute('data-locale', locale)
}

/**
 * 检查是否为支持的语言
 */
function isSupportedLocale(locale: string): locale is SupportedLocale {
  return supportedLocales.some(supported => supported.key === locale)
}

/**
 * 获取语言信息
 */
export function getLocaleInfo(locale: SupportedLocale) {
  return supportedLocales.find(item => item.key === locale)
}

/**
 * 初始化语言设置
 */
export function initLocale(): void {
  const currentLocale = getCurrentLocale()
  setLocale(currentLocale)
}
