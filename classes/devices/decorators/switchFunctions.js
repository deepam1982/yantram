var __ = require("underscore");
module.exports ={
	_getSwitchStateMsg : function (msg) {return msg;},
	_recordDeviceStatus : function (msg) {
		var oldSwSt = this._binStateToInt(this.switchState); 
		this._setSwitchState(this._getSwitchStateMsg(msg));
		this._super(msg);
		var changebits = oldSwSt ^ this._binStateToInt(this.switchState)
		var changeSwitchIndexes = []
		__.times(this.numberOfSwitches, function(indx){
			if((changebits>>indx) % 2) changeSwitchIndexes.push(this.numberOfSwitches-1-indx);
		}, this);
		if (changebits) this.emit('stateChanged', 'load', changeSwitchIndexes);
	},
	_setSwitchState : function (msg) {
		var swst = this._hexCharToInt(msg[0])*0x10 + this._hexCharToInt(msg[1]);
		__.times(this.numberOfSwitches, function(indx){
			this.switchState[this.numberOfSwitches-1-indx] = (swst>>indx) % 2;	
		}, this);
	},
	_logDVST : function (msg) {
		console.log("#### DVST of "+this.id+" is " + this.switchState);
	},
	setSwitch : function (switchNo, state, callback) {
		if(__.isArray(switchNo)) {var switchObjArr = switchNo, callback = state;}
		else {var switchObjArr = [{"switchNo":switchNo, "state":state}]}

		if (!this.setSwitchQ) this.setSwitchQ = [];
		__.each(switchObjArr, __.bind(function(obj, indx) {
			if(!indx) obj.callback = callback;
			this.setSwitchQ.push(obj);
		},this));
		
		if(!this.__foo)
			this.__foo = __.throttle(__.bind(function(){this._processSetSwitchQ()}, this), 50, {leading: false});
		this.__foo();
	},
	_processSetSwitchQ : function () {
		var copy = __.clone(this.switchState);
		var setSwitchQ = this.setSwitchQ
		this.setSwitchQ = null;
		__.each(setSwitchQ, function (obj){
			if (obj.switchNo >= this.switchState.length) return;
			copy[obj.switchNo] = (obj.state)?1:0;	
		}, this);
		var swst = this._binStateToInt(copy);
//		console.log("Processing Switch Q");
		this._setSwitch(swst, __.bind(function () {
			__.each(setSwitchQ, function (obj) {obj.callback && obj.callback();}, this);
		}, this))
	},
	_setSwitch : function (swst, callback, retryCount) {
		clearTimeout(this.retryTimeout);
		this.retryTimeout = null;
		if(!retryCount)retryCount=0;
		this._sendQuery({name:"STSWPT", value:this._intToHexStr(swst)}, 
			__.bind(function(){
				// successful response comes only when request registers successfully :D
				this.syncState(__.bind(function () {
					if(!this.retryTimeout && !retryCount && this._binStateToInt(this.switchState)^swst) {
						console.log("#### retrying STSWPT")
						this._setSwitch(swst, callback, retryCount+1);
					}
					else callback && callback()
				}, this));
				this.retryTimeout = setTimeout(__.bind(function () {
					if(retryCount < 10 && this._binStateToInt(this.switchState)^swst)
						this._setSwitch(swst, callback, retryCount+1);
				}, this), (retryCount < 5)?200:1000); // if this interval is long (should be 100) it will create problem when user rapidly toggels the switch.	
		}, this));		// and if the interval is short (should be 200) it will resend query when response is on the way.
	},
	stopPendingSwitchCommands : function () {
		this.setSwitchQ = null;
		clearTimeout(this.retryTimeout);
	},
	toggleSwitch : function(switchNo) {
		return this.setSwitchState(switchNo, !this.switchState[switchNo]);
	},
	setSwitchState : function(switchNo, state){
		return this.virtualNodes[this.id+"-l"+switchNo].setState(state);	
	},
	getSwitchState :function(switchNo) {
		return this.virtualNodes[this.id+"-l"+switchNo].state;
	}
}