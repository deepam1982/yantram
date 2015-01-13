var __ = require("underscore");
var Stabilizer = require(__rootPath+"/classes/virtualDevices/stabilizer");

var Load = Stabilizer.extend({
	className : "Load",
	setState : function (state) {
		state = (state)?true:false;
		if (!this.syncPending && this._initSyncDone && 
					this.state != state && __.size(this.followObjs)){
			console.log(" #### setting new switch msStTm");
			this.mnStTm = Math.max(this.manualTime || 15*60, this.mnStTm);
			this._setMaintainState();
		}
		this._super.apply(this, arguments);
		this._initSyncDone = true;
	},
	_setMaintainState : function () {
		if (this.syncPending || !__.size(this.followObjs)) return;
		this._super.apply(this, arguments);
	},
	_reduceMaintainStateTime : function () {
		if (this.syncPending || !__.size(this.followObjs)) return;
		this._super.apply(this, arguments);
	}
});

module.exports = Load;