var parsers = require("serialport").parsers;
var SerialPort = require("serialport").SerialPort;

var BaseClass = require(__rootPath+"/classes/baseClass");
var __ = require("underscore");

var BaseCommunicator = BaseClass.extend({
	baudrate: 9600,
	portAddress : "/dev/ttyAMA0",
	serialPort : null,
	_data : "",
	deviceList : [],
	_macIdNwkIdMap : {},
	_queryQ : [],
	_pendingReqCallbackMap : {},
	_timeoutPendingRequests : function () {
		__.each(this._pendingReqCallbackMap, function (callback, code) {
			callback && callback('timeout');
		}, this);
		this._pendingReqCallbackMap = {};
	},
	byteStrToHexStr : function (byteStr) {
        var hexOut = "";
        for (var i=0; i<byteStr.length; i++) {
                var tmp = byteStr.charCodeAt(i).toString(16);
                if (tmp.length == 1) tmp = "0"+tmp;
                hexOut += tmp;
        }
        return hexOut;
	},
	byteDataToStr : function (data){
		byteStr = '';
		for (var i=0; i < data.length; i++) {
			byteStr += String.fromCharCode( parseInt(data[i], 16).toString(16) );
		}
		return byteStr;
	},
	init : function () {
		this.serialPort = new SerialPort(this.portAddress, {
			baudrate: this.baudrate,
			parser: parsers.raw
		}, false);
		this.serialPort.open(__.bind(function () {
			this._broadcast(); // for some reason we do not get response to first request, so a dummy request.
			setTimeout(__.bind(this._onPortOpen, this), 1000);
		}, this));
		setInterval(__.bind(this._timeoutPendingRequests, this), 3000);
		this.querySentTimeStamp = this.zModRestartedAt =this.lastPacketRecievedAt = new Date().getTime()/1000; // 
	},
	checkCommunication : function () {},
	_onPortOpen : function () {
		console.log("###### serialPort has oppened.")
		this.serialPort.on('data', __.bind(this._onDataArrival, this));
		setTimeout(__.bind(this.checkCommunication, this), 3000);
		this._broadcastLoop(5);
		setTimeout(__.bind(function(){
			setInterval(__.bind(this._checkConnectivity, this),5000);
		}, this), 10000); //after 10 seconds
		setTimeout(__.bind(function(){
			this.restartBroadcasting(30);
			this.networkPinger(); //start network pinger
		}, this), 60000); //after 60 seconds	
	},
	stopBroadcasting : function () {
		clearTimeout(this.broadcastLoopTimer);
		this.broadcastLoopTimer = null;
	},
	restartBroadcasting : function (frq) {
		if (!frq) frq=30;
		console.log("############## restarting Broadcast with frq", frq)
		this.muteNetworkPings = (frq <= 5);
		this.stopBroadcasting();
		this._broadcastLoop(frq);
	},
	_broadcastLoop : function (frq) { //frequency in seconds
		if (!frq) frq=30;
		if(this._queryQ.length || ((new Date().getTime()/1000)-this.querySentTimeStamp) < 0.5)
			return this.broadcastLoopTimer = setTimeout(__.bind(this._broadcastLoop, this, frq), 200);
		this._broadcast();
		this.broadcastLoopTimer = setTimeout(__.bind(this._broadcastLoop, this, frq), frq*1000)
	},
	_checkConnectivity : function () {
		var allowedNoOfSeconds = 4*Math.max(10, this.deviceList.length) + 1;
		if( ((new Date().getTime()/1000) - this.lastPacketRecievedAt) > allowedNoOfSeconds) {
			console.log("########### Zigbee Module stopped responding")
			this.zModRestartedAt = this.lastPacketRecievedAt = new Date().getTime()/1000;
			__restartZigbeeModule();
		}
		var unreachableCount=0, maxTimeStamp=0, recheckList = [];
		__.each(this.deviceList, function (dev) {
			if(dev.unreachable) unreachableCount++;
			maxTimeStamp=Math.max(maxTimeStamp, dev.lastSeenAt);
			if((dev.lastSeenAt < ((Date.now()/1000) - allowedNoOfSeconds)) && !dev.unreachable) {
				dev.unreachable = true;
				this.emit("deviceUnreachable", dev.macAdd);
			}
			if((dev.lastSeenAt < ((Date.now()/1000) - allowedNoOfSeconds/2)) && !dev.unreachable) recheckList.push(dev);
		}, this)
		__.each(recheckList, function (dev, i) {
			console.log("########### rechecking connectivity of",dev.macAdd, "last seen", parseInt((Date.now()/1000)-dev.lastSeenAt)+"sec ago");
			setTimeout(__.bind(function(dInfo){
				this._send("\x2B0302"+dInfo.nwkAdd+"\x0D", function () { });
			},this, dev), i*100);
		}, this);
		maxTimeStamp=Math.max(maxTimeStamp, this.zModRestartedAt||0);
		if(this.deviceList.length == unreachableCount) {
			console.log("########### all",unreachableCount, "devices seems unreachable.");
			var threstHold = 120
			if(maxTimeStamp < ((Date.now()/1000) - threstHold)) {
				console.log("########### no communication from any router for more than", threstHold, 'seconds')
				this.zModRestartedAt = new Date().getTime()/1000;
				__restartZigbeeModule(__.bind(function(){setTimeout(__.bind(this.getNetworkKey, this), 3000)}, this));
			}
		}
	},
	_onDataArrival : function (data) {
		data = this.byteDataToStr(data);
		this._processArrivedData(data);
	},
	_processArrivedData : function(data) {

	},
	_processPacket : function (data) {

	},
	_broadcast : function () {
	},
	_send : function (command, callback) {
		this.querySentTimeStamp = new Date().getTime()/1000;
		this.serialPort.write(__.map(command, function (c){return c.charCodeAt(0);}), function(err, results) {
			if (err) {
				console.log('Error: error while writing data on serial Port');
				throw err
			}
			if (callback && typeof callback == 'function') callback(err, results)
		});	
	},
	getDeviceIds : function() {
		return __.map(this.deviceList, function (itm){return itm.deviceId});
	},
	_getMacAdd : function (devId) {
		try {return __.findWhere(this.deviceList, {'deviceId':devId}).macAdd;}
		catch(err){return null;}
	},
	_getNwkAdd : function (devId) {
		return this._macIdNwkIdMap[devId];
		// try {return __.findWhere(this.deviceList, {'deviceId':devId}).nwkAdd;}
		// catch(err){return null;}
	},
	updateNetworkKey : function (networkKey, callback) {
		callback && callback('noSupport');
	},
	getNetworkKey : function (callback) {
		callback && callback('noSupport');
	},
	onModuleConfigurationDone : function(err, macId, moduleType){
		setTimeout(__.bind(function(){
			this.restartBroadcasting(5);
			setTimeout(__.bind(function(){
				this.restartBroadcasting(30);
			}, this), 60000); //after 60 seconds
		}, this), 15000); //after 15 seconds	
	}

});
module.exports = BaseCommunicator;