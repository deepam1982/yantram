var express = require('express');
// var RoomController = require(__rootPath+"/controllers/roomController");
module.exports = function(app) {
	
	app.get('/', function(req, res) {
		try {
			res.sendFile(__rootPath + '/static/htmls/app.html');
		}
		catch(err) {
			res.sendfile(__rootPath + '/static/htmls/app.html');	
		}
		//response.render(template, data);
	});
	app.get('/apptest', function (req, res) {
    	res.end(req.query.callback+'('+JSON.stringify({'success':true})+')');
	});
	app.get('/inohocontroller', function (req, res) {
    	res.end(JSON.stringify({'success':true}));
	});
};
