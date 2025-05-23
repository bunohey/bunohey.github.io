// Tone.js setup //
const bitCrusher = new Tone.BitCrusher(12);
const distortion = new Tone.Distortion(0);
const pitchShift = new Tone.PitchShift({ pitch: 0 });
const feedbackDelay = new Tone.FeedbackDelay('8n', 0);
const volume = new Tone.Volume(10).toDestination();

const player = new Tone.Player({
  url: bgMusic.src,
  loop: true,
  autoplay: false,
});

player.chain(bitCrusher, distortion, pitchShift, feedbackDelay, volume);

  let isAudioGraphConnected = false;

// Audio glitch //
function updateAudioGlitch() {
  if (bgMusic && Tone.context.state === 'running') {
    const total = sliders.reduce((sum, s) => sum + Number(s.value), 0);

    // Reset effects //
    player.playbackRate = 1;
    bitCrusher.bits = 12;
    distortion.distortion = 0;
    pitchShift.pitch = 0;
    feedbackDelay.delayTime.value = '8n';
    feedbackDelay.feedback.value = 0;

    if (total < 16) { // 0~16
      player.playbackRate = 1.0;
      bitCrusher.bits = 16;
      distortion.distortion = 0;
      pitchShift.pitch = 0;
      feedbackDelay.feedback.value = 0;
      feedbackDelay.delayTime.value = '4n';

    } else if (total < 46) { // 17~45
      player.playbackRate = 0.95;
      bitCrusher.bits = 15;
      distortion.distortion = 0.01;
      pitchShift.pitch = -0.2 + Math.random() * 0.1;
      feedbackDelay.feedback.value = 0.01;
      feedbackDelay.delayTime.value = '4n';

    } else if (total < 76) { // 46~75
      player.playbackRate = 0.85;
      bitCrusher.bits = 14;
      distortion.distortion = 0.02;
      pitchShift.pitch = -0.3 + Math.random() * 0.1;
      feedbackDelay.feedback.value = 0.02;
      feedbackDelay.delayTime.value = '4n';

    } else { // 76~100
      player.playbackRate = 0.80;
      bitCrusher.bits = 13;
      distortion.distortion = 0.3;
      pitchShift.pitch = -0.4 + Math.random() * 0.1;
      feedbackDelay.feedback.value = 0.03;
      feedbackDelay.delayTime.value = '4n';
    }
  }
}
/* #endregion */