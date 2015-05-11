var __ = require("underscore");
var BaseDevice = require(__rootPath+"/classes/devices/baseDevice");

var SwitchBoardV1 = BaseDevice.extend({
	type : 'switchBoardV1',
	numberOfSwitches : 6,
	numberOfDimmers : 2,
	_onMsgRecieved : function (type, msg) {
		this._super(type, msg);
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
		if (Math.abs(oldDm0St-this.dimmerState[0])>10 || Math.abs(oldDm1St != this.dimmerState[1])>10) 
			this.emit('stateChanged', 'dimmer');
		var changebits = oldSwSt ^ this._binStateToInt(this.switchState)
		var changeSwitchIndexes = []
		__.times(this.numberOfSwitches, function(indx){
			if((changebits>>indx) % 2) changeSwitchIndexes.push(this.numberOfSwitches-1-indx);
		}, this);
		if (changebits) this.emit('stateChanged', 'load', changeSwitchIndexes);
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
		__.times(this.numberOfSwitches, function(indx){
			this.switchState[this.numberOfSwitches-1-indx] = (swst>>indx) % 2;	
		}, this);
		// this.switchState[5] = (swst>>0) % 2;
		// this.switchState[4] = (swst>>1) % 2;
		// this.switchState[3] = (swst>>2) % 2;
		// this.switchState[2] = (swst>>3) % 2;
		// this.switchState[1] = (swst>>4) % 2;
		// this.switchState[0] = (swst>>5) % 2;
	},
	setDimmer : function(dimmerNo, value, donotRetry) {
		if (dimmerNo > this.dimmerState.length) return;
		value = Math.min(255, Math.max(0, value));
		this._sendQuery({name:"STFSD", id:dimmerNo, value:this._intToHexStr(value)}, __.bind(function(){
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
//		console.log("Pushed to Switch Q");
		if(!this.__foo)
			this.__foo = __.throttle(__.bind(function(){this._processSetSwitchQ()}, this), 50, {leading: false});
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
//		console.log("Processing Switch Q");
		this._setSwitch(swst, __.bind(function () {
			__.each(setSwitchQ, function (obj) {obj.callback && obj.callback();}, this);
		}, this))
	},
	// _setSwitch : function (swst, callback, donotRetry) {
	// 	this._sendQuery({name:"STSWPT", value:this._intToHexStr(swst)}, 
	// 		__.bind(function(){
	// 			setTimeout(__.bind(function () {
	// 				if (this._binStateToInt(this.switchState)^swst) {
	// 					this.syncState(__.bind(function () {
	// 						if(!donotRetry && this._binStateToInt(this.switchState)^swst) {
	// 							console.log("#### retrying STSWPT")
	// 							this._setSwitch(swst, callback, true);
	// 						}
	// 						else callback && callback()
	// 					}, this));
	// 				}
	// 				else callback && callback()
	// 			}, this), 100); // if this interval is long it will create problem when user rapidly toggels the switch.	
	// 		}, this));
	// },
	_setSwitch : function (swst, callback, donotRetry) {
		this._sendQuery({name:"STSWPT", value:this._intToHexStr(swst)}, 
			__.bind(function(){
				// successful response comes only when request registers successfully :D
				this.syncState(__.bind(function () {
					if(!donotRetry && this._binStateToInt(this.switchState)^swst) {
						console.log("#### retrying STSWPT")
						this._setSwitch(swst, callback, true);
					}
					else callback && callback()
				}, this));
				setTimeout(__.bind(function () {
					if(!donotRetry && this._binStateToInt(this.switchState)^swst)
						this._setSwitch(swst, callback, true);
				}, this), 200); // if this interval is long (should be 100) it will create problem when user rapidly toggels the switch.	
		}, this));		// and if the interval is short (should be 200) it will resend query when response is on the way.
	},
	toggleSwitch : function(switchNo) {
		return this.virtualNodes[this.id+"-l"+switchNo].setState(!this.switchState[switchNo]);
//		return this.setSwitch(switchNo, !this.switchState[switchNo]);
	} 	
});

module.exports = SwitchBoardV1;