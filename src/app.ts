import './webGPU/index';
// 更新是刷新页面
new EventSource('/esbuild').addEventListener('change', () => location.reload());