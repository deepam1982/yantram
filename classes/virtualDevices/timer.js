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
		obj && obj.switchOffAfter && this.switchOffAfter(obj.switchOffAfter, obj.afterSwitchOff);
	},
	switchOnAfter : function (timeInSeconds, beforeAction, afterAction) {
	//	console.log("switchOnAfter called timeInSeconds", timeInSeconds);
		clearTimeout(this.pendingSwitchOn);
		this.pendingSwitchOn = setTimeout(__.bind(function () {
			beforeAction && beforeAction();
			this._switchOn();
			afterAction && afterAction();
		}, this), timeInSeconds*1000)
		this.switchOnAt = new Date().getTime() + timeInSeconds*1000;
	},
	switchOffAfter : function (timeInSeconds, beforeAction, afterAction) {
	//	console.log("switchOffAfter called timeInSeconds", timeInSeconds);
		clearTimeout(this.pendingSwitchOff);
		this.pendingSwitchOff = setTimeout(__.bind(function () {
			beforeAction && beforeAction();
			this._switchOff();
			afterAction && afterAction();
		}, this), timeInSeconds*1000)
		this.switchOffAt = new Date().getTime() + timeInSeconds*1000;
	},
	isActionPending : function () {
		return (this.pendingSwitchOn || this.pendingSwitchOff)?true:false;
	},
	getRemainingTimeToToggle :function () { // in seconds
		var time = this._super.apply(this, arguments);
		var tmp;
		if((this.state && (tmp = this.switchOffAt - new Date().getTime()) > 0)
			|| (!this.state && (tmp = this.switchOnAt - new Date().getTime()) > 0)) {
			return Math.min(time, parseInt(tmp/1000));
		}
				
		return time;
	}

});

module.exports = Timer;