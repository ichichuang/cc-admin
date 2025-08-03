/**
 * @copyright Copyright (c) 2025 chichuang
 * @license MIT
 * @description cc-admin 企业级后台管理框架 - 工具类型声明
 * 本文件为 chichuang 原创，禁止擅自删除署名或用于商业用途。
 */

// 声明全局类型
declare global {
  /** 工具类型 */
  type Nullable<T> = T | null
  type ElRef<T extends HTMLElement = HTMLDivElement> = Nullable<T>
  type Recordable<T = any, K extends string = string> = Record<K, T>
  type ComponentRef<T extends abstract new (...args: any) => any> = InstanceType<T>
}

// 导出空对象使其成为外部模块
export {}
