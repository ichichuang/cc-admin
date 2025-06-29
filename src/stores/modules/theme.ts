import type {
  ColorVariables,
  FunctionalColor,
  SizeOption,
  SizePreset,
  SizeVariables,
  ThemeMode,
  ThemePreset,
} from '@/stores/types/theme'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

// 浅色主题预设
const lightTheme: ColorVariables = {
  // 功能色
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

  // 主题颜色（与primary.color相同）
  themeColor: '#1890ff',
  // 主题颜色的高亮文字颜色
  themeTextColor: '#ffffff',

  // 文字颜色
  textColor: '#000000d9',
  // 文字颜色置灰色
  textMutedColor: '#00000073',

  // 背景颜色
  backgroundColor: '#ffffff',
  // 背景高亮色
  backgroundHighlightColor: '#fafafa',
}

// 深色主题预设
const darkTheme: ColorVariables = {
  // 功能色
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

  // 主题颜色（与primary.color相同）
  themeColor: '#1890ff',
  // 主题颜色的高亮文字颜色
  themeTextColor: '#ffffff',

  // 文字颜色
  textColor: '#ffffffd9',
  // 文字颜色置灰色
  textMutedColor: '#ffffff73',

  // 背景颜色
  backgroundColor: '#141414',
  // 背景高亮色
  backgroundHighlightColor: '#1f1f1f',
}

// 默认尺寸变量
const defaultSizes: SizeVariables = {
  // 布局相关尺寸
  sidebarWidth: '200px',
  sidebarCollapsedWidth: '60px',
  headerHeight: '60px',
  breadcrumbHeight: '40px',
  footerHeight: '60px',
  tabsHeight: '40px',

  // 设计系统 - 间距
  gapXs: '4px',
  gapSm: '8px',
  gapMd: '16px',
  gapLg: '24px',
  gapXl: '32px',

  // 设计系统 - 圆角
  radiusXs: '2px',
  radiusSm: '4px',
  radiusMd: '6px',
  radiusLg: '8px',
  radiusXl: '12px',
  radiusRound: '50%',
}

// 紧凑尺寸变量
const compactSizes: SizeVariables = {
  // 布局相关尺寸
  sidebarWidth: '180px',
  sidebarCollapsedWidth: '50px',
  headerHeight: '50px',
  breadcrumbHeight: '32px',
  footerHeight: '50px',
  tabsHeight: '32px',

  // 设计系统 - 间距
  gapXs: '2px',
  gapSm: '6px',
  gapMd: '12px',
  gapLg: '18px',
  gapXl: '24px',

  // 设计系统 - 圆角
  radiusXs: '1px',
  radiusSm: '3px',
  radiusMd: '4px',
  radiusLg: '6px',
  radiusXl: '8px',
  radiusRound: '50%',
}

// 舒适尺寸变量
const comfortableSizes: SizeVariables = {
  // 布局相关尺寸
  sidebarWidth: '240px',
  sidebarCollapsedWidth: '70px',
  headerHeight: '70px',
  breadcrumbHeight: '48px',
  footerHeight: '70px',
  tabsHeight: '48px',

  // 设计系统 - 间距
  gapXs: '6px',
  gapSm: '12px',
  gapMd: '20px',
  gapLg: '30px',
  gapXl: '40px',

  // 设计系统 - 圆角
  radiusXs: '3px',
  radiusSm: '6px',
  radiusMd: '8px',
  radiusLg: '12px',
  radiusXl: '16px',
  radiusRound: '50%',
}

// 尺寸预设列表
export const sizePresets: SizePreset[] = [
  { name: 'compact', label: '紧凑', sizes: compactSizes },
  { name: 'default', label: '默认', sizes: defaultSizes },
  { name: 'comfortable', label: '舒适', sizes: comfortableSizes },
]

// 主题预设列表
export const themePresets: ThemePreset[] = [
  { name: 'light', label: '浅色主题', colors: lightTheme },
  { name: 'dark', label: '深色主题', colors: darkTheme },
]

