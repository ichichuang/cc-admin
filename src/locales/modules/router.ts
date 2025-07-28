/**
 * @copyright Copyright (c) 2025 chichuang
 * @license MIT
 * @description CC-Admin 企业级后台管理框架 - 国际化
 * 本文件为 chichuang 原创，禁止擅自删除署名或用于商业用途。
 */

/**
 * 路由配置模块语言配置
 */
import type { RouterLocaleMessages } from '../types'

/** 中文配置 */
export const routerZhCN: RouterLocaleMessages = {
  core: {
    login: '登录',
  },
  dashboard: {
    dashboard: '仪表盘',
  },
  example: {
    example: '示例',
    i18n: '国际化',
    color: '主题',
    size: '尺寸',
    rem: 'rem 适配',
    mock: 'Mock 示例',
  },
  error: {
    notFound: '页面未找到',
    forbidden: '访问被拒绝',
    serverError: '服务器错误',
  },
}

/** 英文配置 */
export const routerEnUS: RouterLocaleMessages = {
  core: {
    login: 'Login',
  },
  dashboard: {
    dashboard: 'Dashboard',
  },
  example: {
    example: 'Example',
    i18n: 'I18n',
    color: 'Theme',
    size: 'Size',
    rem: 'rem Adapter',
    mock: 'Mock exampleMock',
  },
  error: {
    notFound: 'Page Not Found',
    forbidden: 'Forbidden',
    serverError: 'Server Error',
  },
}

/** 繁体中文配置 */
export const routerZhTW: RouterLocaleMessages = {
  core: {
    login: '登錄',
  },
  dashboard: {
    dashboard: '儀表板',
  },
  example: {
    example: '示例',
    i18n: '國際化',
    color: '主題',
    size: '尺寸',
    rem: 'rem 適配',
    mock: 'Mock 示例',
  },
  error: {
    notFound: '頁面未找到',
    forbidden: '訪問被拒絕',
    serverError: '服務器錯誤',
  },
}
