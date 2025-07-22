import { t } from '@/locales'
const exampleRoutes: RouteConfig[] = [
  {
    path: '/example',
    name: 'Example',
    component: () => import('@/views/example/index.vue'),
    redirect: '/example/color',
    meta: {
      title: t('router.example.example'),
      rank: 1,
      parent: 'fullscreen',
    },
    children: [
      {
        path: 'color',
        name: 'ExampleColor',
        component: () => import('@/views/example/views/example-color.vue'),
        meta: {
          title: t('router.example.color'),
          rank: 1,
        },
      },
      {
        path: 'size',
        name: 'ExampleSize',
        component: () => import('@/views/example/views/example-size.vue'),
        meta: {
          title: t('router.example.size'),
          rank: 2,
        },
      },
      {
        path: 'i18n',
        name: 'ExampleI18n',
        component: () => import('@/views/example/views/example-i18n.vue'),
        meta: {
          title: t('router.example.i18n'),
          rank: 3,
        },
      },
      {
        path: 'rem',
        name: 'ExampleRem',
        component: () => import('@/views/example/views/example-rem.vue'),
        meta: {
          title: t('router.example.rem'),
          rank: 4,
        },
      },
    ],
  },
]

export default exampleRoutes
