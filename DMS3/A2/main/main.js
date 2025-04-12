
//---- Image upload ----//

let davidPic = document.getElementById("david-pic");
let inputFile = document.getElementById("input-file");

inputFile.onchange = function(){
  davidPic.src = URL.createObjectURL(inputFile.files[0]);
}