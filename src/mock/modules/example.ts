import type { MockMethod, MockRequestOption } from '../types'
import type { ApiResponse, CreateUserRequest, MockUser, UpdateUserRequest } from './types'

// 模拟用户数据
const mockUsers: MockUser[] = [
  {
    id: 1,
    username: 'admin',
    email: 'admin@example.com',
    role: 'admin',
    status: 'active',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 2,
    username: 'user1',
    email: 'user1@example.com',
    role: 'user',
    status: 'active',
    createdAt: '2024-01-02T00:00:00Z',
    updatedAt: '2024-01-02T00:00:00Z',
  },
  {
    id: 3,
    username: 'user2',
    email: 'user2@example.com',
    role: 'user',
    status: 'inactive',
    createdAt: '2024-01-03T00:00:00Z',
    updatedAt: '2024-01-03T00:00:00Z',
  },
]

// 生成新用户ID
const generateId = (): number => Math.max(...mockUsers.map(user => user.id), 0) + 1

// 创建 Mock 接口配置
const exampleMock: MockMethod[] = [
  // 获取用户列表
  {
    url: '/api/users',
    method: 'GET',
    response: (): ApiResponse<MockUser[]> => ({
      code: 200,
      message: '获取用户列表成功',
      data: mockUsers,
    }),
  },

  // 获取单个用户
  {
    url: '/api/users/:id',
    method: 'GET',
    response: ({ params }: MockRequestOption): ApiResponse<MockUser | null> => {
      const id = parseInt(params.id)
      const user = mockUsers.find(u => u.id === id)

      if (!user) {
        return {
          code: 404,
          message: '用户不存在',
          data: null,
        }
      }

      return {
        code: 200,
        message: '获取用户成功',
        data: user,
      }
    },
  },

  // 创建用户
  {
    url: '/api/users',
    method: 'POST',
    response: ({ body }: MockRequestOption): ApiResponse<MockUser> => {
      const createData = body as CreateUserRequest
      const newUser: MockUser = {
        id: generateId(),
        ...createData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      mockUsers.push(newUser)

      return {
        code: 201,
        message: '创建用户成功',
        data: newUser,
      }
    },
  },

  // 更新用户
  {
    url: '/api/users/:id',
    method: 'PUT',
    response: ({ params, body }: MockRequestOption): ApiResponse<MockUser | null> => {
      const id = parseInt(params.id)
      const userIndex = mockUsers.findIndex(u => u.id === id)
      const updateData = body as UpdateUserRequest

      if (userIndex === -1) {
        return {
          code: 404,
          message: '用户不存在',
          data: null,
        }
      }

      const updatedUser: MockUser = {
        ...mockUsers[userIndex],
        ...updateData,
        updatedAt: new Date().toISOString(),
      }

      mockUsers[userIndex] = updatedUser

      return {
        code: 200,
        message: '更新用户成功',
        data: updatedUser,
      }
    },
  },

  // 删除用户
  {
    url: '/api/users/:id',
    method: 'DELETE',
    response: ({ params }: MockRequestOption): ApiResponse<null> => {
      const id = parseInt(params.id)
      const userIndex = mockUsers.findIndex(u => u.id === id)

      if (userIndex === -1) {
        return {
          code: 404,
          message: '用户不存在',
          data: null,
        }
      }

      mockUsers.splice(userIndex, 1)

      return {
        code: 200,
        message: '删除用户成功',
        data: null,
      }
    },
  },
]

export default exampleMock
