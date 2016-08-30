var __ = require("underscore");
var BasicConfigManager = require(__rootPath+"/classes/configs/basicConfigManager");
var IrRemoteConfigManager = BasicConfigManager.extend({
	file : '/../configs/irRemoteConfig.json',
	deleteRemotesOfFile : function(fileName, calback) {
		var remIds = [];
		__.each(this.toJSON(), function (conf, id) {
			if(conf.lirc == fileName) remIds.push(id);
		});
		console.log('deleting found remotes from blaster configs');
		var irBlasterConfig = require(__rootPath+"/classes/configs/irBlasterConfig");
		irBlasterConfig.removeRemotes(remIds, __.bind(function(err){
			if(err) {console.log(err); return calback && calback(err)}
			console.log('deleting remotes of ids', remIds);
			__.each(remIds, function(id){
				this.data = __.omit(this.data, id+"");
			}, this)
			this.save(calback);			
		}, this));
	},
	createIrRemote : function (filename, calback) {
		var id = "" + (1 + __.max(__.map(__.keys(this.data), function(i){return parseInt(i)})));
		var data = {"name": filename,"icon": "remote_default","lirc": filename};
		this.set(id, data);
		data = this.get(id); //for cloning
		data.id=id;
		this.save(function(err) {
			calback && calback(err, err?"":data);
		})
	}
});
if (typeof irRemoteConfig == 'undefined') irRemoteConfig = new IrRemoteConfigManager();
module.exports = irRemoteConfig;