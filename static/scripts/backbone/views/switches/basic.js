BasicSwitch = BaseView.extend({
	templateSelector:"#basicSwitchTemplate",
	events: {
		"tap .toggelSwitch" : "toggelSwitch"
	},
	toggelSwitch : function (event) {
//		this.model.set('state', (this.model.get('state')=="on")?"off":"on");
		var $tar = $(event.target);
		$(this.$el.children()[0]).append('<img src="static/images/loading.gif" style="position:absolute;left:19px;top:17px;"/>');
		var calbackfunc = _.bind(function(status) {}, this);
		this.model.toggelSwitch(calbackfunc);
	}
})