var __ = require("underscore");
var SwBd01 = require(__rootPath+"/classes/devices/switchBoards/swBd01");

var DmBd03 = SwBd01.extend({
	type : 'dmBd03',
	numberOfSwitches : 5,
	numberOfDimmers : 3,
	numberOfSensors : 2
});

module.exports = DmBd03;