var __ = require("underscore");
var BaseClass = require(__rootPath+"/classes/baseClass");
var deviceManager = require(__rootPath+'/classes/devices/deviceManager');
var eventLogger = require(__rootPath+"/classes/eventLogger/logger");
var groupConfig = require(__rootPath+"/classes/configs/groupConfig");


var CommandManager = BaseClass.extend({
	init : function (obj) {
		__.bindAll(this, "onLocalConnection", "onCloudConnection", "onLocalToggleSwitchCommand", 
			"onLocalSetDutyCommand", "onModifyNetworkSecurityKey");
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
		socket.on('toggleSwitch', this.onLocalToggleSwitchCommand);
		socket.on('setDuty', this.onLocalSetDutyCommand);		
	},
	onLocalConnection : function (socket) {
		this.onCommonConnection(socket);
		socket.on('modifyNetworkSecurityKey', __.bind(this.onModifyNetworkSecurityKey, this, socket));
		socket.on('checkSerialCableConnection', __.bind(this.checkSerialCableConnection, this));
		socket.on('configureConnectedModule', __.bind(this.configureConnectedModule, this));
		console.log('Added Command Listners!!')
	},
	configureConnectedModule : function (commandData, callback) {
		deviceManager.communicator.configureModule(commandData.moduleName, __.bind(function (err, macAdd){
			if(!err){
				var noDim=2, swCnt=5;
				__remoteDevInfoConf.set(macAdd+"", {"name":commandData.moduleName, "loads":{"dimmer":noDim, "normal":swCnt}, "deviceCode":"xxx"});
				__remoteDevInfoConf.save();
				var maxId = __.max(__.keys(groupConfig.data), function (id) {return parseInt(id);});
				if(maxId < 0) maxId = 0; 
				var group = {"name":commandData.moduleName, "controls":[]}
				for(var i=0; i<swCnt; i++) {
					group.controls.push({"id":i+1, "name":"Device-"+(i+1), "type":"normal", "icon":"bulb", "devId":macAdd, "switchID":i});
				}
				groupConfig.set(""+(maxId+1), group);
				groupConfig.save();
			}
			callback(err);
		}, this));
	},
	checkSerialCableConnection : function (commandData, callback) {
		deviceManager.communicator.checkSerialCable(function (err) {
			callback && callback((!err)?true:false);	
		});		
	},
	onModifyNetworkSecurityKey : function (socket, commandData) {
		deviceManager.communicator.updateNetworkKey(commandData.securityKey, __.bind(function (err, msg){
			if(err) {
				socket.emit('modifyNetworkSecurityKeyResponse', {'success':false, 'msg':err});
				return
			}
			__userConfig.set('zigbeeNetworkKey', commandData.securityKey);
			__userConfig.save(function (err) {
				if(err) console.log(err);
				console.log('Network key modification success');
				socket.emit('modifyNetworkSecurityKeyResponse', {'success':true});
			});	
		},this));
	},
	onLocalSetDutyCommand : function (commandData) {
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
	onLocalToggleSwitchCommand	: function (commandData) {
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
		console.log("@@@@@@@@@ switch toggelled by "+commandData.deviceType+" @@@@@@@@@@@");
	
	} 
});

module.exports = CommandManager;
