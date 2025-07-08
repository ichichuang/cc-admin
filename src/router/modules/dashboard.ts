const homeRoutes: RouteConfig[] = [
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('@/views/dashboard/index.vue'),
    meta: {
      title: '仪表盘',
      rank: 1,
      roles: ['admin', 'user'],
    },
  },
]

export default homeRoutes
