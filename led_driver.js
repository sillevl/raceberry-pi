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

Registers = {
    MODE1 : 0x00,
    MODE2 : 0x01,
    ERROR_FLAGS1 : 0x1D,
    ERROR_FLAGS2 : 0x1E
}

function LedDriver(settings) {

  // var settings = settings;
  var i2cdevice = new i2c(settings.address, {device: settings.device});

  this.readRegister = function(register, callback) {
    i2cdevice.writeByte(register, function(err) {
      if (err != null) {
        console.log("Err: " + err + "\n");
        throw new WriteFailedException();
      }

      i2cdevice.readByte(function(err, res) {
        if (err != null) {
          console.log("Err: " + err + "\n");
          throw new ReadFailedException();
        }

        console.log("Reading register " + register + ": 0x" + res.toString(16));
        callback(res);
      });
    });
  }
}

var leddriver = new LedDriver(settings.i2c);


// try some code
try {
  leddriver.readRegister(Registers.MODE1, function(res){console.log("done " + res)});
}
catch (e) {
    if (e instanceof WriteFailedException) {
        alert("Failed to write to device");
    }
    else if (e instanceof ReadFailedException) {
        alert("Failed to read from device");
    }
}