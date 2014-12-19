var Timer = require(__rootPath+"/classes/virtualDevices/timer");
var __ = require("underscore");

var AutoOffTimer = Timer.extend({
	className : "AutoOffTimer",
	init : function(obj){
		this.setSwitchOffAfter(obj.switchOffAfter);
		this._super.apply(this, arguments);
	},
	setSwitchOffAfter : function (timeInSec) {
		this.onTime = timeInSec;
	},
	_setState : function (state, force) {
		this._super.apply(this, arguments);
		if(this.state)
			this.switchOffAfter(this.onTime);
	}
});
module.exports = AutoOffTimer;