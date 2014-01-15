__rootPath = __dirname;
var express = require('express');
var app = express()
  , server = require('http').createServer(app)
  , io = require('socket.io').listen(server);

io.set('log level', 1);
server.listen(3210);

app.use('/static/images', express.static(__rootPath + '/static/images', {maxAge:86400}));
app.use('/static', express.static(__rootPath + '/static'));

var websiteRoutes = require(__rootPath + '/routes/website')
websiteRoutes(app);

//app.get('/', websiteRoutes);

io.sockets.on('connection', function (socket) {
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

