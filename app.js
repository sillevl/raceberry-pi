var Mbed = require('./app/mbed');
var HttpServer = require('./app/http-server');
var WebSocket = require('./app/websocket');
var Detector = require('./app/detector');
var Leds = require('./app/leds');
var Timer = require('./app/timer');

/**
 * Settings
 */

const settings = {
	http: {
		port: 3000
	},
	websocket: {
		port: 45679
	},
    mbed: {
        port: 1337,
        address: '224.12.24.36'
    },
    detector: {
      clear: 33,          // Clear pin number
      input: 31           // Input pin number
    },
    i2c: {
      address: 0x60,          // 7 bit address for linux
      device: '/dev/i2c-1'
    }
}

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
    mbed.write('{"stop": 1234}');
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
    console.log('--- websocket start');
    startLeds();
    //startSimulator();
});

webSocket.on('cancel', function(){
    console.log('--- websocket cancel ');
    mbed.write('{"stop": 1234}');
    detector.disable();
});

/**
 *  MBED start/stop robot
 */

var mbed = Mbed.create(settings.mbed);
