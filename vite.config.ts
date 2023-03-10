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
      fileName: (format) => `[name].${format == 'es' ? 'js' : format}`,
      formats: ["es", "cjs"]
    },
    rollupOptions: {
      input: {
        index: "./src/lib/index.ts",
        graph: "./src/lib/Graph.tsx",
        hooks: "./src/lib/hooks.ts",
        utils: "./src/lib/utils.ts",
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
