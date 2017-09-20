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
			var grDtls = JSON.parse(JSON.stringify(groupConfig.getGroupDetails(id)));
			if(grDtls.customIcon) grDtls.icon = grDtls.customIcon;
			var ctl = [];
			__.each(grDtls.controls,function(val,idx){ctl.push(val.id);});
			grDtls.loads = ctl;
			array.push(__.pick(grDtls, "id", "rank", "name", "icon", "loads"));
		});

		res.end(JSON.stringify({"success":true,"data":array}));
	});

	app.get('/api/v1/group/:id([0-9]{1,3})', function (req, res) {
		var id = req.params.id
		var groupData = groupConfig.getGroupDetails(id);
		res.end(JSON.stringify({"success":true,"data":groupData}));
	});

	app.get('/api/v1/mood/list', function (req, res) {
		var list = moodConfig.getMoodList();
		__.each(list, function(mData, indx){
			var icon = moodConfig.get(mData.id).customIcon;
			if(icon) mData.icon = icon;
		});
		res.end(JSON.stringify({"success":true,"data":list}));
	});

	// app.get('/api/v1/list', function (req, res){
	// 	res.send(groupConfig.getList());
	// })

	app.get(['/api/v1/device/list', '/api/v1/load/list'], function (req, res) {

		var array = [];
		__.each(deviceInfoConfig.toJSON(), function (devInfo, devId){
			var config = deviceManager.getConfig(devId);
			__.each(devInfo.loadInfo, function(info, id) {
				var lInfo = deviceInfoConfig.getLoadInfo(devId, id), ctl = __.pick(lInfo, 
					"id", "name", "icon", "type", "disabled", "state", "duty", "autoOff", "schedules", "sensorLastOnTime");
				if(lInfo.customIcon) ctl.icon = lInfo.customIcon;
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
	app.get('/api/v1/activatemoodbyname/:moodname', function(req, res) {
		console.log('/api/v1/activatemoodbyname/', req.params.moodname);
		var moodId = moodConfig.getMoodIdByName(req.params.moodname);
		if(!moodId) return res.send({'success':false, 'msg':"mood by the name '"+req.params.moodname+"'' does not exist."})
		cmdMngr.activateMood({'id':moodId});
		res.send({'success':true});
	});
	app.get('/api/v1/load/:devId([0-9a-fA-F]{16})-l:loadId([0-9]{1,2})/edit/:param(name|icon)/:value', function (req, res) {
		var devId = req.params.devId, loadId = parseInt(req.params.loadId), param = req.params.param, value = req.params.value;
		if(param == 'icon') param = 'customIcon';
		deviceInfoConfig.set(devId+".loadInfo."+loadId+'.'+param, value);
		deviceInfoConfig.save(function (err) {
			res.send({'success':(err)?false:true, 'msg':err});
			if(!err) deviceManager.emit('deviceStateChanged', devId, null, 'switchParams');
		});
	});
	app.get('/api/v1/load/:devId([0-9a-fA-F]{16})-l:swId([0-9]{1,2})/:actNm(toggle|turn-on|turn-off)', function (req, res) {
		var devId = req.params.devId, swId = req.params.swId, actNm=req.params.actNm;
		cmdMngr.executeCommand({"actionName":actNm, "devId":devId, "switchId":swId})
		res.send({'success':true});
	});
	app.get('/api/v1/load/:devId([0-9a-fA-F]{16})-l:swId([0-9]{1,2})/duty/:duty(100|[0-9]{1,2})', function (req, res) {
		var devId = req.params.devId, swId = req.params.swId, duty=""+parseInt(255*(parseInt(req.params.duty))/100);
		cmdMngr.executeCommand({"actionName":"setDuty", "devId":devId, "switchId":swId, "duty":duty});
		res.send({'success':true});
	});
	app.get('/api/v1/load/:devId([0-9a-fA-F]{16})-l:swId([0-9]{1,2})/curtain/:direction(open|close|stop)/:timeInSec([0-9]{1,2})?', function (req, res) {
		var devId = req.params.devId, swId = req.params.swId, direction=req.params.direction, timeInSec=req.params.timeInSec;
		cmdMngr.executeCommand({"actionName":"moveCurtain", "devId":devId, "switchId":swId, "direction":direction, "timeInSec":timeInSec});
		res.send({'success':true});
	});
	app.get('/api/v1/load/:devId([0-9a-fA-F]{16})-l:loadId([0-9]{1,2})/auto-off', function (req, res) {
		var devId = req.params.devId, loadId = parseInt(req.params.loadId);
		var obj = timerConfig.getTimers(devId, loadId);
		var autoOff = (!obj.autoOff.length)?{"enabled":false, "time":0}:__.pick(obj.autoOff[0], "enabled", "time");
		res.send({'success':true, 'autoOff':autoOff});
	});
	app.get('/api/v1/load/:devId([0-9a-fA-F]{16})-l:loadId([0-9]{1,2})/auto-off/:actNm(set|enable|disable)/:timeInSec([0-9]{1,4})?', function (req, res) {
		var devId=req.params.devId, actNm=req.params.actNm, time=parseInt(req.params.timeInSec)||0, loadId = parseInt(req.params.loadId) || 0;
		var autoOffParam = {'enabled':(actNm=='disable')?false:true}
		if(actNm=='set') autoOffParam.time = time;
		// res.send({'devId':devId, 'loadId':loadId, 'time':time, "actNm":actNm});
		timerConfig.setAutoOffParams(devId, loadId, autoOffParam, function(err) {
			res.send({'success':(err)?false:true, 'msg':err});
			if(!err) deviceManager.emit('deviceStateChanged', devId, null, 'switchParams'); //TODO this is wrong place
		});
	});
	app.get('/api/v1/load/:devId([0-9a-fA-F]{16})-l:loadId([0-9]{1,2})/schedule', function (req, res) {
		var devId = req.params.devId, loadId = parseInt(req.params.loadId);
		var obj = timerConfig.getTimers(devId, loadId);
		res.send({'success':true, 'schedules':__.map(obj.schedules, function(sch){return __.pick(sch, "type", "hour", "minute", "amPm", "enabled");})});
	});
	app.get('/api/v1/load/:devId([0-9a-fA-F]{16})-l:loadId([0-9]{1,2})/schedule/:indx([0-9])?/:actNm(enable|disable|remove)', function (req, res) {
		var action = req.params.actNm, devId = req.params.devId, loadId = parseInt(req.params.loadId), indx = parseInt(req.params.indx);
		var sdl = {"scheduleId":indx};
		if(action == 'remove') sdl.remove = true;
		if(action == 'enable') sdl.enabled = true;
		if(action == 'disable') sdl.enabled = false;
		timerConfig.setSchedule(devId, loadId, sdl, function(err) {
			res.send({'success':(err)?false:true, 'msg':err});
		});
	});
	app.get('/api/v1/load/:devId([0-9a-fA-F]{16})-l:loadId([0-9]{1,2})/schedule/:indx([0-9])?/:actNm(add|modify)/:type(on|off)/:h(1[0-2]|[1-9])/:m([0-5][0-9])/:amPm(am|pm)', function (req, res) {
		var action = req.params.actNm, devId = req.params.devId, type = req.params.type, amPm = req.params.amPm, 
		loadId = parseInt(req.params.loadId), indx = parseInt(req.params.indx), h = parseInt(req.params.h), m = parseInt(req.params.m);
		var sdl = {'type':type, 'hour':h, 'minute':m, 'amPm':amPm.toUpperCase()};
		if(isNaN(indx)) sdl.enabled=true; else sdl.scheduleId=indx;
		timerConfig.setSchedule(devId, loadId, sdl, function(err) {
			res.send({'success':(err)?false:true, 'msg':err});
		});
	});
	app.get('/api/v1/group/:gId([0-9]{1,2})/edit/:propName(name|icon|rank)/:value', function (req, res) {
		var obj = __.pick(req.params, "gId", "propName", "value");
		if (obj.propName == 'icon') obj.propName = 'customIcon';
		var gObj = {}; gObj.id = obj.gId; gObj[obj.propName] = obj.value;
		groupConfig.editGroup(gObj, function(err){
			res.send({'success':(err)?false:true, 'msg':err});
		});
	});
	app.get('/api/v1/group/:gId([0-9]{1,2})/delete', function (req, res) {
		groupConfig.deleteGroup(req.params.gId, function(err){res.send({'success':(err)?false:true, 'msg':err});});
	});
	app.get('/api/v1/group/create/:name/:rank([0-9]{1,2})?/:customIcon?', function (req, res) {
		var obj = __.pick(req.params, "name", "customIcon", "rank");
		groupConfig.editGroup(obj, function(err, id){
			res.send({'success':(err)?false:true, 'msg':err, "id":id});
		});
	});
	app.get('/api/v1/group/:gId([0-9]{1,2})/:actNm(add|remove)/load/:devId([0-9a-fA-F]{16})-l:loadId([0-9]{1,2})', function (req, res) {
		var action = req.params.actNm, gId = req.params.gId;
		var devId = req.params.devId, loadId = parseInt(req.params.loadId);
		groupConfig[(action == 'add')?'addToGroup':'removeFromGroup'](gId, devId, loadId, function(err){
			res.send({'success':(err)?false:true, 'msg':err});
		});
	});

	app.get('/api/v1/mood/:mId([0-9]{1,2})/edit/:propName(name|icon|rank)/:value', function (req, res) {
		var obj = __.pick(req.params, "mId", "propName", "value");
		if (obj.propName == 'icon') obj.propName = 'customIcon';
		var mObj = {}; mObj.id = obj.mId; mObj[obj.propName] = obj.value;
		moodConfig.editMood(mObj, function(err){
			res.send({'success':(err)?false:true, 'msg':err});
		});
	});
	app.get('/api/v1/mood/:mId([0-9]{1,2})/delete', function (req, res) {
		moodConfig.deleteMood(req.params.mId, function(err){res.send({'success':(err)?false:true, 'msg':err});});
	});
	app.get('/api/v1/mood/create/:name/:rank([0-9]{1,2})?/:customIcon?', function (req, res) {
		var obj = __.pick(req.params, "name", "customIcon", "rank");
		moodConfig.editMood(obj, function(err, id){
			res.send({'success':(err)?false:true, 'msg':err, "id":id});
		});
	});
	app.get('/api/v1/mood/:mId([0-9]{1,2})/remove/load/:devId([0-9a-fA-F]{16})-l:loadId([0-9]{1,2})', function (req, res) {
		var mId = req.params.mId, devId = req.params.devId, loadId = parseInt(req.params.loadId);
		moodConfig.removeFromMood(mId, devId, loadId, function(err){
			res.send({'success':(err)?false:true, 'msg':err});
		});
	});
	app.get('/api/v1/mood/:mId([0-9]{1,2})/add/load/:devId([0-9a-fA-F]{16})-l:loadId([0-9]{1,2})/state/:state(on|off|open|close)', function (req, res) {
		var state = req.params.state, mId = req.params.mId;
		var devId = req.params.devId, loadId = parseInt(req.params.loadId);
		if(state == 'open') state='on'; if(state == 'close') state='off';
		moodConfig.addToMood(mId, devId, loadId, state, function(err){
			res.send({'success':(err)?false:true, 'msg':err});
		});
	});

};
