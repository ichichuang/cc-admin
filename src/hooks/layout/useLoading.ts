import { useLayoutStoreWithOut } from '@/stores'

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
