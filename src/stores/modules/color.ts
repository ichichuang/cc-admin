import { getSystemColorMode, toKebabCase } from '@/common'
import store from '@/stores'
import { defineStore } from 'pinia'

/* 主题模式选项类型 */
export type Mode = 'light' | 'dark' | 'auto'
interface ModeOptions {
  label: string
  value: Mode
}

/* 颜色定义 */
interface FunctionalColors {
  color: string // 主色
  hover: string // 悬停色
  active: string // 激活色
  disabled: string // 禁用色
  light: string // 浅色背景
}
interface FunctionalColor {
  primary: FunctionalColors // 主色
  success: FunctionalColors // 成功色
  warning: FunctionalColors // 警告色
  error: FunctionalColors // 错误色
  info: FunctionalColors // 信息色
}
export interface ThemeColors {
  // 主题色
  primary100: string // 主色深色调 - 用于主要按钮、导航栏、重要操作元素
  primary200: string // 主色中色调 - 用于悬停状态、次要强调、链接颜色
  primary300: string // 主色浅色调 - 用于背景渐变、轻微强调、选中状态背景
  // 强调色
  accent100: string // 强调色主色调 - 用于重要信息提示、数据突出显示
  accent200: string // 强调色深色调 - 用于强调元素的深色变体、阴影效果
  // 文本色
  text100: string // 主文本色 - 用于标题、重要文字、主要内容文本
  text200: string // 次文本色 - 用于描述文字、辅助信息、次要内容
  // 背景色
  bg100: string // 主背景色 - 用于页面主背景、卡片背景、模态框背景
  bg200: string // 次背景色 - 用于区域分割、输入框背景、次要面板
  bg300: string // 边界背景色 - 用于分割线、禁用状态、边框颜色
  // 功能色
  functionalColors: FunctionalColor // 功能色
}
export interface ThemeColor {
  label: string // 主题色标签
  value: string // 主题色值
  themeColors: ThemeColors // 主题色具体颜色配置
}

/* 预设 */
// 主题模式选项类型
const modeOptions: ModeOptions[] = [
  { label: '亮色主题', value: 'light' },
  { label: '暗色主题', value: 'dark' },
  { label: '自动跟随系统主题', value: 'auto' },
]

