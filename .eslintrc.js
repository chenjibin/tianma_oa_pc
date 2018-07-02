// https://eslint.org/docs/user-guide/configuring

module.exports = {
  root: true,
  parserOptions: {
    parser: 'babel-eslint'
  },
  env: {
    browser: true,
  },
  extends: [
    // https://github.com/vuejs/eslint-plugin-vue#priority-a-essential-error-prevention
    // consider switching to `plugin:vue/strongly-recommended` or `plugin:vue/recommended` for stricter rules.
    'plugin:vue/essential',
    // https://github.com/standard/standard/blob/master/docs/RULES-en.md
    'standard'
  ],
  // required to lint *.vue files
  plugins: [
    'vue'
  ],
  // add your custom rules here
  rules: {
    // allow async-await
    'generator-star-spacing': 'off',
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'indent': 0,
    'quotes': ['error', 'single'],
    'semi': 0,
//        "no-console": ["error"],
    'no-empty': 2,
    'no-eq-null': 2,
    'space-before-function-paren': 0,
    'no-new': 0,
    'no-fallthrough': 0,
    'no-unreachable': 0,
    'vue/no-parsing-error': [2, { 'x-invalid-end-tag': false }]
  }
}
