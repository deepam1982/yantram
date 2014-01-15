var parsers = require("serialport").parsers;
var SerialPort = require("serialport").SerialPort;

var BaseClass = require(__rootPath+"/classes/baseClass");
var __ = require("underscore");

var byteStrToHexStr = function (byteStr) {
        var hexOut = "";
        for (var i=0; i<byteStr.length; i++) {
                var tmp = byteStr.charCodeAt(i).toString(16);
                if (tmp.length == 1) tmp = "0"+tmp;
                hexOut += tmp;
        }
        return hexOut;
}

var byteDataToStr = function (data){
	byteStr = '';
	for (var i=0; i < data.length; i++) {
		byteStr += String.fromCharCode( parseInt(data[i], 16).toString(16) );
	}
	return byteStr;
}


var TarangController = BaseClass.extend({
	baudrate: 9600,
	portAddress : "/dev/ttyAMA0",
	serialPort : null,
	_data : "",
	deviceList : [],
	_queryQ : [],
	init : function () {
		this.serialPort = new SerialPort(this.portAddress, {
			baudrate: this.baudrate,
			parser: parsers.raw
		}, false);
		this.serialPort.open(__.bind(this._onPortOpen, this));
	},
	_onPortOpen : function () {
		this.serialPort.on('data', __.bind(this._onDataArrival, this));
		this._broadcast();
		setInterval(__.bind(this._broadcast, this), 8000);
	},
	_onDataArrival : function (data) {
		data = byteDataToStr(data);
		this._processArrivedData(data);
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
	_processPacket : function (data) {
		var msgTypeCode = data.substr(1,2);
		var sourceAdd = data.substr(4,4);
		var msg = data.substr(8);
		if (msgTypeCode == '\x00\x04') this._handleBroadcastResponse(sourceAdd, msg);  
		else if (__.contains(['\x00\x01', '\x00\x20', '\x00\x40'], msgTypeCode)) 
			this.emit('msgRecieved', msg, byteStrToHexStr(sourceAdd));
	},
	_handleBroadcastResponse :function (macAdd, msg) { // in broadcast response sourceAdd is macAdd, but this could be a tarang module bug
		var netAdd = msg.substr(0,4); //network Address
		macAdd = msg.substr(4,4);
		var devId = byteStrToHexStr(macAdd); // deviceId
		var listItem = __.findWhere(this.deviceList, {'macAdd':macAdd});
		if (listItem) __.extend(listItem, {'netAdd':netAdd, 'lastSeenAt':(new Date().getTime() / 1000)});
		else {
			this.deviceList.push({'macAdd':macAdd, 'deviceId':devId, 'netAdd':netAdd, 'lastSeenAt':(new Date().getTime() / 1000)});
			console.log('device with macId:'+devId+" found at netAdd:"+byteStrToHexStr(netAdd));
			setTimeout(__.bind(this.emit, this, 'newDeviceFound', devId), 1000);
		//	__.defer(__.bind(this.emit, this), 'newDeviceFound', devId);
			//this.emit('newDeviceFound', devId);
		}
	},
	getDeviceIds : function() {
		return __.map(this.deviceList, function (itm){return itm.deviceId});
	},
	_getMacAdd : function (devId) {
		try {return __.findWhere(this.deviceList, {'deviceId':devId}).macAdd;}
		catch(err){return null;}
	},
	sendQuery : function (devId, queryInHexStr, callback) {
		var queryLen = queryInHexStr.length;
		var macAdd = this._getMacAdd(devId);
		var mask = "\x2B\x00\x20" + String.fromCharCode(queryLen).toString(16)+macAdd;
		this._queryQ.push({'query':mask+queryInHexStr, 'callback':callback});
		if(!this._processQueryQ)
			this._processQueryQ = __.throttle(__.bind(function(){
				var qObj = this._queryQ.shift();
				qObj && this._send(qObj.query, qObj.callback);
				if(this._queryQ.length) this._processQueryQ();
			}, this), 200);
		this._processQueryQ();
		//this._send(mask+queryInHexStr, callback);
	},
	_broadcast : function () {
		this._send("\x2B\x00\x02\x00\xFF\xFF\xFF\xFF", function () {
//			console.log('##### Sent broadcast')
		});
	},
	_send : function (command, callback) {
		this.serialPort.write(__.map(command, function (c){return c.charCodeAt(0);}), function(err, results) {
			if (err) console.log('err ' + err);
			if (callback && typeof callback == 'function') callback(err, results)
		});	
	}
});

module.exports = TarangController;
