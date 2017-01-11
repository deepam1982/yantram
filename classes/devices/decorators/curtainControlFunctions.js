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
	moveCurtain : function (switchId, state, callback) {
		var direction = (state == "close")?1:0;
		var normalSwitches = this.numberOfSwitches - 2*this.numberOfCurtainControls;
		var curtainId = switchId - normalSwitches;
		switchId = normalSwitches + 2*curtainId + direction;
		var switchId_sec = switchId+((direction)?(-1):1), pState = (state!='stop')?1:0;
		if(state=='stop') this.stopPendingSwitchCommands();
		if(this.getSwitchState(switchId) ^ pState || this.getSwitchState(switchId_sec) ^ 0) {
			this.setSwitchState(switchId_sec,0);
			this.setSwitchState(switchId,pState);
			callback && callback();

		}
		else {
			var switchObjArr = [{"switchNo":switchId, "state":pState},{"switchNo":switchId_sec, "state":0}];
			this.setSwitch(switchObjArr, callback);
		}
	}
}