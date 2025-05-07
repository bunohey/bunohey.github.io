/* #region Global Setting */
let stage, layer, imageNode;
const ranges = {};

// Konva stage and layer setup //
window.addEventListener("DOMContentLoaded", () => {
  const maxWidth = window.innerWidth * 0.65;
  const maxHeight = window.innerHeight * 0.75;

  stage = new Konva.Stage({
    container: document.getElementById('medusa-pic').parentNode,
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

    const aspectRatio = imgWidth / imgHeight;
    let canvasWidth = stage.width();
    let canvasHeight = stage.height();

    if (imgWidth > canvasWidth || imgHeight > canvasHeight) {
      if (canvasWidth / aspectRatio <= canvasHeight) {
        canvasHeight = canvasWidth / aspectRatio;
      } else {
        canvasWidth = canvasHeight * aspectRatio;
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
  };
  imageObj.src = src;
} /* #endregion */
 
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
  /* #region Applying Progress */
  function applyGlitchEffect() {
    if (!imageNode) return;

    const glitchCanvas = document.createElement('canvas');
    const ctx = glitchCanvas.getContext('2d');
    const width = stage.width();
    const height = stage.height();

    glitchCanvas.width = width;
    glitchCanvas.height = height;

    // Draw image to temp canvas //v
    ctx.drawImage(imageNode.image(), 0, 0, width, height);

    // Get ImageData //
    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;

    const shiftAmount = parseInt(ranges.var1Range.value);
    const saturation = parseInt(ranges.var2Range.value) / 10;
    const noise = parseInt(ranges.var3Range.value);
    const pixelSize = parseInt(ranges.var7Range.value);
    const bitDepth = parseInt(ranges.var8Range.value);

    // Apply back to Konva //
    const newImg = new Image();
    newImg.onload = () => {
      imageNode.image(newImg);
      layer.batchDraw();
    };
    newImg.src = glitchCanvas.toDataURL();
    } /* #endregion */
  /* #region Effects */
    // RGB SHIFT //
    for (let i = 0; i < data.length; i += 4) {
      data[i] = data[i + (shiftAmount % 4)] || data[i];
    }

    // NOISE //
    for (let i = 0; i < data.length; i += 4) {
      const noiseVal = (Math.random() - 0.5) * noise;
      data[i] += noiseVal;
      data[i + 1] += noiseVal;
      data[i + 2] += noiseVal;
    }

    // SATURATION //
    for (let i = 0; i < data.length; i += 4) {
      const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
      data[i] = avg + (data[i] - avg) * saturation;
      data[i + 1] = avg + (data[i + 1] - avg) * saturation;
      data[i + 2] = avg + (data[i + 2] - avg) * saturation;
    }

    // BIT DEPTH REDUCTION / /
    const levels = Math.pow(2, bitDepth);
    const step = 255 / (levels - 1);
    for (let i = 0; i < data.length; i += 4) {
      data[i] = Math.round(data[i] / step) * step;
      data[i + 1] = Math.round(data[i + 1] / step) * step;
      data[i + 2] = Math.round(data[i + 2] / step) * step;
    }

    // SCAN LINE //
    const scanIntensity = parseInt(ranges.var9Range.value);
    ctx.save();
    ctx.strokeStyle = `rgba(0, 0, 0, ${scanIntensity / 200})`;
    for (let y = 0; y < height; y += 2) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }
    ctx.restore();

    // BLUR //
    function addBlurSlider() {
      const blurSlider = document.createElement('input');
      blurSlider.type = 'range';
      blurSlider.min = '0';
      blurSlider.max = '20';
      blurSlider.value = 10; // Set default value
      blurSlider.style.position = 'absolute';
      blurSlider.style.top = '20px';
      blurSlider.style.left = '20px';
    
      blurSlider.addEventListener('input', (e) => {
        const value = parseInt(e.target.value);
        applyBlur(value);
      });
    
      document.body.appendChild(blurSlider);
    }
    
    function applyBlur(value) {
      if (!imageNode) return;
      imageNode.cache();
      imageNode.filters([Konva.Filters.Blur]);
      imageNode.blurRadius(value);
      layer.batchDraw();
    }
    /* #endregion */
/* #endregion */

/* #region Audio Toggle */
const bgMusic = document.getElementById('bgmusic');
const muteToggle = document.getElementById('mute-toggle');

muteToggle.addEventListener('click', () => {
  bgMusic.muted = !bgMusic.muted;
  muteToggle.src = bgMusic.muted ? 'mute.png' : 'play.png';
}); /* #endregion */