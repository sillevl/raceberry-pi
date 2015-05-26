$(document).ready(function () {

  function debug(string) {
    var debug = document.getElementById("debug");
    var p = document.createElement('p');
    var now = new Date();
    p.innerHTML =  now.toLocaleTimeString()+ ": " +string;
    debug.insertBefore(p, debug.firstChild);
  }

  var Socket = "MozWebSocket" in window ? MozWebSocket : WebSocket;
  var ws = new Socket("ws://" + location.hostname + ":45679/");
  ws.onmessage = function(evt) { 
    try{
      data = JSON.parse(evt.data);
      //gauges[keys[data.key]].refresh(data.temperature);
      debug("Received: " + evt.data); 
    }
    catch(err) {
        debug(error.message);
    }
  };
  ws.onclose = function(event) {
    debug("Closed - code: " + event.code + ", reason: " + event.reason + ", wasClean: " + event.wasClean);
  };
  ws.onopen = function() {
    debug("connected...");
  };
});