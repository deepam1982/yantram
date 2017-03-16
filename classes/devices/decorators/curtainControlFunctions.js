var __ = require("underscore");
module.exports ={
	_recordDeviceStatus : function (msg) {
		var oldSt = __.clone(this.curtainControlState); 
		this._setCurtainState();
		this._super(msg);
		var changedIndexes = []
		var fstCrtnSwIndx = this.numberOfSwitches - 2*this.numberOfCurtainControls;
		__.times(this.numberOfCurtainControls, function(indx){
			if(oldSt[indx] != this.curtainControlState[indx]) changedIndexes.push(fstCrtnSwIndx + indx);
		}, this);
		if (changedIndexes.length) this.emit('stateChanged', 'curtain', changedIndexes);
	},
	_setCurtainState : function () {
		__.times(this.numberOfSwitches, function(indx){
			var fstCrtnSwIndx = this.numberOfSwitches - 2*this.numberOfCurtainControls;
			if(indx < fstCrtnSwIndx) return;
			var crtnIndx = parseInt((indx-fstCrtnSwIndx)/2);
			if(!(indx-(fstCrtnSwIndx+2*crtnIndx))%2)this.curtainControlState[crtnIndx] = 0;
			if(this.switchState[indx]) this.curtainControlState[crtnIndx] =((indx-(fstCrtnSwIndx+2*crtnIndx))%2)?"closing":"opening";
		}, this);
	},
	curtainTimerObj : {}, //it could be singleton as every instance will have unique device id
	moveCurtain : function (switchId, state, timeInSec, callback) {
		if(!timeInSec || typeof timeInSec == 'function') {callback = timeInSec; timeInSec=0}
		var direction = (state == "close")?1:0; //possible state are stop, open, close
		var normalSwitches = this.numberOfSwitches - 2*this.numberOfCurtainControls;
		var curtainId = switchId - normalSwitches, iSwId = switchId;
		switchId = normalSwitches + 2*curtainId + direction;
		var curtainUID = this.id + '-c' + curtainId;
		if(!this.curtainTimerObj[curtainUID]) this.curtainTimerObj[curtainUID] = {};
		var tmrObj = this.curtainTimerObj[curtainUID]
		if(tmrObj.tmr) clearTimeout(tmrObj.tmr);
		var switchId_sec = switchId+((direction)?(-1):1), pState = (state!='stop')?1:0;
		if(state=='stop') this.stopPendingSwitchCommands();
		if(this.getSwitchState(switchId) ^ pState || this.getSwitchState(switchId_sec) ^ 0) { //case of first command
			this.setSwitchState(switchId_sec,0);
			this.setSwitchState(switchId,pState);
			callback && callback();
		}
		else { // case of repeated command
			var switchObjArr = [{"switchNo":switchId, "state":pState},{"switchNo":switchId_sec, "state":0}];
			this.setSwitch(switchObjArr, callback);
		}
		if(timeInSec) 
			tmrObj.tmr = setTimeout(__.bind(function(sw, st, t){this.moveCurtain(sw, (t)?st:'stop', t)}, this, iSwId, state, Math.max(0, --timeInSec)),1000); 
	}
}