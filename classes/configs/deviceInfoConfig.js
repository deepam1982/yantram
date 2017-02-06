var __ = require("underscore");
var BasicConfigManager = require(__rootPath+"/classes/configs/basicConfigManager");
var timerConfig = require(__rootPath+"/classes/configs/timerConfig");
var lircManager = require(__rootPath+"/classes/lirc/lircFileManager");
var devCoordConf = require(__rootPath+"/classes/configs/deviceCoordinatorConfig");
var DevInfoConfigManager = BasicConfigManager.extend({
	file : '/../configs/remoteDeviceInfoConfig.json',
	getList : function () {
		var data = [];
		__.each(this.toJSON(), function (conf, id) {
			conf.id = id;
			var devData =  __.omit(conf,"category", "deviceCode", "loads");
			__.each(devData.loadInfo, function(info, indx) {
				devData.loadInfo[indx] = __.extend(info, this.getLoadInfo(conf.id, indx));
			}, this);

			data.push(devData);
		}, this);

		var ipCamaraConfig = require(__rootPath+"/classes/configs/ipCamaraConfig");
		var camdata = {"id":"ipCamaras", "name":"Ip Cameras", "loadInfo":{}}
		__.each(ipCamaraConfig.data, function(conf, id){
			camdata.loadInfo[id]={"type":"ipCam", "icon":conf.icon ||"ipCam", "devId":"ipCamaras", "name":conf.name}
		})
		data.push(camdata);

		var irBlasterConfig = require(__rootPath+"/classes/configs/irBlasterConfig");
		var irBlstrData = {"id":"irBlasters", "name":"Ir Blasters", "loadInfo":{}}
		__.each(irBlasterConfig.data, function(conf, id){
			irBlstrData.loadInfo[id]={"type":"irBlstr", "icon":conf.icon ||"irBlaster", "devId":"irBlasters", "name":conf.name}
		})
		data.push(irBlstrData);

		var irRemoteConfig = require(__rootPath+"/classes/configs/irRemoteConfig");
		var irRemData = {"id":"irRemotes", "name":"Ir Remotes", "loadInfo":{}}
		__.each(irRemoteConfig.data, function(conf, id){
			irRemData.loadInfo[id]={"type":"irRem", "icon":conf.icon ||"remote_default", "devId":"irRemotes", "name":conf.name, "id":id, "editable" : lircManager.isEditable(conf.lirc)}
		})
		data.push(irRemData);

		return data;
	},
	getListOfSensors : function (devIds) {
		!devIds  && (devIds = __.keys(this.data));
		if(!__.isArray(devIds)) devIds = [devIds];
		var retData = {}, devData;
		__.each(devIds, function (id, i) {
				if(!(devData = this.get(id))) return;
				var nrmlCnt = parseInt(devData.loads.normal), crtnCnt = parseInt(devData.loads.curtain);
				if(isNaN(crtnCnt)) crtnCnt = 0; if(isNaN(nrmlCnt)) nrmlCnt = 0;
				__.each(devData.loadInfo, function(info, indx) {
					if(info.type != 'sensor') return;
					var id = info.devId + "-s" + (indx-(nrmlCnt+crtnCnt));
					retData[id] = info
				}, this);
		}, this);
		return retData;
	},
	getSensorInfo : function(deviceId, senId) {
		var nrmlCnt = parseInt(this.get(deviceId+'.loads.normal')), crtnCnt = parseInt(this.get(deviceId+'.loads.curtain'))||0;
		var loadId = nrmlCnt + crtnCnt + parseInt(senId);
		return this.getLoadInfo(deviceId, loadId);
	},
	getLoadInfo : function (deviceId, loadId) {
		var deviceManager = require(__rootPath+'/classes/devices/deviceManager');
		var ctl = {'switchID':parseInt(loadId)};
		var lodIndx = parseInt(loadId), nrmlCnt = parseInt(this.get(deviceId+'.loads.normal'))
		, crtnCnt = parseInt(this.get(deviceId+'.loads.curtain')), curtainId = -1;
		if(isNaN(crtnCnt)) crtnCnt = 0;
		if(isNaN(nrmlCnt)) nrmlCnt = 0;
		if(lodIndx < nrmlCnt+crtnCnt)
			curtainId = parseInt(loadId) - parseInt(this.get(deviceId+'.loads.normal'));
		if(curtainId > -1) ctl['curtainId'] = curtainId;

		__.each(this.get(deviceId+'.loadInfo.'+loadId), function (val, key) {
			ctl[key] = val;
		});

		var vLoad = deviceManager.getVirtualLoad(deviceId, loadId);
		if(vLoad) ctl.id = vLoad.id;
		else if (ctl.type == 'sensor'){
			var sensorIndx = lodIndx-(nrmlCnt+crtnCnt);
			var vSen = deviceManager.getVirtualSensor(deviceId, sensorIndx)
			if(vSen) ctl.id = vSen.id;
		}

		var config = deviceManager.getConfig(deviceId);
		if(config && ctl.type == 'sensor') {
			ctl.sensorLastOnTime = config[ctl.devId]['sensor'][sensorIndx].epoch || 0;
		}
		ctl.disabled = (!config)?true:((!config.reachable)?true:false);
		ctl.state = false;
		if(!(lodIndx < (nrmlCnt+crtnCnt))) return ctl;
		if(config && config[ctl.devId]){
			if(curtainId > -1){
				ctl.state = config[ctl.devId]["curtain"][ctl.curtainId]["state"];
				ctl.state = (ctl.state)?ctl.state:'off';
			}
			else{
				ctl.state = config[ctl.devId]["switch"][loadId]["state"];
				ctl.state = (ctl.state)?'on':'off';
			}
		}
		var timers = timerConfig.getTimers(deviceId, parseInt(loadId));
		ctl.autoOff = timers.autoOff[0];
		if(ctl.autoOff) ctl.autoOff = __.omit(ctl.autoOff, "devId", "loadId");
		ctl.schedules = [];
		__.each(timers.schedules, function (schdl){ctl.schedules.push(__.omit(schdl, "devId", "loadId"))});
		ctl.hasActiveSchedules = __.max(__.pluck(ctl.schedules, 'enabled'));// ctl.schedules.length;
		ctl.hasTimer = (!ctl.autoOff)?false:ctl.autoOff.enabled;
		ctl.autoToggleTime = null;
		//__.each(, function(vId) {}, this);
		if(vLoad) {
			ctl.followObjs = [];
			__.each(devCoordConf.findFollowObjects(vLoad.id), function(vId){
				if(vId.indexOf('stb-') != -1) vId = vId.split('stb-')[1];
				ctl.followObjs.push(vId);
			}, this);
			if(ctl.followObjs.length) 
				ctl.manualFollowSuspension = devCoordConf.findManualTime(vLoad.id);
			var tmp = vLoad.getRemainingTimeToToggle();
			if(tmp < Infinity) {
				var d = new Date(new Date().getTime() + tmp*1000), hour = d.getHours(), min = d.getMinutes();
				ctl.autoToggleTime = ((hour<10)?'0':'')+hour+':'+((min<10)?'0':'')+min;	
			}
		}
		if (config && config[deviceId] && config[deviceId]["dimmer"] && config[deviceId]["dimmer"][loadId]) {
			ctl.duty = config[deviceId]["dimmer"][loadId]["state"];
		}
		return ctl

	},
	publishDeviceConfig : function (devIds) {
		!devIds  && (devIds = __.keys(this.data));
		if(!__.isArray(devIds)) devIds = [devIds];
		__.each(devIds, function (id, i) {
				var data = [], conf = this.get(id);
				if(!conf) return;
				conf.id = id;
				var devData =  __.omit(conf,"category", "deviceCode", "loads");
				__.each(devData.loadInfo, function(info, indx) {
					devData.loadInfo[indx] = __.extend(info, this.getLoadInfo(conf.id, indx));
				}, this);
				data.push(devData);

				this.emit("publishDeviceConfig", data);
		}, this);
	},
	setSensorActive : function (deviceId, sensorId, callback) {
		var nrmlCnt = parseInt(this.get(deviceId+'.loads.normal'))
		, crtnCnt = parseInt(this.get(deviceId+'.loads.curtain'));
		if(isNaN(crtnCnt)) crtnCnt = 0;
		if(isNaN(nrmlCnt)) nrmlCnt = 0;
		var loadId = nrmlCnt + crtnCnt + parseInt(sensorId);
		//check and save
		if(this.get(deviceId+'.loadInfo.'+loadId+'.isActive'))return callback && callback();
		if(this.get(deviceId+'.loadInfo.'+loadId)) {
			this.set(deviceId+'.loadInfo.'+loadId+'.isActive', true);
		}
		else {
			this.set(deviceId+'.loadInfo.'+loadId, {
				"type": "sensor",
                "icon": "pir",
                "devId": deviceId,
                "name": "Sensor-"+(sensorId+1),
                "dimmable": false,
                "isActive": true,
                "pacificity": 120
			});	
			this.publishDeviceConfig(deviceId);
		}
		this.save(callback);
	},
	modifyFollowObjects : function (deviceId, switchId, followObjects, callback) {
		var sensorList = []
		__.each(followObjects.sensorList, function(sId){sensorList.push('stb-'+sId);}, this);
		followObjects.sensorList = sensorList;
		return devCoordConf.modifyFollowObjectsForLoad(deviceId, switchId, followObjects, __.bind(function() {
			this.publishDeviceConfig(deviceId);
			callback && callback();
		}, this));
	},
	deleteDevice : function (devId, callback) {
		this.data = __.omit(this.data, devId);
		this.emit("deviceDelete", devId);
		this.save(callback);
	},
	registerNewDevice : function (devId, moduleType, devName, callback) {
		if(typeof devName == 'function') {callback = devName; devName=null;}
		if(this.get(devId)) return callback && callback("device already registered");
		if(!devName)
			devName = 'Module-'+(1+__.keys(this.data).length);
		switch(moduleType){
			case "SWBD01" : var noDim=2, swCnt=5, crtnCnt=0; break;
			case "SWBD02" : var noDim=1, swCnt=5, crtnCnt=0; break;	
			case "CNCR01" : var noDim=0, swCnt=1, crtnCnt=2; break;	
			case "DMBD05" : var noDim=5, swCnt=5, crtnCnt=0; break;	
			case "DMBD03" : var noDim=3, swCnt=5, crtnCnt=0; break;	
			default		  : var noDim=1, swCnt=5, crtnCnt=0;
		}
		var devInfo = {"name":devName, "loads":{"dimmer":noDim, "normal":swCnt, "curtain":crtnCnt}, "loadInfo":{},"deviceCode":"xxx", "category":moduleType};
		for(var i=0; i<swCnt; i++) {
			devInfo.loadInfo[i] = {"type":"normal", "icon":"switch", "devId":devId, "name":"Device-"+(i+1)};
			if(i < noDim) devInfo.loadInfo[i].dimmable = true;
		}
		for(var i=0; i<crtnCnt; i++) {
			devInfo.loadInfo[swCnt+i] = {"type":"curtain", "icon":"curtain", "devId":devId, "name":"Device-"+(swCnt+i+1)};
		}
		this.set(devId, devInfo);
		this.save(callback);
		return devInfo;

	}
})
if (typeof deviceInfoConfig == 'undefined') deviceInfoConfig = new DevInfoConfigManager();
module.exports = deviceInfoConfig;
