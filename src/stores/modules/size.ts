/* 尺寸配置 */
import { toCamelCase } from '@/common/modules/function'
import store, { useLayoutStoreWithOut } from '@/stores'
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
  sidebarWidth: number
  // 侧边栏折叠宽度
  sidebarCollapsedWidth: number
  // 头部高度
  headerHeight: number
  // 面包屑高度
  breadcrumbHeight: number
  // 底部高度
  footerHeight: number
  // 标签页高度
  tabsHeight: number
  // 内容区域高度(不包含头部、面包屑、标签页、底部)
  contentHeight: number
  // 内容区域高度(不包含头部、底部)
  contentsHeight: number
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
  value: number
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

  // 圆角尺寸
  rounded: keyof Sizes
  roundedOptions: SizesOptions[]

  sizesLabel: Record<keyof Sizes, string>
}

// 尺寸标签
const sizesLabel: Record<keyof Sizes, string> = {
  xs: '小',
  sm: '中',
  md: '大',
  lg: '特大',
  xl: '超大',
}

/* 尺寸预设 */
// 紧凑尺寸预设
const compactSizes: SizeVariables = {
  layout: {
    sidebarWidth: 180,
    sidebarCollapsedWidth: 50,
    headerHeight: 50,
    breadcrumbHeight: 32,
    footerHeight: 30,
    tabsHeight: 32,
    contentHeight: 0,
    contentsHeight: 0,
  },
  gapOptions: [
    { label: 'xs', value: 2 },
    { label: 'sm', value: 4 },
    { label: 'md', value: 6 },
    { label: 'lg', value: 8 },
    { label: 'xl', value: 10 },
  ],
}

// 舒适尺寸预设
const comfortableSizes: SizeVariables = {
  layout: {
    sidebarWidth: 200,
    sidebarCollapsedWidth: 60,
    headerHeight: 60,
    breadcrumbHeight: 40,
    footerHeight: 40,
    tabsHeight: 40,
    contentHeight: 0,
    contentsHeight: 0,
  },
  gapOptions: [
    { label: 'xs', value: 4 },
    { label: 'sm', value: 6 },
    { label: 'md', value: 8 },
    { label: 'lg', value: 10 },
    { label: 'xl', value: 12 },
  ],
}

