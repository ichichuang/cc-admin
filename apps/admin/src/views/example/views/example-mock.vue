/** * @copyright Copyright (c) 2025 chichuang * @license MIT * @description cc-admin
企业级后台管理框架 - Mock 示例页面 * 本文件为 chichuang 原创，禁止擅自删除署名或用于商业用途。 */

<template>
  <div class="example-mock">
    <h1>HTTP 请求示例</h1>

    <div class="demo-section">
      <h2>基础 HTTP 方法</h2>
      <div class="button-group">
        <button @click="testGet">测试 GET 请求</button>
        <button @click="testPost">测试 POST 请求</button>
        <button @click="testPut">测试 PUT 请求</button>
        <button @click="testDelete">测试 DELETE 请求</button>
      </div>
      <div
        class="result"
        v-if="result"
      >
        <h3>请求结果：</h3>
        <pre>{{ JSON.stringify(result, null, 2) }}</pre>
      </div>
    </div>

    <div class="demo-section">
      <h2>自定义配置 HTTP 方法</h2>
      <div class="button-group">
        <button @click="testCustomHttp">测试自定义配置</button>
        <button @click="testMultipleServices">测试多服务</button>
      </div>
    </div>

    <div class="demo-section">
      <h2>当前 HTTP 配置</h2>
      <pre>{{ JSON.stringify(httpConfig, null, 2) }}</pre>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  createHttpMethods,
  del,
  get,
  getHttpConfig,
  post,
  put,
} from '@cc/early-bird-core/utils/http'
import { ref } from 'vue'

// 响应式数据
const result = ref<any>(null)
const httpConfig = ref(getHttpConfig())

// 基础 HTTP 方法测试
const testGet = async () => {
  try {
    result.value = await get('/api/users', { page: 1, size: 10 })
  } catch (error) {
    result.value = { error: error.message }
  }
}

const testPost = async () => {
  try {
    result.value = await post('/api/users', {
      name: '测试用户',
      email: 'test@example.com',
    })
  } catch (error) {
    result.value = { error: error.message }
  }
}

const testPut = async () => {
  try {
    result.value = await put('/api/users/1', {
      name: '更新用户',
      email: 'updated@example.com',
    })
  } catch (error) {
    result.value = { error: error.message }
  }
}

const testDelete = async () => {
  try {
    result.value = await del('/api/users/1')
  } catch (error) {
    result.value = { error: error.message }
  }
}

// 自定义配置 HTTP 方法测试
const testCustomHttp = async () => {
  try {
    // 创建自定义配置的 HTTP 方法
    const customHttp = createHttpMethods({
      baseURL: 'http://custom-api.example.com',
      timeout: 15000,
      headers: {
        'X-API-Version': 'v2',
        'X-Custom-Header': 'custom-value',
      },
    })

    result.value = await customHttp.get('/api/data')
  } catch (error) {
    result.value = { error: error.message }
  }
}

// 多服务测试
const testMultipleServices = async () => {
  try {
    // 用户服务
    const userHttp = createHttpMethods({
      baseURL: 'http://user-api.example.com',
      headers: { 'X-Service': 'user' },
    })

    // 订单服务
    const orderHttp = createHttpMethods({
      baseURL: 'http://order-api.example.com',
      headers: { 'X-Service': 'order' },
    })

    // 并行请求多个服务
    const [userResult, orderResult] = await Promise.all([
      userHttp.get('/users'),
      orderHttp.get('/orders'),
    ])

    result.value = {
      userService: userResult,
      orderService: orderResult,
    }
  } catch (error) {
    result.value = { error: error.message }
  }
}
</script>

<style scoped>
.example-mock {
  padding: 20px;
}

.demo-section {
  margin-bottom: 30px;
  padding: 20px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
}

.button-group {
  display: flex;
  gap: 10px;
  margin-bottom: 15px;
  flex-wrap: wrap;
}

.button-group button {
  padding: 8px 16px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.button-group button:hover {
  background-color: #0056b3;
}

.result {
  margin-top: 15px;
  padding: 15px;
  background-color: #f8f9fa;
  border-radius: 4px;
  border: 1px solid #e9ecef;
}

.result pre {
  margin: 0;
  white-space: pre-wrap;
  word-wrap: break-word;
  font-size: 12px;
  color: #333;
}

pre {
  background-color: #f8f9fa;
  padding: 10px;
  border-radius: 4px;
  border: 1px solid #e9ecef;
  font-size: 12px;
  overflow-x: auto;
}
</style>
