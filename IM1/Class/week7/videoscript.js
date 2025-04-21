const myVideo = document.querySelector("#my-video");
console.log(myVideo);

//----------------------------
// my logic for playing the sound:
const playButton = document.querySelector("#play-button");
console.log(playButton);

playButton.addEventListener("click", playVideo);

function playVideo() {
    myVideo.play();

}
//----------------------------
const pauseButton = document.querySelector("#pause-button");
// my logic for pausing the sound:
console.log(pauseButton);

pauseButton.addEventListener("click", pauseVideo);

function pauseVideo() {
  myVideo.pause();
}
