import js from '@eslint/js'

export default [
  js.configs.recommended,
  {
    rules: {
      'no-unused-vars': 'warn',
      'no-undef': 'warn',
    },
    files: ['src/lib/*.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      globals: { window: true },
    },
  },
]
