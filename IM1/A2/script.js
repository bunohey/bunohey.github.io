// #region Element Selection //
  /* This section initializes the main elements of the music player by linking audio files and control buttons to JavaScript. It also allows users to play a specific song by clicking on its corresponding box.
  Source: Assessment 2 resources */

// Select individual audio & interactive elements by ID //
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
document.querySelector("#box01").addEventListener("click", () => playSong(song01)); // Click song box ~> play the specific song //
document.querySelector("#box02").addEventListener("click", () => playSong(song02));
document.querySelector("#box03").addEventListener("click", () => playSong(song03));
document.querySelector("#box04").addEventListener("click", () => playSong(song04));
// #endregion //

// #region Play Song Function //
  /* This code covers the basic song functionality, when a song is selected, it starts playing, and the LP animation runs to enhance the visual experience. If a different song is selected while one is already playing, the current song pauses, resets, and the new song begins playing from the start. The playlist is also updated visually, with the currently playing song highlighted, making it easier for users to track their listening progress.
  Sources: https://expertsuggestion.com/how-to-create-music-player-with-playlist-html-javascript?utm_source=chatgpt.com#google_vignette
  https://www.youtube.com/watch?v=1-CvPn4AbT4 */

function playSong(song) {
  //If another song is played while one is currently playing ~> Pause the current song //
  if (currentSong && currentSong !== song) {
    currentSong.pause();
    currentSong.currentTime = 0;
  }

  currentSong = song;
  currentSong.play();
  lp.style.animationPlayState = "running"; // Play LP animation //
  updatePlayPauseIcon();  // Update the play/pause icon //

  const songIndex = allSongs.indexOf(song); // Find the current song's index //
  highlightPlayingBox(songIndex);  // Highlight the currently playing box //
}

// When song ends //
allSongs.forEach(song => {
  song.addEventListener("ended", () => {
    if (isRepeating) { // If the repeat mode is ON ~> replay //
      lp.style.animationPlayState = "running";
      updatePlayPauseIcon();
    } else {
      const currentIndex = allSongs.indexOf(song);
      const nextIndex = currentIndex + 1;
      if (nextIndex < allSongs.length) { // If it's not the last song ~> Play next song //
        playSong(allSongs[nextIndex]);
      } else {
        lp.style.animationPlayState = "paused";
        updatePlayPauseIcon();
        highlightPlayingBox(-1); // Remove box highlighting //
      }
    }
  });
});

// Highlight the currently playing box //
function highlightPlayingBox(currentIndex) {
  const boxes = document.querySelectorAll('.box');
  boxes.forEach((box, index) => {
    box.classList.toggle('playing', index === currentIndex); // Add 'playing' class to the box of the current song //
  });
}
// #endregion //

// #region Progress Bar //
  /* By providing progress bar, users to visually track the progress of the currently playing song and interact with it by clicking or dragging to change the song's playback position. So, it allows the user to find specific parts of the song and freely skip to any section they want.
  Sources: Assessment 2 resources,
   https://stackoverflow.com/questions/57497793/calculating-getboundingclientrect-in-percentage */

// Calculate & update the progress of the current song as a % //
function updateProgressBar() {
  const value = (currentSong.currentTime / currentSong.duration) * 100;
  document.querySelector("#progress-bar-fill").style.width = value + "%";
}

// Update each song's progress bar according to the time // 
allSongs.forEach(song => {
  song.addEventListener("timeupdate", updateProgressBar);
});

const progressBar = document.querySelector(".progress-bar");
const progressFill = document.querySelector("#progress-bar-fill");
let isDragging = false;

progressBar.addEventListener("mousedown", (e) => {
  isDragging = true; // draggable timeline bar //
  seek(e);
});

// If move the progress bar, update the song's current time //
document.addEventListener("mousemove", (e) => {
  if (isDragging) seek(e);
});

// If release the mouse btn, stop dragging //
document.addEventListener("mouseup", () => {
  isDragging = false;
});

// Update the song's current time on the progress bar //
function seek(e) {
  if (!currentSong) return;
  const rect = progressBar.getBoundingClientRect(); // Get the bar's X-axis //
  let percentage = (e.clientX - rect.left) / rect.width; // Calculate the clicked position as a % //
  percentage = Math.max(0, Math.min(1, percentage));
  currentSong.currentTime = percentage * currentSong.duration; // Set the song's current time based on the % //
}
// #endregion //

