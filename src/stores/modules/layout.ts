/**
 * @copyright Copyright (c) 2025 chichuang
 * @license MIT
 * @description CC-Admin 企业级后台管理框架 - 状态管理
 * 本文件为 chichuang 原创，禁止擅自删除署名或用于商业用途。
 */

/* 尺寸配置 */
import store from '@/stores'
import { useSizeStoreWithOut } from '@/stores/modules/size'
import type { DeviceInfo } from '@/Types/global'
import { getDeviceInfo } from '@/utils/deviceInfo'
import { env } from '@/utils/env'
import { debounce } from 'lodash-es'
import { defineStore } from 'pinia'

/* 布局配置 */
// 布局配置
interface LayoutConfig {
  showHeader: boolean
  showMenu: boolean
  showSidebar: boolean
  showBreadcrumb: boolean
  showFooter: boolean
  showTabs: boolean
}
const layoutConfig: LayoutConfig = {
  showHeader: true,
  showMenu: true,
  showSidebar: true,
  showBreadcrumb: true,
  showFooter: true,
  showTabs: true,
}

interface LayoutState {
  // 当前布局模式
  currentLayout: LayoutMode
  // 布局配置
  layoutConfig: LayoutConfig
  // 侧边栏折叠状态
  sidebarCollapsed: boolean
  // 移动端侧边栏可见状态
  mobileSidebarVisible: boolean

  // 框架加载状态
  isLoading: boolean
  // 页面加载状态
  isPageLoading: boolean

  // 设备信息
  deviceInfo: DeviceInfo
}

