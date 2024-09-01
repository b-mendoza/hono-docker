import { defineConfig } from '@rsbuild/core';

export default defineConfig({
  output: {
    target: 'node',
  },
  source: {
    entry: {
      index: {
        import: './src/index.ts',
        library: {
          // set the library type to `esm` to generate esm output
          type: 'module',
        },
      },
    },
  },
  tools: {
    rspack: {
      output: {
        chunkFormat: 'module',
      },
      experiments: {
        outputModule: true,
      },
    },
  },
});
