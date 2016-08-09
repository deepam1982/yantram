var __ = require("underscore");
var deviceManager = require(__rootPath+'/classes/devices/deviceManager');
var BasicConfigManager = require(__rootPath+"/classes/configs/basicConfigManager");
var timerConfig = require(__rootPath+"/classes/configs/timerConfig");
var GroupConfigManager = BasicConfigManager.extend({
	file : '/../configs/groupConfig.json',
	getGroupInfo : function (devId, switchId) {
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
	_getGroupDetails : function (conf, id) {
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
				var irBlasterConfig = require(__rootPath+"/classes/configs/irBlasterConfig");	
				var irBlstrCnf = irBlasterConfig.get(ctl.switchID);
				var remoteIds = irBlstrCnf.remotes; 
				ctl.irBlasterId = ctl.switchID;
				__.each(remoteIds, function(remId, idx){
					conf.controls.push({"id":++ctlCount, "devId":"irRemotes", "switchID":remId, "irBlasterId":ctl.switchID})
				}, this);
			}
		}, this);
		__.each(conf.controls, function (ctl) {
			var cnt = __.keys(ctl).length;
			var curtainId = parseInt(ctl.switchID) - parseInt(__remoteDevInfoConf.get(ctl.devId+'.loads.normal'));
			if(curtainId > -1) ctl['curtainId'] = curtainId;
			__.each(__remoteDevInfoConf.get(ctl.devId+'.loadInfo.'+ctl.switchID), function (val, key) {
				ctl[key] = val;
			});
			if (ctl.devId == 'ipCamaras') {
				var ipCamaraConfig = require(__rootPath+"/classes/configs/ipCamaraConfig");
				var ipCamCnf = ipCamaraConfig.get(ctl.switchID+'');
				__.extend(ctl, {"type":"ipCam", "name":ipCamCnf.name, "icon":ipCamCnf.icon ||"ipCam", "groupId":conf.id});
			}
			if(ctl.devId == 'irBlasters') {
				var irBlasterConfig = require(__rootPath+"/classes/configs/irBlasterConfig");
				var irBlstrCnf = irBlasterConfig.get(ctl.switchID+'');
				__.extend(ctl, {"type":"irBlstr", "name":irBlstrCnf.name, "icon":irBlstrCnf.icon  ||"irBlaster", "groupId":conf.id, "remotes":irBlstrCnf.remotes});
			}
			if (ctl.devId == 'irRemotes') {
				var irRemoteConfig = require(__rootPath+"/classes/configs/irRemoteConfig");
				var irRemCnf = irRemoteConfig.get(ctl.switchID+'');
				__.extend(ctl, {"type":"irRem", "name":irRemCnf.name, "icon":irRemCnf.icon  ||"remote_default", "groupId":conf.id});
			}
			if (cnt == __.keys(ctl).length) 
				return conf.controls = __.without(conf.controls, ctl);

			var config = deviceManager.getConfig((ctl.irBlasterId)?ctl.irBlasterId:ctl.devId);
			ctl.disabled = (ctl.devId == 'ipCamaras')?false:((!config)?true:((!config.reachable)?true:false));
			(ctl.disabled && conf.disabledCtls++);
			ctl.state = false;
			if(config && config[ctl.devId]){
				if(curtainId > -1){
					ctl.state = config[ctl.devId]["curtain"][ctl.curtainId]["state"];
					ctl.state = (ctl.state)?ctl.state:'off';
				}
				else{
					ctl.state = config[ctl.devId]["switch"][ctl.switchID]["state"];
					ctl.state = (ctl.state)?'on':'off';
				}
			}
			if(!(curtainId > -1) && ctl.state=='on') conf.poweredCount++;
			var timers = timerConfig.getTimers(ctl.devId, ctl.switchID);
			ctl.autoOff = timers.autoOff[0];
			if(ctl.autoOff) ctl.autoOff = __.omit(ctl.autoOff, "devId", "loadId");
			ctl.schedules = [];
			__.each(timers.schedules, function (schdl){ctl.schedules.push(__.omit(schdl, "devId", "loadId"))});
			ctl.hasActiveSchedules = __.max(__.pluck(ctl.schedules, 'enabled'));// ctl.schedules.length;
			ctl.hasTimer = (!ctl.autoOff)?false:ctl.autoOff.enabled;
			ctl.autoToggleTime = null;
			var vLoad = deviceManager.getVirtualLoad(ctl.devId, ctl.switchID);
			if(vLoad) {
				var tmp = vLoad.getRemainingTimeToToggle();
				if(tmp < Infinity) {
					var d = new Date(new Date().getTime() + tmp*1000), hour = d.getHours(), min = d.getMinutes();
					ctl.autoToggleTime = ((hour<10)?'0':'')+hour+':'+((min<10)?'0':'')+min;	
				}
			}
			if (config && config[ctl.devId] && config[ctl.devId]["dimmer"] && config[ctl.devId]["dimmer"][ctl.switchID]) {
				ctl.duty = config[ctl.devId]["dimmer"][ctl.switchID]["state"];
			}
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
