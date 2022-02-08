/* eslint-disable prettier/prettier */
module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: ['standard', 'prettier', 'plugin:prettier/recommended', 'plugin:vue/vue3-recommended'],
  parserOptions: {
    ecmaVersion: 12,
    parser: '@typescript-eslint/parser',
    sourceType: 'module',
  },
  plugins: ['vue', '@typescript-eslint'],
  rules: {
    // 当使用了eslint-plugin-vue vue3-recommended时，该规则似乎是被默认off掉的，尽管我在文档上看这跳规则是属于vue2 essential的
    'vue/no-multiple-template-root': 'off',
    '@typescript-eslint/no-unused-vars': 'error',
    // 会和prettier的printWidth规则冲突，所以关掉
    'vue/max-attributes-per-line': 'off',
    'vue/singleline-html-element-content-newline': 'off',
    'vue/html-indent': 'off',
    'vue/html-closing-bracket-newline': 'off',
    'vue/html-self-closing': 'off',
  },
  // 全局变量，这里一般放全局的ts类型声明，不然无法通过eslint的no-undef校验
  globals: {
    ID: true,
    Recordable: true,
    PageResponse: true,
    defineProps: 'readonly',
    defineEmits: 'readonly',
    defineExpose: 'readonly',
    withDefaults: 'readonly',
  },
}
