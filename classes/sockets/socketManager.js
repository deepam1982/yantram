var __ = require("underscore");
var BaseClass = require(__rootPath+"/classes/baseClass");
var groupConfig = require(__rootPath+"/classes/configs/groupConfig");
var moodConfig = require(__rootPath+"/classes/configs/moodConfig");

var SocketManager = BaseClass.extend({
	init : function (obj) {
		this.io = obj.io;
		this.cloudSocket = null;
		this.nameSpace = obj.nameSpace
	},
	getSockets : function () {
		return (this.nameSpace)?this.io.of(this.nameSpace):this.io.sockets
	},
	initilizeSubManagers : function() {
		var sockets = this.getSockets();

		sockets.on('connection', __.bind(function (socket) {
			console.log('Socket connection established!!');
			socket.on('checkConfigurations', __.bind(this.checkConfigurations, null, socket));
			this.checkConfigurations(socket);
		}, this));
		setInterval(function () {sockets.emit('sudoHeartbeat')}, 1000);


		var SocketCommandManager = require(__rootPath + '/classes/sockets/commandManager')
		this.socComMngr = new SocketCommandManager({'sockets':sockets});

		var SocketRequestManager = require(__rootPath + '/classes/sockets/requestManager')
		this.socReqMngr = new SocketRequestManager({'sockets':sockets});

		var SocketEditManager = require(__rootPath + '/classes/sockets/editManager')
		this.socEdtMngr = new SocketEditManager({'sockets':sockets});

		var FileReader = require(__rootPath + '/classes/sockets/fileReader')
		this.fileReader = new FileReader({'sockets':sockets});
	},
	initCloudSocket	: function(){
		require(__rootPath + '/classes/sockets/initClientSocket')(__.bind(function (err, cloudSocket) {
              this.cloudSocket = cloudSocket;
              groupConfig.publishGroupConfig();
              this.socComMngr.setCloudSocket(cloudSocket);
              this.socReqMngr.setCloudSocket(cloudSocket);
              this.fileReader.setCloudSocket(cloudSocket);
              this.socEdtMngr.setCloudSocket(cloudSocket);
            }, this));
	}, 
	subscribeConfigEvents	: function() {

		groupConfig.on('groupDeleteStart', __.bind(function (groupId) {
			this.getSockets().emit('deleteGroup', groupId);
			this.cloudSocket && this.cloudSocket.emit('deleteGroup', groupId);
		}, this));
		groupConfig.on('publishGroupConfig', __.bind(function (conf) {
			this.getSockets().emit('roomConfigUpdated', conf);
			__.defer(function (conff) {this.cloudSocket && this.cloudSocket.emit('roomConfigUpdated', conff);}, conf);
		}, this));

		__remoteDevInfoConf.on('publishDeviceConfig', __.bind(function (conf) {
			this.getSockets().emit('onDeviceUpdate', conf);
			__.defer(function (conff) {this.cloudSocket && this.cloudSocket.emit('onDeviceUpdate', conff);}, conf);
		}, this));
		__remoteDevInfoConf.on('deviceDelete', __.bind(function (deviceId) {
			this.getSockets().emit('deleteDevice', deviceId);
			this.cloudSocket && this.cloudSocket.emit('deleteDevice', deviceId);
		}, this));
		
		moodConfig.on('moodDeleteStart', __.bind(function (moodId) {
			this.getSockets().emit('deleteMood', moodId);
			this.cloudSocket && this.cloudSocket.emit('deleteMood', moodId);
		}, this));

		moodConfig.on('moodConfigChanged', __.bind(function (moodId) {
			var list=moodId?[moodConfig.getMoodDetails(moodId)]:moodConfig.getList()
			__.each(list, function (info) {
				this.getSockets().emit('moodConfigUpdate', info);
			}, this);
		}, this));

	},
	checkConfigurations : function (socket){
		if(!__userConfig.get('zigbeeNetworkName') || !__userConfig.get('zigbeeNetworkKey'))
			socket.emit('switchPage', 'welcomeScreen'); //socket.emit('switchPage', 'networkSetting');
		else if(!__userConfig.get('email') || !__userConfig.get('password'))
			socket.emit('switchPage', 'cloudSetting');
		else if(!__.keys(__remoteDevInfoConf.data).length)
			socket.emit('switchPage', 'configureModule');
		else
			socket.emit('switchPage', 'mainPage');
	}
});

module.exports = SocketManager;