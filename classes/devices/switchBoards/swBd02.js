var __ = require("underscore");
var SwBd01 = require(__rootPath+"/classes/devices/switchBoards/swBd01");

var SwBd02 = SwBd01.extend({
	type : 'swBd02',
	numberOfSwitches : 5,
	numberOfDimmers : 1,
	numberOfSensors : 2,
	_getActiveSensorMsg : function (msg) {return "0"+msg.substr(7, 1);},
	_getSensorStateMsg : function (msg) {return msg.substr(6, 1);},
	_setSensorState : function (msg) {
		msg = parseInt(msg)
		this.sensorState[0] = ((1<<0)&msg)?1:0;
		this.sensorState[1] = ((1<<1)&msg)?1:0;
	},
	_setDimmerState : function (msg) {
		this.dimmerState[0] = this._hexCharToInt(msg[0])*0x10 + this._hexCharToInt(msg[1]);
	},


});

module.exports = SwBd01;