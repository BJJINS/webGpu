import open from 'open';
import * as esbuild from 'esbuild';

let ctx = await esbuild.context({
  entryPoints: ['./src/app.ts'],
  bundle: true,
  loader: {
    '.wgsl': 'text'
  },
  format: 'esm',
  outdir: 'dist'
});

await ctx.watch();

let { host, port } = await ctx.serve({
  port: 8000,
  host: '127.0.0.1',
  servedir: '.'
});
open(`http://${host}:${port}`);
