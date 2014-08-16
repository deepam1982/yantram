var __ = require("underscore");
var deviceManager = require(__rootPath+'/classes/devices/deviceManager');
var BasicConfigManager = require(__rootPath+"/configs/managers/baseManager");
var GroupConfigManager = BasicConfigManager.extend({
	path : '/../configs/groupConfig.json',
	getList : function () {
		var data = [];
		__.each(this.toJSON(), function (conf, id) {
			conf.id = id;
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
			data.push(conf);
		});
		return data;
	}
})
if (typeof groupConfig == 'undefined') groupConfig = new GroupConfigManager();
module.exports = groupConfig;
