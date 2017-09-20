CommandPosterPageView = BaseView.extend({
	templateSelector:"#commandPosterTemplate",
	events: {
		"tap #postJson" : "onSubmit",
	},
	onSubmit: function () {
		var eventName = this.$el.find('.eventName').val();
		console.log(eventName);
		var json = JSON.parse(this.$el.find('.textJson').val());
		console.log(json);
		this.options.socket.emit(eventName, json, function(err, data){ console.log(err, data);});
	}
});
