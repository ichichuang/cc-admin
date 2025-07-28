<!--
  @copyright Copyright (c) 2025 chichuang
  @license MIT
  @description CC-Admin 企业级后台管理框架 - 页面组件
  本文件为 chichuang 原创，禁止擅自删除署名或用于商业用途。
-->

<script setup lang="ts">
import { login } from '@/api/modules/auth'
import { useUserStoreWithOut } from '@/stores'
import { ref } from 'vue'

const userStore = useUserStoreWithOut()
const loading = ref(false)
const result = ref('')

const handleLogin = async () => {
  loading.value = true
  result.value = ''

  try {
    const { token } = await login({ username: 'admin', password: '123456' })
    userStore.setToken(token)
  } catch (error) {
    console.error('❌ 登录失败:', error)
    result.value = `登录失败: ${error instanceof Error ? error.message : String(error)}`
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="container center">
    <button
      type="button"
      class="btn btn-primary"
      :disabled="loading"
      @click="handleLogin"
    >
      {{ loading ? '登录中...' : '登录' }}
    </button>
  </div>
</template>
