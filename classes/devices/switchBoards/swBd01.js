var __ = require("underscore");
var SwitchBoardV2 = require(__rootPath+"/classes/devices/switchBoards/switchBoardV2");

var SwBd01 = SwitchBoardV2.extend({
	type : 'swBd01',
	numberOfSwitches : 5,
	numberOfDimmers : 2,
	numberOfSensors : 2,
	_getActiveSensorMsg : function (msg) {return "0"+msg.substr(7, 1);},
	_getSensorStateMsg : function (msg) {return msg.substr(6, 1);},
	_setSensorState : function (msg) {
		msg = parseInt(msg)
		this.sensorState[0] = ((1<<0)&msg)?1:0;
		this.sensorState[1] = ((1<<1)&msg)?1:0;
	}

});

module.exports = SwBd01;