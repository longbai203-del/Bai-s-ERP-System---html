import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  root: resolve(__dirname, 'frontend'),
  build: {
    outDir: resolve(__dirname, 'frontend'),
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'frontend/dashboard.html')
      }
    }
  },
  server: {
    port: 3000,
    open: true
  }
})
