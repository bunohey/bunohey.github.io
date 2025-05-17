document.getElementById("okayButton").addEventListener("click", () => {
  document.querySelector(".notice").style.display = "none";

  // audio by FreeSound //
  const typingSound = new Audio("typing.wav");
  typingSound.play();

  startLoading();
});

function startLoading() {
  const loadingText = document.getElementById("loadingText");
  loadingText.style.animation= "typing 1.3s steps(18) 0.3s forwards, cursor 0.3s step-end infinite alternate";

  setTimeout(() => {
    loadingText.textContent = "Loading....";
    loadingText.style.animation =
      "typing2 0.6s steps(10) forwards, cursor 0.3s step-end infinite alternate";

    setTimeout(() => {
      const loadingDiv = document.querySelector(".loading");
      loadingDiv.style.display = "none";

      // audio by FreeSound //
      const bellSound = new Audio("bell.wav");
      bellSound.play();

      const alertDiv = document.querySelector(".alert");
      alertDiv.style.display = "block";

      const alertButton = document.querySelector(".alert button");
      alertButton.addEventListener("click", () => {
        alertDiv.style.display = "none";

        // audio by FreeSound //
        const insertTapeSound = new Audio("inserttape.wav");
        const casioGlitchSound = new Audio("casio_glitch.wav");
        // video by Pexels //
        const VHS = document.getElementById("vhsVideo");

        insertTapeSound.play();
        insertTapeSound.addEventListener("ended", () => {
          casioGlitchSound.play();
          VHS.style.display = "block";
          VHS.play();
        });

        document.body.style.backgroundImage = "none";

        setTimeout(() => {
          const welcomeDiv = document.querySelector(".welcome");
          welcomeDiv.style.display = "block";

          setTimeout(() => {
            window.location.href = "../main/main.html";
          }, 5000); // delay before navigating to main page
        }, 9000); // delay before showing welcome message
      });
    }, 3500); // wait before hiding loading bar
  }, 2000); // delay before starting loading animation
}
