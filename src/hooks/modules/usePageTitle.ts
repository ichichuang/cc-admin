/**
 * @copyright Copyright (c) 2025 chichuang
 * @license MIT
 * @description cc-admin 企业级后台管理框架 - 组合式函数
 * 本文件为 chichuang 原创，禁止擅自删除署名或用于商业用途。
 */

/**
 * 页面标题管理的Composable函数
 */
import { t } from '@/locales'
import { useAppStoreWithOut } from '@/stores'
import { computed, watch } from 'vue'
import type { Router } from 'vue-router'
import { useRoute } from 'vue-router'

export function usePageTitle(_router?: Router) {
  const route = useRoute()
  const appStore = useAppStoreWithOut()
  const env = import.meta.env
  const appTitle = env.VITE_APP_TITLE || appStore.getTitle

  /**
   * 获取路由页面标题（支持多语言）
   */
  const getRouteTitle = (route: any, appTitle: string): string => {
    if (route.meta?.titleKey) {
      // 使用 titleKey 获取多语言标题
      return `${t(route.meta.titleKey)} - ${appTitle}`
    } else if (route.meta?.title) {
      // 兼容直接设置 title 的情况
      return `${route.meta.title} - ${appTitle}`
    }
    return appTitle
  }

  /**
   * 当前页面标题
   */
  const currentPageTitle = computed(() => {
    return getRouteTitle(route, appTitle)
  })

  /**
   * 更新页面标题
   */
  const updatePageTitle = () => {
    document.title = currentPageTitle.value
  }

  /**
   * 监听路由变化，更新标题
   */
  watch(
    () => route.path,
    () => {
      updatePageTitle()
    },
    { immediate: true }
  )

  /**
   * 监听语言变化，更新标题
   */
  watch(
    () => t('router.dashboard.dashboard'), // 监听任意翻译键的变化
    () => {
      updatePageTitle()
    }
  )

  /**
   * 监听应用标题变化
   */
  watch(
    () => appStore.getTitle,
    () => {
      updatePageTitle()
    }
  )

  return {
    currentPageTitle,
    updatePageTitle,
    getRouteTitle,
  }
}
