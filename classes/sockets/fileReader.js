var __ = require("underscore");
var fs = require('fs');
var BaseClass = require(__rootPath+"/classes/baseClass");
var FileReader = BaseClass.extend({
	init : function (obj) {
//		this.localIo = obj.localIo;
//		this.localIo.sockets.on('connection', __.bind(this.onLocalConnection, this));
		obj.sockets.on('connection', __.bind(this.onLocalConnection, this));
	},
	setCloudSocket	: 	function (cloudSocket) {
		this.cloudSocket = cloudSocket;
		this.onCommonConnection(cloudSocket);
	},
	onLocalConnection : function (socket) {
		this.onCommonConnection(socket);
	},
	onCommonConnection : function (socket) {
		socket.on('fetchFile', __.bind(this.fetchFile, this, socket));
	},
	fetchFile : function (socket, obj, callback) {
		var fileName = obj.fileName
		fs.exists(fileName, function(exists) {
			if(!exists) return socket.emit("fileContentStream", {"token":obj.token, data:"file does not exist"});
			fs.readFile(fileName, "utf8", function(err, data) {
				if(err) return socket.emit("fileContentStream", {"token":obj.token, data:err});
				while(data) {
					socket.emit("fileContentStream", {"token":obj.token, data:data.substr(0,800)});
					data = data.substr(800);
				}
				return 
			});
		});

	}

});

module.exports = FileReader;