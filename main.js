import { exec } from 'child_process';
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

const startCommand =
  process.platform == 'darwin' ? 'open' : process.platform == 'win32' ? 'start' : process.platform == 'linux' ? 'xdg-open' : '';

if (startCommand) {
  // 执行命令打开浏览器
  exec(startCommand + ' ' + `http://${host}:${port}`);
} else {
  console.log('操作系统不支持自动打开浏览器');
}