// 颜色定义
const functionalColors: FunctionalColor = {
  primary: {
    color: '#5a9cf8',
    hover: '#88b9f9',
    active: '#78aff9',
    disabled: '#cccccc',
    light: '#ffffff',
  },

  success: {
    color: '#52c41a',
    hover: '#73d13d',
    active: '#389e0d',
    disabled: '#d9d9d9',
    light: '#f6ffed',
  },

  warning: {
    color: '#faad14',
    hover: '#ffc53d',
    active: '#d48806',
    disabled: '#d9d9d9',
    light: '#fffbe6',
  },

  error: {
    color: '#f5222d',
    hover: '#ff4d4f',
    active: '#cf1322',
    disabled: '#d9d9d9',
    light: '#fff2f0',
  },

  info: {
    color: '#1890ff',
    hover: '#40a9ff',
    active: '#096dd9',
    disabled: '#d9d9d9',
    light: '#e6f7ff',
  },
}
const lightThemeOptions: ThemeColor[] = [
  {
    label: '蓝调点缀',
    value: 'blue',
    themeColors: {
      primary100: '#3F51B5',
      primary200: '#757de8',
      primary300: '#dedeff',
      accent100: '#2196F3',
      accent200: '#003f8f',
      text100: '#333333',
      text200: '#5c5c5c',
      bg100: '#FFFFFF',
      bg200: '#f5f5f5',
      bg300: '#cccccc',
      functionalColors,
    },
  },
  {
    label: '乡村山间小屋',
    value: 'country',
    themeColors: {
      primary100: '#8B5D33',
      primary200: '#be8a5e',
      primary300: '#ffedbc',
      accent100: '#BFBFBF',
      accent200: '#616161',
      text100: '#333333',
      text200: '#5c5c5c',
      bg100: '#E5E5E5',
      bg200: '#dbdbdb',
      bg300: '#b3b3b3',
      functionalColors,
    },
  },
  {
    label: '森林绿意',
    value: 'forest',
    themeColors: {
      primary100: '#4CAF50',
      primary200: '#2a9235',
      primary300: '#0a490a',
      accent100: '#FFC107',
      accent200: '#916400',
      text100: '#333333',
      text200: '#5c5c5c',
      bg100: '#e6fbe3',
      bg200: '#dcf1d9',
      bg300: '#b4c8b1',
      functionalColors,
    },
  },
  {
    label: '绿松石',
    value: 'turquoise',
    themeColors: {
      primary100: '#26A69A',
      primary200: '#408d86',
      primary300: '#cdfaf6',
      accent100: '#80CBC4',
      accent200: '#43A49B',
      text100: '#263339',
      text200: '#728f9e',
      bg100: '#E0F2F1',
      bg200: '#D0EBEA',
      bg300: '#FFFFFF',
      functionalColors,
    },
  },
]
const darkThemeOptions: ThemeColor[] = [
  {
    label: '紫色深邃',
    value: 'purple',
    themeColors: {
      primary100: '#6A00FF',
      primary200: '#a64aff',
      primary300: '#ffb1ff',
      accent100: '#00E5FF',
      accent200: '#00829b',
      text100: '#FFFFFF',
      text200: '#e0e0e0',
      bg100: '#1A1A1A',
      bg200: '#292929',
      bg300: '#404040',
      functionalColors,
    },
  },
  {
    label: '电动城市之夜',
    value: 'electric',
    themeColors: {
      primary100: '#0085ff',
      primary200: '#69b4ff',
      primary300: '#e0ffff',
      accent100: '#006fff',
      accent200: '#e1ffff',
      text100: '#FFFFFF',
      text200: '#9e9e9e',
      bg100: '#1E1E1E',
      bg200: '#2d2d2d',
      bg300: '#454545',
      functionalColors,
    },
  },
  {
    label: '深色砖和芥末',
    value: 'brick',
    themeColors: {
      primary100: '#FFC857',
      primary200: '#deab3a',
      primary300: '#936a00',
      accent100: '#D90429',
      accent200: '#ffbfaf',
      text100: '#FFFFFF',
      text200: '#e0e0e0',
      bg100: '#2B2B2B',
      bg200: '#3b3b3b',
      bg300: '#545454',
      functionalColors,
    },
  },
  {
    label: '暗绿色的森林',
    value: 'green',
    themeColors: {
      primary100: '#8F9779',
      primary200: '#656B53',
      primary300: '#FFFFFF',
      accent100: '#B5C99E',
      accent200: '#80A15A',
      text100: '#FFFFFF',
      text200: '#b2b2b2',
      bg100: '#4B5320',
      bg200: '#474F1E',
      bg300: '#626C2A',
      functionalColors,
    },
  },
  {
    label: '深绿',
    value: 'deepGreen',
    themeColors: {
      primary100: '#1DB954',
      primary200: '#14823B',
      primary300: '#A6F1C0',
      accent100: '#FFD700',
      accent200: '#B39600',
      text100: '#FFFFFF',
      text200: '#d4d5c8',
      bg100: '#0B4F30',
      bg200: '#0A4B2E',
      bg300: '#0E673E',
      functionalColors,
    },
  },
]

interface ColorState {
  // 颜色模式
  mode: Mode

  modeOptions: ModeOptions[]
  darkMode: boolean

  // 浅色模式主题
  lightThemeValue: ThemeColor['value']
  // 深色模式主题
  darkThemeValue: ThemeColor['value']

  // 监听系统主题变化
  mediaQueryListener?: ((e: MediaQueryListEvent) => void) | null
  mediaQuery?: MediaQueryList | null
}

