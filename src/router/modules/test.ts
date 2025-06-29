import type { RouteConfig } from '../types'

// Test 路由配置
const testRoutes: RouteConfig[] = [
  {
    path: '/test',
    name: 'Test',
    component: () => import('@/views/test/index.vue'),
    meta: {
      title: '测试页面',
      parent: 'admin', // 使用admin布局
      icon: '🧪',
      rank: 2,
      description: '功能测试和演示页面',
    },
  },
  {
    path: '/test/theme-variables',
    name: 'TestThemeVariables',
    component: () => import('@/views/test/views/test-theme-variables.vue'),
    meta: {
      title: '动态主题变量演示',
      parent: 'admin',
      rank: 3,
    },
  },
]

export default testRoutes
