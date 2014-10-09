var __ = require("underscore");
var BaseClass = require(__rootPath+"/classes/baseClass");
var BaseDevice = require(__rootPath+"/classes/devices/baseDevice");
var SwitchBoardV1 = require(__rootPath+"/classes/devices/switchBoards/switchBoardV1");
var SwitchBoardV2 = require(__rootPath+"/classes/devices/switchBoards/switchBoardV2");
var SwBd01 = require(__rootPath+"/classes/devices/switchBoards/swBd01");
var DeviceManager = BaseClass.extend({
	communicator : null,
	_deviceMap : {},
	_virtualNodes : {},
	init : function (communicator) {
		this.communicator = communicator;
		this.communicator.on('newDeviceFound', __.bind(this._onNewDeviceFound, this));
		this.communicator.on('msgRecieved', __.bind(this._onMsgRecieved, this));
		__.each(this.communicator.getDeviceIds(), __.bind(this._onNewDeviceFound, this));
	},
	restoreDeviceStatus : function (stateMap) {
		this._virtualNodesOldState = stateMap;
		__.each(this._virtualNodes, function (node, id) {
			__.has(this._virtualNodesOldState, id) && node.setState(this._virtualNodesOldState[id]);
		}, this);
	},
	getDeviceNodes	: function (nodeIds) {
		return __.pick(this._virtualNodes, nodeIds);
	}, 
	getDeviceStateMap : function () {
		var stateMap = {};
		__.each(this._virtualNodes, function (node, id) {stateMap[id] = node.state}, this);
		return stateMap;
	},
	_registrationCheck : {},
	_onNewDeviceFound : function (deviceId, count) {
		if(this._deviceMap[deviceId] || typeof this._deviceMap[deviceId] != 'undefined' && !count) return;
		this._deviceMap[deviceId]=false;
		if(typeof count=='undefined') count=0;
		if (count > 5) {
			console.log('#### Registration of device:'+deviceId+" failed afret "+count+" tries");
//			this._deviceMap[deviceId]=true;
			return;
		}
		if(!this._registrationCheck[deviceId]) { 
 			this._registrationCheck[deviceId] = __.throttle(__.bind(function(cnt){
				if (!this._deviceMap[deviceId]) {
					this.sendQuery(deviceId, {name:"GTDVTP"}); //Get Device Type
					console.log('#### Registration of device:'+deviceId+" not found retrying now-"+cnt);
					this._onNewDeviceFound(deviceId, cnt);
				}
			}, this), 5000);
			this.sendQuery(deviceId, {name:"GTDVTP"}); //Get Device Type
			setTimeout(__.bind(this._registrationCheck[deviceId], this, count+1), 2000);
		}
		else
			this._registrationCheck[deviceId](count+1);
	},
	sendQuery : function (deviceId, queryObj, callback) {
		this.communicator.sendQuery(deviceId, queryObj, function (err, result, query) {
				console.log("#### query sent to "+deviceId+":"+query);
				callback && callback(err, result);
		});
	},
	_onMsgRecieved : function (type, msg, deviceId) {
		if(type == "DVTP") this._registerNewDevice (msg, deviceId);
		else if (this._deviceMap[deviceId]) this._deviceMap[deviceId].emit('msgRecieved', type, msg); // its device's job to handel its own msg
		else {
			// message from unregistered device
			console.log("#### Msg:"+msg+" from Unregistered Device:"+deviceId);
			this._onNewDeviceFound(deviceId);
		}
	},
	_registerNewDevice : function (type, deviceId) {
		if(this._deviceMap[deviceId]) return;
		switch (type) {
			case "SWITCHBOARDV1" : var device = new SwitchBoardV1 (deviceId, this); break;
			case "SWITCHBOARDV2" : var device = new SwitchBoardV2 (deviceId, this); break;
			case "SWBD01"		 : var device = new SwBd01 (deviceId, this); break;
			default : var device = new BaseDevice(deviceId, this); break;
		}
		console.log("#### Registered Device:" +deviceId+" of type:"+type);
		device.on('stateChanged', __.bind(function (device, nodeType, changebits) {
			this.emit('deviceStateChanged', device.id, device.getConfig(), nodeType);
		}, this, device));
		this._deviceMap[deviceId] = device;
		__.extend(this._virtualNodes, device.virtualNodes);
		if(this._virtualNodesOldState ) __.each(device.virtualNodes, function (node, id) {
				__.has(this._virtualNodesOldState, id) && node.setState(this._virtualNodesOldState[id]);
			}, this)
		this.emit('newNodesFound', device.virtualNodes);
		
		// device.getConfig();
		// this.emit('newDeviceFound', deviceId);
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
	},
	getDevice : function (deviceId) {
		return this._deviceMap[deviceId];
	}
});

var TarangController = require(__rootPath+'/classes/communicators/tarang');
var Cc2530Controller = require(__rootPath+'/classes/communicators/cc2530');

if(__systemConfig.get('communicator') == 'tarang'){
	var communicator = new TarangController;
	console.log('communicator is tarang');
}
else {
	var communicator = new Cc2530Controller;
	console.log('communicator is cc2530', __systemConfig.get('communicator'));
}

if(typeof deviceManager == 'undefined') 
	deviceManager = new DeviceManager(communicator);
module.exports = deviceManager;
