var BaseVirtualDevice = require(__rootPath+"/classes/virtualDevices/baseDevice");
var __ = require("underscore");
var Load = BaseVirtualDevice.extend({
	className : "Load",
	setState : function (state) {
		state = (state)?true:false;
		if (!this.syncPending && this._initSyncDone && 
					this.state != state && __.size(this.followObjs)){
		//	console.log("#### setting avoidFollow to true");
			if(this.manualTime) this.avoidFollow = true;
			this._manageAvoidFollow();
		}
		this._super.apply(this, arguments);
		this._initSyncDone = true;
	},
	_manageAvoidFollow : function () {
		if(this.avoidFollow) {
			clearTimeout(this.mnStTimer);
			console.log("####", this.id, "will avoid follow for", this.manualTime, "seconds")
			this.mnStTimer = setTimeout(__.bind(function () {
				this.avoidFollow = false;
				console.log('#### Setting state as per follow logic.')
				this._setStateAsPerFollowLogic()
			}, this),this.manualTime*1000)
		}

	},
	_setStateAsPerFollowLogic : function (state) {
		this._manageAvoidFollow();
		this._super.apply(this, arguments);
	}
});

module.exports = Load;