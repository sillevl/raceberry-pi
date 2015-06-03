var Mbed = require('./app/mbed');
var HttpServer = require('./app/http-server');
var WebSocket = require('./app/websocket');
var Detector = require('./app/detector');
var Leds = require('./app/leds');
var Timer = require('./app/timer');
var settings = require('./app/settings');


timer = Timer.create();

/**
 * Detector
 */

detector = Detector.create(settings.detector);

detector.on('start', function(){
    timer.start();
    webSocket.write('{"command" : "start-timer"}');
    console.log('detector start');
    leds.clearAllLeds();
})

detector.on('finish', function(){
    console.log('detector stop');
    mbed.write('{"stop": ' + settings.pololu.code + '}');
    var laptime = timer.stop();
    webSocket.write('{"command": "finish", "time": ' + laptime + '}');
    leds.clearAllLeds();
    detector.disable();
})


 /**
 * Leds
 */

var red = { red: 100};
var orange = { red: 100, green: 100};
var green = { green: 100};

leds = Leds.create(settings.i2c);

startLeds = function(){
    setTimeout(function(){
        leds.setColor(1,red);
    }, 0);

    setTimeout(function(){
        leds.setColor(2,orange);
    }, 1000);

    setTimeout(function(){
        leds.setColor(3,green);
        mbed.write('{"start": 1234}');
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
    mbed.write('{"stop": ' + settings.pololu.code + '}');
    detector.disable();
    timer.reset();
});

webSocket.on("connection", function(){
    webSocket.write(JSON.stringify({ 'timer-status': timer.getStatus()}));
});

/**
 *  MBED start/stop robot
 */

var mbed = Mbed.create(settings.mbed);
