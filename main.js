var __ = require("underscore");
__cloudUrl = 'http://cloud.inoho.com';
__rootPath = __dirname;
var dateFormat = require(__rootPath+"/classes/utils/dateFormater");
Date.prototype.format = function (mask, utc) {
  return dateFormat(this, mask, utc);
};
var request = require('request');
var originalConsoleLog = console.log;
var noLogs = false;
console.log = function () {
  var d=new Date();
  var ds = d.format('logTime'); //d.getHours()+':'+d.getMinutes()+'.'+d.getSeconds()+'-'+d.getMilliseconds();
  var mainArguments = [ds].concat(Array.prototype.slice.call(arguments));
  return originalConsoleLog.apply(console, mainArguments);
};
var logString = '', pushLogtimer=null;
var pushLogsToCloud = function() {
    if (pushLogtimer) clearTimeout(pushLogtimer);
    pushLogtimer = setTimeout(pushLogsToCloud, 5000);
    if(!logString) return;
    originalConsoleLog('---- logging on to cloud -----');
    request({url: __cloudUrl+'/clientlog', method: "POST", json:true, headers: {"content-type": "application/json",},
              body: JSON.stringify({username: __userConfig.get('email'), "data":logString})
            }, function (err, resp, body){originalConsoleLog(body);}
    );
    logString = '';
}
var logOnCloud = function () {
  var d=new Date();
  var ds = d.format('logTime'); //d.getHours()+':'+d.getMinutes()+'.'+d.getSeconds()+'-'+d.getMilliseconds();
  var mainArguments = [ds].concat(Array.prototype.slice.call(arguments));
  (!noLogs) && originalConsoleLog.apply(console, mainArguments);
  var newLine = (mainArguments).join(' ');
  if(logString.length + newLine.length > 800) pushLogsToCloud();
  logString += ((logString)?'\n':'')+newLine; 
}


var fs = require('fs');

__.each(process.argv, function (argmnt) {
  if(argmnt == 'noLogs') noLogs = true;
});
if(noLogs) {
  console.log = function () {};
}
var on=1;
fs.exists('/sys/class/gpio/gpio13', function (exist) {
  if(exist) fs.writeFile('/sys/class/gpio/unexport',13, function (err) { if(err) return console.log();})
  __.defer(function () {
      fs.writeFile('/sys/class/gpio/export',13, function (err) { if(err) return console.log();
        console.log('Opened gpio 13');
        fs.writeFile('/sys/class/gpio/gpio13/direction','out', function(err) { if(err) return console.log(err);
          console.log('Direction gpio 13 was set');
          fs.writeFile('/sys/class/gpio/gpio13/value',on, function(err) {if(err)console.log(err);
            console.log('Started Zigbee module reset control.');
//            setInterval(function () {on = (on + 1) % 2;fs.writeFile('/sys/class/gpio/gpio18/value',on);}, 800);
          });  
        });  
      });
  });
});
__restartZigbeeModule = function (calback) {
  console.log(" ----------------- Restarting Zigbee Module ----------------- ");
  fs.writeFile('/sys/class/gpio/gpio13/value',0, function(err) {
      if(err) return calback && calback(err);
      setTimeout(function () {
            fs.writeFile('/sys/class/gpio/gpio13/value',1, function(err) {
              if(err)console.log(err);
              calback && setTimeout(__.bind(calback, null, err), 1500)
            });
      }, 300);
  });
};
//setTimeout(__restartZigbeeModule, 20000);

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

