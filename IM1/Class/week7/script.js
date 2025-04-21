// top heading
const topHeading = document.querySelector("#top-heading");
console.log(topHeading);

let myNewHeading = "audio is currently playing!";

const airportAudio = document.querySelector("#airport-audio");
console.log(airportAudio);

const popSound = document.querySelector("#pop-audio");

//----------------------------
// my logic for playing the sound:
const playButton = document.querySelector("#play-button");
console.log(playButton);

playButton.addEventListener("click", playAudio);

function playAudio() {
    myNewHeading = "Audio is currently playing";
    airportAudio.play();
    topHeading.textContent = myNewHeading;
}

//----------------------------
// my logic for pausing the sound:
const pauseButton = document.querySelector("#pause-button");
console.log(pauseButton);

pauseButton.addEventListener("click", pauseAudio);

function pauseAudio() {
    myNewHeading = "Audio is currently paused";
    airportAudio.pause();
    topHeading.textContent = myNewHeading;
}

//----------------------------
// my logic for popping the sound:
const popButton = document.querySelector("#pop-button");
console.log(popButton);

popButton.addEventListener("click", popAudio);

function popAudio() {
    myNewHeading = "Popping sound";
    airportAudio.pause();
    popSound.play();
    topHeading.textContent = myNewHeading;
}