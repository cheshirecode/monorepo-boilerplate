// Add your "extends" boilerplate here, for example:
module.exports = {
  extends: ['@rush-monorepo-boilerplate/eslint-config-react'],
  settings: {
    'import/core-modules': ['virtual:uno.css']
  },
  rules: {
    '@typescript-eslint/ban-ts-comment': 'off'
  }
};
