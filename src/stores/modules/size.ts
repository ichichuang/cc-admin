/* 尺寸配置 */
import store from '@/stores'
import { defineStore } from 'pinia'

/* 尺寸模式类型 宽松尺寸 > 舒适尺寸 > 紧凑尺寸 */
export type SizeOption = 'compact' | 'comfortable' | 'loose'

interface SizeOptionConfig {
  label: string
  value: SizeOption
}

const sizeOptions: SizeOptionConfig[] = [
  { label: '紧凑尺寸', value: 'compact' },
  { label: '舒适尺寸', value: 'comfortable' },
  { label: '宽松尺寸', value: 'loose' },
]

/* 尺寸定义 */
// 布局尺寸具体定义
interface LayoutSizes {
  // 侧边栏宽度
  sidebarWidth: string
  // 侧边栏折叠宽度
  sidebarCollapsedWidth: string
  // 头部高度
  headerHeight: string
  // 面包屑高度
  breadcrumbHeight: string
  // 底部高度
  footerHeight: string
  // 标签页高度
  tabsHeight: string
}

// 间距具体定义
type Sizes = {
  xs: string
  sm: string
  md: string
  lg: string
  xl: string
}

interface SizesOptions {
  label: keyof Sizes
  value: string
}

// 尺寸变量
interface SizeVariables {
  // 布局尺寸
  layout: LayoutSizes
  // 间距尺寸
  gapOptions: SizesOptions[]
}

interface SizeState {
  /* 尺寸模式配置 */
  size: SizeOption
  sizeOptions: SizeOptionConfig[]

  /* 尺寸变量配置 */
  sizes: SizeVariables

  gap: keyof Sizes
  gapOptions: SizesOptions[]
}

/* 尺寸预设 */
// 紧凑尺寸预设
const compactSizes: SizeVariables = {
  layout: {
    sidebarWidth: '180px',
    sidebarCollapsedWidth: '50px',
    headerHeight: '50px',
    breadcrumbHeight: '32px',
    footerHeight: '50px',
    tabsHeight: '32px',
  },
  gapOptions: [
    { label: 'xs', value: '2px' },
    { label: 'sm', value: '4px' },
    { label: 'md', value: '8px' },
    { label: 'lg', value: '12px' },
    { label: 'xl', value: '16px' },
  ],
}

// 舒适尺寸预设
const comfortableSizes: SizeVariables = {
  layout: {
    sidebarWidth: '200px',
    sidebarCollapsedWidth: '60px',
    headerHeight: '60px',
    breadcrumbHeight: '40px',
    footerHeight: '60px',
    tabsHeight: '40px',
  },
  gapOptions: [
    { label: 'xs', value: '4px' },
    { label: 'sm', value: '8px' },
    { label: 'md', value: '12px' },
    { label: 'lg', value: '16px' },
    { label: 'xl', value: '20px' },
  ],
}

// 宽松尺寸预设
const looseSizes: SizeVariables = {
  layout: {
    sidebarWidth: '240px',
    sidebarCollapsedWidth: '70px',
    headerHeight: '70px',
    breadcrumbHeight: '48px',
    footerHeight: '70px',
    tabsHeight: '48px',
  },
  gapOptions: [
    { label: 'xs', value: '6px' },
    { label: 'sm', value: '12px' },
    { label: 'md', value: '20px' },
    { label: 'lg', value: '28px' },
    { label: 'xl', value: '36px' },
  ],
}

