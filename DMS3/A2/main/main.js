/* #region Import button */
let medusaPic = document.getElementById("medusa-pic");
let inputFile = document.getElementById("input-file");
let originalFileName = "medusa_export.png";  // 기본 이름

inputFile.onchange = function() {
  let file = inputFile.files[0];
  if (file) {
    medusaPic.src = URL.createObjectURL(file);
    originalFileName = file.name;  // 파일 이름 저장
  }
} /* #endregion */

/* #region Export button */
document.getElementById("export-label").addEventListener("click", function() {
  let canvas = document.createElement("canvas");
  let ctx = canvas.getContext("2d");

  // 원본 이미지 크기 기준으로 canvas 크기 설정
  canvas.width = medusaPic.naturalWidth;
  canvas.height = medusaPic.naturalHeight;

  // 원본 이미지 그리기
  ctx.drawImage(medusaPic, 0, 0);

  // Blob으로 저장 처리
  canvas.toBlob(function(blob) {
    let link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = originalFileName;  // 불러온 파일 이름 그대로 저장!
    link.click();
  }, "image/png");
}); /* #endregion */