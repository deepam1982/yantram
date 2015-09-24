var __ = require("underscore");
var BaseDevice = require(__rootPath+"/classes/devices/baseDevice");
var SwitchFunctions = require(__rootPath+"/classes/devices/decorators/switchFunctions");
var DimmerFunctions = require(__rootPath+"/classes/devices/decorators/dimmerFunctions");
var SensorFunctions = require(__rootPath+"/classes/devices/decorators/sensorFunctions");

var SwBd01 = BaseDevice.extend(SwitchFunctions).extend(DimmerFunctions).extend(SensorFunctions).extend({
	type : 'swBd01',
	numberOfSwitches : 5,
	numberOfDimmers : 2,
	numberOfSensors : 2,
	_logDVST : function (msg) {
		if(!this.avoidLogDVST)
		console.log("#### DVST of "+this.id+" is " + this.switchState + "    " + this.dimmerState + "    " + this.sensorState);
	}
});

module.exports = SwBd01;