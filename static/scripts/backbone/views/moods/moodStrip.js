MoodProxy = BaseView.extend({
	name : "MoodProxy",
	tagName : 'span',
	templateSelector:"#moodProxyTemplate",
	events : {
		"tap .moodIcon" : 'applyMood'
	},
	applyMood : function (event) {
		var $elm = $(event.target).closest('.moodIcon');
		var moodModel = this.model;
		console.log(moodModel);
//		$elm.append('<img src="static/images/loading.gif" style="position:absolute;left:-9px;top:-2px;width:60px;"/>')
		$elm.append('<i class="spinner fa fa-spinner fa-spin" style="position:absolute;left:-6px;top:-2px;font-size:50px;color:white;"></i>')
		moodModel.sendActionRequest("applyMood", {'id':$elm.attr('moodId'), 'icon':$elm.attr('moodIconName')}, function (err){
			setTimeout(function (){$elm.find('.spinner').remove()}, 1000);
			if(err)console.log(err)
		});
	},
	
});

MoodStripView = BaseView.extend({
	name : "MoodStrip",
	templateSelector:"#moodStripTemplate",
	subViewArrays : [{'viewClassName':'MoodProxy', 'reference':'moodProxyArray', 'parentSelector':'.moodProxyCont', 'array':'this.collection'}],
	initialize: function(opt) {
		var oriPrams = this.subViewArrays[0], i=0;
		this.subViewArrays = [];
		_.each(opt.collections, function(col){
			var clonPrams = _.extend({}, oriPrams);
			clonPrams.array = 'this.options.collections['+(i++)+']';
			clonPrams.reference +=('_'+i);
			this.subViewArrays.push(clonPrams);
			col.on('add', function(){
				var count=0;_.each(this.options.collections, function(ccol){count+=ccol.length;});
				this.$el.find('.moodProxyCont').width(55*count);
			}, this);
		}, this)
		return BaseView.prototype.initialize.apply(this, arguments);
	},
	showSelectiveMoodProxy : function (moods) {
		var cids = []; _.each(moods, function(m){cids.push(m.cid);});
		for(var i=1; i<=this.options.collections.length;i++){
			_.each(this['moodProxyArray_'+i], function(view){
				view.$el.hide();
				if(1+_.indexOf(cids, view.model.cid)) view.$el.show();
			});
		}
	},
	showAllMoodProxy : function() {
		for(var i=1; i<=this.options.collections.length;i++){
			_.each(this['moodProxyArray_'+i], function(view){
				var $moodProxy = view.$el.show();
			});
		}	
	}
})
