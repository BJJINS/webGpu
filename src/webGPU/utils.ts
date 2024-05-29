export const initCanvas = (id = 'canvas', w = '100vw', h = '100vh') => {
  let canvas = document.getElementById(id) as HTMLCanvasElement;
  if (!canvas) {
    canvas = document.createElement('canvas');
    canvas.setAttribute('id', id);
    canvas.setAttribute('style', `height:${h};width:${w};`);
    // 将canvas插入父元素首位
    document.body.insertBefore(canvas, document.body.children[0]);
  }
  // 根据像素比设置canvas避免图像模糊
  const multiplier = window.devicePixelRatio;
  const width = (canvas.clientWidth * multiplier) | 0;
  const height = (canvas.clientHeight * multiplier) | 0;
  if (canvas.width !== width || canvas.height !== height) {
    canvas.width = width;
    canvas.height = height;
  }

  return canvas.getContext('webgpu')!;
};

export const shaderModule = (device: GPUDevice, code: string, label?: string) => {
  return device.createShaderModule({
    label,
    code
  });
};

export const initWebGPU = async () => {
  if (!navigator.gpu) {
    throw Error('WebGPU not supported.');
  }
  const adapter = await navigator.gpu.requestAdapter();
  if (!adapter) {
    throw Error("Couldn't request WebGPU adapter.");
  }
  const device = await adapter.requestDevice();
  device.lost.then((err) => {
    throw Error(`lost device :${err}`);
  });

  return device;
};
