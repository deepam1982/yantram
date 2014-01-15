__rootPath = __dirname;
var express = require('express');
var app = express();

var websiteRoutes = require('./routes/website')
app.use('/static', express.static(__rootPath + '/static'));
websiteRoutes(app);

//app.get('/', websiteRoutes);

// var TarangController = require('./classes/communicators/tarang');
// var DeviceManager = require('./classes/devices/deviceManager');
// var communicator = new TarangController;
// var deviceManager = new DeviceManager(communicator);

// try {
// 	var dh1= deviceManager._deviceMap['0003017c'];
// 	var dh2= deviceManager._deviceMap['00030181'];
// 	dh1.toggleSwitch(1);
// }
// catch (err) {}



app.listen(3210);
