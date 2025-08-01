/**
 * @copyright Copyright (c) 2025 chichuang
 * @license MIT
 * @description cc-admin 企业级后台管理框架 - 核心路由
 * 本文件为 chichuang 原创，禁止擅自删除署名或用于商业用途。
 */

import type { RouteRecordRaw } from 'vue-router'

// 核心路由配置
const coreRoutes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../../../../apps/admin/src/views/dashboard/index.vue'),
    meta: {
      title: '首页',
      icon: 'dashboard',
    },
  },
  {
    path: '/example',
    name: 'Example',
    component: () => import('../../../../apps/admin/src/views/example/index.vue'),
    meta: {
      title: '示例页面',
      icon: 'example',
    },
  },
]

export default coreRoutes
