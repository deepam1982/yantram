BaseModel = Backbone.Model.extend({
	url	:	function () {
		return this.urlRoot; //+this.get('id')+"/";
	},
	parse: function(resp) {
		if (resp.status == "success" && resp.data && resp.data.model)
			return resp.data.model;
		if (resp.id) return resp;
		console.log('error while fetching model data');
		return ;
	},
	sendActionRequest	:   function (actionName, data, success, error) {
		if (!ioSocket || !(ioSocket.connected || ioSocket.socket && ioSocket.socket.connected)) {
			if (error) error("Socket not connected");
			console.log(actionName + " cannot be perfomed, socket not connected.");
			return;
		}
		data.deviceType = ( screen.width <= 480 )?'Mobile':'Laptop';
		ioSocket.emit(actionName, data);
		if (success) success();
	},
	sendActionRequestByAjax	:	function ($actionName, data, success, error) {
		if(!data) data = {};
//		data.respondWithModel=true;
		data.actionName=$actionName;
		console.log($actionName);
		$.ajax({
			url: this.url(),
			data:data,
			async:false,
			dataType: 'json',
			success: _.bind(function(resp) {
				if (!resp.success){
					console.log('error while performing action');
					if (typeof error == "function") error();
					return;
				}
				if (typeof success == "function") success(resp.data);
			}, this),
			error:	function (resp) {
				if (typeof error == "function") error();
				console.log('error while performing action-1');
			}
		});		
	}
	
})