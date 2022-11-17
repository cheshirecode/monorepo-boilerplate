const { mergeConfig } = require('vite');
const { resolve, dirname, relative } = require('path');
const { rmdirSync } = require('fs');
const Unocss = require('@unocss/vite').default;
const transformToCJS = require('../scripts/esmTocjs.cjs');

const [aliasPath, outdir, aliasCleanup] = transformToCJS('alias.ts');
const [unocssConfigPath, , unocssCleanup] = transformToCJS('unocss.config.ts', true);
const alias = require(aliasPath).default;

Object.keys(alias).forEach((k) => {
  alias[k] = resolve(__dirname, alias[k].replace(outdir, '..'));
});

aliasCleanup();
const unocssConfig = require(unocssConfigPath).default;
unocssCleanup();
rmdirSync(outdir);

const config = {
  stories: ['../src/**/*.stories.mdx', '../src/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions'
  ],
  framework: '@storybook/react',
  core: {
    builder: '@storybook/builder-vite',
    disableTelemetry: true //
  },
  features: {
    babelModeV7: true,
    emotionAlias: false,
    modernInlineRender: true,
    storyStoreV7: true
  },
  reactOptions: { legacyRootApi: false },
  async viteFinal(config, { configType }) {
    // if (configType === 'DEVELOPMENT') {
    //   // Your development configuration goes here
    // }
    // if (configType === 'PRODUCTION') {
    //   // Your production configuration goes here.
    // }
    const root = dirname(require.resolve('@storybook/builder-vite'));
    // return the customized config
    const finalConfig = mergeConfig(config, {
      root,
      plugins: [Unocss({}, unocssConfig)],
      resolve: {
        alias
      },
      build: {
        commonjsOptions: {
          // handle commonjs syntax like require() in gs-ui-toolkit
          transformMixedEsModules: true
        }
      },
      optimizeDeps: {
        ...config.optimizeDeps,

        // https://github.com/storybookjs/builder-vite/issues/55#issuecomment-1071457280
        // https://github.com/storybookjs/builder-vite/issues/55#issuecomment-1095358176
        include: [
          ...(config?.optimizeDeps?.include ?? []),
          '@storybook/addon-docs > doctrine',
          '@storybook/addon-docs > slash',
          '@storybook/client-api > @storybook/csf',
          '@storybook/client-api > @mdx-js/react',
          '@storybook/client-api > fast-deep-equal',
          '@storybook/client-api > global',
          '@storybook/client-api > lodash/isFunction',
          '@storybook/client-api > lodash/isPlainObject',
          '@storybook/client-api > lodash/isString',
          '@storybook/client-api > lodash/mapValues',
          '@storybook/client-api > lodash/pick',
          '@storybook/client-api > lodash/pickBy',
          '@storybook/client-api > memoizerific',
          '@storybook/client-api > stable',
          '@storybook/client-api > synchronous-promise',
          '@storybook/client-api > ts-dedent',
          '@storybook/react > doctrine',
          '@storybook/react > escodegen',
          '@storybook/react > html-tags',
          '@storybook/react > react-element-to-jsx-string > @base2/pretty-print-object',
          '@storybook/react > react-element-to-jsx-string > react-is',
          '@storybook/store > util-deprecate',
          'memoizerific',
          'react > react-is',
          'uuid-browser',
          '@mdx-js/react',
          '@storybook/addon-docs/blocks'
        ],
        entries: [`${relative(root, resolve(__dirname, '../src'))}/**/*.stories.tsx`]
      }
    });
    // console.log(finalConfig);
    return finalConfig;
  }
};
module.exports = config;
