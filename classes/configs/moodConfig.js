var __ = require("underscore");
var BasicConfigManager = require(__rootPath+"/classes/configs/basicConfigManager");
var groupConfig = require(__rootPath+"/classes/configs/groupConfig");
var MoodConfigManager = BasicConfigManager.extend({
	file : '/../configs/moodConfig.json',
	getMoodIdByName : function(name) {
		var moodId = null;
		for(var key in this.data) {
			if(this.data[key].name == name){
				moodId = key;break;	
			}
		}
		return moodId;
	},
	getMoodDetails : function (id) {
		var keys = __.keys(this.data);
		var count = keys.length;
		var mood = JSON.parse(JSON.stringify(this.data[id]));
		mood.rank || (mood.rank = (__.indexOf(keys, id+'')+1));
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
	},
	getSingleGroupMoods : function () {
		if(this._singleGroupMoods) return this._singleGroupMoods;
		this._singleGroupMoods = this._getSingleGroupMoods();
		return this._singleGroupMoods;
	},
	_getSingleGroupMoods : function () {
		var retObj = [];
		__.each(this.toJSON(), function (mood, id) {
			var cmnGroups = []
			for (var indx in mood.controls){
				var ctrl = mood.controls[indx];
				var groups = groupConfig.getGroupsHavingDevice(ctrl.devId, [parseInt(ctrl.switchId)]);
				if(!cmnGroups.length) cmnGroups = groups;
				cmnGroups = __.intersection(cmnGroups,groups);
				if(!cmnGroups.length) break;
			};
			if(cmnGroups.length){
				retObj.push({'id':id, groups:cmnGroups, 'icon':mood.icon,'name':mood.name})
			}
		}, this);
		return retObj;
	},
	save : function (callback) {
		this._singleGroupMoods = this._getSingleGroupMoods();
		return BasicConfigManager.prototype.save.apply(this, arguments);
	}


})
if (typeof moodConfig == 'undefined') moodConfig = new MoodConfigManager();
module.exports = moodConfig;
