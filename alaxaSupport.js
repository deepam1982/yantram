var __ = require("underscore");
__rootPath = __dirname;
var findIpAddress = require(__rootPath+"/classes/utils/checkInternet").findIpAddress;
var sendGetRequest = require(__rootPath+"/classes/utils/checkInternet").sendGetRequest;
var sync_request = require('sync-request');

var BasicConfigManager = require(__rootPath+"/classes/configs/basicConfigManager");
var FauxmoConfigMngr = BasicConfigManager.extend({file : '/../configs/fauxmoConfig.json'});


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

		var fauxmoConfMngr = new FauxmoConfigMngr({'callback':err => {
			if(err) console.log(err);

			if(!fauxmoConfMngr.data); {
				fauxmoConfMngr.data = {
					"FAUXMO": {
						"ip_address": "auto"
					},
					"PLUGINS": {
						"SimpleHTTPPlugin": {
							"DEVICES": []
						}
					}
				}	
			}
			// console.log(fauxmoConfMngr.data);

			var basePort = 11000;
			fauxmoDevices = fauxmoConfMngr.get("PLUGINS.SimpleHTTPPlugin.DEVICES");
			fauxmoDevices.forEach(_ => {if(_.port > basePort) basePort = _.port});
			for (var devId in devMap) {
				if(!fauxmoDevices.find(_ => _.state_cmd.indexOf(devId) != -1))
					fauxmoDevices.push({
						"name": devMap[devId],
						"port": ++basePort,
						"on_cmd": "http://127.0.0.1/api/v1/load/"+devId+"/turn-on",
						"off_cmd": "http://127.0.0.1/api/v1/load/"+devId+"/turn-off",
						"state_cmd": "http://127.0.0.1/api/v1/load/"+devId+"/status",
						"state_response_on": "\"state\":\"on\"",
						"state_response_off": "\"state\":\"off\"",
						"method": "GET"
					})
			}
			fauxmoDevices = __.shuffle(fauxmoDevices);
			console.log("fauxmoDevices prepared.")

			fauxmoConfMngr.set("PLUGINS.SimpleHTTPPlugin.DEVICES", fauxmoDevices);
			fauxmoConfMngr.save(err => {
				if(err) console.log(err);
				console.log("fauxmoConfMngr updated.")
			})
		}})





		// alaxaDevices = [];
		// for (var devId in devMap) {
		// 	alaxaDevices.push({
		// 		"name": devMap[devId],
		// 		"port": basePort++,
		// 		"devId" : devId,
		// 		"handler" : __.bind(function (dev_Id, action) {
		// 			var path = "/api/v1/load/"+dev_Id+"/turn-"+action;
		// 			console.log(path);
		// 			sendGetRequest("localhost", path, function(err, body) {})					
		// 		}, this, devId),
		// 		"getStateHandler" : __.bind(function (dev_Id, crap) {
		// 			var resp = JSON.parse(sync_request('GET', `http://127.0.0.1/api/v1/load/${dev_Id}/status`).body.toString('utf-8'))
		// 			console.log(resp.data.id, crap.port, resp.data.state, resp.data.name, crap.name);
		// 			return resp.data.state
		// 		}, this, devId),
		// 	})
		// }
		// console.log('starting..');
		// // console.log(alaxaDevices);
		// var FauxMo = require('fauxmojs');

		// var fauxMo = new FauxMo({
  //   		ipAddress: findIpAddress(),
  //   		devices: alaxaDevices
  //   	})
		// console.log('started..');
	})
})
