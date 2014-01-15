var express = require('express');
var RoomController = require(__rootPath+"/controllers/roomController");
module.exports = function(app) {
	
	app.get('/', function(req, res) {
		res.sendfile(__rootPath + '/static/htmls/app.html');
		//response.render(template, data);
	})

	app.get('/room/model/:id/:action', RoomController.run);
	app.get('/room/:action', RoomController.run);


};
