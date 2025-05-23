/* #region Design Decision //
This reaction time test is designed as a simple “mind gym” experience with a racing game vibe, focusing on quick reflexes and precise timing. When I looked into similar websites like Human Benchmark, I noticed none of them use sound elements. I believe this is because audio signals can distract users and negatively affect their reaction times. For this reason, I decided to keep the experience purely visual, with the screen changing instantly from red to green. The red screen acts like a race’s starting light, telling users to get ready, while green signals “go.” This color coding is intuitive and easily understood by almost anyone, making the test accessible and easy to jump into without complicated instructions.

Before the test starts, the screen briefly shows a simple message along with the green background, instructing users to click as soon as they see it. This minimal guidance helps users quickly understand what to do without overwhelming them, keeping the experience clear and user-friendly.

The main interaction is clicking, which feels natural, tactile, and straightforward—ideal for measuring reaction speed accurately without confusion. To add some extra style and match the racing theme, I changed the mouse cursor to a checkered flag pattern, giving the interface a fresh and energetic vibe. The logo animation flying in quickly from the sides adds a subtle but effective sense of speed and movement, helping users feel immersed in a fast-paced race.

After each attempt, users don’t just see their reaction time in milliseconds; they also get to compare their score with a global average and see their percentile ranking — that is, the percentage of users they performed better than. This feature is designed to engage users’ competitive spirit and encourage them to improve. The percentile values are based on real reaction time experiment data, ensuring the feedback is both meaningful and accurate.

Initially, I considered adding smooth animations to the background color changes to make the experience more dynamic. However, I realized that such animations might slow down the visual cue and confuse users, reducing the accuracy of the reaction time measurement. Therefore, I kept the color change sharp and immediate to ensure clear and instant feedback.

Overall, the design is minimal and clean, reducing distractions and cognitive load. This makes the test accessible to everyone, including people sensitive to sound or overly busy visuals. The goal was to create a simple but engaging tool that anyone can use casually, without pressure or complex setup. I also included a footer that says “© 2025 Reaction Time Test,” which is a small detail but adds a professional touch and shows that I took this project seriously.

I hope this can be a fun little challenge that anyone can jump into anytime and enjoy. It’s simple, effective, and keeps users coming back for more :) */

/* #region DOM & Settings */
const intro = document.getElementById('intro');
const wait = document.getElementById('wait');
const click = document.getElementById('click');
const result = document.getElementById('result');
const fast = document.getElementById('fast');

let timeout;
let startTime;
let isReady = false;

const averageTime = 250;
let userTime = 0;

function showBox(box) {
    [intro, wait, click, result, fast].forEach(b => {
        b.style.display = 'none';
    });
    box.style.display = 'flex';
}
/* #endregion */

/* #region Percentile Calculator */
function getPercentile(time) {
    const distribution = [
        { ms: 120, percentile: 1 },
        { ms: 150, percentile: 5 },
        { ms: 175, percentile: 10 },
        { ms: 200, percentile: 25 },
        { ms: 250, percentile: 40 },
        { ms: 275, percentile: 60 },
        { ms: 300, percentile: 75 },
        { ms: 350, percentile: 85 },
        { ms: 370, percentile: 95 },
        { ms: 400, percentile: 99 }
    ];

    // Calculate the reaction time into % //
    if (time <= distribution[0].ms) return distribution[0].percentile;
    if (time >= distribution[distribution.length - 1].ms) return distribution[distribution.length - 1].percentile;

    for (let i = 0; i < distribution.length - 1; i++) {
        const cur = distribution[i];
        const next = distribution[i + 1];
        if (time >= cur.ms && time < next.ms) {
            const ratio = (time - cur.ms) / (next.ms - cur.ms);
            return Math.round(cur.percentile + ratio * (next.percentile - cur.percentile));
        }
    }

    return 50;
}
/* #endregion */

/* #region Intro -> Wait */
showBox(intro);

intro.addEventListener('click', showWaitBox);
/* #endregion */

/* #region Wait -> Too fast */
wait.addEventListener('click', () => {
    if (!isReady) {
        clearTimeout(timeout);
        showBox(fast);
    }
});
/* #endregion */

/* #region Wait -> Click */
function showWaitBox() {
    showBox(wait);
    isReady = false;
    clearTimeout(timeout);
    const delay = Math.floor(Math.random() * 4000) + 2000; // Random delay between 2~6 seconds //
    timeout = setTimeout(() => {
        showBox(click);
        startTime = Date.now();
        isReady = true;
    }, delay);
}
/* #endregion */

/* #region Click -> Result */
click.addEventListener('click', () => {
    if (!isReady) return;

    const reactionTime = Date.now() - startTime;
    userTime = reactionTime;

    const percentile = getPercentile(reactionTime);

    // Print _ms, _% //
    const resultText = result.querySelectorAll('p');
    resultText[0].textContent = `Your reaction time is ${reactionTime}ms,`;
    resultText[1].textContent = `you are in the top ${percentile}% of users.`;

    showBox(result);
    isReady = false;
});
/* #endregion */

/* #region Loop */
fast.addEventListener('click', showWaitBox);
result.addEventListener('click', showWaitBox);
/* #endregion */