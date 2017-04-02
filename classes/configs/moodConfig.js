var __ = require("underscore");
var BasicConfigManager = require(__rootPath+"/classes/configs/basicConfigManager");
var groupConfig = require(__rootPath+"/classes/configs/groupConfig");
var MoodConfigManager = BasicConfigManager.extend({
	file : '/../configs/moodConfig.json',
	editMood : function (iObj, calback) {
		var moodData = null;
		if(iObj.id) moodData = this.data[iObj.id];
		if(!moodData) {
			iObj.id = 1 + __.max(__.map(this.data, function (v, k){return parseInt(k)}));
			var rank = 1 + __.max(__.map(this.data, function (v, k){return v.rank}));
			this.set(iObj.id+"", moodData={"name":"mood", "icon":"meditate","rank":rank, "controls" :[]});
		}
		__.extend(moodData, __.pick(iObj, "name", "icon", "customIcon"));
		if(iObj.rank) {
			var maxRank = __.max(__.map(this.data, function (v, k){return v.rank}));
			moodData.rank = 1+maxRank; // shift the object to last rank
			iObj.rank = Math.min(maxRank, Math.max(0, parseInt(iObj.rank))); // make sure rank is not out of range
			__.each(__.sortBy(__.values(this.data), 'rank'), function (data, indx) {
				data.rank = (indx+1 < iObj.rank)?(indx+1):(indx+2);
			});
			moodData.rank = iObj.rank; // shift the object to correct rank
		}
		this.emit('moodConfigChanged', iObj.id);
		this.save(function(err) {calback&&calback(err, iObj.id);});
	},
	deleteMood : function (mId, calback) {
		var moodData = this.data[mId+""];
		if(!moodData) return calback && calback("invalid mood id!");
		this.emit('moodDeleteStart', mId);
		this.data = __.omit(this.data, mId+"");
		this.emit('moodConfigChanged');
		this.emit('moodDeleted', mId);
		this.save(calback);
	},
	addToMood : function (mId, devId, loadId, state, calback){
		var moodData = this.data[mId+""];
		if(!moodData) return calback && calback("invalid mood id!");
		var ctrls = moodData.controls;
		var ctrlId, ctrl = __.where(moodData.controls, {"devId":devId, "switchId":loadId});
		ctrl = (ctrl.length)?ctrl[0]:{"devId":devId, "switchId":loadId};
		ctrl.state = state;
		if(!(ctrlId=ctrl.id)) {
			moodData.controls.push(__.extend({"id":ctrlId=moodData.controls.length+1}, ctrl))
		}
		this.emit('moodConfigChanged', ctrlId);
		this.save(calback);
	},
	removeFromMood : function (mId, devId, loadId, calback){
		var moodData = this.data[mId+""];
		if(!moodData) return calback && calback("invalid mood id!");
		var ctrls = moodData.controls;
		var objArr = __.where(ctrls, {"devId":devId, "switchId":loadId})
		if(objArr.length){
			moodData.controls = __.without(ctrls, objArr[0])
			var ctrlId = null;
			__.each(moodData.controls, function(obj, indx){ctrlId=obj.id=indx+1;});
			this.emit('moodConfigChanged', ctrlId);
		}
		this.save(calback);
	},
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
	getMoodList : function() {
		var arr = [];
		__.each(this.data, function(mData, id){
			var retData = __.extend({"id":id}, __.pick(mData, "name", "icon", "rank"));
			var cntls = [];
			__.each(mData.controls, function(ctrl, indx){
				if(ctrl.devId=='irBlasters') {
					cntls.push({"id":ctrl.switchId, "state":ctrl.irCodes});
				}
				else cntls.push({"id":__remoteDevInfoConf.getLoadId(ctrl.devId,ctrl.switchId), "state":ctrl.state}); 
			});
			retData.controls = cntls;
			arr.push(retData)
		});
		return arr;
	},
	getList : function () {
		var maxUpdateTs = Math.max(this.updateTs, groupConfig.updateTs)
		if(!this.moodListData || this.moodDataTs < maxUpdateTs) {
			this.moodDataTs = maxUpdateTs;
			this.moodListData = [];
			var count = __.keys(this.data).length;
			__.each(this.toJSON(), function (conf, id) {
				this.moodListData.push(this.getMoodDetails(id));
			}, this);
		}
		return this.moodListData;
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
