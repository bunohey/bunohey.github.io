// #region Element Selection //
const song01 = document.querySelector("#song01");
const song02 = document.querySelector("#song02");
const song03 = document.querySelector("#song03");
const song04 = document.querySelector("#song04");
let allSongs = [song01, song02, song03, song04];
let currentSong = song01;

const lp = document.querySelector("#lp");
const playpauseBtn = document.querySelector("#playpauseImg");
const repeatBtn = document.querySelector("#repeatImg");
const shuffleBtn = document.querySelector("#shuffleBtn");
const skiptostartBtn = document.querySelector("#skiptostartBtn");
const endBtn = document.querySelector("#endBtn");

// Song box click events //
document.querySelector("#box01").addEventListener("click", () => playSong(song01));
document.querySelector("#box02").addEventListener("click", () => playSong(song02));
document.querySelector("#box03").addEventListener("click", () => playSong(song03));
document.querySelector("#box04").addEventListener("click", () => playSong(song04));
// #endregion //

// #region Play Song Function //
function playSong(song) {
  if (currentSong && currentSong !== song) {
    currentSong.pause();
    currentSong.currentTime = 0;
  }

  currentSong = song;
  currentSong.play();
  lp.style.animationPlayState = "running";
  updatePlayPauseIcon();

  const songIndex = allSongs.indexOf(song);
  highlightPlayingBox(songIndex);
}

allSongs.forEach(song => {
  song.addEventListener("ended", () => {
    if (isRepeating) {
      song.play();
      lp.style.animationPlayState = "running";
      updatePlayPauseIcon();
    } else {
      const currentIndex = allSongs.indexOf(song);
      const nextIndex = currentIndex + 1;
      if (nextIndex < allSongs.length) {
        playSong(allSongs[nextIndex]);
      } else {
        lp.style.animationPlayState = "paused";
        updatePlayPauseIcon();
        highlightPlayingBox(-1);
      }
    }
  });
});

// Highlight the currently playing box //
function highlightPlayingBox(currentIndex) {
  const boxes = document.querySelectorAll('.box');
  boxes.forEach((box, index) => {
    box.classList.toggle('playing', index === currentIndex);
  });
}
// #endregion //

// #region Progress Bar //
function updateProgressBar() {
  const value = (currentSong.currentTime / currentSong.duration) * 100;
  document.querySelector("#progress-bar-fill").style.width = value + "%";
}

allSongs.forEach(song => {
  song.addEventListener("timeupdate", updateProgressBar);
});

const progressBar = document.querySelector(".progress-bar");
const progressFill = document.querySelector("#progress-bar-fill");
let isDragging = false;

progressBar.addEventListener("mousedown", (e) => {
  isDragging = true;
  seek(e);
});

document.addEventListener("mousemove", (e) => {
  if (isDragging) seek(e);
});

document.addEventListener("mouseup", () => {
  isDragging = false;
});

function seek(e) {
  if (!currentSong) return;
  const rect = progressBar.getBoundingClientRect();
  let percentage = (e.clientX - rect.left) / rect.width;
  percentage = Math.max(0, Math.min(1, percentage));
  currentSong.currentTime = percentage * currentSong.duration;
}
// #endregion //

// #region Play/Pause //
function togglePlayPause() {
  if (currentSong) {
    if (currentSong.paused) {
      currentSong.play();
      lp.style.animationPlayState = "running";
    } else {
      currentSong.pause();
      lp.style.animationPlayState = "paused";
    }
    updatePlayPauseIcon();

    const songIndex = allSongs.indexOf(currentSong);
    highlightPlayingBox(songIndex);
  }
}

function updatePlayPauseIcon() {
  playpauseBtn.src = currentSong.paused
    ? "https://img.icons8.com/ios-glyphs/30/play--v2.png"
    : "https://img.icons8.com/ios-glyphs/30/pause--v2.png";
}
// #endregion //

// #region Repeat //
let isRepeating = false;
function repeat() {
  isRepeating = !isRepeating;
  currentSong.loop = isRepeating;
  toggleButtonSizeAndDarken("#repeatBtn", isRepeating);
}
// #endregion //

// #region Skip to Start //
skiptostartBtn.addEventListener("click", skipToStart);

function skipToStart() {
  if (currentSong) {
    currentSong.currentTime = 0;
    currentSong.play();
  }
}
// #endregion //

// #region End Btn //
endBtn.addEventListener("click", skipToEnd);

function skipToEnd() {
  if (currentSong) {
    const duration = currentSong.duration;
    if (duration > 1) {
      currentSong.currentTime = duration - 1;
    } else {
      currentSong.currentTime = 0;
    }
    currentSong.play();
  }
}
// #endregion //

// #region Shuffle //
let isShuffled = false;
shuffleBtn.addEventListener("click", shufflePlaylist);

function shufflePlaylist() {
  isShuffled = !isShuffled;
  toggleButtonSizeAndDarken("#shuffleBtn", isShuffled);
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function toggleButtonSizeAndDarken(buttonSelector, isActive) {
  const button = document.querySelector(buttonSelector);
  if (isActive) {
    button.style.transform = "scale(0.9)";
    button.style.opacity = "0.8";
  } else {
    button.style.transform = "scale(1)";
    button.style.opacity = "1";
  }
}
// #endregion //

// #region Auto Next Song //
allSongs.forEach(song => {
  song.addEventListener("ended", () => {
    if (isShuffled) {
      const currentIndex = allSongs.indexOf(song);
      const nextIndex = (currentIndex + 1) % allSongs.length;
      playSong(allSongs[nextIndex]);
    } else {
      if (isRepeating) {
        song.play();
        lp.style.animationPlayState = "running";
        updatePlayPauseIcon();
      } else {
        const currentIndex = allSongs.indexOf(song);
        const nextIndex = currentIndex + 1;
        if (nextIndex < allSongs.length) {
          playSong(allSongs[nextIndex]);
        } else {
          lp.style.animationPlayState = "paused";
          updatePlayPauseIcon();
          highlightPlayingBox(-1);
        }
      }
    }
  });
});
// #endregion //

// #region Drag & Drop Playlist //
const playlist = document.querySelector('.playlist');
let draggedItem = null;

document.querySelectorAll('.box').forEach(item => {
  item.draggable = true;

  item.addEventListener('dragstart', () => {
    draggedItem = item;
    setTimeout(() => item.style.display = "none", 0);
  });

  item.addEventListener('dragend', () => {
    setTimeout(() => {
      draggedItem.style.display = "flex";
      draggedItem = null;

      const newOrder = Array.from(document.querySelectorAll('.box')).map(box => {
        const audioId = box.getAttribute('id').replace('box', 'song');
        return document.querySelector(`#${audioId}`);
      });

      allSongs.length = 0;
      allSongs.push(...newOrder);
    }, 0);
  });
});

playlist.addEventListener('dragover', e => {
  e.preventDefault();
  const afterElement = getDragAfterElement(playlist, e.clientY);
  if (afterElement == null) {
    playlist.appendChild(draggedItem);
  } else {
    playlist.insertBefore(draggedItem, afterElement);
  }
});

function getDragAfterElement(container, y) {
  const draggableElements = [...container.querySelectorAll('.box:not([style*="display: none"])')];
  return draggableElements.reduce((closest, child) => {
    const box = child.getBoundingClientRect();
    const offset = y - box.top - box.height / 2;
    return (offset < 0 && offset > closest.offset) ? { offset, element: child } : closest;
  }, { offset: Number.NEGATIVE_INFINITY }).element;
}
// #endregion //