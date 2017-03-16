var __ = require("underscore");
var BasicConfigManager = require(__rootPath+"/classes/configs/basicConfigManager");
var IrBlasterConfigManager = BasicConfigManager.extend({
	file : '/../configs/irBlasterConfig.json',
	onNewDeviceFound : function(id, data, calback){
		if(!this.get(id)) {
			var conf = {"name": data.name, "macAddr": id, "category": data.type, "icon": "defaultIr", "remotes":[]}
			if (data.type == "IRWIFI01") conf.icon = "irBlaster";
			if (data.type == "ZMT2") {
				__.extend(conf, {"category":"ZMOTE01", "icon": "zmote", "uuid":data.uuid, "name":"Blstr_"+data.uuid.substr(6)});
			}
			this.set(id, conf);
			//return this.save(calback); dont save. but update the time stamp
			this.updateTs = new Date;
			return calback(null);
		}
		calback && calback("device already exist!")
	},
	removeRemotes : function (remoteIds, calback) {
		if(!__.isArray(remoteIds)) remoteIds = [remoteIds];
		__.each(this.data, function (conf, id) {
			conf.remotes = __.difference(conf.remotes, remoteIds);
		});
		this.save(calback);
	}

});
if (typeof irBlasterConfig == 'undefined') irBlasterConfig = new IrBlasterConfigManager();
module.exports = irBlasterConfig;
