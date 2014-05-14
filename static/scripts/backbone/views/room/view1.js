SwitchViewFactory = function (options) {
	switch (options.model.get('type')) {
		case 'fan'	: return new AdvanceFanSwitch(options);
		default		: return new BasicSwitch(options);
	}
}

RoomView1 = BaseView.extend({
	templateSelector:"#roomTemplate",
	subViewArrays : [{'viewClassName':'SwitchViewFactory', 'reference':'switchViewArray', 'parentSelector':'.switchCont', 'array':'this.switchCollection'}],
	initialize: function(obj) {
		var ColClass = Backbone.Collection.extend({model:SwitchModel});
		this.switchCollection = new ColClass(obj.model.get("controls"));
		BaseView.prototype.initialize.apply(this, obj);
		this.model.on('change', _.bind(function () {
			this.switchCollection.add(this.model.get("controls"), {merge: true});
		}, this));
//		this.model.on('change', _.bind(this.repaint, this));
    },
	events: {
		"click .powerButton" : "onPowerOffClick",
	},
	onPowerOffClick : function () {
		this.model.powerOff();
	}, 
})