/* #region Global Setting */
const sliderIds = Array.from({ length: 1 }, (_, i) => `var${i + 1}Range`);
let lastValues = Array(sliderIds.length).fill(-1);
const sliders = sliderIds.map(id => document.getElementById(id));
let stage, layer, imageNode, currentImageData;
const ranges = Object.fromEntries(sliderIds.map(id => [id, document.getElementById(id)]));

// Konva stage and layer setup //
window.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById('container');

  // Konva stage and layer //
  stage = new Konva.Stage({ container, width: container.clientWidth, height: container.clientHeight });
  layer = new Konva.Layer();
  stage.add(layer);

  // Slider event listeners //
  sliders.forEach(slider => {
    ranges[slider.id] = slider;
    slider.addEventListener('input', () => {
      applyGlitchEffect();
  });
});

  // File Upload event listener //
  document.getElementById('input-file').addEventListener('change', handleFileUpload);

  // Size Adjustment on canvas //
  window.addEventListener('resize', () => {
    stage.size({ width: container.clientWidth, height: container.clientHeight });
    if (imageNode) fitImageToStage();
  });

  // Default image load //
  loadImage('Woman.jpg'); // img by AdobeStock //
});

// Fit image to stage, maintain aspect ratio //
function fitImageToStage() {
  const cw = stage.width(), ch = stage.height();
  const iw = imageNode.width(), ih = imageNode.height();
  const ratio = iw / ih, boxRatio = cw / ch;
  const newW = ratio > boxRatio ? cw : ch * ratio;
  const newH = ratio > boxRatio ? cw / ratio : ch;
  imageNode.size({ width: newW, height: newH });
  imageNode.position({ x: (cw - newW) / 2, y: (ch - newH) / 2 });
  layer.batchDraw();
};

// Load image and cache original data //
function loadImage(src) {
  const imageObj = new Image();
  imageObj.crossOrigin = "anonymous";
  imageObj.onload = () => {
    if (imageNode) imageNode.destroy();

    imageNode = new Konva.Image({ image: imageObj });
    layer.destroyChildren();
    layer.add(imageNode);
    fitImageToStage();

    // cache original pixels
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = imageNode.width();
    tempCanvas.height = imageNode.height();
    const tempCtx = tempCanvas.getContext('2d');
    tempCtx.drawImage(imageObj, 0, 0, imageObj.width, imageObj.height, 0, 0, tempCanvas.width, tempCanvas.height);
    currentImageData = tempCtx.getImageData(0, 0, tempCanvas.width, tempCanvas.height);

    resetSliders();        // 슬라이더 초기화(=값 0)
    applyGlitchEffect();   // 이미지 로딩 후 즉시 효과 적용
  };
  imageObj.src = src;
};
/* #endregion */

/* #region Apply Glitch Effect Progress */
function applyGlitchEffect(force = false) {
  if (!imageNode) return;

  const currentValues = sliders.map(s => +s.value);

  // Skip if values are the same
  if (!force && currentValues.every((v, i) => v === lastValues[i])) return;

  lastValues = [...currentValues];

  const cachedData = currentImageData;  // 캐시된 원본 이미지 데이터 사용
  const width  = imageNode.width();
  const height = imageNode.height();

  // Create a new canvas for the glitch effect
  const glitchCanvas = document.createElement('canvas');
  glitchCanvas.width = width;
  glitchCanvas.height = height;
  const ctx = glitchCanvas.getContext('2d');
  ctx.putImageData(cachedData, 0, 0);  // 캐시된 데이터 적용

  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;

  // Apply effects based on slider values
  const applyEffect = (range, effect) =>
    parseInt(range.value) > 0 && effect(data, width, height);

  // 슬라이더에 맞춰 RGB Shift 효과 적용
  applyEffect(ranges.var1Range, applyRgbShift);

  ctx.putImageData(imageData, 0, 0);

  renderFinalImage(glitchCanvas);  // 결과 이미지 렌더링
  layer.batchDraw();  // 레이어 갱신
}

