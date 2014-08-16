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
		var msgId = data.substr(1,2);
		var msgTypeCode = data.substr(3,4);
		// if(msgTypeCode != '0301')
		// 	console.log( "$$$$$$$$$$$$$$$$$$$$$ response recieved  - "+data);
		this._pendingReqCallbackMap[msgTypeCode] && this._pendingReqCallbackMap[msgTypeCode](null, data.substr(7)); 
		this._pendingReqCallbackMap[msgTypeCode] = null;					
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
			case '0103'	: 	this._networkKeyUpdateResponse && this._networkKeyUpdateResponse(); return; break;
			default 	: 	return;
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
			default :  qry = queryObj.name;
		}
		return qry;
	},

	sendQuery : function (devId, queryObj, callback) {
		var nwkAdd = devId?this._getNwkAdd(devId):'';
		var queryInHexStr = this._buildQuery(queryObj)
		var cbk = function (err, results, queryInHxStr) {
//			console.log( "$$$$$$$$$$$$$$$$$$$$$ sent query - "+queryInHxStr);
			callback && callback(err, results, queryInHxStr);
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

	updateNetworkKey : function (networkKey, callback) {
		if(networkKey.length != 32 || networkKey.search(/^[a-fA-F0-9]*$/g) != 0) {
			callback && callback('invalidKey');
			return;
		}
		console.log(qry)
		this.sendQuery(null, {name:qry});
		this._pendingReqCallbackMap["0106"] = callback;
	}, 

	checkCommunication : function () {
		console.log("Checking Communication.");
		this._pendingReqCallbackMap["FFFF"] = function (err) {
			console.log("Test Communication "+((err)?"Failed!!":"Success!!"));
		}
		this.sendQuery(null, {name:"FFFF"});
	},

	checkSerialCable	: function (callback) {
		console.log("checking Serial cable connection!!");
		this.sendQuery(null, {name:"0201"});
		this._pendingReqCallbackMap["0201"] = callback;
	}, 

	configureModule : function (moduleName, callback) {
		this.checkSerialCable(__.bind(function (err, msg) {
			if(err) {callback('noConnect');return;}
			console.log(msg)
			this.sendQuery(null, {name:"0202"});
			console.log("sent 0202 query to module");
			this._pendingReqCallbackMap["0202"] = __.bind(function (err, macId) {
				if(!err) console.log("got response of 0202 query");
				console.log(macId)
				this.sendQuery(null, {name:"0102"});
				this._pendingReqCallbackMap["0102"] = function (err, mmsg) {console.log(mmsg);}
				this.checkSerialCable(function (err, mmsg) {console.log(mmsg);})
				callback(err, macId);
//					this.sendQuery(null, {name:"0105"}); // restart coordinator
			}, this);
		}, this));
	}


});
module.exports = CC2530Controller;

