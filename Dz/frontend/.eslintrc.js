module.exports = {
    env: {
      browser: true,
      node: true,
      es2021: true,
    },
    extends: [
      'eslint:recommended',
      'plugin:vue/vue3-essential', // 使用 Vue 3
    ],
    parserOptions: {
      ecmaVersion: 12,
      sourceType: 'module',
    },
    globals: {
      Web3: 'readonly', // 将 Web3 设置为全局只读变量
    },
    rules: {
      'no-undef': 'off', // 关闭 no-undef 规则
    },
  };
  