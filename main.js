import * as esbuild from 'esbuild';

let ctx = await esbuild.context({
  entryPoints: ['./src/app.ts'],
  bundle: true,
  loader:{
    ".wgsl":"text"
  },
  format: 'esm',
  outdir: 'dist'
});

await ctx.watch();

let { host, port } = await ctx.serve({
  servedir: '.'
});
