import { defineConfig } from 'unocss';
import transformerVariantGroup from '@unocss/transformer-variant-group';
import transformerDirective from '@unocss/transformer-directives';

export const MAX_REM_UNITS = 10;
export const MAX_GRID_SIZE = 5;

export const breakpoints = {
  xs: '480px',
  sm: '640px',
  md: '768px',
  medium: '800px',
  lg: '1024px',
  xl: '1280px',
  xxl: '1440px'
};

export const lineHeight = {
  h1: '4.3125rem',
  h2: '3.5rem',
  h3: '3.875rem',
  h4: '2.3125rem',
  h5: '2rem',
  h6: '1.6875rem',
  default: '1rem',
  small: '0.75rem'
};

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

export default defineConfig({
  safelist,
  theme: {
    extend: {
      screens: breakpoints,
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
    }
  },
  transformers: [transformerVariantGroup(), transformerDirective()],
  shortcuts: {
    btn: [
      'text-white text-center uppercase bold',
      'bg-blue-dark-moderate py-1 px-4 font-semibold rounded-md',
      'hover:(shadow-md shadow-gray-700)'
    ].join(' '),
    'btn-secondary': 'text-black bg-white',
    disabled: 'focus:outline-none cursor-auto pointer-events-none hover:(shadow-none)',
    link: 'text-white hover:text-blue-700',
    'responsive-page': ['max-w-custom', 'mx-auto', '<lg:px-8'].join(' '),
    'responsive-content-layout': [
      'flex',
      'lt-xs:justify-start',
      'lt-medium:justify-center',
      'justify-start'
    ].join(' ')
  }
});