// 각 노래 요소와 비닐판 이미지 요소 선택
const song01 = document.querySelector("#song01");
const song02 = document.querySelector("#song02");
const song03 = document.querySelector("#song03");
const song04 = document.querySelector("#song04");
const lp = document.querySelector("#lp"); // 비닐판 이미지

// 재생 중인 노래를 추적하는 변수
let currentSong = null;

// 노래 클릭 시 해당 노래 재생
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
  
  // 비닐판 애니메이션을 재생
  lp.style.animationPlayState = "running"; // 비닐판 애니메이션 시작
}

// 일시 정지 및 재생 토글 함수
function togglePlayPause() {
  if (currentSong) {
    if (currentSong.paused) {
      currentSong.play();
      lp.style.animationPlayState = "running"; // 비닐판 애니메이션 시작
    } else {
      currentSong.pause();
      lp.style.animationPlayState = "paused"; // 비닐판 애니메이션 정지
    }
  }
}

// 진행 상태 업데이트 함수
function updateProgressBar() {
  if (currentSong) {
    const value = (currentSong.currentTime / currentSong.duration) * 100;
    document.querySelector("#progress-bar-fill").style.width = value + "%";
  }
}
