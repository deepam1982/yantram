var BaseVirtualDevice = require(__rootPath+"/classes/virtualDevices/baseDevice");
var __ = require("underscore");
var CurtainControl = BaseVirtualDevice.extend({
	className : "CurtainControl",
	init 	: 	function (obj) {
		this._super.apply(this, arguments);
		var opnSwtId = obj.switches[0].id, cloSwtId = obj.switches[1].id; 
		this.follow(obj.switches, opnSwtId+"||"+cloSwtId, "!"+opnSwtId+" && !"+cloSwtId)
	}
});
module.exports = CurtainControl;