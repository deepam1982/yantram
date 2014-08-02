RoomModel = BaseModel.extend({
	urlRoot		:	'/room/model/',
	powerOff	:	function () {
		_.each(_.filter(this.attributes.controls, function (obj){return obj.state != 'off';}), function(obj){
			this.toggleSwitch(obj.devId, obj.switchID, obj.state);
		}, this);
//		this.sendActionRequest("powerOff/");
	},
	toggleSwitch : function (devId, switchId, state, calback) {
		this.sendActionRequest("toggleSwitch", {"devId":devId, "switchId":switchId, "state":state}, calback);	
	}
})

SwitchModel = BaseModel.extend({
	urlRoot		:	'/room/model/',
	toggelSwitch : function (calback, errorCalback) {
		var devId = this.get('devId'), switchId = this.get('switchID'), state=this.get('state');
		console.log("toggelSwitch called "+devId+" "+switchId+" "+state);
		this.sendActionRequest("toggleSwitch", {"devId":devId, "switchId":switchId, "state":state}, calback, errorCalback);	
	},
	setDuty : function (duty, calback) {
		this.sendActionRequest("setDuty", {"duty":duty, "devId":this.get('devId'), "switchId":this.get('switchID')}, calback);	
	}
})
FanModel = SwitchModel.extend({
	setDuty : function (duty, calback) {
		this.sendActionRequest("setDuty", {"duty":duty, "devId":this.get('devId'), "switchId":this.get('switchID')}, calback);	
	}
});