var net = require("net");
var ws = require("nodejs-websocket");
var util = require('util');
var EventEmitter = require('events').EventEmitter;

create = function(settings){

    var wserver = ws.createServer(function (conn) {

        EventEmitter.call(this);
        var self = this;

        console.log("New connection");

        conn.on("text", function (str) {
            var response = {};
            console.log("Received "+str)
            try{
                var json = JSON.parse(str);
                console.log(json);
                if(json.command == "start-race"){
                    //startSimulator();
                    response.status = "ok";
                    self.emit('start');
                }
                if(json.command == "cancel-race"){
                    // cancel all race elements and reinitialize
                    response.status = "ok";
                    self.emit('cancel');
                }
            } catch (err){
                response.status = "error";
                response.message = "JSON not valid, parsing error.";
                console.log(err);
            }
            if(response.status){
                conn.sendText(JSON.stringify(response));
            }
        })

        conn.on("close", function (code, reason) {
            console.log("Connection closed")
        })

        conn.on("error", function(err){
        	console.log("Caught flash policy server socket error: ")
        	console.log(err.stack)
      	});
    }).listen(settings.port);

    wserver.send = function(msg) {
        wserver.connections.forEach(function (conn) {
            conn.sendText(msg)
        })
    }

    wserver.write = function(message){
        wserver.send(message);
    }

    util.inherits(wserver, EventEmitter);

    return wserver;
}


module.exports.create = create;