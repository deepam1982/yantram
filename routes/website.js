var express = require('express');
var ejs = require('ejs');
ejs.delimiter = '$';
// var RoomController = require(__rootPath+"/controllers/roomController");
module.exports = function(app) {
	
	app.get('/', function(req, res) {
		var appTheme = __userConfig.get('appTheam') || 'Clasic';
		switch (__userConfig.get('appTheam')) {
			case 'Maze' : var appFile = __rootPath + '/static/ejs/app_maze.ejs'; break;
			default		: var appFile = __rootPath + '/static/ejs/app_clasic.ejs';
		}
		var appColor = (__userConfig.get('appColor') || 'orange').toLowerCase();
		res.render(appFile,{'appColor':appColor,'appTheme':appTheme, 
			'ipCamaraSupported':__systemConfig.get('ipCamaraSupported'), 
			'revId':__systemConfig.get('revId')||'0000000'});
		// try {res.sendFile(appFile);}
		// catch(err) {res.sendfile(appFile);}

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
