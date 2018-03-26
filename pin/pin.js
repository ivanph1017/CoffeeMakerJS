var Gpio = require('onoff').Gpio, // include onoff to interact with the GPIO
    coffeeMakerPin = new Gpio(4, 'out'), // use GPIO pin 2 as coffee maker, and specify that it is output
    sensorLvl0Pin = new Gpio(17, 'in'), // use GPIO pin 17 as sensor level 0, and specify that it is input
    sensorLvl2Pin = new Gpio(27, 'in'), // use GPIO pin 27 as sensor level 2, and specify that it is input
    cacheWaterLevel = 0; 

function writeOnCoffeeMaker(value) {
    return new Promise((resolve, reject) => {
        coffeeMakerPin.write(value, (err) => {
            if (err) {
                reject(err);
            } else {
                resolve(value);
            }      
        });
    }).catch((error) => {
        console.log('Error on write coffee maker pin ' + error);
        throw error;
    });    
}

function readSensor(sensor) {
    return new Promise((resolve, reject) => {
        sensor.read((err, value) => {
            if (err) {
                reject(err);    
            } else {
                resolve(value);
            }
        })    
    }).catch((error) => {
        console.log('Error on read sensor pin ' + error);
        throw error;
    }); 
}

function measureWaterLevel() {
    return Promise.all([
        readSensor(sensorLvl0Pin),
        readSensor(sensorLvl2Pin)
    ]).then((results) => {
        return {
            sensorLvl0: results[0],
            sensorLvl2: results[1]
        };
    }).then((result) => {
        let waterLevel = 0; // set water level value at 0 for default
        if (result.sensorLvl2 === 1 && result.sensorLvl0 === 0) {
            waterLevel = 2; // if sensorLvl2 has HIGH voltage and sensorLvl0 has LOW voltage, then waterLevel set at 2 
        } else if (result.sensorLvl2 === 0 && result.sensorLvl0 === 0) {
            waterLevel = 1; // if sensorLvl2 has LOW voltage and sensorLvl0 has LOW voltage, then waterLevel set at 1
        } else if (result.sensorLvl2 === 0 && result.sensorLvl0 === 1){
            waterLevel = 0; // if sensorLvl2 has LOW voltage and sensorLvl0 has HIGH VOLTAGE, then waterLevel set at 0
        }
        return waterLevel;
    }).catch((error) => {
        console.log('Error on measureWaterLevel() ' + error);
        throw error;
    });
}

var output = {
    coffeeMaker: {
        write: writeOnCoffeeMaker
    },
    water: {
        getLevel: measureWaterLevel,
        getCacheLevel: cacheWaterLevel
    }
};

module.exports = output;
