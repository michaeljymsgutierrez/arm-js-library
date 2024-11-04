import { defineConfig } from 'vite'
import { resolve } from 'path'
import eslintPlugin from 'vite-plugin-eslint'

export default defineConfig({
  plugins: [eslintPlugin()],
  build: {
    emptyOutDir: false,
    minify: false,
    lib: {
      entry: resolve(__dirname, 'src/index.js'),
      name: 'arm-js-library',
      fileName: 'arm-js-library',
      formats: ['es'],
    },
    rollupOptions: {
      external: ['axios', 'lodash', 'mobx', 'uuid', 'md5'],
      output: {
        globals: {
          axios: 'axios',
          lodash: '_',
          mobx: 'mobx',
          uuid: 'uuid',
          md5: 'md5',
        },
      },
    },
    test: {
      globals: true,
      environment: 'jsdom',
      testDirectory: 'tests',
    },
  },
})
