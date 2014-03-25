RoomModel = BaseModel.extend({
	urlRoot		:	'/room/model/',
	powerOff	:	function () {
		this.sendActionRequest("powerOff/");
	},
	toggelSwitch : function (devId, switchId, calback) {
		this.sendActionRequest("toggelSwitch/", {"devId":devId, "switchId":switchId}, calback);	
	}
})

SwitchModel = BaseModel.extend({
	urlRoot		:	'/room/model/',
	toggelSwitch : function (calback, errorCalback) {
		this.sendActionRequest("toggelSwitch/", {"devId":this.get('devId'), "switchId":this.get('switchID')}, calback, errorCalback);	
	}
})