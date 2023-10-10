/// <reference types="vitest" />
import Unocss from '@unocss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { configDefaults } from 'vitest/config';

import alias from './alias';
import unocssConfig from './unocss.config';

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
              const dependents = [];
              const m = vendorModules.find((x) => id.includes(`/${x}`)) ?? '';
              const uniqueName = `vendor${m ? `-${m}` : ''}`;
              // we use a Set here so we handle each module at most once. This
              // prevents infinite loops in case of circular dependencies
              const idsToHandle = new Set(getModuleInfo(id).dynamicImporters);
              for (const moduleId of idsToHandle) {
                const { isEntry, dynamicImporters, importers } = getModuleInfo(moduleId);
                if (isEntry || dynamicImporters.length > 0) dependents.push(moduleId);
                for (const importerId of importers) idsToHandle.add(importerId);
              }

              return dependents.length === 1 ? uniqueName : `shared.${uniqueName}`;
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
