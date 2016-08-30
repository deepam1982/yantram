var __ = require("underscore");
var BasicConfigManager = require(__rootPath+"/classes/configs/basicConfigManager");
var lircManager = require(__rootPath+"/classes/lirc/lircFileManager");
var DevInfoConfigManager = BasicConfigManager.extend({
	file : '/../configs/remoteDeviceInfoConfig.json',
	getList : function () {
		var data = [];
		__.each(this.toJSON(), function (conf, id) {
			conf.id = id;
			data.push(__.omit(conf,"category", "deviceCode", "loads"));
		});

		var ipCamaraConfig = require(__rootPath+"/classes/configs/ipCamaraConfig");
		var camdata = {"id":"ipCamaras", "name":"Ip Cameras", "loadInfo":{}}
		__.each(ipCamaraConfig.data, function(conf, id){
			camdata.loadInfo[id]={"type":"ipCam", "icon":conf.icon ||"ipCam", "devId":"ipCamaras", "name":conf.name}
		})
		data.push(camdata);

		var irBlasterConfig = require(__rootPath+"/classes/configs/irBlasterConfig");
		var irBlstrData = {"id":"irBlasters", "name":"Ir Blasters", "loadInfo":{}}
		__.each(irBlasterConfig.data, function(conf, id){
			irBlstrData.loadInfo[id]={"type":"irBlstr", "icon":conf.icon ||"irBlaster", "devId":"irBlasters", "name":conf.name}
		})
		data.push(irBlstrData);

		var irRemoteConfig = require(__rootPath+"/classes/configs/irRemoteConfig");
		var irRemData = {"id":"irRemotes", "name":"Ir Remotes", "loadInfo":{}}
		__.each(irRemoteConfig.data, function(conf, id){
			irRemData.loadInfo[id]={"type":"irRem", "icon":conf.icon ||"remote_default", "devId":"irRemotes", "name":conf.name, "id":id, "editable" : lircManager.isEditable(conf.lirc)}
		})
		data.push(irRemData);

		return data;
	}
})
if (typeof deviceInfoConfig == 'undefined') deviceInfoConfig = new DevInfoConfigManager();
module.exports = deviceInfoConfig;
