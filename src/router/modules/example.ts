/**
 * @copyright Copyright (c) 2025 chichuang
 * @license MIT
 * @description CC-Admin 企业级后台管理框架 - 路由管理
 * 本文件为 chichuang 原创，禁止擅自删除署名或用于商业用途。
 */

const exampleRoutes: RouteConfig[] = [
  {
    path: '/example',
    name: 'Example',
    component: () => import('@/views/example/index.vue'),
    redirect: '/example/color',
    meta: {
      titleKey: 'router.example.example',
      rank: 1,
      parent: 'fullscreen',
    },
    children: [
      {
        path: 'color',
        name: 'ExampleColor',
        component: () => import('@/views/example/views/example-color.vue'),
        meta: {
          titleKey: 'router.example.color',
          rank: 1,
        },
      },
      {
        path: 'size',
        name: 'ExampleSize',
        component: () => import('@/views/example/views/example-size.vue'),
        meta: {
          titleKey: 'router.example.size',
          rank: 2,
        },
      },
      {
        path: 'i18n',
        name: 'ExampleI18n',
        component: () => import('@/views/example/views/example-i18n.vue'),
        meta: {
          titleKey: 'router.example.i18n',
          rank: 3,
        },
      },
      {
        path: 'rem',
        name: 'ExampleRem',
        component: () => import('@/views/example/views/example-rem.vue'),
        meta: {
          titleKey: 'router.example.rem',
          rank: 4,
        },
      },
      {
        path: 'mock',
        name: 'ExampleMock',
        component: () => import('@/views/example/views/example-mock.vue'),
        meta: {
          titleKey: 'router.example.mock',
          rank: 5,
        },
      },
    ],
  },
]

export default exampleRoutes
