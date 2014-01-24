var BaseClass = require(__rootPath+"/classes/baseClass");
var __ = require("underscore");
var BaseVirtualDevice = BaseClass.extend({
	className : "BaseVirtualDevice",
	init : function(obj) {
		__.bindAll(this, 'setState');
		this.state=(obj && obj.state)?obj.state:false;
		this.onStateChange = this._onStateChange		 // user may reimplement this.
		this.followObjs = [];
	},
	_onStateChange : function () {
		console.log("_onStateChange called for "+this.className);
		this.emit("stateChanged", this.state);
	},
	setState : function (state) {
		state = (state)?true:false;
		if(!this.maintainState && this.state != state) {
			this.state=state; 
			this.onStateChange();
		}
		this.emit("switch"+((this.state)?"On":"Off"));
	},
	switchOn : function () {
		this.setState(true);
	},
	switchOff : function () {
		this.setState(false);
	},
	follow : function (obj) {
		obj.on("stateChanged", this.setState)
		this.followObjs.push(obj);
	},
	unfollow : function (obj) {
		obj.off("stateChanged", this.setState);
		this.followObjs = __.without(this.followObjs, obj);
	}

});
module.exports = BaseVirtualDevice;