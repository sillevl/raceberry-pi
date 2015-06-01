var DetectorModule = require('./detector.js');

/**
 * Settings
 */
const settings = {
    detector: {
      clear: 33,          // Clear pin number
      input: 31           // Input pin number
    }
}

var detector = new DetectorModule.Detector(settings.detector);

detector.enable(function(){
  console.log("Listening for changes on input");
  detector.listen(true, 10, changes);
});

function changes() {
  console.log("Stuff happened");
}

setTimeout(function() {
  detector.stoplistening(function(){
  	detector.kill();
  });
}, 10000 );