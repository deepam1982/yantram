RoomView1 = BaseView.extend({
	templateSelector:"#roomTemplate",
	initialize: function(obj) {
		BaseView.prototype.initialize.apply(this, obj);
		this.model.on('change', _.bind(this.render, this));
    },
	events: {
		"click .powerButton" : "onPowerOffClick",
		"click .toggelSwitch" : "toggelSwitch"
	},
	onPowerOffClick : function () {
		this.model.powerOff();
	}, 
	toggelSwitch : function (event) {
		var tar = $(event.target);
		var calbackfunc = _.bind(function(status) {
			var src = tar.attr('src')
			src = src.replace(/\/((on)|(off))\//, "/"+((status)?"on":"off")+"/")
			tar.attr('src', src)
		}, this);
		this.model.toggelSwitch(tar.attr('devId'), tar.attr('switchId'), calbackfunc);
	}
})