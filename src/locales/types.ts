/**
 * @copyright Copyright (c) 2025 chichuang
 * @license MIT
 * @description cc-admin 企业级后台管理框架 - 国际化
 * 本文件为 chichuang 原创，禁止擅自删除署名或用于商业用途。
 */

/**
 * 国际化类型定义
 * 定义项目中使用的所有语言配置类型
 */

/** 支持的语言类型 */
export type SupportedLocale = 'zh-CN' | 'en-US' | 'zh-TW'

/** 语言配置信息 */
export interface LocaleInfo {
  key: SupportedLocale
  name: string
  flag: string
  direction: 'ltr' | 'rtl'
}

/** 通用语言配置结构 */
export interface CommonLocaleMessages {
  // 操作相关
  actions: {
    confirm: string
    cancel: string
    save: string
    delete: string
    edit: string
    add: string
    search: string
    reset: string
    submit: string
    refresh: string
    export: string
    import: string
    close: string
    back: string
    next: string
    previous: string
  }

  // 状态相关
  status: {
    loading: string
    success: string
    error: string
    warning: string
    info: string
    pending: string
    completed: string
    failed: string
    active: string
    inactive: string
  }

  // 表单相关
  form: {
    required: string
    invalid: string
    tooShort: string
    tooLong: string
    invalidEmail: string
    invalidPhone: string
    invalidUrl: string
    passwordMismatch: string
    pleaseSelect: string
    pleaseInput: string
  }

  // 表格相关
  table: {
    noData: string
    total: string
    page: string
    pageSize: string
    itemsPerPage: string
    goToPage: string
    firstPage: string
    lastPage: string
    previousPage: string
    nextPage: string
  }

  // 时间相关
  time: {
    now: string
    today: string
    yesterday: string
    tomorrow: string
    thisWeek: string
    thisMonth: string
    thisYear: string
    format: {
      date: string
      datetime: string
      time: string
    }
  }

  // 格式化示例
  format: {
    date: string
    number: string
  }

  // 系统相关
  system: {
    title: string
    description: string
    version: string
    copyright: string
    loading: string
    networkError: string
    serverError: string
    unauthorized: string
    forbidden: string
    notFound: string
  }

  // 页面标题测试相关
  currentLanguage: string
  languageSwitch: string
  testSection: string
  currentTitle: string
  browserTitle: string
  refreshTitle: string
  instructions: string
  step1: string
  step2: string
  step3: string
}

/** 认证模块语言配置 */
export interface AuthLocaleMessages {
  login: {
    title: string
    username: string
    password: string
    rememberMe: string
    forgotPassword: string
    loginButton: string
    loginSuccess: string
    loginFailed: string
    invalidCredentials: string
    usernameRequired: string
    passwordRequired: string
  }

  logout: {
    title: string
    confirm: string
    success: string
    failed: string
  }

  register: {
    title: string
    username: string
    password: string
    confirmPassword: string
    email: string
    phone: string
    agreement: string
    registerButton: string
    registerSuccess: string
    registerFailed: string
    userExists: string
    emailExists: string
  }
}

/** 用户模块语言配置 */
export interface UserLocaleMessages {
  profile: {
    title: string
    basicInfo: string
    avatar: string
    username: string
    email: string
    phone: string
    department: string
    role: string
    lastLogin: string
    createdAt: string
    updatedAt: string
    updateSuccess: string
    updateFailed: string
  }

  management: {
    title: string
    userList: string
    addUser: string
    editUser: string
    deleteUser: string
    deleteConfirm: string
    batchDelete: string
    exportUsers: string
    importUsers: string
    userCount: string
    searchUser: string
    filterByRole: string
    filterByStatus: string
  }

  roles: {
    admin: string
    user: string
    guest: string
    moderator: string
    editor: string
    viewer: string
  }

  status: {
    active: string
    inactive: string
    banned: string
    pending: string
    suspended: string
  }
}

/** 仪表盘模块语言配置 */
export interface DashboardLocaleMessages {
  title: string
  welcome: string
  overview: string
  statistics: {
    totalUsers: string
    activeUsers: string
    totalOrders: string
    totalRevenue: string
    growthRate: string
    conversionRate: string
  }
  charts: {
    userGrowth: string
    revenueChart: string
    orderChart: string
    trafficChart: string
    conversionChart: string
  }
  quickActions: {
    title: string
    addUser: string
    viewOrders: string
    generateReport: string
    systemSettings: string
  }
  recentActivities: {
    title: string
    viewAll: string
    noActivities: string
  }
}

/** 根语言配置接口 */
export interface LocaleMessages {
  common: CommonLocaleMessages
  auth: AuthLocaleMessages
  user: UserLocaleMessages
  dashboard: DashboardLocaleMessages
  router: RouterLocaleMessages
}

/** 语言包加载配置 */
export interface LocaleConfig {
  messages: Record<SupportedLocale, LocaleMessages>
  fallbackLocale: SupportedLocale
  supportedLocales: LocaleInfo[]
  defaultLocale: SupportedLocale
}

/** 路由配置模块语言配置 */
export interface RouterLocaleMessages {
  core: {
    login: string
  }
  dashboard: {
    dashboard: string
  }
  example: {
    example: string
    i18n: string
    color: string
    size: string
    rem: string
    date: string
  }
  error: {
    notFound: string
    forbidden: string
    serverError: string
  }
}
