document.addEventListener("DOMContentLoaded", () => {
  const openLink = document.getElementById('open');
  const toggles = document.querySelectorAll(".categoryToggle");
  const paragraphs = document.querySelectorAll(".paragraph");
  const defaultParaId = "introPara";
  const wriggleEl = document.querySelector('small');
  const text = wriggleEl.textContent;
  wriggleEl.innerHTML = '';

/* #region Audio toggle */
[...text].forEach((char) => {
  const span = document.createElement('span');
  span.textContent = char;
  span.style.display = 'inline-block';
  span.style.animationName = 'wriggle';
  span.style.animationDuration = `${1.2 + Math.random()}s`;
  span.style.animationDelay = `${Math.random() * 2}s`;
  span.style.animationTimingFunction = 'steps(3, end)';
  span.style.animationIterationCount = 'infinite';
  span.style.setProperty('--moveX', `${Math.random() * 5 - 2.5}px`);
  span.style.setProperty('--moveY', `${Math.random() * 5 - 2.5}px`);
  span.style.setProperty('--rotate', `${Math.random() * 6 - 3}deg`);
  wriggleEl.appendChild(span);
  });
/* #endregion */

/* #region Audio toggle */
function setupToggleAudio(buttonId, audioId) {
    const button = document.getElementById(buttonId);
    const audio = document.getElementById(audioId);
    const originalText = button.getAttribute('data-original-text');

    if (!button || !audio) {
      console.error(`Missing element: button=${button}, audio=${audio}`);
      return;
    }

    button.addEventListener('click', () => {
      if (audio.paused) {
        audio.play().then(() => {
          button.textContent = '⏸ Pause';
        }).catch(err => console.error("Play failed:", err));
      } else {
        audio.pause();
        button.textContent = originalText;
      }
    });

    audio.addEventListener('ended', () => {
      button.textContent = originalText;
    });
  }

  setupToggleAudio('bgBtn', 'bgMusic');
  setupToggleAudio('bellBtn', 'bellSound');
  setupToggleAudio('glitchBtn', 'glitchSound');
/* #endregion */

/* #region Category toggle */
  // Initially = only introPara is expanded //
  paragraphs.forEach(p => p.classList.remove("expanded"));
  toggles.forEach(t => t.classList.remove("active"));
  const defaultPara = document.getElementById(defaultParaId);
  if (defaultPara) {
    defaultPara.classList.add("expanded");
    openLink.style.display = 'inline'; // Show link initially
  }

  toggles.forEach(toggle => {
    toggle.addEventListener("click", () => {
      const paraId = toggle.id.replace("Toggle", "Para");
      const targetPara = document.getElementById(paraId);
      if (!targetPara) return;

      // If the target para is already open -> return to the default para //
      if (targetPara.classList.contains("expanded")) {
        paragraphs.forEach(p => p.classList.remove("expanded"));
        toggles.forEach(t => t.classList.remove("active"));

        if (defaultPara) {
          defaultPara.classList.add("expanded");
          openLink.style.display = 'inline'; // Show link when returning to intro //
        }

        // Reset the active toggle //
        const defaultToggleId = defaultParaId.replace("Para", "Toggle");
        const defaultToggle = document.getElementById(defaultToggleId);
        if (defaultToggle) defaultToggle.classList.add("active");

        defaultPara.scrollIntoView({ behavior: "smooth", block: "start" });
        window.scrollTo({ top: 0, behavior: "smooth" }); // Scroll to top //
        return;
      }

      // Open a new para & clear others //
      paragraphs.forEach(p => p.classList.remove("expanded"));
      toggles.forEach(t => t.classList.remove("active"));

      targetPara.classList.add("expanded");
      toggle.classList.add("active");
      targetPara.scrollIntoView({ behavior: "smooth", block: "start" });
      window.scrollTo({ top: 0, behavior: "smooth" }); // Scroll to top

      // Show/hide link based on target paragraph //
      if (targetPara.id === 'introPara') {
        openLink.style.display = 'inline';
      } else {
        openLink.style.display = 'none';
      }
    });
  });
});
/* #endregion */