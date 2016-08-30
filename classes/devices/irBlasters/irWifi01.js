var __ = require("underscore");
var BaseIrBlaster = require(__rootPath+"/classes/devices/irBlasters/baseIrBlaster");

var IrWifi01 = BaseIrBlaster.extend({
	type : 'irWifi01',
	_onMsgRecieved : function (type, msg, callback) {
		switch (type) {
			case '/ircaptured' : return this._onIrCapture(msg); 
		}
	},
	_onIrCapture : function (data) {
		this.onIrRecieveCalback && this.onIrRecieveCalback(null, data)
		this.stopIrReciever();
	},
	startIrReciever : function (calback) {
		this.onIrRecieveCalback = calback;
		this.router.sendCommand(this.id, {'urlPath':'/captureIr'}, function(err, data) {
			if(err) return console.log("error while starting IR Reciever", err);
			if(data) console.log(data);
			console.log("Started IR Reciever!!");
		});
	},
	stopIrReciever : function() {
		this.onIrRecieveCalback = null;
		this.router.sendCommand(this.id, {'urlPath':'/stopIrReciever'}, function(err, data) {
			if(err) return console.log("error while stopping IR Reciever", err);
			if(data) console.log(data);
			console.log("Stopped IR Reciever!!");
		});
	},
	_executeCode : function (code, khz, calBack) {
		console.log(code);
		this.router.sendCommand(this.id, {'urlPath':'/sendIr', 'data':{'khz':khz||38, 'code':code}}, calBack)
	}

});

module.exports = IrWifi01;