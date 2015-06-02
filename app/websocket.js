var net = require("net");
var ws = require("nodejs-websocket");
var util = require('util');
var EventEmitter = require('events').EventEmitter;
var log = require('./lib/logger');

create = function(settings){

    var wserver = ws.createServer(function (conn) {

        EventEmitter.call(this);
        var self = this;

        log.info('Created new websocket instance');

        conn.on("text", function (str) {
            log.debug('Received data from webpage');
            var response = {};
            try{
                var json = JSON.parse(str);
                if(json.command == "start-race"){
                    log.info('Received "start-race" command from webpage');
                    response.status = "ok";
                    self.emit('start');
                }
                if(json.command == "cancel-race"){
                    log.info('Received "cancel-race" command from webpage');
                    // cancel all race elements and reinitialize
                    response.status = "ok";
                    self.emit('cancel');
                }
            } catch (err){
                response.status = "error";
                response.message = "JSON not valid, parsing error.";
                log.error(err);
            }
            if(response.status){
                conn.sendText(JSON.stringify(response));
            }
        })

        conn.on("close", function (code, reason) {
            log.info('Websocket connection closed (%s)', reason);
        })

        conn.on("error", function(err){
        	log.error("Caught flash policy server socket error: ")
        	log.error(err.stack)
      	});
    }).listen(settings.port);

    wserver.send = function(msg) {
        log.info('Sending data to websocket: %s', msg);
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