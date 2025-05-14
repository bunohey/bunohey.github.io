/* #region Global Setting */
const sliderIds = Array.from({ length: 10 }, (_, i) => `var${i + 1}Range`);
const sliders = sliderIds.map(id => document.getElementById(id));
const ranges = sliderIds.reduce((acc, id) => ({ ...acc, [id]: document.getElementById(id) }), {});

let undoStack = [];
let redoStack = [];
const stackSizeLimit = 10; // Limit the size of undo/redo stacks

let lastValues = Array(sliders.length).fill(-1);
let stage, layer, imageNode, currentImageData;

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

    // Create img border //
    imageNode = new Konva.Image({
        image: imageObj,
        stroke: 'white',
        strokeWidth: 8
    });
    
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

    resetSliders();
    applyGlitchEffect();
  };
  imageObj.src = src;
};
/* #endregion */

/* #region Apply Effect Progress */
function applyGlitchEffect(force = false) {
  if (!imageNode) return;

  const currentValues = sliders.map(s => +s.value);

  // Skip if no changes
  if (!force && currentValues.every((v, i) => v === lastValues[i])) return;

  if (!force) {
    undoStack.push([...lastValues]);
    if (undoStack.length > stackSizeLimit) {
      undoStack.shift();
    }
    redoStack = []; // 새로운 변경이 발생하면 redo 스택을 비웁니다.
  }

  lastValues = [...currentValues];

  // Use cached image data
  const cachedData = currentImageData;
  const width = imageNode.width();
  const height = imageNode.height();

  // Create a new canvas for glitch effect
  const glitchCanvas = document.createElement('canvas');
  glitchCanvas.width = width;
  glitchCanvas.height = height;
  const ctx = glitchCanvas.getContext('2d');
  ctx.putImageData(cachedData, 0, 0);

  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;

  // Apply effects based on slider values //
  const applyEffect = (range, effect) =>
    parseInt(range.value) > 0 && effect(data, width, height);

  applyEffect(ranges.var1Range, applyRgbShift);
  applyEffect(ranges.var2Range, applySaturation);
  applyEffect(ranges.var3Range, applyNoise);
  applyEffect(ranges.var4Range, applyScramble);
  applyEffect(ranges.var5Range, applySorting);
  applyEffect(ranges.var6Range, applyChromaticAberration);
  applyEffect(ranges.var7Range, applyPixelation);
  applyEffect(ranges.var8Range, applyBitDepthReduction);
  applyEffect(ranges.var9Range, applyScanLine);
  applyEffect(ranges.var10Range, applyBlur);

  // Apply the final image data //
  ctx.putImageData(imageData, 0, 0);

  renderFinalImage(glitchCanvas);
  layer.batchDraw();
}
/* #endregion */

/* #region Glitch Effects */
/* #region RGB SHIFT */
function applyRgbShift(data, width, height) {
  const strength = parseInt(ranges.var1Range.value);
  const effectStrength = strength / 10;
  if (effectStrength === 0) return;

  const maxOffset = 50;
  const shiftedData = new Uint8ClampedArray(data);

  for (let y = 0; y < height; y++) {
    const rOffset = Math.floor((Math.random() - 0.2) * maxOffset * effectStrength);
    const gOffset = Math.floor((Math.random() - 0.2) * maxOffset * effectStrength);
    const bOffset = Math.floor((Math.random() - 0.2) * maxOffset * effectStrength);

    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;

      const rIdx = (y * width + Math.max(0, x - rOffset)) * 4;
      const gIdx = (y * width + x) * 4;
      const bIdx = (y * width + Math.min(width - 1, x + bOffset)) * 4;

      data[idx]     = shiftedData[rIdx];     // R
      data[idx + 1] = shiftedData[gIdx + 1]; // G
      data[idx + 2] = shiftedData[bIdx + 2]; // B
    }
  }
}
/* #endregion */

/* #region SATURATION */
function applySaturation(data, width, height) {
  const strength = parseInt(ranges.var2Range.value);
  const effectStrength = strength / 10;
  if (effectStrength === 0) return;

  const factor = effectStrength * 15;
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i], g = data[i + 1], b = data[i + 2];
    const gray = 0.3 * r + 0.59 * g + 0.11 * b;

    data[i]     = Math.max(0, Math.min(255, gray + (r - gray) * factor));
    data[i + 1] = Math.max(0, Math.min(255, gray + (g - gray) * factor));
    data[i + 2] = Math.max(0, Math.min(255, gray + (b - gray) * factor));
  }
};
/* #endregion */

