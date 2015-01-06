MoodProxy = BaseView.extend({
	name : "MoodProxy",
	templateSelector:"#moodProxyTemplate"
});

MoodStripView = BaseView.extend({
	name : "MoodStrip",
	templateSelector:"#moodStripTemplate",
	subViewArrays : [{'viewClassName':'MoodProxy', 'reference':'moodProxyArray', 'parentSelector':'.moodProxyCont', 'array':'this.collection'}],
	events : {
		"tap .moodIcon" : 'applyMood'
	},
	applyMood : function (event) {
		var $elm = $(event.target).closest('.moodIcon');
		var moodModel = this.collection.get($elm.attr('moodId'));
		console.log(moodModel);
		moodModel.sendActionRequest("applyMood", {'id':$elm.attr('moodId'), 'icon':$elm.attr('moodIconName')}, function (err){if(err)console.log(err)});
//		ioSocket.emit("applyMood", {'id':$elm.attr('moodId'), 'icon':$elm.attr('moodIconName')}, function (err){if(err)console.log(err)});

	}
})
