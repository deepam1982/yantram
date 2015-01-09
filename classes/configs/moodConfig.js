var __ = require("underscore");
var BasicConfigManager = require(__rootPath+"/classes/configs/basicConfigManager");
var groupConfig = require(__rootPath+"/classes/configs/groupConfig");
var MoodConfigManager = BasicConfigManager.extend({
	file : '/../configs/moodConfig.json',
	getList : function () {
		var data = [];
		var count = __.keys(this.data).length;
		__.each(this.toJSON(), function (conf, id) {
			var mood = JSON.parse(JSON.stringify(conf));
			mood.count = count;
			mood.id=id;
			__.each(mood.controls, function (ctrl, indx){
				ctrl.groupInfo = groupConfig.getGroupInfo(ctrl.devId, ctrl.switchId);	
			}, this);
			data.push(mood);
		});
		return data;
	}

})
if (typeof moodConfig == 'undefined') moodConfig = new MoodConfigManager();
module.exports = moodConfig;
