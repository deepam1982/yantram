var BaseClass = require(__rootPath+"/classes/baseClass");
var __ = require("underscore");
var BaseVirtualDevice = BaseClass.extend({
	className : "BaseVirtualDevice",
	init : function(obj) {
		__.bindAll(this, 'setState', '_setStateAsPerFollowLogic');
		this.id=(obj && obj.id)?obj.id:new Date().getTime();
		this.deviceId=(obj && obj.deviceId)?obj.deviceId:null;
		this.state=(obj && obj.state)?obj.state:false;
		this.onStateChange = this._onStateChange		 // user may reimplement this.
		this.followObjs = {};
		this.avoidFollow = false;
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
	getRemainingTimeToToggle :function () { // in seconds
		if(!__.size(this.followObjs) || this.timeCalculationIsOn) return Infinity;
		this.timeCalculationIsOn = true;
		var objectTimeMap = {};
		var sudoFollowObjs = {};
		__.each(this.followObjs, function (obj){
			objectTimeMap[obj.id] = obj.getRemainingTimeToToggle();
			sudoFollowObjs[obj.id] = {'state':obj.state};
		}, this)
		objectTimeMap = __.object(__.sortBy(__.pairs(objectTimeMap), function (val){return val[1]}));
		for(var objId in objectTimeMap) {
			if(objectTimeMap[objId] == Infinity) {
				this.timeCalculationIsOn = false; 
				return Infinity;
			}
			sudoFollowObjs[objId].state = !sudoFollowObjs[objId].state
			if(this.state ^ this._simulateState(sudoFollowObjs)) {
				this.timeCalculationIsOn = false; 
				return objectTimeMap[objId];
			}
		}
		this.timeCalculationIsOn = false;
		return Infinity;
	},
	_simulateState : function (sudoFollowObjs) {
		var actualFollowObjects = this.followObjs;
		this.followObjs = sudoFollowObjs;
		eval("var state=("+this.followLogic+")");
		this.followObjs = actualFollowObjects;
		return state;
	},
	_setStateAsPerFollowLogic : function (state) {
		try {
			if(this.followLogic)
				eval("state=("+this.followLogic+")");
			if(!this.avoidFollow)
				__.defer(__.bind(this._setState, this, state));
		} catch (err) {console.log(err);console.log(this.followLogic); console.log(__.keys(this.followObjs));}
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
			obj.off("stateChanged", this._setStateAsPerFollowLogic);
			this.followObjs = __.omit(this.followObjs, obj.id);
		}, this);
	},
	unfollowAll : function () {
		this.unfollow(__.values(this.followObjs));
	}

});
module.exports = BaseVirtualDevice;