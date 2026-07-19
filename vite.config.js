import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'

// Shared proxy config — used by both dev server and preview server
const proxyConfig = {
  '/login': {
    target: 'http://localhost:8082',
    changeOrigin: true
  },
  '/save-image': {
    target: 'http://localhost:8082',
    changeOrigin: true
  },
  '/save-diploma': {
    target: 'http://localhost:8082',
    changeOrigin: true
  },
  '/search-certificate': {
    target: 'http://localhost:8082',
    changeOrigin: true
  },
  '/search-diploma': {
    target: 'http://localhost:8082',
    changeOrigin: true
  },
  '/certificate': {
    target: 'http://localhost:8082',
    changeOrigin: true
  },
  // /diploma 是前端页面，/diploma/<filename> 是后端静态文件，所以只在带文件名时才代理
  // 改用 rewrite 方式：把 /diploma-select 排除
  // 注意: '/diploma' 这条规则会拦截 /diploma 和 /diploma-select
  // 因此使用更精确的匹配：仅匹配 /diploma/xxx.jpg 等
  '^/diploma/': {
    target: 'http://localhost:8082',
    changeOrigin: true
  }
}

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    port: 3000,
    open: true,
    proxy: proxyConfig
  },
  preview: {
    port: 3000,
    proxy: proxyConfig
  }
})
