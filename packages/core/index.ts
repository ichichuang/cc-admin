/**
 * @copyright Copyright (c) 2025 chichuang
 * @license MIT
 * @description cc-admin 企业级后台管理框架 - 核心包
 * 本文件为 chichuang 原创，禁止擅自删除署名或用于商业用途。
 */

// 核心包统一导出
export * from './api'
export * from './router'
export * from './stores'
export * from './utils'

// 默认导出
export { default as router } from './router'
export { default as store } from './stores'
