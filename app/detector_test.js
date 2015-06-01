var gpio = require('rpi-gpio');
 
// gpio.setup(31, gpio.DIR_IN, readInput);
// gpio.setup(33, gpio.DIR_OUT, write);
 
// function write() {
//     gpio.write(33, true, function(err) {
//         if (err) throw err;
//         console.log('Enabling detector');
//     });

//     gpio.setPollFrequency(100);
// }


// setTimeout(function() {
  // function readInput() {
  //     console.log("Reading");
  //     gpio.read(31, function(err, value) {
  //         console.log('The value is ' + value);
  //     });
  // }
// }, 2000);


gpio.setup(31, gpio.DIR_IN, listen);
var previous = true;

function listen() {
  setInterval(function() {
    gpio.read(31, function(err, value) {
        if (previous != value) {
          console.log("Detected change from " + previous + " to " + value);
          previous = value;
        }
    });

  }, 10);
}

setTimeout(function() {
  console.log("Enough!!!");

  gpio.destroy(function() {
      console.log('All pins unexported');
      return process.exit(0);
  });
}, 20000);



// var gpio = require('rpi-gpio');
 
// var pin   = 7;
// var delay = 2000;
// var count = 0;
// var max   = 3;
 
// gpio.on('change', function(channel, value) {
//     console.log('Channel ' + channel + ' value is now ' + value);
// });
// gpio.setup(31, gpio.DIR_IN, on);
 
// function on() {
//     if (count >= max) {
//         gpio.destroy(function() {
//             console.log('Closed pins, now exit');
//             return process.exit(0);
//         });
//         return;
//     }
 
//     setTimeout(function() {
//         gpio.write(pin, 1, off);
//         count += 1;
//     }, delay);
// }
 
// function off() {
//     setTimeout(function() {
//         gpio.write(pin, 0, on);
//     }, delay);
// }