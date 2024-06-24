const path = require('node:path');
const { fileURLToPath } = require('node:url');
const { FlatCompat } = require('@eslint/eslintrc');
const prettier = require('eslint-plugin-prettier');
const globals = require('globals');
const js = require('@eslint/js');

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);
const compat = new FlatCompat({
  baseDirectory: dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

module.exports = [
  {
    ignores: [
      '**/node_modules/',
      '**/dist/',
      '**/webpack.config.js',
      '**/package.json',
      '**/jest.config.js',
      '**/babel.config.json',
      '**/__tests__/**/*',
      '**/*.test.js',
    ],
  },
  ...compat.extends('airbnb-base', 'prettier'),
  {
    plugins: {
      prettier,
    },

    languageOptions: {
      globals: {
        ...globals.node,
      },

      parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module',
        requireConfigFile: false,
        babelOptions: {
          presets: ['@babel/preset-env'],
        },
      },
    },
    parser: '@babel/eslint-parser',
    settings: {
      'import/resolver': {
        webpack: {
          config: path.join(__dirname, 'webpack.config.js'),
        },
      },
    },
    rules: {
      'prettier/prettier': ['error'],

      'import/extensions': [
        'error',
        {
          js: 'never',
          jsx: 'never',
          ts: 'never',
          tsx: 'never',
          css: 'always',
          jpg: 'always',
          svg: 'always',
          png: 'always',
          slice: 'always',
          actions: 'always',
          selector: 'always',
        },
      ],
    },
  },
];
