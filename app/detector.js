var gpio = require('rpi-gpio');
var util = require('util');
var EventEmitter = require('events').EventEmitter;

function Detector(settings) {

  EventEmitter.call(this);
  var self = this;
  
  var previous_state = true;
  var listener = null;
  var enabled = false;

  this.status = 'waiting';

  /**
   * Initialising detection by setting the clear pin high
   */
  this.init = function(callback) {
    // Configure input
    gpio.setup(settings.input, gpio.DIR_IN);

    // Configure clear
    gpio.setup(settings.clear, gpio.DIT_OUT, function() {
      gpio.write(settings.clear, true, function(err) {
          if (err) throw err;
          console.log('Enabling detector');
          self.emit('initialized');

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
  this.listen = function(interval, callback_rising_edge, callback_falling_edge) {
    listener = setInterval(function() {
      gpio.read(settings.input, function(err, value) {
          if (previous_state != value) {
            console.log("Detected change from " + previous_state + " to " + value);
            previous_state = value;

            if(value){
              self.emit('falling-edge');
            } else {
              self.emit('rising-edge');
            }

            if (callback_rising_edge && !value) {
              callback_rising_edge();
            } else if (callback_falling_edge && value) {
              callback_falling_edge();
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
    self.emit('stopped');

    if (callback) {
      callback();
    }
  }

  this.enable = function(){
    this.enabled = true;
  }

  this.disable = function(){
    this.enabled = false;
  }
}

util.inherits(Detector, EventEmitter);

create = function(settings){
  var detector = new Detector(settings);
  detector.init();

  console.log('create detector');

  detector.on('initialized',function(){
    detector.listen(10);
  });

  detector.on('rising-edge', function(){
    if(this.enabled){
      console.log('rising edge !!! ' + detector.status);
        if(detector.status == 'waiting'){
          detector.status = 'running';
          detector.emit('start');
        } else {
          detector.status = 'waiting';
          detector.emit('finish');
        }
      }
  });

  detector.reset = function(){
    detector.status = 'waiting';
  };

  return detector;
}

module.exports.create = create;