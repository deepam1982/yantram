var __ = require("underscore");
var SwBd02 = require(__rootPath+"/classes/devices/switchBoards/swBd02");

var DmBd05 = SwBd02.extend({
	type : 'dmBd05',
	numberOfSwitches : 5,
	numberOfDimmers : 5,
	numberOfSensors : 2
});

module.exports = DmBd05;