BasicSwitch = BaseView.extend({
	templateSelector:"#basicSwitchTemplate",
	events: {
		"tap .toggelSwitch" : "toggelSwitch"
	},
	toggelSwitch : function (event) {
		if(this.model.get('disabled')) return;
//		this.model.set('state', (this.model.get('state')=="on")?"off":"on");
		var $tar = $(event.target);
		$(this.$el.children()[0]).append('<img class="switchToggleSpinner" src="static/images/loading.gif"/>');
		var calbackfunc = _.bind(function(status) {}, this);
		this.model.toggelSwitch(calbackfunc);
	}
})