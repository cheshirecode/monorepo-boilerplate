// This is a workaround for https://github.com/eslint/eslint/issues/3458
require('@rushstack/eslint-config/patch/modern-module-resolution');

module.exports = {
  extends: [
    "@rushstack/eslint-config/profile/node-trusted-tool"
  ],
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    tsconfigRootDir: __dirname
  },
  env: {
    browser: true,
    node: true,
    'shared-node-browser': true
  },
};