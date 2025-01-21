import js from '@eslint/js'

export default [
  js.configs.recommended,
  {
    rules: {
      'no-unused-vars': 'warn',
      'no-undef': 'error',
    },
    files: ['src/lib/*.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      globals: { window: true, console: true },
    },
  },
]
