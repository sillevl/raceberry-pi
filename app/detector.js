var gpio = require('rpi-gpio');

function Detector(settings) {
  
  var previous_state = true;
  var listener = null;

  /**
   * Enable detection by setting the clear pin high
   */
  this.enable = function(callback) {
    // Configure input
    gpio.setup(settings.input, gpio.DIR_IN);

    // Configure clear
    gpio.setup(settings.clear, gpio.DIT_OUT, function() {
      gpio.write(settings.clear, true, function(err) {
          if (err) throw err;
          console.log('Enabling detector');

          if (callback) {
            callback();
          }
      });
    });
  }

  /**
   * Clear the output by setting the clear pin low
   */
  this.clear = function() {
    gpio.write(settings.clear, false, function(err) {
        if (err) throw err;
        console.log('Clearing detector');
    });
  }

  /**
   * Kill the detector (unexport all pins)
   */
  this.kill = function() {
    gpio.destroy(function() {
        console.log('Killing detector. All pins unexported');
    });
  }

  /**
   * Listen for changes on the input pin
   */
  this.listen = function(on_rising_edge, interval, callback) {
    listener = setInterval(function() {
      gpio.read(settings.input, function(err, value) {
          if (previous_state != value) {
            console.log("Detected change from " + previous_state + " to " + value);
            previous_state = value;

            if (callback) {
              callback();
            }
          }
      });

    }, interval);
  }

  /**
   * Stop listening for input changes
   */
  this.stoplistening = function(callback) {
    clearInterval(listener);

    if (callback) {
      callback();
    }
  }

}

module.exports.Detector = Detector;