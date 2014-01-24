var BaseClass = require(__rootPath+"/classes/baseClass");
var BaseVirtualDevice = require(__rootPath+"/classes/virtualDevices/baseDevice");
var TimerSwitch = require(__rootPath+"/classes/virtualDevices/timerSwitch");
var SmartMotionSensor = require(__rootPath+"/classes/virtualDevices/smartMotionSensor");
var __ = require("underscore");
__.mixin({
  capitalize: function(string) {
    return string.charAt(0).toUpperCase() + string.substring(1).toLowerCase();
  }
});


var BaseDevice = BaseClass.extend({
	type : 'basic',
	numberOfSwitches : 0,
	numberOfDimmers : 0,
	numberOfSensors : 0,
	id : null,
	init : function (deviceId, router) {
		this.switchState = [];
		this.dimmerState = [];
		this.sensorState = [];
		this.isSensorActive = [];
		this.virtualLoads = [];
		this.virtualSensors = [];
		this.id = deviceId;
		this.router = router;
		this.on('msgRecieved', __.bind(this._onMsgRecieved, this));
		this._initSwitches();
		this._initDimmers();
		this._initSensors();
		// timerSwitch = new TimerSwitch();
		// timerSwitch.switchOnAt('30 * * * * *');
		// timerSwitch.on('switchOn', __.bind(timerSwitch.switchOffAfter, timerSwitch, 10));
		// timerSwitch.follow(this.virtualLoads[3]);
		// this.virtualLoads[3].follow(timerSwitch);
		// this.virtualLoads[2].follow(this.virtualLoads[3]);
		// this.virtualLoads[2]._unfollow();
		if (this.numberOfSensors)
			this.virtualLoads[3].follow(this.virtualSensors[1]);
		
		this.syncCallbackStack = [];
		this.syncState();

	},
	_initSwitches : function () {
		__.times(this.numberOfSwitches, function(indx){
			this.switchState.push(0);
			this.virtualLoads.push(new BaseVirtualDevice({'state':0}));
			this._bindWithVirtualLoad(indx, this.virtualLoads[indx]);
		}, this);		
	},
	_initDimmers : function () {
		__.times(this.numberOfDimmers, function(){this.dimmerState.push(0)}, this);
	},
	_initSensors : function () {
		__.times(this.numberOfSensors, function(indx){
			this.sensorState.push(0); 
			this.isSensorActive.push(0);
			this.virtualSensors.push(new SmartMotionSensor({'state':0}));
		}, this);
	},
	_bindWithVirtualLoad : function (loadIndex, vDevice) {
		if (loadIndex >= this.numberOfSwitches) return;
		vDevice.onStateChange = __.bind(function () {
			if(vDevice.state ^ this.switchState[loadIndex])
				this.setSwitch(loadIndex, vDevice.state, function () {vDevice._onStateChange();});
			else
				vDevice._onStateChange();
		}, this);
	},
	_logDVST : function (msg) {
		console.log("#### DVST of "+this.id+" is " + msg.substr(4));
	},
	_onMsgRecieved : function (msg) {
		if (msg.substr(0,4) == "DVST") {
			this._recordDeviceStatus(msg.substr(4));
		}
		else console.log(msg);
	},
	_recordDeviceStatus : function (msg) {
		this._logDVST(msg);
		var callback;
		while(callback = this.syncCallbackStack.shift()) callback();
		__.times(this.numberOfSwitches, function(indx){
			this.virtualLoads[indx].setState(this.switchState[indx]);
		}, this);
		__.times(this.numberOfSensors, function(indx){
			this.isSensorActive[indx] && this.virtualSensors[indx].setState(this.sensorState[indx]);
		}, this);
		clearTimeout(this.syncInProgress);
		this.syncInProgress = false;
		console.log("this.syncInProgress - "+this.syncInProgress);
		this._makeStateJson();
	},
	_hexCharToInt: function(str) {
		var intt = str.charCodeAt(0);
		return (intt - ((intt > 0x40)?0x37:0x30));
	},
	_intToHexStr : function(integer) { 
		var str = Number(integer).toString(16); 
		str = str.length == 1 ? "0" + str : str;
		return str.toUpperCase(); 
	},
	_binStateToInt : function (state) {
		var swst = 0;
		__.each(state, function(st) {swst+=((st)?1:0); swst<<=1;}) 
		return swst>>=1;
	},
	syncState : function (callback, force) {
		if (typeof callback == 'function') this.syncCallbackStack.push(callback);
		if(!force && this.syncInProgress) return;
		this._sendQuery("GTDVST");
		clearTimeout(this.syncInProgress);
		this.syncInProgress = setTimeout(__.bind(this.syncState, this, null, true), 2500);
		console.log("this.syncInProgress - "+this.syncInProgress);
	},
	_sendQuery : function (query, callback) {this.router.sendQuery(this.id,query,callback);},
	setSwitch : function (switchNo, state, callback) {},
	setDimmer : function(dimmerNo, value) {},
	getConfig : function () {
		if (this.stateJson) return this.stateJson;
		this._makeStateJson();
		return this.stateJson;
	},
	_makeStateJson : function () {
		var switchState = {}
		__(this.numberOfSwitches).times(function (i) {
			switchState[i+""] = {"state":this.switchState[i]};
		}, this);
		var dimmerState = {}
		__(this.numberOfDimmers).times(function (i) {
			dimmerState[i+""] = {"state":this.dimmerState[i]};
		}, this);
		var sensorState = {}
		__(this.numberOfSensors).times(function (i) {
			sensorState[i+""] = {"state":this.sensorState[i], "Active":this.isSensorActive[i]};
		}, this);
		var retObj = {};
		retObj[this.id+""] = {"switch":switchState, "dimmer":dimmerState, "sensor":sensorState};
		this.stateJson = retObj;
	},
	applyConfig : function (conf) {
		__.each(__.keys(conf), function (key){
			__.each(__.keys(conf[key]), function (id) {
				if (conf[key][id]['state'] != this[key+'State'][id])
					this["set"+__(key).capitalize()](id, conf[key][id]['state'])
			}, this);
		}, this);
//		this.stateJson = conf;
	}
});

module.exports = BaseDevice;