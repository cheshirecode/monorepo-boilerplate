// Add your "extends" boilerplate here, for example:
module.exports = {
  extends: ['@fieryeagle/eslint-config-react'],
  settings: {
    'import/core-modules': ['virtual:uno.css']
  },
  rules: {
    '@typescript-eslint/ban-ts-comment': 'off'
  }
};
