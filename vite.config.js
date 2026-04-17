import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  base: '/foreign-website-project/',
  plugins: [vue()],
  server: {
    host: '0.0.0.0',
    port: 8081,
    proxy: {
      '/net-api': {
        target: 'http://10.20.67.138:8080',
        changeOrigin: true,
      }
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
