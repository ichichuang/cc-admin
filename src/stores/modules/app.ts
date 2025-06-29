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

    // 主题模式
    const theme = ref<'light' | 'dark'>('light')

    // 语言设置
    const locale = ref('zh-CN')

    // 切换侧边栏状态
    const toggleSidebar = () => {
      sidebarCollapsed.value = !sidebarCollapsed.value
    }

    // 切换主题
    const toggleTheme = () => {
      theme.value = theme.value === 'light' ? 'dark' : 'light'
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
      theme,
      locale,

      // 方法
      toggleSidebar,
      toggleTheme,
      setLocale,
      setTitle,
    }
  },
  {
    // 持久化配置
    persist: {
      key: 'cc-admin-app', // 存储的键名
      storage: localStorage, // 存储方式，默认是 localStorage
      pick: ['theme', 'locale', 'sidebarCollapsed'], // 只持久化这些字段
      // 不持久化 title，因为它可能会动态变化
    },
  }
)

// 默认导出
export default useAppStore
