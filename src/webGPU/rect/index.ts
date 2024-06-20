import { initCanvas, initWebGPU } from '../utils';
const device = await initWebGPU();
const context = initCanvas();
const format = navigator.gpu.getPreferredCanvasFormat();
context.configure({
  device,
  format,
  alphaMode: 'opaque', // 不透明
});
