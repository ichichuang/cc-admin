/**
 * @copyright Copyright (c) 2025 chichuang
 * @license MIT
 * @description CC-Admin 企业级后台管理框架 - 状态管理
 * 本文件为 chichuang 原创，禁止擅自删除署名或用于商业用途。
 */

import { getUserInfo } from '@cc/early-bird-core/api'
import { piniaKeyPrefix } from '@cc/early-bird-core/constants'
import router from '@cc/early-bird-core/router'
import store from '@cc/early-bird-core/stores'
import { defineStore } from 'pinia'
import { env } from '../../utils/env'

interface UserState {
  token: string
  userInfo: UserInfo
  redirectPath: string
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
    redirectPath: '',
  }),

  getters: {
    getToken: (state: UserState) => state.token,
    getUserInfo: (state: UserState) => state.userInfo,
    // 获取页面权限
    getUserRoles: (state: UserState) => state.userInfo.roles,
    // 获取按钮权限
    getUserPermissions: (state: UserState) => state.userInfo.permissions,
    // 获取重定向路径
    getRedirectPath: (state: UserState) => state.redirectPath,
  },

  actions: {
    setToken(token: string) {
      this.token = token
      getUserInfo().then(res => {
        this.userInfo = res
        router.push((router.currentRoute.value.query.redirect as string) || env.rootRedirect)
      })
    },
    setRedirectPath(path: string) {
      this.redirectPath = path
    },
    clearRedirectPath() {
      this.redirectPath = ''
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
    key: `${piniaKeyPrefix}-user`,
    storage: localStorage,
  },
})

export const useUserStoreWithOut = () => {
  return useUserStore(store)
}
