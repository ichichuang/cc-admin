/**
 * @copyright Copyright (c) 2025 chichuang
 * @license MIT
 * @description cc-admin 企业级后台管理框架 - 用户类型声明
 * 本文件为 chichuang 原创，禁止擅自删除署名或用于商业用途。
 */

// 声明全局类型
declare global {
  /** 用户信息接口 */
  interface UserInfo {
    /** 用户ID */
    userId: string
    /** 用户名 */
    username: string
    /** 用户角色 */
    roles: string[]
    /** 用户权限 */
    permissions: string[]
    /** 其他用户信息 */
    [key: string]: any
  }
}

// 导出空对象使其成为外部模块
export {}
