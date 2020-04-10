const buttons = document.querySelectorAll(".button");
const timer = document.querySelector(".timer");
const message = document.querySelector(".message");

let sessionStarted = false;
let breakStarted = false;
let intervalStarted = false;
let sessionCount = 0;
let paused = false;

const DEFAULT_SESSION = 5;
const DEFAULT_SHORT = 3;
const DEFAULT_LONG = 10;

let sessionTime = DEFAULT_SESSION;
let shortTime = DEFAULT_SHORT;
let longTime = DEFAULT_LONG;

let timePassed = 0;
let interval;
let currentTime;

timer.textContent = updateTimer(sessionTime);

buttons.forEach((button) => {
    button.addEventListener('click', function (e) {
        clickedButton = e.target;
        getButton(clickedButton);
    });
})

function updateTimer(time) {
    let minutes = Math.floor(time / 60);
    let seconds = time % 60;

    if (minutes < 10) {
        minutes = `0${minutes}`;
    }

    if (seconds < 10) {
        seconds = `0${seconds}`;
    }

    return `${minutes}:${seconds}`;
}

function getButton(btn) {
    if (btn.classList.contains("start")) {
        if (!intervalStarted) {
        countDown();
        }
    } else if (btn.classList.contains("pause")) {
        pauseTimer();
    } else if (btn.classList.contains("stop")) {
        stopTimer();
    }
}

function countDown() {

    setCurrentTime();

    interval = setInterval(function() {
        timePassed += 1;
        timeLeft = currentTime - timePassed;
        timer.textContent = updateTimer(timeLeft);

        if (timeLeft === 0) {
            clearInterval(interval);
        }
    }, 1000);
}

function setCurrentTime() {

    currentTime = sessionTime;
    intervalStarted = true;
    // if (!paused) {
    //     if (!sessionStarted) {
    //         currentTime = sessionTime;
    //         sessionStarted = true;
    //     } else if (sessionStarted && sessionCount < 4) {
    //         currentTime = shortTime;
    //         sessionStarted = false;
    //     } else if (sessionStarted && sessionCount === 4) {
    //         currentTime = longTime;
    //         sessionStarted = false;
    //     }
    // } else {
    //     paused = false;
    // }
}


function pauseTimer() {
    clearInterval(interval);
    intervalStarted = false;
}

function stopTimer() {
    clearInterval(interval);
    timer.textContent = updateTimer(currentTime);
    timePassed = 0;
    intervalStarted = false;
}