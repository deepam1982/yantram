var __ = require("underscore");
var SwitchBoardV1 = require(__rootPath+"/classes/devices/switchBoards/switchBoardV1");

var SwBd01 = SwitchBoardV1.extend({
	type : 'swBd01',
	numberOfSwitches : 5,
	numberOfDimmers : 2,
	numberOfSensors : 0,
});

module.exports = SwBd01;