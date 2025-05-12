// 변수 선언
var startBtn = document.getElementById('startBtn');
var reactionBtn = document.getElementById('reactionBtn');
var reactionTimeDisplay = document.getElementById('reactionTime');
var startTime, endTime;

// 테스트 시작 함수
startBtn.addEventListener('click', function() {
    startBtn.disabled = true;  // 시작 버튼 비활성화
    reactionBtn.disabled = false;  // 반응 버튼 활성화
    reactionBtn.textContent = "Wait for it...";  // 버튼 텍스트 변경

    // 1~6초 사이의 랜덤 시간 후에 반응 버튼이 나타나도록 설정
    var delay = Math.floor(Math.random() * 5000) + 1000; // 1~6초
    setTimeout(function() {
        reactionBtn.textContent = "Click Now!";  // 반응 버튼 텍스트 변경
        startTime = Date.now();  // 버튼이 나타난 시점 기록
    }, delay);
});

// 반응 시간을 기록하는 함수
reactionBtn.addEventListener('click', function() {
    endTime = Date.now();
    var reactionTime = endTime - startTime;  // 반응 시간 계산

    // 결과 표시
    reactionTimeDisplay.textContent = "Your reaction time is: " + reactionTime + " ms";

    // 초기화
    reactionBtn.disabled = true;
    startBtn.disabled = false;
    reactionBtn.textContent = "Click Me!";  // 반응 버튼 초기화
});
