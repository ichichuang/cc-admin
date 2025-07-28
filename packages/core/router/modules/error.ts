/**
 * @copyright Copyright (c) 2025 chichuang
 * @license MIT
 * @description cc-admin 企业级后台管理框架 - 路由管理
 * 本文件为 chichuang 原创，禁止擅自删除署名或用于商业用途。
 */

// 临时移除t函数，使用硬编码标题
const t = (key: string) => key
const errorRoutes: RouteConfig[] = [
  {
    path: '/404',
    name: '404',
    component: () => import('@/views/notfound/not-found-page.vue'),
    meta: {
      title: t('router.error.notFound'),
      showLink: false,
      parent: 'fullscreen',
    },
  },
  {
    path: '/403',
    name: '403',
    component: () => import('@/views/notfound/forbidden-page.vue'),
    meta: {
      title: t('router.error.forbidden'),
      showLink: false,
      parent: 'fullscreen',
    },
  },
  {
    path: '/500',
    name: '500',
    component: () => import('@/views/notfound/server-error-page.vue'),
    meta: {
      title: t('router.error.serverError'),
      showLink: false,
      parent: 'fullscreen',
    },
  },
  // 捕获所有未匹配的路由，重定向到404页面
  {
    path: '/:pathMatch(.*)*',
    name: 'CatchAll',
    redirect: '/404',
  },
]

export default errorRoutes
