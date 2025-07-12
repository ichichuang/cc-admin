import type { RouteConfig } from '@/router/types'

const homeRoutes: RouteConfig[] = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/login/index.vue'),
    meta: {
      title: '登录',
      rank: 1,
      parent: 'fullscreen',
    },
  },
]

export default homeRoutes
