var __ = require("underscore");
var request = require('request');
var BaseClass = require(__rootPath+"/classes/baseClass");
var deviceManager = require(__rootPath+'/classes/devices/deviceManager');
var eventLogger = require(__rootPath+"/classes/eventLogger/logger");
var groupConfig = require(__rootPath+"/classes/configs/groupConfig");
var moodConfig = require(__rootPath+"/classes/configs/moodConfig");
var checkInternet = require(__rootPath+"/classes/utils/checkInternet");
var deviceInfoConfig = require(__rootPath+"/classes/configs/deviceInfoConfig");
var timerConfig = require(__rootPath+"/classes/configs/timerConfig");
var BasicConfigManager = require(__rootPath+"/classes/configs/basicConfigManager");

var CommandManager = BaseClass.extend({
	init : function (obj) {
		__.bindAll(this, "onLocalConnection", "onToggleSwitchCommand", 
			"onSetDutyCommand", "onModifyNetworkSecurityKey");
		this.localIo = obj.localIo;
		this.localIo.sockets.on('connection', this.onLocalConnection);
	},
	setCloudSocket	: 	function (cloudSocket) {
		this.cloudSocket = cloudSocket;
		this.setCommonEventListners(this.cloudSocket);
	},
	setCommonEventListners : function (socket) {
		socket.on('toggleSwitch', this.onToggleSwitchCommand);
		socket.on('setDuty', this.onSetDutyCommand);
		socket.on('moveCurtain', this.onMoveCurtainCommand);
		socket.on('groupOff', __.bind(this.groupOff, this));
		socket.on('updateNow', __.bind(this.updateNow, this));
		socket.on('restartHomeController', __.bind(this.restartHomeController, this));
		socket.on('startCloudLogs', __.bind(this.setLogOnCloud, this, true));
		socket.on('stopCloudLogs', __.bind(this.setLogOnCloud, this, false));
		socket.on('restoreNetwork', __.bind(this.restoreNetwork, this));
		socket.on('restartZigbee', __.bind(this.restartZigbee, this));
		socket.on('applyMood', __.bind(this.activateMood, this));
		socket.on('configureCloudTunnel', __.bind(this.configureCloudTunnel, this));
	},
	executeCommand : function (commandData) {
		switch(commandData.actionName) {
			case 'toggleSwitch' : this.onToggleSwitchCommand(commandData); break;
			case 'turnSwitchOn' : this.onSwitchCommand(commandData); break;
			case 'turnSwitchOff' : this.onSwitchCommand(commandData); break;
			case 'setDuty' 		: this.onSetDutyCommand(commandData); break;
			case 'moveCurtain'	: this.onMoveCurtainCommand(commandData); break;
		}
	},
	onLocalConnection : function (socket) {
		this.setCommonEventListners(socket);
		socket.on('modifyNetworkSecurityKey', __.bind(this.onModifyNetworkSecurityKey, this));
		socket.on('getNetworkSettings', __.bind(this.getNetworkSettings, this));
		socket.on('modifyCloudSettings', __.bind(this.modifyCloudSettings, this));
		socket.on('getThemeSettings', __.bind(this.getThemeSettings, this));
		socket.on('modifyThemeSettings', __.bind(this.modifyThemeSettings, this));
		socket.on('getCloudSettings', __.bind(this.getCloudSettings, this));
		socket.on('checkSerialCableConnection', __.bind(this.checkSerialCableConnection, this));
		socket.on('configureConnectedModule', __.bind(this.configureConnectedModule, this));
		socket.on('checkUpdates', __.bind(this.checkUpdates, this));
		socket.on('restoreFactory', __.bind(this.restoreFactory, this));

		console.log('Added Command Listners!!')
	},
	setLogOnCloud : function (flag) {
		__userConfig.set('logOnCloud', (flag === true));
		__userConfig.save(__.bind(this.restartHomeController, this));
	},
	restartHomeController : function() {
		console.log('restarting home controller');
		var exec = require('child_process').exec;
		exec("sudo service inoho restart");	
	},
	updateNow : function () {
		var sys = require('sys');
		var exec = require('child_process').exec;
		var foo = function(error, stdout, stderr) {
			console.log(error, stdout, stderr);
		}
//		exec("sudo service inoho restart", foo);	
		exec("sudo bash "+__rootPath+"/shellScripts/updateCron.sh > "+__rootPath+"/../logs/updateCron.log", foo);	
		console.log('starting update now')
	},
	configureCloudTunnel : function () {
		var exec = require('child_process').exec;
		var foo = function(error, stdout, stderr) {
			console.log(error, stdout, stderr);
		}
		exec("sudo bash "+__rootPath+"/shellScripts/createCloudAccount.sh > "+__rootPath+"/../logs/configureCloudTunnel.log", foo);	
		console.log('starting cloud tunnel configuration now')
	},
	changeCloudPassword : function (email, pwd, clbk) {
		var exec = require('child_process').exec;
		var foo = function(error, stdout, stderr) {
			console.log(error, stdout, stderr);
			var rspJson = JSON.parse(stdout);
			clbk && clbk(error||!rspJson.success, rspJson);
		}
		exec("sudo bash "+__rootPath+"/shellScripts/changeCloudPassword.sh "+email+" "+pwd, foo);	
		console.log('starting changeCloudPassword bash')
	},
	deleteCloudAccount : function (clbk) {
		var exec = require('child_process').exec;
		var foo = function(error, stdout, stderr) {
			console.log(error, stdout, stderr);
			var rspJson = JSON.parse(stdout);
			clbk && clbk(error||!rspJson.success, rspJson);
		}
		exec("sudo bash "+__rootPath+"/shellScripts/deleteCloudAccount.sh", foo);	
		console.log('starting deleteCloudAccount bash')
	},
	restoreFactory : function (callback) {
		var thisObj = this;
		console.log("--------- restoreFactory called ---------");
		checkInternet(function(err) {
			if (err) return callback({'success':false, 'msg':'Internet connection is down.'});
			deviceManager.communicator.getNetworkKey(function (err, nwkKey) {
				if(err) return callback({'success':false, 'msg':err});
				console.log("network key:", nwkKey)
				request.post(__cloudUrl+'/deleteuser/', {form: {email:__userConfig.get('email'), password:__userConfig.get('password'), productId:nwkKey}}, function (err, resp, body){
					if (!resp || err || resp.statusCode != 200) return callback({'success':false, 'msg':err});
					console.log("account deletion response came from cloud");
					var rspJson = JSON.parse(body);
					// 404 check if user dosen't exist then fine go ahead with account creation.
					if(!rspJson || rspJson.status != 'success' && rspJson.code != 404) return callback({'success':false, 'msg':rspJson.msg});
					console.log("cloud account deletion successful!");
					thisObj.deleteCloudAccount(function (err) {
						if(err) return callback({'success':false, 'msg':err});
						groupConfig.data='';
						groupConfig.save(function (err) {
							if(err) return callback({'success':false, 'msg':err});
							console.log("groupConfig reset");
							moodConfig.data='';
							moodConfig.save(function (err) {
								if(err) return callback({'success':false, 'msg':err});
								console.log("moodConfig reset");
								timerConfig.data='';
								timerConfig.save(function (err) {
									if(err) return callback({'success':false, 'msg':err});
									console.log("timerConfig reset");
									deviceInfoConfig.data='';
									deviceInfoConfig.save(function (err) {
										if(err) return callback({'success':false, 'msg':err});
										console.log("deviceInfoConfig reset");
										__userConfig.data='';
										__userConfig.save(function (err) {
											if(err) return callback({'success':false, 'msg':err});
											console.log("__userConfig reset");
											setTimeout(__.bind(thisObj.restartHomeController, thisObj), 1000)
											return callback({'success':true});
										});
									});
								});
							});
						});
					});
				});
			});
		});
	},
	checkUpdates : function (commandData, callback) {
		checkInternet(function(err) {
			if (err) console.log(err);
			if (err) return callback({'success':false, 'msg':'Internet connection is down.'})
			var sys = require('sys');
            var exec = require('child_process').exec;
            var foo = function(error, stdout, stderr) {
				console.log(error, stdout, stderr);
				if(error || !stdout) return callback({'success':false, 'msg':stderr});
				if(stdout.indexOf("No updates") + 1) return callback({'success':false, 'msg':stdout.substr(stdout.indexOf("No updates"))});
				if(stdout.indexOf("updates available") + 1) return callback({'success':true, 'msg':"Update available."});
				return callback({'success':false, 'msg':stdout});
            }
            exec("sudo bash "+__rootPath+"/shellScripts/checkUpdate.sh", foo);	
		});
	},
	configureConnectedModule : function (commandData, callback) {
		if(!commandData.moduleName)
			commandData.moduleName = 'Module-'+(1+__.keys(__remoteDevInfoConf.data).length);
		deviceManager.communicator.configureModule(commandData.moduleName, __.bind(function (err, macAdd, moduleType){
			if(!err){
				macAdd = macAdd+"";
				var groupIds = [];
				if(__remoteDevInfoConf.get(macAdd)) {
					for (key in groupConfig.data) { var grp = groupConfig.data[key];
						for (var i=0; i<grp.controls.length; i++)
							if(grp.controls[i].devId==macAdd){groupIds.push(key);break;}
					}
					if(groupIds.length) return callback(null, groupIds);	
				}
				switch(moduleType){
					case "SWBD01" : var noDim=2, swCnt=5, crtnCnt=0; break;
					case "SWBD02" : var noDim=1, swCnt=5, crtnCnt=0; break;	
					case "CNCR01" : var noDim=0, swCnt=1, crtnCnt=2; break;	
					default		  : var noDim=1, swCnt=5, crtnCnt=0;
				}
				var devInfo = {"name":commandData.moduleName, "loads":{"dimmer":noDim, "normal":swCnt, "curtain":crtnCnt}, "loadInfo":{},"deviceCode":"xxx", "category":moduleType};
				for(var i=0; i<swCnt; i++) {
					devInfo.loadInfo[i] = {"type":"normal", "icon":"switch", "devId":macAdd, "name":"Device-"+(i+1)};
					if(i < noDim) devInfo.loadInfo[i].dimmable = true;
				}
				for(var i=0; i<crtnCnt; i++) {
					devInfo.loadInfo[swCnt+i] = {"type":"curtain", "icon":"curtain", "devId":macAdd, "name":"Device-"+(swCnt+i+1)};
				}
				__remoteDevInfoConf.set(macAdd, devInfo);
				__remoteDevInfoConf.save();
				var maxId = parseInt(__.max(__.keys(groupConfig.data), function (id) {return parseInt(id);}));
				if(!maxId || maxId < 0) maxId = 0; 
				var group = {"name":commandData.moduleName, "controls":[]}
				for(var i=0; i<swCnt+crtnCnt; i++) {
					group.controls.push({"id":i+1, "devId":macAdd, "switchID":i});
				}
				groupConfig.set((++maxId)+"", group);
				groupIds.push(maxId);
				deviceManager.emit('deviceStateChanged');
				groupConfig.save();
				return callback(null, groupIds);
			}
			callback(err);
		}, this));
	},
	checkSerialCableConnection : function (commandData, callback) {
		deviceManager.communicator.checkSerialCable(function (err) {
			callback && callback((!err)?true:false);	
		});		
	},
	getThemeSettings	: function (commandData, callback) {
		callback({'success':true, 'data':{'appTheme' : __userConfig.get('appTheam'), 'appColor':__userConfig.get('appColor')}})
	},
	getCloudSettings	: function (commandData, callback) {
		callback({'success':true, 'email':__userConfig.get('email')})
	},
	modifyThemeSettings : function (commandData, callback) {
		__userConfig.set('appTheam', commandData.theam);
		__userConfig.set('appColor', commandData.color);
		__userConfig.set('homeView', commandData.homeView);
		__userConfig.save(function (err) {
			if(err) return console.log(err);
			console.log('App theam modification success');
			callback({'success':true});
		});
	},
	modifyCloudSettings : function (commandData, callback) {
		var email = __userConfig.get('email');
		var password = __userConfig.get('password');
		if (email == commandData.email && password == commandData.password) callback({'success':true});
		if(commandData.email == 'skip') {
			commandData.email = __userConfig.get('zigbeeNetworkName')+"@inoho.com";
			commandData.password = 'inoho123';
			__userConfig.set('email', commandData.email);
			__userConfig.set('password', commandData.password);
		}
		var thisObj = this;
		var createAccount = function (newEmail, newPassword, nwkKey, next) {
			console.log('recieved request to create account on cloud email-'+newEmail+' password-'+newPassword);
			checkInternet(function (err){
				if(!err) {
					request.post(__cloudUrl+'/register/', 
						{form: {name:newEmail, email:newEmail, password:newPassword, cnfpassword:newPassword, productId:nwkKey, donotredirect:true}}, 
						function (err, resp, body){
							//console.log(err, arguments);
							console.log("got response from "+__cloudUrl+"/register/");
							//console.log(err, resp.statusCode, body);
							if (!resp || err || resp.statusCode != 200) return callback({'success':false, 'msg':err});
							var rspJson = JSON.parse(body);
							if(!rspJson || rspJson.status != 'success') return callback({'success':false, 'msg':rspJson.msg});
							__userConfig.set('email', newEmail);__userConfig.set('password', newPassword);
							console.log("cleated new account on cloud for  "+newEmail);
							__userConfig.save(function (err) {
								if(err) return console.log(err);
								console.log('Cloud configuration success');
								callback({'success':true});
								next && next();
								thisObj.cloudSocket && thisObj.cloudSocket.socket.disconnect();
							});
						}
					);
				}
				else {
					__userConfig.set('email', newEmail);__userConfig.set('password', newPassword);
					__userConfig.save(function (err) {		
						if(err) return callback({'success':false, 'msg':err});
						callback({'success':true});
					});
				}
			});
		}
		deviceManager.communicator.getNetworkKey(function (err, nwkKey) {
			if(err) return callback({'success':false, 'msg':err});
			if (email && password) {
				checkInternet(function (err){
					if(!err){
						request.post(__cloudUrl+'/deleteuser/', {form: {email:email, password:password, productId:nwkKey}}, 
							function (err, resp, body){
								if (!resp || err || resp.statusCode != 200) return callback({'success':false, 'msg':err});
								var rspJson = JSON.parse(body);
								if (rspJson && rspJson.msg) console.log(rspJson.code, rspJson.msg); 
								// 404 check if user dosen't exist then fine go ahead with account creation.
								if(!rspJson || rspJson.status != 'success' && rspJson.code != 404) return callback({'success':false, 'msg':rspJson.msg});
								__userConfig.set('email', '');__userConfig.set('password', '');
								console.log("removed "+email+' from cloud');
								createAccount(commandData.email, commandData.password, nwkKey, function (){
									var sshTunnelConfig = new (BasicConfigManager.extend({file : '/../configs/sshTunnelConfig.json'}))({"callback":function (err) {
										if(err) sshTunnelConfig = null;
										if (sshTunnelConfig) {
											thisObj.changeCloudPassword(commandData.email, commandData.password)
										}
										else 
											thisObj.configureCloudTunnel()
									}});
								});
								__userConfig.save(function (err) {err && console.log(err)});	
							}
						);
					}
					else {
						return callback({'success':false, 'msg':'Internet connection is down.'});
					}
				});
			}
			else 
				createAccount(commandData.email, commandData.password, nwkKey)
		});
	},
	getNetworkSettings	: function (commandData, callback) {
		callback({'success':true, 'name':__userConfig.get('zigbeeNetworkName')});
	},
	restoreNetwork : function (commandData, callback) {
		console.log("---------- restoreNetwork called -------------");
		var nwkKey = commandData.key || __userConfig.get('zigbeeNetworkKey');
		var nwkName = commandData.name || __userConfig.get('zigbeeNetworkName');
		var nwkId = commandData.id || __userConfig.get('zigbeeNetworkId');
		deviceManager.communicator.restoreNetwork(nwkId, nwkName, nwkKey, function (err) {
			if(err) {
				console.log(err);
				return (callback && callback({'success':false, 'msg':err}));
			}
			callback && callback({'success':true})
			console.log("---------- restored network -------------");
		});
	},
	restartZigbee : function (commandData, callback) {
		__restartZigbeeModule(function (err) {
			if (err) return (callback && callback({'success':false, 'msg':err}));
			callback && callback({'success':true});
			setTimeout(__.bind(deviceManager.communicator.getNetworkKey, deviceManager.communicator), 5000);
		});
	},
	onModifyNetworkSecurityKey : function (commandData, callback) {
		//TODO consider network name as well
		deviceManager.communicator.updateNetworkKey(commandData.securityKey, __.bind(function (err, longNwkId){
			if(err) {
				callback({'success':false, 'msg':err});
				return
			}
			__userConfig.set('zigbeeNetworkKey', commandData.securityKey);
			__userConfig.set('zigbeeNetworkName', longNwkId);
			__userConfig.save(function (err) {
				if(err) console.log(err);
				console.log('Network key modification success');
				setTimeout(__.bind(function(){
					deviceManager.communicator.checkCommunication(function (err, key, sqrtyKey, nwkId) {
						if(err) console.log(err);
						if(err) __restartZigbeeModule(function (err) {
							if (err) callback({'success':false, 'msg':err});
							else deviceManager.communicator.checkCommunication(function (err, key, sqrtyKey, nwkId) {
								if (err) callback({'success':false, 'msg':err});
								else {
									callback({'success':true});	
									__userConfig.set('zigbeeNetworkId', nwkId);
									__userConfig.save();
								}
							});
						});
						else {
							callback({'success':true});	
							__userConfig.set('zigbeeNetworkId', nwkId);
							__userConfig.save();
						}
					})
				}, this), 3000); //3 seconds from module to restart
				
			});	
		},this));
	},
	onMoveCurtainCommand : function (commandData) {
		var devId = commandData.devId, switchId = commandData.switchId, direction=commandData.direction;
		var device = deviceManager.getDevice(devId);
		if(!device) 
			return console.log('device not found');
  // TODO event should get logged only after curtain action is fully performed.		
  //	  eventLogger.addEvent("setDuty", {
  //           'boardId':devId, 
  //           'pointId':devId+'-l'+switchId,
  //           'pointKey':switchId,
  //           'remoteDevice':commandData.deviceType, 
  //           'state':direction
  //      });
		device.moveCurtain(switchId, direction)
	},
	onSetDutyCommand : function (commandData) {
		console.log('setDuty called');
		var devId = commandData.devId, switchId = commandData.switchId, duty=commandData.duty;
		var device = deviceManager.getDevice(devId);
		if(!device) 
			return console.log('device not found');
		eventLogger.addEvent("setDuty", {
            'boardId':devId, 
            'pointId':devId+'-l'+switchId,
            'pointKey':switchId,
            'remoteDevice':commandData.deviceType, 
            'state':duty
        });
		device.setDimmer(switchId, duty)
		
	},
	onToggleSwitchCommand	: function (commandData, callback) {
		return this.onSwitchCommand(commandData, callback);
	},
	onSwitchCommand : function(commandData, callback) {
		callback && callback();
		var devId = commandData.devId, switchId = commandData.switchId;
		var device = deviceManager.getDevice(devId);
		if(!device) {
			console.log('device not found');
			return;
		}
		eventLogger.addEvent(commandData.actionName, {
	        'boardId':devId, 
	        'pointId':devId+'-l'+switchId,
	        'pointKey':switchId,
	        'remoteDevice':commandData.deviceType, 
//	        'state':(commandData.state == 'off')?true:false // log new state
	    });
	    switch(commandData.actionName) {
			case 'toggleSwitch' : device.toggleSwitch(switchId); break;
			case 'turnSwitchOn' : device.setSwitchState(switchId, true); break;
			case 'turnSwitchOff': device.setSwitchState(switchId, false); break;
		}
	},
	activateMood : function (commandData) {
	    var moodData = moodConfig.get(commandData.id+"");
	    if(!moodData || !moodData.controls)
	    	return console.log("invalid mood command from client");
		eventLogger.addEvent("activateMood", {
	        'moodId':commandData.id, 
	        'moodIcon':moodData.icon,
	        'remoteDevice':commandData.deviceType 
	    });
	    var conf = {};
	    __.each(__.groupBy(moodData.controls, function(ctl){ return ctl.devId;}), function (controls, devId) {
	    	var state = {};
	    	__.each(controls, function (ctl) {state[""+ctl.switchId]=(ctl.state=='on')?true:false}); //in case of dimmer state will be number fom 0 to 255
	    	conf[devId]=state;
	    });
	    deviceManager.applyConfig(conf);
	},
	groupOff : function (commandData) {
		var groupData = groupConfig.get(commandData.id+"");
		if(!groupData || !groupData.controls)
	    	return console.log("invalid group off command from client");
	    eventLogger.addEvent("groupOff", {
	        'groupId':commandData.id, 
	        'remoteDevice':commandData.deviceType
	    });
	    var conf = {};
	    __.each(__.groupBy(groupData.controls, function(ctl){ return ctl.devId;}), function (controls, devId) {
	    	var state = {};
	    	__.each(controls, function (ctl) {state[""+ctl.switchID]=false});
	    	conf[devId]=state;
	    });
	    deviceManager.applyConfig(conf);

	}
});

module.exports = CommandManager;
