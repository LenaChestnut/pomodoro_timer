// INTERFACE
const buttons = document.querySelectorAll(".button");
const timer = document.querySelector(".timer");
const message = document.querySelector(".message");
const sessionCounter = document.querySelectorAll(".session-count");
const sessionSetting = document.querySelector(".session-time");
const shortSetting = document.querySelector(".short-break-time");
const longSetting = document.querySelector(".long-break-time");
let popup = null;
const notification = document.querySelector("#notification");
notification.volume = 0.2;

// TRACKERS
let intervalStarted = false;
let sessionCount = 0;
let sessionCompleted = false;
let pausePressed = false;
let timePassed = 0;
let timeLeft = null;
let interval = null;

// SETTINGS
const DEFAULT_SESSION = 1500;
const DEFAULT_SHORT = 300;
const DEFAULT_LONG = 1800;

let sessionTime = DEFAULT_SESSION;
let shortTime = DEFAULT_SHORT;
let longTime = DEFAULT_LONG;

let currentTime = DEFAULT_SESSION;
let settingCommand;

// ON LOAD
timer.textContent = formatTime(sessionTime);

function setInitial() {
    sessionSetting.textContent = formatTime(sessionTime);
    shortSetting.textContent = formatTime(shortTime);
    longSetting.textContent = formatTime(longTime);
}

setInitial();
// TIMER LOGIC

buttons.forEach((button) => {
    button.addEventListener('click', function (e) {
        let clickedButton = e.target;
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
    } else if (btn.classList.contains("fas")) {

        if (btn.classList.contains("fa-chevron-circle-down")) {
            settingCommand = "down";
        } else if (btn.classList.contains("fa-chevron-circle-up")) {
            settingCommand = "up";
        }

        let parent = btn.parentNode;

        if (parent.classList.contains("session")) {
            sessionTime = updateSettings(sessionTime, sessionSetting, btn);
        } else if (parent.classList.contains("short")) {
            shortTime = updateSettings(shortTime, shortSetting, btn);
        } else if (parent.classList.contains("long")) {
            longTime = updateSettings(longTime, longSetting, btn);
        }

    } else if (btn.classList.contains("reset")) {
        reset();
    }
}

function formatTime(time) {
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
        timer.textContent = formatTime(timeLeft);

        if (timeLeft === 0) {

            clearInterval(interval);
            intervalStarted = false;

            //toggle session and break
            sessionCompleted = !sessionCompleted;

            if (sessionCompleted && sessionCount !== 4) {
                sessionCount+=1;
                updateCountDisplay();
            } else if (!sessionCompleted && sessionCount === 4) {
                sessionCount = 0;
                updateCountDisplay();
            }

            notification.play();
        }
    }, 1000);
}

function setCurrentTime() {
    if (!sessionCompleted) {
        currentTime = sessionTime;
        timer.textContent = formatTime(currentTime);
        timer.classList.remove("break");
        timePassed = 0;
    } else if (sessionCompleted && sessionCount !== 4) {
        currentTime = shortTime;
        timer.textContent = formatTime(currentTime);
        timer.classList.add("break");
        timePassed = 0;
    } else if (sessionCompleted && sessionCount === 4) {
        currentTime = longTime;
        timer.textContent = formatTime(currentTime);
        timer.classList.add("break");
        timePassed = 0;
    }
    intervalStarted = true;
}

function displayMessage() {
    if (!sessionCompleted) {
        message.textContent = "Focus!";
    } else if (sessionCompleted) {
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
    timer.textContent = formatTime(currentTime);
    timePassed = 0;
    intervalStarted = false;

    if (timeLeft === 0) {
        sessionCompleted = !sessionCompleted;
    }
}

function updateCountDisplay() {
    let arrCounter = Array.from(sessionCounter);

    arrCounter.forEach((counter) => {
        counter.classList.remove("complete");
    })

    for (let i = 0; i < sessionCount; i++) {
        arrCounter[i].classList.add("complete");
    }
}

// SETTINGS
function updateSettings(time, setting, button) {
    updateCountDisplay();
    //select set of setting buttons to keep track of inactive buttons
    let controls;

    if (setting === sessionSetting) {
        controls = document.querySelectorAll(".session .button");
    } else if (setting === shortSetting) {
        controls = document.querySelectorAll(".short .button");
    } else if (setting === longSetting) {
        controls = document.querySelectorAll(".long .button");
    }

    controls.forEach((c) => {
        c.classList.remove("inactive");
    });

    if (time >= 120 || time <= 5340) {
        if (settingCommand === "down") {
            if (time > 60) {
                time-=60;
            }
        } else if (settingCommand === "up") {
            if (time < 5400) {
                time+=60;
            }
        }
        if (time === 60 || time === 5400) {
            button.classList.add("inactive");
        }
    }
    
    setting.textContent = formatTime(time);
    // stopTimer if setting changes the current interval
    if ((setting === sessionSetting && !timer.classList.contains("break")) || 
    (setting === shortSetting && timer.classList.contains("break") && sessionCount !== 4) ||
    (setting === longSetting && timer.classList.contains("break") && sessionCount === 4)) {
        currentTime = time;
        stopTimer();
    }
    
    return time;
}

function reset() {
    let agreed = confirm("All progress will be lost. Are you sure?");
    if (agreed) {
        buttons.forEach((button) => {
            button.classList.remove("inactive");
        });
        sessionTime = DEFAULT_SESSION;
        shortTime = DEFAULT_SHORT;
        longTime = DEFAULT_LONG;
        setInitial();
        currentTime = sessionTime;
        timer.classList.remove("break");
        stopTimer();
        sessionCount = 0;
        sessionCompleted = false;
        updateCountDisplay();
    }
}
