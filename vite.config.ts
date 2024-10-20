import { builtinModules as builtin } from 'node:module';
import tsconfig from './tsconfig.json';

import { defineConfig } from 'vite';

const nodeExternals = [
  ...builtin,
  ...builtin.map((module) => `node:${module}`),
];

export default defineConfig({
  resolve: {
    preserveSymlinks: true,
  },
  plugins: [],
  build: {
    rollupOptions: {
      external: nodeExternals,
      output: {
        inlineDynamicImports: true,
      },
      preserveSymlinks: true,
    },
    ssr: './src/index.ts',
    target: tsconfig.compilerOptions.target,
  },
  ssr: {
    external: nodeExternals,
    noExternal: process.env.NODE_ENV === 'production' ? [/.*/] : undefined,
  },
});
