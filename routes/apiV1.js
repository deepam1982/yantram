var __ = require("underscore");
var deviceManager = require(__rootPath+'/classes/devices/deviceManager');
var groupConfig = require(__rootPath+"/classes/configs/groupConfig");
var deviceInfoConfig = require(__rootPath+"/classes/configs/deviceInfoConfig");
var moodConfig = require(__rootPath+"/classes/configs/moodConfig");
var timerConfig = require(__rootPath+"/classes/configs/timerConfig");

module.exports = function(app, cmdMngr) {
	
	app.get('/api/v1/group/list', function (req, res) {
		var array = [];
		__.each(groupConfig.toJSON(), function (group, id){
			array.push({"id":id, "name":group.name, "count":group.controls.length});
		});

		res.end(JSON.stringify({"success":true,"data":array}));
	});

	app.get('/api/v1/group/:id([0-9]{1,3})', function (req, res) {
		var id = req.params.id
		var groupData = groupConfig.getGroupDetails(id);
		res.end(JSON.stringify({"success":true,"data":groupData}));
	});

	// app.get('/api/v1/list', function (req, res){
	// 	res.send(groupConfig.getList());
	// })

	app.get('/api/v1/device/list', function (req, res) {

		var array = [];
		__.each(deviceInfoConfig.toJSON(), function (devInfo, devId){
			var config = deviceManager.getConfig(devId);
			
			__.each(config[devId]['sensor'], function(info, id){
				var ctl = {"id":devId+"-s"+id,"sensorLastOnTime":info.epoch}
				array.push(ctl);
			});
			__.each(devInfo.loadInfo, function(info, id) {
			
				var ctl = {"id":devId+"-"+id,"name":info.name,"type":info.type}
				ctl.disabled = (devId == 'ipCamaras')?false:((!config)?true:((!config.reachable)?true:false));
				ctl.state = (ctl.disabled)?false:config[devId]["switch"][id]["state"];
				ctl.state = (ctl.state)?'on':'off';
				if(config && config[devId]["dimmer"][id])
					ctl.duty = config[devId]["dimmer"][id]["state"];
				var timers = timerConfig.getTimers(devId, parseInt(id));
				var autoOff = timers.autoOff[0];
				ctl.autoOff = (autoOff && autoOff.enabled)?autoOff.time:0;
				ctl.schedules = [];
				timers.schedules.forEach (function(schedule){
					ctl.schedules.push(__.omit(schedule, "devId", "loadId"));
				})
			
				array.push(ctl);
			});
		});

		res.end(JSON.stringify({"success":true,"data":array}));
	});

	app.get('/api/v1/addAutoOff', function (req, res) {
		var devId=req.query.devId, time=parseInt(req.query.timeInSec), loadId;
		if(!__.has(req.query, 'devId') || !__.has(req.query, 'timeInSec')) 
			return res.send({'success':false,'msg':"Invalid Params"});
		devId = devId.split("-");
		loadId = parseInt(devId[1]);
		devId = devId[0];
		var enabled = (time)?true:false;
		timerConfig.setAutoOffParams(devId, loadId, {'enabled':enabled, 'time':time}, function(err) {
			res.send({'success':(err)?false:true, 'msg':err});
			if(!err) deviceManager.emit('deviceStateChanged', devId, null, 'switchParams');
		});
	});
	app.get('/api/v1/schedule/remove', function (req, res) {
		if(!__.has(req.query, 'devId') || !__.has(req.query, 'index')) 
			return res.send({'success':false,'msg':"Invalid Params"});
		var devId=req.query.devId.split("-"), scheduleId=parseInt(req.query.index), loadId=parseInt(devId[1]);
		devId = devId[0];
		timerConfig.removeSchedule(devId, loadId, {'scheduleId':scheduleId}, function (err){
			res.send({'success':(err)?false:true, 'msg':err});
			if(!err) deviceManager.emit('deviceStateChanged', devId, null, 'switchParams');
		})

	});
	app.get('/api/v1/schedule/set', function (req, res){
		if(!__.has(req.query, 'devId')) 
			return res.send({'success':false,'msg':"Invalid Params"});
		if(!__.has(req.query, 'index') && 
			(!__.has(req.query, 'type') || !__.has(req.query, 'hour') || !__.has(req.query, 'minute') ||
				!__.has(req.query, 'amPm') || !__.has(req.query, 'enabled')))
			return res.send({'success':false,'msg':"Invalid Params"});
		if(__.has(req.query, 'index') && 
			(!__.has(req.query, 'type') && !__.has(req.query, 'hour') && !__.has(req.query, 'minute') &&
				!__.has(req.query, 'amPm') && !__.has(req.query, 'enabled')))
			return res.send({'success':false,'msg':"Invalid Params"});

		var devId=req.query.devId.split("-"), loadId=parseInt(devId[1]), schedule = {};
		devId = devId[0];
		if(__.has(req.query, 'index')){
			var scheduleId=parseInt(req.query.index);
			schedule=timerConfig.getSchedule(devId, loadId, scheduleId);
			if(!schedule) return res.send({'success':false,'msg':"Invalid Params"});
			schedule.scheduleId=scheduleId;
		}
		schedule = __.extend(schedule,__.pick(req.query, 'type', 'hour', 'minute', 'amPm', 'enabled'));
		schedule.type = (schedule.type == "on")?"on":"off";
		schedule.amPm = (schedule.amPm == "AM")?"AM":"PM";
		schedule.enabled = (schedule.enabled == true || schedule.enabled == 'true')?true:false;
		schedule.hour = ""+Math.max(1,Math.min(12, parseInt(schedule.hour)))
		schedule.minute = ""+Math.max(0,Math.min(59, parseInt(schedule.minute)))
		timerConfig.setSchedule(devId, loadId, schedule, function (err) {
			res.send({'success':(err)?false:true, 'msg':err});
			if(!err) deviceManager.emit('deviceStateChanged', devId, null, 'switchParams');
		});
	});
	app.get('/api/v1/switchparams/set', function (req, res){
		if(!__.has(req.query, 'devId')) 
			return res.send({'success':false,'msg':"Invalid Params"});
		if(!__.has(req.query, 'name') && !__.has(req.query, 'icon') && !__.has(req.query, 'type'))
			return res.send({'success':false,'msg':"Invalid Params"});

		var devId=req.query.devId.split("-"), loadId=parseInt(devId[1]);
		devId = devId[0];

		if(__.has(req.query, 'name'))
			deviceInfoConfig.set(devId+".loadInfo."+loadId+'.name', req.query.name);
		if(__.has(req.query, 'icon'))
			deviceInfoConfig.set(devId+".loadInfo."+loadId+'.icon', req.query.icon);
		if(__.has(req.query, 'type'))
			deviceInfoConfig.set(devId+".loadInfo."+loadId+'.type', (req.query.type=="dimmer")?"dimmer":"normal");

		deviceInfoConfig.save(function (err) {
			res.send({'success':(err)?false:true, 'msg':err});
			if(!err) deviceManager.emit('deviceStateChanged', devId, null, 'switchParams');
		});

	});
};
