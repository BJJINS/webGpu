/**
 * 初始化画布并返回WebGPU上下文。
 *
 * 此函数用于创建或获取一个具有指定ID、宽度和高度的画布元素，并根据设备的像素比调整其实际大小，
 * 以确保画布在不同设备上都能以较高的清晰度渲染图形。如果画布元素不存在于文档中，
 * 则会创建一个新的画布元素并将其插入文档的开头。
 *
 * @param id 画布元素的ID，默认为'canvas'。
 * @param w 画布的宽度，默认为视口宽度('100vw')。
 * @param h 画布的高度，默认为视口高度('100vh')。
 * @returns 返回画布的WebGPU上下文。
 */
export const initCanvas = (id = 'canvas', w = '100vw', h = '100vh') => {
  // 尝试根据ID获取已存在的画布元素，如果不存在则创建一个新的画布元素。
  let canvas = document.getElementById(id) as HTMLCanvasElement;
  if (!canvas) {
    canvas = document.createElement('canvas');
    canvas.setAttribute('id', id);
    // 设置画布的样式，包括宽度和高度，确保画布充满整个视口。
    canvas.setAttribute('style', `height:${h};width:${w};`);
    // 将新创建的画布元素插入文档的开头。
    // 将canvas插入父元素首位
    document.body.insertBefore(canvas, document.body.children[0]);
  }

  // 根据设备的像素比调整画布的实际渲染大小，以提高渲染质量。
  // 根据像素比设置canvas避免图像模糊
  const multiplier = window.devicePixelRatio;
  const width = (canvas.clientWidth * multiplier) | 0;
  const height = (canvas.clientHeight * multiplier) | 0;
  // 如果当前画布的宽度或高度与计算出的值不一致，则进行调整。
  if (canvas.width !== width || canvas.height !== height) {
    canvas.width = width;
    canvas.height = height;
  }

  // 返回画布的WebGPU上下文，此处使用非空断言操作符(!)是因为我们假设WebGPU上下文总是可用的。
  return canvas.getContext('webgpu')!;
};

/**
 * 初始化WebGPU设备。
 *
 * 本函数通过检查浏览器是否支持WebGPU，请求适配器和设备，来初始化WebGPU设备。
 * 如果任何步骤失败，将抛出错误。
 *
 * @returns {Promise<WebGPUDevice>} 返回初始化的WebGPU设备。
 * @throws {Error} 如果WebGPU不支持、无法请求适配器或设备丢失，则抛出错误。
 */
export const initWebGPU = async () => {
  // 检查WebGPU是否支持
  if (!navigator.gpu) {
    throw Error('WebGPU not supported.');
  }

  // 请求WebGPU适配器
  const adapter = await navigator.gpu.requestAdapter();
  if (!adapter) {
    throw Error("Couldn't request WebGPU adapter.");
  }

  // 请求WebGPU设备
  const device = await adapter.requestDevice();

  // 监听设备丢失事件并抛出错误
  device.lost.then((err) => {
    throw Error(`lost device :${err}`);
  });

  return device;
};
