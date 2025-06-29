import type { RouteConfig } from '../types'

// Layout Demo 路由配置
const layoutDemoRoutes: RouteConfig[] = [
  {
    path: '/layout-demo/screen',
    name: 'LayoutDemoScreen',
    component: () => import('@/views/layout-demo/ScreenDemo.vue'),
    meta: {
      title: '大屏布局演示',
      parent: 'screen', // 使用screen布局
      description: '展示大屏布局模式的效果',
    },
  },
  {
    path: '/layout-demo/fullscreen',
    name: 'LayoutDemoFullscreen',
    component: () => import('@/views/layout-demo/FullScreenDemo.vue'),
    meta: {
      title: '全屏布局演示',
      parent: 'fullscreen', // 使用fullscreen布局
      description: '展示纯全屏布局模式的效果',
    },
  },
]

export default layoutDemoRoutes
