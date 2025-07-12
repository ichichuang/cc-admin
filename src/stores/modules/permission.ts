/* 尺寸配置 */
import type { RouteConfig } from '@/router/types'
import store from '@/stores'
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
      console.log('重置权限')
      this.staticRoutes = []
      this.dynamicRoutes = []
      this.isRoutesLoaded = false
    },
  },

  persist: {
    key: `${import.meta.env.VITE_PINIA_PERSIST_KEY_PREFIX}-permission`,
    storage: localStorage,
  },
})

export const usePermissionStoreWithOut = () => {
  return usePermissionStore(store)
}