/* #region NOISE */
function applyNoise(data, width, height) {
  const strength = parseInt(ranges.var3Range.value);
  const effectStrength = strength / 10;
  if (effectStrength === 0) return;

  const noiseAmount = effectStrength * 2000; //

  for (let i = 0; i < noiseAmount * width; i++) {
    const x = Math.floor(Math.random() * width);
    const y = Math.floor(Math.random() * height);
    const index = (y * width + x) * 4;

    const noise = (Math.random() - 0.5) * 255 * effectStrength;

    data[index]     = Math.max(0, Math.min(255, data[index] + noise));     // R
    data[index + 1] = Math.max(0, Math.min(255, data[index + 1] + noise)); // G
    data[index + 2] = Math.max(0, Math.min(255, data[index + 2] + noise)); // B
  }
};
/* #endregion */

/* #region SCRAMBLE */
function applyScramble(data, width, height) {
  const strength = parseInt(ranges.var4Range.value);
  const effectStrength = strength / 10;
  if (effectStrength === 0) return;

  const blockSize = Math.floor(10 + effectStrength * 30); 
  const numBlocks = Math.floor(effectStrength * 500);

  for (let i = 0; i < numBlocks; i++) {
    const x1 = Math.floor(Math.random() * (width - blockSize));
    const y1 = Math.floor(Math.random() * (height - blockSize));
    const x2 = Math.floor(Math.random() * (width - blockSize));
    const y2 = Math.floor(Math.random() * (height - blockSize));

    for (let y = 0; y < blockSize; y++) {
      for (let x = 0; x < blockSize; x++) {
        const idx1 = ((y1 + y) * width + (x1 + x)) * 4;
        const idx2 = ((y2 + y) * width + (x2 + x)) * 4;

        for (let c = 0; c < 4; c++) {
          const temp = data[idx1 + c];
          data[idx1 + c] = data[idx2 + c];
          data[idx2 + c] = temp;
        }
      }
    }
  }
}
/* #endregion */

/* #region SORTING */
function applySorting(data, width, height) {
  const strength = parseInt(ranges.var5Range.value);
  const effectStrength = strength / 10;
  if (effectStrength === 0) return;

  const numLines = Math.floor(height * effectStrength);
  const lineHeight = 10;

  for (let i = 0; i < numLines; i++) {
    const y = Math.floor(Math.random() * height);
    const line = [];

    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;
      line.push([data[idx], data[idx + 1], data[idx + 2], data[idx + 3]]);
    }

    line.sort((a, b) => a[0] + a[1] + a[2] - (b[0] + b[1] + b[2]));

    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;
      data[idx] = line[x][0];
      data[idx + 1] = line[x][1];
      data[idx + 2] = line[x][2];
      data[idx + 3] = line[x][3];
    }
  }
};
/* #endregion */

  /* #region CHROMATIC ABERRATION */
function applyChromaticAberration(data, width, height) {
  const strength = parseInt(ranges.var6Range.value);
  const effectStrength = strength / 10;
  if (effectStrength === 0) return;

  const offset = Math.floor(effectStrength * 30);
  const original = new Uint8ClampedArray(data);

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;

      const rIdx = (y * width + Math.max(0, x - offset)) * 4;
      const gIdx = (y * width + x) * 4;
      const bIdx = (y * width + Math.min(width - 1, x + offset)) * 4;

      data[idx]     = original[rIdx];     // R
      data[idx + 1] = original[gIdx + 1]; // G
      data[idx + 2] = original[bIdx + 2]; // B
    }
  }
};
/* #endregion */

  /* #region PIXELATION */
