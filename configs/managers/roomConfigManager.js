var __ = require("underscore");
var deviceManager = require(__rootPath+'/classes/devices/deviceManager');
var BaseConfigManager = require(__rootPath+"/configs/managers/baseManager");
var RoomConfigManager = BaseConfigManager.extend({
	path : '/../configs/roomConfig.json',
	getList : function () {
		__.each(this.data, function (conf) {    
			__.each(conf.controls, function (ctl) {
				var config = deviceManager.getConfig(ctl.devId); 
				ctl.state = (!config)?false:config[ctl.devId]["switch"][ctl.switchID]["state"];
				ctl.state = (ctl.state)?'on':'off';
				if (ctl.state == 'on' && (ctl.switchID == 0 || ctl.switchID == 1)) {
					ctl.duty = config[ctl.devId]["dimmer"][ctl.switchID]["state"];
					ctl.state = 'high';
					if (ctl.duty < 0x77) ctl.state = 'mid';
					if (ctl.duty < 0x55) ctl.state = 'on';
				}
			});
		});
		return this.data;
	}
})
if (typeof roomConfigManager == 'undefined') roomConfigManager = new RoomConfigManager();
module.exports = roomConfigManager;
