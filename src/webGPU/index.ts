// import shaders from './shaders/index.wgsl';
// import { createCanvas, shaderModule } from './utils';

// if (!navigator.gpu) {
//   throw Error('WebGPU not supported.');
// }

// const adapter = await navigator.gpu.requestAdapter();
// if (!adapter) {
//   throw Error("Couldn't request WebGPU adapter.");
// }

// const device = await adapter.requestDevice();
// const presentationFormat = navigator.gpu.getPreferredCanvasFormat();
// const context = createCanvas('gpuCanvas')!;
// context.configure({
//   device,
//   format: presentationFormat
// });

// const vertexArray = new Float32Array([0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 1.0, 0.0]);

// // 在gpu中创建一个缓冲区，相当于一块内存地址，用来存放数据。
// const buffer = device.createBuffer({
//   size: vertexArray.byteLength,
//   // 缓存区的用途。GPUBufferUsage.VERTEX作为顶点缓冲区|GPUBufferUsage.COPY_DST可以写入顶点数据。
//   usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST
// });

// // 把数据写入到顶点缓冲区。
// device.queue.writeBuffer(buffer, 0, vertexArray);

// const module = shaderModule(device, shaders, '三角形');
// // 渲染管线，类似一个流水线
// const pipeline = device.createRenderPipeline({
//   label: '111',
//   layout: 'auto',
//   vertex: {
//     buffers: [
//       // 顶点所有缓冲区模块配置
//       {
//         arrayStride: 3 * 4, //一个顶点数据占用的字节长度。
//         attributes: [
//           {
//             // 顶点缓冲区属性
//             shaderLocation: 0, //gpu显存上顶点缓冲区存储位置标记
//             format: 'float32x3',
//             offset: 0
//           }
//         ]
//       }
//     ],
//     // module: undefined
//   },
//   fragment: {
//     module,
//     targets: [{ format: presentationFormat }]
//   }
// });

// const encoder = device.createCommandEncoder({ label: 'our encoder' });
// const pass = encoder.beginRenderPass({
//   label: 'our basic canvas renderPass',
//   colorAttachments: [
//     {
//       view: context.getCurrentTexture().createView(),
//       clearValue: [0.3, 0.3, 0.3, 1],
//       loadOp: 'clear',
//       storeOp: 'store'
//     }
//   ]
// });
// pass.setPipeline(pipeline);
// pass.draw(3);
// pass.end();

// const commandBuffer = encoder.finish();
// device.queue.submit([commandBuffer]);

import './utils';
import './triangle';