function applyPixelation(data, width, height) {
  const strength = parseInt(ranges.var7Range.value);
  const effectStrength = strength / 10;
  if (effectStrength === 0) return;

  const pixelSize = Math.floor(2 + effectStrength * 20);

  for (let y = 0; y < height; y += pixelSize) {
    for (let x = 0; x < width; x += pixelSize) {
      const idx = (y * width + x) * 4;
      const r = data[idx];
      const g = data[idx + 1];
      const b = data[idx + 2];
      const a = data[idx + 3];

      for (let dy = 0; dy < pixelSize; dy++) {
        for (let dx = 0; dx < pixelSize; dx++) {
          const ny = y + dy;
          const nx = x + dx;
          if (nx >= width || ny >= height) continue;
          const nidx = (ny * width + nx) * 4;
          data[nidx] = r;
          data[nidx + 1] = g;
          data[nidx + 2] = b;
          data[nidx + 3] = a;
        }
      }
    }
  }
};
/* #endregion */

  /* #region BIT DEPTH REDUCTION */
  function applyBitDepthReduction(data, width, height) {
    const strength = parseInt(ranges.var8Range.value);
    const effectStrength = strength / 10;
    if (effectStrength === 0) return;

    const baseLevels = 10;
    const exaggeration = Math.pow(effectStrength, 2.5);

    // 단계 수는 유지하되, step을 비정상적으로 크게
    const step = 355 / (baseLevels - exaggeration * 8); 
    const clampedStep = Math.max(1, Math.min(355, step));

    for (let i = 0; i < data.length; i += 4) {
      data[i]     = Math.round(data[i]     / clampedStep) * clampedStep;
      data[i + 1] = Math.round(data[i + 1] / clampedStep) * clampedStep;
      data[i + 2] = Math.round(data[i + 2] / clampedStep) * clampedStep;
    }
  };
  /* #endregion */

  /* #region SCAN LINE */
  function applyScanLine(data, width, height) {
    const strength = parseInt(ranges.var9Range.value);
    const lineGap = 2 + Math.floor(10 - strength);
    const darkness = strength * 20;
  
    for (let y = 0; y < height; y++) {
      if (y % lineGap === 0) {
        for (let x = 0; x < width; x++) {
          const index = (y * width + x) * 4;
          data[index]     = Math.max(0, data[index] - darkness);     // R
          data[index + 1] = Math.max(0, data[index + 1] - darkness); // G
          data[index + 2] = Math.max(0, data[index + 2] - darkness); // B
        }
      }
    }
  };
  /* #endregion */

  /* #region BLUR */
  function applyBlur(data, width, height) {
    const strength = parseInt(ranges.var10Range.value);
    const effectStrength = strength / 10;
    if (effectStrength === 0) return;
  
    const radius = Math.floor(1 + effectStrength * 5);
    const kernelSize = radius * 2 + 1;
    const temp = new Uint8ClampedArray(data);
    
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        let r = 0, g = 0, b = 0, count = 0;
  
        for (let dy = -radius; dy <= radius; dy++) {
          for (let dx = -radius; dx <= radius; dx++) {
            const nx = x + dx;
            const ny = y + dy;
  
            if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
              const index = (ny * width + nx) * 4;
              r += temp[index];
              g += temp[index + 1];
              b += temp[index + 2];
              count++;
            }
          }
        }
  
        const i = (y * width + x) * 4;
        data[i] = r / count;
        data[i + 1] = g / count;
        data[i + 2] = b / count;
      }
    }
  }
  /* #endregion */
/* #endregion */

