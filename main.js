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
      if(err){ 
        console.log(err);
        return calback && calback(err);
      }
      setTimeout(function () {
            fs.writeFile('/sys/class/gpio/gpio13/value',1, function(err) {
              if(err)console.log(err);
              console.log(" ----------------- Restarted Zigbee Module ----------------- ");
              calback && setTimeout(__.bind(calback, null, err), 1500)
            });
      }, 3000);
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

var findIpAddress = require(__rootPath+"/classes/utils/checkInternet").findIpAddress;
__piIpAddr = findIpAddress();
var BasicConfigManager = require(__rootPath+"/classes/configs/basicConfigManager");
var SystemConfigMngr = BasicConfigManager.extend({file : '/../configs/systemConfig.json'});
__systemConfig = new SystemConfigMngr({'callback':function(err){
        var groupConfig = require(__rootPath+"/classes/configs/groupConfig");
        var moodConfig = require(__rootPath+"/classes/configs/moodConfig");
        var ipCamaraConfig = require(__rootPath+"/classes/configs/ipCamaraConfig");
        __remoteDevInfoConf = require(__rootPath+"/classes/configs/deviceInfoConfig");
        var irRemoteConfig = require(__rootPath+"/classes/configs/irRemoteConfig");

        var UsrCnfMngr = BasicConfigManager.extend({file : '/../configs/userConfig.json'});
        __userConfig = new UsrCnfMngr({'callback':function (err) {
          var SocketManager = require(__rootPath + '/classes/sockets/socketManager')

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
              , io = require('socket.io').listen(server)
              , sm = new SocketManager({'io':io});//, 'nameSpace':'/'+__userConfig.get('zigbeeNetworkName')});
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
            server.listen(__systemConfig.get('port') || 80);
            if(!__systemConfig.get('port')) {
              var createPortProxy = require(__rootPath+"/classes/utils/portProxy");
              createPortProxy(8080, 80)
            }

            app.set('view engine', 'ejs');
            app.set('view cache', true);
            app.use(function(req, res, next) {
              req.url =  req.url.replace(/^\/static\/[0-9a-f]{7}(.*)/, "/static$1");
              next();
            });
            app.use(favicon(__rootPath + '/static/images/favicon.ico'));
            //app.use('/favicon', express.static(__rootPath + '/static/images', {maxAge:86400}));
            app.use('/static/images', express.static(__rootPath + '/static/images', {maxAge:86400}));
            app.use('/static', express.static(__rootPath + '/static'));
            //app.use(expressDevice.capture());
            app.use(function(err, req, res, next){
              console.error(err.stack);
              res.send(500, 'Something broke!');
            });

            var deviceManager = require(__rootPath + '/classes/devices/deviceManager');
            deviceManager.wifiCommunicator.setServer(app);
            var restoreStateAttempts = 0;
            var checkInternet = require(__rootPath+"/classes/utils/checkInternet").checkInternet;
            var checkRTC = require(__rootPath+"/classes/utils/checkInternet").checkRTC;
            var restoreState = function () {
              var avdRestTm = __userConfig.get('restoreWithInMins');
              avdRestTm = parseInt(avdRestTm || 15); //15 min
              if((Date.now() - devStatConfAtBegn.epoch)/1000 < avdRestTm*60) {
                console.log('restoring device states');
                deviceManager.restoreDeviceStatus(devStatConfAtBegn);
              }
            }
            checkRTC(function(err) {
              var stateRestored = false;
              if(!err) {stateRestored = true;restoreState();}
              var syncTimeAttempt = 0;
              var syncTime = function() {
                checkInternet(function(err) {
                  if (err) return(++syncTimeAttempt && setTimeout(syncTime, ((syncTimeAttempt < 8)?30:120)*1000));
                  var syncSystemClock = require(__rootPath+"/classes/utils/checkInternet").syncSystemClock;
                  syncSystemClock(function(err){if(!stateRestored)restoreState();});
                });  
              }
              syncTime();              
            });

            //var roomModel = require(__rootPath+"/configs/managers/roomConfigManager");

            sm.initilizeSubManagers();
            var socComMngr = sm.socComMngr;
            sm.subscribeConfigEvents();
            sm.initCloudSocket();

            deviceManager.on('deviceStateChanged', function (devId, devConf, nodeType, switchIds) {
              if(nodeType == 'sensor') {
                //  console.log('########## deviceStateChanged ', devId, nodeType, switchIds, devConf, devConf[devId].sensor['1']);
                  __.each(switchIds, function(swId) {
                    var senInfo = __remoteDevInfoConf.getSensorInfo(devId, swId);
                    eventLogger.addEvent("sensorStateChanged", {  
                      'boardId':devId, 'id':senInfo.id, name:senInfo.name, state:devConf[devId].sensor[swId].state
                    });  
                  });
              }
              if(nodeType != 'sensor') {
                console.log('########## deviceStateChanged ', devId, nodeType, switchIds);
                if(!devId && !nodeType) return; //in case of groupModified need to publish status of all the groups
                var groupIds = groupConfig.getGroupsHavingDevice(devId, switchIds);
                console.log(groupIds);
                groupConfig.publishGroupConfig(groupIds);
                __remoteDevInfoConf.publishDeviceConfig(devId);
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

            var coordinator = require(__rootPath+"/classes/coordinator");
            // coordinates between sensors, virtual devices, timers etc.
            console.log("main.js ran");

            var eventLogger = require(__rootPath+"/classes/eventLogger/logger");
            eventLogger.addEvent("homeControllerStarted");

            process.on('uncaughtException', function (err) {
                console.log( "UNCAUGHT EXCEPTION " );
                console.log( "[Inside 'uncaughtException' event] " + err.stack || err.message, err );
            });

            var websiteRoutes = require(__rootPath + '/routes/website');
            var ajaxRoutes = require(__rootPath + '/routes/ajax');
            websiteRoutes(app, socComMngr);
            ajaxRoutes(app, socComMngr);
            if(__systemConfig.get('iRSupported')) {
              var zmoteRoute = require(__rootPath + '/partners/zmote/app/routes/irp.server.routes');
              zmoteRoute(app);
            }
            try {
              var fs = require('fs'),path = require('path');
              var getDirectories = function (srcpath) {
                return fs.readdirSync(srcpath).filter(function(file) {
                  return fs.statSync(path.join(srcpath, file)).isDirectory();
                });
              }
              var directories = getDirectories(__rootPath + '/../whiteLabeledApps');
              __.each(directories, function(directory) {
                var thirdPartyMain = require(__rootPath + '/../whiteLabeledApps/' + directory + "/main");  
                thirdPartyMain(app);
              });
            }
            catch (err) {console.log(err.message)}
            if(__systemConfig.get('ipCamaraSupported')){
              var cameraRoutes = require(__rootPath + '/routes/cam');
              cameraRoutes(app, socComMngr)
            }

            var apiV1 = require(__rootPath + '/routes/apiV1');
            apiV1(app, socComMngr);



          }})

        }});
}});
