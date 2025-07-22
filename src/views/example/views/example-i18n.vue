<script setup lang="ts">
import { computed, getCurrentInstance } from 'vue'

// 通过 getCurrentInstance 获取全局属性
const instance = getCurrentInstance()
const { $t, $d, $n, $te } = instance!.appContext.app.config.globalProperties

// 或者直接使用全局属性（在模板中可以直接使用 $t）
const dynamicTitle = computed(() => $t('common.system.title'))
const formattedDate = computed(() => $d(new Date(), 'datetime'))
const formattedNumber = computed(() => $n(1234.56))

// 检查翻译键是否存在
const checkKey = (key: string) => {
  return $te(key)
}

console.log('Translation key exists:', checkKey('common.actions.confirm'))
console.log('Current title:', $t('dashboard.title'))
</script>

<template>
  <div class="example-i18n">
    <div class="header">
      <h1>{{ $t('dashboard.title') }}</h1>
      <p>{{ $t('dashboard.welcome') }}</p>
    </div>

    <div class="content">
      <div class="section">
        <h2>{{ $t('common.actions.confirm') }}</h2>
        <p>{{ $t('common.status.loading') }}</p>
      </div>

      <div class="section">
        <h2>{{ $t('user.profile.title') }}</h2>
        <ul>
          <li>{{ $t('user.profile.username') }}: Admin</li>
          <li>{{ $t('user.profile.email') }}: admin@example.com</li>
          <li>{{ $t('user.status.active') }}</li>
        </ul>
      </div>

      <div class="section">
        <h2>{{ $t('auth.login.title') }}</h2>
        <form>
          <div class="form-item">
            <label>{{ $t('auth.login.username') }}</label>
            <input
              type="text"
              :placeholder="$t('auth.login.username')"
            />
          </div>
          <div class="form-item">
            <label>{{ $t('auth.login.password') }}</label>
            <input
              type="password"
              :placeholder="$t('auth.login.password')"
            />
          </div>
          <button type="button">{{ $t('auth.login.loginButton') }}</button>
        </form>
      </div>

      <div class="section">
        <h2>{{ $t('router.dashboard.dashboard') }}</h2>
        <nav>
          <ul>
            <li>{{ $t('router.core.login') }}</li>
            <li>{{ $t('router.example.example') }}</li>
            <li>{{ $t('router.example.i18n') }}</li>
            <li>{{ $t('router.example.unocss') }}</li>
          </ul>
        </nav>
      </div>

      <!-- 带参数的翻译示例 -->
      <div class="section">
        <h2>参数化翻译示例</h2>
        <p>{{ $t('common.table.total', { total: 100 }) }}</p>
        <p>{{ $t('common.table.page', { page: 1 }) }}</p>
      </div>

      <!-- 条件翻译示例 -->
      <div class="section">
        <h2>条件翻译示例</h2>
        <div v-if="$te('user.management.userCount')">
          <p>键存在: {{ $t('user.management.userCount') }}</p>
        </div>
        <div v-else>
          <p>键不存在</p>
        </div>
      </div>

      <!-- 在脚本中使用全局函数 -->
      <div class="section">
        <h2>脚本中使用示例</h2>
        <p>动态标题: {{ dynamicTitle }}</p>
        <p>格式化日期: {{ formattedDate }}</p>
        <p>格式化数字: {{ formattedNumber }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.example-i18n {
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
}

.header {
  text-align: center;
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 1px solid #eee;
}

.header h1 {
  color: #333;
  margin-bottom: 10px;
}

.header p {
  color: #666;
  font-size: 16px;
}

.content {
  display: grid;
  gap: 30px;
}

.section {
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background: #f9f9f9;
}

.section h2 {
  color: #444;
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom: 1px solid #ddd;
}

.section ul {
  list-style: none;
  padding: 0;
}

.section li {
  padding: 5px 0;
  border-bottom: 1px solid #eee;
}

.form-item {
  margin-bottom: 15px;
}

.form-item label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
  color: #555;
}

.form-item input {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 14px;
}

button {
  background: #007bff;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

button:hover {
  background: #0056b3;
}

nav ul {
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
}

nav li {
  background: #e9ecef;
  padding: 8px 12px;
  border-radius: 4px;
  border: none !important;
}
</style>
