var __ = require("underscore");
var SwBd01 = require(__rootPath+"/classes/devices/switchBoards/swBd01");

var SwBd02 = SwBd01.extend({
	type : 'swBd02',
	numberOfSwitches : 5,
	numberOfDimmers : 1,
	numberOfSensors : 2,
	_setDimmerState : function (msg) {
		this.dimmerState[0] = this._hexCharToInt(msg[0])*0x10 + this._hexCharToInt(msg[1]);
	}


});

module.exports = SwBd02;