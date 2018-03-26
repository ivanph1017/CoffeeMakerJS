var data = require('./data/data.js'), // data package
    pin = require('./pin/pin.js'), // pin package
    prep = require('./prep/prep.js'); // prep(ration) package

// Set up
Promise.all([
    pin.coffeeMaker.write(prep.turnOn), // turn off coffee maker for default
    data.sendToFirebase('/turnOn', false), // send turnOn init state to Firebase
    data.sendToFirebase('/coffeeMakerReady', true), // send coffeeMakerReady init state to Firebase
    data.sendToFirebase('/coffeeReady', false), // send coffee init state as not ready to Firebase
    data.sendToFirebase('/timer', '00:00'), // send timer init state to Firebase
    data.sendToFirebase('/timerSleep', 5) // send timerSleep init state to Firebase
]).catch((error) => {
    console.log('Error on main set up');
});

// measure water level in loop
pin.water.getLevel().then((initWaterLevel) => {
    // sending water level for the first time to Firebase
    data.sendToFirebase('/waterLevel', initWaterLevel).catch((error) => {
        console.log('Error on init water Level');
        throw error;    
    });  
    pin.water.getCacheLevel = initWaterLevel; // saving water level in cache
    // check water level every 150 ms
    setInterval(() => {
        pin.water.getLevel().then((waterLevel) => {
            if (waterLevel !== pin.water.getCacheLevel) {
                // sending water level measurements changes to Firebase
                data.sendToFirebase('/waterLevel', waterLevel).catch((error) => {
                    console.log('Error on set water Level');
                    throw error;    
                });  
                pin.water.getCacheLevel = waterLevel; // update water level cache   
            }      
        }).catch((error) => {
            console.log('Error on water level loop');
            throw error;
        })
    }, 150);
}).catch((error) => {
    console.log('Error on water level wrapper');
});

data.listenStatus(); // Listen status

// Listen turnOn and waterLevel values
data.listenRef('/turnOn', (snapshot) => {
    let turnOn = snapshot.val();
    pin.water.getLevel().then((waterLevel) => {
        if (turnOn === true && waterLevel > 0 && prep.turnOn === prep.off) {
            prep.setUp(); // set up preparation logic 
        } else if (turnOn === false && prep.turnOn === prep.on){
            prep.stopTimer(); // stop preparation timer
        }
    }).catch((error) => {
        console.log('Error on listen turnOn');
    });    
});