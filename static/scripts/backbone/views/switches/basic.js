BasicSwitch = BaseView.extend({
	templateSelector:"#basicSwitchTemplate",
	events: {
		"tap .toggelSwitch" : "toggelSwitch"
	},
	toggelSwitch : function (event) {
		if(this.model.get('disabled')) return;
//		this.model.set('state', (this.model.get('state')=="on")?"off":"on");
		var $tar = $(event.target);
//		$(this.$el.children()[0]).append('<img class="switchToggleSpinner" src="static/images/loading.gif"/>');
		$(this.$el.children()[0]).append('<i class="switchToggleSpinner brightColor fa fa-spinner fa-spin"></i>');
		var calbackfunc = _.bind(function(status) {}, this);
		this.model.toggelSwitch(calbackfunc);
	}
})






	// render : function () {
	// 	BaseView.prototype.render.apply(this, arguments);
	// 	this.$el.find('.iconPartition img')[0].onselectstart = function() {
	//         return false;
	//     }
	// 	return this;
	// }