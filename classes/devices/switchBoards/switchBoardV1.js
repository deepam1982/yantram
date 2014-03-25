var __ = require("underscore");
var BaseDevice = require(__rootPath+"/classes/devices/baseDevice");

var SwitchBoardV1 = BaseDevice.extend({
	type : 'switchBoardV1',
	numberOfSwitches : 6,
	numberOfDimmers : 2,
	_onMsgRecieved : function (msg) {
		this._super(msg);
	},
	_getSwitchStateMsg : function (msg) {return msg;},
	_getDimmerStateMsg : function (msg) {return msg.substr(2);},
	_recordDeviceStatus : function (msg) {
		var oldDm0St = this.dimmerState[0];
		var oldDm1St = this.dimmerState[1]; 
		var oldSwSt = this._binStateToInt(this.switchState); 
		this._setSwitchState(this._getSwitchStateMsg(msg));
		this._setDimmerState(this._getDimmerStateMsg(msg));	
		this._super(msg);
		if (oldDm0St != this.dimmerState[0] || oldDm1St != this.dimmerState[1]) this.emit('stateChanged', 'dimmer');
		var changebits = oldSwSt ^ this._binStateToInt(this.switchState)
		if (changebits) this.emit('stateChanged', 'switch', changebits);	
	},
	_logDVST : function (msg) {
		console.log("#### DVST of "+this.id+" is " + this.switchState + " " + this.dimmerState);
	},

	_setDimmerState : function (msg) {
		this.dimmerState[0] = this._hexCharToInt(msg[0])*0x10 + this._hexCharToInt(msg[1]);
		this.dimmerState[1] = this._hexCharToInt(msg[2])*0x10 + this._hexCharToInt(msg[3]);
	},
	_setSwitchState : function (msg) {
		var swst = this._hexCharToInt(msg[0])*0x10 + this._hexCharToInt(msg[1]);
		this.switchState[5] = (swst>>0) % 2;
		this.switchState[4] = (swst>>1) % 2;
		this.switchState[3] = (swst>>2) % 2;
		this.switchState[2] = (swst>>3) % 2;
		this.switchState[1] = (swst>>4) % 2;
		this.switchState[0] = (swst>>5) % 2;
	},
	setDimmer : function(dimmerNo, value, donotRetry) {
		if (dimmerNo > this.dimmerState.length) return;
		value = Math.min(255, Math.max(0, value));
		this._sendQuery("STFSD"+dimmerNo+this._intToHexStr(value), __.bind(function(){
			setTimeout(__.bind(function () {
				if (Math.abs(value - this.dimmerState[dimmerNo]) > 10) {
					if(donotRetry) this.syncState();
					else this.setDimmer(dimmerNo, value, true);
				}
			}, this), 500);
		}, this))
	},
	dimmerUp : function (dimmerNo) {this.setDimmer(dimmerNo, this.dimmerState[dimmerNo]+16);},
	dimmerDown : function (dimmerNo) {this.setDimmer(dimmerNo, this.dimmerState[dimmerNo]-16);},
	setSwitch : function (switchNo, state, callback) {
		if (!this.setSwitchQ) this.setSwitchQ = [];
		this.setSwitchQ.push({"switchNo":switchNo, "state":state, "callback":callback});
		if(!this.__foo)
			this.__foo = __.throttle(__.bind(function(){this._processSetSwitchQ()}, this), 500, {leading: false});
		this.__foo();
	},
	_processSetSwitchQ : function () {
		var copy = __.clone(this.switchState);
		var setSwitchQ = this.setSwitchQ
		this.setSwitchQ = null;
		__.each(setSwitchQ, function (obj){
			if (obj.switchNo >= this.switchState.length) return;
			copy[obj.switchNo] = (obj.state)?1:0;	
		}, this);
		var swst = this._binStateToInt(copy);
		this._setSwitch(swst, __.bind(function () {
			__.each(setSwitchQ, function (obj) {obj.callback && obj.callback();}, this);
		}, this))
	},
	_setSwitch : function (swst, callback, donotRetry) {
		this._sendQuery("STSWPT"+this._intToHexStr(swst), 
			__.bind(function(){
				setTimeout(__.bind(function () {
					if (this._binStateToInt(this.switchState)^swst)
						this.syncState(__.bind(function () {
							if(!donotRetry && this._binStateToInt(this.switchState)^swst) {
								console.log("#### retrying STSWPT")
								this._setSwitch(swst, callback, true);
							}
							else callback && callback()
						}, this))
					else callback && callback()
				}, this), 1000);	
			}, this));
	},
	toggleSwitch : function(switchNo) {return this.setSwitch(switchNo, !this.switchState[switchNo]);} 	
});

module.exports = SwitchBoardV1;