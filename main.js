__rootPath = __dirname;
__userEmail = 'deepam1982@gmail.com';
var express = require('express');
var expressDevice = require('express-device');
var app = express()
  , server = require('http').createServer(app)
  , io = require('socket.io').listen(server);

io.set('log level', 1);
server.listen(3210);

app.use('/static/images', express.static(__rootPath + '/static/images', {maxAge:86400}));
app.use('/static', express.static(__rootPath + '/static'));
app.use(expressDevice.capture());
app.use(function(err, req, res, next){
  console.error(err.stack);
  res.send(500, 'Something broke!');
});

var websiteRoutes = require(__rootPath + '/routes/website')
websiteRoutes(app);

//app.get('/', websiteRoutes);

io.sockets.on('connection', function (socket) {
  console.log('Socket connection established!!')
  socket.emit('connectionSuccess', { hello: 'world' });
  socket.on('testData', function (data) {
    console.log(data);
  });
});

var deviceManager = require(__rootPath + '/classes/devices/deviceManager');
var roomModel = require(__rootPath+"/configs/managers/roomConfigManager");

deviceManager.on('deviceStateChanged', function () {
	io.sockets.emit('roomConfigUpdated', roomModel.getList())
});

// try {
// 	var dh1= deviceManager._deviceMap['0003017c'];
// 	var dh2= deviceManager._deviceMap['00030181'];
// 	dh1.toggleSwitch(1);
// }
// catch (err) {}

console.log("main.js ran");
var eventLogger = require(__rootPath+"/classes/eventLogger/logger");
eventLogger.addEvent("homeControllerStarted");

process.on('uncaughtException', function (err) {
    console.log( "UNCAUGHT EXCEPTION " );
    console.log( "[Inside 'uncaughtException' event] " + err.stack || err.message );
});