/* #region Final Render */
function renderFinalImage(glitchCanvas) {
  const newImg = new Image();
  newImg.onload = () => {
    const canvasWidth = imageNode.width(); 
    const canvasHeight = imageNode.height();

    imageNode.image(newImg);  // Adjust the image
    imageNode.width(canvasWidth);
    imageNode.height(canvasHeight);

    imageNode.x((stage.width() - canvasWidth) / 2);
    imageNode.y((stage.height() - canvasHeight) / 2);

    imageNode.getLayer().draw();  // Redraw the layer
  };
  newImg.src = glitchCanvas.toDataURL();
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
document.querySelector('label[for="reset"]').addEventListener('click', () => {
  resetSliders();
  updateAudioGlitch(); // Add this line
});

function resetSliders() {
  sliders.forEach(slider => slider.value = 0);
  applyGlitchEffect();
}

// Random btn //
document.querySelector('label[for="random"]').addEventListener('click', () => {
  randomizeSliders();
  updateAudioGlitch(); // Add this line
});

function randomizeSliders() {
  sliders.forEach(slider => slider.value = Math.floor(Math.random() * 5));
  applyGlitchEffect();
}
/* #endregion */

/* #region Undo & Redo Button */
// Undo btn //
document.querySelector('label[for="undo"]').addEventListener('click', () => {
  if (undoStack.length > 0) {
    const previousState = undoStack.pop();
    redoStack.push([...lastValues]);
    if (redoStack.length > stackSizeLimit) {
      redoStack.shift(); // Limit redo stack size
    }

    sliders.forEach((slider, i) => slider.value = previousState[i]);
    lastValues = [...previousState];
    applyGlitchEffect(true);
  }
});

// Redo btn//
document.querySelector('label[for="redo"]').addEventListener('click', () => {
  if (redoStack.length > 0) {
    const nextState = redoStack.pop();
    undoStack.push([...lastValues]);
    if (undoStack.length > stackSizeLimit) {
      undoStack.shift(); // Limit undo stack size
    }

    sliders.forEach((slider, i) => slider.value = nextState[i]);
    lastValues = [...nextState];
    applyGlitchEffect(true);
  }
});
/* #endregion */

/* #region Interactive Background Music */
const bgMusic = document.getElementById('bgmusic');

// Initialize Tone.js effects
const bitCrusher = new Tone.BitCrusher(12).toDestination();
const distortion = new Tone.Distortion(0).toDestination();
const pitchShift = new Tone.PitchShift({ pitch: 0 }).toDestination();
const feedbackDelay = new Tone.FeedbackDelay('8n', 0).toDestination();

// Connect the audio nodes //
bgMusic.addEventListener('canplay', () => {
  const mediaSource = Tone.context.createMediaElementSource(bgMusic);
  
  mediaSource.connect(bitCrusher);
  bitCrusher.connect(distortion);
  distortion.connect(pitchShift);
  pitchShift.connect(feedbackDelay);
  feedbackDelay.connect(Tone.Destination);
});

// Update audio glitch based on slider values //
function updateAudioGlitch() {
  const total = sliders.reduce((sum, s) => sum + Number(s.value), 0);

  // Reset
  bgMusic.playbackRate = 1; 
  bitCrusher.bits = 12;
  distortion.distortion = 0;
  pitchShift.pitch = 0;
  feedbackDelay.feedback = 0;

if (total <= 10) {
    // Default music
    bgMusic.playbackRate = 1;
    bitCrusher.bits = 12;
    distortion.distortion = 0;
    pitchShift.pitch = 0;
    feedbackDelay.feedback = 0;
  } else if (total <= 30) {
    // Slow + slight crackle
    bgMusic.playbackRate = 0.7;
    distortion.distortion = 0.2;
    feedbackDelay.feedback = 0.1;
  } else if (total <= 50) {
    // Faster + more distortion (bit crushing)
    bgMusic.playbackRate = 1.3; 
    bitCrusher.bits = 8; 
    feedbackDelay.feedback = 0.2;
  } else if (total <= 71) {
    // Heartbeat + monster-like tone
    bgMusic.playbackRate = 0.5;
    distortion.distortion = 0.8;
    pitchShift.pitch = -5; //
    feedbackDelay.feedback = 0.3;
  } else if (total <= 100) {
    // Fully crushed
    bgMusic.playbackRate = 0.3; 
    bitCrusher.bits = 2;
    distortion.distortion = 1;
    feedbackDelay.feedback = 0.4;
    pitchShift.pitch = -12;
  }
}

// Connect sliders to audio glitch update //
sliders.forEach(slider => slider.addEventListener('input', updateAudioGlitch));

// Play music on first click //
window.addEventListener('click', async () => {
  await Tone.start();
  bgMusic.play();
  updateAudioGlitch();
}, { once: true });
/* #endregion */

/* #region Audio Toggle */
const muteToggle = document.getElementById('mute-toggle');
let isMuted = false;

muteToggle.addEventListener('click', () => {
  isMuted = !isMuted;
  bgMusic.muted = isMuted;
  muteToggle.src = isMuted ? 'mute.png' : 'play.png';
});

// Initialize icon state based on initial mute status
if (bgMusic.muted) {
  muteToggle.src = 'mute.png';
  isMuted = true;
} else {
  muteToggle.src = 'play.png';
  isMuted = false;
}
/* #endregion */