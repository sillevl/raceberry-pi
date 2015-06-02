var finalhandler = require('finalhandler')
var http = require('http')
var serveStatic = require('serve-static')

create = function(settings){
	// Serve up public/ftp folder
	var serve = serveStatic('.', {'index': ['index.html', 'index.htm']})

	// Create server
	var server = http.createServer(function(req, res){
	  var done = finalhandler(req, res)
	  serve(req, res, done)
	})

	// Listen
	server.listen(settings.port)
	console.log("Server is listening on port: " + settings.port)

	return server;
}

module.exports.create = create;