import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

/** 布局模式类型 */
export type LayoutMode = 'admin' | 'screen' | 'fullscreen'

/** Admin布局配置 */
export interface AdminLayoutConfig {
  /** 是否显示头部 */
  showHeader: boolean
  /** 是否显示顶部预设设置菜单 */
  showTopMenu: boolean
  /** 是否显示侧边栏 */
  showSidebar: boolean
  /** 是否显示面包屑 */
  showBreadcrumb: boolean
  /** 是否显示底部 */
  showFooter: boolean
  /** 是否显示标签页 */
  showTabs: boolean
}

/** Screen布局配置 */
export interface ScreenLayoutConfig {
  /** 是否显示头部 */
  showHeader: boolean
  /** 是否显示顶部预设设置菜单 */
  showTopMenu: boolean
  /** 是否显示底部 */
  showFooter: boolean
}

/** Fullscreen布局配置 */
export interface FullscreenLayoutConfig {
  /** 是否显示顶部预设设置菜单 */
  showTopMenu: boolean
}

/** 所有布局配置 */
export interface LayoutConfigs {
  admin: AdminLayoutConfig
  screen: ScreenLayoutConfig
  fullscreen: FullscreenLayoutConfig
}

// Layout 布局状态管理
export const useLayoutStore = defineStore(
  'layout',
  () => {
    // 当前布局模式
    const currentLayout = ref<LayoutMode>('admin')

    // 所有布局配置
    const layoutConfigs = ref<LayoutConfigs>({
      admin: {
        showHeader: true,
        showTopMenu: true,
        showSidebar: true,
        showBreadcrumb: true,
        showFooter: true,
        showTabs: false, // 默认不显示标签页
      },
      screen: {
        showHeader: true,
        showTopMenu: true,
        showFooter: true,
      },
      fullscreen: {
        showTopMenu: false,
      },
    })

    // 侧边栏是否折叠
    const sidebarCollapsed = ref(false)

    // 移动端侧边栏是否显示
    const mobileSidebarVisible = ref(false)

    // 获取当前布局配置
    const currentConfig = computed(() => {
      return layoutConfigs.value[currentLayout.value]
    })

    // 设置布局模式
    const setLayoutMode = (mode: LayoutMode) => {
      currentLayout.value = mode
    }

    // 更新指定布局配置
    const updateLayoutConfig = <T extends LayoutMode>(
      mode: T,
      config: Partial<LayoutConfigs[T]>
    ) => {
      layoutConfigs.value[mode] = { ...layoutConfigs.value[mode], ...config }
    }

    // 更新Admin布局配置 (保持向后兼容)
    const updateAdminConfig = (config: Partial<AdminLayoutConfig>) => {
      updateLayoutConfig('admin', config)
    }

    // 更新Screen布局配置
    const updateScreenConfig = (config: Partial<ScreenLayoutConfig>) => {
      updateLayoutConfig('screen', config)
    }

    // 更新Fullscreen布局配置
    const updateFullscreenConfig = (config: Partial<FullscreenLayoutConfig>) => {
      updateLayoutConfig('fullscreen', config)
    }

    // 切换侧边栏折叠状态
    const toggleSidebarCollapse = () => {
      sidebarCollapsed.value = !sidebarCollapsed.value
    }

    // 切换移动端侧边栏显示
    const toggleMobileSidebar = () => {
      mobileSidebarVisible.value = !mobileSidebarVisible.value
    }

    // 隐藏移动端侧边栏
    const hideMobileSidebar = () => {
      mobileSidebarVisible.value = false
    }

    // 重置所有配置为默认值
    const resetAllConfigs = () => {
      layoutConfigs.value = {
        admin: {
          showHeader: true,
          showTopMenu: true,
          showSidebar: true,
          showBreadcrumb: true,
          showFooter: true,
          showTabs: false,
        },
        screen: {
          showHeader: true,
          showTopMenu: true,
          showFooter: true,
        },
        fullscreen: {
          showTopMenu: false,
        },
      }
    }

    // 重置Admin配置为默认值 (保持向后兼容)
    const resetAdminConfig = () => {
      updateAdminConfig({
        showHeader: true,
        showTopMenu: true,
        showSidebar: true,
        showBreadcrumb: true,
        showFooter: true,
        showTabs: false,
      })
    }

    // 便捷访问器
    const adminConfig = computed(() => layoutConfigs.value.admin)
    const screenConfig = computed(() => layoutConfigs.value.screen)
    const fullscreenConfig = computed(() => layoutConfigs.value.fullscreen)

    return {
      // 状态
      currentLayout,
      layoutConfigs,
      currentConfig,
      adminConfig,
      screenConfig,
      fullscreenConfig,
      sidebarCollapsed,
      mobileSidebarVisible,

      // 方法
      setLayoutMode,
      updateLayoutConfig,
      updateAdminConfig,
      updateScreenConfig,
      updateFullscreenConfig,
      toggleSidebarCollapse,
      toggleMobileSidebar,
      hideMobileSidebar,
      resetAllConfigs,
      resetAdminConfig,
    }
  },
  {
    // 持久化配置
    persist: {
      key: `${import.meta.env.VITE_PINIA_PERSIST_KEY_PREFIX}-layout`,
      storage: localStorage,
      pick: ['layoutConfigs', 'sidebarCollapsed'], // 持久化所有布局配置
    },
  }
)

export const useLayoutStoreWithOut = () => {
  return useLayoutStore()
}
