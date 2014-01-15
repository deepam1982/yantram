var __ = require("underscore");
var BaseConfigManager = require(__rootPath+"/configs/managers/baseManager");
var DeviceConfigManager = BaseConfigManager.extend({
	path : '/configs/deviceConfig.json'
})
if (typeof deviceConfigManager == 'undefined') deviceConfigManager = new DeviceConfigManager();
module.exports = deviceConfigManager;
