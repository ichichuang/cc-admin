/* 尺寸配置 */
import { getUserInfo } from '@/api'
import router from '@/router'
import store from '@/stores'
import { defineStore } from 'pinia'

interface UserState {
  token: string
  userInfo: UserInfo
}

/* 尺寸store */
export const useUserStore = defineStore('user', {
  state: (): UserState => ({
    token: '',
    userInfo: {
      userId: '', // 用户ID
      username: '', // 用户名
      roles: [], // 用户角色
      permissions: [], // 用户权限
    },
  }),

  getters: {
    getToken: (state: UserState) => state.token,
    getUserInfo: (state: UserState) => state.userInfo,
    // 获取页面权限
    getUserRoles: (state: UserState) => state.userInfo.roles,
    // 获取按钮权限
    getUserPermissions: (state: UserState) => state.userInfo.permissions,
  },

  actions: {
    setToken(token: string) {
      this.token = token
      getUserInfo().then(res => {
        console.log('获取用户信息: ', res)
        this.userInfo = res
        router.push(
          (router.currentRoute.value.query.redirect as string) || import.meta.env.VITE_ROOT_REDIRECT
        )
      })
    },
    setUserInfo(userInfo: UserInfo) {
      this.userInfo = userInfo
    },
  },

  persist: {
    key: `${import.meta.env.VITE_PINIA_PERSIST_KEY_PREFIX}-user`,
    storage: localStorage,
  },
})

export const useUserStoreWithOut = () => {
  return useUserStore(store)
}
