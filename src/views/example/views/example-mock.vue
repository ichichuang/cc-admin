<!--
  @copyright Copyright (c) 2025 chichuang
  @license MIT
  @description CC-Admin 企业级后台管理框架 - 页面组件
  本文件为 chichuang 原创，禁止擅自删除署名或用于商业用途。
-->

<script setup lang="ts">
import type { CreateUserRequest, MockUser } from '@/mock/modules/types'
import { onMounted, reactive, ref } from 'vue'

// 响应式数据
const users = ref<MockUser[]>([])
const loading = ref(false)
const message = ref('')

// 表单数据
const formData = reactive<CreateUserRequest>({
  username: '',
  email: '',
  role: 'user',
  status: 'active',
})

// 编辑状态
const editingUser = ref<MockUser | null>(null)
const isEditing = ref(false)

// 获取用户列表
const getUsers = async () => {
  loading.value = true
  message.value = ''

  try {
    const response = await fetch('/api/users')
    const result = await response.json()

    if (result.code === 200) {
      users.value = result.data
      message.value = result.message
    } else {
      message.value = `获取失败: ${result.message}`
    }
  } catch (error) {
    message.value = `请求失败: ${error}`
  } finally {
    loading.value = false
  }
}

// 获取单个用户
const getUser = async (id: number) => {
  loading.value = true
  message.value = ''

  try {
    const response = await fetch(`/api/users/${id}`)
    const result = await response.json()

    if (result.code === 200) {
      message.value = `获取用户成功: ${result.data.username}`
    } else {
      message.value = `获取失败: ${result.message}`
    }
  } catch (error) {
    message.value = `请求失败: ${error}`
  } finally {
    loading.value = false
  }
}

// 创建用户
const createUser = async () => {
  loading.value = true
  message.value = ''

  try {
    const response = await fetch('/api/users', {
      method: 'POST',
      body: JSON.stringify(formData),
    })
    response.headers.set('Content-Type', 'application/json')
    const result = await response.json()

    if (result.code === 201) {
      message.value = result.message
      // 重置表单
      Object.assign(formData, {
        username: '',
        email: '',
        role: 'user',
        status: 'active',
      })
      // 刷新列表
      await getUsers()
    } else {
      message.value = `创建失败: ${result.message}`
    }
  } catch (error) {
    message.value = `请求失败: ${error}`
  } finally {
    loading.value = false
  }
}

// 更新用户
const updateUser = async () => {
  if (!editingUser.value) {
    return
  }

  loading.value = true
  message.value = ''

  try {
    const response = await fetch(`/api/users/${editingUser.value.id}`, {
      method: 'PUT',
      body: JSON.stringify(formData),
    })
    response.headers.set('Content-Type', 'application/json')
    const result = await response.json()

    if (result.code === 200) {
      message.value = result.message
      // 重置编辑状态
      editingUser.value = null
      isEditing.value = false
      Object.assign(formData, {
        username: '',
        email: '',
        role: 'user',
        status: 'active',
      })
      // 刷新列表
      await getUsers()
    } else {
      message.value = `更新失败: ${result.message}`
    }
  } catch (error) {
    message.value = `请求失败: ${error}`
  } finally {
    loading.value = false
  }
}

// 删除用户
const deleteUser = async (id: number) => {
  if (!confirm('确定要删除这个用户吗？')) {
    return
  }

  loading.value = true
  message.value = ''

  try {
    const response = await fetch(`/api/users/${id}`, {
      method: 'DELETE',
    })
    const result = await response.json()

    if (result.code === 200) {
      message.value = result.message
      // 刷新列表
      await getUsers()
    } else {
      message.value = `删除失败: ${result.message}`
    }
  } catch (error) {
    message.value = `请求失败: ${error}`
  } finally {
    loading.value = false
  }
}

// 开始编辑
const startEdit = (user: MockUser) => {
  editingUser.value = user
  isEditing.value = true
  Object.assign(formData, {
    username: user.username,
    email: user.email,
    role: user.role,
    status: user.status,
  })
}

// 取消编辑
const cancelEdit = () => {
  editingUser.value = null
  isEditing.value = false
  Object.assign(formData, {
    username: '',
    email: '',
    role: 'user',
    status: 'active',
  })
}

// 格式化日期
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleString('zh-CN')
}

// 获取状态标签样式
const getStatusClass = (status: string) => {
  return status === 'active' ? 'color-successColor' : 'color-errorColor'
}

onMounted(() => {
  getUsers()
})
</script>

