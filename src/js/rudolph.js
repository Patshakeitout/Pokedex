
const rudolph = document.querySelector('.rudolph');
const PAUSE = 60000;
const START = 30000;

function startRudolphRun() {
    rudolph.style.animation = 'run-only 5s linear 0s 1 normal';

    rudolph.addEventListener('animationend', handleRudolphCycle, { once: true });

    console.log('Rudolph-Lauf beginnt (5s).');
}

function handleRudolphCycle() {
    rudolph.style.animation = 'none';

    console.log('Rudolph-Lauf beendet. Starte 60 Sekunden Wartezeit.');

    setTimeout(() => {
        console.log('60 Sekunden Pause vorbei. Starte nächsten Lauf.');
        
        startRudolphRun();
    }, PAUSE);
}

console.log('Rudolph-Animation: Initialer Start-Delay von 60 Sekunden aktiv.');
    setTimeout(() => {
        startRudolphRun(); 
    }, START);; 