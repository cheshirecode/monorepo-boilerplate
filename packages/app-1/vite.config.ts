/// <reference types="vitest" />
import { resolve } from 'path';
// eslint-disable-next-line import/no-unresolved
import { configDefaults } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import Unocss from '@unocss/vite';
import presetWindi from '@unocss/preset-wind';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    Unocss({
      presets: [presetWindi()]
    }),
    react()
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src')
    }
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.js'],
    exclude: [...configDefaults.exclude, 'src/test/**/*'],
    coverage: {
      reporter: ['text', 'lcov']
    }
  }
});
