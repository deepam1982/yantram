var __ = require("underscore");
var BaseClass = require(__rootPath+"/classes/baseClass");
var BaseIrBlaster = require(__rootPath+"/classes/devices/irBlasters/baseIrBlaster");
var irBlasterConfig = require(__rootPath+"/classes/configs/irBlasterConfig");
var request = require('request');
var analyse = require(__rootPath + '/partners/zmote/lib/analyse');

var Zmote01 = BaseIrBlaster.extend({
	type : 'zmote01',
	init : function (deviceId, router, config) {
		this._super(deviceId, router, config);
		var config = irBlasterConfig.get(this.id);
		this.uuid = config.uuid;
	},
	_onMsgRecieved : function (type, msg, callback) {
		switch (type) {
			case '/ircaptured' : return this._onIrCapture(msg); 
		}
	},
	_onIrCapture : function (data) {
	},
	sendCommand : function (data, callback) {
		var ip = this.router.getNetworkAdd(this.id);
		var url = 'http://'+ip+'/v2/'+this.uuid;
		request({
			url:url,
			method: 'POST', 
			headers: {'Content-Type':'text/plain', 
				'Content-Length': Buffer.byteLength(data)
			}
		}, callback).write(data);
	},
	startIrReciever : function (callback) {
		this.sendCommand('get_IRL', __.bind(function(e,r,b){
			clearTimeout(this.waitForIrRecieveTimer);
			this.waitForIrRecieveTimer=null;
			if(e) console.log(e);
			else if(!e && r.statusCode == 200 && b.indexOf('sendir') != -1) { //sendir,1:1,0,38400,1,1,154,151,21,....
				var arr=b.trim().substr(b.indexOf('sendir')).split(',');
				var freq = parseInt(arr[3]), rawArr = [];
				for(var i=6; i< arr.length;i++){
					rawArr[i-6] = parseInt(parseInt(arr[i])*1000000/freq); //vals in micro seconds.
				}
				var rawCode = rawArr.join(',');
				analyse(rawCode, function(err, jsonData){
					if(err) return callback(err);
					callback && callback(null, {'encoding':jsonData.spec.protocol, 'raw':rawCode, 'length':rawArr.length, 'khz':parseInt(freq/1000)});

				});
				return;
			}
			callback && callback(e||"error");
			
		}, this));
		this.waitForIrRecieveTimer = setTimeout(__.bind(function(){
			callback && callback('timeout');
		}, this), 15000);//15 sec
	},
	stopIrReciever : function() {
		console.log("Stopped IR Reciever!!");
		//incase of zmote, do nothing.
	},
	_executeCode : function (code, khz, callback) {
		if(!code) {
			console.log('invalid code!!'); 
			callback && callback('invalid code!!')
			return;
		}
		console.log(code);
		analyse(code, __.bind(function(err, jsonData){
			if(err) return callback(err);
			var newCode = 'sendir,1:1,0,'+jsonData.code;
			this.sendCommand(newCode, function(e,r,b){
				if(e) console.log(e);
				else if(!e && r.statusCode == 200){
					callback && callback(e, b);
					return;
				}
				callback && callback(e||'error', b);
			});
		}, this));
	}
});

module.exports = Zmote01;