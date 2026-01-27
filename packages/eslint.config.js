import js from '@eslint/js'

export default [
  js.configs.recommended,
  {
    rules: {
      'no-unused-vars': 'warn',
      'no-undef': 'error',
    },
    files: ['src/lib/*.js', 'tests/units/*.js', 'tests/index.test.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      globals: {
        window: true,
        console: true,
        setTimeout: true,
        test: true,
        expect: true,
        describe: true,
        beforeEach: true,
        afterEach: true,
      },
    },
  },
]
