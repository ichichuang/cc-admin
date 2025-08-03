/**
 * @copyright Copyright (c) 2025 chichuang
 * @license MIT
 * @description cc-admin 企业级后台管理框架 - 状态管理
 * 本文件为 chichuang 原创，禁止擅自删除署名或用于商业用途。
 */

/* 尺寸配置 */
import { cloneDeep, toKebabCase } from '@/common'
import store, { useLayoutStoreWithOut } from '@/stores'
import { env } from '@/utils/env'
import { defineStore } from 'pinia'

/* 尺寸模式类型 宽松尺寸 > 舒适尺寸 > 紧凑尺寸 */
export type Size = 'compact' | 'comfortable' | 'loose'
export interface SizeOptions {
  label: string
  value: Size
}

/* 尺寸定义 */
type Gap = [
  {
    label: '小'
    key: 'sm'
  },
  {
    label: '中'
    key: 'md'
  },
  {
    label: '大'
    key: 'lg'
  },
]
export interface GapOptions {
  label: Gap[number]['label']
  key: Gap[number]['key']
  value: number
}
type Rounded = [
  {
    label: '尖锐'
    key: 'sharp'
  },
  {
    label: '平滑'
    key: 'smooth'
  },
  {
    label: '圆滑'
    key: 'round'
  },
  {
    label: '圆润'
    key: 'soft'
  },
]
export interface RoundedOptions {
  label: Rounded[number]['label']
  key: Rounded[number]['key']
  value: number
}
interface Layout {
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
interface SizeVariables {
  layout: Layout
  gapOptions: GapOptions[]
}

/* 预设 */
const sizeOptions: SizeOptions[] = [
  { label: '紧凑尺寸', value: 'compact' },
  { label: '舒适尺寸', value: 'comfortable' },
  { label: '宽松尺寸', value: 'loose' },
]

// 紧凑尺寸预设
const compactSizes: SizeVariables = {
  layout: {
    sidebarWidth: 200,
    sidebarCollapsedWidth: 60,
    headerHeight: 50,
    breadcrumbHeight: 28,
    footerHeight: 28,
    tabsHeight: 40,
    contentHeight: 0,
    contentsHeight: 0,
  },
  gapOptions: [
    { label: '小', key: 'sm', value: 4 },
    { label: '中', key: 'md', value: 6 },
    { label: '大', key: 'lg', value: 10 },
  ],
}

// 舒适尺寸预设
const comfortableSizes: SizeVariables = {
  layout: {
    sidebarWidth: 250,
    sidebarCollapsedWidth: 80,
    headerHeight: 60,
    breadcrumbHeight: 32,
    footerHeight: 32,
    tabsHeight: 44,
    contentHeight: 0,
    contentsHeight: 0,
  },
  gapOptions: [
    { label: '小', key: 'sm', value: 6 },
    { label: '中', key: 'md', value: 8 },
    { label: '大', key: 'lg', value: 12 },
  ],
}

// 宽松尺寸预设
const looseSizes: SizeVariables = {
  layout: {
    sidebarWidth: 280,
    sidebarCollapsedWidth: 90,
    headerHeight: 70,
    breadcrumbHeight: 40,
    footerHeight: 32,
    tabsHeight: 48,
    contentHeight: 0,
    contentsHeight: 0,
  },
  gapOptions: [
    { label: '小', key: 'sm', value: 8 },
    { label: '中', key: 'md', value: 10 },
    { label: '大', key: 'lg', value: 14 },
  ],
}

interface SizeState {
  size: SizeOptions['value']
  sizeOptions: SizeOptions[]

  sizes: SizeVariables

