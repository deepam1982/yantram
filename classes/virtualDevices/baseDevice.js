var BaseClass = require(__rootPath+"/classes/baseClass");
var __ = require("underscore");
var BaseVirtualDevice = BaseClass.extend({
	className : "BaseVirtualDevice",
	init : function(obj) {
		__.bindAll(this, 'setState', '_setStateAsPerFollowLogic');
		this.id=(obj && obj.id)?obj.id:new Date().getTime();
		this.state=(obj && obj.state)?obj.state:false;
		this.onStateChange = this._onStateChange		 // user may reimplement this.
		this.followObjs = {};
	},
	_onStateChange : function (force) {
	//	console.log("_onStateChange called for", this.className, this.id);
		this.emit("stateChanged", this.state);
		this.emit("switch"+((this.state)?"On":"Off"));
	},
	setState : function (state) {
		this._setState(state, true);
	},
	_setState : function (state, force) {
		// console.log("id="+this.id+"     this.state = "+this.state+"   state="+state +
		// 			"  force="+force+"   this.maintainState="+this.maintainState);
		state = (state)?true:false;
		if (this.state != state && (force || !this.maintainState)) {
			this.state=state; 
			this.onStateChange(force);
//			this.emit("switch"+((this.state)?"On":"Off"));
		}
		if(!force && this.maintainState && this.state == state)
			this.emit("switch"+((this.state)?"On":"Off"));
	},
	_switchOn : function () {
		this._setState(true);
	},
	_switchOff : function () {
		this._setState(false);
	},
	_setStateAsPerFollowLogic : function (state) {
		try {
			if(this.followLogic)
				eval("state=("+this.followLogic+")");
			__.defer(__.bind(this._setState, this, state));
		} catch (err) {console.log(err);}
	},
	follow : function (objs, onLogic, offLogic) {
		if (!onLogic) onLogic=false; if (!offLogic) offLogic=false;
		var followLogic = (!(onLogic || offLogic))?null:("(this.state||("+onLogic+"))&&!(this.state&&("+offLogic+"))");
		objs = [].concat(objs);
		__.each(objs, function (obj){
			obj.on("stateChanged", this._setStateAsPerFollowLogic);
			this.followObjs[obj.id]=obj;
		}, this);
		if (followLogic) {
			nodeIdArr = __.uniq(followLogic.replace(/(&&)|(\|\|)|(\()|(\)|(!))/g, " ").replace(/ +(?= )/g,"").trim().split(" "));
			__.each(nodeIdArr, function (id) {
				if(__.contains(["this.state", "true", "false"], id)) return;
				followLogic=followLogic.replace(new RegExp(id, "g"), "this.followObjs['"+id+"'].state");
			}, this);
			this.followLogic = followLogic;
		}
	},
	unfollow : function (objs) {
		objs = [].concat(objs);
		__.each(objs, function (obj){
			obj.on("stateChanged", this._setStateAsPerFollowLogic);
			this.followObjs = __.omit(this.followObjs, obj.id);
		}, this);
	}

});
module.exports = BaseVirtualDevice;