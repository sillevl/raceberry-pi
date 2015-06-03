var gpio = require('rpi-gpio');
var util = require('util');
var EventEmitter = require('events').EventEmitter;
var log = require('./lib/logger');

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
    gpio.setup(settings.clear, gpio.DIR_OUT, function() {
      gpio.write(settings.clear, true, function(err) {
          if (err) throw err;
          log.verbose('Initialising detector');
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
        log.verbose('Clearing detector');
    });
  }

  /**
   * Kill the detector (unexport all pins)
   */
  this.kill = function() {
    gpio.destroy(function() {
        log.info('Killing detector. All pins unexported');
    });
  }

  /**
   * Listen for changes on the input pin
   */
  this.listen = function(interval, callback_rising_edge, callback_falling_edge) {
    listener = setInterval(function() {
      gpio.read(settings.input, function(err, value) {
          if (previous_state != value) {
            log.debug("Detected change from " + previous_state + " to " + value);
            previous_state = value;

            if(value){
              self.emit('falling-edge');
              log.verbose('Falling edge detected');
            } else {
              self.emit('rising-edge');
              log.verbose('Rising edge detected');
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
    log.info("Detector enabled");
  }

  this.disable = function(){
    this.enabled = false;
    log.info.("Detector disabled");
  }
}

util.inherits(Detector, EventEmitter);

create = function(settings){
  var detector = new Detector(settings);
  detector.init();

  log.info('create new detector instance');

  detector.on('initialized',function(){
    detector.listen(10);
  });

  detector.on('rising-edge', function(){
    if(this.enabled){
        if(detector.status == 'waiting'){
          detector.status = 'running';
          detector.emit('start');
          log.debug("Changed status to 'running'");
        } else {
          detector.status = 'waiting';
          detector.emit('finish');
          log.debug("Changed status to 'waiting'");
        }
      }
  });

  detector.reset = function(){
    detector.status = 'waiting';
  };

  return detector;
}

module.exports.create = create;