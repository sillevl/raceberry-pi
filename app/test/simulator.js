exports.startSimulator = function(){
    console.log('-- Start simulator --');
    setTimeout(function() {
        webSocket.send('{"command" : "start-timer"}');
        timer.start();
    }, 2000);

    setTimeout(function() {
        webSocket.send('{"command" : "finish", "time" : ' + timer.stop() + '}');
        timer.stop();
    }, 15000);
};