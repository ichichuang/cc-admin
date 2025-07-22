import { t } from '@/locales'
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
