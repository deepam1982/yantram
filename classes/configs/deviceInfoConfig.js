var __ = require("underscore");
var BasicConfigManager = require(__rootPath+"/classes/configs/basicConfigManager");
var DevInfoConfigManager = BasicConfigManager.extend({
	file : '/../configs/remoteDeviceInfoConfig.json',
	getList : function () {
		var data = [];
		__.each(this.toJSON(), function (conf, id) {
			conf.id = id;
			data.push(__.omit(conf,"category", "deviceCode", "loads"));
		});
		return data;
	}
})
if (typeof deviceInfoConfig == 'undefined') deviceInfoConfig = new DevInfoConfigManager();
module.exports = deviceInfoConfig;
