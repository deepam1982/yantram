var __ = require("underscore");
var BasicConfigManager = require(__rootPath+"/classes/configs/basicConfigManager");
var groupConfig = require(__rootPath+"/classes/configs/groupConfig");
var MoodConfigManager = BasicConfigManager.extend({
	file : '/../configs/moodConfig.json',
	getMoodDetails : function (id) {
		var count = __.keys(this.data).length;
		var mood = JSON.parse(JSON.stringify(this.data[id]));
		mood.count = count;
		mood.id=id+''; // id has to be string;
		__.each(mood.controls, function (ctrl, indx){
			ctrl.groupInfo = groupConfig.getGroupInfo(ctrl.devId, ctrl.switchId);	
		}, this);
		return mood;
	},
	getList : function () {
		var data = [];
		var count = __.keys(this.data).length;
		__.each(this.toJSON(), function (conf, id) {
			data.push(this.getMoodDetails(id));
		}, this);
		return data;
	}

})
if (typeof moodConfig == 'undefined') moodConfig = new MoodConfigManager();
module.exports = moodConfig;
