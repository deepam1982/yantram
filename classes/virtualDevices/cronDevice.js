var BaseVirtualDevice = require(__rootPath+"/classes/virtualDevices/baseDevice");
var __ = require("underscore");
var CronJob = require('cron').CronJob;
var CronDevice = BaseVirtualDevice.extend({
	className : "CronDevice",
	init : function(obj){
		this._super.apply(this, arguments);
		this.switchOnJob=null;
		this.switchOffJob=null;
		obj && obj.switchOnAt && this.switchOnAt(obj.switchOnAt);
		obj && obj.switchOffAt && this.switchOffAt(obj.switchOffAt);
		if (this.switchOnJob && this.switchOffJob)
			this.setState(this.switchOffJob.cronTime.getTimeout() <= this.switchOnJob.cronTime.getTimeout());
	},
	cancleSwitchOnAt : function () {
		this.switchOnJob && this.switchOnJob.stop();
	},
	switchOnAt : function (pattern, callback) {	// '00 30 11 * * 1-5' 11:30, 5 days a week
		this.cancleSwitchOnAt();
		this.switchOnJob = new CronJob({
			cronTime: pattern,
			onTick: __.bind(function () {this._switchOn(); callback && callback();}, this),
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
			onTick: __.bind(function () {this._switchOff(); callback && callback();}, this),
			start: true
		});
	},
})

module.exports = CronDevice;