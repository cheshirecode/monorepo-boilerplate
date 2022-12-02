import type { UserConfig } from 'unocss';
import { defineConfig, presetAttributify, presetUno, transformerVariantGroup } from 'unocss';

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

const convertUnitsToRem = (n: string) => (~~n == Number(n) ? `${~~n / 4}rem` : n);
const minMax = (x: string, y: string) => `minmax( min(${x},${y}), max(${x},${y}) )`;

const safelist = Object.keys(breakpoints)
  .concat('')
  .flatMap((x) =>
    ['grid-cols', 'grid-rows']
      .flatMap((x) => Object.keys(extraGridTemplates).map((y) => `${x}-${y}`))
      .map((y) => `${x ? `${x}:` : ''}${y}`)
  );

const config: UserConfig = defineConfig({
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
      fade: 'fadeOut 2s normal forwards ease-in-out'
    },
    keyframes: {
      fadeOut: {
        '0%': { opacity: 1 },
        '100%': { opacity: 0 }
      }
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
  rules: [
    /* 
      grid-cols-auto-(40) -> 
        grid-template-columns: repeat(auto-fill,minmax(40rem,1fr));
        grid-auto-flow: column;
        grid-auto-columns: minmax(40rem,1fr); 
    */
    [
      /^grid-cols-fill-(\d+)$/,
      (match) => ({
        'grid-template-columns': `repeat(auto-fill,minmax(${convertUnitsToRem(match[1])},1fr))`,
        'grid-auto-flow': 'column',
        'grid-auto-columns': `minmax(${convertUnitsToRem(match[1])},1fr)`
      })
    ],
    [
      /^grid-cols-max-(\d+)-(\d+)$/,
      (match) => ({
        'grid-template-columns': `repeat(auto-fill,min(${
          ~~match[1] / 4
        }rem, calc(100%/${~~match[2]}) ))`,
        'grid-auto-flow': 'row',
        'grid-auto-columns': `min(${convertUnitsToRem(match[1])}, calc(100%/${~~match[2]}) )`
      })
    ],
    [
      /^grid-cols-min-(\d+)-(\d+)$/,
      (match) => ({
        'grid-template-columns': `repeat(auto-fill,max(${
          ~~match[1] / 4
        }rem, calc(100%/${~~match[2]}) ))`,
        'grid-auto-flow': 'col',
        'grid-auto-columns': `max(${convertUnitsToRem(match[1])}, calc(100%/${~~match[2]}) )`
      })
    ],
    [
      /^grid-cols-fluid-(\d+)-(\d+)$/,
      (match) => ({
        'grid-template-columns': `repeat(auto-fill,${minMax(
          convertUnitsToRem(match[1]),
          `calc(100%/${~~match[2]})`
        )})`,
        'grid-auto-flow': 'row',
        'grid-auto-columns': minMax(convertUnitsToRem(match[1]), `calc(100%/${~~match[2]})`)
      })
    ]
  ],
  shortcuts: [
    {
      btn: [
        'text-white text-center',
        'bg-blue-70 bg-blue-700 py-1 px-4 rounded-md',
        'hover:(shadow-md shadow-gray-700)'
      ].join(' '),
      'btn-secondary': 'text-black bg-white',
      disabled: 'focus:outline-none cursor-auto pointer-events-none hover:(shadow-none)',
      link: 'text-white hover:text-blue-700',
      'responsive-page': ['max-w-custom', 'mx-auto', 'lt-lg:px-4'].join(' '),
      'responsive-content-layout': [
        'flex',
        'lt-xs:justify-start',
        'lt-md:justify-center',
        'justify-start'
      ].join(' '),
      'responsive-grid': ['grid grid-cols-1']
        .concat(Object.keys(breakpoints).map((x, i) => `${x}:grid-cols-${i + 2}`))
        .join(' ')
    },
    /* 
      responsive-grid-max-10 -> 
        grid-cols-max-10-1
        xs:grid-cols-max-10-2
        sm:grid-cols-max-10-3
        md:grid-cols-max-10-3
        ...
    */
    [
      /^responsive-grid-max-(\d+)$/,
      (match) =>
        [`grid grid-cols-max-${match[1]}-1`]
          .concat(Object.keys(breakpoints).map((x, i) => `${x}:grid-cols-max-${match[1]}-${i + 2}`))
          .join(' ')
    ],
    [
      /^responsive-grid-min-(\d+)$/,
      (match) =>
        [`grid grid-cols-min-${match[1]}-1`]
          .concat(Object.keys(breakpoints).map((x, i) => `${x}:grid-cols-min-${match[1]}-${i + 2}`))
          .join(' ')
    ],
    [
      /^responsive-grid-fluid-(\d+)$/,
      (match) =>
        [`grid grid-cols-fluid-${match[1]}-1`]
          .concat(
            Object.keys(breakpoints).map((x, i) => `${x}:grid-cols-fluid-${match[1]}-${i + 2}`)
          )
          .join(' ')
    ]
  ]
});

export default config;
