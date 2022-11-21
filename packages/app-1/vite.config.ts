/// <reference types="vitest" />
import { configDefaults } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import Unocss from '@unocss/vite';
import unocssConfig from './unocss.config';
import alias from './alias';

// https://vitejs.dev/config/
export default defineConfig((config) => ({
  plugins: [
    Unocss({}, unocssConfig),
    react({
      jsxImportSource: '@emotion/react',
      babel: {
        plugins: ['@emotion/babel-plugin']
      }
    })
  ],
  resolve: {
    alias
  },
  base: '/',
  clearScreen: false,
  build: {
    // skip minification to make tests faster
    minify: config.mode !== 'test' ? 'esbuild' : false,
    commonjsOptions: {
      transformMixedEsModules: true,
      esmExternals: true
    },
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes('node_modules')) {
            const vendorModules = ['react', 'lodash', '@emotion', '@gs-ux-uitoolkit'];
            const m = vendorModules.find((x) => id.includes(x)) ?? '';
            return `vendor${m ? `-${m}` : ''}`;
          }
        }
      }
    }
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/services/test/setup.js'],
    include: ['**/*(*.)?{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    exclude: [...configDefaults.exclude, 'src/test/**/*'],
    coverage: {
      reporter: ['text', 'lcov']
    }
  }
}));
