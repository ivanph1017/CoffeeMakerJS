var data = require('../data/data.js'), // data package
    startSleep = 0,
    sleepTimer = null;

function setUp() {
    startSleep = new Date().getTime(); // time since coffee maker has been turned off
    Promise.all([
        setInterval(runSleepTimer, 1000 * 60), // run sleep timer every minute,
        setTimeout(stopSleepTimer, 1000 * 60 * 5) // stop sleep timer at 5 minutes
    ]).then((result) => {
        sleepTimer = result[0];
    }).catch((error) => {
        console.log('Error on sleep set up ' + error);
        throw error;
    });
}

function runSleepTimer() {
    let currentTime = new Date().getTime(), // current time
        runningTime = currentTime - startSleep,
        runningMinute = ((runningTime / 1000 >> 0) / 60 >> 0),
        time = runningMinute < 4 ? (5 - runningMinute) : 1;
    // send timerSleep current minute to Firebase
    data.sendToFirebase('/timerSleep', time).catch((error) => {
        console.log('Error on run sleep timer');
        throw error;
    });   
}

function stopSleepTimer() {
    clearInterval(sleepTimer) // it stops the sleepTimer())
    Promise.all([
        data.sendToFirebase('/coffeeMakerReady', true), // send coffeeMaker is ready to Firebase
        data.sendToFirebase('/timerSleep', 5) // send timerSleep init state to Firebase
    ]).catch((error) => {
        console.log('Error on stop sleep timer');
        throw error;
    });  
}

var output = {
    setUp: setUp
};

module.exports = output;