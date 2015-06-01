var LedDriverModule = require('./js/led_driver.js');

/**
 * Settings
 */
const settings = {
    i2c: {
      address: 0x60,          // 7 bit address for linux
      device: '/dev/i2c-1'
    }
}

var leddriver = new LedDriverModule.LedDriver(settings.i2c);

// try some code
try {
  console.log("Starting");

  leddriver.enable(function() {
    console.log("Enabled");
    leddriver.clearAllLeds(function() {
      console.log("Clearing all leds");
      leddriver.setPwmControl(true, function() {
        console.log("PWM control enabled");
      });
    });
  });

  setTimeout(function() {
    leddriver.writeLed(0, new LedDriverModule.Color(128, 128, 0), function() {
        console.log("Done with color");
    })
  }, 1000 );

  setTimeout(function() {
    leddriver.writeLed(1, new LedDriverModule.Color(0, 128, 0), function() {
        console.log("Done with color");
    })
  }, 2000 );

  setTimeout(function() {
    leddriver.writeLed(2, new LedDriverModule.Color(0, 0, 128), function() {
        console.log("Done with color");
    })
  }, 3000 );

  setTimeout(function() {
    leddriver.setPwmControl(false, function() {
      console.log("PWM control disabled");
      leddriver.disable(function() {
        console.log("Disabled");
        leddriver.clearAllLeds(function() {
          console.log("Clearing all leds");
        });
      });
    });
  }, 5000 );

}
catch (e) {
    if (e instanceof LedDriverModule.WriteFailedException) {
        alert("Failed to write to device");
    }
    else if (e instanceof LedDriverModule.ReadFailedException) {
        alert("Failed to read from device");
    }
    else if (e instanceof LedDriverModule.WriteRegisterFailed) {
        alert("Failed to write register of device");
    }
}