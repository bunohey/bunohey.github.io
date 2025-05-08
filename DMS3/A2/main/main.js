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

  /* #region Apply Progress */
  function applyGlitchEffect() {
    if (!imageNode || !currentImageData) return;

    const width = stage.width();
    const height = stage.height();

    const glitchCanvas = document.createElement('canvas');
    const ctx = glitchCanvas.getContext('2d');
    glitchCanvas.width = width;
    glitchCanvas.height = height;

    // Draw the current Konva image onto the glitch canvas
    ctx.drawImage(imageNode.image(), 0, 0, width, height);

    // Get ImageData from the glitch canvas
    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;

    // Apply effects
    applyRgbShift(data, width, height);  // Apply RGB Shift
    applySaturation(data); // Apply Saturation
    applyNoise(data); // Apply Noise
    applyBitDepthReduction(data); // Apply Bit Depth
    applyScanLine(data, width, height); // Apply Scan Line

    // Put the modified image data back to the glitch canvas
    ctx.putImageData(imageData, 0, 0);

    // Final image update
    renderFinalImage(glitchCanvas);
  }
/* #endregion */

  /* #region Glitch effects */

    /* #region RGB SHIFT */
    function applyRgbShift(data, width, height) {
      const shiftAmount = parseInt(ranges.var1Range.value) * 2; // Adjust multiplier as needed
      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          const index = (y * width + x) * 4;
          const shift = Math.round(Math.random() * shiftAmount);

          const rIndex = ((y * width + ((x + shift) % width)) * 4);
          const gIndex = ((y * width + ((x - shift + width) % width)) * 4);

          data[index] = data[rIndex] || 0;     // R
          data[index + 1] = data[gIndex + 1] || 0; // G
          // B remains the same
        }
      }
    }
    /* #endregion */

    /* #region SATURATION */
    function applySaturation(data) {
      const saturation = parseFloat(ranges.var2Range.value) / 10; // Normalize to 0-1
      for (let i = 0; i < data.length; i += 4) {
        let r = data[i];
        let g = data[i + 1];
        let b = data[i + 2];

        const gray = 0.299 * r + 0.587 * g + 0.114 * b;
        r = gray + (r - gray) * saturation;
        g = gray + (g - gray) * saturation;
        b = gray + (b - gray) * saturation;

        data[i] = r;
        data[i + 1] = g;
        data[i + 2] = b;
      }
    }
    /* #endregion */

    /* #region NOISE */
    function applyNoise(data) {
      const noiseAmount = parseInt(ranges.var3Range.value) * 5; // Adjust multiplier
      for (let i = 0; i < data.length; i += 4) {
        const rand = (Math.random() * 2 - 1) * noiseAmount;
        data[i] = Math.max(0, Math.min(255, data[i] + rand));
        data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + rand));
        data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + rand));
      }
    }
    /* #endregion */

    /* #region BIT DEPTH REDUCTION */
    function applyBitDepthReduction(data) {
      const bitDepth = parseInt(ranges.var8Range.value);
      const levels = Math.pow(2, bitDepth);
      const step = 255 / (levels - 1);
      for (let i = 0; i < data.length; i++) {
        data[i] = Math.round(data[i] / step) * step;
      }
    }
    /* #endregion */

    /* #region SCAN LINE */
    function applyScanLine(data, width, height) {
      const scanLineAmount = parseInt(ranges.var9Range.value) * 3; // Adjust spacing
      for (let y = 0; y < height; y += scanLineAmount) {
        for (let x = 0; x < width * 4; x++) {
          const index = y * width * 4 + x;
          if (index < data.length) {
            data[index] = data[index] * 0.7; // Darken the scan lines
          }
        }
      }
    }
    /* #endregion */

    /* #region BLUR */
    function addBlurSlider() {
      const controlPanel = document.querySelector('.controlpanel');
      const blurDiv = document.createElement('div');
      blurDiv.className = 'rangeBox';
      blurDiv.innerHTML = `
        <h2>BLUR</h2>
        <input type="range" id="var10Range" min="0" max="10" step="1" value="0">
      `;
      controlPanel.appendChild(blurDiv);
      ranges['var10Range'] = document.getElementById('var10Range');
      ranges['var10Range'].addEventListener('input', applyGlitchEffect);
    }

    function applyBlur(ctx, imageData, width, height) {
      const blurRadius = parseInt(ranges.var10Range.value);
      if (blurRadius > 0) {
        const blurredData = blurImageData(imageData, blurRadius);
        ctx.putImageData(blurredData, 0, 0); // Apply blur directly to the glitch canvas
        return;
      }
      ctx.putImageData(imageData, 0, 0); // If no blur, put the original data
    }

    function blurImageData(imageData, radius) {
      const data = imageData.data;
      const width = imageData.width;
      const height = imageData.height;
      const result = new ImageData(width, height);
      const resultData = result.data;

      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          let rSum = 0;
          let gSum = 0;
          let bSum = 0;
          let aSum = 0;
          let count = 0;

          for (let ky = -radius; ky <= radius; ky++) {
            for (let kx = -radius; kx <= radius; kx++) {
              const nx = x + kx;
              const ny = y + ky;

              if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
                const index = (ny * width + nx) * 4;
                rSum += data[index];
                gSum += data[index + 1];
                bSum += data[index + 2];
                aSum += data[index + 3];
                count++;
              }
            }
          }

          const index = (y * width + x) * 4;
          resultData[index] = rSum / count;
          resultData[index + 1] = gSum / count;
          resultData[index + 2] = bSum / count;
          resultData[index + 3] = aSum / count;
        }
      }
      return result;
    }
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