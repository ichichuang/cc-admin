/**
 * @copyright Copyright (c) 2025 chichuang
 * @license MIT
 * @description cc-admin 企业级后台管理框架 - 路由管理
 * 本文件为 chichuang 原创，禁止擅自删除署名或用于商业用途。
 */

// 临时移除t函数，使用硬编码标题
const t = (key: string) => key
const homeRoutes: RouteConfig[] = [
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('@/views/dashboard/index.vue'),
    meta: {
      title: t('router.dashboard.dashboard'),
      rank: 1,
      roles: ['admin', 'user'],
    },
  },
]

export default homeRoutes