/* 尺寸store */
export const useSizeStore = defineStore('size', {
  state: (): SizeState => ({
    // 尺寸模式
    size: 'comfortable',
    sizeOptions,

    // 尺寸变量配置（默认舒适尺寸）
    sizes: comfortableSizes,

    // 默认舒适间隔尺寸
    gap: 'md',
    gapOptions: comfortableSizes.gapOptions,
  }),

  getters: {
    /* 尺寸模式相关 */
    // 获取当前尺寸模式
    getSize: state => state.size,
    // 获取尺寸模式选项
    getSizeOptions: state => state.sizeOptions,
    // 获取当前是否是紧凑模式
    isCompact: state => state.size === 'compact',
    // 获取当前是否是舒适模式
    isComfortable: state => state.size === 'comfortable',
    // 获取当前是否是宽松模式
    isLoose: state => state.size === 'loose',

    /* 尺寸变量配置相关 layout */
    // 获取侧边栏宽度
    getSidebarWidth: state => state.sizes.layout.sidebarWidth,
    // 获取侧边栏折叠宽度
    getSidebarCollapsedWidth: state => state.sizes.layout.sidebarCollapsedWidth,
    // 获取头部高度
    getHeaderHeight: state => state.sizes.layout.headerHeight,
    // 获取面包屑高度
    getBreadcrumbHeight: state => state.sizes.layout.breadcrumbHeight,
    // 获取底部高度
    getFooterHeight: state => state.sizes.layout.footerHeight,
    // 获取标签页高度
    getTabsHeight: state => state.sizes.layout.tabsHeight,

    /* 尺寸变量配置相关 gap */
    // 获取间距尺寸
    getGap: state => state.gap,
    // 获取当前间距的具体数值
    getGapValue: state =>
      state.gapOptions.find(option => option.label === state.gap)?.value || '12px',
    // 获取间距选项
    getGapOptions: state => state.gapOptions,

    /* 获取所有尺寸变量 */
    getAllSizes: state => {
      const { size: _size, sizeOptions: _sizeOptions, ...sizes } = state
      return sizes
    },
  },

  actions: {
    /* 尺寸模式相关 */
    // 设置尺寸模式
    setSize(size: SizeOption) {
      this.size = size

      // 应用对应的尺寸预设
      if (size === 'compact') {
        this.sizes = { ...compactSizes }
        this.gap = 'sm'
      } else if (size === 'comfortable') {
        this.sizes = { ...comfortableSizes }
        this.gap = 'md'
      } else if (size === 'loose') {
        this.sizes = { ...looseSizes }
        this.gap = 'lg'
      }

      this.gapOptions = this.sizes.gapOptions
      this.setCssVariables()
    },

    /* 尺寸变量配置相关 gap */
    // 设置间距尺寸
    setGap(gap: keyof Sizes) {
      this.gap = gap
      this.setCssVariables()
    },

    /* 批量设置方法 */
    updateLayout(layout: Partial<LayoutSizes>) {
      Object.assign(this.sizes.layout, layout)
      this.setCssVariables()
    },

    updateGapOptions(gapOptions: Partial<SizesOptions>[]) {
      gapOptions.forEach(gap => {
        const existingGap = this.gapOptions.find(option => option.label === gap.label)
        if (existingGap && gap.value) {
          existingGap.value = gap.value
        }
      })
      this.setCssVariables()
    },

    /* 重置方法 */
    resetToDefault() {
      this.setSize('comfortable')
    },

    resetSizes() {
      this.sizes = { ...comfortableSizes }
      this.gap = 'md'
      this.gapOptions = this.sizes.gapOptions
      this.setCssVariables()
    },

    /* CSS变量应用方法 */
    setCSSVariable(name: string, value: string) {
      document.documentElement.style.setProperty(`--${name}`, value)
    },

    setCSSVariables(variables: Record<string, string>) {
      Object.entries(variables).forEach(([name, value]) => {
        this.setCSSVariable(name, value)
      })
    },

    setCssVariables() {
      // 将驼峰命名转换为 css 变量命名
      const camelToCss = (str: string) => {
        return `--${str.replace(/([A-Z])/g, '-$1').toLowerCase()}`
      }

      const cssVariables: Record<string, string> = {
        // 布局尺寸变量
        [camelToCss('sidebarWidth')]: this.getSidebarWidth,
        [camelToCss('sidebarCollapsedWidth')]: this.getSidebarCollapsedWidth,
        [camelToCss('headerHeight')]: this.getHeaderHeight,
        [camelToCss('breadcrumbHeight')]: this.getBreadcrumbHeight,
        [camelToCss('footerHeight')]: this.getFooterHeight,
        [camelToCss('tabsHeight')]: this.getTabsHeight,

        // 间距变量
        [camelToCss('gap')]: this.getGapValue,
      }

      this.setCSSVariables(cssVariables)
    },

    /* 初始化方法 */
    init() {
      this.setSize(this.size)
    },
  },

  persist: {
    key: `${import.meta.env.VITE_PINIA_PERSIST_KEY_PREFIX}-size`,
    storage: localStorage,
  },
})

export const useSizeStoreWithOut = () => {
  return useSizeStore(store)
}
