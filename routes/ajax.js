var express = require('express');
var groupConfig = require(__rootPath+"/classes/configs/groupConfig");
var deviceInfoConfig = require(__rootPath+"/classes/configs/deviceInfoConfig");
var moodConfig = require(__rootPath+"/classes/configs/moodConfig");

module.exports = function(app, cmdMngr) {
	
	app.get('/group/list', function (req, res) {
		res.end(JSON.stringify(groupConfig.getList()));
	});
		app.get('/device/list', function (req, res) {
		res.end(JSON.stringify(deviceInfoConfig.getList()));
	});
	app.get('/mood/list', function (req, res) {
		res.end(JSON.stringify(moodConfig.getList()));
	});
	app.get('/model/switch', function (req, res) {
		res.send({'success':true});
		cmdMngr.executeCommand(req.query);
	});



};
