RoomModel = BaseModel.extend({
	urlRoot		:	'/room/model/',
	powerOff	:	function (calback) {
		// _.each(_.filter(this.attributes.controls, function (obj){return obj.state != 'off';}), function(obj){
		// 	this.toggleSwitch(obj.devId, obj.switchID, obj.state);
		// }, this);
		this.sendActionRequest("groupOff", {'id':this.id}, calback);
	},
	toggleSwitch : function (devId, switchId, state, calback) {
		this.sendActionRequest("toggleSwitch", {"devId":devId, "switchId":switchId, "state":state}, calback);	
	}
})

SwitchModel = BaseModel.extend({
	urlRoot		:	'/model/switch',
	toggelSwitch : function (calback, errorCalback) {
		var devId = this.get('devId'), switchId = this.get('switchID'), state=this.get('state');
	//	console.log("toggelSwitch called "+devId+" "+switchId+" "+state);
		this.sendActionRequestByAjax("toggleSwitch", {"devId":devId, "switchId":switchId, "state":state}, function(rsp){
			//console.log('Ajax response toggelSwitch came.', rsp)
			calback.apply(this, arguments);
		}, errorCalback);	
	},
	setDuty : function (duty, calback) {
		this.sendActionRequestByAjax("setDuty", {"duty":duty, "devId":this.get('devId'), "switchId":this.get('switchID')}, calback);	
	},
	moveCurtain : function (direction, calback) {
		this.sendActionRequestByAjax("moveCurtain", {"direction":direction, "devId":this.get('devId'), "switchId":this.get('switchID')}, calback);	
	},
	setSwitchParam : function (params, calback) {
		var devId = this.get('devId'), switchId = this.get('switchID');
		this.sendActionRequest("setSwitchParam", {"devId":devId, "switchId":switchId, "params":params}, calback);

	}
})
FanModel = SwitchModel.extend({
	setDuty : function (duty, calback) {
		this.sendActionRequest("setDuty", {"duty":duty, "devId":this.get('devId'), "switchId":this.get('switchID')}, calback);	
	}
});