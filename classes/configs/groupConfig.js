var __ = require("underscore");
var deviceManager = require(__rootPath+'/classes/devices/deviceManager');
var BasicConfigManager = require(__rootPath+"/classes/configs/basicConfigManager");
var GroupConfigManager = BasicConfigManager.extend({
	file : '/../configs/groupConfig.json',
	getList : function () {
		var data = [];
		var count = __.keys(this.data).length;
		__.each(this.toJSON(), function (conf, id) {
			conf.id = id;
			conf.count = count;
			__.each(conf.controls, function (ctl) {

				__.each(__remoteDevInfoConf.get(ctl.devId+'.loadInfo.'+ctl.switchID), function (val, key) {
					ctl[key] = val;	
				});
				var config = deviceManager.getConfig(ctl.devId); 
				ctl.state = (!config)?false:config[ctl.devId]["switch"][ctl.switchID]["state"];
				ctl.state = (ctl.state)?'on':'off';
				if (ctl.state == 'on' && (ctl.switchID == 0 || ctl.switchID == 1)) {
					ctl.duty = config[ctl.devId]["dimmer"][ctl.switchID]["state"];
					// ctl.state = 'high';
					// if (ctl.duty < 180) ctl.state = 'mid';
					// if (ctl.duty < 100) ctl.state = 'on';
				}
			});
			data.push(conf);
		});
		return data;
	}
})
if (typeof groupConfig == 'undefined') groupConfig = new GroupConfigManager();
module.exports = groupConfig;
