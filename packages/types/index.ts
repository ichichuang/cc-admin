/**
 * @copyright Copyright (c) 2025 chichuang
 * @license MIT
 * @description cc-admin 企业级后台管理框架 - 类型包主入口
 * 本文件为 chichuang 原创，禁止擅自删除署名或用于商业用途。
 */

// 导入所有模块类型定义，确保全局注入
import './modules/device.d.ts'
import './modules/global.d.ts'
import './modules/router.d.ts'
import './modules/user.d.ts'

// 注意：声明文件(.d.ts)中的类型会自动全局注入，无需显式导出
// 这里只是为了确保类型定义被加载
