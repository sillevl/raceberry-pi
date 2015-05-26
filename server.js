/**
 * Settings
 */

const settings = {
	http: {
		port: 3000
	},
	websocket: {
		port: 45679
	}
}

/**
 * Http server
 */

var finalhandler = require('finalhandler')
var http = require('http')
var serveStatic = require('serve-static')

// Serve up public/ftp folder
var serve = serveStatic('.', {'index': ['index.html', 'index.htm']})

// Create server
var server = http.createServer(function(req, res){
  var done = finalhandler(req, res)
  serve(req, res, done)
})

// Listen
server.listen(settings.http.port)
console.log("Server is listening on port: " + settings.http.port)

/**
 * Websocket server
 */
var net = require("net");
var ws = require("nodejs-websocket");

var wserver = ws.createServer(function (conn) {
    console.log("New connection")
    conn.on("text", function (str) {
        console.log("Received "+str)
        conn.sendText(str.toUpperCase()+"!!!")
    })
    conn.on("close", function (code, reason) {
        console.log("Connection closed")
    })
    	conn.on("error", function(err){
    	console.log("Caught flash policy server socket error: ")
    	console.log(err.stack)
  	});
}).listen(settings.websocket.port);

wserver.send = function(msg) {
    wserver.connections.forEach(function (conn) {
        conn.sendText(msg)
    })
}
