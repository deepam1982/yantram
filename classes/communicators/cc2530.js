var __ = require("underscore");

var BaseCommunicator = require(__rootPath+"/classes/communicators/baseCommunicator");
var CC2530Controller = BaseCommunicator.extend({
	baudrate: 115200,
	_broadcast : function () {
		this._send("\x2B0301FFFF\x0D", function () { // "\x2B0302FFFF"
//			console.log('##### Sent broadcast')
		});
	},
	_hexCharToInt: function(str) {
		var intt = str.charCodeAt(0);
		return (intt - ((intt > 0x40)?0x37:0x30));
	},
	_intToHexStr : function(integer) { 
		var str = Number(integer).toString(16); 
		str = str.length == 1 ? "0" + str : str;
		return str.toUpperCase(); 
	},
	_invertBinaryNumber : function (hexNum) {
		var swst = this._hexCharToInt(hexNum[0])*0x10 + this._hexCharToInt(hexNum[1]);
		var newSt = 0;
		for (var i=0; i<5; i++) {newSt += (swst>>i) % 2; newSt = newSt<<1;}
		newSt = newSt>>1;
		return this._intToHexStr(newSt);							
	},
	_processPacket : function (data) {
//		console.log( "$$$$$$$$$$$$$$$$$$$$$ response recieved  - "+data);
		var msgId = data.substr(1,2);
		var msgTypeCode = data.substr(3,4);
		if(data.length < 8) return;
		var sourceMacAdd = data.substr(7,16);
		var sourceNwkAdd = data.substr(23,4);
		var msg = data.substr(29);
		switch (msgTypeCode) {
			case '0301' : 	this._handleBroadcastResponse(sourceMacAdd, sourceNwkAdd, msg); break;
			case '0302' : 	var state = this._invertBinaryNumber(msg.substr(6,2))+msg.substr(2,2)+msg.substr(0,2); 
							this.emit('msgRecieved', "DVST", state, sourceMacAdd); break;
			case '0304'	: 	this.emit('msgRecieved', "STSWPT", msg, sourceMacAdd); break;
			case '0305'	: 	this.emit('msgRecieved', "STFSD", msg, sourceMacAdd); break;
		}
//		console.log(msgId);
		if (msgTypeCode == '0301') this._handleBroadcastResponse(sourceMacAdd, sourceNwkAdd, msg); 
		else if (__.contains(['\x00\x01', '\x00\x20', '\x00\x40'], msgTypeCode)) 
			this.emit('msgRecieved', msg.substr(0,4), msg.substr(4), this.byteStrToHexStr(sourceAdd));
 
		// else if (__.contains(['\x00\x01', '\x00\x20', '\x00\x40'], msgTypeCode)) 
		// 	this.emit('msgRecieved', msg.substr(0,4), msg.substr(4), this.byteStrToHexStr(sourceAdd));
	},
	_processArrivedData : function(data) {
		this._data += data;
		if (!__.contains(['\x2B', '\x2D'], this._data[0])){
			var mAr = this._data.match(/[\x2D\x2B]/);
			if (!mAr) return;
			this._data = this._data.substr(mAr[1]||mAr['index']);
		}
		var mAr = this._data.match(/[\x0D]/);
		if(mAr) {
			var indx=(mAr[1]||mAr['index']);
			this._processPacket(this._data.substr(0, indx));
			var leftOver = this._data.substr(indx);
			this._data = "";
			this._processArrivedData(leftOver);
		}
	},
	_handleBroadcastResponse :function (macAdd, nwkAdd, deviceName) {
		var listItem = __.findWhere(this.deviceList, {'macAdd':macAdd});
		if (listItem) __.extend(listItem, {'nwkAdd':nwkAdd, 'lastSeenAt':(new Date().getTime() / 1000)});
		else {
			this.deviceList.push({'macAdd':macAdd, 'deviceId':macAdd, 'nwkAdd':nwkAdd, 'lastSeenAt':(new Date().getTime() / 1000)});
			console.log('device with macId:'+macAdd+" found at netAdd:"+nwkAdd);
			setTimeout(__.bind(this.emit, this, 'msgRecieved', "DVTP", deviceName, macAdd), 1000);
		}
	},
	_buildQuery : function (queryObj) {
		var qry = "";
		switch (queryObj.name) {
			case "GTDVTP" :  qry="0301"; break;
			case "GTDVST" :  qry="0302"; break;
			case "STSWPT" :  qry="0304"+this._invertBinaryNumber(queryObj.value);break; 
			case "STFSD" :  qry="0305"+this._intToHexStr(queryObj.id)+queryObj.value;break; 
		}
		return qry;
	},

	sendQuery : function (devId, queryObj, callback) {
		var nwkAdd = this._getNwkAdd(devId);
		var queryInHexStr = this._buildQuery(queryObj)
		var cbk = function (err, results, queryInHxStr) {
//			console.log( "$$$$$$$$$$$$$$$$$$$$$ sent query - "+queryInHxStr);
			callback(err, results, queryInHxStr);
		}
		this._queryQ.push({'query':"\x2B"+queryInHexStr+nwkAdd+"\x0D", 'callback':cbk, 'queryInHexStr':queryInHexStr});
//		console.log("Qurey pushed to Query Q");
		if(!this._processQueryQ)
			this._processQueryQ = __.throttle(__.bind(function(){
//				console.log("Processing Query Q");
				var qObj = this._queryQ.shift();
				qObj && this._send(qObj.query, function (err, results) {qObj.callback(err, results, qObj.queryInHexStr)});
				if(this._queryQ.length) this._processQueryQ();
			}, this), 50);
		this._processQueryQ();
		//this._send(mask+queryInHexStr, callback);
	},


});
module.exports = CC2530Controller;

