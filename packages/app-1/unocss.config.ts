import type { UserConfig } from 'unocss';
import { defineConfig, presetAttributify, presetUno, transformerVariantGroup } from 'unocss';

import {
  rules as gridRules,
  shortcutArr as gridShortcutArr,
  shortcutObj as gridShortcutObj
} from './src/styles/grid';
import { breakpoints, colors, lineHeight, extraSizes, extraGridTemplates, safelist } from './src/styles/tokens';

const config: UserConfig = defineConfig({
  include: [/\.[jt]sx?$/],
  safelist,
  theme: {
    screens: breakpoints,
    breakpoints,
    colors,
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
    }
    // https://github.com/unocss/unocss/blob/main/packages/preset-wind/src/theme.ts
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
  rules: [...gridRules],
  shortcuts: [
    ...(gridShortcutArr as []),
    {
      ...gridShortcutObj,
      btn: 'border-0 py-2 px-4 font-semibold rounded-md cursor-pointer',
      'btn-compact': 'py-1 px-1',
      anchor:
        'text-blue-60 dark:text-blue-50 no-underline @hover:(underline text-blue-80 dark:text-blue-30)',
      disabled: 'focus:outline-none cursor-auto pointer-events-none',
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
      'fill-width': 'w-auto ml-[-9999px] pl-[9999px] mr-[-9999px] pr-[9999px]',
      'color-cta': 'text-white dark:text-gray-10',
      'color-cta-hover': 'text-gray-20 dark:text-white',
      'color-primary': 'text-gray-90 dark:text-gray-10',
      'color-primary-hover': 'text-gray-110 dark:text-white',
      'color-secondary': 'text-gray-70 dark:text-gray-40',
      'color-secondary-hover': 'text-gray-90 dark:text-gray-20',
      'color-tertiary': 'text-gray-40 dark:text-gray-60',
      'color-tertiary-hover': 'uno-layer-h:(text-gray-60 dark:text-gray-40)',
      'color-link': 'text-blue-60 dark:text-blue-50',
      'color-link-hover': 'text-blue-80 dark:text-blue-30',
      'color-destructive': 'text-red-60 dark:text-gray-50',
      'color-reversed': 'text-white dark:text-gray-110',
      'color-error': 'text-white dark:text-gray-110',
      'color-error-hover': 'text-gray-20 dark:text-gray-90',
      'color-warning': 'text-gray-110 dark:text-gray-110',
      'color-warning-hover': 'text-[#19222a] dark:text-gray-90',
      'color-information': 'text-white dark:text-gray-110',
      'color-information-hover': 'text-gray-20 dark:text-gray-90',
      'color-success': 'text-white dark:text-gray-110',
      'color-success-hover': 'text-gray-20 dark:text-gray-90',
      'bg-cta': 'bg-blue-60 dark:bg-blue-50',
      'bg-cta-hover': 'bg-blue-80 dark:bg-blue-30',
      'bg-primary': 'bg-white dark:bg-gray-110',
      'bg-primary-hover': 'bg-gray-20 dark:bg-gray-90',
      'bg-secondary': 'bg-gray-10 dark:(bg-gray-100)',
      'bg-secondary-hover': 'bg-gray-30 dark:bg-gray-80',
      'bg-tertiary': 'bg-gray-20 dark:(bg-gray-90)',
      'bg-tertiary-hover': 'bg-gray-40 dark:bg-gray-70',
      'bg-moderate': 'bg-gray-30 dark:(bg-gray-80)',
      'bg-moderate-hover': 'bg-gray-50 dark:bg-gray-60',
      'bg-bold': 'bg-gray-40 dark:(bg-gray-60)',
      'bg-bold-hover': 'bg-gray-60 dark:bg-gray-40',
      'bg-strong': 'bg-gray-60 dark:(bg-gray-40)',
      'bg-strong-hover': 'bg-gray-70 dark:bg-gray-20',
      'bg-contrast': 'bg-gray-110 dark:(bg-white)',
      'bg-contrast-hover': 'bg-gray-90 dark:bg-gray-20',
      'bg-none': 'bg-transparent',
      'bg-toggle': 'bg-gray-40 dark:(bg-green-40)',
      'bg-error': 'bg-red-60 dark:(bg-red-50)',
      'bg-error-hover': 'bg-[#c51d10] dark:(bg-[#fa6759])',
      'bg-warning': 'bg-yellow-30 dark:(bg-yellow-30)',
      'bg-warning-hover': 'bg-[#e7b816] dark:(bg-[#f6ce3c])',
      'bg-information': 'bg-blue-50 dark:(bg-blue-60)',
      'bg-information-hover': 'bg-[#5399f5] dark:(bg-[#1660c9])',
      'bg-success': 'bg-green-60 dark:(bg-green-50)',
      'bg-success-hover': 'bg-[#07714e] dark:(bg-[#2cac70])',
      'border-cta': 'border-gray-20 dark:(border-gray-80)',
      'border-cta-blend': 'border-blue-60 dark:(border-blue-50)',
      'border-primary': 'border-gray-20 dark:(border-gray-80)',
      'border-secondary': 'border-gray-20 dark:(border-gray-80)',
      'border-tertiary': 'border-gray-30 dark:(border-gray-70)',
      'border-warningAlt': 'border-orange-50 dark:(border-yellow-30)',
      'border-warning': 'bg-yellow-30 dark:(bg-yellow-30)',
      'border-warning-hover': 'bg-[#e7b816] dark:(bg-[#f6ce3c])'
    },
    [
      /^btn-(.*)$/,
      ([, c]) =>
        `btn bg-${c} @hover:(bg-${c}-hover color-${c}-hover) color-${c} border-1 border-${c}`
    ],
    [/^card-(.*)$/, ([, c]) => `bg-${c} color-${c} border-${c}`],
    [/^card-(\w*)-hover$/, ([, c]) => `bg-${c}-hover color-${c}-hover border-${c}-hover`],
    [/^cell-(.*)$/, ([, c]) => `bg-${c} color-${c} border-1 border-${c}`]
  ]
});

export default config;
