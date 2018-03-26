const ON = 0, // on
      OFF = 1; // off

var data = require('../data/data.js'), // data module
    pin = require('../pin/pin.js'), // pin module
    sleep = require('../sleep/sleep.js'), // sleep module
    turnOn = OFF,
    startTurnOn = 0,
    prepTimer = null;

function setUp() {
    module.exports.turnOn = ON;
    turnOn = ON;
    // turn on coffee maker
    pin.coffeeMaker.write(turnOn).then((value) => {
        Promise.all([
            data.sendToFirebase('/coffeeMakerReady', false), // send coffee maker is not ready to Firebase
            data.sendToFirebase('/coffeeReady', false), // send coffee init state as not ready to Firebase
            new Date().getTime(), // time since coffee maker has been turned on
            setInterval(runPrepTimer, 1000)
        ]).then((result) => {
            startTurnOn = result[2];
            prepTimer = result[3]; 
        });  
    }).catch((error) => {
        console.log('Error on prep set up');
        throw error;
    });
}

function runPrepTimer() {
    let currentTime = new Date().getTime(), // current time
        runningTime = currentTime - startTurnOn,
        runningHour = (((runningTime / 1000 >> 0) / 60 >> 0) / 60 >> 0),
        runningMinute = ((runningTime / 1000 >> 0) / 60 >> 0) % 60,
        runningSecond = (runningTime / 1000 >> 0) % 60,
        minuteStr = runningMinute < 10 ? "0" + runningMinute : runningMinute.toString(),
        secondStr = runningSecond < 10 ? "0" + runningSecond : runningSecond.toString(),
        timeStr = minuteStr + ":" + secondStr;
    Promise.all([
        data.sendToFirebase('/timer', timeStr), // send current timer value  to Firebase 
        pin.water.getLevel()
    ]).then((result) => {
        let waterLevel = result[1];
        // if all water has been leaked out, then coffee is ready
        if (waterLevel === 0) data.sendToFirebase('/coffeeReady', true);
        checkPrepTimer(); // checks prepTimer()
    }).catch((error) => {
        console.log('Error on run prep timer');
        throw error;
    }); 
}

function checkPrepTimer() {
    let currentTime = new Date().getTime(); // current time
    // if it has passed 1 hour, it sends turns off order to Firebase
    if (currentTime - startTurnOn > 1000  * 60 * 60) {
        data.sendToFirebase('/turnOn', false).catch((error) => {
            console.log('Error on check prep timer');
            throw error;    
        });
    }
}

function stopPrepTimer() {
    module.exports.turnOn = OFF;
    turnOn = OFF;
    // turn off coffee maker
    pin.coffeeMaker.write(turnOn).then((value) => {
        clearInterval(prepTimer), // it stops the prepTimer()
        Promise.all([
            data.sendToFirebase('/coffeeReady', false), // send coffee init state as not ready to Firebase
            data.sendToFirebase('/timer', '00:00') // send timer init state to Firebase
        ]).then((result) => {
            sleep.setUp(); 
        });       
    }).catch((error) => {
        console.log('Error on stop prep timer');
        throw error;
    });      
}

var output = {
    turnOn: turnOn,
    setUp: setUp,
    stopTimer: stopPrepTimer,
    on: ON,
    off: OFF
};

module.exports = output;