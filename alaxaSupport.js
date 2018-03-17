var __ = require("underscore");
__rootPath = __dirname;
var findIpAddress = require(__rootPath+"/classes/utils/checkInternet").findIpAddress;
var sendGetRequest = require(__rootPath+"/classes/utils/checkInternet").sendGetRequest;
var sync_request = require('sync-request');

sendGetRequest("localhost", "/api/v1/load/list", function(err, body) {
	if (err) console.log(err);
	var resp = JSON.parse(body);
	var devList = resp.data;

	sendGetRequest("localhost", "/api/v1/group/list", function(err, body) {
		if (err) console.log(err);
		var resp = JSON.parse(body);
		var groupList = resp.data;
		var devMap = {};
		groupList.forEach(g => {
			g.loads.forEach(lId => {
				var d = devList.find(_ => _.id === lId);
				if(lId.toString().indexOf('-l') != -1)
					devMap[lId] = (g.name+" "+d.name).toLowerCase().replace("-", " ");
			})
		})
		var basePort = 11000;
		alaxaDevices = [];
		for (var devId in devMap) {
			alaxaDevices.push({
				"name": devMap[devId],
				"port": basePort++,
				"devId" : devId,
				"handler" : __.bind(function (dev_Id, action) {
					var path = "/api/v1/load/"+dev_Id+"/turn-"+action;
					console.log(path);
					sendGetRequest("localhost", path, function(err, body) {})					
				}, this, devId),
				"getStateHandler" : __.bind(function (dev_Id, crap) {
					var resp = JSON.parse(sync_request('GET', `http://127.0.0.1/api/v1/load/${dev_Id}/status`).body.toString('utf-8'))
					console.log(resp.data.id, crap.port, resp.data.state, resp.data.name, crap.name);
					return resp.data.state
				}, this, devId),
			})
		}
		console.log('starting..');
		// console.log(alaxaDevices);
		var FauxMo = require('fauxmojs');

		var fauxMo = new FauxMo({
    		ipAddress: findIpAddress(),
    		devices: alaxaDevices
    	})
		console.log('started..');
	})
})
