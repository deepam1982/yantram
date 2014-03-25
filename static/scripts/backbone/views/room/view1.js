RoomView1 = BaseView.extend({
	templateSelector:"#roomTemplate",
	subViewArrays : [{'viewClassName':'BasicSwitch', 'reference':'switchViewArray', 'parentSelector':'.switchCont', 'array':'this.switchCollection'}],
	initialize: function(obj) {
		console.log(obj.model.get("controls").length);
			
		var ColClass = Backbone.Collection.extend({model:SwitchModel});
		this.switchCollection = new ColClass(obj.model.get("controls"));
		console.log(this.switchCollection.length)
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