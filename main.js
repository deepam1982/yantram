var __ = require("underscore");
var fs = require('fs');

var noLogs = false;
__.each(process.argv, function (argmnt) {
  if(argmnt == 'noLogs') noLogs = true;
});
if(noLogs) {
  console.log = function () {};
}
var on=1;
fs.exists('/sys/class/gpio/gpio18', function (exist) {
  if(exist) fs.writeFile('/sys/class/gpio/unexport',18, function (err) { if(err) return console.log();})
  __.defer(function () {
      fs.writeFile('/sys/class/gpio/export',18, function (err) { if(err) return console.log();
        console.log('Opened gpio 18');
        fs.writeFile('/sys/class/gpio/gpio18/direction','out', function(err) { if(err) return console.log(err);
          console.log('Direction gpio 18 was set');
          fs.writeFile('/sys/class/gpio/gpio18/value',on, function(err) {if(err)console.log(err);
            console.log('Starting App Running indication on GPIO');
            setInterval(function () {on = (on + 1) % 2;fs.writeFile('/sys/class/gpio/gpio18/value',on);}, 800);
          });  
        });  
      });
  });
});

__rootPath = __dirname;
var BasicConfigManager = require(__rootPath+"/classes/configs/basicConfigManager");
var SystemConfigMngr = BasicConfigManager.extend({file : '/../configs/systemConfig.json'});
__systemConfig = new SystemConfigMngr({'callback':function(err){
        var groupConfig = require(__rootPath+"/classes/configs/groupConfig");
        __remoteDevInfoConf = require(__rootPath+"/classes/configs/deviceInfoConfig");

        var UsrCnfMngr = BasicConfigManager.extend({file : '/../configs/userConfig.json'});
        __userConfig = new UsrCnfMngr({'callback':function (err) {

          var DevStConfMngr = BasicConfigManager.extend({file : '/../configs/deviceStateConfig.json'});
          __deviceStateConf = new DevStConfMngr({'callback':function (err) {
            var devStatConfAtBegn = __deviceStateConf.toJSON();
            setInterval(function () {
              __deviceStateConf.set('epoch', Date.now());
              __deviceStateConf.save();
            }, 60*1000);

            __userEmail = __userConfig.get('email');
            var express = require('express');
            var favicon = require('serve-favicon');
            //var expressDevice = require('express-device');
            var app = express()
              , server = require('http').createServer(app)
              , io = require('socket.io').listen(server)

            //io.set('log level', 1);
            server.listen(80);

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

            var checkConfigurations = function (socket){
              //socket.emit('switchPage', 'welcomeScreen');
              if(!__userConfig.get('zigbeeNetworkName') || !__userConfig.get('zigbeeNetworkKey'))
                socket.emit('switchPage', 'welcomeScreen'); //socket.emit('switchPage', 'networkSetting');
              else if(!__userConfig.get('email') || !__userConfig.get('password'))
                socket.emit('switchPage', 'cloudSetting');
              else if(!__.keys(__remoteDevInfoConf.data).length)
                socket.emit('switchPage', 'configureModule');
            }
            io.sockets.on('connection', function (socket) {
              console.log('Socket connection established!!');
              socket.emit('showBurgerMenu');
              socket.on('checkConfigurations', __.bind(checkConfigurations,null, socket));
              if(__systemConfig.get('communicator') != 'tarang') 
                checkConfigurations(socket);
            });
            setInterval(function () {io.sockets.emit('sudoHeartbeat')}, 1000);


            var SocketCommandManager = require(__rootPath + '/classes/sockets/commandManager')
            var socComMngr = new SocketCommandManager({'localIo':io});

            var SocketRequestManager = require(__rootPath + '/classes/sockets/requestManager')
            var socReqMngr = new SocketRequestManager({'localIo':io});

            var SocketEditManager = require(__rootPath + '/classes/sockets/editManager')
            var socEdtMngr = new SocketEditManager({'localIo':io});
            
            var deviceManager = require(__rootPath + '/classes/devices/deviceManager');
            var restoreStateAttempts = 0;
            var restoreState = function () {
              require('dns').resolve('www.google.com', function(err) {
                if (err) return(++restoreStateAttempts && setTimeout(restoreState, ((restoreStateAttempts < 8)?30:120)*1000));
                var sys = require('sys');
                var exec = require('child_process').exec;
                var foo = function(error, stdout, stderr) {
                  console.log(error, stdout, stderr);
                  if((Date.now() - devStatConfAtBegn.epoch)/1000 < 15*60) deviceManager.restoreDeviceStatus(devStatConfAtBegn);
                }
                exec("sudo service syncSystemClock", foo);
              });
            }
            restoreState();
            //var roomModel = require(__rootPath+"/configs/managers/roomConfigManager");

            deviceManager.on('deviceStateChanged', function (devId, devConf, nodeType) {
              io.sockets.emit('roomConfigUpdated', groupConfig.getList())
              if(nodeType == 'load'){
                __deviceStateConf.data = deviceManager.getDeviceStateMap();
                __deviceStateConf.set('epoch', Date.now());
                __deviceStateConf.save();
              }
            });

            require(__rootPath + '/classes/sockets/initClientSocket')(function (err, cloudSocket) {
              cloudSocket.emit('roomConfigUpdated', groupConfig.getList())
              deviceManager.on('deviceStateChanged', function () {
                cloudSocket.emit('roomConfigUpdated', groupConfig.getList())
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




          }})

        }});
}});
