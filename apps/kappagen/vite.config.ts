import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'

import { libInjectCss } from 'vite-plugin-lib-inject-css'

export default defineConfig({
  plugins: [
    vue(),
    dts(),
    libInjectCss()
  ],
  build: {
    sourcemap: true,
    minify: false,
    target: 'esnext',
    lib: {
      entry: './src/index.ts',
      name: 'kappagen',
      fileName: 'kappagen'
    },
    rollupOptions: {
      external: ['vue'],
      output: {
        exports: 'default',
        globals: {
          vue: 'Vue'
        }
      }
    }
  }
})