export const useThemeStore = defineStore(
  'theme',
  () => {
    // 当前主题模式
    const mode = ref<ThemeMode>('light')

    // 当前颜色变量
    const colors = ref<ColorVariables>({ ...lightTheme })

    // 当前尺寸变量
    const sizes = ref<SizeVariables>({ ...defaultSizes })

    // 当前选中的尺寸选项
    const currentSizeOption = ref<SizeOption>('default')

    // 自定义主题名称
    const customThemeName = ref<string>('')

    // 是否为深色模式
    const isDark = computed(() => mode.value === 'dark')

    // 当前主题预设
    const currentPreset = computed(() => {
      return themePresets.find(preset => preset.name === mode.value) || themePresets[0]
    })

    // 当前尺寸预设
    const currentSizePreset = computed(() => {
      return sizePresets.find(preset => preset.name === currentSizeOption.value) || sizePresets[1]
    })

    /**
     * 设置CSS变量到根元素
     */
    const setCSSVariable = (name: string, value: string) => {
      document.documentElement.style.setProperty(`--${name}`, value)
    }

    /**
     * 批量设置CSS变量
     */
    const setCSSVariables = (variables: Record<string, string>) => {
      Object.entries(variables).forEach(([name, value]) => {
        setCSSVariable(name, value)
      })
    }

    /**
     * 应用颜色变量到CSS
     */
    const applyColorVariables = (colorVars: ColorVariables) => {
      const cssVars: Record<string, string> = {}

      // 功能色 - primary
      cssVars['theme-primary-color'] = colorVars.primary.color
      cssVars['theme-primary-hover'] = colorVars.primary.hover
      cssVars['theme-primary-active'] = colorVars.primary.active
      cssVars['theme-primary-disabled'] = colorVars.primary.disabled
      cssVars['theme-primary-light'] = colorVars.primary.light

      // 功能色 - success
      cssVars['theme-success-color'] = colorVars.success.color
      cssVars['theme-success-hover'] = colorVars.success.hover
      cssVars['theme-success-active'] = colorVars.success.active
      cssVars['theme-success-disabled'] = colorVars.success.disabled
      cssVars['theme-success-light'] = colorVars.success.light

      // 功能色 - warning
      cssVars['theme-warning-color'] = colorVars.warning.color
      cssVars['theme-warning-hover'] = colorVars.warning.hover
      cssVars['theme-warning-active'] = colorVars.warning.active
      cssVars['theme-warning-disabled'] = colorVars.warning.disabled
      cssVars['theme-warning-light'] = colorVars.warning.light

      // 功能色 - error
      cssVars['theme-error-color'] = colorVars.error.color
      cssVars['theme-error-hover'] = colorVars.error.hover
      cssVars['theme-error-active'] = colorVars.error.active
      cssVars['theme-error-disabled'] = colorVars.error.disabled
      cssVars['theme-error-light'] = colorVars.error.light

      // 功能色 - info
      cssVars['theme-info-color'] = colorVars.info.color
      cssVars['theme-info-hover'] = colorVars.info.hover
      cssVars['theme-info-active'] = colorVars.info.active
      cssVars['theme-info-disabled'] = colorVars.info.disabled
      cssVars['theme-info-light'] = colorVars.info.light

      // 主题相关颜色
      cssVars['theme-color'] = colorVars.themeColor
      cssVars['theme-text-color'] = colorVars.themeTextColor

      // 文字颜色
      cssVars['text-color'] = colorVars.textColor
      cssVars['text-muted-color'] = colorVars.textMutedColor

      // 背景颜色
      cssVars['background-color'] = colorVars.backgroundColor
      cssVars['background-highlight-color'] = colorVars.backgroundHighlightColor

      setCSSVariables(cssVars)
    }

    /**
     * 应用尺寸变量到CSS
     */
    const applySizeVariables = (sizeVars: SizeVariables) => {
      const cssVars: Record<string, string> = {}

      // 布局相关尺寸
      cssVars['sidebar-width'] = sizeVars.sidebarWidth
      cssVars['sidebar-collapsed-width'] = sizeVars.sidebarCollapsedWidth
      cssVars['header-height'] = sizeVars.headerHeight
      cssVars['breadcrumb-height'] = sizeVars.breadcrumbHeight
      cssVars['footer-height'] = sizeVars.footerHeight
      cssVars['tabs-height'] = sizeVars.tabsHeight

      // 设计系统 - 间距
      cssVars['gap-xs'] = sizeVars.gapXs
      cssVars['gap-sm'] = sizeVars.gapSm
      cssVars['gap-md'] = sizeVars.gapMd
      cssVars['gap-lg'] = sizeVars.gapLg
      cssVars['gap-xl'] = sizeVars.gapXl

      // 设计系统 - 圆角
      cssVars['radius-xs'] = sizeVars.radiusXs
      cssVars['radius-sm'] = sizeVars.radiusSm
      cssVars['radius-md'] = sizeVars.radiusMd
      cssVars['radius-lg'] = sizeVars.radiusLg
      cssVars['radius-xl'] = sizeVars.radiusXl
      cssVars['radius-round'] = sizeVars.radiusRound

      setCSSVariables(cssVars)
    }

    /**
     * 设置主题模式
     */
    const setThemeMode = (newMode: ThemeMode) => {
      mode.value = newMode

      if (newMode === 'light') {
        colors.value = { ...lightTheme }
      } else if (newMode === 'dark') {
        colors.value = { ...darkTheme }
      }

      applyColorVariables(colors.value)

      // 更新 body 的 data 属性，便于其他地方使用
      document.body.setAttribute('data-theme', newMode)
    }

    /**
     * 切换主题模式
     */
    const toggleTheme = () => {
      setThemeMode(mode.value === 'light' ? 'dark' : 'light')
    }

    /**
     * 更新颜色变量
     */
    const updateColors = (newColors: Partial<ColorVariables>) => {
      colors.value = { ...colors.value, ...newColors }

      // 如果更新了primary功能色，同时更新主题颜色
      if (newColors.primary?.color) {
        colors.value.themeColor = newColors.primary.color
      }

      applyColorVariables(colors.value)
    }

    /**
     * 更新功能色
     */
    const updateFunctionalColor = (
      colorType: keyof Pick<ColorVariables, 'primary' | 'success' | 'warning' | 'error' | 'info'>,
      newColor: Partial<FunctionalColor>
    ) => {
      colors.value[colorType] = { ...colors.value[colorType], ...newColor }

      // 如果更新的是primary色，同时更新主题颜色
      if (colorType === 'primary' && newColor.color) {
        colors.value.themeColor = newColor.color
      }

      applyColorVariables(colors.value)
    }

    /**
     * 更新尺寸变量
     */
    const updateSizes = (newSizes: Partial<SizeVariables>) => {
      sizes.value = { ...sizes.value, ...newSizes }
      applySizeVariables(sizes.value)
    }

    /**
     * 设置尺寸选项
     */
    const setSizeOption = (option: SizeOption) => {
      currentSizeOption.value = option
      const preset = sizePresets.find(p => p.name === option)
      if (preset) {
        sizes.value = { ...preset.sizes }
        applySizeVariables(sizes.value)
      }
    }

    /**
     * 应用尺寸预设
     */
    const applySizePreset = (presetName: SizeOption) => {
      setSizeOption(presetName)
    }

    /**
     * 重置为默认主题
     */
    const resetToDefault = () => {
      setThemeMode('light')
      setSizeOption('default')
      customThemeName.value = ''
    }

    /**
     * 应用主题预设
     */
    const applyPreset = (presetName: string) => {
      const preset = themePresets.find(p => p.name === presetName)
      if (preset) {
        mode.value = presetName as ThemeMode
        colors.value = { ...preset.colors }
        applyColorVariables(colors.value)
        document.body.setAttribute('data-theme', presetName)
      }
    }

    /**
     * 保存自定义主题
     */
    const saveCustomTheme = (name: string) => {
      customThemeName.value = name
      // 这里可以扩展保存到本地存储或服务器
    }

    /**
     * 初始化主题
     */
    const initTheme = () => {
      applyColorVariables(colors.value)
      applySizeVariables(sizes.value)
      document.body.setAttribute('data-theme', mode.value)

      // 监听系统主题变化（如果是auto模式）
      if (mode.value === 'auto') {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
        setThemeMode(mediaQuery.matches ? 'dark' : 'light')

        mediaQuery.addEventListener('change', e => {
          if (mode.value === 'auto') {
            setThemeMode(e.matches ? 'dark' : 'light')
          }
        })
      }
    }

    return {
      // 状态
      mode,
      colors,
      sizes,
      currentSizeOption,
      customThemeName,

      // 计算属性
      isDark,
      currentPreset,
      currentSizePreset,

      // 方法
      setThemeMode,
      toggleTheme,
      updateColors,
      updateFunctionalColor,
      updateSizes,
      setSizeOption,
      applySizePreset,
      resetToDefault,
      applyPreset,
      saveCustomTheme,
      initTheme,
      setCSSVariable,
      setCSSVariables,
    }
  },
  {
    persist: {
      key: 'theme-store',
      storage: localStorage,
    },
  }
)
