BaseModel = Backbone.Model.extend({
	url	:	function () {
		return this.urlRoot+this.get('id')+"/";
	},
	parse: function(resp) {
		if (resp.status == "success" && resp.data && resp.data.model)
			return resp.data.model;
		if (resp.id) return resp;
		console.log('error while fetching model data');
		return ;
	},
	sendActionRequest	:	function ($actionName, data, success, error) {
		if(!data) data = {};
//		data.respondWithModel=true;
		$.ajax({
			url: this.url()+$actionName,
			data:data,
			async:false,
			dataType: 'json',
			success: _.bind(function(resp) {
				if (resp.status != "success"){
					alert("Action failed: " + resp.info);
					console.log('error while performing action');
					if (typeof error == "function") error();
					return;
				}
				if (resp.data.model && resp.data.model.id==this.id) {
					this.set(resp.data.model);
				}
//				this.trigger("actionDone");
				if (typeof success == "function") success(resp.data);
			}, this),
			error:	function (resp) {
				if (typeof error == "function") error();
				console.log('error while performing action-1');
			}
		});		
	}
})