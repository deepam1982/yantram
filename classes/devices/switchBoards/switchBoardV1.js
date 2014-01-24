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
	setDimmer : function(dimmerNo, value) {
		if (dimmerNo > this.dimmerState.length) return;
		value = Math.min(255, Math.max(0, value));
		this._sendQuery("STFSD"+dimmerNo+this._intToHexStr(value), __.bind(function(){this.syncState()}, this))
	},
	dimmerUp : function (dimmerNo) {this.setDimmer(dimmerNo, this.dimmerState[dimmerNo]+16);},
	dimmerDown : function (dimmerNo) {this.setDimmer(dimmerNo, this.dimmerState[dimmerNo]-16);},
	setSwitch : function (switchNo, state, callback, donotRetry) {
		if (switchNo >= this.switchState.length) return;
		var copy = __.clone(this.switchState);
		copy[switchNo] = (state)?1:0;
		var swst = this._binStateToInt(copy);
		this._sendQuery("STSWPT"+this._intToHexStr(swst), 
			__.bind(function(){
				this.syncState(__.bind(function () {
					if(!donotRetry && this.switchState[switchNo]^state) {
						console.log("#### retrying STSWPT")
						this.setSwitch(switchNo, state, callback, true);
					}
					else callback && callback()
				}, this))
			}, this));
	},
	toggleSwitch : function(switchNo) {return this.setSwitch(switchNo, !this.switchState[switchNo]);} 	
});

module.exports = SwitchBoardV1;