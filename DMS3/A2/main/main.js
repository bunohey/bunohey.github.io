//---- Image preview ----//

import Konva from 'konva';

// Create preview container
const preview = document.createElement('img');
preview.id = 'preview';
preview.style.position = 'absolute';
preview.style.top = '2px';
preview.style.right = '2px';
preview.style.border = '1px solid grey';
preview.style.backgroundColor = 'lightgrey';
document.body.appendChild(preview);

const stage = new Konva.Stage({
  container: 'container',
  width: window.innerWidth,
  height: window.innerHeight,
});

const layer = new Konva.Layer();
stage.add(layer);

// generate random shapes
for (let i = 0; i < 10; i++) {
  const shape = new Konva.Circle({
    x: Math.random() * stage.width(),
    y: Math.random() * stage.height(),
    radius: Math.random() * 30 + 5,
    fill: Konva.Util.getRandomColor(),
    draggable: true,
    name: 'shape-' + i,
  });
  layer.add(shape);
}

function updatePreview() {
  const scale = 1 / 4;
  // use pixelRatio to generate smaller preview
  const url = stage.toDataURL({ pixelRatio: scale });
  preview.src = url;
}

// update preview only on dragend for performance
stage.on('dragend', updatePreview);

// add new shapes on double click or double tap
stage.on('dblclick dbltap', () => {
  const shape = new Konva.Circle({
    x: stage.getPointerPosition().x,
    y: stage.getPointerPosition().y,
    radius: Math.random() * 30 + 5,
    fill: Konva.Util.getRandomColor(),
    draggable: true,
    name: 'shape-' + layer.children.length,
  });
  layer.add(shape);
  updatePreview();
});

// show initial preview
updatePreview();