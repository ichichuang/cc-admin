/**
 * @copyright Copyright (c) 2025 chichuang
 * @license MIT
 * @description cc-admin 企业级后台管理框架 - 国际化
 * 本文件为 chichuang 原创，禁止擅自删除署名或用于商业用途。
 */

/**
 * 通用模块语言配置
 */
import type { CommonLocaleMessages } from '../types'

/** 中文配置 */
export const commonZhCN: CommonLocaleMessages = {
  actions: {
    confirm: '确认',
    cancel: '取消',
    save: '保存',
    delete: '删除',
    edit: '编辑',
    add: '添加',
    search: '搜索',
    reset: '重置',
    submit: '提交',
    refresh: '刷新',
    export: '导出',
    import: '导入',
    close: '关闭',
    back: '返回',
    next: '下一步',
    previous: '上一步',
  },

  status: {
    loading: '加载中...',
    success: '操作成功',
    error: '操作失败',
    warning: '警告',
    info: '提示',
    pending: '等待中',
    completed: '已完成',
    failed: '失败',
    active: '启用',
    inactive: '禁用',
  },

  form: {
    required: '此字段为必填项',
    invalid: '输入格式不正确',
    tooShort: '输入内容过短',
    tooLong: '输入内容过长',
    invalidEmail: '邮箱格式不正确',
    invalidPhone: '手机号格式不正确',
    invalidUrl: '网址格式不正确',
    passwordMismatch: '两次密码输入不一致',
    pleaseSelect: '请选择',
    pleaseInput: '请输入',
  },

  table: {
    noData: '暂无数据',
    total: '共 {total} 条',
    page: '第 {page} 页',
    pageSize: '每页 {size} 条',
    itemsPerPage: '每页条数',
    goToPage: '跳转到',
    firstPage: '首页',
    lastPage: '尾页',
    previousPage: '上一页',
    nextPage: '下一页',
  },

  time: {
    now: '刚刚',
    today: '今天',
    yesterday: '昨天',
    tomorrow: '明天',
    thisWeek: '本周',
    thisMonth: '本月',
    thisYear: '今年',
    format: {
      date: 'YYYY-MM-DD',
      datetime: 'YYYY-MM-DD HH:mm:ss',
      time: 'HH:mm:ss',
    },
  },

  format: {
    date: '当前日期',
    number: '数字格式化',
  },

  system: {
    title: 'cc-admin',
    description: '企业级后台管理系统',
    version: '版本',
    copyright: '版权所有',
    loading: '系统加载中...',
    networkError: '网络连接失败',
    serverError: '服务器错误',
    unauthorized: '未授权访问',
    forbidden: '访问被拒绝',
    notFound: '页面不存在',
  },

  // 页面标题测试相关
  currentLanguage: '当前语言',
  languageSwitch: '语言切换',
  testSection: '测试区域',
  currentTitle: '当前标题',
  browserTitle: '浏览器标题',
  refreshTitle: '刷新标题',
  instructions: '使用说明',
  step1: '点击上方按钮切换语言',
  step2: '观察浏览器标签页标题是否实时更新',
  step3: '如果标题没有更新，点击"刷新标题"按钮',
}

