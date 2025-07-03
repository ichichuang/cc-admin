/* 颜色配置 (https://aicolors.co/) */
import { applyOpacityToColor, getSystemColorMode } from '@/common'
import store from '@/stores'
import { defineStore } from 'pinia'

/* 主题模式类型 */
type Mode = 'light' | 'dark' | 'auto'
interface ModeOptions {
  label: string
  value: Mode
}

const modeOptions: ModeOptions[] = [
  { label: '亮色主题', value: 'light' },
  { label: '暗色主题', value: 'dark' },
  { label: '自动跟随系统主题', value: 'auto' },
]

/* 颜色定义 */
// 功能色具体定义
interface FunctionalColor {
  color: string // 主色
  hover: string // 悬停色
  active: string // 激活色
  disabled: string // 禁用色
  light: string // 浅色背景
}

// 背景色具体定义
interface BackgroundColorOptions {
  label: string // 背景色标签
  color: string // 背景色
  highlight: string // 背景高亮色
  text: string // 背景色文字颜色：用于当设置背景色为文字颜色时，上层的文字颜色
  textMuted: string // 背景色文字颜色置灰色：用于注释类的浅色文字颜色
}

const lightBackgroundOptions: BackgroundColorOptions[] = [
  {
    label: '白色背景',
    color: '#ffffff',
    highlight: '#fafafa',
    text: '#000000',
    textMuted: '#1a1a1a',
  },
  {
    label: '浅灰色背景',
    color: '#f5f5f5',
    highlight: '#e5e5e5',
    text: '#1a1a1a',
    textMuted: '#1a1a1a',
  },
  {
    label: '中灰色背景',
    color: '#f0f2f5',
    highlight: '#e0e0e0',
    text: '#1f1f1f',
    textMuted: '#1f1f1f',
  },
  {
    label: '浅灰色背景',
    color: '#f5f5f5',
    highlight: '#e5e5e5',
    text: '#222222',
    textMuted: '#000000',
  },
]

const darkBackgroundOptions: BackgroundColorOptions[] = [
  {
    label: '深黑色背景',
    color: '#141414',
    highlight: '#1f1f1f',
    text: '#ffffff',
    textMuted: '#f4f4f4',
  },
  {
    label: '深灰色背景',
    color: '#1f1f1f',
    highlight: '#1a1a1a',
    text: '#f4f4f4',
    textMuted: '#f8f8f8',
  },
  {
    label: '中灰色背景',
    color: '#1a1a1a',
    highlight: '#151515',
    text: '#f8f8f8',
    textMuted: '#e6e6e6',
  },
  {
    label: '浅灰色背景',
    color: '#262626',
    highlight: '#212121',
    text: '#e6e6e6',
    textMuted: '#d9d9d9',
  },
]

// 主题色具体定义
interface ThemeColor {
  label: string // 主题色标签
  color: string // 主题色
  text: string // 主题色文字颜色：用于当设置主题颜色为背景色时，上层的文字颜色
}

const lightThemeOptions: ThemeColor[] = [
  { label: '蓝色主题', color: '#1890ff', text: '#ffffff' },
  { label: '绿色主题', color: '#52c41a', text: '#ffffff' },
  { label: '黄色主题', color: '#faad14', text: '#ffffff' },
  { label: '红色主题', color: '#f5222d', text: '#ffffff' },
  { label: '紫色主题', color: '#722ed1', text: '#ffffff' },
  { label: '粉色主题', color: '#eb2f96', text: '#ffffff' },
  { label: '橙色主题', color: '#fa541c', text: '#ffffff' },
  { label: '棕色主题', color: '#a67c52', text: '#ffffff' },
  { label: '灰色主题', color: '#858585', text: '#ffffff' },
]

const darkThemeOptions: ThemeColor[] = [
  { label: '蓝色主题', color: '#1890ff', text: '#ffffff' },
  { label: '绿色主题', color: '#52c41a', text: '#ffffff' },
  { label: '黄色主题', color: '#faad14', text: '#ffffff' },
  { label: '红色主题', color: '#f5222d', text: '#ffffff' },
  { label: '紫色主题', color: '#722ed1', text: '#ffffff' },
  { label: '粉色主题', color: '#eb2f96', text: '#ffffff' },
  { label: '橙色主题', color: '#fa541c', text: '#ffffff' },
  { label: '棕色主题', color: '#a67c52', text: '#ffffff' },
  { label: '灰色主题', color: '#858585', text: '#ffffff' },
]

