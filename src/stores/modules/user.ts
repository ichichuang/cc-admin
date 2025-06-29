import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

// 用户信息接口
interface UserInfo {
  id: number
  username: string
  email: string
  avatar?: string
  roles: string[]
}

// 用户偏好设置接口
interface UserPreferences {
  fontSize: 'small' | 'medium' | 'large'
  autoSave: boolean
  notifications: boolean
  layout: 'sidebar' | 'topbar'
}

// 用户状态管理
export const useUserStore = defineStore(
  'user',
  () => {
    // 用户信息
    const userInfo = ref<UserInfo | null>(null)

    // 用户偏好设置
    const preferences = ref<UserPreferences>({
      fontSize: 'medium',
      autoSave: true,
      notifications: true,
      layout: 'sidebar',
    })

    // 登录状态
    const isLoggedIn = ref(false)

    // 最后活动时间（不需要持久化）
    const lastActivityTime = ref<Date | null>(null)

    // 计算属性：用户显示名称
    const displayName = computed(() => {
      return userInfo.value?.username || '未登录用户'
    })

    // 计算属性：是否为管理员
    const isAdmin = computed(() => {
      return userInfo.value?.roles.includes('admin') || false
    })

    // 登录
    const login = (user: UserInfo) => {
      userInfo.value = user
      isLoggedIn.value = true
      lastActivityTime.value = new Date()
    }

    // 登出
    const logout = () => {
      userInfo.value = null
      isLoggedIn.value = false
      lastActivityTime.value = null
    }

    // 更新用户信息
    const updateUserInfo = (updates: Partial<UserInfo>) => {
      if (userInfo.value) {
        userInfo.value = { ...userInfo.value, ...updates }
      }
    }

    // 更新偏好设置
    const updatePreferences = (updates: Partial<UserPreferences>) => {
      preferences.value = { ...preferences.value, ...updates }
    }

    // 更新活动时间
    const updateActivity = () => {
      lastActivityTime.value = new Date()
    }

    return {
      // 状态
      userInfo,
      preferences,
      isLoggedIn,
      lastActivityTime,

      // 计算属性
      displayName,
      isAdmin,

      // 方法
      login,
      logout,
      updateUserInfo,
      updatePreferences,
      updateActivity,
    }
  },
  {
    // 持久化配置 - 演示不同的配置选项
    persist: [
      // 配置1：用户基本信息和登录状态
      {
        key: 'cc-admin-user-auth',
        storage: localStorage,
        pick: ['userInfo', 'isLoggedIn'],
      },
      // 配置2：用户偏好设置（使用 sessionStorage）
      {
        key: 'cc-admin-user-preferences',
        storage: sessionStorage,
        pick: ['preferences'],
      },
      // 注意：lastActivityTime 不持久化，因为它应该在每次会话重新开始时重置
    ],
  }
)

// 默认导出
export default useUserStore
