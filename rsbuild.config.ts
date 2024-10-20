import { defineConfig } from '@rsbuild/core';

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
