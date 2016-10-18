var BaseVirtualDevice = require(__rootPath+"/classes/virtualDevices/baseDevice");
var __ = require("underscore");
var Load = BaseVirtualDevice.extend({
	className : "Load",
	setState : function (state) {
		state = (state)?true:false;
		if (!this.syncPending && this._initSyncDone && 
					this.state != state && __.size(this.followObjs)){
			this.startAvoidFollow();
		}
		this._super.apply(this, arguments);
		this._initSyncDone = true;
	},
	startAvoidFollow : function () {
		//	console.log("#### setting avoidFollow to true");
		if(this.manualTime) this.avoidFollow = true;
		this._manageAvoidFollow();		
	},
	_manageAvoidFollow : function () {
		if(this.avoidFollow) {
			clearTimeout(this.mnStTimer);
			console.log("####", this.id, "will avoid follow for", this.manualTime, "seconds")
			this.mnStTimerSetTime = (new Date).getTime();
			this.mnStTimer = setTimeout(__.bind(function () {
				this.avoidFollow = false;
				if(this.state) { // only need to turn off .. turn on will be taken care by follow logic itself
					console.log('#### Setting state as per follow logic.')
					this._setStateAsPerFollowLogic()
				}
			}, this),this.manualTime*1000)
		}
	},
	getRemainingTimeToToggle :function (sudoState) { // in seconds
		var time = this._super.apply(this, arguments);
		if(this.avoidFollow && this.state) {
			time = Math.max(time, this.manualTime + parseInt(((new Date).getTime()-this.mnStTimerSetTime)/1000))
		} 
		return time;
	},
	_onBubbleUpFollowObjChange : function (objId, objState) {
		this._manageAvoidFollow();
		this._super.apply(this, arguments);
		if(!objState) this.emit('onToggleTimeUpdate'); //emit only when actual sensor turns high to low. or else there will be unwanted notifications
	}
});

module.exports = Load;