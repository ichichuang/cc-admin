/**
 * @copyright Copyright (c) 2025 chichuang
 * @license MIT
 * @description cc-admin 企业级后台管理框架 - 组合式函数
 * 本文件为 chichuang 原创，禁止擅自删除署名或用于商业用途。
 */

import { useLayoutStoreWithOut } from '@cc-admin/core/stores'

export const useLoading = () => {
  const loadingStart = () => {
    const layoutStore = useLayoutStoreWithOut()
    layoutStore.setIsLoading(true)
  }

  const loadingDone = () => {
    const layoutStore = useLayoutStoreWithOut()
    layoutStore.setIsLoading(false)
  }

  return {
    loadingStart,
    loadingDone,
  }
}
