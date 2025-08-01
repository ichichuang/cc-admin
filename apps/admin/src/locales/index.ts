/**
 * @copyright Copyright (c) 2025 chichuang
 * @license MIT
 * @description cc-admin 企业级后台管理框架 - 国际化配置
 * 本文件为 chichuang 原创，禁止擅自删除署名或用于商业用途。
 */

import enUS from '@/locales/lang/en-US'
import zhCN from '@/locales/lang/zh-CN'
import zhTW from '@/locales/lang/zh-TW'
import { createI18n } from 'vue-i18n'

// 支持的语言列表
export const supportedLocales = ['en-US', 'zh-CN', 'zh-TW'] as const

// 语言包映射
const messages: Record<string, any> = {
  enUS,
  zhCN,
  zhTW,
}

// 获取当前语言
export const getCurrentLocale = (): string => {
  return localStorage.getItem('locale') || 'zh-CN'
}

// 设置语言
export const setLocale = (locale: string) => {
  localStorage.setItem('locale', locale)
  window.location.reload()
}

// 创建 i18n 实例
const i18n = createI18n({
  legacy: false,
  locale: getCurrentLocale(),
  fallbackLocale: 'zh-CN',
  messages,
})

// 导出 i18n 实例
export default i18n
