// Konva.js stage & layer setup //
window.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById('container'); // Konva container //

  // Konva stage and layer //
  stage = new Konva.Stage({ container, width: container.clientWidth, height: container.clientHeight });
  layer = new Konva.Layer();
  stage.add(layer);
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

// Load image & cache original data //
function loadImage(src) {
  const imageObj = new Image();
  imageObj.crossOrigin = "anonymous";
  imageObj.onload = () => {
    if (imageNode) imageNode.destroy();
    
    // cache original pixels //
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

// Final render process //
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


// 