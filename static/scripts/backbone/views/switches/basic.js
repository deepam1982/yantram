BasicSwitch = BaseView.extend({
	templateSelector:"#basicSwitchTemplate",
	initialize: function(obj) {
		BaseView.prototype.initialize.apply(this, obj);
		this.model.on('change', _.bind(this.repaint, this));
    },
	_getJsonToRenderTemplate : function () {
		var retJson = this.model.toJSON();
//		retJson.src = "static/images/"+retJson.state+"/"+((retJson.name=='Fan')?'fan':'bulb')+".png";
		retJson.src = "static/images/"+retJson.state+"/"+retJson.type+".png";
		return retJson;
	},
	events: {
		"click .toggelSwitch" : "toggelSwitch"
	},
	toggelSwitch : function (event) {
		var $tar = $(event.target);
		this.$el.append('<img src="static/images/loading.gif" style="position:absolute;left:'+(26+$tar.offset().left)+';top:'+(26+$tar.offset().top)+'"/>')
		var calbackfunc = _.bind(function(status) {}, this);
		this.model.toggelSwitch(calbackfunc);
	}
})