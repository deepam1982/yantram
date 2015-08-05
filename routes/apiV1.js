var __ = require("underscore");
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

};
