// Indicating elements //
const song01 = document.querySelector("#song01");
const song02 = document.querySelector("#song02");
const song03 = document.querySelector("#song03");
const song04 = document.querySelector("#song04");
const lp = document.querySelector("#lp");

// Click ~> Play //
document.querySelector("#box01").addEventListener("click", () => playSong(song01));
document.querySelector("#box02").addEventListener("click", () => playSong(song02));
document.querySelector("#box03").addEventListener("click", () => playSong(song03));
document.querySelector("#box04").addEventListener("click", () => playSong(song04));

// 노래 재생 함수
function playSong(song) {
  // 이미 다른 노래가 재생 중이면 일시 정지
  if (currentSong && currentSong !== song) {
    currentSong.pause();
  }

  currentSong = song;
  currentSong.play();
  
// Vinyl Animation //
  lp.style.animationPlayState = "running"; // play
}

// Progress bar //
function updateProgressBar() {
  if (currentSong) {
    const value = (currentSong.currentTime / currentSong.duration) * 100;
    document.querySelector("#progress-bar-fill").style.width = value + "%";
  }
}

// Custom Controller Function //
function togglePlayPause() {
  if (currentSong) {
    if (currentSong.paused) {
      currentSong.play();
      lp.style.animationPlayState = "running"; // play
    } else {
      currentSong.pause();
      lp.style.animationPlayState = "paused"; // pause
    }
  }
  }