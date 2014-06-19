var __ = require("underscore");
var BaseClass = require(__rootPath+"/classes/baseClass");
var deviceManager = require(__rootPath+'/classes/devices/deviceManager');
var eventLogger = require(__rootPath+"/classes/eventLogger/logger");

var CommandManager = BaseClass.extend({
	init : function (obj) {
		__.bindAll(this, "onLocalConnection", "onCloudConnection", "onLocalToggleSwitchCommand", "onLocalSetDutyCommand");
		this.localIo = obj.localIo;
		this.localIo.sockets.on('connection', this.onLocalConnection);
	},
	setCloudSocket	: 	function (cloudSocket) {
		this.cloudSocket = cloudSocket;
		this.cloudSocket.on('connect', this.onCloudConnection);
	},
	onCloudConnection : function () {
		if(this.cloudSocketConnectionDone) return;
		this.onLocalConnection(this.cloudSocket);
		this.cloudSocketConnectionDone = true;
	},
	onLocalConnection : function (socket) {
		socket.on('toggleSwitch', this.onLocalToggleSwitchCommand);
		socket.on('setDuty', this.onLocalSetDutyCommand);
		console.log('Added Command Listners!!')
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
		console.log('toggleSwitch called');
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
	} 
});

module.exports = CommandManager;
