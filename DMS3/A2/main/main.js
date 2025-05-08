/* #region Global Setting */
let stage, layer, imageNode;
const ranges = {};
let currentImageData; // Store the original image data

const maxWidth = 600;
const maxHeight = 800;

// Konva stage and layer setup //
window.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById('container');

  // 고정된 크기 적용
  stage = new Konva.Stage({
    container: container,
    width: maxWidth,
    height: maxHeight,
  });

  layer = new Konva.Layer();
  stage.add(layer);

  // Load default image //
  loadImage('medusa.jpeg');

  // Set up event listeners //
  document.getElementById('input-file').addEventListener('change', handleFileUpload);
  document.getElementById('export-label').addEventListener('click', exportImage);

  // Set up sliders //
  for (let i = 1; i <= 10; i++) {
    const id = `var${i}Range`;
    const input = document.getElementById(id);
    ranges[id] = input;
    input.addEventListener('input', applyGlitchEffect);
  }
});

/* #region Load image into Konva canvas */
function loadImage(src) {
  const imageObj = new Image();
  imageObj.crossOrigin = "anonymous";
  imageObj.onload = () => {
    const imgWidth = imageObj.width;
    const imgHeight = imageObj.height;

    const containerWidth = stage.width();
    const containerHeight = stage.height();

    const aspectRatio = imgWidth / imgHeight;
    const imgAspectRatio = imgWidth / imgHeight;
    const canvasAspectRatio = containerWidth / containerHeight;
    
    let canvasWidth, canvasHeight;
    
    // 이미지의 종횡비에 따라 최대한 크게 (안 잘리게) 리사이즈
    if (imgAspectRatio > canvasAspectRatio) {
      // 이미지가 더 넓음 → 너비를 최대한 채우고, 높이를 비율에 맞춤
      canvasWidth = containerWidth;
      canvasHeight = canvasWidth / imgAspectRatio;
    } else {
      // 이미지가 더 높음 → 높이를 최대한 채우고, 너비를 비율에 맞춤
      canvasHeight = containerHeight;
      canvasWidth = canvasHeight * imgAspectRatio;
    }

    // 이미지 크기를 고정 크기에 맞게 설정
    if (imageNode) imageNode.destroy();

    imageNode = new Konva.Image({
      image: imageObj,
      x: (stage.width() - canvasWidth) / 2,
      y: (stage.height() - canvasHeight) / 2,
      width: canvasWidth,
      height: canvasHeight,
    });

    layer.destroyChildren();
    layer.add(imageNode);
    layer.draw();

    // Store the image as pixel data for effects
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = canvasWidth;
    tempCanvas.height = canvasHeight;
    const tempCtx = tempCanvas.getContext('2d');
    tempCtx.drawImage(imageObj, 0, 0, canvasWidth, canvasHeight);
    currentImageData = tempCtx.getImageData(0, 0, canvasWidth, canvasHeight);

    // Apply the glitch effect now that the image is fully loaded and available
    applyGlitchEffect();
  };
  imageObj.src = src;
}
/* #endregion */

/* #region Import Button */
function handleFileUpload(event) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (e) => {
    resetEffects();
    loadImage(e.target.result);
  };
  reader.readAsDataURL(file);
}

function resetEffects() {
  for (let i = 1; i <= 10; i++) {
    const id = `var${i}Range`;
    const input = document.getElementById(id);
    input.value = 0; 
  }

  if (imageNode) {
    imageNode.cache();
    imageNode.filters([]);
    layer.batchDraw();
  }

  currentImageData = null;
}
/* #endregion */

/* #region Export Button */
function exportImage() {
  const dataURL = stage.toDataURL({ pixelRatio: 1 });
  const link = document.createElement('a');
  link.download = 'glitched-image.png';
  link.href = dataURL;
  link.click();
}
/* #endregion */

/* #region Control Panel */
  /* #Apply Glitch Effect */
  function applyGlitchEffect() {
    if (!imageNode || !currentImageData) return;
  
    const width = stage.width();
    const height = stage.height();
    const glitchCanvas = document.createElement('canvas');
    glitchCanvas.width = width;
    glitchCanvas.height = height;
    const ctx = glitchCanvas.getContext('2d');
    ctx.putImageData(currentImageData, 0, 0);
  
    let imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;
  
    // Apply effects based on the slider values
    if (parseInt(ranges.var1Range.value) > 0) {
      applyRgbShift(data, width, height);
    }
    if (parseInt(ranges.var2Range.value) > 0) {
      applySaturation(data, width, height);
    }
  
    // Apply other effects here as needed
  
    ctx.putImageData(imageData, 0, 0);
    renderFinalImage(glitchCanvas);
  }
  /* #endregion */

/* #region RGB SHIFT */
function applyRgbShift(data, width, height) {
  const strength = parseInt(ranges.var1Range.value);
  const effectStrength = strength / 10;
  if (effectStrength === 0) return;

  const maxOffset = 50; // 강도는 유지, 퍼포먼스 고려하여 적정치
  const shiftedData = new Uint8ClampedArray(data); // 원본 복사

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

      data[index]     = shiftedData[rIndex];       // R
      data[index + 1] = shiftedData[gIndex + 1];   // G
      data[index + 2] = shiftedData[bIndex + 2];   // B
    }
  }
}
/* #endregion */

/* #region SATURATION */
function applySaturation(data, width, height) {
  const strength = parseInt(ranges.var2Range.value);
  const effectStrength = strength / 10;
  if (effectStrength === 0) return;

  const factor = effectStrength * 10;
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i], g = data[i + 1], b = data[i + 2];
    const gray = 0.3 * r + 0.59 * g + 0.11 * b;

    data[i]     = Math.min(255, Math.max(0, gray + (r - gray) * factor));
    data[i + 1] = Math.min(255, Math.max(0, gray + (g - gray) * factor));
    data[i + 2] = Math.min(255, Math.max(0, gray + (b - gray) * factor));
  }
}
/* #endregion */

/* #region Final Render */
function renderFinalImage(glitchCanvas) {
  const newImg = new Image();
  newImg.onload = () => {
    // Once the glitch image is generated, update the Konva imageNode with the new image
    imageNode.image(newImg);
    layer.batchDraw();
  };
  newImg.src = glitchCanvas.toDataURL();
}
/* #endregion */

/* #region Audio Toggle button */
const bgMusic = document.getElementById('bgmusic');
const muteToggle = document.getElementById('mute-toggle');

muteToggle.addEventListener('click', () => {
  bgMusic.muted = !bgMusic.muted;
  muteToggle.src = bgMusic.muted ? 'mute.png' : 'play.png';
});
/* #endregion */
