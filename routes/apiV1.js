var __ = require("underscore");
var deviceManager = require(__rootPath+'/classes/devices/deviceManager');
var groupConfig = require(__rootPath+"/classes/configs/groupConfig");
var deviceInfoConfig = require(__rootPath+"/classes/configs/deviceInfoConfig");
var moodConfig = require(__rootPath+"/classes/configs/moodConfig");

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

	app.get('/api/v1/device/list', function (req, res) {

		var array = [];
		__.each(deviceInfoConfig.toJSON(), function (devInfo, devId){
			var config = deviceManager.getConfig(devId);
			__.each(devInfo.loadInfo, function(info, id) {
			
				var ctl = {"id":devId+"-"+id,"name":info.name,"type":info.type}
				ctl.disabled = (devId == 'ipCamaras')?false:((!config)?true:((!config.reachable)?true:false));
				ctl.state = (ctl.disabled)?false:config[devId]["switch"][id]["state"];
				ctl.state = (ctl.state)?'on':'off';

				array.push(ctl);
			});
		});

		res.end(JSON.stringify({"success":true,"data":array}));
	});


};
