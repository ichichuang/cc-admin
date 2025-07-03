import type { RouteConfig } from '../types'

const errorRoutes: RouteConfig[] = [
  {
    path: '/404',
    name: 'NotFound',
    component: () => import('@/views/notfound/NotFoundPage.vue'),
    meta: {
      title: '页面未找到',
      showLink: false,
      parent: 'fullscreen',
    },
  },
  {
    path: '/403',
    name: 'Forbidden',
    component: () => import('@/views/notfound/ForbiddenPage.vue'),
    meta: {
      title: '访问被拒绝',
      showLink: false,
      parent: 'fullscreen',
    },
  },
  {
    path: '/500',
    name: 'ServerError',
    component: () => import('@/views/notfound/ServerErrorPage.vue'),
    meta: {
      title: '服务器错误',
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
