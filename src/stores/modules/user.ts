import { defineStore } from 'pinia'

// 用户状态管理（待重写）
export const useUserStore = defineStore('user', () => {
  // 这里留空，后续由开发者自定义实现
  return {}
})

export const useUserStoreWithOut = () => {
  return useUserStore()
}

export default useUserStore
