var Timer = require(__rootPath+"/classes/virtualDevices/timer");
var __ = require("underscore");

var Stabilizer = Timer.extend({
	className : "SmartMotionSensor",
	init : function(obj){
		this.defaultTime = (obj && obj.defaultTime)?obj.defaultTime:15; // 15 sec
		this.mnStTm = this.defaultTime;
		this._super.apply(this, arguments);
		__.bindAll(this, "_setMaintainState", "_reduceMaintainStateTime");
		this.on("switchOn", this._setMaintainState);
		this.on("switchOff", this._reduceMaintainStateTime);
	},
	_setMaintainState : function () {
		clearTimeout(this.timeoutToResetmnStTm);
		var curTmSmp = new Date().getTime()/1000;
		var tdif = (!this.lastTmSmp)?0:curTmSmp-this.lastTmSmp;
		this.lastTmSmp = curTmSmp;
		if((!this.maintainState && this.swOffCldAt && curTmSmp-this.swOffCldAt < 10) || 
			(Math.max(0.60*this.mnStTm, this.mnStTm-200) < tdif && tdif <= this.mnStTm)) 
				this.mnStTm = (this.mnStTm < 480)?(this.mnStTm*2):(this.mnStTm*1.5);
		if(this.maxTime) this.mnStTm = Math.min(this.mnStTm, this.maxTime);
		console.log(this.className, this.id, "Switch off after  -", this.mnStTm);
		this.maintainState = true;
		this.switchOffAfter(this.mnStTm, __.bind(function () {
			this.maintainState = false;
			this.swOffCldAt = new Date().getTime()/1000;
			this._reduceMaintainStateTime();
		}, this))
	},
	_reduceMaintainStateTime : function () {
		if(this.maintainState) {
			this._setMaintainState();
			return;
		}
		var curTmSmp = new Date().getTime()/1000;
		var tdif = curTmSmp-this.lastTmSmp;
		if(1.75 * this.mnStTm < tdif) this.mnStTm *= 0.5;
		this.lastTmSmp = curTmSmp;
		this.mnStTm = Math.max(this.mnStTm, this.defaultTime);
		console.log(this.id+" Sensor.mnStTm - "+this.mnStTm);
		if (this.defaultTime < this.mnStTm) {
			clearTimeout(this.timeoutToResetmnStTm);
			this.timeoutToResetmnStTm = setTimeout(this._reduceMaintainStateTime, 2*this.mnStTm*1000); 
		}
	}
});

module.exports = Stabilizer;