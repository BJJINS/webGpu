import { initCanvas, initWebGPU } from '../utils';
import triangleShaderCode from './shader.wgsl';
const device = await initWebGPU();
const context = initCanvas();
const format = navigator.gpu.getPreferredCanvasFormat();
context.configure({
  device,
  format,
  alphaMode: 'opaque', // 不透明
});

const module = device.createShaderModule({
  label: '三角形着色器',
  code: triangleShaderCode,
});
const vertexArray = new Float32Array([0.0, 0.5, -0.5, -0.5, 0.5, -0.5]);
const vertexBuffer = device.createBuffer({
  size: vertexArray.byteLength,
  //GPUBufferUsage.COPY_DST 表明该缓冲区是可以作为拷贝目的地(destination)，也就是说可以被 写入
  //表明该缓冲区是应用于 顶点阶段
  usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
});
device.queue.writeBuffer(vertexBuffer, 0, vertexArray);

const pipeline = device.createRenderPipeline({
  vertex: {
    module,
    buffers: [
      {
        // stride 单词是 步幅 的意思，
        // 所谓 arrayStride 就是指每次读取的字节数应该是多少。
        // 由于我们本示例中一个顶点坐标仅仅声明了 x, y 2个分量信息，且每个分量信息字节数为 4，
        // 所以我们才会将 arrayStride 的值设置为 2 * 4
        arrayStride: 2 * 4,
        attributes: [
          {
            // 明确每一次读取实际对应的是 WGSL 顶点着色器入口函数的第 0 个参数。
            // @location(0) 是呼应的
            shaderLocation: 0,
            offset: 0,
            // 每一次读取得到的结果类型，"float32x2" 表示为 2 个 32 位浮点数
            format: 'float32x2',
          },
        ],
      },
    ],
  },
  fragment: {
    module,
    targets: [{ format }],
  },
  primitive: {
    topology: 'triangle-list',
  },
  //layout 可以简单把它想象成这是 PhotoShop 图像处理软件中的 “图层叠加的顺序值”
  layout: 'auto',
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
      storeOp: 'store',
    },
  ],
});

passEncoder.setPipeline(pipeline);
// 第 1 个参数值 0 是指插槽的索引值，第 2 个参数 vertexBuffer 就是这个插槽中对应的 缓冲区数据。
// 一个插槽可以包含多个参数值，
// 插槽索引值 为 0 并不意味着第 2 个参数 vertexBuffer 一定 100% 只对应入口函数的第 1 个参数，
// vertexBuffer 中的数据还有可能包含入口函数的第 2 个，第 3 个 ... 第 n 个参数。
// 这里的0对应的是buffers[0],也就是说
// 这里的意识是vertexBuffer的数据是在buffers[0]这里用，别的地方用不了
passEncoder.setVertexBuffer(0, vertexBuffer);
passEncoder.draw(3); // 3 表示调用顶点着色器函数的次数
passEncoder.end();
device.queue.submit([commandEncoder.finish()]);
