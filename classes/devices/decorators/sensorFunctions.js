var __ = require("underscore");
module.exports ={
	_recordDeviceStatus : function (msg) {
		if (msg.lenght < 8) return;
		this._setActiveSensor(this._getActiveSensorMsg(msg));
		var oldSnSt = this.sensorState.slice(0); //make a clone
		this._setSensorState(__.bind(this._getSensorStateMsg, this)(msg));
		var sensorStateChanged = (oldSnSt[0] != this.sensorState[0] || oldSnSt[1] != this.sensorState[1]);
		if(sensorStateChanged) this.avoidLogDVST = true;
		this._super(msg);
		if(sensorStateChanged) this.emit('stateChanged', 'sensor');
		this.avoidLogDVST = false;
	},
	_logDVST : function (msg) {
		if(!this.avoidLogDVST)
		console.log("#### DVST of "+this.id+" is " + this.switchState + "    " + this.dimmerState + "    " + this.sensorState);
	},
	_setActiveSensor : function (msg) {
		var activityState = this._hexCharToInt(msg[0])*0x10 + this._hexCharToInt(msg[1]);
		this.isSensorActive = [];
		__.times(this.numberOfSensors, function(){
			this.isSensorActive.push(activityState & 1); activityState >>= 1;
		}, this);
	},
	_getActiveSensorMsg : function (msg) {return "0"+msg.substr(7, 1);},
	_getSensorStateMsg : function (msg) {return msg.substr(6, 1);},
	_setSensorState : function (msg) {
		msg = parseInt(msg)
		this.sensorState[0] = ((1<<0)&msg)?1:0;
		this.sensorState[1] = ((1<<1)&msg)?1:0;
	}

}