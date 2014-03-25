var BaseVirtualDevice = require(__rootPath+"/classes/virtualDevices/baseDevice");
var __ = require("underscore");
var Sensor = BaseVirtualDevice.extend({
	className : "Sensor",
	init : function(obj){
		this._super.apply(this, arguments);
		this.on("stateChanged", __.bind(function () {this.stateChangedCalled = true}, this));
	},
	_setState : function (state, force) {
		this._super.apply(this, arguments);
		if (!this.stateChangedCalled && state) this.onStateChange(force);
		this.stateChangedCalled = false;
	}
});

module.exports = Sensor;