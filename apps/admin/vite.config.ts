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
      '@cc-admin/core': resolve(__dirname, '../../packages/core'),
      '@cc-admin/ui': resolve(__dirname, '../../packages/ui'),
      '@cc-admin/types': resolve(__dirname, '../../packages/types'),
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
