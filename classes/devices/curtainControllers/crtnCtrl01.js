var __ = require("underscore");
var BaseDevice = require(__rootPath+"/classes/devices/baseDevice");
var SwitchFunctions = require(__rootPath+"/classes/devices/decorators/switchFunctions");
var CurtainControlFunctions = require(__rootPath+"/classes/devices/decorators/curtainControlFunctions");

var CrtnCtrl01 = BaseDevice.extend(CurtainControlFunctions).extend(SwitchFunctions).extend({
	type : 'crtnCtrl01',
	numberOfSwitches : 5,
	numberOfCurtainControls : 2,
	_logDVST : function (msg) {
		if(!this.avoidLogDVST)
		console.log("#### DVST of "+this.id+" is " + this.switchState + "    " + this.curtainControlState);
	}
});

module.exports = CrtnCtrl01;