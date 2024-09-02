import * as esbuild from 'esbuild';

await esbuild.build({
  bundle: true,
  entryPoints: ['./src/index.ts'],
  format: 'esm',
  inject: ['./other/shim.js'],
  minify: true,
  outfile: './dist/index.js',
  platform: 'node',
});