var BasicConfigManager = require(__rootPath+"/classes/configs/basicConfigManager");
var SystemConfigMngr = BasicConfigManager.extend({file : '/../configs/systemConfig.json'});
__systemConfig = new SystemConfigMngr({'callback':function(err){
        var groupConfig = require(__rootPath+"/classes/configs/groupConfig");
        var moodConfig = require(__rootPath+"/classes/configs/moodConfig");
        __remoteDevInfoConf = require(__rootPath+"/classes/configs/deviceInfoConfig");

        var UsrCnfMngr = BasicConfigManager.extend({file : '/../configs/userConfig.json'});
        __userConfig = new UsrCnfMngr({'callback':function (err) {

          if(__userConfig.get('logOnCloud') === true) console.log = logOnCloud;

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
              , io = require('socket.io').listen(server);
/*            io.set("transports", [
                'websocket'
              , 'flashsocket'
              , 'htmlfile'
              , 'xhr-polling'
              , 'jsonp-polling'
              , 'polling'
            ]);
*/
            //io.set('log level', 1);
//             try{
// //              var auth = require(__rootPath+"/classes/auth/server");
//               var auth = require(__rootPath+"/classes/auth/jwt");
//             }
//             catch(err){console.log("Error while starting auth server -----", err);}
            server.listen(80);

            app.set('view engine', 'ejs');
            app.use(favicon(__rootPath + '/static/images/favicon.ico'));
            //app.use('/favicon', express.static(__rootPath + '/static/images', {maxAge:86400}));
            app.use('/static/images', express.static(__rootPath + '/static/images', {maxAge:86400}));
            app.use('/static', express.static(__rootPath + '/static'));
            //app.use(expressDevice.capture());
            app.use(function(err, req, res, next){
              console.error(err.stack);
              res.send(500, 'Something broke!');
            });


            var checkConfigurations = function (socket){
//              socket.emit('switchPage', 'welcomeScreen');
//              return;
              if(!__userConfig.get('zigbeeNetworkName') || !__userConfig.get('zigbeeNetworkKey'))
                socket.emit('switchPage', 'welcomeScreen'); //socket.emit('switchPage', 'networkSetting');
              else if(!__userConfig.get('email') || !__userConfig.get('password'))
                socket.emit('switchPage', 'cloudSetting');
              else if(!__.keys(__remoteDevInfoConf.data).length)
                socket.emit('switchPage', 'configureModule');
              else
                socket.emit('switchPage', 'mainPage');
            }
            io.sockets.on('connection', function (socket) {
              console.log('Socket connection established!!');
              // socket.emit('showBurgerMenu'); // not required any more
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
            
            var FileReader = require(__rootPath + '/classes/sockets/fileReader')
            var fileReader = new FileReader({'localIo':io});

            var deviceManager = require(__rootPath + '/classes/devices/deviceManager');
            var restoreStateAttempts = 0;
            var checkInternet = require(__rootPath+"/classes/utils/checkInternet");
            var restoreState = function () {
              checkInternet(function(err) {
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
            var theCloudSocket = null
            var publishGroupConfig = function (groupIds) {
              (!groupIds || !groupIds.length) && (groupIds = __.keys(groupConfig.data));
              __.each(groupIds, function (id, i) {
                __.defer(function (idd) {
                  var conf = groupConfig.getGroupDetails(idd);
                  io.sockets.emit('roomConfigUpdated', conf);
                  __.defer(function (conff) {theCloudSocket && theCloudSocket.emit('roomConfigUpdated', conff);}, conf);
                }, id);
              });
            };

            groupConfig.on('groupDeleteStart', function (groupId) {
              io.sockets.emit('deleteGroup', groupId);
              theCloudSocket && theCloudSocket.emit('deleteGroup', groupId);
            });
            
            deviceManager.on('deviceStateChanged', function (devId, devConf, nodeType, switchIds) {
              if(nodeType != 'sensor') {
                console.log('########## deviceStateChanged ', devId, nodeType, switchIds);
                var groupIds = groupConfig.getGroupsHavingDevice(devId, switchIds);
                console.log(groupIds);
                publishGroupConfig(groupIds);
              }
              if(nodeType == 'load'){
                __deviceStateConf.data = deviceManager.getDeviceStateMap();
                __deviceStateConf.set('epoch', Date.now());
                __deviceStateConf.save();
              }
            });
            deviceManager.communicator.on("publishingNetworkKey", function (name, key, id) {
              if(!__remoteDevInfoConf.getList().length || name == '0B0B0B0B0B0B0B0B') return;
              var fileName = __rootPath+'/../logs/network.log', str ;
              var logString = "Id:"+ id + " Name:"+name+" Key:"+key, logStrWtDt = logString+" Date:"+ (new Date()).format('log')+'\n';
              fs.exists(fileName, function(exists) {
                if(!exists) return fs.writeFile(fileName, logStrWtDt, function (err) {if(err) console.log(err)});
                fs.readFile(fileName, "utf8", function(err, data) {
                  if(err) return console.log(err);
                  data = data.split('\n');
                  while(data.length) {
                    if (!(str = data.pop())) continue;
                    if(str.indexOf(logString) != -1) return;
                    break;
                  }
                  fs.appendFile(fileName, logStrWtDt, function (err) {if(err) console.log(err)});
                });
              });
              
            })

            moodConfig.on('moodDeleteStart', function (moodId) {
              io.sockets.emit('deleteMood', moodId);
              theCloudSocket && theCloudSocket.emit('deleteMood', moodId);
            });

            moodConfig.on('moodConfigChanged', function (moodId) {
              var list=moodId?[moodConfig.getMoodDetails(moodId)]:moodConfig.getList()
              __.each(list, function (info) {
                io.sockets.emit('moodConfigUpdate', info);
              });
//              io.sockets.emit('moodConfigUpdate', moodConfig.getList());
            });  

            require(__rootPath + '/classes/sockets/initClientSocket')(function (err, cloudSocket) {
              theCloudSocket = cloudSocket;
              publishGroupConfig();
              socComMngr.setCloudSocket(cloudSocket);
              socReqMngr.setCloudSocket(cloudSocket);
              fileReader.setCloudSocket(cloudSocket);
              socEdtMngr.setCloudSocket(cloudSocket);
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

            var websiteRoutes = require(__rootPath + '/routes/website');
            var ajaxRoutes = require(__rootPath + '/routes/ajax');
            websiteRoutes(app, socComMngr);
            ajaxRoutes(app, socComMngr);



          }})

        }});
}});
