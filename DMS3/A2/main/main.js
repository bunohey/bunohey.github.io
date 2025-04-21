/* #region Import button */
let medusaPic = document.getElementById("medusa-pic");
let inputFile = document.getElementById("input-file");
let originalFileName = "medusa_export.png";

inputFile.onchange = function() {
  let file = inputFile.files[0];
  if (file) {
    medusaPic.src = URL.createObjectURL(file);
    originalFileName = file.name;
  }
} /* #endregion */

/* #region Export button */
document.getElementById("export-label").addEventListener("click", function() {
  let canvas = document.createElement("canvas");
  let ctx = canvas.getContext("2d");

  canvas.width = medusaPic.naturalWidth;
  canvas.height = medusaPic.naturalHeight;

  ctx.drawImage(medusaPic, 0, 0);

  canvas.toBlob(function(blob) {
    let link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = originalFileName;
    link.click();
  }, "image/png");
}); /* #endregion */