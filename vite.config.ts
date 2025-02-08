/// <reference types="vitest" />

import { defineConfig } from 'vite';
import analog from '@analogjs/platform';
import tsconfigPaths from 'vite-tsconfig-paths';
import { getPrerenderedRoutes } from './tools/pre-render';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  build: {
    target: ['es2020'],
  },
  resolve: {
    mainFields: ['module'],
  },
  optimizeDeps: {
    include: ['@angular/common', '@angular/forms'],
  },
  ssr: {
    noExternal: [
      '@spartan-ng/**',
      '@angular/cdk/**',
      '@ng-icons/**',
      'ngx-scrollbar/**',
    ],
  },
  plugins: [
    analog({
      prerender: {
        routes: async () => {
          const routes = await getPrerenderedRoutes();
          console.log(routes);
          return routes || [];
        },
      },
    }),
    tsconfigPaths(),
  ],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['src/test-setup.ts'],
    include: ['**/*.spec.ts'],
    reporters: ['default'],
  },
  define: {
    'import.meta.vitest': mode !== 'production',
  },
}));
