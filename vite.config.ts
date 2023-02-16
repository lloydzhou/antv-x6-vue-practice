import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), vueJsx()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  build: {
    lib: {
      entry: './src/lib/*.ts',
      fileName: "[name]",
      formats: ["cjs", "es"]
    },
    rollupOptions: {
      input: {
        index: "./src/lib/index.ts",
        hooks: "./src/lib/hooks.ts",
      },
      external: ['vue', '@antv/x6'],
      output: {
        globals: {
          '@antv/x6': 'X6',
          vue: 'Vue'
        }
      }
    }
  }
})
