
//---- Image upload ----//

let medusaPic = document.getElementById("medusa-pic");
let inputFile = document.getElementById("input-file");

inputFile.onchange = function(){
  medusaPic.src = URL.createObjectURL(inputFile.files[0]);
}