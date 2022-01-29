```sh
yarn add husky @commitlint/cli @commitlint/config-conventional -D
```

**package.json**

```json
{
  "lint-staged": {
    "*.{ts,tsx,vue}": "eslint",
    "*": "prettier -w -u"
  },
  "husky": {
    "hooks": {
      "commit-msg": "commitlint -E HUSKY_GIT_PARAMS",
      "pre-commit": "lint-staged"
    }
  }
}
```

**commitlint.config.js**

```js
module.exports = {
  extends: ['@commitlint/config-conventional'],
}
```
