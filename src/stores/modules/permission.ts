import {
  checkRoutePermission,
  filterAuthorizedRoutes,
  generateMenuTree,
  sortRoutes,
} from '@/router/utils'
import { useUserStoreWithOut } from '@/stores'
import type { Store, StoreDefinition } from 'pinia'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

/**
 * 权限管理 Store
 * 负责动态路由、菜单、缓存页面等权限相关状态
 */
export const usePermissionStore: StoreDefinition<'permission', any, any, any> = defineStore(
  'permission',
  () => {
    // state
    const staticRoutes = ref<RouteConfig[]>([])
    const dynamicRoutes = ref<RouteConfig[]>([])
    const wholeMenus = ref<MenuItem[]>([])
    const authorizedMenus = ref<MenuItem[]>([])
    const flatteningRoutes = ref<RouteConfig[]>([])
    const cachePageList = ref<string[]>([])
    const isRoutesLoaded = ref(false)

    // getters
    const allRoutes = computed(() => [...staticRoutes.value, ...dynamicRoutes.value])

    // actions
    function setStaticRoutes(routes: RouteConfig[]) {
      staticRoutes.value = routes
      updateMenus()
    }

    function setDynamicRoutes(routes: RouteConfig[]) {
      dynamicRoutes.value = routes
      isRoutesLoaded.value = true
      updateMenus()
    }

    function addDynamicRoute(route: RouteConfig) {
      const idx = dynamicRoutes.value.findIndex(r => r.path === route.path)
      if (idx !== -1) {
        dynamicRoutes.value[idx] = route
      } else {
        dynamicRoutes.value.push(route)
      }
      updateMenus()
    }

    function addDynamicRoutes(routes: RouteConfig[]) {
      routes.forEach(addDynamicRoute)
    }

    function removeDynamicRoute(path: string) {
      const idx = dynamicRoutes.value.findIndex(r => r.path === path)
      if (idx !== -1) {
        dynamicRoutes.value.splice(idx, 1)
        updateMenus()
      }
    }

    function clearDynamicRoutes() {
      dynamicRoutes.value = []
      isRoutesLoaded.value = false
      updateMenus()
    }

    function processBackendRoutes(backendRoutes: BackendRouteConfig[]): RouteConfig[] {
      return backendRoutes.map(route => ({
        path: route.path,
        name: route.name,
        component: route.component ? resolveComponent(route.component) : undefined,
        redirect: route.redirect,
        meta: {
          ...route.meta,
          backstage: true,
        },
        children: route.children ? processBackendRoutes(route.children) : undefined,
      }))
    }

    function checkUserPermission(route: RouteConfig): PermissionResult {
      const userStore = useUserStoreWithOut()
      const userRoles = userStore.getUserRoles
      if (!userRoles || userRoles.length === 0) {
        return { hasPermission: false, errorMessage: '用户信息不存在' }
      }
      const hasPermission = checkRoutePermission(route, userRoles)
      return {
        hasPermission,
        missingPermissions: hasPermission ? undefined : route.meta?.roles,
      }
    }

    function hasAuth(auths: string | string[]): boolean {
      const userStore = useUserStoreWithOut()
      const userPermissions = userStore.getUserPermissions
      if (!userPermissions.length) {
        return false
      }
      const authList = Array.isArray(auths) ? auths : [auths]
      if (userPermissions.includes('*:*:*')) {
        return true
      }
      return authList.every(auth => userPermissions.includes(auth))
    }

    function cacheOperate({ mode, name }: CacheOperation) {
      const idx = cachePageList.value.findIndex(item => item === name)
      switch (mode) {
        case 'add':
          if (idx === -1) {
            cachePageList.value.push(name)
          }
          break
        case 'delete':
          if (idx !== -1) {
            cachePageList.value.splice(idx, 1)
          }
          break
        case 'refresh':
          if (idx !== -1) {
            cachePageList.value.splice(idx, 1)
            setTimeout(() => {
              cachePageList.value.push(name)
            }, 100)
          }
          break
      }
    }

    function clearAllCachePage() {
      cachePageList.value = []
    }

    function resetAll() {
      dynamicRoutes.value = []
      wholeMenus.value = []
      authorizedMenus.value = []
      flatteningRoutes.value = []
      cachePageList.value = []
      isRoutesLoaded.value = false
    }

    function recordUnauthorizedAccess(path: string, userRoles: string[]) {
      console.warn(`未授权访问记录 - 路径: ${path}, 用户角色: ${userRoles.join(', ')}`)
      // 可扩展：发送日志到服务器
    }

    // 私有方法
    function updateMenus() {
      const allSortedRoutes = sortRoutes(allRoutes.value)
      flatteningRoutes.value = allSortedRoutes
      wholeMenus.value = generateMenuTree(allSortedRoutes)
      const userStore = useUserStoreWithOut()
      const userRoles = userStore.getUserRoles
      if (userRoles && userRoles.length > 0) {
        const authorizedRoutes = filterAuthorizedRoutes(allSortedRoutes, userRoles)
        authorizedMenus.value = generateMenuTree(authorizedRoutes)
      } else {
        authorizedMenus.value = wholeMenus.value
      }
    }

    function resolveComponent(componentPath: string) {
      if (componentPath.startsWith('/')) {
        componentPath = componentPath.slice(1)
      }
      return () =>
        import(`@/views/${componentPath}.vue`).catch(
          () => import(`@/views/${componentPath}/index.vue`)
        )
    }

    // 导出
    return {
      // state
      staticRoutes,
      dynamicRoutes,
      wholeMenus,
      authorizedMenus,
      flatteningRoutes,
      cachePageList,
      isRoutesLoaded,
      // getters
      allRoutes,
      // actions
      setStaticRoutes,
      setDynamicRoutes,
      addDynamicRoute,
      addDynamicRoutes,
      removeDynamicRoute,
      clearDynamicRoutes,
      processBackendRoutes,
      checkUserPermission,
      hasAuth,
      cacheOperate,
      clearAllCachePage,
      resetAll,
      recordUnauthorizedAccess,
    }
  },
  {
    persist: {
      key: `${import.meta.env.VITE_PINIA_PERSIST_KEY_PREFIX}-permission`,
      storage: localStorage,
      pick: ['cachePageList'],
    },
  }
)

/**
 * 便捷 hook
 */
export const usePermissionStoreWithOut: () => Store<'permission', any, any, any> = () =>
  usePermissionStore()
