var __ = require("underscore");
var BaseClass = require(__rootPath+"/classes/baseClass");
var deviceManager = require(__rootPath+'/classes/devices/deviceManager');
var eventLogger = require(__rootPath+"/classes/eventLogger/logger");
var groupConfig = require(__rootPath+"/classes/configs/groupConfig");
var moodConfig = require(__rootPath+"/classes/configs/moodConfig");


var CommandManager = BaseClass.extend({
	init : function (obj) {
		__.bindAll(this, "onLocalConnection", "onCloudConnection", "onToggleSwitchCommand", 
			"onSetDutyCommand", "onModifyNetworkSecurityKey");
		this.localIo = obj.localIo;
		this.localIo.sockets.on('connection', this.onLocalConnection);
	},
	setCloudSocket	: 	function (cloudSocket) {
		this.cloudSocket = cloudSocket;
		this.cloudSocket.on('connect', this.onCloudConnection);
	},
	onCloudConnection : function () {
		if(this.cloudSocketConnectionDone) return;
		this.onCommonConnection(this.cloudSocket);
		this.cloudSocketConnectionDone = true;
	},
	onCommonConnection : function (socket) {
		socket.on('toggleSwitch', this.onToggleSwitchCommand);
		socket.on('setDuty', this.onSetDutyCommand);
		socket.on('groupOff', __.bind(this.groupOff, this));
	},
	onLocalConnection : function (socket) {
		this.onCommonConnection(socket);
		socket.on('modifyNetworkSecurityKey', __.bind(this.onModifyNetworkSecurityKey, this));
		socket.on('getNetworkSettings', __.bind(this.getNetworkSettings, this));
		socket.on('modifyCloudSettings', __.bind(this.modifyCloudSettings, this));
		socket.on('getCloudSettings', __.bind(this.getCloudSettings, this));
		socket.on('checkSerialCableConnection', __.bind(this.checkSerialCableConnection, this));
		socket.on('configureConnectedModule', __.bind(this.configureConnectedModule, this));
		socket.on('checkUpdates', __.bind(this.checkUpdates, this));
		socket.on('updateNow', __.bind(this.updateNow, this));
		socket.on('applyMood', __.bind(this.activateMood, this));

		console.log('Added Command Listners!!')
	},
	updateNow : function () {
		var sys = require('sys');
		var exec = require('child_process').exec;
		var foo = function(error, stdout, stderr) {
			console.log(error, stdout, stderr);
		}
//		exec("sudo service inoho restart", foo);	
		exec("sudo bash "+__rootPath+"/shellScripts/updateCron.sh", foo);	
		console.log('starting update now')
	},
	checkUpdates : function (commandData, callback) {
		require('dns').resolve('www.google.com', function(err) {
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
		deviceManager.communicator.configureModule(commandData.moduleName, __.bind(function (err, macAdd){
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
				var noDim=1, swCnt=5;
				var devInfo = {"name":commandData.moduleName, "loads":{"dimmer":noDim, "normal":swCnt}, "loadInfo":{},"deviceCode":"xxx"};
				for(var i=0; i<swCnt; i++) {
					devInfo.loadInfo[i] = {"type":"normal", "icon":"switch", "devId":macAdd, "name":"Device-"+(i+1)};
					if(i < noDim) devInfo.loadInfo[i].dimmable = true;
				}
				__remoteDevInfoConf.set(macAdd, devInfo);
				__remoteDevInfoConf.save();
				var maxId = parseInt(__.max(__.keys(groupConfig.data), function (id) {return parseInt(id);}));
				if(!maxId || maxId < 0) maxId = 0; 
				var group = {"name":commandData.moduleName, "controls":[]}
				for(var i=0; i<swCnt; i++) {
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
	getCloudSettings	: function (commandData, callback) {
		callback({'success':true, 'email':__userConfig.get('email')})
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
		var request = require('request');
		var thisObj = this;
		var createAccount = function (newEmail, newPassword, nwkKey) {
			console.log('recieved request to create account on cloud email-'+newEmail+' password-'+newPassword);
			request.post('http://cloud.inoho.com/register/', 
				{form: {name:newEmail, email:newEmail, password:newPassword, cnfpassword:newPassword, productId:nwkKey, donotredirect:true}}, 
				function (err, resp, body){
					console.log("got response from http://cloud.inoho.com/register/");
					console.log(err, resp.statusCode, body);
					if (!resp || err || resp.statusCode != 200) return callback({'success':false, 'msg':err});
					var rspJson = JSON.parse(body);
					if(!rspJson || rspJson.status != 'success') return callback({'success':false, 'msg':rspJson.msg});
					__userConfig.set('email', newEmail);__userConfig.set('password', newPassword);
					console.log("cleated new account on cloud for  "+newEmail);
					__userConfig.save(function (err) {
						if(err) return console.log(err);
						console.log('Cloud configuration success');
						callback({'success':true});
						thisObj.cloudSocket && thisObj.cloudSocket.socket.disconnect();
					});
				}
			);
		}
		deviceManager.communicator.getNetworkKey(function (nwkKey) {
			if (email && password) {
				request.post('http://cloud.inoho.com/deleteuser/', {form: {email:email, password:password, productId:nwkKey}}, 
					function (err, resp, body){
						if (!resp || err || resp.statusCode != 200) return callback({'success':false, 'msg':err});
						var rspJson = JSON.parse(body);
						if (rspJson && rspJson.msg) console.log(rspJson.code, rspJson.msg); 
						// 404 check if user dosen't exist then fine go ahead with account creation.
						if(!rspJson || rspJson.status != 'success' && rspJson.code != 404) return callback({'success':false, 'msg':rspJson.msg});
						__userConfig.set('email', '');__userConfig.set('password', '');
						console.log("removed "+email+' from cloud');
						createAccount(commandData.email, commandData.password, nwkKey)
						__userConfig.save(function (err) {err && console.log(err)});
					}
				);	 	
			}
			else 
				createAccount(commandData.email, commandData.password, nwkKey)
		});
	},
	getNetworkSettings	: function (commandData, callback) {
		callback({'success':true, 'name':__userConfig.get('zigbeeNetworkName')});
	},
	onModifyNetworkSecurityKey : function (commandData, callback) {
		//TODO consider network name as well
		deviceManager.communicator.updateNetworkKey(commandData.securityKey, __.bind(function (err, nwkId){
			if(err) {
				callback({'success':false, 'msg':err});
				return
			}
			__userConfig.set('zigbeeNetworkKey', commandData.securityKey);
			__userConfig.set('zigbeeNetworkName', nwkId);
			__userConfig.save(function (err) {
				if(err) console.log(err);
				console.log('Network key modification success');
				deviceManager.communicator.checkCommunication(function (err) {
					if(err) callback({'success':false, 'msg':err});
					else callback({'success':true});	
				})
				
			});	
		},this));
	},
	onSetDutyCommand : function (commandData) {
		console.log('setDuty called');
		var devId = commandData.devId, switchId = commandData.switchId, duty=commandData.duty;
		var device = deviceManager.getDevice(devId);
		if(!device) {
			console.log('device not found');
			return;
		}
		eventLogger.addEvent("setDuty", {
            'boardId':devId, 
            'pointId':devId+'-l'+switchId,
            'pointKey':switchId,
            'remoteDevice':commandData.deviceType, 
            'state':duty
        });
		device.setDimmer(switchId, duty)
		
	},
	onToggleSwitchCommand	: function (commandData) {
		var devId = commandData.devId, switchId = commandData.switchId;
		var device = deviceManager.getDevice(devId);
		if(!device) {
			console.log('device not found');
			return;
		}
		eventLogger.addEvent("toggleSwitch", {
	        'boardId':devId, 
	        'pointId':devId+'-l'+switchId,
	        'pointKey':switchId,
	        'remoteDevice':commandData.deviceType, 
	        'state':(commandData.state == 'off')?true:false // log new state
	    });
		device.toggleSwitch(switchId);
	
	},
	activateMood : function (commandData) {
	    var moodData = moodConfig.get(commandData.id+"");
	    if(!moodData || !moodData.controls || moodData.icon != commandData.icon)
	    	return console.log("invalid mood command from client");
		eventLogger.addEvent("activateMood", {
	        'moodId':commandData.id, 
	        'moodIcon':commandData.icon,
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