<template>
  <div class="example-mock">
    <!-- 操作说明 -->
    <div class="bg-bg200 color-primary100 border p-gap mb-gap sticky top-0 left-0 right-0">
      <div class="center-col gap-gap">
        <div class="text-lg font-bold">Mock 接口使用示例</div>
        <div class="text-sm color-text200">
          演示 CRUD 操作：获取用户列表、获取单个用户、创建用户、更新用户、删除用户
        </div>
        <div class="text-xs color-text200">基于自定义 Mock 服务，支持生产环境使用</div>
      </div>
    </div>

    <!-- 消息提示 -->
    <div
      v-if="message"
      class="bg-bg100 border border-bg300 p-gap rounded mb-gap"
      :class="message.includes('失败') ? 'color-errorColor' : 'color-successColor'"
    >
      {{ message }}
    </div>

    <!-- 表单区域 -->
    <div class="card mb-gap">
      <div class="center mb-gap">
        {{ isEditing ? '编辑用户' : '创建用户' }}
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-gap mb-gap">
        <div>
          <label class="text-sm color-text200">用户名</label>
          <input
            v-model="formData.username"
            type="text"
            class="input-base w-full"
            placeholder="请输入用户名"
          />
        </div>
        <div>
          <label class="text-sm color-text200">邮箱</label>
          <input
            v-model="formData.email"
            type="email"
            class="input-base w-full"
            placeholder="请输入邮箱"
          />
        </div>
        <div>
          <label class="text-sm color-text200">角色</label>
          <select
            v-model="formData.role"
            class="input-base w-full"
          >
            <option value="user">普通用户</option>
            <option value="admin">管理员</option>
          </select>
        </div>
        <div>
          <label class="text-sm color-text200">状态</label>
          <select
            v-model="formData.status"
            class="input-base w-full"
          >
            <option value="active">激活</option>
            <option value="inactive">禁用</option>
          </select>
        </div>
      </div>

      <div class="between">
        <div class="between gap-gap">
          <button
            @click="isEditing ? updateUser() : createUser()"
            class="btn-primary"
            :disabled="loading"
          >
            {{ loading ? '处理中...' : isEditing ? '更新' : '创建' }}
          </button>
          <button
            v-if="isEditing"
            @click="cancelEdit"
            class="btn-info"
            :disabled="loading"
          >
            取消
          </button>
        </div>
        <button
          @click="getUsers"
          class="btn-success"
          :disabled="loading"
        >
          {{ loading ? '刷新中...' : '刷新列表' }}
        </button>
      </div>
    </div>

    <!-- 用户列表 -->
    <div class="card">
      <div class="center mb-gap">用户列表</div>

      <div
        v-if="loading"
        class="center p-gap color-text200"
      >
        加载中...
      </div>

      <div
        v-else-if="users.length === 0"
        class="center p-gap color-text200"
      >
        暂无用户数据
      </div>

      <div
        v-else
        class="space-y-gap"
      >
        <div
          v-for="user in users"
          :key="user.id"
          class="bg-bg100 border border-bg300 p-gap rounded"
        >
          <div class="between mb-gap">
            <div class="font-bold color-primaryColor">{{ user.username }}</div>
            <div class="text-sm color-text200">ID: {{ user.id }}</div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-gap mb-gap text-sm">
            <div>
              <span class="color-text200">邮箱:</span>
              <span class="ml-gaps">{{ user.email }}</span>
            </div>
            <div>
              <span class="color-text200">角色:</span>
              <span class="ml-gaps">{{ user.role === 'admin' ? '管理员' : '普通用户' }}</span>
            </div>
            <div>
              <span class="color-text200">状态:</span>
              <span
                class="ml-gaps"
                :class="getStatusClass(user.status)"
              >
                {{ user.status === 'active' ? '激活' : '禁用' }}
              </span>
            </div>
            <div>
              <span class="color-text200">创建时间:</span>
              <span class="ml-gaps">{{ formatDate(user.createdAt) }}</span>
            </div>
          </div>

          <div class="between">
            <div class="between gap-gap">
              <button
                @click="getUser(user.id)"
                class="btn-info text-sm"
                :disabled="loading"
              >
                获取详情
              </button>
              <button
                @click="startEdit(user)"
                class="btn-warning text-sm"
                :disabled="loading"
              >
                编辑
              </button>
              <button
                @click="deleteUser(user.id)"
                class="btn-error text-sm"
                :disabled="loading"
              >
                删除
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scope></style>
