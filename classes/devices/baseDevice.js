var BaseClass = require(__rootPath+"/classes/baseClass");
var BaseVirtualDevice = require(__rootPath+"/classes/virtualDevices/baseDevice");
var Load = require(__rootPath+"/classes/virtualDevices/load");
var Sensor = require(__rootPath+"/classes/virtualDevices/sensor");
var CurtainControl = require(__rootPath+"/classes/virtualDevices/curtainControl");
var eventLogger = require(__rootPath+"/classes/eventLogger/logger");
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
	numberOfCurtainControls : 0,
	id : null,
	init : function (deviceId, router) {
		this.reachable = true;
		this.switchState = [];
		this.dimmerState = [];
		this.sensorState = [];
		this.curtainControlState = [];
		this.curtainControl
		this.isSensorActive = [];
		this.virtualNodes = {};
		this.id = deviceId;
		this.router = router;
		this.on('msgRecieved', __.bind(this._onMsgRecieved, this));
		this._initSwitches();
		this._initDimmers();
		this._initSensors();
		this._initCurtainControl();
		this.syncCallbackStack = [];
		this.syncState();

	},
	_initCurtainControl : function () {
		__.times(this.numberOfCurtainControls, function(indx){
			this.curtainControlState.push(0);
			var opnSwIndx = this.numberOfSwitches - 2*(this.numberOfCurtainControls-indx), cloSwIndx = 1+opnSwIndx;
			var curtainSwitches = [this.virtualNodes[this.id+"-l"+opnSwIndx],this.virtualNodes[this.id+"-l"+cloSwIndx]]
			var crtnCtrl = new CurtainControl({'state':0, 'id':this.id+"-c"+indx, 'deviceId':this.id, 'switches':curtainSwitches});
			this.virtualNodes[crtnCtrl.id] = crtnCtrl;
		}, this);
	},
	_initSwitches : function () {
		__.times(this.numberOfSwitches, function(indx){
			this.switchState.push(0);
			var vl = new Load({'state':0, 'id':this.id+"-l"+indx, 'deviceId':this.id});
			this.virtualNodes[vl.id] = vl;
			this._bindWithVirtualLoad(indx, vl);
		}, this);		
	},
	getVirtualLoad : function (indx) {
		return this.virtualNodes[this.id+"-l"+indx];
	},
	_initDimmers : function () {
		__.times(this.numberOfDimmers, function(){this.dimmerState.push(0)}, this);
	},
	_initSensors : function () {
		__.times(this.numberOfSensors, function(indx){
			this.sensorState.push(0); 
			this.isSensorActive.push(0);
			var vs = new Sensor({'state':0, 'id':this.id+"-s"+indx});
			this.virtualNodes[vs.id] = vs;
		}, this);
	},
	_bindWithVirtualLoad : function (loadIndex, vDevice) {
		if (loadIndex >= this.numberOfSwitches) return;
		vDevice.onStateChange = __.bind(function (force) {
			if(vDevice.state ^ this.switchState[loadIndex]) {
				vDevice.syncPending = true;
				this.setSwitch(loadIndex, vDevice.state, __.bind(function () {
					vDevice.syncPending = false;
					if(!force) { // if not force then sensor is toggeling
						console.log("@@@@@@@@@@@ Switch toggelled by Sensor @@@@@@@@@");	
						eventLogger.addEvent("toggelSwitch", {
							'boardId':this.id, 
							'pointId':vDevice.id,
							'pointKey':loadIndex,
							'remoteDevice':'sensor', 
							'state':this.switchState[loadIndex] // log new state
						});
					}
					else {} // else its the remote device toggeling
					vDevice._onStateChange(force);
				}, this));
			}
			else
				vDevice._onStateChange();
		}, this);
	},
	_logDVST : function (msg) {
		console.log("#### DVST of "+this.id+" is " + msg.substr(4));
	},
	_onMsgRecieved : function (type, msg) {
		if (type == "DVST") {
			this._recordDeviceStatus(msg);
		}
		else console.log(((type)?type:"")+msg);
	},
	_recordDeviceStatus : function (msg) {
		this._logDVST(msg);
		var callback;
		__.times(this.numberOfSwitches, function(indx){
			var vDev = this.getVirtualLoad(indx);//this.virtualNodes[this.id+"-l"+indx];
			if(vDev._initSyncDone && !vDev.syncPending && vDev.state ^ this.switchState[indx]) {
				console.log("@@@@@@@@@ switch manually toggelled @@@@@@@@@@@");
				eventLogger.addEvent("toggelSwitch", {
					'boardId':this.id, 
					'pointId':vDev.id,
					'pointKey':indx,
					'remoteDevice':'wallmount', 
					'state':this.switchState[indx] // log new state
				});
			}
			vDev.setState(this.switchState[indx]);
		}, this);
		__.times(this.numberOfSensors, function(indx){
			this.isSensorActive[indx] && this.virtualNodes[this.id+"-s"+indx].setState(this.sensorState[indx]);
		}, this);
		while(callback = this.syncCallbackStack.shift()) callback();
		clearTimeout(this.syncInProgress);
		this.syncInProgress = false;
	//	console.log("this.syncInProgress - "+this.syncInProgress);
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
	syncState : function (callback, force, count) {
		if (typeof callback == 'function') this.syncCallbackStack.push(callback);
		if(!force && this.syncInProgress) return;
		if(typeof count == 'undefined') count=0;
		if (count > 10) { this.syncCallbackStack = []; this.syncInProgress=false; return;}
//		this._sendQuery({name:"GTDVST"}); // mostly remote device has already sent the status wait and then resend status query
		setTimeout(__.bind(function () {if(this.syncInProgress)this._sendQuery({name:"GTDVST"});}, this),100)
		clearTimeout(this.syncInProgress);
		this.syncInProgress = setTimeout(__.bind(this.syncState, this, null, true, count+1), 2500);
	//	console.log("this.syncInProgress - "+this.syncInProgress);
	},
	_sendQuery : function (queryObj, callback) {this.router.sendQuery(this.id,queryObj,callback);},
	setSwitch : function (switchNo, state, callback) {},
	setDimmer : function(dimmerNo, value) {},
	getConfig : function () {
		if (this.stateJson) {
			this.stateJson.reachable = this.reachable;
			return this.stateJson;
		}
		this._makeStateJson();
		return this.stateJson;
	},
	_makeStateJson : function () {
		var switchState = {}
		__(this.numberOfSwitches).times(function (i) {
			if(i <  (this.numberOfSwitches - 2*this.numberOfCurtainControls))
				switchState[i+""] = {"state":this.switchState[i]}
		}, this);
		var curtainControlState = {};
		__(this.numberOfCurtainControls).times(function (i) {
			curtainControlState[i+""] = {"state":this.curtainControlState[i]};
		}, this);
		var dimmerState = {}
		__(this.numberOfDimmers).times(function (i) {
			dimmerState[i+""] = {"state":this.dimmerState[i]};
		}, this);
		var sensorState = {}
		__(this.numberOfSensors).times(function (i) {
			sensorState[i+""] = {"state":this.sensorState[i], "Active":this.isSensorActive[i]};
		}, this);
		var retObj = {reachable : this.reachable};
		retObj[this.id+""] = {"switch":switchState, "dimmer":dimmerState, "sensor":sensorState, "curtain":curtainControlState};
		this.stateJson = retObj;
	},
	applyConfig : function (conf) {
		__.each(conf, function (value, id) {
			if(parseInt(id)>this.numberOfSwitches) return;
			//this.virtualNodes[this.id+"-l"+id].setState((value)?true:false);
			this.setSwitch(parseInt(id), (value)?true:false);
			if(parseInt(id)>this.numberOfDimmers || !__.isNumber(value)) return;
			this.setDimmer(parseInt(id), value);
		}, this);
	}
// 	applyConfig : function (conf) {
// 		console.log("###### applyConfig called");
// 		__.each(__.keys(conf), function (key){
// 			__.each(__.keys(conf[key]), function (id) {
// 				if (conf[key][id]['state'] != this[key+'State'][id]) {
// 					if (key == 'switch')
// 						this.virtualNodes[this.id+"-l"+id].setState(conf[key][id]['state']);
// 					else 
// 						this["set"+__(key).capitalize()](id, conf[key][id]['state']);
// 				}
// 			}, this);
// 		}, this);
// //		this.stateJson = conf;
// 	}
});

module.exports = BaseDevice;