/**
 * @copyright Copyright (c) 2025 chichuang
 * @license MIT
 * @description CC-Admin 企业级后台管理框架 - 状态管理
 * 本文件为 chichuang 原创，禁止擅自删除署名或用于商业用途。
 */

/* 尺寸配置 */
import store from '@/stores'
import { env } from '@/utils/env'
import { defineStore } from 'pinia'

interface PermissionState {
  // 静态路由
  staticRoutes: RouteConfig[]
  // 动态路由
  dynamicRoutes: RouteConfig[]
  // 是否已加载路由
  isRoutesLoaded: boolean
}

export const usePermissionStore = defineStore('permission', {
  state: (): PermissionState => ({
    staticRoutes: [],
    dynamicRoutes: [],
    isRoutesLoaded: false,
  }),

  getters: {
    getStaticRoutes: (state: PermissionState) => state.staticRoutes,
    getDynamicRoutes: (state: PermissionState) => state.dynamicRoutes,
    getIsRoutesLoaded: (state: PermissionState) => state.isRoutesLoaded,
  },

  actions: {
    // 设置静态路由
    setStaticRoutes(routes: RouteConfig[]) {
      this.staticRoutes = routes
    },
    // 设置动态路由
    setDynamicRoutes(routes: RouteConfig[]) {
      this.dynamicRoutes = routes
    },
    // 设置是否已加载路由
    setIsRoutesLoaded(loaded: boolean) {
      this.isRoutesLoaded = loaded
    },
    // 重置
    reset() {
      this.staticRoutes = []
      this.dynamicRoutes = []
      this.isRoutesLoaded = false
    },
  },

  persist: {
    key: `${env.piniaKeyPrefix}-permission`,
    storage: localStorage,
  },
})

export const usePermissionStoreWithOut = () => {
  return usePermissionStore(store)
}
