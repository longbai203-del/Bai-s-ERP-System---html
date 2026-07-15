import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';

export default defineConfig({
    plugins: [vue()],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
            '@core': path.resolve(__dirname, './src/core'),
            '@components': path.resolve(__dirname, './src/components'),
            '@services': path.resolve(__dirname, './src/services'),
            '@utils': path.resolve(__dirname, './src/utils'),
            '@modules': path.resolve(__dirname, './src/modules'),
            '@views': path.resolve(__dirname, './src/views'),
            '@assets': path.resolve(__dirname, './src/assets'),
            '@compatibility': path.resolve(__dirname, './src/compatibility')
        }
    },
    server: {
        port: 5173,
        proxy: {
            '/api': {
                target: 'http://localhost:3000',
                changeOrigin: true
            }
        }
    }
});