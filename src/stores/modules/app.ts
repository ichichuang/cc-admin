/* 尺寸配置 */
import store from '@/stores'
import { defineStore } from 'pinia'

const appTitle = import.meta.env.VITE_APP_TITLE

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
    key: `${import.meta.env.VITE_PINIA_PERSIST_KEY_PREFIX}-app`,
    storage: localStorage,
  },
})

export const useAppStoreWithOut = () => {
  return useAppStore(store)
}