/** 英文配置 */
export const commonEnUS: CommonLocaleMessages = {
  actions: {
    confirm: 'Confirm',
    cancel: 'Cancel',
    save: 'Save',
    delete: 'Delete',
    edit: 'Edit',
    add: 'Add',
    search: 'Search',
    reset: 'Reset',
    submit: 'Submit',
    refresh: 'Refresh',
    export: 'Export',
    import: 'Import',
    close: 'Close',
    back: 'Back',
    next: 'Next',
    previous: 'Previous',
  },

  status: {
    loading: 'Loading...',
    success: 'Success',
    error: 'Error',
    warning: 'Warning',
    info: 'Info',
    pending: 'Pending',
    completed: 'Completed',
    failed: 'Failed',
    active: 'Active',
    inactive: 'Inactive',
  },

  form: {
    required: 'This field is required',
    invalid: 'Invalid format',
    tooShort: 'Input too short',
    tooLong: 'Input too long',
    invalidEmail: 'Invalid email format',
    invalidPhone: 'Invalid phone format',
    invalidUrl: 'Invalid URL format',
    passwordMismatch: 'Passwords do not match',
    pleaseSelect: 'Please select',
    pleaseInput: 'Please input',
  },

  table: {
    noData: 'No data available',
    total: 'Total {total} items',
    page: 'Page {page}',
    pageSize: '{size} per page',
    itemsPerPage: 'Items per page',
    goToPage: 'Go to page',
    firstPage: 'First',
    lastPage: 'Last',
    previousPage: 'Previous',
    nextPage: 'Next',
  },

  time: {
    now: 'Just now',
    today: 'Today',
    yesterday: 'Yesterday',
    tomorrow: 'Tomorrow',
    thisWeek: 'This week',
    thisMonth: 'This month',
    thisYear: 'This year',
    format: {
      date: 'YYYY-MM-DD',
      datetime: 'YYYY-MM-DD HH:mm:ss',
      time: 'HH:mm:ss',
    },
  },

  format: {
    date: 'Current Date',
    number: 'Number Format',
  },

  system: {
    title: 'cc-admin',
    description: 'Enterprise Admin System',
    version: 'Version',
    copyright: 'Copyright',
    loading: 'System loading...',
    networkError: 'Network connection failed',
    serverError: 'Server error',
    unauthorized: 'Unauthorized access',
    forbidden: 'Access denied',
    notFound: 'Page not found',
  },

  // 页面标题测试相关
  currentLanguage: 'Current Language',
  languageSwitch: 'Language Switch',
  testSection: 'Test Section',
  currentTitle: 'Current Title',
  browserTitle: 'Browser Title',
  refreshTitle: 'Refresh Title',
  instructions: 'Instructions',
  step1: 'Click the buttons above to switch language',
  step2: 'Observe if the browser tab title updates in real-time',
  step3: 'If the title does not update, click the "Refresh Title" button',
}

/** 繁体中文配置 */
export const commonZhTW: CommonLocaleMessages = {
  actions: {
    confirm: '確認',
    cancel: '取消',
    save: '儲存',
    delete: '刪除',
    edit: '編輯',
    add: '新增',
    search: '搜尋',
    reset: '重置',
    submit: '提交',
    refresh: '刷新',
    export: '匯出',
    import: '匯入',
    close: '關閉',
    back: '返回',
    next: '下一步',
    previous: '上一步',
  },

  status: {
    loading: '載入中...',
    success: '操作成功',
    error: '操作失敗',
    warning: '警告',
    info: '提示',
    pending: '等待中',
    completed: '已完成',
    failed: '失敗',
    active: '啟用',
    inactive: '停用',
  },

  form: {
    required: '此欄位為必填',
    invalid: '輸入格式不正確',
    tooShort: '輸入內容過短',
    tooLong: '輸入內容過長',
    invalidEmail: '電子郵件格式不正確',
    invalidPhone: '手機號碼格式不正確',
    invalidUrl: '網址格式不正確',
    passwordMismatch: '兩次密碼輸入不一致',
    pleaseSelect: '請選擇',
    pleaseInput: '請輸入',
  },

  table: {
    noData: '暫無資料',
    total: '共 {total} 筆',
    page: '第 {page} 頁',
    pageSize: '每頁 {size} 筆',
    itemsPerPage: '每頁筆數',
    goToPage: '跳轉至',
    firstPage: '首頁',
    lastPage: '尾頁',
    previousPage: '上一頁',
    nextPage: '下一頁',
  },

  time: {
    now: '剛剛',
    today: '今天',
    yesterday: '昨天',
    tomorrow: '明天',
    thisWeek: '本週',
    thisMonth: '本月',
    thisYear: '今年',
    format: {
      date: 'YYYY-MM-DD',
      datetime: 'YYYY-MM-DD HH:mm:ss',
      time: 'HH:mm:ss',
    },
  },

  format: {
    date: '當前日期',
    number: '數字格式化',
  },

  system: {
    title: 'cc-admin',
    description: '企業級後台管理系統',
    version: '版本',
    copyright: '版權所有',
    loading: '系統載入中...',
    networkError: '網路連接失敗',
    serverError: '伺服器錯誤',
    unauthorized: '未授權存取',
    forbidden: '存取被拒絕',
    notFound: '頁面不存在',
  },

  // 页面标题测试相关
  currentLanguage: '當前語言',
  languageSwitch: '語言切換',
  testSection: '測試區域',
  currentTitle: '當前標題',
  browserTitle: '瀏覽器標題',
  refreshTitle: '刷新標題',
  instructions: '使用說明',
  step1: '點擊上方按鈕切換語言',
  step2: '觀察瀏覽器標籤頁標題是否實時更新',
  step3: '如果標題沒有更新，點擊"刷新標題"按鈕',
}
