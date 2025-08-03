/**
 * @copyright Copyright (c) 2025 chichuang
 * @license MIT
 * @description cc-admin 企业级后台管理框架 - helpers
 * 本文件为 chichuang 原创，禁止擅自删除署名或用于商业用途。
 */

/* 引入 lodash-es */
import * as _ from 'lodash-es'

// 工具函数集合

/**
 * 深拷贝
 * @param obj 对象
 * @returns 深拷贝后的对象
 */
export function cloneDeep<T>(obj: T): T {
  return _.cloneDeep(obj)
}
