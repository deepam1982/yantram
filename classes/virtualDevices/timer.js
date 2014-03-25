var BaseVirtualDevice = require(__rootPath+"/classes/virtualDevices/baseDevice");
var __ = require("underscore");
var Timer = BaseVirtualDevice.extend({
	className : "Timer",
	init : function(obj){
		__.bindAll(this, 'switchOnAfter', 'switchOffAfter')
		this._super.apply(this, arguments);
		this.pendingSwitchOn=null;
		this.pendingSwitchOff=null;
		obj && obj.switchOnAfter && this.switchOnAfter(obj.switchOnAfter);
		obj && obj.switchOffAfter && this.switchOffAfter(obj.switchOffAfter);
	},
	switchOnAfter : function (timeInSeconds, beforeAction, afterAction) {
		clearTimeout(this.pendingSwitchOn);
		this.pendingSwitchOn = setTimeout(__.bind(function () {
			beforeAction && beforeAction();
			this._switchOn();
			afterAction && afterAction();
		}, this), timeInSeconds*1000)
	},
	switchOffAfter : function (timeInSeconds, beforeAction, afterAction) {
	//	console.log("switchOffAfter called");
		clearTimeout(this.pendingSwitchOff);
		this.pendingSwitchOff = setTimeout(__.bind(function () {
			beforeAction && beforeAction();
			this._switchOff();
			afterAction && afterAction();
		}, this), timeInSeconds*1000)
	},

});

module.exports = Timer;