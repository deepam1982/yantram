var __ = require("underscore");
var BasicConfigManager = require(__rootPath+"/classes/configs/basicConfigManager");
var IpCamaraConfigManager = BasicConfigManager.extend({
	file : '/../configs/ipCamaraConfig.json'

});
if (typeof ipCamaraConfig == 'undefined') ipCamaraConfig = new IpCamaraConfigManager();
module.exports = ipCamaraConfig;
