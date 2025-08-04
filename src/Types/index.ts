/**
 * @copyright Copyright (c) 2025 chichuang
 * @license MIT
 * @description cc-admin 企业级后台管理框架 - 全局类型声明入口
 * 本文件为 chichuang 原创，禁止擅自删除署名或用于商业用途。
 */

// 导入所有类型声明模块
import './modules/device'
import './modules/router'
import './modules/user'
import './modules/utils'
import './modules/vue'

// 重新导出常用类型，方便在其他文件中使用
export type {
  BackendRouteConfig,
  CacheOperation,
  ComponentRef,
  DeviceInfo,
  DynamicRouteManager,
  ElRef,
  LayoutMode,
  MenuItem,
  Nullable,
  PermissionResult,
  Recordable,
  RouteConfig,
  RouteMeta,
  RouteModule,
  RouteUtils,
  UserInfo,
} from './modules/router'

// 按需导出常用类型，便于使用
export type { DeviceInfo, DeviceType, ScreenSize } from './modules/device'
export type { MenuItem, RouteConfig, RouteMeta } from './modules/router'
export type { UserInfo, UserPermission, UserRole } from './modules/user'
export type { ComponentRef, Nullable, Recordable } from './modules/utils'
