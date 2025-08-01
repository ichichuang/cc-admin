/**
 * @copyright Copyright (c) 2025 chichuang
 * @license MIT
 * @description cc-admin 企业级后台管理框架 - 应用状态管理
 * 本文件为 chichuang 原创，禁止擅自删除署名或用于商业用途。
 */

import { defineStore } from 'pinia'
import { isDev, isProd } from '../../utils/env'

export const useAppStore = defineStore('app', {
  state: () => ({
    // 应用基本信息
    appName: 'cc-admin',
    appVersion: '1.0.0',
    appDescription: '企业级后台管理框架',

    // 应用状态
    loading: false,
    error: null as string | null,

    // 环境信息
    isDev: isDev(),
    isProd: isProd(),
    isTest: false, // 暂时设为false，因为当前环境类型中没有test
  }),

  getters: {
    // 获取应用信息
    appInfo: state => ({
      name: state.appName,
      version: state.appVersion,
      description: state.appDescription,
    }),

    // 检查是否有错误
    hasError: state => state.error !== null,
  },

  actions: {
    // 设置加载状态
    setLoading(loading: boolean) {
      this.loading = loading
    },

    // 设置错误信息
    setError(error: string | null) {
      this.error = error
    },

    // 清除错误
    clearError() {
      this.error = null
    },

    // 初始化应用
    async init() {
      try {
        this.setLoading(true)
        // 这里可以添加应用初始化逻辑
        console.log('应用初始化完成')
      } catch (error) {
        this.setError(error instanceof Error ? error.message : '应用初始化失败')
      } finally {
        this.setLoading(false)
      }
    },
  },
})
