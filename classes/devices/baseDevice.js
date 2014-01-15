var BaseClass = require(__rootPath+"/classes/baseClass");
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
		this.id = deviceId;
		this.router = router;
		this.on('msgRecieved', __.bind(this._onMsgRecieved, this));
	},
	_onMsgRecieved : function (msg) {
		if (msg.substr(0,4) == "DVST") this._recordDeviceStatus(msg.substr(4));
		else console.log(msg);
	},
	_recordDeviceStatus : function (msg) {
		this.syncInProgress = false;
		this._makeConfig();
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
	syncState : function (force) {
		if(!force && this.syncInProgress) return;
		this._sendQuery("GTDVST");
		this.syncInProgress = true;
		setTimeout(__.bind(function() {
			if(this.syncInProgress) this.syncState(true);
		}, this), 500);
	},
	_sendQuery : function (query, callback) {this.router.sendQuery(this.id,query,callback);},
	setSwitch : function (switchNo, state) {},
	setDimmer : function(dimmerNo, value) {},
	getConfig : function () {
		if (this.config) return this.config;
		this._makeConfig();
		return this.config;
	},
	_makeConfig : function () {
		var switchState = {}
		__(this.numberOfSwitches).times(function (i) {
			switchState[i+""] = {"state":this.switchState[i]};
		}, this);
		var dimmerState = {}
		__(this.numberOfDimmers).times(function (i) {
			dimmerState[i+""] = {"state":this.dimmerState[i]};
		}, this);
		var retObj = {};
		retObj[this.id+""] = {"switch":switchState, "dimmer":dimmerState};
		this.config = retObj;
	},
	applyConfig : function (conf) {
		__.each(__.keys(conf), function (key){
			__.each(__.keys(conf[key]), function (id) {
				if (conf[key][id]['state'] != this[key+'State'][id])
					this["set"+__(key).capitalize()](id, conf[key][id]['state'])
			}, this);
		}, this);
//		this.config = conf;
	}
});

module.exports = BaseDevice;