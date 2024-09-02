import { defineConfig } from '@rsbuild/core';
// import { pluginNodePolyfill } from '@rsbuild/plugin-node-polyfill';

export default defineConfig({
  output: {
    target: 'node',
  },
  // environments: {
  //   web: {
  //     output: {
  //       target: 'web',
  //     },
  //   },
  //   node: {
  //     source: {
  //       entry: {
  //         index: './src/index.server.ts',
  //       },
  //     },
  //     output: {
  //       // Use 'node' target for the Node.js outputs
  //       target: 'node',
  //     },
  //   },
  // },
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
        // library: {
        //   type: 'module',
        // },
      },
      experiments: {
        outputModule: true,
        // topLevelAwait: true,
      },
      // optimization: {
      //   usedExports: false,
      // },
    },
  },
  // plugins: [pluginNodePolyfill()],
});
