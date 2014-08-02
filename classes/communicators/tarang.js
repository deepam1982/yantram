var __ = require("underscore");

var BaseCommunicator = require(__rootPath+"/classes/communicators/baseCommunicator");
var TarangController = BaseCommunicator.extend({
	_processPacket : function (data) {
		var msgTypeCode = data.substr(1,2);
		var sourceAdd = data.substr(4,4);
		var msg = data.substr(8);
		if(msg.substr(msg.length-2,2) == '\x0d\x0a') msg = msg.substr(0,msg.length-2);
		if (msgTypeCode == '\x00\x04') this._handleBroadcastResponse(sourceAdd, msg);  
		else if (__.contains(['\x00\x01', '\x00\x20', '\x00\x40'], msgTypeCode)) 
			this.emit('msgRecieved', msg.substr(0,4), msg.substr(4), this.byteStrToHexStr(sourceAdd));
	},
	_processArrivedData : function(data) {
		this._data += data;
		if (!__.contains(['\x2B', '\x2D'], this._data[0])){
			var mAr = this._data.match(/[\x2D\x2B]/);
			if (!mAr) return;
			this._data = this._data.substr(mAr[1]||mAr['index']);
		}
		if (this._data.length >= 8) {
			var msgLen = this._data.charCodeAt(3);
			if (this._data.length >= msgLen+8 ){
				this._processPacket(this._data.substr(0, msgLen+8));
				var leftOver = this._data.substr(msgLen+8);
				this._data = "";
				this._processArrivedData(leftOver);
			}			
		}		
	},

	_handleBroadcastResponse :function (macAdd, msg) { // in broadcast response sourceAdd is macAdd, but this could be a tarang module bug
		var netAdd = msg.substr(0,4); //network Address
		macAdd = msg.substr(4,4);
		var devId = this.byteStrToHexStr(macAdd); // deviceId
		var listItem = __.findWhere(this.deviceList, {'macAdd':macAdd});
		if (listItem) __.extend(listItem, {'netAdd':netAdd, 'lastSeenAt':(new Date().getTime() / 1000)});
		else {
			this.deviceList.push({'macAdd':macAdd, 'deviceId':devId, 'netAdd':netAdd, 'lastSeenAt':(new Date().getTime() / 1000)});
			console.log('device with macId:'+devId+" found at netAdd:"+this.byteStrToHexStr(netAdd));
			setTimeout(__.bind(this.emit, this, 'newDeviceFound', devId), 1000);
		//	__.defer(__.bind(this.emit, this), 'newDeviceFound', devId);
			//this.emit('newDeviceFound', devId);
		}
	},
	_buildQuery : function (queryObj) {
		var qry = queryObj.name;
		if(qry == "GTDVTP" || qry == "GTDVST") return  qry;
		if(qry == "STSWPT") return qry+queryObj.value;
		if(qry == "STFSD") return qry+queryObj.id+queryObj.value;
	},

	sendQuery : function (devId, queryObj, callback) {
		var queryInHexStr = this._buildQuery(queryObj)
		var queryLen = queryInHexStr.length;
		var macAdd = this._getMacAdd(devId);
		var mask = "\x2B\x00\x20" + String.fromCharCode(queryLen+2).toString(16)+macAdd;
		this._queryQ.push({'query':mask+queryInHexStr+"\x0d\x0a", 'callback':callback, 'queryInHexStr':queryInHexStr});
		if(!this._processQueryQ)
			this._processQueryQ = __.throttle(__.bind(function(){
				var qObj = this._queryQ.shift();
				qObj && this._send(qObj.query, function (err, results) {qObj.callback(err, results, qObj.queryInHexStr)});
				if(this._queryQ.length) this._processQueryQ();
			}, this), 10);
		this._processQueryQ();
		//this._send(mask+queryInHexStr, callback);
	},
	_broadcast : function () {
		this._send("\x2B\x00\x02\x00\xFF\xFF\xFF\xFF", function () {
//			console.log('##### Sent broadcast')
		});
	},

});

module.exports = TarangController;
