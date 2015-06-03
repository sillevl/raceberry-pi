var Mbed = require('./app/mbed');
var HttpServer = require('./app/http-server');
var WebSocket = require('./app/websocket');
var Detector = require('./app/detector');
var Leds = require('./app/leds');
var Timer = require('./app/timer');
var settings = require('./app/settings');


/**
 *  RACEBERRY-PI 
 */


/**
 * Detector
 */

detector = Detector.create(settings.detector);

detector.on('start', function(){
    console.log("Detector is gestart");
})

detector.on('finish', function(){
    console.log("Detector is gestopt");
})

/**
 * Leds
 */

leds = Leds.create(settings.i2c);

leds.setColor(1, { red: 100});
leds.setColor(2, { red: 100, green: 100});
leds.setColor(3, { green: 100});