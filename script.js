// INTERFACE
const buttons = document.querySelectorAll(".button");
const timer = document.querySelector(".timer");
const message = document.querySelector(".message");

// TRACKERS
let intervalStarted = false;
let sessionCount = 0;
let sessionStarted = false;
let pausePressed = false;
let timePassed = 0;
let timeLeft;
let interval = null;

// SETTINGS
const DEFAULT_SESSION = 3;
const DEFAULT_SHORT = 3;
const DEFAULT_LONG = 10;

let sessionTime = DEFAULT_SESSION;
let shortTime = DEFAULT_SHORT;
let longTime = DEFAULT_LONG;

let currentTime = DEFAULT_SESSION;

// ON LOAD
timer.textContent = updateTimer(sessionTime);

buttons.forEach((button) => {
    button.addEventListener('click', function (e) {
        clickedButton = e.target;
        getButton(clickedButton);
    });
})

function getButton(btn) {
    if (btn.classList.contains("start")) {
        if (!intervalStarted) {
        countDown();
        displayMessage();
        }
    } else if (btn.classList.contains("pause")) {
        if (timeLeft !== 0) {
            pauseTimer();
        }
    } else if (btn.classList.contains("stop")) {
        stopTimer();
    }
}

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

function countDown() {

    if (!pausePressed) {
    setCurrentTime();
    }

    pausePressed = false;

    interval = setInterval(function() {
        timePassed += 1;
        timeLeft = currentTime - timePassed;
        timer.textContent = updateTimer(timeLeft);

        if (timeLeft === 0) {
            clearInterval(interval);
            intervalStarted = false;
            //toggle session and break
            sessionStarted = !sessionStarted;
        }
    }, 1000);
}

function setCurrentTime() {

    if (!sessionStarted) {
        currentTime = sessionTime;
        timer.textContent = updateTimer(currentTime);
        timer.classList.remove("break");
        timePassed = 0;
    } else if (sessionStarted) {
        currentTime = shortTime;
        timer.textContent = updateTimer(currentTime);
        timer.classList.add("break");
        timePassed = 0;
    }

    intervalStarted = true;
}

function displayMessage() {
    if (!sessionStarted) {
        message.textContent = "Focus!";
    } else if (sessionStarted) {
        message.textContent = "Time for a break";
    }
}


function pauseTimer() {
    clearInterval(interval);
    intervalStarted = false;
    pausePressed = true;
    message.textContent = "Paused";
}

function stopTimer() {
    clearInterval(interval);
    message.textContent = "Ready?";
    timer.textContent = updateTimer(currentTime);
    timePassed = 0;
    intervalStarted = false;

    if (timeLeft === 0) {
        sessionStarted = !sessionStarted;
    }
}