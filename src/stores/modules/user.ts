/**
 * @copyright Copyright (c) 2025 chichuang
 * @license MIT
 * @description CC-Admin 企业级后台管理框架 - 状态管理
 * 本文件为 chichuang 原创，禁止擅自删除署名或用于商业用途。
 */

import { getUserInfo } from '@/api'
import router from '@/router'
import store from '@/stores'
import { env } from '@/utils/env'
import { defineStore } from 'pinia'

interface UserState {
  token: string
  userInfo: UserInfo
}

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
        this.userInfo = res
        router.push((router.currentRoute.value.query.redirect as string) || env.rootRedirect)
      })
    },
    resetToken() {
      this.token = ''
    },
    setUserInfo(userInfo: UserInfo) {
      this.userInfo = userInfo
    },
    resetUserInfo() {
      this.userInfo = {
        userId: '',
        username: '',
        roles: [],
        permissions: [],
      }
    },
  },

  persist: {
    key: `${env.piniaKeyPrefix}-user`,
    storage: localStorage,
  },
})

export const useUserStoreWithOut = () => {
  return useUserStore(store)
}
