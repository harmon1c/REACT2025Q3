/// <reference types="vitest" />
import path from 'path';
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  test: {
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
    globals: true,
    coverage: {
      provider: 'v8',
      include: ['src/**/*.{ts,tsx}', 'app/**/*.{ts,tsx}'],
      exclude: [
        // Framework / config files (low business value)
        'next.config.js',
        'postcss.config.js',
        'tailwind.config.js',
        'i18n.ts',
        'middleware.ts',
        // Generated build artifacts & distribution bundles
        '**/.next/**',
        '**/dist/**',
        // Declarations
        '**/*.d.ts',
        // App router boilerplate pages we chose not to exercise
        'app/**/layout.tsx',
        'app/**/error.tsx',
        'app/**/global-error.tsx',
      ],
    },
  },
});
