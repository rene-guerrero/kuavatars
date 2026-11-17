/// <reference types="vitest" />
import { defineConfig } from 'vite';

// The demo page (demo/index.html). The library itself has no build: games compile its TypeScript.
export default defineConfig({
  root: 'demo',
  base: './',
  server: { port: 5180, host: true },
  build: { outDir: '../dist-demo', emptyOutDir: true, target: 'es2020' },
  test: { root: '.', environment: 'happy-dom', include: ['test/**/*.test.ts'] },
});
