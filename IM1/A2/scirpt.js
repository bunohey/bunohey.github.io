// 각 노래 요소와 재생 버튼 요소를 선택합니다.
const song01 = document.querySelector("#song01");
const song02 = document.querySelector("#song02");
const song03 = document.querySelector("#song03");
const song04 = document.querySelector("#song04");

const playPauseBtn = document.querySelector("#playpauseBtn");
const playPauseImg = document.querySelector("#playpauseImg");
const progressBar = document.querySelector("#progress-bar-fill");

let currentSong = null; // 현재 재생 중인 노래를 추적합니다.

// 노래 클릭 시 해당 노래를 재생합니다.
document.querySelector("#song01").addEventListener("click", () => playSong(song01));
document.querySelector("#song02").addEventListener("click", () => playSong(song02));
document.querySelector("#song03").addEventListener("click", () => playSong(song03));
document.querySelector("#song04").addEventListener("click", () => playSong(song04));

// 노래를 재생하는 함수입니다.
function playSong(song) {
  if (currentSong && currentSong !== song) {
    currentSong.pause();
  }
  currentSong = song;
  currentSong.play();
  playPauseImg.src = "https://img.icons8.com/ios-glyphs/30/pause--v1.png";
}

// 일시 정지 및 재생 토글 함수입니다.
playPauseBtn.addEventListener("click", () => {
  if (currentSong) {
    if (currentSong.paused) {
      currentSong.play();
      playPauseImg.src = "https://img.icons8.com/ios-glyphs/30/pause--v1.png";
    } else {
      currentSong.pause();
      playPauseImg.src = "https://img.icons8.com/ios-glyphs/30/play--v2.png";
    }
  }
});

// 진행 상태 업데이트 함수입니다.
function updateProgressBar() {
  if (currentSong) {
    const value = (currentSong.currentTime / currentSong.duration) * 100;
    progressBar.style.width = value + "%";
  }
}

// 진행 상태를 주기적으로 업데이트합니다.
setInterval(updateProgressBar, 100);
