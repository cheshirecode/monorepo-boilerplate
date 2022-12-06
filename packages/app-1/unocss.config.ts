import type { UserConfig } from 'unocss';
import { defineConfig, presetAttributify, presetUno, transformerVariantGroup } from 'unocss';

import { rules, shortcuts } from './src/styles/grid';
import { breakpoints, lineHeight, MAX_GRID_SIZE, MAX_REM_UNITS } from './src/styles/tokens';

const extraSizes = Array(MAX_REM_UNITS)
  .fill(0)
  .reduce(
    (prev, x, i) => ({
      ...prev,
      [i + 1]: `${(i + 1) * 0.25}rem`
    }),
    {}
  );

const extraGridTemplates: Record<number, string> = Array(MAX_GRID_SIZE)
  .fill(0)
  .reduce(
    (prev, x, i) => ({
      ...prev,
      [i + 13]: `repeat(${i + 13}, minmax(0, 1fr))`
    }),
    {}
  );

const safelist = Object.keys(breakpoints)
  .concat('')
  .flatMap((x) =>
    ['grid-cols', 'grid-rows']
      .flatMap((x) => Object.keys(extraGridTemplates).map((y) => `${x}-${y}`))
      .map((y) => `${x ? `${x}:` : ''}${y}`)
  );

const config: UserConfig = defineConfig({
  include: [/\.[jt]sx?$/],
  safelist,
  theme: {
    screens: breakpoints,
    breakpoints,
    colors: {
      blue: {
        'dark-moderate': '#3a649e' // https://www.colorhexa.com/3a649e
      },
      cyan: {
        dark: '#0F747E'
      }
    },
    fontSize: {
      // based on https://grtcalculator.com/
      h1: ['2.625rem', lineHeight.h1],
      h2: ['2.0625rem', lineHeight.h2],
      h3: ['1.625rem', lineHeight.h3],
      h4: ['1.125rem', lineHeight.h4],
      h5: ['1rem', lineHeight.h5],
      h6: ['0.8125rem', lineHeight.h6],
      small: ['0.75rem', lineHeight.h6],
      default: '1rem'
    },
    lineHeight,
    maxWidth: {
      custom: 'clamp(900px, 80%, 1440px)',
      ...extraSizes
    },
    maxHeight: {
      ...extraSizes
    },
    minWidth: {
      ...extraSizes
    },
    minHeight: {
      ...extraSizes
    },
    height: {
      ...extraSizes
    },
    width: {
      ...extraSizes
    },
    gridTemplateRows: {
      main: '1fr auto auto auto',
      ...extraGridTemplates
    },
    gridTemplateColumns: {
      main: '1fr auto auto auto',
      ...extraGridTemplates
    },
    listStyleType: {
      none: 'none',
      disc: 'disc',
      decimal: 'decimal',
      square: 'square',
      roman: 'upper-roman'
    },
    animation: {
      'fade-in-slow': 'fade-in 2s ease 1s'
    }
  },
  presets: [
    presetUno(),
    presetAttributify({
      prefix: 'uno-',
      prefixedOnly: true
    })
  ],
  transformers: [transformerVariantGroup()],
  layers: {
    preflights: -1,
    components: 0,
    default: 1,
    utilities: 2,
    rules: 3,
    shortcuts: 4,
    o: 5 // custom variant - uno-layer-o:{class} to override the other layers
  },
  variants: [
    // another more powerful override over 3rd party CSS classes
    (matcher) =>
      !matcher.startsWith('override:')
        ? matcher
        : {
            matcher: matcher.slice('override:'.length),
            selector: (s) => `html ${s}`
          }
  ],
  rules: [...rules],
  shortcuts: [
    ...(shortcuts as []),
    {
      btn: 'border-0 py-2 px-4 font-semibold rounded-md  cursor-pointer',
      disabled: 'focus:outline-none cursor-auto pointer-events-none @hover:(shadow-none)',
      link: 'text-white @hover:text-blue-700',
      'responsive-page': ['max-w-custom', 'mx-auto'].join(' '),
      'px-res': ['px-4 xxl:px-1/10 4xl:px-1/5'].join(' '),
      'mx-res': ['mx-4 xxl:mx-1/10 4xl:mx-1/5'].join(' '),
      'mx--res': ['mx--4 xl:mx--1/5 xxl:mx--1/10 4xl:mx--1/5'].join(' '),
      'responsive-content-layout': [
        'flex',
        'lt-xs:justify-start',
        'lt-md:justify-center',
        'justify-start'
      ].join(' '),
      'responsive-grid': ['grid grid-cols-1']
        .concat(Object.keys(breakpoints).map((x, i) => `${x}:grid-cols-${i + 2}`))
        .join(' '),
      'btn-primary':
        'bg-blue-500 text-white @hover:(bg-blue-700 dark:bg-blue-500) dark:bg-blue-300 dark:text-gray-700',
      'btn-secondary': 'bg-white text-blue-500 @hover:(bg-gray-200) dark:(bg-gray-900)',
      'color-primary': 'text-gray-700 dark:text-gray-300',
      'color-primary-fade': 'text-gray-700:50 dark:text-gray-300:50',
      'color-secondary': 'text-blue-700 dark:text-blue-400',
      'bg-primary': 'bg-white dark:(bg-gray-900)',
      'bg-primary-fade': 'bg-white:50 dark:(bg-gray-900:50)',
      'bg-secondary': 'bg-gray-300 dark:(bg-gray-600)',
      'bg-toggle': 'bg-gray-400 dark:(bg-green-400)',
      'border-primary': 'border-gray-300 dark:(border-gray-600)'
    },
    [/^border-(.*)-primary$/, ([, c]) => `border-${c}-gray-300 dark:(border-${c}-gray-600)`]
  ]
});

export default config;
