// Add your "extends" boilerplate here, for example:
require('@rushstack/eslint-patch/modern-module-resolution');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const baseConfig = require('@fieryeagle/eslint-config-react');

module.exports = {
  extends: ['@fieryeagle/eslint-config-react'],
  parserOptions: {
    ...baseConfig.parserOptions
  },
  settings: {
    ...baseConfig.settings,
    'import/core-modules': ['virtual:uno.css']
  },
  rules: {
    ...baseConfig.rules
  }
};
