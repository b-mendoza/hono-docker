import * as esbuild from 'esbuild';

await esbuild.build({
  // packages: 'bundle',
  // sourcemap: true,
  splitting: true,

  bundle: true,
  entryPoints: ['./src/main.ts'],
  external: [
    'chromium-bidi/lib/cjs/bidiMapper/BidiMapper',
    'chromium-bidi/lib/cjs/cdp/CdpConnection',
  ],
  format: 'esm',
  inject: ['./other/esm-shim.ts'],
  minify: false,
  outdir: './dist',
  platform: 'node',
  target: ['node20.18.0', 'es2022'],
});
