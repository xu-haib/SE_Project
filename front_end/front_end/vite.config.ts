import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import { vitePluginFakeServer } from "vite-plugin-fake-server";

// https://vite.dev/config/
export default defineConfig(({ command }) => {
  const isDev = command === 'serve'
  const isBuild = command === 'build'
  return {
    plugins: [
      vue(),
      vueDevTools(),
      vitePluginFakeServer({
        include: 'mock',
        infixName: false,
        enableDev: false,
        enableProd: false
      }),
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      },
    },
    server: {
      proxy: {
        '/api': {
          target: 'http://localhost:8080',
          changeOrigin: true,
        }
      }
    }
  }
})
