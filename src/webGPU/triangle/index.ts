import { initCanvas, initWebGPU, shaderModule } from '../utils';
import triangleShaderCode from './triangle.wgsl';
const device = await initWebGPU();
const context = initCanvas();
const format = navigator.gpu.getPreferredCanvasFormat();
context.configure({
  device,
  format,
  alphaMode: 'opaque' // 不透明
});

const module = shaderModule(device, triangleShaderCode, '三角形着色器');
const pipeline = device.createRenderPipeline({
  vertex: {
    module
  },
  fragment: {
    module,
    targets: [{ format }]
  },
  primitive: {
    topology: 'triangle-list'
  },
  layout: 'auto'
});

const commandEncoder = device.createCommandEncoder();
const textureView = context.getCurrentTexture().createView();
const passEncoder = commandEncoder.beginRenderPass({
  label: '绘制三角形的渲染通道',
  colorAttachments: [
    {
      view: textureView,
      clearValue: [255, 255, 255, 1], //执行渲染通道之前要清除的颜色值，默认为(r:0, g:0, b:0, a:0)
      loadOp: 'clear',
      storeOp: 'store'
    }
  ]
});

passEncoder.setPipeline(pipeline);
passEncoder.draw(3); // 3 表示调用顶点着色器函数的次数
passEncoder.end();
device.queue.submit([commandEncoder.finish()]);
