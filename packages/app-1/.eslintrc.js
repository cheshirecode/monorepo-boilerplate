// Add your "extends" boilerplate here, for example:
require('@rushstack/eslint-patch/modern-module-resolution');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const baseConfig = require('@fieryeagle/eslint-config-react');

module.exports = {
  extends: ['@fieryeagle/eslint-config-react'],
  parserOptions: {
    ...baseConfig.parserOptions,
    tsconfigRootDir: __dirname
  },
  settings: {
    ...baseConfig.settings,
    'import/core-modules': ['virtual:uno.css'],
    'import/resolver': {
      typescript: {}
    }
  },
  rules: {
    ...baseConfig.rules,
    '@typescript-eslint/ban-ts-comment': 'off'
  }
};
