__rootPath = __dirname;
var BaseConfigManager = require(__rootPath+"/configs/managers/baseManager");
var UsrCnfMngr = BaseConfigManager.extend({path : '/../configs/userConfig.json'});
__userConfig = new UsrCnfMngr({'callback':function (err) {
  __userEmail = __userConfig.get('email');
  //__userEmail = 'dharmaraopv@gmail.com';
  //__userEmail = 'deepam1982@gmail.com';
  //__userEmail = 'kaddyiitr@gmail.com';
  var express = require('express');
  var favicon = require('serve-favicon');
  //var expressDevice = require('express-device');
  var app = express()
    , server = require('http').createServer(app)
    , io = require('socket.io').listen(server)

  io.set('log level', 1);
  server.listen(3210);

  app.use(favicon(__rootPath + '/static/images/favicon.ico'));
  //app.use('/favicon', express.static(__rootPath + '/static/images', {maxAge:86400}));
  app.use('/static/images', express.static(__rootPath + '/static/images', {maxAge:86400}));
  app.use('/static', express.static(__rootPath + '/static'));
  //app.use(expressDevice.capture());
  app.use(function(err, req, res, next){
    console.error(err.stack);
    res.send(500, 'Something broke!');
  });

  var websiteRoutes = require(__rootPath + '/routes/website')
  websiteRoutes(app);

  //app.get('/', websiteRoutes);
  io.sockets.on('connection', function (socket) {
    console.log('Socket connection established!!')
  });


  var SocketCommandManager = require(__rootPath + '/classes/sockets/commandManager')
  var socComMngr = new SocketCommandManager({'localIo':io});

  var SocketRequestManager = require(__rootPath + '/classes/sockets/requestManager')
  var socReqMngr = new SocketRequestManager({'localIo':io});

  var deviceManager = require(__rootPath + '/classes/devices/deviceManager');
  var roomModel = require(__rootPath+"/configs/managers/roomConfigManager");

  deviceManager.on('deviceStateChanged', function () {
    io.sockets.emit('roomConfigUpdated', roomModel.getList())
  });

  require(__rootPath + '/classes/sockets/initClientSocket')(function (err, cloudSocket) {
    cloudSocket.emit('roomConfigUpdated', roomModel.getList())
    deviceManager.on('deviceStateChanged', function () {
      cloudSocket.emit('roomConfigUpdated', roomModel.getList())
    });  
    socComMngr.setCloudSocket(cloudSocket);
    socReqMngr.setCloudSocket(cloudSocket);
  })
    

  var coordinator = require(__rootPath+"/classes/coordinator");
  // coordinates between sensors, virtual devices, timers etc.
  console.log("main.js ran");

  var eventLogger = require(__rootPath+"/classes/eventLogger/logger");
  eventLogger.addEvent("homeControllerStarted");

  process.on('uncaughtException', function (err) {
      console.log( "UNCAUGHT EXCEPTION " );
      console.log( "[Inside 'uncaughtException' event] " + err.stack || err.message );
  });
}});
