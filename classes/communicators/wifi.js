
var BaseClass = require(__rootPath+"/classes/baseClass");
var __ = require("underscore");
var irBlasterConfig = require(__rootPath+"/classes/configs/irBlasterConfig");
var request = require('request');

var WifiCommunicator = BaseClass.extend({
	deviceList : [],
	_macIdNwkIdMap : {},
	init : function () {
		this.scanNetworkTimePeriod = 5000;//5sec
		setTimeout(__.bind(this.scanNetwork, this), 20000);
		setTimeout(__.bind(function(){this.scanNetworkTimePeriod = 90000;}, this), 40000);
	},
	setServer : function(server) {
		this.server = server;
		this.server.get('/ircaptured',__.bind(this.onIrCapture, this));
	},
	onIrCapture : function (req,res) {
		res.send({"success":true}); // dont hold response.
		console.log(req.query);
		if(!req.query.success) return;
		var macId = req.query.macId.toLowerCase(); 
		var data = {"encoding":req.query.encoding, "bits":req.query.bits, "code":req.query.hexCode, "length":req.query.length, "raw":req.query.data, "khz":req.query.khz}
		this.emit("msgRecieved", '/ircaptured', data, macId);
	},
	scanNetwork : function () {
		// sudo arp-scan --interface=wlan0  --localnet
		var spawn = require('child_process').spawn;
		var nwkInfc = (__systemConfig.get('wifi'))?'wlan0':'eth0';
		this.scan_process = spawn('sudo', ['arp-scan', '--interface='+nwkInfc, '--localnet']);
		this.scan_process.stdout.on('data', __.bind(function(chunk) { 
			var pairs = chunk.toString('utf-8').match(/([0-9]{1,3}\.){3}[0-9]{1,3}\s+([a-fA-F0-9]{2}:){5}[a-fA-F0-9]{2}/g);
			if(irBlasterConfig.get('HcIrBlaster')) pairs.push("127.0.0.1 HcIrBlaster");
			__.each(pairs, __.bind(function(pair){
				pair = pair.split(/\s+/);
				if (!this._macIdNwkIdMap[pair[1]]) this._onNewDeviceFound(pair[1], pair[0]);
				var map = this._macIdNwkIdMap[pair[1]]
				map['ipAdd'] = pair[0];
				map['lastSeenAt'] = (new Date).getTime()/1000;
				if(map.isInohoDevice && !map.reachable) {
					map.reachable = true;
					this.emit("deviceReachable", pair[1]);
				}
			}, this));
			setTimeout(__.bind(this.scanNetwork, this), this.scanNetworkTimePeriod);
		}, this));
		this.scan_process.stdout.on('end', function(chunk) { console.log("Stoped wifi scan!!", (chunk)?chunk:"");});
		this.scan_process.stderr.on('data', function(chunk) { console.log("error chunk:",chunk.toString('utf-8'));});
		this.scan_process.on('exit', function(code) {
		    if (code != 0 && code != 130) {console.log('Failed: ' + code);}
		});
		console.log("Started wifi scan!!");
	},
	_onNewDeviceFound : function (macId, ip) {
		console.log("New Device found on wifiScan", macId, ip)
		this._macIdNwkIdMap[macId] = {};
		var config = irBlasterConfig.get(macId);
		if (config) {
			this.emit("newDeviceFound", macId, config.category);
			return this._macIdNwkIdMap[macId]['isInohoDevice'] = true;
		}
		request.get('http://'+ip+'/whoareyou', __.bind(function (err, resp, body){
			if (!err && resp && resp.statusCode == 200) {
				var rspJson = JSON.parse(body);
				if(rspJson.success) {
					irBlasterConfig.onNewDeviceFound(macId, rspJson, __.bind(function (err) {
						if(!err) {
							var config = irBlasterConfig.get(macId);
							this._macIdNwkIdMap[macId]['isInohoDevice'] = true;
							this.emit("newDeviceFound", macId, config.category);
						}
					}, this));
				}
				console.log(rspJson);
			}
		}, this));
		//TODO do it for IP cam as well
	},
	_getPostData : function (url, data) {
		switch (url) {
			case '/captureIr' : data.callbackUrl = "http://"+__piIpAddr+"/ircaptured"; break;
		}
		return data;
	},
	sendCommand : function (macId, cmdObj, calback) {
		var url = 'http://'+this._macIdNwkIdMap[macId].ipAdd+((cmdObj.urlPath)?cmdObj.urlPath:'');
		request({'url':url, qs:this._getPostData(cmdObj.urlPath, cmdObj.data||{}), method: 'POST'}, function (err, resp, body){
			if(err) return calback && calback(err);
			if (resp && resp.statusCode == 200) {
				var rspJson = JSON.parse(body);
				calback && calback(err, rspJson);
				console.log(rspJson);
			}
		});
	}
});

module.exports = WifiCommunicator;

		// this.communicator.on('newDeviceFound', __.bind(this._onNewDeviceFound, this));
		// this.communicator.on('msgRecieved', __.bind(this._onMsgRecieved, this));
		// this.communicator.on('deviceReachable', __.bind(this._updateDeviceRechability, this, true));
		// this.communicator.on('deviceUnreachable', __.bind(this._updateDeviceRechability, this, false));

