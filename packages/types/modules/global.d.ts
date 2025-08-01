/**
 * @copyright Copyright (c) 2025 chichuang
 * @license MIT
 * @description cc-admin 企业级后台管理框架 - 全局类型定义
 * 本文件为 chichuang 原创，禁止擅自删除署名或用于商业用途。
 */

declare interface Window {
  $message: any
}

// Vue I18n 全局类型声明
import type { ComposerTranslation } from 'vue-i18n'

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $t: ComposerTranslation
    $te: (key: string) => boolean
    $d: (value: number | Date, key?: string, locale?: string) => string
    $n: (value: number, key?: string, locale?: string) => string
    $tm: (key: string) => any
    $rt: (message: string) => string
  }
}

declare type Nullable<T> = T | null

declare type ElRef<T extends HTMLElement = HTMLDivElement> = Nullable<T>

declare type Recordable<T = any, K extends string = string> = Record<K, T>

declare type ComponentRef<T extends abstract new (...args: any) => any> = InstanceType<T>
