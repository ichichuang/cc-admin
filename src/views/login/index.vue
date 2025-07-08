<script setup lang="ts">
import { login } from '@/api/modules/auth'
import { useUserStoreWithOut } from '@/stores'

const userStore = useUserStoreWithOut()

const handleLogin = async () => {
  login({ username: 'admin', password: '123456' }).then(({ token }) => {
    userStore.setToken(token)
  })
}
</script>
<template>
  <div class="w-full h-full center">
    <button
      type="button"
      class="btn btn-primary"
      @click="handleLogin"
    >
      登录
    </button>
  </div>
</template>
<style lang="scss" scope></style>
