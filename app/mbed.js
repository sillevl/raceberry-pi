var dgram = require('dgram');


Mbed = function(address, port){

	var socket = dgram.createSocket('udp4');

	this.write = function(text){
	    var message = new Buffer(text + '\r\n\0');
	    socket.send(message, 0, message.length, port, address, function(err, bytes) {
	        if (err) throw err;
	        console.log('UDP message sent to ' + address +':'+ port);
	    });
	}
}

create = function(settings){
	return new Mbed(settings.address, settings.port);
}


module.exports.create = create;