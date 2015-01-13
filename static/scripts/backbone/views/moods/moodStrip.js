MoodProxy = BaseView.extend({
	name : "MoodProxy",
	tagName : 'span',
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
		$elm.append('<img src="static/images/loading.gif" style="position:absolute;left:-6px;top:0px;"/>')
		moodModel.sendActionRequest("applyMood", {'id':$elm.attr('moodId'), 'icon':$elm.attr('moodIconName')}, function (err){
			setTimeout(function (){$elm.find('img').remove()}, 1000);
			if(err)console.log(err)
		});

	}
})
