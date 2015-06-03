var dgram = require('dgram');
var log = require('./lib/logger');


Mbed = function(address, port){

	var socket = dgram.createSocket('udp4');

	this.write = function(text){
		log.info('writing message to mbed: %s', text)
	    var message = new Buffer(text + '\r\n\0');
	    socket.send(message, 0, message.length, port, address, function(err, bytes) {
	        if (err) throw err;
	        log.debug('UDP message sent to ' + address +':'+ port);
	    });
	}

	this.start = function(code){
		this.write('{"start": ' + code + '}');
	}
	
	this.stop = function(code){
		this.write('{"stop": ' + code + '}');
	}
}

create = function(settings){
	log.verbose('created new mbed instance');
	return new Mbed(settings.address, settings.port);
}


module.exports.create = create;