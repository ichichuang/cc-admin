/**
 * @copyright Copyright (c) 2025 chichuang
 * @license MIT
 * @description cc-early-bird 企业级后台管理框架 - Vite 配置
 * 本文件为 chichuang 原创，禁止擅自删除署名或用于商业用途。
 */

import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import { resolve } from 'path'
import UnoCSS from 'unocss/vite'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [vue(), vueJsx(), UnoCSS()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@cc/early-bird-core': resolve(__dirname, '../../packages/core'),
      '@cc/early-bird-ui': resolve(__dirname, '../../packages/ui'),
      '@cc/early-bird-types': resolve(__dirname, '../../packages/types'),
    },
  },
  server: {
    port: 3000,
    host: true,
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
})
