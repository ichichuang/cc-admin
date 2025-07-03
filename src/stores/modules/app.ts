import { defineStore } from 'pinia'
import { ref } from 'vue'

// App 应用状态管理
export const useAppStore = defineStore(
  'app',
  () => {
    // 应用标题
    const title = ref('CC Admin')

    // 侧边栏是否展开
    const sidebarCollapsed = ref(false)

    // 语言设置
    const locale = ref('zh-CN')

    // 切换侧边栏状态
    const toggleSidebar = () => {
      sidebarCollapsed.value = !sidebarCollapsed.value
    }

    // 设置语言
    const setLocale = (newLocale: string) => {
      locale.value = newLocale
    }

    // 设置应用标题
    const setTitle = (newTitle: string) => {
      title.value = newTitle
      // 同时更新页面标题
      document.title = newTitle
    }

    return {
      // 状态
      title,
      sidebarCollapsed,
      locale,

      // 方法
      toggleSidebar,
      setLocale,
      setTitle,
    }
  },
  {
    // 持久化配置
    persist: {
      key: `${import.meta.env.VITE_PINIA_PERSIST_KEY_PREFIX}-app`, // 存储的键名
      storage: localStorage, // 存储方式，默认是 localStorage
      pick: ['locale', 'sidebarCollapsed'], // 只持久化这些字段
      // 不持久化 title，因为它可能会动态变化
    },
  }
)

// 默认导出
export const useAppStoreWithOut = () => {
  return useAppStore()
}

export default useAppStore
