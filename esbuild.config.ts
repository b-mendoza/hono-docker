import * as esbuild from 'esbuild';

await esbuild.build({
  bundle: true,
  entryPoints: ['./src/index.ts'],
  format: 'esm',
  inject: ['./other/esm-shim.ts'],
  minify: false,
  outdir: './dist',
  packages: 'bundle',
  platform: 'node',
  sourcemap: true,
  splitting: true,
  target: ['node20.17.0', 'es2022'],
});
