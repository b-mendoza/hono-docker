import * as esbuild from 'esbuild';

await esbuild.build({
  // bundle: true,
  // packages: 'bundle',

  entryPoints: ['./src/index.ts'],
  format: 'esm',
  minify: true,
  outfile: './dist/index.js',
  platform: 'node',
  sourcemap: true,
  target: ['node20.17.0', 'es2022'],
});
