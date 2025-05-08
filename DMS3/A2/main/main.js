/* #region Global Setting */
let stage, layer, imageNode;
const ranges = {};
let currentImageData; // Store the original image data

// Konva stage and layer setup //
window.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById('container');
  const maxWidth = window.innerWidth
  const maxHeight = window.innerHeight

  stage = new Konva.Stage({
    container: container, // Use the div with id 'container'
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

// Load image into Konva canvas //
function loadImage(src) {
  const imageObj = new Image();
  imageObj.onload = () => {
    const imgWidth = imageObj.width;
    const imgHeight = imageObj.height;
    const container = stage.container();
    const containerWidth = container.offsetWidth;
    const containerHeight = container.offsetHeight;

    const aspectRatio = imgWidth / imgHeight;
    let canvasWidth = containerWidth;
    let canvasHeight = containerHeight;

    if (imgWidth > canvasWidth || imgHeight > canvasHeight) {
      if (canvasWidth / aspectRatio <= containerHeight) {
        canvasHeight = canvasWidth / aspectRatio;
      } else {
        canvasWidth = containerHeight * aspectRatio;
      }
    }

    stage.width(canvasWidth);
    stage.height(canvasHeight);

    if (imageNode) {
      imageNode.destroy();
    }

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

    // Store the initial image data
    const tempCanvas = document.createElement('canvas');
    const tempCtx = tempCanvas.getContext('2d');
    tempCanvas.width = imgWidth;
    tempCanvas.height = imgHeight;
    tempCtx.drawImage(imageObj, 0, 0);
    currentImageData = tempCtx.getImageData(0, 0, imgWidth, imgHeight);
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
    loadImage(e.target.result);
  };
  reader.readAsDataURL(file);
} /* #endregion */

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

  /* #region Apply Progress */
  let previousStrength = {};
  
  function applyGlitchEffect() {
    if (!imageNode || !currentImageData) return;
  
    const width = stage.width();
    const height = stage.height();
  
    const glitchCanvas = document.createElement('canvas');
    const ctx = glitchCanvas.getContext('2d');
    glitchCanvas.width = width;
    glitchCanvas.height = height;
  
    // Draw original image onto canvas
    ctx.drawImage(imageNode.image(), 0, 0, width, height);
    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;
  
    // Apply all effects with current slider values
    applyRgbShift(data, width, height);
    applySaturation(data, width, height);
    applyNoise(data, width, height);
    applyScramble(data, width, height);
    applySorting(data, width, height);
    applyChromaticAberration(data, width, height);
    applyPixelation(data, width, height);
    applyBitDepthReduction(data, width, height);
    applyScanLine(data, width, height);
    applyBlur(data, width, height);
  
    ctx.putImageData(imageData, 0, 0);
    renderFinalImage(glitchCanvas);
  }

    // Apply effects
    applyRgbShift(data, width, height);
    function applySaturation(data, width, height) {
      // 아직 구현 안 함. 에러 방지용 빈 함수
    }
    
    function applyNoise(data, width, height) {
      // 아직 구현 안 함. 에러 방지용 빈 함수
    }
    
    function applyScramble(data, width, height) {
      // 아직 구현 안 함. 에러 방지용 빈 함수
    }
    
    function applySorting(data, width, height) {
      // 아직 구현 안 함. 에러 방지용 빈 함수
    }
    
    function applyChromaticAberration(data, width, height) {
      // 아직 구현 안 함. 에러 방지용 빈 함수
    }
    
    function applyPixelation(data, width, height) {
      // 아직 구현 안 함. 에러 방지용 빈 함수
    }
    
    function applyBitDepthReduction(data, width, height) {
      // 아직 구현 안 함. 에러 방지용 빈 함수
    }
    
    function applyScanLine(data, width, height) {
      // 아직 구현 안 함. 에러 방지용 빈 함수
    }
    
    function applyBlur(data, width, height) {
      // 아직 구현 안 함. 에러 방지용 빈 함수
    }
/* #endregion */

  /* #region Glitch effects */

    /* #region RGB SHIFT */
    function applyRgbShift(data, width, height) {
      const strength = parseInt(ranges.var1Range.value); // 0 ~ 10
      if (strength === 0) return; // 0이면 효과 없음
    
      const maxShift = strength * 500;
    
      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          const index = (y * width + x) * 4;
          const shift = Math.floor((Math.random() - 0.5) * maxShift);
    
          const rX = Math.min(width - 1, Math.max(0, x + shift));
          const gX = Math.min(width - 1, Math.max(0, x - shift));
          const rIndex = (y * width + rX) * 4;
          const gIndex = (y * width + gX) * 4;
    
          data[index]     = data[rIndex];       // Red
          data[index + 1] = data[gIndex + 1];   // Green
          // Blue는 그대로
        }
      }
    }
    /* #endregion */
   
    /* #endregion */

  /* #endregion */

  /* #region Final Render */
  function renderFinalImage(glitchCanvas) {
    const newImg = new Image();
    newImg.onload = () => {
      imageNode.image(newImg);
      layer.batchDraw();
    };
    newImg.src = glitchCanvas.toDataURL();
  }
  /* #endregion */

/* #endregion */

/* #region Audio Toggle button */
const bgMusic = document.getElementById('bgmusic');
const muteToggle = document.getElementById('mute-toggle');

muteToggle.addEventListener('click', () => {
  // Toggle mute state
  bgMusic.muted = !bgMusic.muted;

  // Change button image based on mute state
  muteToggle.src = bgMusic.muted ? 'mute.png' : 'play.png';
}); /* #endregion */
