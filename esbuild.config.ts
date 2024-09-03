import * as esbuild from 'esbuild';

await esbuild.build({
  // bundle: false,
  // packages: 'bundle',

  entryPoints: ['./src/index.ts'],
  format: 'esm',
  inject: ['./other/shim.js'],
  minify: false,
  outfile: './dist/index.js',
  platform: 'node',
  sourcemap: true,
  target: ['node20.17.0', 'es2022'],
});
