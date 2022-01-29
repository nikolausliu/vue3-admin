```sh
yarn add husky@4.3.8 @commitlint/cli@12.0.1 @commitlint/config-conventional@12.0.1 lint-staged@10.5.4 -D
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
