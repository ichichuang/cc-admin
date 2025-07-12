/* 尺寸配置 */
import store from '@/stores'
import { getDeviceInfo } from '@/utils/deviceInfo'
import { debounce } from 'lodash-es'
import { defineStore } from 'pinia'

/* 布局配置 */
// Admin布局配置
interface AdminLayoutConfig {
  showHeader: boolean
  showMenu: boolean
  showSidebar: boolean
  showBreadcrumb: boolean
  showFooter: boolean
  showTabs: boolean
}
const adminLayoutConfig: AdminLayoutConfig = {
  showHeader: true,
  showMenu: true,
  showSidebar: true,
  showBreadcrumb: true,
  showFooter: true,
  showTabs: true,
}

// Screen布局配置
interface ScreenLayoutConfig {
  showHeader: boolean
  showMenu: boolean
  showFooter: boolean
}
const screenLayoutConfig: ScreenLayoutConfig = {
  showHeader: true,
  showMenu: true,
  showFooter: true,
}

// Fullscreen布局配置
interface FullscreenLayoutConfig {
  showMenu: boolean
}
const fullscreenLayoutConfig: FullscreenLayoutConfig = {
  showMenu: false,
}

// 所有布局配置
interface LayoutConfigs {
  admin: AdminLayoutConfig
  screen: ScreenLayoutConfig
  fullscreen: FullscreenLayoutConfig
}

interface LayoutState {
  // 当前布局模式
  currentLayout: LayoutMode
  // 布局配置
  layoutConfigs: LayoutConfigs
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

    layoutConfigs: {
      admin: adminLayoutConfig,
      screen: screenLayoutConfig,
      fullscreen: fullscreenLayoutConfig,
    },
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
    getShowHeader: (state: LayoutState) => state.layoutConfigs.admin.showHeader,
    // 是否展示顶部菜单
    getShowMenu: (state: LayoutState) => state.layoutConfigs.admin.showMenu,
    // 是否展示侧边栏
    getShowSidebar: (state: LayoutState) => state.layoutConfigs.admin.showSidebar,
    // 是否展示面包屑
    getShowBreadcrumb: (state: LayoutState) => state.layoutConfigs.admin.showBreadcrumb,
    // 是否展示底部
    getShowFooter: (state: LayoutState) => state.layoutConfigs.admin.showFooter,
    // 是否展示标签页
    getShowTabs: (state: LayoutState) => state.layoutConfigs.admin.showTabs,

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
    key: `${import.meta.env.VITE_PINIA_PERSIST_KEY_PREFIX}-layout`,
    storage: localStorage,
  },
})

export const useLayoutStoreWithOut = () => {
  return useLayoutStore(store)
}
