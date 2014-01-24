var TimerSwitch = require(__rootPath+"/classes/virtualDevices/timerSwitch");
var __ = require("underscore");

var SmartMotionSensor = TimerSwitch.extend({
	className : "SmartMotionSensor",
	init : function(obj){
		this.defaultTime = (obj && obj.defaultTime)?obj.defaultTime:15; // 15 sec
		this.offTime = this.defaultTime;
		this._super.apply(this, arguments);
		__.bindAll(this, "_setSwitchOffTime", "_resetOffTime");
		this.on("switchOn", this._setSwitchOffTime);
		this.on("switchOff", this._resetOffTime);
	},
	_setSwitchOffTime : function () {
		this.maintainState = true;
		clearTimeout(this.timeoutToResetOffTime);
		var curTmSmp = new Date().getTime()/1000;
		!this.lastTmSmp && (this.lastTmSmp = curTmSmp);
		var tdif = curTmSmp-this.lastTmSmp;
		this.lastTmSmp = curTmSmp;
		if(tdif < 1.25 * this.offTime && tdif > 0.60 * this.offTime) this.offTime *= 2;
		console.log("Switch off after  - "+this.offTime);
		this.switchOffAfter(this.offTime, __.bind(function () {this.maintainState = false;}, this))
	},
	_resetOffTime : function () {
		var curTmSmp = new Date().getTime()/1000;
		var tdif = curTmSmp-this.lastTmSmp;
		if(!( 0.75 * this.offTime < tdif && tdif < 1.25 * this.offTime)) {
			this.offTime *= 0.5;
			this.lastTmSmp = curTmSmp; // so that it takes double time to reduce the offTime.
		}
		this.offTime = Math.max(this.offTime, this.defaultTime);
		console.log("Sensor.offTime - "+this.offTime);
		if (this.defaultTime < this.offTime) {
			clearTimeout(this.timeoutToResetOffTime);
			this.timeoutToResetOffTime = setTimeout(this._resetOffTime, this.offTime*1000); 
		}
	}
});

module.exports = SmartMotionSensor;