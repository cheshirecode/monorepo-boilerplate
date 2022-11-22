module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    ecmaFeatures: {
      jsx: true
    },
    tsconfigRootDir: __dirname
  },
  env: {
    browser: true,
    node: true,
    'shared-node-browser': true
  },
  plugins: ['prettier', '@typescript-eslint', 'react', 'react-hooks', 'jsx-a11y', 'unused-imports'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:jsx-a11y/recommended',
    'plugin:import/recommended',
    'plugin:import/typescript'
  ],
  rules: {
    'prettier/prettier': 'error',
    'no-unreachable': 'error',
    'no-console': 'error',
    '@typescript-eslint/ban-ts-comment': 'off',
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': [
      'warn',
      { vars: 'all', varsIgnorePattern: '^_', args: 'after-used', argsIgnorePattern: '^_' }
    ],
    'sort-imports': [
      'error',
      {
        ignoreCase: true,
        ignoreDeclarationSort: true, // use eslint-plugin-import instead
        ignoreMemberSort: false,
        memberSyntaxSortOrder: ['none', 'all', 'multiple', 'single'],
        allowSeparatedGroups: true
      }
    ],
    'import/order': [
      'error',
      {
        groups: ['builtin', 'external', 'internal', ['sibling', 'parent'], 'index', 'unknown'],
        'newlines-between': 'always',
        alphabetize: {
          order: 'asc',
          caseInsensitive: true
        }
      }
    ],
    'react-hooks/rules-of-hooks': 'error', // Checks rules of Hooks
    'react-hooks/exhaustive-deps': 'warn', // Checks effect dependencies
    'react/display-name': 'off',
    'react/prop-types': 'off',
    // suppress errors for missing 'import React' in files
    'react/react-in-jsx-scope': 'off'
    // // allow jsx syntax in js files (for next.js project)
    // 'react/jsx-filename-extension': [1, { extensions: ['.js', '.jsx', '.ts', 'tsx'] }] //should add ".ts" if typescript project
  },
  settings: {
    react: {
      version: 'detect'
    },
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.tsx']
    },
    'import/resolver': {
      typescript: {}
    }
  }
};