// 颜色变量
interface ColorVariables {
  // 功能色
  primary: FunctionalColor // 主色
  success: FunctionalColor // 成功色
  warning: FunctionalColor // 警告色
  error: FunctionalColor // 错误色
  info: FunctionalColor // 信息色

  // 主题颜色（与primary.color相同）
  theme: string
  // 主题颜色的高亮文字颜色：用于当设置主题颜色为背景色时，上层的文字颜色
  themeText: string

  // 主题色选项
  themeOptions: ThemeColor[]

  // 文字颜色：用于默认文字颜色
  text: string
  // 文字颜色置灰色：用于注释类的浅色文字颜色
  textMuted: string

  // 背景颜色：默认容器背景颜色
  background: string
  // 背景高亮色：与背景颜色相似，但是用于需要在背景色上层放的类似卡片容器的背景颜色
  backgroundHighlight: string

  // 背景色选项
  backgroundOptions: BackgroundColorOptions[]
}

interface ColorState {
  /* 主题模式配置 */
  mode: Mode
  modeOptions: ModeOptions[]

  /* 配色方案颜色配置 */
  colors: ColorVariables
}

/* colors 预设 */
// 浅色主题预设
const lightColors: ColorVariables = {
  primary: {
    color: '#1890ff',
    hover: '#40a9ff',
    active: '#096dd9',
    disabled: '#d9d9d9',
    light: '#e6f7ff',
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

  theme: '#1890ff',
  themeText: '#ffffff',
  themeOptions: lightThemeOptions,

  text: '#000000d9',
  textMuted: '#00000073',

  background: '#ffffff',
  backgroundHighlight: '#fafafa',

  backgroundOptions: lightBackgroundOptions,
}

// 深色主题预设
const darkColors: ColorVariables = {
  primary: {
    color: '#1890ff',
    hover: '#40a9ff',
    active: '#096dd9',
    disabled: '#434343',
    light: '#111b26',
  },

  success: {
    color: '#52c41a',
    hover: '#73d13d',
    active: '#389e0d',
    disabled: '#434343',
    light: '#162312',
  },

  warning: {
    color: '#faad14',
    hover: '#ffc53d',
    active: '#d48806',
    disabled: '#434343',
    light: '#2b2111',
  },

  error: {
    color: '#f5222d',
    hover: '#ff4d4f',
    active: '#cf1322',
    disabled: '#434343',
    light: '#2a1215',
  },

  info: {
    color: '#1890ff',
    hover: '#40a9ff',
    active: '#096dd9',
    disabled: '#434343',
    light: '#111b26',
  },

  theme: '#1890ff',
  themeText: '#ffffff',
  themeOptions: darkThemeOptions,

  text: '#ffffffd9',
  textMuted: '#ffffff73',

  background: '#141414',
  backgroundHighlight: '#1f1f1f',

  backgroundOptions: darkBackgroundOptions,
}

/* 颜色store */
export const useColorStore = defineStore('color', {
  state: (): ColorState => ({
    // 主题模式
    mode: 'light',
    // 主题模式选项
    modeOptions,

    // 配色方案颜色配置（默认浅色主题）
    colors: lightColors,
  }),

  getters: {
    /* 主题模式相关 */
    // 获取当前主题模式：mode 如果当前 mode 为 auto 则获取系统颜色模式动态计算
    getMode: state => {
      if (state.mode === 'auto') {
        return getSystemColorMode()
      }
      return state.mode
    },
    // 获取主题模式选项
    getModeOptions: state => state.modeOptions,
    // 获取当前是否是 dark 主题
    isDark: state => {
      if (state.mode === 'auto') {
        return getSystemColorMode() === 'dark'
      }
      return state.mode === 'dark'
    },
    // 获取当前是否是 light 主题
    isLight: state => {
      if (state.mode === 'auto') {
        return getSystemColorMode() === 'light'
      }
      return state.mode === 'light'
    },
    // 获取当前是否是 auto 主题
    isAuto: state => state.mode === 'auto',

    /* 配色方案颜色配置相关 */
    getThemeOptions: state => state.colors.themeOptions,
    getBackgroundOptions: state => state.colors.backgroundOptions,

    /* 配色方案颜色配置相关 */
    getPrimary: state => {
      if (state.mode === 'auto') {
        return getSystemColorMode() === 'dark'
          ? darkColors.primary.color
          : lightColors.primary.color
      }
      return state.colors.primary.color
    },
    getPrimaryHover: state => {
      if (state.mode === 'auto') {
        return getSystemColorMode() === 'dark'
          ? darkColors.primary.hover
          : lightColors.primary.hover
      }
      return state.colors.primary.hover
    },
    getPrimaryActive: state => {
      if (state.mode === 'auto') {
        return getSystemColorMode() === 'dark'
          ? darkColors.primary.active
          : lightColors.primary.active
      }
      return state.colors.primary.active
    },
    getPrimaryDisabled: state => {
      if (state.mode === 'auto') {
        return getSystemColorMode() === 'dark'
          ? darkColors.primary.disabled
          : lightColors.primary.disabled
      }
      return state.colors.primary.disabled
    },
    getPrimaryLight: state => {
      if (state.mode === 'auto') {
        return getSystemColorMode() === 'dark'
          ? darkColors.primary.light
          : lightColors.primary.light
      }
      return state.colors.primary.light
    },
    getSuccess: state => {
      if (state.mode === 'auto') {
        return getSystemColorMode() === 'dark'
          ? darkColors.success.color
          : lightColors.success.color
      }
      return state.colors.success.color
    },
    getSuccessHover: state => {
      if (state.mode === 'auto') {
        return getSystemColorMode() === 'dark'
          ? darkColors.success.hover
          : lightColors.success.hover
      }
      return state.colors.success.hover
    },
    getSuccessActive: state => {
      if (state.mode === 'auto') {
        return getSystemColorMode() === 'dark'
          ? darkColors.success.active
          : lightColors.success.active
      }
      return state.colors.success.active
    },
    getSuccessDisabled: state => {
      if (state.mode === 'auto') {
        return getSystemColorMode() === 'dark'
          ? darkColors.success.disabled
          : lightColors.success.disabled
      }
      return state.colors.success.disabled
    },
    getSuccessLight: state => {
      if (state.mode === 'auto') {
        return getSystemColorMode() === 'dark'
          ? darkColors.success.light
          : lightColors.success.light
      }
      return state.colors.success.light
    },
    getWarning: state => {
      if (state.mode === 'auto') {
        return getSystemColorMode() === 'dark'
          ? darkColors.warning.color
          : lightColors.warning.color
      }
      return state.colors.warning.color
    },
    getWarningHover: state => {
      if (state.mode === 'auto') {
        return getSystemColorMode() === 'dark'
          ? darkColors.warning.hover
          : lightColors.warning.hover
      }
      return state.colors.warning.hover
    },
    getWarningActive: state => {
      if (state.mode === 'auto') {
        return getSystemColorMode() === 'dark'
          ? darkColors.warning.active
          : lightColors.warning.active
      }
      return state.colors.warning.active
    },
    getWarningDisabled: state => {
      if (state.mode === 'auto') {
        return getSystemColorMode() === 'dark'
          ? darkColors.warning.disabled
          : lightColors.warning.disabled
      }
      return state.colors.warning.disabled
    },
    getWarningLight: state => {
      if (state.mode === 'auto') {
        return getSystemColorMode() === 'dark'
          ? darkColors.warning.light
          : lightColors.warning.light
      }
      return state.colors.warning.light
    },
    getError: state => {
      if (state.mode === 'auto') {
        return getSystemColorMode() === 'dark' ? darkColors.error.color : lightColors.error.color
      }
      return state.colors.error.color
    },
    getErrorHover: state => {
      if (state.mode === 'auto') {
        return getSystemColorMode() === 'dark' ? darkColors.error.hover : lightColors.error.hover
      }
      return state.colors.error.hover
    },
    getErrorActive: state => {
      if (state.mode === 'auto') {
        return getSystemColorMode() === 'dark' ? darkColors.error.active : lightColors.error.active
      }
      return state.colors.error.active
    },
    getErrorDisabled: state => {
      if (state.mode === 'auto') {
        return getSystemColorMode() === 'dark'
          ? darkColors.error.disabled
          : lightColors.error.disabled
      }
      return state.colors.error.disabled
    },
    getErrorLight: state => {
      if (state.mode === 'auto') {
        return getSystemColorMode() === 'dark' ? darkColors.error.light : lightColors.error.light
      }
      return state.colors.error.light
    },
    getInfo: state => {
      if (state.mode === 'auto') {
        return getSystemColorMode() === 'dark' ? darkColors.info.color : lightColors.info.color
      }
      return state.colors.info.color
    },
    getInfoHover: state => {
      if (state.mode === 'auto') {
        return getSystemColorMode() === 'dark' ? darkColors.info.hover : lightColors.info.hover
      }
      return state.colors.info.hover
    },
    getInfoActive: state => {
      if (state.mode === 'auto') {
        return getSystemColorMode() === 'dark' ? darkColors.info.active : lightColors.info.active
      }
      return state.colors.info.active
    },
    getInfoDisabled: state => {
      if (state.mode === 'auto') {
        return getSystemColorMode() === 'dark'
          ? darkColors.info.disabled
          : lightColors.info.disabled
      }
      return state.colors.info.disabled
    },
    getInfoLight: state => {
      if (state.mode === 'auto') {
        return getSystemColorMode() === 'dark' ? darkColors.info.light : lightColors.info.light
      }
      return state.colors.info.light
    },

    getTheme: state => {
      if (state.mode === 'auto') {
        return getSystemColorMode() === 'dark' ? darkColors.theme : lightColors.theme
      }
      return state.colors.theme
    },
    // 获取主题色透明度 opacity 0-100
    getThemeOpacity: state => {
      return (opacity: number): string => {
        const themeColor =
          state.mode === 'auto'
            ? getSystemColorMode() === 'dark'
              ? darkColors.theme
              : lightColors.theme
            : state.colors.theme
        return applyOpacityToColor(themeColor, opacity)
      }
    },
    getThemeText: state => {
      if (state.mode === 'auto') {
        return getSystemColorMode() === 'dark' ? darkColors.themeText : lightColors.themeText
      }
      return state.colors.themeText
    },
    getText: state => {
      if (state.mode === 'auto') {
        return getSystemColorMode() === 'dark' ? darkColors.text : lightColors.text
      }
      return state.colors.text
    },
    getTextMuted: state => {
      if (state.mode === 'auto') {
        return getSystemColorMode() === 'dark' ? darkColors.textMuted : lightColors.textMuted
      }
      return state.colors.textMuted
    },
    getBackground: state => {
      if (state.mode === 'auto') {
        return getSystemColorMode() === 'dark' ? darkColors.background : lightColors.background
      }
      return state.colors.background
    },
    getBackgroundHighlight: state => {
      if (state.mode === 'auto') {
        return getSystemColorMode() === 'dark'
          ? darkColors.backgroundHighlight
          : lightColors.backgroundHighlight
      }
      return state.colors.backgroundHighlight
    },
  },

  actions: {
    /* 主题模式相关 */
    // 设置主题模式
    setMode(mode: Mode) {
      this.mode = mode

      // 根据实际的主题模式设置颜色配置
      const actualMode = mode === 'auto' ? getSystemColorMode() : mode
      this.colors = actualMode === 'dark' ? { ...darkColors } : { ...lightColors }

      this.setCssVariables()
    },

    // 切换主题模式（在 light 和 dark 之间切换）
    toggleMode() {
      const newMode = this.mode === 'light' ? 'dark' : 'light'
      this.setMode(newMode)
    },

    /* 配色方案颜色配置相关 */
    // 修改主题色
    setTheme(theme: ThemeColor['label']) {
      const themeColor = this.colors.themeOptions.find(item => item.label === theme)
      if (themeColor) {
        this.colors.theme = themeColor.color
        this.colors.themeText = themeColor.text
      }
      this.setCssVariables()
    },
    // 修改背景色
    setBackground(background: BackgroundColorOptions['label']) {
      const backgroundColor = this.colors.backgroundOptions.find(item => item.label === background)
      if (backgroundColor) {
        this.colors.background = backgroundColor.color
        this.colors.backgroundHighlight = backgroundColor.highlight
        this.colors.text = backgroundColor.text
        this.colors.textMuted = backgroundColor.textMuted
      }
      this.setCssVariables()
    },

    /* 将颜色变量都存储到 css 变量中 用于全局样式 */
    setCssVariables() {
      // 不检查驼峰命名 因为 css 变量不支持驼峰命名 所以需要手动转换

      // 将驼峰命名转换为 css 变量命名 primaryColor 转换为 --primary-color
      const camelToCss = (str: string) => {
        return `--${str.replace(/([A-Z])/g, '-$1').toLowerCase()}`
      }

      const cssVariables: Record<string, string> = {
        [camelToCss('primaryColor')]: this.getPrimary,
        [camelToCss('primaryHoverColor')]: this.getPrimaryHover,
        [camelToCss('primaryActiveColor')]: this.getPrimaryActive,
        [camelToCss('primaryDisabledColor')]: this.getPrimaryDisabled,
        [camelToCss('primaryLightColor')]: this.getPrimaryLight,

        [camelToCss('successColor')]: this.getSuccess,
        [camelToCss('successHoverColor')]: this.getSuccessHover,
        [camelToCss('successActiveColor')]: this.getSuccessActive,
        [camelToCss('successDisabledColor')]: this.getSuccessDisabled,
        [camelToCss('successLightColor')]: this.getSuccessLight,

        [camelToCss('infoColor')]: this.getInfo,
        [camelToCss('infoHoverColor')]: this.getInfoHover,
        [camelToCss('infoActiveColor')]: this.getInfoActive,
        [camelToCss('infoDisabledColor')]: this.getInfoDisabled,
        [camelToCss('infoLightColor')]: this.getInfoLight,

        [camelToCss('warningColor')]: this.getWarning,
        [camelToCss('warningHoverColor')]: this.getWarningHover,
        [camelToCss('warningActiveColor')]: this.getWarningActive,
        [camelToCss('warningDisabledColor')]: this.getWarningDisabled,
        [camelToCss('warningLightColor')]: this.getWarningLight,

        [camelToCss('errorColor')]: this.getError,
        [camelToCss('errorHoverColor')]: this.getErrorHover,
        [camelToCss('errorActiveColor')]: this.getErrorActive,
        [camelToCss('errorDisabledColor')]: this.getErrorDisabled,
        [camelToCss('errorLightColor')]: this.getErrorLight,

        [camelToCss('themeColor')]: this.getTheme,
        [camelToCss('themeTextColor')]: this.getThemeText,

        [camelToCss('textColor')]: this.getText,
        [camelToCss('textMutedColor')]: this.getTextMuted,
        [camelToCss('backgroundColor')]: this.getBackground,
        [camelToCss('backgroundHighlightColor')]: this.getBackgroundHighlight,
      }
      Object.entries(cssVariables).forEach(([key, value]) => {
        document.documentElement.style.setProperty(key, value)
      })
    },

    /* 初始化方法 */
    init() {
      this.setTheme(this.colors.themeOptions[0].label)
      this.setBackground(this.colors.backgroundOptions[0].label)

      // 监听系统主题变化（如果是auto模式）
      if (this.mode === 'auto') {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')

        // 设置初始主题
        this.colors = mediaQuery.matches ? { ...darkColors } : { ...lightColors }
        this.setCssVariables()

        // 监听主题变化
        const handleThemeChange = (e: MediaQueryListEvent) => {
          if (this.mode === 'auto') {
            this.colors = e.matches ? { ...darkColors } : { ...lightColors }
            this.setCssVariables()
          }
        }

        mediaQuery.addEventListener('change', handleThemeChange)
      }
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