  gap: GapOptions['key']
  rounded: RoundedOptions['key']
  roundedOptions: RoundedOptions[]
}

// 创建尺寸预设映射表
const sizePresetsMap: Record<Size, SizeVariables> = {
  compact: compactSizes,
  comfortable: comfortableSizes,
  loose: looseSizes,
}

export const useSizeStore = defineStore('size', {
  state: (): SizeState => ({
    size: 'comfortable',
    sizeOptions,

    sizes: cloneDeep(comfortableSizes),

    gap: 'md',
    rounded: 'smooth',
    roundedOptions: [
      { label: '尖锐', key: 'sharp', value: 0 },
      { label: '平滑', key: 'smooth', value: 6 },
      { label: '圆滑', key: 'round', value: 12 },
      { label: '圆润', key: 'soft', value: 24 },
    ],
  }),

  getters: {
    // 获取尺寸模式
    isCompact: state => state.size === 'compact',
    isComfortable: state => state.size === 'comfortable',
    isLoose: state => state.size === 'loose',
    getSizeOptions: state => state.sizeOptions,
    getSize: state => state.size,
    getSizeLabel: state => state.sizeOptions.find(option => option.value === state.size)?.label,

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
    getGap: state => {
      const gapOptions = state.sizes.gapOptions
      const gap = gapOptions.find(option => option.key === state.gap) as GapOptions
      return gap.key
    },
    // 获取当前间距的具体数值
    getGapValue: state => state.sizes.gapOptions.find(option => option.key === state.gap)?.value,
    // 获取间距尺寸标签
    getGapLabel: state => state.sizes.gapOptions.find(option => option.key === state.gap)?.label,
    // 获取间距选项
    getGapOptions: state => state.sizes.gapOptions,

    /* 尺寸变量配置相关 rounded */
    // 获取圆角尺寸
    getRounded: state => state.rounded,
    // 获取圆角尺寸的具体数值
    getRoundedValue: state =>
      state.roundedOptions.find(option => option.key === state.rounded)?.value,
    // 获取圆角尺寸标签
    getRoundedLabel: state =>
      state.roundedOptions.find(option => option.key === state.rounded)?.label,
    // 获取圆角尺寸选项
    getRoundedOptions: state => state.roundedOptions,
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
        toKebabCase('contentHeight', '--'),
        this.sizes.layout.contentHeight + 'px'
      )
      document.documentElement.style.setProperty(
        toKebabCase('contentsHeight', '--'),
        this.sizes.layout.contentsHeight + 'px'
      )
    },

    /* 尺寸模式相关 */
    // 设置尺寸模式
    setSize(size: SizeOptions['value']) {
      if (this.size === size) {
        return
      }
      this.size = size

      // 使用深拷贝确保不会互相影响
      const targetSizePreset = sizePresetsMap[size]
      if (!targetSizePreset) {
        console.error(`Invalid size preset: ${size}`)
        return
      }

      this.sizes = cloneDeep(targetSizePreset)

      // 立即更新 CSS 变量
      this.setCssVariables()
    },

    /* 尺寸变量配置相关 gap */
    // 设置间距尺寸
    setGap(gap: GapOptions['key']) {
      if (this.gap === gap) {
        return
      }
      this.gap = gap
      this.setCssVariables()
    },
    // 设置圆角尺寸
    setRounded(rounded: RoundedOptions['key']) {
      if (this.rounded === rounded) {
        return
      }
      this.rounded = rounded
      this.setCssVariables()
    },

    /* 设置 CSS 变量 */
    setCssVariables() {
      // 重新计算内容高度
      this.calculateContentHeight()

      const cssVariables: Record<string, string> = {
        // 布局尺寸变量
        [toKebabCase('sidebarWidth', '--')]: this.getSidebarWidth + 'px',
        [toKebabCase('sidebarCollapsedWidth', '--')]: this.getSidebarCollapsedWidth + 'px',
        [toKebabCase('headerHeight', '--')]: this.getHeaderHeight + 'px',
        [toKebabCase('breadcrumbHeight', '--')]: this.getBreadcrumbHeight + 'px',
        [toKebabCase('footerHeight', '--')]: this.getFooterHeight + 'px',
        [toKebabCase('tabsHeight', '--')]: this.getTabsHeight + 'px',
        [toKebabCase('contentHeight', '--')]: this.sizes.layout.contentHeight + 'px',
        [toKebabCase('contentsHeight', '--')]: this.sizes.layout.contentsHeight + 'px',

        // 间距变量
        [toKebabCase('gap', '--')]: (this.getGapValue || 0) + 'px',
        [toKebabCase('gaps', '--')]: (this.getGapValue || 0) / 2 + 'px',

        // 圆角变量
        [toKebabCase('rounded', '--')]: (this.getRoundedValue || 0) + 'px',
      }

      Object.entries(cssVariables).forEach(([key, value]) => {
        document.documentElement.style.setProperty(key, value)
      })
    },

    /* 初始化方法 */
    init() {
      // 确保使用深拷贝初始化
      this.setSize(this.size)
      this.setCssVariables()
    },

    /* 重置方法 - 用于调试 */
    reset() {
      this.size = 'comfortable'
      this.gap = 'md'
      this.rounded = 'smooth'
      this.sizes = cloneDeep(comfortableSizes)
      this.setCssVariables()
    },
  },

  persist: {
    key: `${env.piniaKeyPrefix}-size`,
    storage: localStorage,
    // 添加序列化配置，确保持久化正确
    serializer: {
      deserialize: (value: string) => {
        try {
          return JSON.parse(value)
        } catch {
          return {}
        }
      },
      serialize: (value: any) => {
        return JSON.stringify(value)
      },
    },
  },
})

export const useSizeStoreWithOut = () => {
  return useSizeStore(store)
}
