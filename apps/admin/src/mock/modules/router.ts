/**
 * @copyright Copyright (c) 2025 chichuang
 * @license MIT
 * @description cc-admin 企业级后台管理框架 - router
 * 本文件为 chichuang 原创，禁止擅自删除署名或用于商业用途。
 */

import type { MockMethod } from '@/mock/types'

const routes: BackendRouteConfig[] = [
  {
    path: '/user',
    name: 'User',
    component: 'user',
    meta: {
      title: '用户管理',
      icon: 'ep:user',
      rank: 1,
    },
  },
  {
    path: '/permission',
    name: 'Permission',
    meta: {
      title: '权限管理',
      icon: 'ep:lock',
      rank: 2,
    },
    children: [
      {
        path: 'page',
        name: 'PermissionPage',
        component: 'permission-page',
        meta: {
          title: '页面权限',
          roles: ['admin', 'common'],
        },
      },
      {
        path: 'button',
        name: 'PermissionButton',
        component: 'permission-button',
        meta: {
          title: '按钮权限',
          roles: ['admin'],
          auths: ['permission:btn:add', 'permission:btn:edit', 'permission:btn:delete'],
        },
      },
    ],
  },
]

const MOCK_TOKEN = 'fake-jwt-token-123456'

export default [
  {
    url: '/auth/routes',
    method: 'get',
    response: ({ headers }: { headers: { authorization: string } }) => {
      const auth = headers.authorization || ''
      const token = auth.replace(/^Bearer\s+/i, '')
      if (token !== MOCK_TOKEN) {
        return {
          success: false,
          message: '未授权或 token 无效',
        }
      }
      return {
        message: '获取路由信息成功',
        data: routes,
      }
    },
  },
] as MockMethod[]
