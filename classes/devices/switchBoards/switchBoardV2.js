var __ = require("underscore");
var SwitchBoardV1 = require(__rootPath+"/classes/devices/switchBoards/switchBoardV1");

var SwitchBoardV2 = SwitchBoardV1.extend({
	type : 'switchBoardV2',
	numberOfSwitches : 6,
	numberOfDimmers : 2,
	numberOfSensors : 2,

//	_getSwitchStateMsg : function (msg) {return msg.substr(2, 2);},
//	_getDimmerStateMsg : function (msg) {return msg.substr(4, 4);},
	_getActiveSensorMsg : function (msg) {return msg.substr(6, 2);},
	_getSensorStateMsg : function (msg) {return this._getDimmerStateMsg(msg);},
	_recordDeviceStatus : function (msg) {
		if (msg.lenght < 8) return;
		this._setActiveSensor(this._getActiveSensorMsg(msg));
		var oldSnSt = this.sensorState.slice(0); //make a clone
		this._setSensorState(__.bind(this._getSensorStateMsg, this)(msg));
		this._super(msg);
		if (oldSnSt[0] != this.sensorState[0] || oldSnSt[1] != this.sensorState[1]) this.emit('stateChanged', 'sensor');
	},
	_logDVST : function (msg) {
		console.log("#### DVST of "+this.id+" is " + this.switchState + "    " + this.dimmerState + "    " + this.sensorState);
	},
	_setActiveSensor : function (msg) {
		var activityState = this._hexCharToInt(msg[0])*0x10 + this._hexCharToInt(msg[1]);
		this.isSensorActive = [];
		__.times(this.numberOfSensors, function(){
			this.isSensorActive.push(activityState & 1); activityState >>= 1;
		}, this);
	},
	_setSensorState : function (msg) {
		this.sensorState[0] = (this.isSensorActive[0])?(this._hexCharToInt(msg[0])*0x10 + this._hexCharToInt(msg[1])):0;
		this.sensorState[1] = (this.isSensorActive[1])?(this._hexCharToInt(msg[2])*0x10 + this._hexCharToInt(msg[3])):0;
	},
	_setDimmerState : function (msg) {
		this.dimmerState[0] = (!this.isSensorActive[0])?(this._hexCharToInt(msg[0])*0x10 + this._hexCharToInt(msg[1])):0xFF;
		this.dimmerState[1] = (!this.isSensorActive[1])?(this._hexCharToInt(msg[2])*0x10 + this._hexCharToInt(msg[3])):0xFF;
	},

 	
});

module.exports = SwitchBoardV2;