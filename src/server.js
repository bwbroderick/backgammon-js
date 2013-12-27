var ioModule = require('socket.io')
 , game = require('./game.js')

currentGame = undefined

start = function(app, port, cb){
	currentGame = game.initialBoard()
	currentPlayer = 'red'

	port = process.env.PORT || port || 5000;
	var server = app.listen(port, cb)
	io = require('socket.io').listen(server);

	io.sockets.on('connection', function (socket) {
		socket.on("status", function() {
			return socket.emit("status", currentGame.state())
		});
		socket.on("player", function() {
			return socket.emit("player", currentPlayer)
		});
		socket.on("move", function(pos, roll) {
			console.log(pos, roll)
			currentGame.progressPiece(pos, roll)
			currentPlayer = currentPlayer.opponent();
			return socket.emit("status", currentGame.state())
		});
	});
}
stop = function(cb){
	io.server.close();
	cb()
}
module.exports.start = start;
module.exports.stop = stop;
