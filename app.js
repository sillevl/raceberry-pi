var Mbed = require('./app/mbed');
var HttpServer = require('./app/http-server');
var WebSocket = require('./app/webSocket');
var Detector = require('./app/detector');
//var Leds = require('./app/leds');

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

/**
 * Detector
 */

detector = Detector.create(settings.detector);

detector.on('start', function(){
    console.log('detector start');
})

detector.on('stop', function(){
    console.log('detector stop');
})

detector.reset();

 /**
 * Leds
 */

/*var red = { red: 100};
var orange = { red: 100, green: 100};
var green = { green: 100};

leds = Leds.create(settings.i2c);

setTimeout(function(){
    leds.setColor(red);
}, 0);

setTimeout(function(){
    leds.setColor(orange);
}, 1000);

setTimeout(function(){
    leds.setColor(green);
}, 2000);
*/

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
    startSimulator();
});

webSocket.on('cancel', function(){
    console.log('--- websocket cancel ');
});

webSocket.write('test');


/**
 *  MBED start/stop robot
 */

var mbed = Mbed.create(settings.mbed);

mbed.write('{"start": 1234}');

setTimeout(function(){
    mbed.write('{"stop": 1234}');
}, 2000);