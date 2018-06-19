module.exports = {
    root: true,
    env: {
        node: true
    },
    'extends': [
        'plugin:vue/essential',
        '@vue/standard'
    ],
    rules: {
        'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
        'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
        'indent': 0,
        'semi': 0,
        'space-before-function-paren': 0,
        'vue/no-parsing-error': [2, { 'x-invalid-end-tag': false }]
    },
    parserOptions: {
        parser: 'babel-eslint'
    }
}
