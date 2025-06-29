/**
 * 主题系统相关的 TypeScript 类型定义
 * 统一管理所有主题相关的接口和类型
 */

/**
 * 功能色定义接口
 * 用于定义主题中的功能性颜色（primary、success、warning、error、info）
 */
export interface FunctionalColor {
  color: string // 主色
  hover: string // 悬停色
  active: string // 激活色
  disabled: string // 禁用色
  light: string // 浅色背景
}

/**
 * 颜色变量定义接口
 * 定义主题中所有颜色相关的变量
 */
export interface ColorVariables {
  // 功能色
  primary: FunctionalColor // 主色
  success: FunctionalColor // 成功色
  warning: FunctionalColor // 警告色
  error: FunctionalColor // 错误色
  info: FunctionalColor // 信息色

  // 主题颜色（与primary.color相同）
  themeColor: string
  // 主题颜色的高亮文字颜色：用于当设置主题颜色为背景色时，上层的文字颜色
  themeTextColor: string

  // 文字颜色：用于默认文字颜色
  textColor: string
  // 文字颜色置灰色：用于注释类的浅色文字颜色
  textMutedColor: string

  // 背景颜色：默认容器背景颜色
  backgroundColor: string
  // 背景高亮色：与背景颜色相似，但是用于需要在背景色上层放的类似卡片容器的背景颜色
  backgroundHighlightColor: string
}

/**
 * 尺寸变量定义接口
 * 定义主题中所有尺寸相关的变量
 */
export interface SizeVariables {
  // 布局相关尺寸
  sidebarWidth: string // 侧边栏宽度
  sidebarCollapsedWidth: string // 侧边栏收起时宽度
  headerHeight: string // 头部高度
  breadcrumbHeight: string // 面包屑高度
  footerHeight: string // 底部高度
  tabsHeight: string // 标签页高度

  // 设计系统 - 间距
  gapXs: string // 超小间距 4px
  gapSm: string // 小间距 8px
  gapMd: string // 中等间距 16px
  gapLg: string // 大间距 24px
  gapXl: string // 超大间距 32px

  // 设计系统 - 圆角
  radiusXs: string // 超小圆角 2px
  radiusSm: string // 小圆角 4px
  radiusMd: string // 中等圆角 6px
  radiusLg: string // 大圆角 8px
  radiusXl: string // 超大圆角 12px
  radiusRound: string // 完全圆角 50%
}

/**
 * 主题模式类型:
 * light: 亮色主题
 * dark: 暗色主题
 * auto: 自动跟随系统主题
 */
export type ThemeMode = 'light' | 'dark' | 'auto'

/**
 * 尺寸选项类型:
 * compact: 紧凑
 * default: 默认
 * comfortable: 舒适
 */
export type SizeOption = 'compact' | 'default' | 'comfortable'

/**
 * 尺寸预设接口
 * 定义不同尺寸档位的预设配置
 */
export interface SizePreset {
  name: SizeOption // 预设名称
  label: string // 显示标签
  sizes: SizeVariables // 尺寸变量
}

/**
 * 预设主题接口
 * 定义主题预设的结构
 */
export interface ThemePreset {
  name: string // 预设名称
  label: string // 显示标签
  colors: ColorVariables // 颜色变量
}

/**
 * 主题store状态接口
 * 定义主题store的完整状态结构
 */
export interface ThemeState {
  // 当前主题模式
  mode: ThemeMode
  // 当前颜色变量
  colors: ColorVariables
  // 当前尺寸变量
  sizes: SizeVariables
  // 当前尺寸选项
  sizeOption: SizeOption
  // 是否初始化完成
  initialized: boolean
}

/**
 * 主题配置选项接口
 * 用于配置主题系统的初始化选项
 */
export interface ThemeConfig {
  // 默认主题模式
  defaultMode?: ThemeMode
  // 默认尺寸选项
  defaultSizeOption?: SizeOption
  // 是否启用持久化
  enablePersistence?: boolean
  // 存储键名前缀
  storageKeyPrefix?: string
}

/**
 * 主题更新选项接口
 * 用于批量更新主题配置
 */
export interface ThemeUpdateOptions {
  // 颜色更新
  colors?: Partial<ColorVariables>
  // 尺寸更新
  sizes?: Partial<SizeVariables>
  // 模式更新
  mode?: ThemeMode
  // 尺寸选项更新
  sizeOption?: SizeOption
  // 是否立即应用
  immediate?: boolean
}

/**
 * 主题事件类型
 */
export type ThemeEventType = 'mode-change' | 'color-change' | 'size-change' | 'preset-change'

/**
 * 主题事件接口
 */
export interface ThemeEvent {
  type: ThemeEventType
  data: any
  timestamp: number
}

/**
 * 主题监听器类型
 */
export type ThemeListener = (event: ThemeEvent) => void
