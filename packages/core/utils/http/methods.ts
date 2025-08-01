/**
 * @copyright Copyright (c) 2025 chichuang
 * @license MIT
 * @description cc-admin 企业级后台管理框架 - HTTP方法
 * 本文件为 chichuang 原创，禁止擅自删除署名或用于商业用途。
 */

import { alovaInstance } from './instance'

// 基础请求方法
export const get = (url: string, params?: any) => {
  return alovaInstance.Get(url, { params })
}

export const post = (url: string, data?: any) => {
  return alovaInstance.Post(url, data)
}

export const put = (url: string, data?: any) => {
  return alovaInstance.Put(url, data)
}

export const del = (url: string) => {
  return alovaInstance.Delete(url)
}

export const patch = (url: string, data?: any) => {
  return alovaInstance.Patch(url, data)
}
