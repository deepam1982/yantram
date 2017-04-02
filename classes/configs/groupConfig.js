var __ = require("underscore");
var deviceManager = require(__rootPath+'/classes/devices/deviceManager');
var BasicConfigManager = require(__rootPath+"/classes/configs/basicConfigManager");
var timerConfig = require(__rootPath+"/classes/configs/timerConfig");
var GroupConfigManager = BasicConfigManager.extend({
	file : '/../configs/groupConfig.json',
	editGroup : function (iObj, calback) {
		var grpData = null;
		if(iObj.id) grpData = this.data[iObj.id];
		if(!grpData) {
			iObj.id = 1 + __.max(__.map(this.data, function (v, k){return parseInt(k)}));
			var rank = 1 + __.max(__.map(this.data, function (v, k){return v.rank}));
			this.set(iObj.id+"", grpData={"name":"group", "rank":rank, "controls" :[]});
		}
		__.extend(grpData, __.pick(iObj, "name", "icon", "customIcon"));
		if(iObj.rank) {
			var maxRank = __.max(__.map(this.data, function (v, k){return v.rank}));
			grpData.rank = 1+maxRank; // shift the object to last rank
			iObj.rank = Math.min(maxRank, Math.max(0, parseInt(iObj.rank))); // make sure rank is not out of range
			__.each(__.sortBy(__.values(this.data), 'rank'), function (data, indx) {
				data.rank = (indx+1 < iObj.rank)?(indx+1):(indx+2);
			});
			grpData.rank = iObj.rank; // shift the object to correct rank
		}
		deviceManager.emit('deviceStateChanged', null, null, 'groupModified');
		this.save(function(err) {calback&&calback(err, iObj.id);});
	},
	deleteGroup : function (gId, calback) {
		var grpData = this.data[gId+""];
		if(!grpData) return calback && calback("invalid group id!");
		this.emit('groupDeleteStart', gId);
		this.data = __.omit(this.data, gId+"");
		deviceManager.emit('deviceStateChanged', null, null, 'groupModified');
		this.emit('groupDeleted', gId);
		this.save(calback);
	},
	addToGroup : function (gId, devId, loadId, calback){
		var grpData = this.data[gId+""];
		if(!grpData) return calback && calback("invalid group id!");
		var ctrls = grpData.controls;
		if(!__.where(ctrls, {"devId":devId, "switchID":loadId}).length){
			ctrls.push({"id":ctrls.length+1, "devId":devId, "switchID":loadId});
			deviceManager.emit('deviceStateChanged', devId, null, 'groupModified');
		}
		this.save(calback);
	},
	removeFromGroup : function (gId, devId, loadId, calback){
		var grpData = this.data[gId+""];
		if(!grpData) return calback && calback("invalid group id!");
		var ctrls = grpData.controls;
		var objArr = __.where(ctrls, {"devId":devId, "switchID":loadId})
		if(objArr.length){
			grpData.controls = __.without(ctrls, objArr[0])
			var dId = null;
			__.each(grpData.controls, function(obj, indx){obj.id=indx+1; dId=obj.devId;});
			deviceManager.emit('deviceStateChanged', dId, null, 'groupModified');
		}
		this.save(calback);
	},
	getGroupInfo : function (devId, switchId) { // static data depends on data writen in file groupConfig.json
		var data = this.toJSON();
		for (var id in data) {
			for (var idx=0; idx < data[id].controls.length; idx++){
				var ctl = data[id].controls[idx];
				if(ctl.devId == devId && ctl.switchID == switchId)
					return {'id':id, 'name':data[id].name};
			}
		}
		return null;
	},
	getGroupsHavingDevice : function (devId, switchIds) {
		var groupIds = [];
		__.each(this.toJSON(), function (conf, id) {
			for(var idx=0; idx < conf.controls.length; idx++){
				if(conf.controls[idx].devId == devId && (!switchIds || 1+__.indexOf(switchIds, parseInt(conf.controls[idx].switchID)))) {
					groupIds.push(id);break;
				}
			}
		});
		return groupIds
	},
	getGroupDetails : function (id) {
		var conf = JSON.parse(JSON.stringify(this.data[id]));
		return this._getGroupDetails(conf, id);
	},
	groupDetailMap : {},
	_getGroupDetails : function (conf, id) {
		var irBlasterConfig = require(__rootPath+"/classes/configs/irBlasterConfig");
		var ipCamaraConfig = require(__rootPath+"/classes/configs/ipCamaraConfig");
		var irRemoteConfig = require(__rootPath+"/classes/configs/irRemoteConfig");
		
		var maxUpdateTs = Math.max(this.updateTs, __remoteDevInfoConf.updateTs, timerConfig.updateTs, 
			moodConfig.updateTs, irBlasterConfig.updateTs, ipCamaraConfig.updateTs, irRemoteConfig.updateTs);
		if(!this.groupDetailMap[id] || this.groupDetailMap[id].updateTs < maxUpdateTs) {
			if(!this.groupDetailMap[id]) this.groupDetailMap[id] = {};
			this.groupDetailMap[id].updateTs = maxUpdateTs;
			var keys = __.keys(this.data);
			var count = keys.length;
			conf.id = id+''; // id has to be string
			conf.hcId = __userConfig.get('zigbeeNetworkName');
			conf.rank || (conf.rank = (__.indexOf(keys, id+'')+1));
			conf.count = count;
			conf.disabledCtls = 0;
			conf.poweredCount = 0;
			conf.groupMoods = [];
			__.each(moodConfig.getSingleGroupMoods(), function(mObj, indx){if(1+__.indexOf(mObj.groups, conf.id+''))conf.groupMoods.push(__.pick(mObj,'id','name','icon'));});
			var ctlCount = conf.controls.length;
			__.each(conf.controls, function (ctl, indx) {
				if (ctl.devId == 'irBlasters') {
					ctl.irBlasterId = ctl.switchID;
					var irBlstrCnf = irBlasterConfig.get(ctl.switchID);
					if(!irBlstrCnf) return;
					var remoteIds = irBlstrCnf.remotes; 
					__.each(remoteIds, function(remId, idx){
						conf.controls.push({"id":++ctlCount, "devId":"irRemotes", "switchID":remId, "irBlasterId":ctl.switchID})
					}, this);
				}
			}, this);
			__.each(conf.controls, function (ctl) {
				var cnt = __.keys(ctl).length;
				__.each(__remoteDevInfoConf.get(ctl.devId+'.loadInfo.'+ctl.switchID), function (val, key) {
					ctl[key] = val;
				});
				if (ctl.devId == 'ipCamaras') {
					var ipCamCnf = ipCamaraConfig.get(ctl.switchID+'');
					__.extend(ctl, {"type":"ipCam", "name":ipCamCnf.name, "icon":ipCamCnf.icon ||"ipCam", "groupId":conf.id});
				}
				if(ctl.devId == 'irBlasters') {
					var irBlstrCnf = irBlasterConfig.get(ctl.switchID+'');
					if(!irBlstrCnf) return;
					__.extend(ctl, {"type":"irBlstr", "name":irBlstrCnf.name, "icon":irBlstrCnf.icon  ||"irBlaster", "groupId":conf.id, "remotes":irBlstrCnf.remotes});
				}
				if (ctl.devId == 'irRemotes') {
					var irRemCnf = irRemoteConfig.get(ctl.switchID+'');
					__.extend(ctl, {"type":"irRem", "name":irRemCnf.name, "icon":irRemCnf.icon  ||"remote_default", "groupId":conf.id});
				}
				if (cnt == __.keys(ctl).length) 
					return conf.controls = __.without(conf.controls, ctl);
			});
			this.groupDetailMap[id].conf = conf;
		}
		conf = this.groupDetailMap[id].conf
		conf.poweredCount = 0;
		__.each(conf.controls, function (ctl) {
			if(!__.contains(['irRemotes', 'irBlasters', 'ipCamaras'], ctl.devId))
			__.each(__remoteDevInfoConf.getLoadInfo(ctl.devId, ctl.switchID), function (val, key) {
				ctl[key] = val;
			});			
			var config = deviceManager.getConfig((ctl.irBlasterId)?ctl.irBlasterId:ctl.devId);
			ctl.disabled = (ctl.devId == 'ipCamaras')?false:((!config)?true:((!config.reachable)?true:false));
			(ctl.disabled && conf.disabledCtls++);
			if((typeof ctl.curtainId == 'undefined') && ctl.state=='on') conf.poweredCount++;
		});
		return conf;
	},
	getList : function () {
		var moodConfig = require(__rootPath+"/classes/configs/moodConfig");
		var data = [];
		__.each(this.toJSON(), function (conf, id) {	
			data.push(this._getGroupDetails(conf, id));
		}, this);
		return data;
	},
	publishGroupConfig : function (groupIds) {
		(!groupIds || !groupIds.length) && (groupIds = __.keys(this.data));
		__.each(groupIds, function (id, i) {
			__.defer(__.bind(function (idd) {
				this.emit("publishGroupConfig", this.getGroupDetails(idd))
			}, this), id);
		}, this);
	}
})
if (typeof groupConfig == 'undefined') groupConfig = new GroupConfigManager();
module.exports = groupConfig;
