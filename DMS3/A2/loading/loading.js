//---- Loading bar ----//
window.addEventListener("DOMContentLoaded", () => {
  setTimeout(() => {
    const loadingText = document.getElementById("loadingText");
    loadingText.textContent = "Loading....";
    loadingText.style.width = "0";
    loadingText.style.animation =
      "typing2 0.6s steps(10) forwards, cursor 0.6s step-end infinite alternate";

    //---- Hide loading bar ----//
    setTimeout(() => {
      const loadingDiv = document.querySelector(".loading");
      loadingDiv.style.display = "none";

      //---- Show alert & Bell sound ----//
        const alertDiv = document.querySelector(".alert");
        alertDiv.style.display = "block";
        const bellSound = new Audio("bell.wav"); //--mp3 by FreeSound--//
        bellSound.play();

        //----'Confirm' button event ----//
        const alertButton = document.querySelector(".alert button");
        alertButton.addEventListener("click", () => {
          alertDiv.style.display = "none";

          //----Tape sound & remove background image----//
          const insertTapeSound = new Audio("inserttape.wav"); //--mp3 by FreeSound--//
          insertTapeSound.play();
          document.body.style.backgroundImage = "none";

          //---- Show welcome & Play sound ----//
          setTimeout(() => {
            const welcomeDiv = document.querySelector(".welcome");
            welcomeDiv.style.display = "block";

            //---- Transition ( ~> main.html) ----//
            setTimeout(() => {
              window.location.href = "../main/main.html";
            }, 3000); // transition
          }, 3000); //showing welcome message
        }); //immediately show alert
    }, 3000); // hide alert 
  }, 2000); // loading typing
});
