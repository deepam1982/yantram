RoomModel = BaseModel.extend({
	urlRoot		:	'/room/model/',
	powerOff	:	function () {
		this.sendActionRequest("powerOff/");
	},
	toggelSwitch : function (devId, switchId, calback) {
		this.sendActionRequest("toggelSwitch/", {"devId":devId, "switchId":switchId}, calback);	
	}
})