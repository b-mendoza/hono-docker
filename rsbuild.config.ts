import { defineConfig } from '@rsbuild/core';
import path from 'node:path';

export default defineConfig({
  output: {
    cleanDistPath: true,
    minify: false,
    target: 'node',
  },
  tools: {
    rspack: {
      experiments: {
        outputModule: true,
      },
      output: {
        chunkFormat: 'module',
        library: {
          type: 'module',
        },
      },
      resolve: {
        alias: {
          electron: path.resolve(
            __dirname,
            'node_modules/.pnpm/playwright-core@1.47.0/node_modules/playwright-core/lib/server/electron/electron.js',
          ),
        },
      },
    },
  },
});
