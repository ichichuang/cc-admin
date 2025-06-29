import type { RouteConfig } from '../types'

// Dashboard 路由配置
const dashboardRoutes: RouteConfig[] = [
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('@/views/dashboard/index.vue'),
    meta: {
      title: '仪表盘',
      parent: 'admin', // 使用admin布局
      icon: '📊',
      rank: 1,
      description: '系统概览和数据统计',
    },
  },
]

export default dashboardRoutes