/* #endregion */

  /* #region RGB SHIFT */
  function applyRgbShift(data, width, height) {
    const strength = parseInt(ranges.var1Range.value);  // 슬라이더 값에 맞게 strength 조정
    const effectStrength = strength / 10;  // 효과 강도
  
    if (effectStrength === 0) return;  // 효과가 없으면 종료
  
    const maxOffset = 50;  // 최대 오프셋 설정
    const shiftedData = new Uint8ClampedArray(data);
  
    for (let y = 0; y < height; y++) {
      const rOffset = Math.floor((Math.random() - 0.2) * maxOffset * effectStrength);
      const gOffset = Math.floor((Math.random() - 0.2) * maxOffset * effectStrength);
      const bOffset = Math.floor((Math.random() - 0.2) * maxOffset * effectStrength);
  
      for (let x = 0; x < width; x++) {
        const index = (y * width + x) * 4;
  
        const rX = Math.min(width - 1, Math.max(0, x + rOffset));
        const gX = Math.min(width - 1, Math.max(0, x + gOffset));
        const bX = Math.min(width - 1, Math.max(0, x + bOffset));
  
        const rIndex = (y * width + rX) * 4;
        const gIndex = (y * width + gX) * 4;
        const bIndex = (y * width + bX) * 4;
  
        // R, G, B 채널을 랜덤으로 이동시켜 색상 효과 적용
        data[index]     = shiftedData[rIndex];       // R
        data[index + 1] = shiftedData[gIndex + 1];   // G
        data[index + 2] = shiftedData[bIndex + 2];   // B
      }
    }
  };
  /* #endregion */

/* #endregion */

/* #region Final Render */
function renderFinalImage(glitchCanvas) {
  const newImg = new Image();
  newImg.onload = () => {
    const canvasWidth = imageNode.width(); 
    const canvasHeight = imageNode.height();

    imageNode.image(newImg);  // 새로운 이미지를 적용
    imageNode.width(canvasWidth);
    imageNode.height(canvasHeight);

    imageNode.x((stage.width() - canvasWidth) / 2);
    imageNode.y((stage.height() - canvasHeight) / 2);

    imageNode.getLayer().draw();  // 레이어 갱신
  };
  newImg.src = glitchCanvas.toDataURL();  // glitchCanvas에서 이미지를 가져옴
}

/* #endregion */

/* #region Import & Export Button */
// Import btn //
function handleFileUpload(event) {
  const file = event.target.files[0];
  if (!file) return;
  const name = file.name.replace(/\.[^/.]+$/, "");
  originalFileName = `${name}-glitched.png`;
  const reader = new FileReader();
  reader.onload = e => {
    loadImage(e.target.result);
    resetSliders(); // reset sliders when new image is loaded //
  };
  reader.readAsDataURL(file);
};

// Export btn //
let originalFileName = 'glitched-image.png';
document.getElementById('export-label').addEventListener('click', exportImage);
function exportImage() {
  const canvas = layer.toCanvas();
  const dataURL = canvas.toDataURL();

  const link = document.createElement('a');
  link.href = dataURL;
  link.download = originalFileName;
  link.click();
};
/* #endregion */

/* #region Reset & Random Button */
// Reset btn //
document.querySelector('label[for="reset"]').addEventListener('click', resetSliders);
function resetSliders() {
  sliders.forEach(slider => {
    slider.value = 0;  // 슬라이더를 0으로 초기화
    slider.dispatchEvent(new Event('input'));
  });
  applyGlitchEffect();
}

// Random btn //
document.querySelector('label[for="random"]').addEventListener('click', randomizeSliders);
function randomizeSliders() {
  sliders.forEach(slider => {
    slider.value = Math.floor(Math.random() * 4);
    slider.dispatchEvent(new Event('input'));
  });
  applyGlitchEffect();
};
/* #endregion */
