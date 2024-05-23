import './serve';
import shaders from './shaders/index.wgsl';
import { createCanvas } from './utils';
async function init() {
  if (!navigator.gpu) {
    throw Error('WebGPU not supported.');
  }

  const adapter = await navigator.gpu.requestAdapter();
  if (!adapter) {
    throw Error("Couldn't request WebGPU adapter.");
  }

  const device = await adapter.requestDevice();
  const shaderModule = device.createShaderModule({
    code: shaders
  });

  const canvas = createCanvas('gpuCanvas') as HTMLCanvasElement;

  const context = canvas.getContext('webgpu')!;

  context.configure({
    device: device,
    format: navigator.gpu.getPreferredCanvasFormat(),
    alphaMode: 'premultiplied'
  });
}
init();
