var __ = require("underscore");
var BaseClass = require(__rootPath+"/classes/baseClass");
var lircParser = require(__rootPath+"/classes/lirc/lircd-conf-parser.js").default;
var fs = require('fs');

var NativeIrBlaster = BaseClass.extend({
	transmitIr : function (irCode, frequency, calBack) {
		var exec = require('child_process').exec;
		var foo = function(error, stdout, stderr) {
			console.log(error, stdout, stderr);
			if (calBack) calBack();
		}
		exec("sudo /home/admin/irSend '"+irCode+"', "+(frequency||38)+" > "+__rootPath+"/../logs/irSend.log", foo);	
		console.log('sent irCode', irCode);
	}
})
if(typeof nativeIrBlaster == 'undefined') nativeIrBlaster = new NativeIrBlaster();

var BaseIrBlaster = BaseClass.extend({
	type: "IRBLR1",
	remoteLircObjs : {}, //remote lirc should be shared across all instances
	init : function (deviceId, router) {
		this.reachable = true;
		this.id = deviceId;
		this.router = router;
		this.virtualNodes = {};
		this.on('msgRecieved', __.bind(this._onMsgRecieved, this));
	},
	_onMsgRecieved : function (type, msg, callback) {},
	getConfig : function () {return {'reachable':this.reachable};},
	applyConfig : function (codeArr) {
		console.log("BaseIrBlaster", codeArr);
		if(!codeArr || !codeArr.length) return;
		var obj = codeArr.shift();
		this.executeCode(obj.code, obj.remId, __.bind(function(codeArr){setTimeout(__.bind(this.applyConfig, this, codeArr), 500)}, this, codeArr));
	},
	getRemoteLircObj : function (lircfile, calBack) {
		if (this.remoteLircObjs[lircfile]) return calBack && calBack(null,this.remoteLircObjs[lircfile]);
		var thisObj = this;
		var fileName = __rootPath+"/lirc/"+lircfile;
		console.log(fileName);
		var fReadCalback = function (err, content) {
			if(err) console.log(err);
			var parsed = lircParser.parse(""+content);
			return calBack && calBack(null,thisObj.remoteLircObjs[lircfile] = parsed['remotes'][0]);
		}
		fs.exists(fileName, function(exists) {
			if(exists) return fs.readFile(fileName, 'utf8', fReadCalback);
			var fileName3 = __rootPath+"/../configs/lirc/"+lircfile;;
			fs.exists(fileName3, function(exists) {
				if(exists) return fs.readFile(fileName3, 'utf8', fReadCalback);
				else {
					calBack && calBack("could not find lirc file")
					console.log("could not find lirc file");
				}
			})
		})
	},
	executeCode : function (code, remoteId, calBack){
		var irRemoteConfig = require(__rootPath+"/classes/configs/irRemoteConfig");
		var irRemCnf = irRemoteConfig.get(remoteId+'');
		var lircfile = irRemCnf.lirc;
		console.log(code, lircfile);
		this.getRemoteLircObj(lircfile, __.bind(function(err, rLObj){
			if(err) return calBack && calBack(err);
			var rawCode = lircParser.getRaw(rLObj, code).join(',');
			var khz = lircParser.getKhz(rLObj, code)
			console.log("found raw code and khz preparing to execute");
			this._executeCode(rawCode, khz, calBack);
			//this._executeCode(lircParser.getRaw(this.remoteLircObjs[lircfile], code).join(','), calBack);

		}, this));
	},
	sendRawCode : function (code, khz, calBack){
		this._executeCode(code, khz, calBack);
	},
	_executeCode : function (code, khz, calBack) {
		if(!code) {console.log('invalid code!!'); calBack && calBack('invalid code!!')}
		console.log("khz:", khz, "  code:", code);
		if(this.id == 'HcIrBlaster') 
			setTimeout(function(){nativeIrBlaster.transmitIr(code, khz || 38, calBack)},100);
	},
	startIrReciever : function(calback) {
		this._killIrProcess();
		this.onIrRecieveCalback = calback
		var spawn = require('child_process').spawn;
		this.ir_process = spawn('sudo', ['/home/admin/ir']);
		this.ir_process.stdout.on('data', __.bind(function(chunk) { 
			console.log(chunk.toString('utf-8'));
			var json = JSON.parse(chunk.toString('utf-8').replace(/'/g, '"'));
			this.onIrRecieveCalback(null, json)
			console.log(json);
			this._killIrProcess();
		}, this));
		this.ir_process.stdout.on('end', function(chunk) { console.log("Stoped Ir Reciever!!", (chunk)?chunk:"");});
		this.ir_process.stderr.on('data', function(chunk) { console.log("error chunk:",chunk.toString('utf-8'));});
		this.ir_process.on('exit', function(code) {
		    if (code != 0 && code != 130) {console.log('Failed: ' + code);}
		});
		console.log("Started IR Reciever!!");
		if(this._killIrProcessTimer) clearTimeout(this._killIrProcessTimer);
		this._killIrProcessTimer = setTimeout(__.bind(this._killIrProcess, this), 120*1000)
	},
	_killIrProcess : function () {
		this.onIrRecieveCalback = null;
		if(this.ir_process)this.ir_process.kill('SIGINT');
		console.log("Stopped IR Reciever!!");
		this._killIrProcessTimer = null;
	},
	stopIrReciever : function() {
		this._killIrProcess();
	}

});
module.exports = BaseIrBlaster;
