const errorRoutes: RouteConfig[] = [
  {
    path: '/404',
    name: '404',
    component: () => import('@/views/notfound/not-found-page.vue'),
    meta: {
      title: '页面未找到',
      showLink: false,
      parent: 'fullscreen',
    },
  },
  {
    path: '/403',
    name: '403',
    component: () => import('@/views/notfound/forbidden-page.vue'),
    meta: {
      title: '访问被拒绝',
      showLink: false,
      parent: 'fullscreen',
    },
  },
  {
    path: '/500',
    name: '500',
    component: () => import('@/views/notfound/server-error-page.vue'),
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
