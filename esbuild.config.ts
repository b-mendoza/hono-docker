import * as esbuild from 'esbuild';

await esbuild.build({
  // packages: 'bundle',
  // sourcemap: true,

  bundle: true,
  entryPoints: ['./src/main.ts'],
  format: 'esm',
  inject: ['./other/esm-shim.ts'],
  minify: false,
  outdir: './dist',
  platform: 'node',
  splitting: true,
  target: ['node20.17.0', 'es2022'],
});
