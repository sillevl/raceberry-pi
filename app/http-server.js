var finalhandler = require('finalhandler')
var http = require('http')
var serveStatic = require('serve-static')
var log = require('./lib/logger')

create = function(settings){

	log.info("created new http-server instance")
	// Serve up public/ftp folder
	var serve = serveStatic('.', {'index': ['index.html', 'index.htm']})

	// Create server
	var server = http.createServer(function(req, res){
	  log.debug("HTTP server created")
	  var done = finalhandler(req, res)
	  serve(req, res, done)
	})

	// Listen
	server.listen(settings.port, function(){
		log.info("Server is listening on port: %d", settings.port)
	})

	return server;
}

module.exports.create = create;