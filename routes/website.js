var express = require('express');
// var RoomController = require(__rootPath+"/controllers/roomController");
module.exports = function(app) {
	
	app.get('/', function(req, res) {
		switch (__userConfig.get('appTheam')) {
			case 'Maze' : var appFile = __rootPath + '/static/htmls/app_2.html'; break;
			default		: var appFile = __rootPath + '/static/htmls/app_1.html';
		}
		try {res.sendFile(appFile);}
		catch(err) {res.sendfile(appFile);}

	});
	app.get('/auth/login', function(req, res) {
		try {res.sendFile(__rootPath + '/static/htmls/auth/login.html');}
		catch(err) {res.sendfile(__rootPath + '/static/htmls/auth/login.html');}
	});
	app.get('/apptest', function (req, res) {
    	res.end(req.query.callback+'('+JSON.stringify({'success':true})+')');
	});
	app.get('/inohocontroller', function (req, res) {
    	res.end(JSON.stringify({'success':true}));
	});
};
