/* #region Texts */
document.getElementById("okayButton").addEventListener("click", () => {
  document.querySelector(".notice").style.display = "none";

  const typingSound = new Audio("typing.wav"); //--mp3 by FreeSound--//
  typingSound.play();

  // Start loading process after OKAY button is clicked //
  startLoading();
});

//---- Loading bar ----//
function startLoading() {
  const loadingText = document.getElementById("loadingText");
  loadingText.style.animation= "typing 1.3s steps(18) 0.3s forwards, cursor 0.3s step-end infinite alternate";

  setTimeout(() => {
    loadingText.textContent = "Loading....";
    loadingText.style.animation =
      "typing2 0.6s steps(10) forwards, cursor 0.3s step-end infinite alternate";

    // After animation, hide loading bar //
    setTimeout(() => {
      const loadingDiv = document.querySelector(".loading");
      loadingDiv.style.display = "none";

      // Show alert & play bell sound //
      const bellSound = new Audio("bell.wav"); //--mp3 by FreeSound--//
      bellSound.play();
      const alertDiv = document.querySelector(".alert");
      alertDiv.style.display = "block";

      // 'Confirm' button event //
      const alertButton = document.querySelector(".alert button");
      alertButton.addEventListener("click", () => {
        alertDiv.style.display = "none";

        // Play tape sound & remove background image //
        const insertTapeSound = new Audio("inserttape.wav"); //--mp3 by FreeSound--//
        insertTapeSound.play();
        document.body.style.backgroundImage = "none";

        // Show welcome message & transition //
        setTimeout(() => {
          const welcomeDiv = document.querySelector(".welcome");
          welcomeDiv.style.display = "block";

          setTimeout(() => {
            window.location.href = "../main/main.html";
          }, 3000); // Delay before moving to main page
        }, 3000); // Delay before showing welcome
      });
    }, 3500); // Wait before hiding loading bar
  }, 2000); // 0.7초 후에 애니메이션 시작
}
