# 安装
```sh
yarn add -D eslint  @typescript-eslint/eslint-plugin @typescript-eslint/parser eslint-plugin-vue @vue/eslint-config-typescript
```

**.eslintrc.js**
```js
module.exports = {
  "root": true,
  env: {
    browser: true,
    "node": true,
    es2021: true,
  },
  extends: [
    'plugin:vue/vue3-recommended',
    'eslint:recommended',
    '@vue/typescript/recommended',
    '@vue/prettier',
    '@vue/prettier/@typescript-eslint'
  ],
  parserOptions: {
    ecmaVersion: 2021,
  },
}
```

**package.json**
```json
{
  "scripts": {
    "lint": "eslint --ext .ts,tsx,vue src/**"
  }
}
```

```sh
yarn add -D prettier eslint-plugin-prettier @vue/eslint-config-prettier
```
**.eslintrc.js**
```diff
module.exports = {
  extends: [
+    '@vue/prettier',
+    '@vue/prettier/@typescript-eslint'
  ],
}
```
