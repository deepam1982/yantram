var express = require('express');
var groupConfig = require(__rootPath+"/classes/configs/groupConfig");
var deviceInfoConfig = require(__rootPath+"/classes/configs/deviceInfoConfig");
var moodConfig = require(__rootPath+"/classes/configs/moodConfig");
var zlib = require('zlib');

module.exports = function(app, cmdMngr) {
	
	// app.get('/group/list', function (req, res) {
	// 	res.end(JSON.stringify(groupConfig.getMinifiedList()));
	// });
	app.get('/group/list', function (req, res) {
		zlib.gzip(JSON.stringify(groupConfig.getList()), function(err, buffer) {
			res.set ({"Transfer-Encoding": "gzip", "Content-Type":"application/json; charset=utf-8", "Vary":"Accept-Encoding"});
			res.send((err)?"error in gzip":buffer.toString('base64'));
		});
	});

	app.get('/device/list', function (req, res) {
		zlib.gzip(JSON.stringify(deviceInfoConfig.getList()), function(err, buffer) {
			res.set ({"Transfer-Encoding": "gzip", "Content-Type":"application/json; charset=utf-8", "Vary":"Accept-Encoding"});
			res.send((err)?"error in gzip":buffer.toString('base64'));
		});
	});
	app.get('/mood/list', function (req, res) {
		zlib.gzip(JSON.stringify(moodConfig.getList()), function(err, buffer) {
			res.set ({"Transfer-Encoding": "gzip", "Content-Type":"application/json; charset=utf-8", "Vary":"Accept-Encoding"});
			res.send((err)?"error in gzip":buffer.toString('base64'));
		});
	});
	app.get('/model/switch', function (req, res) {
		res.send({'success':true});
		cmdMngr.executeCommand(req.query);
	});



};
