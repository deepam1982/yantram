var BaseVirtualDevice = require(__rootPath+"/classes/virtualDevices/baseDevice");
var __ = require("underscore");
var CronJob = require('cron').CronJob;
var TimerSwitch = BaseVirtualDevice.extend({
	className : "TimerSwitch",
	init : function(obj){
		__.bindAll(this, 'switchOnAfter', 'switchOffAfter')
		this._super.apply(this, arguments);
		this.pendingSwitchOn=null;
		this.pendingSwitchOff=null;
		this.switchOnJob=null;
		this.switchOffJob=null;
		obj && obj.switchOnAt && this.switchOnAt(obj.switchOnAt);
		obj && obj.switchOffAt && this.switchOffAt(obj.switchOffAt);
		obj && obj.switchOnAfter && this.switchOnAfter(obj.switchOnAfter);
		obj && obj.switchOffAfter && this.switchOffAfter(obj.switchOffAfter);
	},
	cancleSwitchOnAt : function () {
		this.switchOnJob && this.switchOnJob.stop();
	},
	switchOnAt : function (pattern, callback) {	// '00 30 11 * * 1-5' 11:30, 5 days a week
		this.cancleSwitchOnAt();
		this.switchOnJob = new CronJob({
			cronTime: pattern,
			onTick: __.bind(function () {this.switchOn(); callback && callback();}, this),
			start: true
		});
	},
	cancleSwitchOffAt : function () {
		this.switchOffJob && this.switchOffJob.stop();
	},
	switchOffAt : function (pattern, callback) {	// '00 30 11 * * 1-5' 11:30, 5 days a week
		this.cancleSwitchOffAt();
		this.switchOffJob = new CronJob({
			cronTime: pattern,
			onTick: __.bind(function () {this.switchOff(); callback && callback();}, this),
			start: true
		});
	},
	switchOnAfter : function (timeInSeconds, beforeAction, afterAction) {
		clearTimeout(this.pendingSwitchOn);
		this.pendingSwitchOn = setTimeout(__.bind(function () {
			beforeAction && beforeAction();
			this.switchOn();
			afterAction && afterAction();
		}, this), timeInSeconds*1000)
	},
	switchOffAfter : function (timeInSeconds, beforeAction, afterAction) {
	//	console.log("switchOffAfter called");
		clearTimeout(this.pendingSwitchOff);
		this.pendingSwitchOff = setTimeout(__.bind(function () {
			beforeAction && beforeAction();
			this.switchOff();
			afterAction && afterAction();
		}, this), timeInSeconds*1000)
	},

});

module.exports = TimerSwitch;