var i2c = require('i2c');
var log = require('./lib/logger');

// define exceptions "classes" 
function WriteFailedException() {}
function ReadFailedException() {}
function WriteRegisterFailed() {}

Registers = {
    MODE1 : 0x00,
    MODE2 : 0x01,
    PWM0: 0x02,
    LED_OUT_0: 0x14,
    ERROR_FLAGS1 : 0x1D,
    ERROR_FLAGS2 : 0x1E
}

var AUTO_INCREMENT = 0x80;
var NUMBER_OF_LEDS = 16;

function Color(red, green, blue) {
  this.red = red;
  this.green = green;
  this.blue = blue;
}

function LedDriver(settings) {

  // var settings = settings;
  var i2cdevice = new i2c(settings.address, {device: settings.device});

  var self = this;

  this.readRegister = function(register, callback) {
    i2cdevice.writeByte(register, function(err) {
      if (err) {
        log.error("Err: " + err + "\n");
        throw new WriteFailedException();
      }

      i2cdevice.readByte(function(err, res) {
        if (err) {
          log.error("Err: " + err + "\n");
          throw new ReadFailedException();
        }

        log.debug("Reading register " + register + ": 0x" + res.toString(16));
        
        if (callback) {
          callback(res);
        }
      });
    });
  }

  /**
   * Enable driver output
   */
  this.enable = function(callback) {
    // TODO: We should actually read out register first
    this.writeRegister(Registers.MODE1, 0x00);

    if (callback) {
      callback();
    }
  }

  /**
   * Disable driver output
   */
  this.disable = function(callback) {
    // TODO: We should actually read out register first
    this.writeRegister(Registers.MODE1, 0x10);

    if (callback) {
      callback();
    }
  }

  /**
   * Enable or disable PWM control of leds.
   * If this is set to true the colors of the leds can be changed.
   */   
  this.setPwmControl = function(enable, callback) {
    if (enable) {
      value = 0xAA;
    } else {
      value = 0x00;
    }

    i2cdevice.write([Registers.LED_OUT_0 | AUTO_INCREMENT, value, value, value, value], function(err) {
      if (err) {
        log.error("Err: " + err + "\n");
        throw new WriteRegisterFailed();
      }

      if (callback) {
        callback();
      }
    });
  }

  this.writeRegister = function(register, value, callback) {
    i2cdevice.write([register, value], function(err) {
      if (err) {
        log.error("Err: " + err + "\n");
        throw new WriteRegisterFailed();
      }

      if (callback) {
        callback();
      }
    });
  }

  /**
   * Set Color of a single RGB led at the specified index.
   */
  this.writeLed = function(index, color, callback) {
    color.red = color.red * 2.55;
    color.green = color.green * 2.55;
    color.blue = color.blue * 2.55;
    i2cdevice.write([Registers.PWM0+(3*index) | AUTO_INCREMENT, color.red, color.blue, color.green], function(err) {
      if (err) {
        log.error("Err: " + err + "\n");
        throw new WriteRegisterFailed();
      }

      if (callback) {
        callback();
      }
    });
  }

  /**
   * Clear all leds
   */
  this.clearAllLeds = function(callback) {

    var clear = new Array(NUMBER_OF_LEDS+1);
    clear[0] = Registers.PWM0+i | AUTO_INCREMENT;
    for (var i = 1; i <= NUMBER_OF_LEDS; i++) {
      clear[i] = 0;
    }

    i2cdevice.write(clear, function(err) {
      if (err) {
        log.error("Err: " + err + "\n");
        throw new WriteRegisterFailed();
      }
    });

    if (callback) {
      callback();
    }
  }
}

module.exports.create = function(settings){

  var leddriver = new LedDriver(settings);

  leddriver.enable(function() {
    log.verbose("Enabled led driver");
    leddriver.clearAllLeds(function() {
      log.verbose("Clearing all leds");
      leddriver.setPwmControl(true, function() {
        log.verbose("PWM control enabled");
      });
    });
  });

  leddriver.setColor = function(index, color){
      log.info("Settings color %s to led %d", color.toString(), index)
      leddriver.writeLed(index-1, color);
  }

  return leddriver;
}

module.exports.Color = Color;
module.exports.LedDriver = LedDriver;
module.exports.WriteFailedException = WriteFailedException
module.exports.ReadFailedException = ReadFailedException
module.exports.WriteRegisterFailed = WriteRegisterFailed