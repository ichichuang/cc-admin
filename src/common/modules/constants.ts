// 应用常量定义

// API 相关常量
export const API_CONFIG = {
  baseUrl: 'http://localhost:3001',
  timeout: 10000,
  retryCount: 3,
} as const

// 存储键名常量
export const STORAGE_KEYS = {
  userToken: 'user_token',
  userInfo: 'user_info',
  theme: 'app_theme',
  language: 'app_language',
  sidebarCollapsed: 'sidebar_collapsed',
} as const

// 路由常量
export const ROUTES = {
  home: '/',
  login: '/login',
  dashboard: '/dashboard',
  test: '/test',
} as const

// 主题常量
export const THEMES = {
  light: 'light',
  dark: 'dark',
} as const

// 语言常量
export const LOCALES = {
  zhCn: 'zh-CN',
  enUs: 'en-US',
} as const

// 状态常量
export const STATUS = {
  pending: 'pending',
  success: 'success',
  error: 'error',
  loading: 'loading',
} as const

// HTTP 状态码
export const HTTP_STATUS = {
  ok: 200,
  badRequest: 400,
  unauthorized: 401,
  forbidden: 403,
  notFound: 404,
  internalServerError: 500,
} as const

// 默认导出所有常量
export default {
  apiConfig: API_CONFIG,
  storageKeys: STORAGE_KEYS,
  routes: ROUTES,
  themes: THEMES,
  locales: LOCALES,
  status: STATUS,
  httpStatus: HTTP_STATUS,
}
