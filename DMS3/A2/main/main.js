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