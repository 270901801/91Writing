import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import { resolve } from 'path'

export default defineConfig({
  base: './',
  plugins: [
    vue(),
    AutoImport({
      resolvers: [ElementPlusResolver()],
      imports: ['vue', 'vue-router', 'pinia'],
      dts: true
    }),
    Components({
      resolvers: [ElementPlusResolver()]
    })
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },
  server: {
    port: 7520,
    open: true,
    proxy: {
      // 代理所有外部API请求，绕过浏览器CORS限制
      // 代理 /v1/* 路径到 NVIDIA API
      '/v1/': {
        target: 'https://integrate.api.nvidia.com', // NVIDIA API服务器地址
        changeOrigin: true,
        secure: true, // 目标服务器使用HTTPS
        rewrite: (path) => path // 保留完整路径，/v1/models -> /v1/models
      },
      // 保留单独的 /v1 代理
      '/v1': {
        target: 'https://integrate.api.nvidia.com', // NVIDIA API服务器地址
        changeOrigin: true,
        secure: true, // 目标服务器使用HTTPS
        rewrite: (path) => path // 保留完整路径
      },
      // 代理到OpenAI兼容的API端点
      '/chat/completions': {
        target: 'https://integrate.api.nvidia.com', // NVIDIA API服务器地址
        changeOrigin: true,
        secure: true, // 目标服务器使用HTTPS
        rewrite: (path) => path // 保留完整路径
      },
      // 代理模型列表接口
      '/models': {
        target: 'https://integrate.api.nvidia.com', // NVIDIA API服务器地址
        changeOrigin: true,
        secure: true, // 目标服务器使用HTTPS
        rewrite: (path) => path
      },
      // 为其他可能的API端点添加通配符代理
      '^/api/.*': {
        target: 'https://integrate.api.nvidia.com', // 或者您的实际API服务器地址
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/api/, '') // 移除/api前缀
      }
    }
  }
})