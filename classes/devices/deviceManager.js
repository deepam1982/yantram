var __ = require("underscore");
var BaseClass = require(__rootPath+"/classes/baseClass");
var BaseDevice = require(__rootPath+"/classes/devices/baseDevice");
var SwBd01 = require(__rootPath+"/classes/devices/switchBoards/swBd01");
var SwBd02 = require(__rootPath+"/classes/devices/switchBoards/swBd02");
var CrtnCtrl01 = require(__rootPath+"/classes/devices/curtainControllers/crtnCtrl01");
var DmBd05 = require(__rootPath+"/classes/devices/switchBoards/dmBd05");
var DmBd03 = require(__rootPath+"/classes/devices/switchBoards/dmBd03");
var IRBLR1 = require(__rootPath+"/classes/devices/irBlasters/baseIrBlaster");
var IRWIFI01 = require(__rootPath+"/classes/devices/irBlasters/irWifi01");
var ZMOTE01 = require(__rootPath+"/classes/devices/irBlasters/zmote01");
var deviceInfoConfig = require(__rootPath+"/classes/configs/deviceInfoConfig");
var DeviceManager = BaseClass.extend({
	communicator : null,
	_deviceMap : {},
	_virtualNodes : {},
	init : function (communicator, wifiCommunicator) {
		this.communicator = communicator;
		this.communicator.on('newDeviceFound', __.bind(this._onNewDeviceFound, this));
		this.communicator.on('msgRecieved', __.bind(this._onMsgRecieved, this));
		this.communicator.on('deviceReachable', __.bind(this._updateDeviceRechability, this, true));
		this.communicator.on('deviceUnreachable', __.bind(this._updateDeviceRechability, this, false));
		__.each(this.communicator.getDeviceIds(), __.bind(this._onNewDeviceFound, this));
		this.wifiCommunicator = wifiCommunicator;
		this.wifiCommunicator.on('newDeviceFound', __.bind(this._onNewDeviceFound, this));
		this.wifiCommunicator.on('msgRecieved', __.bind(this._onMsgRecieved, this));
		this.wifiCommunicator.on('deviceReachable', __.bind(this._updateDeviceRechability, this, true));
		this.wifiCommunicator.on('deviceUnreachable', __.bind(this._updateDeviceRechability, this, false));
	},
	_updateDeviceRechability : function  (reachable, deviceId) {
		console.log("_updateDeviceRechability", reachable);
		this._deviceMap[deviceId].reachable = reachable;
		this.emit('deviceStateChanged', deviceId);
	},
	publishDeviceStatus : function (deviceIds) {
		if (!deviceIds) return this.emit('deviceStateChanged'); // if no device id then publish change for all
		__.each(deviceIds, function(deviceId){this.emit('deviceStateChanged', deviceId);}, this);
	},
	restoreDeviceStatus : function (stateMap) {
		this._virtualNodesOldState = stateMap;
		__.each(this._virtualNodes, function (node, id) {
			__.has(this._virtualNodesOldState, id) && node.setState(this._virtualNodesOldState[id]);
		}, this);
	},
	getVirtualLoad : function (deviceId, loadIndx) {
		var dev = this._deviceMap[deviceId];
		if(dev) return dev.getVirtualLoad(loadIndx);
	},
	getVirtualSensor : function (deviceId, senIndx) {
		var dev = this._deviceMap[deviceId];
		if(dev) return dev.getVirtualSensor(senIndx);
	},
	getDeviceNodes	: function (nodeIds) {
		return __.pick(this._virtualNodes, nodeIds);
	},
	getVirtualNoads : function (types) {
		var nodeArr = [];
		__.each(this._virtualNodes, function(vNode) {
			if(types && !__.contains(types, vNode.className)) return;
			nodeArr.push(vNode);
		});
		return nodeArr
	}, 
	getDeviceStateMap : function () {
		var stateMap = {};
		__.each(this._virtualNodes, function (node, id) {stateMap[id] = node.state}, this);
		return stateMap;
	},
	_registrationCheck : {},
	_onNewDeviceFound : function (deviceId, type, count) {
		console.log("deviceManager _onNewDeviceFound");
		if(this._deviceMap[deviceId] || typeof this._deviceMap[deviceId] != 'undefined' && !count) return;
	//	this._deviceMap[deviceId]=false;
		if(type) return this._registerNewDevice(type, deviceId);
		this.sendQuery(deviceId, {name:"GTDVTP"}); //Get Device Type
	},
	sendQuery : function (deviceId, queryObj, callback) {
		this.communicator.sendQuery(deviceId, queryObj, function (err, result, query) {
				console.log("#### query sent to "+deviceId+":"+query);
				callback && callback(err, result);
		});
	},
	_onMsgRecieved : function (type, msg, deviceId, callback) {
		var category = null;
		if(type == "DVTP") {
			category = msg;
			if(deviceInfoConfig.get(deviceId)){
				deviceInfoConfig.set(deviceId+".category",msg);
				deviceInfoConfig.save();
			}
		}
		if (this._deviceMap[deviceId]) this._deviceMap[deviceId].emit('msgRecieved', type, msg, callback); // its device's job to handel its own msg
		else {
			// message from unregistered device
			console.log("#### Msg:"+msg+" from Unregistered Device:"+deviceId);
			if(!category) category = deviceInfoConfig.get(deviceId+".category");
			if(category) this._registerNewDevice (category, deviceId, callback);
			else this._onNewDeviceFound(deviceId);
		}
	},
	_registerNewDevice : function (type, deviceId, callback) {
		if(this._deviceMap[deviceId]) return;
		switch (type) {
			case "SWBD01"		 : var device = new SwBd01 (deviceId, this); break;
			case "SWBD02"		 : var device = new SwBd02 (deviceId, this); break;
			case "CNCR01"		 : var device = new CrtnCtrl01 (deviceId, this); break;
			case "DMBD05"		 : var device = new DmBd05 (deviceId, this); break;
			case "DMBD03"		 : var device = new DmBd03 (deviceId, this); break;
			case "IRBLR1"		 : var device = new IRBLR1 (deviceId, this.wifiCommunicator); break;
			case "IRWIFI01"		 : var device = new IRWIFI01 (deviceId, this.wifiCommunicator); break;
			case "ZMOTE01"		 : var device = new ZMOTE01 (deviceId, this.wifiCommunicator); break;
			default : var device = new BaseDevice(deviceId, this); break;
		}
		if(!__.contains(["IRBLR1", "IRWIFI01", "ZMOTE01"], type))__remoteDevInfoConf.registerNewDevice(deviceId, type); //remoteDevInfoConf will ignore if already registered
		
		console.log("#### Registered Device:" +deviceId+" of type:"+device.type);
		device.on('stateChanged', __.bind(function (device, nodeType, switchIds) {
			if(nodeType == 'sensor') this.sensorsPresentInSystem = true;
			this.emit('deviceStateChanged', device.id, device.getConfig(), nodeType, switchIds);
		}, this, device));
		if(!this.sensorsPresentInSystem) {
			if(__.keys(__remoteDevInfoConf.getListOfSensors(deviceId)).length)
				this.sensorsPresentInSystem = true;
		}
		this._deviceMap[deviceId] = device;
		__.extend(this._virtualNodes, device.virtualNodes);
		if(this._virtualNodesOldState ) __.each(device.virtualNodes, function (node, id) {
				__.has(this._virtualNodesOldState, id) && node.setState(this._virtualNodesOldState[id]);
			}, this)
		this.emit('newNodesFound', device.virtualNodes, deviceId);
		callback && callback();
		
		// device.getConfig();
		// this.emit('newDeviceFound', deviceId);
	},
	getConfig : function (deviceId, type) {	
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
	},
	getRechableDevices : function () {
		return __.filter(this._deviceMap, function(val, key){return val.reachable;});
	}
});

var TarangController = require(__rootPath+'/classes/communicators/tarang');
var Cc2530Controller = require(__rootPath+'/classes/communicators/cc2530');
var WifiCommunicator = require(__rootPath+'/classes/communicators/wifi');

if(__systemConfig.get('communicator') == 'tarang'){
	var communicator = new TarangController;
	console.log('communicator is tarang');
}
else {
	var communicator = new Cc2530Controller;
	console.log('communicator is cc2530', __systemConfig.get('communicator'));
}
 var wifiCommunicator = new WifiCommunicator;
if(typeof deviceManager == 'undefined') 
	deviceManager = new DeviceManager(communicator, wifiCommunicator);
module.exports = deviceManager;
