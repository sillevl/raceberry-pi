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
    ERROR_FLAGS1 : 0x1D,
    ERROR_FLAGS2 : 0x1E
}

function Color(red, green, blue) {
  this.red = red;
  this.green = green;
  this.blue = blue;
}

function LedDriver(settings) {

  // var settings = settings;
  var i2cdevice = new i2c(settings.address, {device: settings.device});

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
}

var leddriver = new LedDriver(settings.i2c);


// try some code
try {
  leddriver.writeRegister(Registers.MODE1, 0x11, function() {
    leddriver.readRegister(Registers.MODE1, function(res){
      console.log("done " + res)
    })
  });
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