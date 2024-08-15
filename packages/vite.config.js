import { defineConfig } from 'vite'
import { resolve } from 'path'
import eslintPlugin from 'vite-plugin-eslint'

export default defineConfig({
  plugins: [eslintPlugin()],
  build: {
    minify: false,
    lib: {
      entry: resolve(__dirname, 'src/index.js'),
      name: 'arm-js-library',
      fileName: (format) => `arm-js-library.${format}.js`,
    },
    rollupOptions: {
      external: ['axios', 'lodash', 'mobx', 'uuid', 'crypto-js'],
      output: {
        globals: {
          axios: 'axios',
          lodash: '_',
          mobx: 'mobx',
          uuid: 'uuid',
          'crypto-js': 'CryptoJS',
        },
      },
    },
  },
})
