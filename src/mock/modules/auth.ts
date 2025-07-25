import type { MockMethod } from 'vite-plugin-mock'

// 模拟用户数据
const mockUser: (UserInfo & { password: string })[] = [
  {
    userId: '1',
    username: 'admin',
    password: '123456', // 添加密码字段
    roles: ['admin'],
    permissions: ['read', 'write', 'delete'],
    email: 'admin@example.com',
    avatar: 'https://i.pravatar.cc/150?img=1',
    phone: '12345678901',
  },
]

const MOCK_TOKEN = 'fake-jwt-token-123456'

export default [
  {
    url: '/auth/login',
    method: 'post',
    response: ({ body }: { body: { username: string; password: string } }) => {
      const { username, password } = body

      const user = mockUser.find(item => item.username === username)
      if (!user) {
        return {
          success: false,
          message: '用户不存在',
        }
      }

      if (user.password !== password) {
        return {
          success: false,
          message: '密码错误',
        }
      }

      // 登录成功，返回模拟的响应
      return {
        success: true,
        message: '登录成功',
        token: MOCK_TOKEN, // 模拟的 token
      }
    },
  },
  {
    url: '/auth/userInfo',
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

      // 从 token 中获取用户信息，这里简化处理，直接返回第一个用户
      const user = mockUser[0]
      if (!user) {
        return {
          success: false,
          message: '用户不存在',
        }
      }

      // 移除密码字段，不返回给前端
      const { password: _password, ...userInfo } = user

      return {
        message: '获取用户信息成功',
        data: userInfo,
      }
    },
  },
] as MockMethod[]
