// Add your "extends" boilerplate here, for example:
import baseConfig from '@fieryeagle/eslint-config-react';

const config = {
  extends: ['@fieryeagle/eslint-config-react'],
  parserOptions: {
    ...baseConfig.parserOptions,
    tsconfigRootDir: __dirname
  },
  settings: {
    ...baseConfig.settings,
    'import/core-modules': ['virtual:uno.css']
  },
  rules: {
    ...baseConfig.rules,
    '@typescript-eslint/ban-ts-comment': 'off'
  }
};

export default config;
