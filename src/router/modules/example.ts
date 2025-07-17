const exampleRoutes: RouteConfig[] = [
  {
    path: '/example',
    name: 'Example',
    component: () => import('@/views/example/index.vue'),
    redirect: '/example/unocss',
    meta: {
      title: '示例',
      rank: 1,
      parent: 'fullscreen',
    },
    children: [
      {
        path: 'unocss',
        name: 'ExampleUnocss',
        component: () => import('@/views/example/views/example-unocss.vue'),
        meta: {
          title: 'Unocss 使用示例',
          rank: 1,
        },
      },
    ],
  },
]

export default exampleRoutes
