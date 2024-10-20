import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from '@rsbuild/core';
import path from 'node:path';

const localDirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  source: {
    entry: {
      index: './src/index.ts',
    },
  },
  output: {
    cleanDistPath: true,
    externals: [/chromium-bidi\/lib\/cjs\/.*/, 'electron'],
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
    },
  },
});
