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
    timer.start();
    leds.clearAllLeds();
})

detector.on('finish', function(){
    console.log("Detector is gestopt");
    var laptime = timer.stop();
    webSocket.write('{"command": "finish", "time": ' + laptime + '}');
    detector.disable();
    leds.clearAllLeds();
})

/**
 * Leds
 */

leds = Leds.create(settings.i2c);


startLeds = function(){
    setTimeout(function(){
        leds.setColor(1, { red: 100});
    }, 0);

    setTimeout(function(){
        leds.setColor(2, { red: 100, green: 100});

    }, 1000);
    setTimeout(function(){
        leds.setColor(3, { green: 100});
        detector.enable();
    }, 2000);
}

/**
 * Http server
 */

httpServer = HttpServer.create(settings.http);

/**
 * Websocket server
 */

webSocket = WebSocket.create(settings.websocket);

webSocket.on('start', function(){
    startLeds();
});

webSocket.on('cancel', function(){

});

/**
 * Timer
 */

timer = Timer.create();

