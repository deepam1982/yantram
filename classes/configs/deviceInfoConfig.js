var __ = require("underscore");
var BasicConfigManager = require(__rootPath+"/classes/configs/basicConfigManager");
var DevInfoConfigManager = BasicConfigManager.extend({
	file : '/../configs/remoteDeviceInfoConfig.json',
	getList : function () {
		var ipCamaraConfig = require(__rootPath+"/classes/configs/ipCamaraConfig");
		var data = [];
		__.each(this.toJSON(), function (conf, id) {
			conf.id = id;
			data.push(__.omit(conf,"category", "deviceCode", "loads"));
		});
		var camdata = {"id":"ipCamaras", "name":"Ip Cameras", "loadInfo":{}}
		__.each(ipCamaraConfig.data, function(conf, id){
			camdata.loadInfo[id]={"type":"ipCam", "icon":conf.icon ||"ipCam", "devId":"ipCamaras", "name":conf.name}
		})
		data.push(camdata);
		return data;
	}
})
if (typeof deviceInfoConfig == 'undefined') deviceInfoConfig = new DevInfoConfigManager();
module.exports = deviceInfoConfig;
