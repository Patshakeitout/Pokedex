
const rudolph = document.querySelector('.rudolph');
const PAUSE = 60000;
const START = 60000;

function startRudolphRun() {
    rudolph.style.animation = 'run-only 5s linear 0s 1 normal';

    rudolph.addEventListener('animationend', handleRudolphCycle, { once: true });
}

function handleRudolphCycle() {
    rudolph.style.animation = 'none';

    setTimeout(() => {
        startRudolphRun();
    }, PAUSE);
}

setTimeout(() => {
    startRudolphRun();
}, START);; 