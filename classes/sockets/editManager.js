var __ = require("underscore");
var BaseClass = require(__rootPath+"/classes/baseClass");
var groupConfig = require(__rootPath+"/classes/configs/groupConfig");
var moodConfig = require(__rootPath+"/classes/configs/moodConfig");
var deviceManager = require(__rootPath+'/classes/devices/deviceManager');
var deviceInfoConfig = require(__rootPath+"/classes/configs/deviceInfoConfig");
var timerConfig = require(__rootPath+"/classes/configs/timerConfig");
var ipCamaraConfig = require(__rootPath+"/classes/configs/ipCamaraConfig");

var EditManager = BaseClass.extend({
	init : function (obj) {
		__.bindAll(this, "onLocalConnection");
		this.localIo = obj.localIo;
		this.localIo.sockets.on('connection', this.onLocalConnection);
	},
	setCloudSocket	: 	function (cloudSocket) {
		this.cloudSocket = cloudSocket;
		this.onCommonConnection(cloudSocket);
	},
	onLocalConnection : function (socket) {
		this.onCommonConnection(socket);
	},
	onCommonConnection : function (socket) {
		socket.on('setSwitchParam', __.bind(this.modifySwitchParam, this));
		socket.on('modifyGroup', __.bind(this.modifyGroup, this));
		socket.on('modifyMood', __.bind(this.modifyMood, this));
		socket.on('editIpCamaraData', __.bind(this.editIpCamaraData, this));
		socket.on('getIpCamaraData', __.bind(this.getIpCamaraData, this));
	},
	getIpCamaraData : function (callback) {
		callback({'success':true, 'data':ipCamaraConfig.data});		
	},
	modifyIpCamaraParam : function (obj, callback) {
		var curObj=ipCamaraConfig.get(obj.switchId+"")
		, params=__.pick(obj.params, __.keys(curObj));
		__.extend(curObj, params);
		callback && callback({'success':true}); // dont hold the calback to wait for save ... it will block the socket	
		__.defer(function (){
			ipCamaraConfig.set(obj.switchId+"", curObj);
			ipCamaraConfig.save(function (err) {if(err) console.log(err);});
			deviceManager.emit('deviceStateChanged', obj.devId, null, 'switchParams');
		}, this);
	},
	editIpCamaraData : function (obj, callback) {
		var curObj;
		if((parseInt(obj.id) && !(curObj=ipCamaraConfig.get(obj.id))) || !obj.name || !obj.ip || !obj.videoPath)
			return callback && callback({'success':false, 'msg':'invalid parameters'});
		callback && callback({'success':true}); // dont hold the calback to wait for save ... it will block the socket	
			obj.icon= obj.icon || ((curObj && curObj.icon)?curObj.icon:'ipCam');
		__.defer(function (){
			obj.id = Math.max(parseInt(obj.id), 0);
			if(!obj.id) obj.id = 1 + __.max(__.map(ipCamaraConfig.data, function (val, key){return parseInt(key)}));
			obj.id = Math.max(obj.id, 1);
			ipCamaraConfig.set(obj.id+"", __.omit(obj,"id"));
			ipCamaraConfig.save(function (err) {if(err) console.log(err);});
		}, this);
	},		
	modifyMood : function (obj, callback) {
		var curObj;
		if((parseInt(obj.id) && !(curObj=moodConfig.get(obj.id))) || !obj.name || !obj.icon || !obj.controls || !__.isArray(obj.controls))
			return callback && callback({'success':false, 'msg':'invalid parameters'});
		var invalidParams = false, controls=[], id=0;
		var hashToAvoidDuplicate = {};
		__.each(obj.controls, function (ctrl) {
			if(!ctrl.devId || typeof ctrl.switchId == "undefined" || !deviceInfoConfig.get(ctrl.devId) || deviceInfoConfig.get(ctrl.devId+".loads.normal") < parseInt(ctrl.switchId))
				return invalidParams = true;
			var uniqueKey = ctrl.devId+'-'+ctrl.switchId;
			if(!__.has(hashToAvoidDuplicate, uniqueKey)) {
				hashToAvoidDuplicate[uniqueKey] = true;
				controls.push({"id":++id, "devId":ctrl.devId, "switchId":ctrl.switchId, "state":(ctrl.state)?"on":"off"});
			}
		}, this);
		if(invalidParams) return callback && callback({'success':false, 'msg':'invalid parameters1'});
		callback && callback({'success':true}); // dont hold the calback to wait for save ... it will block the socket
		__.defer(function (){
			obj.id = Math.max(parseInt(obj.id), 0);
			if(!obj.id) obj.id = 1 + __.max(__.map(moodConfig.data, function (val, key){return parseInt(key)}));
			obj.id = Math.max(obj.id, 1);
			if(controls.length)
				moodConfig.set(obj.id+"", {"name":obj.name, "controls":controls, "icon":obj.icon});
			else{
				moodConfig.emit('moodDeleteStart', obj.id);
				moodConfig.data = __.omit(moodConfig.data, obj.id+"");
			}

			var rankObj=moodConfig.data[obj.id+""]//moodConfig.get(obj.id+"")
			, rank = ((rankObj)?parseInt(obj.rank):Infinity) || 1, 
			currentRank =(curObj)?curObj.rank:0, rankModified=(rank != currentRank);
			
			var dataArr = __.sortBy(__.values(moodConfig.data), 'rank');
			__.each(dataArr, function (data, indx) {
				if(__.isEqual(data, rankObj)) return data.rank = rank;
				if (indx+1 < rank) return data.rank = indx+1;
				return data.rank = indx+2;
			});
			if(rankModified || !controls.length) moodConfig.emit('moodConfigChanged');
			else moodConfig.emit('moodConfigChanged', obj.id);
			if(!controls.length) moodConfig.emit('moodDeleted', obj.id);
			moodConfig.save(function (err) {if(err) console.log(err);});
		}, this);	
	},
	modifyGroup : function (obj, callback) {
		var curObj;
		if((parseInt(obj.id) && !(curObj=groupConfig.get(obj.id))) || !obj.name || !obj.controls || !__.isArray(obj.controls))
			return callback && callback({'success':false, 'msg':'invalid parameters'});
		var invalidParams = false, controls=[], id=0;
		__.each(obj.controls, function (ctrl) {
			if(ctrl.devId && ctrl.devId == "ipCamaras") {
				if(typeof ctrl.switchID == "undefined") return invalidParams = true;
			}
			else if(!ctrl.devId || typeof ctrl.switchID == "undefined" || !deviceInfoConfig.get(ctrl.devId) || deviceInfoConfig.get(ctrl.devId+".loads.normal") < parseInt(ctrl.switchID))
				return invalidParams = true;
			controls.push({"id":++id, "devId":ctrl.devId, "switchID":ctrl.switchID})
		}, this);
		if(invalidParams) return callback && callback({'success':false, 'msg':'invalid parameters1'});
		callback && callback({'success':true}); // dont hold the calback to wait for save ... it will block the socket
		__.defer(function (){
			obj.id = Math.max(parseInt(obj.id), 0);
			if(!obj.id) obj.id = 1 + __.max(__.map(groupConfig.data, function (val, key){return parseInt(key)}));
			obj.id = Math.max(obj.id, 1);
			if(controls.length)
				groupConfig.set(obj.id+"", {"name":obj.name, "controls":controls, "icon":obj.icon});
			else {
				groupConfig.emit('groupDeleteStart', obj.id);
				groupConfig.data = __.omit(groupConfig.data, obj.id+"");
			}

			var rankObj=groupConfig.data[obj.id+""]//groupConfig.get(obj.id+"")
			, rank = ((rankObj)?parseInt(obj.rank):Infinity) || 1, 
			currentRank =(curObj)?curObj.rank:0, rankModified=(rank != currentRank);
			
			console.log(rank, currentRank, rankObj);
			var dataArr = __.sortBy(__.values(groupConfig.data), 'rank');
			__.each(dataArr, function (data, indx) {
				if(__.isEqual(data, rankObj)) return data.rank = rank;
				if (indx+1 < rank) return data.rank = indx+1;
				return data.rank = indx+2;
			});
			if(rankModified || !controls.length) deviceManager.emit('deviceStateChanged');
			else deviceManager.emit('deviceStateChanged', controls[0].devId, null, 'groupModified');
			if(!controls.length) groupConfig.emit('groupDeleted', obj.id);
			groupConfig.save(function (err) {if(err) console.log(err);});
		}, this);
	},
	allowedSwitchParams : ["type", "icon", "devId", "name"], // why devId ???
	modifySwitchParam : function (obj, callback) {
		if(obj.devId == 'ipCamaras') return this.modifyIpCamaraParam(obj, callback);
		if(!deviceInfoConfig.get(obj.devId+".loadInfo."+obj.switchId)) 
			return callback && callback({'success':false, 'msg':'device do not exist'});
		if(obj.params.autoOff) { //TODO this piece of code should not be along with deviceInfoConfig
			return timerConfig.setAutoOffParams(obj.devId, obj.switchId, obj.params.autoOff, function (err) {
				if(err) return (callback && callback({'success':false, 'msg':err}));
				callback && callback({'success':true});
				deviceManager.emit('deviceStateChanged', obj.devId, null, 'switchParams');
			});
		}
		if(obj.params.schedule) { //TODO this piece of code should not be along with deviceInfoConfig
			return timerConfig.setSchedule(obj.devId, obj.switchId, obj.params.schedule, function (err) {
				if(err) return (callback && callback({'success':false, 'msg':err}));
				callback && callback({'success':true});
				deviceManager.emit('deviceStateChanged', obj.devId, null, 'switchParams');
			});
		}
		if(obj.params.type && obj.params.type != 'dimmer') {
			var device = deviceManager.getDevice(obj.devId);
			device && device.setDimmer(obj.switchId, 255)
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
			deviceManager.emit('deviceStateChanged', obj.devId, null, 'switchParams');
		});
	}


});

module.exports = EditManager;