/* 颜色store */
export const useColorStore = defineStore('color', {
  state: (): ColorState => ({
    mode: 'light',
    modeOptions,
    darkMode: false,

    lightThemeValue: lightThemeOptions[0].value,
    darkThemeValue: darkThemeOptions[0].value,

    mediaQuery: null,
    mediaQueryListener: null,
  }),

  getters: {
    // 获取当前主题模式：mode 如果当前 mode 为 auto 则获取系统颜色模式动态计算
    getModeOptions: state => state.modeOptions,
    getMode: state => {
      return state.mode
    },
    getModeLabel: state => {
      const modeOptions = state.modeOptions
      const mode = modeOptions.find(item => item.value === state.mode) as ModeOptions
      return mode.label
    },
    isDark: state => state.darkMode,
    isLight: state => {
      const isLight =
        state.mode === 'auto' ? getSystemColorMode() === 'light' : state.mode === 'light'
      return isLight
    },
    isAuto: state => state.mode === 'auto',

    // 获取主题色选项及选中值
    getThemeOptions: state => {
      const isDark = state.darkMode
      return isDark ? darkThemeOptions : lightThemeOptions
    },
    getThemeValue: state => {
      const isDark = state.darkMode
      return isDark ? state.darkThemeValue : state.lightThemeValue
    },
    getThemeLabel: state => {
      const isDark = state.darkMode
      const themeValue = isDark ? state.darkThemeValue : state.lightThemeValue
      const themeOptions = isDark ? darkThemeOptions : lightThemeOptions
      const themeColor = themeOptions.find(item => item.value === themeValue) as ThemeColor
      return themeColor.label
    },
    getThemeColors: state => () => {
      const isDark = state.darkMode
      const themeValue = isDark ? state.darkThemeValue : state.lightThemeValue
      const themeOptions = isDark ? darkThemeOptions : lightThemeOptions
      const themeColor = themeOptions.find(item => item.value === themeValue) as ThemeColor
      return themeColor.themeColors
    },

    // 获取主题色
    getPrimary100: function () {
      const themeColors: ThemeColors = this.getThemeColors()
      return themeColors.primary100
    },
    getPrimary200: function () {
      const themeColors: ThemeColors = this.getThemeColors()
      return themeColors.primary200
    },
    getPrimary300: function () {
      const themeColors: ThemeColors = this.getThemeColors()
      return themeColors.primary300
    },

    // 获取强调色
    getAccent100: function () {
      const themeColors: ThemeColors = this.getThemeColors()
      return themeColors.accent100
    },
    getAccent200: function () {
      const themeColors: ThemeColors = this.getThemeColors()
      return themeColors.accent200
    },

    // 获取文本色
    getText100: function () {
      const themeColors: ThemeColors = this.getThemeColors()
      return themeColors.text100
    },
    getText200: function () {
      const themeColors: ThemeColors = this.getThemeColors()
      return themeColors.text200
    },

    // 获取背景色
    getBg100: function () {
      const themeColors: ThemeColors = this.getThemeColors()
      return themeColors.bg100
    },
    getBg200: function () {
      const themeColors: ThemeColors = this.getThemeColors()
      return themeColors.bg200
    },
    getBg300: function () {
      const themeColors: ThemeColors = this.getThemeColors()
      return themeColors.bg300
    },

    // 获取功能色
    getFunctionalColors: function () {
      const themeColors: ThemeColors = this.getThemeColors()
      return themeColors.functionalColors
    },
    // color
    getPrimaryColor: function () {
      const themeColors: ThemeColors = this.getThemeColors()
      return themeColors.functionalColors.primary.color
    },
    getSuccessColor: function () {
      const themeColors: ThemeColors = this.getThemeColors()
      return themeColors.functionalColors.success.color
    },
    getWarningColor: function () {
      const themeColors: ThemeColors = this.getThemeColors()
      return themeColors.functionalColors.warning.color
    },
    getErrorColor: function () {
      const themeColors: ThemeColors = this.getThemeColors()
      return themeColors.functionalColors.error.color
    },
    getInfoColor: function () {
      const themeColors: ThemeColors = this.getThemeColors()
      return themeColors.functionalColors.info.color
    },
    // hover
    getPrimaryHoverColor: function () {
      const themeColors: ThemeColors = this.getThemeColors()
      return themeColors.functionalColors.primary.hover
    },
    getSuccessHoverColor: function () {
      const themeColors: ThemeColors = this.getThemeColors()
      return themeColors.functionalColors.success.hover
    },
    getWarningHoverColor: function () {
      const themeColors: ThemeColors = this.getThemeColors()
      return themeColors.functionalColors.warning.hover
    },
    getErrorHoverColor: function () {
      const themeColors: ThemeColors = this.getThemeColors()
      return themeColors.functionalColors.error.hover
    },
    getInfoHoverColor: function () {
      const themeColors: ThemeColors = this.getThemeColors()
      return themeColors.functionalColors.info.hover
    },
    // active
    getPrimaryActiveColor: function () {
      const themeColors: ThemeColors = this.getThemeColors()
      return themeColors.functionalColors.primary.active
    },
    getSuccessActiveColor: function () {
      const themeColors: ThemeColors = this.getThemeColors()
      return themeColors.functionalColors.success.active
    },
    getWarningActiveColor: function () {
      const themeColors: ThemeColors = this.getThemeColors()
      return themeColors.functionalColors.warning.active
    },
    getErrorActiveColor: function () {
      const themeColors: ThemeColors = this.getThemeColors()
      return themeColors.functionalColors.error.active
    },
    getInfoActiveColor: function () {
      const themeColors: ThemeColors = this.getThemeColors()
      return themeColors.functionalColors.info.active
    },
    // disabled
    getPrimaryDisabledColor: function () {
      const themeColors: ThemeColors = this.getThemeColors()
      return themeColors.functionalColors.primary.disabled
    },
    getSuccessDisabledColor: function () {
      const themeColors: ThemeColors = this.getThemeColors()
      return themeColors.functionalColors.success.disabled
    },
    getWarningDisabledColor: function () {
      const themeColors: ThemeColors = this.getThemeColors()
      return themeColors.functionalColors.warning.disabled
    },
    getErrorDisabledColor: function () {
      const themeColors: ThemeColors = this.getThemeColors()
      return themeColors.functionalColors.error.disabled
    },
    getInfoDisabledColor: function () {
      const themeColors: ThemeColors = this.getThemeColors()
      return themeColors.functionalColors.info.disabled
    },
    // light
    getPrimaryLightColor: function () {
      const themeColors: ThemeColors = this.getThemeColors()
      return themeColors.functionalColors.primary.light
    },
    getSuccessLightColor: function () {
      const themeColors: ThemeColors = this.getThemeColors()
      return themeColors.functionalColors.success.light
    },
    getWarningLightColor: function () {
      const themeColors: ThemeColors = this.getThemeColors()
      return themeColors.functionalColors.warning.light
    },
    getErrorLightColor: function () {
      const themeColors: ThemeColors = this.getThemeColors()
      return themeColors.functionalColors.error.light
    },
    getInfoLightColor: function () {
      const themeColors: ThemeColors = this.getThemeColors()
      return themeColors.functionalColors.info.light
    },
  },

  actions: {
    // 自动跟随系统主题
    setupAutoModeListener() {
      this.mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')

      // 创建监听器函数
      this.mediaQueryListener = (_e: MediaQueryListEvent) => {
        this.darkMode = _e.matches
        this.setTheme(this.getThemeValue)
      }

      // 添加监听器
      this.mediaQuery.addEventListener('change', this.mediaQueryListener)
    },

    // 清理监听器
    cleanupMediaQueryListener() {
      if (this.mediaQuery && this.mediaQueryListener) {
        this.mediaQuery.removeEventListener('change', this.mediaQueryListener)
        this.mediaQuery = null
        this.mediaQueryListener = null
      }
    },

    // 设置主题模式
    setMode(mode: Mode) {
      this.cleanupMediaQueryListener()

      this.mode = mode
      this.darkMode = mode === 'auto' ? getSystemColorMode() === 'dark' : mode === 'dark'

      if (mode === 'auto') {
        this.setupAutoModeListener()
      }

      // 设置完模式后重新设置 CSS 变量
      this.setCssVariables()
    },

    // 切换主题模式（在 light 和 dark 之间切换）
    toggleMode() {
      const isDark = this.darkMode
      const newMode = isDark ? 'light' : 'dark'
      this.setMode(newMode)
    },

    // 修改主题色
    setTheme(theme: ThemeColor['value']) {
      const isDark = this.darkMode
      if (isDark) {
        this.darkThemeValue = theme
      } else {
        this.lightThemeValue = theme
      }
      this.setCssVariables()
    },

    /* 将颜色变量都存储到 css 变量中 用于全局样式 */
    setCssVariables() {
      const cssVariables: Record<string, string> = {
        [toKebabCase('primaryColor', '--')]: this.getPrimaryColor,
        [toKebabCase('successColor', '--')]: this.getSuccessColor,
        [toKebabCase('warningColor', '--')]: this.getWarningColor,
        [toKebabCase('errorColor', '--')]: this.getErrorColor,
        [toKebabCase('infoColor', '--')]: this.getInfoColor,

        [toKebabCase('primaryHoverColor', '--')]: this.getPrimaryHoverColor,
        [toKebabCase('successHoverColor', '--')]: this.getSuccessHoverColor,
        [toKebabCase('warningHoverColor', '--')]: this.getWarningHoverColor,
        [toKebabCase('errorHoverColor', '--')]: this.getErrorHoverColor,
        [toKebabCase('infoHoverColor', '--')]: this.getInfoHoverColor,

        [toKebabCase('primaryActiveColor', '--')]: this.getPrimaryActiveColor,
        [toKebabCase('successActiveColor', '--')]: this.getSuccessActiveColor,
        [toKebabCase('warningActiveColor', '--')]: this.getWarningActiveColor,
        [toKebabCase('errorActiveColor', '--')]: this.getErrorActiveColor,
        [toKebabCase('infoActiveColor', '--')]: this.getInfoActiveColor,

        [toKebabCase('primaryDisabledColor', '--')]: this.getPrimaryDisabledColor,
        [toKebabCase('successDisabledColor', '--')]: this.getSuccessDisabledColor,
        [toKebabCase('warningDisabledColor', '--')]: this.getWarningDisabledColor,
        [toKebabCase('errorDisabledColor', '--')]: this.getErrorDisabledColor,
        [toKebabCase('infoDisabledColor', '--')]: this.getInfoDisabledColor,

        [toKebabCase('primaryLightColor', '--')]: this.getPrimaryLightColor,
        [toKebabCase('successLightColor', '--')]: this.getSuccessLightColor,
        [toKebabCase('warningLightColor', '--')]: this.getWarningLightColor,
        [toKebabCase('errorLightColor', '--')]: this.getErrorLightColor,
        [toKebabCase('infoLightColor', '--')]: this.getInfoLightColor,

        [toKebabCase('primary100', '--')]: this.getPrimary100,
        [toKebabCase('primary200', '--')]: this.getPrimary200,
        [toKebabCase('primary300', '--')]: this.getPrimary300,

        [toKebabCase('accent100', '--')]: this.getAccent100,
        [toKebabCase('accent200', '--')]: this.getAccent200,

        [toKebabCase('text100', '--')]: this.getText100,
        [toKebabCase('text200', '--')]: this.getText200,

        [toKebabCase('bg100', '--')]: this.getBg100,
        [toKebabCase('bg200', '--')]: this.getBg200,
        [toKebabCase('bg300', '--')]: this.getBg300,
      }

      Object.entries(cssVariables).forEach(([key, value]) => {
        document.documentElement.style.setProperty(key, value)
      })
    },

    /* 初始化方法 */
    init() {
      this.setMode(this.mode)
    },
  },

  persist: {
    key: `${import.meta.env.VITE_PINIA_PERSIST_KEY_PREFIX}-color`,
    storage: localStorage,
  },
})

export const useColorStoreWithOut = () => {
  return useColorStore(store)
}