/* 尺寸store */
export const useLayoutStore = defineStore('layout', {
  state: (): LayoutState => ({
    currentLayout: 'admin',

    layoutConfig: layoutConfig,
    sidebarCollapsed: false,
    mobileSidebarVisible: false,

    isLoading: false,
    isPageLoading: false,

    deviceInfo: getDeviceInfo(),
  }),

  getters: {
    // 获取当前模式
    getCurrentLayout: (state: LayoutState) => state.currentLayout,

    // 是否展示头部
    getShowHeader: (state: LayoutState) => state.layoutConfig.showHeader,
    // 是否展示顶部菜单
    getShowMenu: (state: LayoutState) => state.layoutConfig.showMenu,
    // 是否展示侧边栏
    getShowSidebar: (state: LayoutState) => state.layoutConfig.showSidebar,
    // 是否展示面包屑
    getShowBreadcrumb: (state: LayoutState) => state.layoutConfig.showBreadcrumb,
    // 是否展示底部
    getShowFooter: (state: LayoutState) => state.layoutConfig.showFooter,
    // 是否展示标签页
    getShowTabs: (state: LayoutState) => state.layoutConfig.showTabs,

    // 是否折叠侧边栏
    getSidebarCollapsed: (state: LayoutState) => state.sidebarCollapsed,
    // 是否移动端侧边栏可见
    getMobileSidebarVisible: (state: LayoutState) => state.mobileSidebarVisible,

    // 框架加载状态
    getIsLoading: (state: LayoutState) => state.isLoading,
    // 页面加载状态
    getIsPageLoading: (state: LayoutState) => state.isPageLoading,

    /* 设备信息 */
    // 是否是 PC 端
    getIsPC: (state: LayoutState) => state.deviceInfo.type === 'PC',
    // 是否是 Mobile 端
    getIsMobile: (state: LayoutState) => state.deviceInfo.type === 'Mobile',
    // 设备宽度
    getDeviceWidth: (state: LayoutState) => state.deviceInfo.screen.deviceWidth,
    // 设备高度
    getDeviceHeight: (state: LayoutState) => state.deviceInfo.screen.deviceHeight,
    // 设备方向
    getDeviceOrientation: (state: LayoutState) => state.deviceInfo.screen.orientation,
    // 实际宽度
    getWidth: (state: LayoutState) => state.deviceInfo.screen.width,
    // 实际高度
    getHeight: (state: LayoutState) => state.deviceInfo.screen.height,
    // 绝对大小
    getDefinitely: (state: LayoutState) => state.deviceInfo.screen.definitely,
    // 系统导航栏高度
    getNavHeight: (state: LayoutState) => state.deviceInfo.screen.navHeight,
    // 系统标签栏高度
    getTabHeight: (state: LayoutState) => state.deviceInfo.screen.tabHeight,
    // 系统
    getSystem: (state: LayoutState) => state.deviceInfo.system,
  },

  actions: {
    // 设置当前布局模式
    setCurrentLayout(layout: LayoutMode) {
      this.currentLayout = layout
    },

    /* 布局显示状态设置 */
    // 设置头部显示状态
    setShowHeader(show: boolean) {
      this.layoutConfig.showHeader = show
      this.notifySizeStoreUpdate()
    },
    // 设置菜单显示状态
    setShowMenu(show: boolean) {
      this.layoutConfig.showMenu = show
      this.notifySizeStoreUpdate()
    },
    // 设置侧边栏显示状态
    setShowSidebar(show: boolean) {
      this.layoutConfig.showSidebar = show
      this.notifySizeStoreUpdate()
    },
    // 设置面包屑显示状态
    setShowBreadcrumb(show: boolean) {
      this.layoutConfig.showBreadcrumb = show
      this.notifySizeStoreUpdate()
    },
    // 设置底部显示状态
    setShowFooter(show: boolean) {
      this.layoutConfig.showFooter = show
      this.notifySizeStoreUpdate()
    },
    // 设置标签页显示状态
    setShowTabs(show: boolean) {
      this.layoutConfig.showTabs = show
      this.notifySizeStoreUpdate()
    },

    // 设置侧边栏折叠状态
    setSidebarCollapsed(collapsed: boolean) {
      this.sidebarCollapsed = collapsed
    },
    // 设置移动端侧边栏可见状态
    setMobileSidebarVisible(visible: boolean) {
      this.mobileSidebarVisible = visible
    },

    // 设置框架加载状态
    setIsLoading(loading: boolean) {
      this.isLoading = loading
    },
    // 设置页面加载状态
    setIsPageLoading(loading: boolean) {
      this.isPageLoading = loading
    },

    // 初始化设备信息
    initDeviceInfo() {
      this.deviceInfo = getDeviceInfo()
      // 设备信息更新后，通知 size store 重新计算内容高度
      this.notifySizeStoreUpdate()
    },

    // 通知 size store 更新内容高度
    notifySizeStoreUpdate() {
      // 使用 nextTick 确保在下一个事件循环中执行，避免循环依赖
      setTimeout(async () => {
        try {
          const sizeStore = useSizeStoreWithOut()
          sizeStore.updateContentHeight()
        } catch (error) {
          console.warn('Failed to update size store:', error)
        }
      }, 0)
    },

    init() {
      // 延迟第一次初始化，确保拿到准确尺寸
      requestAnimationFrame(() => {
        this.initDeviceInfo()
      })

      // resize 等事件触发频繁，建议加防抖（debounce）避免连续高频触发影响性能。
      const handler = debounce(this.initDeviceInfo.bind(this), 200)

      const events = [
        'resize', // 浏览器窗口尺寸变化
        'orientationchange', // 横竖屏切换
        'pageshow', // 页面显示（如从缓存中返回）
        'visibilitychange', // 标签页激活/隐藏
      ]

      events.forEach(event => window.addEventListener(event, handler))

      // 返回移除函数，让组件中去处理
      return () => {
        events.forEach(event => window.removeEventListener(event, handler))
      }
    },
  },

  persist: {
    key: `${env.piniaKeyPrefix}-layout`,
    storage: localStorage,
  },
})

export const useLayoutStoreWithOut = () => {
  return useLayoutStore(store)
}