// 宽松尺寸预设
const looseSizes: SizeVariables = {
  layout: {
    sidebarWidth: 240,
    sidebarCollapsedWidth: 70,
    headerHeight: 70,
    breadcrumbHeight: 48,
    footerHeight: 30,
    tabsHeight: 48,
    contentHeight: 0,
    contentsHeight: 0,
  },
  gapOptions: [
    { label: 'xs', value: 6 },
    { label: 'sm', value: 8 },
    { label: 'md', value: 10 },
    { label: 'lg', value: 12 },
    { label: 'xl', value: 14 },
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

    // 圆角尺寸
    rounded: 'md',
    roundedOptions: [
      { label: 'xs', value: 4 },
      { label: 'sm', value: 6 },
      { label: 'md', value: 8 },
      { label: 'lg', value: 10 },
      { label: 'xl', value: 12 },
    ],

    // 尺寸标签
    sizesLabel,
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

    // 获取当前尺寸标签
    getSizesLabel: state => {
      return (key: keyof Sizes) => state.sizesLabel[key]
    },

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
    // 获取内容区域高度
    getContentHeight: state => state.sizes.layout.contentHeight,
    // 获取内容区域高度(不包含头部、底部)
    getContentsHeight: state => state.sizes.layout.contentsHeight,

    /* 尺寸变量配置相关 gap */
    // 获取间距尺寸
    getGap: state => state.gap,
    // 获取当前间距的具体数值
    getGapValue: state => state.gapOptions.find(option => option.label === state.gap)?.value,
    // 获取间距尺寸标签
    getGapLabel: state => state.sizesLabel[state.gap],
    // 获取间距选项
    getGapOptions: state => state.gapOptions,

    /* 尺寸变量配置相关 rounded */
    // 获取圆角尺寸
    getRounded: state => state.rounded,
    // 获取圆角尺寸的具体数值
    getRoundedValue: state =>
      state.roundedOptions.find(option => option.label === state.rounded)?.value,
    // 获取圆角尺寸标签
    getRoundedLabel: state => state.sizesLabel[state.rounded],
    // 获取圆角尺寸选项
    getRoundedOptions: state => state.roundedOptions,

    /* 获取所有尺寸变量 */
    getAllSizes: state => {
      const { size: _size, sizeOptions: _sizeOptions, ...sizes } = state
      return sizes
    },
  },

  actions: {
    /* 内容高度计算 */
    // 计算内容区域高度
    calculateContentHeight() {
      const layoutStore = useLayoutStoreWithOut()
      const screenHeight = layoutStore.getHeight

      let contentOccupiedHeight = 0 // contentHeight 占用的高度
      let contentsOccupiedHeight = 0 // contentsHeight 占用的高度

      // 如果显示头部
      if (layoutStore.getShowHeader) {
        contentOccupiedHeight += this.sizes.layout.headerHeight
        contentsOccupiedHeight += this.sizes.layout.headerHeight
      }

      // 如果显示标签页
      if (layoutStore.getShowTabs) {
        contentOccupiedHeight += this.sizes.layout.tabsHeight
        // contentsHeight 包含标签页，所以不加入 contentsOccupiedHeight
      }

      // 如果显示底部
      if (layoutStore.getShowFooter) {
        contentOccupiedHeight += this.sizes.layout.footerHeight
        contentsOccupiedHeight += this.sizes.layout.footerHeight
      }

      // 如果显示面包屑
      if (layoutStore.getShowBreadcrumb) {
        contentOccupiedHeight += this.sizes.layout.breadcrumbHeight
        // contentsHeight 包含面包屑，所以不加入 contentsOccupiedHeight
      }

      // 计算两种内容高度
      this.sizes.layout.contentHeight = screenHeight - contentOccupiedHeight
      this.sizes.layout.contentsHeight = screenHeight - contentsOccupiedHeight
    },

    // 更新内容高度（供外部调用）
    updateContentHeight() {
      this.calculateContentHeight()
      // 更新 CSS 变量
      document.documentElement.style.setProperty(
        toCamelCase('contentHeight', '--'),
        this.sizes.layout.contentHeight + 'px'
      )
      document.documentElement.style.setProperty(
        toCamelCase('contentsHeight', '--'),
        this.sizes.layout.contentsHeight + 'px'
      )
    },

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
    // 设置圆角尺寸
    setRounded(rounded: keyof Sizes) {
      this.rounded = rounded
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

    setCssVariables() {
      // 重新计算内容高度
      this.calculateContentHeight()

      const cssVariables: Record<string, string> = {
        // 布局尺寸变量
        [toCamelCase('sidebarWidth', '--')]: this.getSidebarWidth + 'px',
        [toCamelCase('sidebarCollapsedWidth', '--')]: this.getSidebarCollapsedWidth + 'px',
        [toCamelCase('headerHeight', '--')]: this.getHeaderHeight + 'px',
        [toCamelCase('breadcrumbHeight', '--')]: this.getBreadcrumbHeight + 'px',
        [toCamelCase('footerHeight', '--')]: this.getFooterHeight + 'px',
        [toCamelCase('tabsHeight', '--')]: this.getTabsHeight + 'px',
        [toCamelCase('contentHeight', '--')]: this.sizes.layout.contentHeight + 'px',
        [toCamelCase('contentsHeight', '--')]: this.sizes.layout.contentsHeight + 'px',

        // 间距变量
        [toCamelCase('gap', '--')]: this.getGapValue + 'px',
        [toCamelCase('gaps', '--')]: (this.getGapValue ? this.getGapValue / 2 : 0) + 'px',

        // 圆角变量
        [toCamelCase('rounded', '--')]: this.getRoundedValue + 'px',
      }
      Object.entries(cssVariables).forEach(([key, value]) => {
        document.documentElement.style.setProperty(key, value)
      })
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
