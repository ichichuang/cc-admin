/**
 * @copyright Copyright (c) 2025 chichuang
 * @license MIT
 * @description cc-admin 企业级后台管理框架 - 状态管理
 * 本文件为 chichuang 原创，禁止擅自删除署名或用于商业用途。
 */

/* 尺寸配置 */
import store from '@/stores'
import { env } from '@/utils/env'
import { defineStore } from 'pinia'

const appTitle = env.appTitle

interface AppState {
  title: string
}

/* 尺寸store */
export const useAppStore = defineStore('app', {
  state: (): AppState => ({
    title: appTitle,
  }),

  getters: {
    getTitle: (state: AppState) => state.title,
  },

  actions: {},

  persist: {
    key: `${env.piniaKeyPrefix}-app`,
    storage: localStorage,
  },
})

export const useAppStoreWithOut = () => {
  return useAppStore(store)
}
