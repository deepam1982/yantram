var __ = require("underscore");
module.exports ={
	_getDimmerStateMsg : function (msg) {return msg.substr(2);},
	_recordDeviceStatus : function (msg) {
		var oldDmStArr = [];
		for (var i=0; i<this.dimmerState.length;i++) {
			oldDmStArr[i] = this.dimmerState[i];
		}
		this._setDimmerState(this._getDimmerStateMsg(msg));	
		this._super(msg);
		var dmStatCng = false;
		for (var i=0; i<this.dimmerState.length;i++) {
			if(Math.abs(oldDmStArr[i]-this.dimmerState[i])>10){
				dmStatCng = true;
				break;
			}
		}
		if (dmStatCng) this.emit('stateChanged', 'dimmer');
	},
	_setDimmerState : function (msg) {
		for (var i=0; i<this.dimmerState.length;i++) {
			this.dimmerState[i] = this._hexCharToInt(msg[2*i])*0x10 + this._hexCharToInt(msg[(2*i)+1]);
		}
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