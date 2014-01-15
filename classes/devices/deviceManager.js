var __ = require("underscore");
var BaseClass = require(__rootPath+"/classes/baseClass");
var BaseDevice = require(__rootPath+"/classes/devices/baseDevice");
var SwitchBoardV1 = require(__rootPath+"/classes/devices/switchBoards/switchBoardV1");

var DeviceManager = BaseClass.extend({
	communicator : null,
	_deviceMap : {},
	init : function (communicator) {
		this.communicator = communicator;
		this.communicator.on('newDeviceFound', __.bind(this._onNewDeviceFound, this));
		this.communicator.on('msgRecieved', __.bind(this._onMsgRecieved, this));
		__.each(this.communicator.getDeviceIds(), __.bind(this._onNewDeviceFound, this));
	},
	_registrationCheck : {},
	_onNewDeviceFound : function (deviceId) {
		if(!this._registrationCheck[deviceId]) { 
 			this._registrationCheck[deviceId] = __.throttle(__.bind(function(){
				if (!this._deviceMap[deviceId]) {
					this.sendQuery(deviceId, "GTDVTP"); //Get Device Type
					console.log('#### Registration of device:'+deviceId+" not found retrying now");
					this._onNewDeviceFound(deviceId);
				}
			}, this), 2000);
			this.sendQuery(deviceId, "GTDVTP"); //Get Device Type
			setTimeout(__.bind(this._registrationCheck[deviceId], this), 2000);
		}
		else
			this._registrationCheck[deviceId]();
	},
	_buildQuery : function (qryStr) {
		return qryStr+"\x0d\x0a";
	},
	sendQuery : function (deviceId, query, callback) {
		this.communicator.sendQuery(deviceId, this._buildQuery(query), function (err, result) {
				console.log("#### query sent to "+deviceId+":"+query);
				callback && callback(err, result);
		});
	},
	_onMsgRecieved : function (msg, deviceId) {
		if(msg.substr(msg.length-2,2) == '\x0d\x0a') msg = msg.substr(0,msg.length-2);
		if(msg.substr(0,4) == "DVTP") this._registerNewDevice (msg.substr(4), deviceId);
		else if (this._deviceMap[deviceId]) this._deviceMap[deviceId].emit('msgRecieved', msg); // its device's job to handel its own msg
		else {
			// message from unregistered device
			console.log("#### Msg:"+msg+" from Unregistered Device:"+deviceId);
			this._onNewDeviceFound(deviceId);
		}
	},
	_registerNewDevice : function (type, deviceId) {
		switch (type) {
			case "SWITCHBOARDV1" : var device = new SwitchBoardV1 (deviceId, this); break;
			default : var device = new BaseDevice(deviceId, this); break;
		}
		this._deviceMap[deviceId] = device;
		console.log("#### Registered Device:" +deviceId+" of type:"+type);
		device.on('stateChanged', __.bind(function (device) {
			this.emit('deviceStateChanged', device.id, device.getConfig());
		}, this, device));

		this.emit('newDeviceFound', deviceId, device.getConfig());
	},
	getConfig : function (deviceId) {
		if (this._deviceMap[deviceId])
			return this._deviceMap[deviceId].getConfig();
	},
	applyConfig : function (config) {
		__.each(__.keys(config), function (deviceId) {
			var device = this._deviceMap[deviceId];
			if (!device) return;
			device.applyConfig(config[deviceId]);
		}, this);
	}
});

var TarangController = require(__rootPath+'/classes/communicators/tarang');
var communicator = new TarangController;
if(typeof deviceManager == 'undefined') 
	deviceManager = new DeviceManager(communicator);
module.exports = deviceManager;
