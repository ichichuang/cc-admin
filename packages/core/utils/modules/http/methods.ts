/**
 * @copyright Copyright (c) 2025 chichuang
 * @license MIT
 * @description cc-admin 企业级后台管理框架 - HTTP方法
 * 本文件为 chichuang 原创，禁止擅自删除署名或用于商业用途。
 */

import { alovaInstance, createHttpInstance, type HttpConfig } from './instance'

// 创建带配置的 HTTP 方法
export const createHttpMethods = (config?: HttpConfig) => {
  const instance = config ? createHttpInstance(config) : alovaInstance

  return {
    get: (url: string, params?: any) => {
      return instance.Get(url, { params })
    },

    post: (url: string, data?: any) => {
      return instance.Post(url, data)
    },

    put: (url: string, data?: any) => {
      return instance.Put(url, data)
    },

    del: (url: string) => {
      return instance.Delete(url)
    },

    patch: (url: string, data?: any) => {
      return instance.Patch(url, data)
    },
  }
}

// 默认 HTTP 方法（使用全局配置的实例）
export const { get, post, put, del, patch } = createHttpMethods()
