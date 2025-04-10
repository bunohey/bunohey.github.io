//----Loading bar----//

window.addEventListener("DOMContentLoaded", () => {
  setTimeout(() => {
    const loadingText = document.getElementById("loadingText");
    loadingText.textContent = "Loading....";
    loadingText.style.width = "0";
    loadingText.style.animation = "typing2 0.6s steps(10) forwards, cursor 0.6s step-end infinite alternate";

    //----Hide loading bar----//
    setTimeout(() => {
      const loadingDiv = document.querySelector(".loading");
      loadingDiv.style.display = "none";

    //----Show Welcome message----//
    setTimeout(() => {
      const welcomeDiv = document.querySelector(".welcome");
      welcomeDiv.style.display = "block";
      }, 1000);

    //----Transition ( ~> main.html) ----//
    setTimeout(() => {
      window.location.href = "../main/main.html";
      }, 4500); // automatic movement

    }, 3000); // hide loading bar
  }, 2000); // text update after 2 seconds
});