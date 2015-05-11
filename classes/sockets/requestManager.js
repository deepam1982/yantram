var __ = require("underscore");
var BaseClass = require(__rootPath+"/classes/baseClass");
var deviceManager = require(__rootPath+'/classes/devices/deviceManager');
var eventLogger = require(__rootPath+"/classes/eventLogger/logger");
//var roomModel = require(__rootPath+"/configs/managers/roomConfigManager");
var groupConfig = require(__rootPath+"/classes/configs/groupConfig");
var deviceInfoConfig = require(__rootPath+"/classes/configs/deviceInfoConfig");
var moodConfig = require(__rootPath+"/classes/configs/moodConfig");

var RequestManager = BaseClass.extend({
	init : function (obj) {
		__.bindAll(this, "onLocalConnection", "onCloudConnection");
		this.localIo = obj.localIo;
		this.localIo.sockets.on('connection', this.onLocalConnection);
	},
	setCloudSocket	: 	function (cloudSocket) {
		this.cloudSocket = cloudSocket;
		this.cloudSocket.on('connect', this.onCloudConnection);
	},
	onCloudConnection : function () {
		if(this.cloudSocketConnectionDone) return;
		this.onLocalConnection(this.cloudSocket);
		this.cloudSocketConnectionDone = true;
	},
	onLocalConnection : function (socket) {
		socket.on('/room/list', __.bind(this.onRoomListRequest, this, socket));
		socket.on('/group/list', __.bind(this.onRoomListRequest, this, socket));
		socket.on('/device/list', __.bind(this.onDeviceListRequest, this, socket));
		socket.on('/mood/list', __.bind(this.onMoodListRequest, this, socket));
//		console.log('Added Request Listners!!');
	},
	onDeviceListRequest : function (socket, reqData, calback) { 
		//Fucking defer is required else callback gets delayed as it goes along with emit.
		__.defer(function () {__.each(deviceInfoConfig.getList(), function (info) {
			socket.emit('onDeviceUpdate', info);
		})});
		calback([]);
	},
	onMoodListRequest : function (socket, reqData, calback) {
		__.defer(function () {__.each(moodConfig.getList(), function (info) {
			socket.emit('moodConfigUpdate', info);
		})});
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
		__.each(__.keys(groupConfig.data), function (id, i) {
			setTimeout(__.bind(function (idd) {
				socket.emit('roomConfigUpdated', groupConfig.getGroupDetails(idd))
			}, null, id),(i>5?500:0)+50*(i%5));
		});
		if(typeof calback == 'function') calback([]);
	}
});

module.exports = RequestManager;
