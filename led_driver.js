var i2c = require('i2c');

/**
 * Settings
 */
const settings = {
    i2c: {
      address: 0x60,          // 7 bit address for linux
      device: '/dev/i2c-1'
    }
}

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
        console.log("Err: " + err + "\n");
        throw new WriteFailedException();
      }

      i2cdevice.readByte(function(err, res) {
        if (err) {
          console.log("Err: " + err + "\n");
          throw new ReadFailedException();
        }

        console.log("Reading register " + register + ": 0x" + res.toString(16));
        
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
        console.log("Err: " + err + "\n");
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
        console.log("Err: " + err + "\n");
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
    i2cdevice.write([Registers.PWM0+(3*index) | AUTO_INCREMENT, color.red, color.blue, color.green], function(err) {
      if (err) {
        console.log("Err: " + err + "\n");
        throw new WriteRegisterFailed();
      }

      if (callback) {
        callback();
      }
    });
  }
}

var leddriver = new LedDriver(settings.i2c);


// try some code
try {
  console.log("Starting");


  leddriver.enable(function() {
    console.log("Enabled");
    leddriver.setPwmControl(true, function() {
      console.log("PWM control enabled");
    });
  });
  
  setTimeout(function() {
    leddriver.writeLed(0, new Color(128, 0, 0), function() {
        console.log("Done with color");
    })
  }, 1000 );

  setTimeout(function() {
    leddriver.writeLed(1, new Color(0, 128, 0), function() {
        console.log("Done with color");
    })
  }, 2000 );

  setTimeout(function() {
    leddriver.writeLed(2, new Color(0, 0, 128), function() {
        console.log("Done with color");
    })
  }, 3000 );

  setTimeout(function() {
    leddriver.setPwmControl(false, function() {
      console.log("PWM control disabled");
      leddriver.disable(function() {
        console.log("Disabled");
      });
    });
  }, 5000 );

}
catch (e) {
    if (e instanceof WriteFailedException) {
        alert("Failed to write to device");
    }
    else if (e instanceof ReadFailedException) {
        alert("Failed to read from device");
    }
    else if (e instanceof WriteRegisterFailed) {
        alert("Failed to write register of device");
    }
}