// #region Controller //
  /* The code provides immediate visual and behavioral feedback to the user. Buttons like play/pause, repeat, shuffle, and skip change their appearance (size and opacity) when activated, indicating their current state. The play/pause action also triggers an LP animation, providing visual feedback of the music's status. Skipping to start or end immediately resets or advances the track, while the shuffle button rearranges the playlist. Additionally, the playlist highlights the currently playing song, offering continuous feedback. These interactions ensure users are always aware of the player’s state, enhancing usability.
  Source: Assessment 2 resources,
  https://www.youtube.com/watch?v=oscPp3KghS8,
  https://www.geeksforgeeks.org/shuffle-a-given-array-using-fisher-yates-shuffle-algorithm/ */
 
  // #region Play/Pause //
  function togglePlayPause() {
    if (currentSong) {
      if (currentSong.paused) {
        currentSong.play();
        lp.style.animationPlayState = "running"; // if song is playing ~> play LP animation //
      } else {
        currentSong.pause();
        lp.style.animationPlayState = "paused"; // if song is paused ~> pause LP animation //
      }
      updatePlayPauseIcon();

      const songIndex = allSongs.indexOf(currentSong);
      highlightPlayingBox(songIndex); // Hightlight current song //
    }
  }

  function updatePlayPauseIcon() { // Switch the toggle image according to the song's status //
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
    toggleButtonSizeAndDarken("#repeatBtn", isRepeating); // Change button style if clicked //
  }
  // #endregion //
  // #region Skip to Start //
  skiptostartBtn.addEventListener("click", skipToStart);

  function skipToStart() {
    if (currentSong) {
      currentSong.currentTime = 0; // Reset the time & play again //
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
        currentSong.currentTime = duration - 1; // Move to the 1 sec before of the end //
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

// Function to shuffle an array (Fisher-Yates algorithm) //
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// If button is selected, change the design style //
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
// #endregion //

// #region Auto Next Song //
  /* Just like a real vinyl record playing, this feature automatically plays the next song to ensure smooth music flow, and if the entire playlist has played, it will stop playing music. The logic adapts to both shuffled and sequential play modes, allowing the user to enjoy continuous music without interruptions. While creating this feature, I learned about the concept of "index," and furthermore, I was curious about how the next song automatically plays when the song order is changed. Now, I fully understood how it works.
    Sources: https://developer.mozilla.org/en-US/docs/Web/API/HTMLAudioElement
    https://programminghead.com/how-to-play-audio-in-html-using-javascript */
    
allSongs.forEach(song => {
  song.addEventListener("ended", () => {

    // If it's on shuffle mode //
    if (isShuffled) { 
      const currentIndex = allSongs.indexOf(song); // Get 'current' song index //
      const nextIndex = (currentIndex + 1) % allSongs.length;  // Get 'next' song index //
      playSong(allSongs[nextIndex]);  // ~> Play the next song //
    } else {

    // If it's on repeating mode //
    if (isRepeating) {
      song.play(); // Just replay the current song //
      lp.style.animationPlayState = "running";
      updatePlayPauseIcon();
    } else {

      // Otherwise, move to the next song //
      const currentIndex = allSongs.indexOf(song); // Get 'current' song index //
      const nextIndex = currentIndex + 1; // Get 'next' song index //
      if (nextIndex < allSongs.length) { 
        playSong(allSongs[nextIndex]); // ~> Play the next song //
      } else { 
        // If it's the last song //
        lp.style.animationPlayState = "paused";
        updatePlayPauseIcon();
        highlightPlayingBox(-1);
        }  // ~> Pause the whole animation & playing song //
      }
    }
  });
  });
// #endregion //

// #region Drag & Drop Playlist //
  /* Through this feature, users can directly change the order of the songs and create a new flow of tracks that’s different from a typical music album, arranged exactly the way they want. This was the most challenging part of the project, and I referred to a variety of complex YouTube videos, websites, and AI tools.
  Resources: https://www.youtube.com/watch?v=BVVIJrMUbAU
  https://www.javascripttutorial.net/web-apis/javascript-drag-and-drop/
  https://www.geeksforgeeks.org/create-a-drag-and-drop-sortable-list-using-html-css-javascript/ */

const playlist = document.querySelector('.playlist');
let draggedItem = null;

// Apply drag & drop event on whole .box elements //
document.querySelectorAll('.box').forEach(item => {
  item.draggable = true; // => draggable

  // Handling the process when drag starts //
  item.addEventListener('dragstart', () => {
    draggedItem = item;
    setTimeout(() => item.style.display = "none", 0);
  });

  // Handling the process when drag ends //
  item.addEventListener('dragend', () => {
    setTimeout(() => {
      draggedItem.style.display = "flex";
      draggedItem = null;

      // Array new song orders & update // 
      const newOrder = Array.from(document.querySelectorAll('.box')).map(box => {
        const audioId = box.getAttribute('id').replace('box', 'song');
        return document.querySelector(`#${audioId}`);
      });

      allSongs.length = 0;
      allSongs.push(...newOrder);
    }, 0);
  });
});

// Handling the position of the dragged box when moving within the .playlist //
playlist.addEventListener('dragover', e => {
  e.preventDefault();
  const afterElement = getDragAfterElement(playlist, e.clientY);
  if (afterElement == null) {
    playlist.appendChild(draggedItem);
  } else {
    playlist.insertBefore(draggedItem, afterElement);
  }
});

// Function to calculate where the dragged .box should be placed //
function getDragAfterElement(container, y) {
  const draggableElements = [...container.querySelectorAll('.box:not([style*="display: none"])')];
  return draggableElements.reduce((closest, child) => {
    const box = child.getBoundingClientRect();
    const offset = y - box.top - box.height / 2;
    return (offset < 0 && offset > closest.offset) ? { offset, element: child } : closest;
  }, { offset: Number.NEGATIVE_INFINITY }).element;
}
// #endregion //