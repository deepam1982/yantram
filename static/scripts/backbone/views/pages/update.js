
CheckUpdatePageView = BaseView.extend({
	templateSelector:"#checkUpdateTemplate",
	render : function (){
		this.options.socket.emit(
			"checkUpdates", null, _.bind(function (rsp) {
				this.$el.find('.loader').hide();
				this.$el.find('.msgBox').show().html(rsp.msg);
				if(rsp.success) {
					this.$el.find('.msgBox').hide();
					this.$el.find('.updateNowMsg').show();
				} 
		}, this));
		return BaseView.prototype.render.apply(this, arguments);
	},
	events: {
		"tap .updateNow" : "updateNow"
	},
	updateNow : function (rsp) {
		this.$el.find('.loader').show();
		this.$el.find('.updateNowMsg').hide();
		this.options.socket.emit("updateNow", null, _.bind(function (rsp) {

		}, this));	

	}
});