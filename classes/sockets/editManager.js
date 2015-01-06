var __ = require("underscore");
var BaseClass = require(__rootPath+"/classes/baseClass");
var groupConfig = require(__rootPath+"/classes/configs/groupConfig");
var moodConfig = require(__rootPath+"/classes/configs/moodConfig");
var deviceManager = require(__rootPath+'/classes/devices/deviceManager');
var deviceInfoConfig = require(__rootPath+"/classes/configs/deviceInfoConfig");
var timerConfig = require(__rootPath+"/classes/configs/timerConfig");

var EditManager = BaseClass.extend({
	init : function (obj) {
		__.bindAll(this, "onLocalConnection");
		this.localIo = obj.localIo;
		this.localIo.sockets.on('connection', this.onLocalConnection);
	},
	onLocalConnection : function (socket) {
		socket.on('setSwitchParam', __.bind(this.modifySwitchParam, this));
		socket.on('modifyGroup', __.bind(this.modifyGroup, this));
		socket.on('modifyMood', __.bind(this.modifyMood, this));
	},
	modifyMood : function (obj, callback) {
		if((parseInt(obj.id) && !moodConfig.get(obj.id)) || !obj.name || !obj.icon || !obj.controls || !__.isArray(obj.controls))
			return callback && callback({'success':false, 'msg':'invalid parameters'});
		var invalidParams = false, controls=[], id=0;
		__.each(obj.controls, function (ctrl) {
			if(!ctrl.devId || typeof ctrl.switchId == "undefined" || !deviceInfoConfig.get(ctrl.devId) || deviceInfoConfig.get(ctrl.devId+".loads.normal") < parseInt(ctrl.switchId))
				return invalidParams = true;
			controls.push({"id":++id, "devId":ctrl.devId, "switchId":ctrl.switchId, "state":(ctrl.state)?"on":"off"})
		}, this);
		if(invalidParams) return callback && callback({'success':false, 'msg':'invalid parameters1'});
		obj.id = Math.max(parseInt(obj.id), 0);
		if(!obj.id) obj.id = 1 + __.max(__.map(moodConfig.data, function (val, key){return parseInt(key)}));
		obj.id = Math.max(obj.id, 1);
		if(controls.length)
			moodConfig.set(obj.id+"", {"name":obj.name, "controls":controls, "icon":obj.icon});
		else
			moodConfig.data = __.omit(moodConfig.data, obj.id+"");
		moodConfig.save(function (err) {
			if(err) return callback && callback({'success':false, 'msg':err});
			callback && callback({'success':true});
			deviceManager.emit('moodConfigChanged', moodConfig.data);
		});

	},
	modifyGroup : function (obj, callback) {
		if((parseInt(obj.id) && !groupConfig.get(obj.id)) || !obj.name || !obj.controls || !__.isArray(obj.controls))
			return callback && callback({'success':false, 'msg':'invalid parameters'});
		var invalidParams = false, controls=[], id=0;
		__.each(obj.controls, function (ctrl) {
			if(!ctrl.devId || typeof ctrl.switchID == "undefined" || !deviceInfoConfig.get(ctrl.devId) || deviceInfoConfig.get(ctrl.devId+".loads.normal") < parseInt(ctrl.switchID))
				return invalidParams = true;
			controls.push({"id":++id, "devId":ctrl.devId, "switchID":ctrl.switchID})
		}, this);
		if(invalidParams) return callback && callback({'success':false, 'msg':'invalid parameters1'});
		obj.id = Math.max(parseInt(obj.id), 0);
		if(!obj.id) obj.id = 1 + __.max(__.map(groupConfig.data, function (val, key){return parseInt(key)}));
		obj.id = Math.max(obj.id, 1);
		if(controls.length)
			groupConfig.set(obj.id+"", {"name":obj.name, "controls":controls});
		else
			groupConfig.data = __.omit(groupConfig.data, obj.id+"")	;

		var rank = parseInt(obj.rank || 0), rankObj=null;
		if(rank && rank != parseInt(obj.id)) rankObj = groupConfig.get(obj.id+"");
		var newData = {}, nwId=1;
		__.each(groupConfig.data, function (group, key) {
			if(rankObj && nwId == rank) newData[""+(nwId++)] = rankObj;
			if(rankObj !== group) newData[""+(nwId++)] = group;
		});
		if(rankObj && nwId == rank) newData[""+(nwId++)] = rankObj;

		groupConfig.data = newData;
		groupConfig.save(function (err) {
			if(err) return callback && callback({'success':false, 'msg':err});
			callback && callback({'success':true});
			deviceManager.emit('deviceStateChanged');
		});

	},
	allowedSwitchParams : ["type", "icon", "devId", "name"],
	modifySwitchParam : function (obj, callback) {
		if(!deviceInfoConfig.get(obj.devId+".loadInfo."+obj.switchId)) 
			return callback && callback({'success':false, 'msg':'device do not exist'});
		if(obj.params.autoOff) { //TODO this piece of code should not be along with deviceInfoConfig
			return timerConfig.setAutoOffParams(obj.devId, obj.switchId, obj.params.autoOff, function (err) {
				if(err) return (callback && callback({'success':false, 'msg':err}));
				callback && callback({'success':true});
				deviceManager.emit('deviceStateChanged');
			});
		}
		if(obj.params.schedule) { //TODO this piece of code should not be along with deviceInfoConfig
			return timerConfig.setSchedule(obj.devId, obj.switchId, obj.params.schedule, function (err) {
				if(err) return (callback && callback({'success':false, 'msg':err}));
				callback && callback({'success':true});
				deviceManager.emit('deviceStateChanged');
			});
		}
		__.each(obj.params, function (val, key) {
			if(__.indexOf(this.allowedSwitchParams, key) == -1) 
				return callback && callback({'success':false, 'msg':'invalid key'});
		});
		__.each(obj.params, function (val, key) {
			deviceInfoConfig.set(obj.devId+".loadInfo."+obj.switchId+'.'+key, val)
		});
		deviceInfoConfig.save(function (err) {
			if(err) return callback && callback({'success':false, 'msg':err});
			callback && callback({'success':true});
			deviceManager.emit('deviceStateChanged');
		});
	}


});

module.exports = EditManager;
