var __ = require("underscore");
var BaseClass = require(__rootPath+"/classes/baseClass");
var deviceManager = require(__rootPath+'/classes/devices/deviceManager');
var eventLogger = require(__rootPath+"/classes/eventLogger/logger");
//var roomModel = require(__rootPath+"/configs/managers/roomConfigManager");
var groupConfig = require(__rootPath+"/classes/configs/groupConfig");
var deviceInfoConfig = require(__rootPath+"/classes/configs/deviceInfoConfig");
var moodConfig = require(__rootPath+"/classes/configs/moodConfig");
var zlib = require('zlib');

var RequestManager = BaseClass.extend({
	init : function (obj) {
		__.bindAll(this, "setEventListners");
		this.localIo = obj.localIo;
		this.localIo.sockets.on('connection', this.setEventListners);
	},
	setCloudSocket	: 	function (cloudSocket) {
		this.cloudSocket = cloudSocket;
		this.setEventListners(this.cloudSocket);
	},
	setEventListners : function (socket) {
		socket.on('/room/list', __.bind(this.onRoomListRequest, this, socket));
		socket.on('/group/list', __.bind(this.onRoomListRequest, this, socket));
		socket.on('/device/list', __.bind(this.onDeviceListRequest, this, socket));
		socket.on('/mood/list', __.bind(this.onMoodListRequest, this, socket));
//		console.log('Added Request Listners!!');
	},
	onDeviceListRequest : function (socket, reqData, calback) { 
		//Fucking defer is required else callback gets delayed as it goes along with emit.
		// __.defer(function () {__.each(deviceInfoConfig.getList(), function (info) {
		// 	socket.emit('onDeviceUpdate', info);
		// })});
		zlib.gzip(JSON.stringify(deviceInfoConfig.getList()), function(err, buffer) {
			socket.emit('onDeviceUpdate', (err)?"error in gzip":buffer.toString('base64'));
		});
		calback([]);
	},
	onMoodListRequest : function (socket, reqData, calback) {
		// __.defer(function () {__.each(moodConfig.getList(), function (info) {
		// 	socket.emit('moodConfigUpdate', info);
		// })});
		zlib.gzip(JSON.stringify(moodConfig.getList()), function(err, buffer) {
			socket.emit('moodConfigUpdate', (err)?"error in gzip":buffer.toString('base64'));
		});
		calback([]);
	},
	onRoomListRequest : function (socket, reqData, calback) {
		console.log('recieved room list request!!');
		// if(socket === this.cloudSocket)
		// 	__.defer(function (skt) {
		// 		//emit the IP address for redirection if local
		// 		skt.emit('homeControllerLocalIpAddress', __.chain(require('os').networkInterfaces()).flatten().filter(function(val){ return (val.family == 'IPv4' && val.internal == false) }).pluck('address').first().value());
		// 	}, this.cloudSocket);
		// var resp = groupConfig.getList();
		// if(typeof calback == 'function') calback(resp);
		// __.each(__.keys(groupConfig.data), function (id, i) {
		// 	setTimeout(__.bind(function (idd) {
		// 		socket.emit('roomConfigUpdated', groupConfig.getGroupDetails(idd))
		// 	}, null, id),(i>5?500:0)+50*(i%5));
		// });
		zlib.gzip(JSON.stringify(groupConfig.getList()), function(err, buffer) {
			socket.emit('roomConfigUpdated', (err)?"error in gzip":buffer.toString('base64'));
		});
		if(typeof calback == 'function') calback([]);
	}
});

module.exports = RequestManager;
