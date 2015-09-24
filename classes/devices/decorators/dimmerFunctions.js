var __ = require("underscore");
module.exports ={
	_getDimmerStateMsg : function (msg) {return msg.substr(2);},
	_recordDeviceStatus : function (msg) {
		var oldDm0St = this.dimmerState[0];
		var oldDm1St = this.dimmerState[1]; 
		this._setDimmerState(this._getDimmerStateMsg(msg));	
		this._super(msg);
		if (Math.abs(oldDm0St-this.dimmerState[0])>10 || Math.abs(oldDm1St != this.dimmerState[1])>10) 
			this.emit('stateChanged', 'dimmer');
	},
	_setDimmerState : function (msg) {
		this.dimmerState[0] = this._hexCharToInt(msg[0])*0x10 + this._hexCharToInt(msg[1]);
		this.dimmerState[1] = this._hexCharToInt(msg[2])*0x10 + this._hexCharToInt(msg[3]);
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
	dimmerDown : function (dimmerNo) {this.setDimmer(dimmerNo, this.dimmerState[dimmerNo]-16);}

}