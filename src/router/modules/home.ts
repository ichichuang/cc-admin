import type { RouteConfig } from '../types'

const homeRoutes: RouteConfig[] = [
  {
    path: '/home',
    name: 'Home',
    component: () => import('@/views/home/index.vue'),
    meta: {
      title: '首页',
      rank: 1,
    },
  },
]

export default homeRoutes
