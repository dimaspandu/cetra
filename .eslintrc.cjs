module.exports = {
  root: true,
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    jsx: true,
  },
  plugins: ['@typescript-eslint'],
  rules: {
    // Basic formatting - as requested
    'semi': ['error', 'always'],
    'quotes': ['error', 'double'],
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
  }
};