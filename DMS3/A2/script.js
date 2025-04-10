//----Loading bar----//

window.addEventListener("DOMContentLoaded", () => {
  setTimeout(() => {
    const loadingText = document.getElementById("loadingText");
    loadingText.textContent = "Loading.....";
    loadingText.style.width = "0";
    loadingText.style.animation = "typing2 2s steps(12) forwards, cursor 0.4s step-end infinite alternate";
  }, 3500);
});

