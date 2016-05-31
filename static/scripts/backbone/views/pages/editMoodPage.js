EditMoodPageView = MainPageView.extend({
	templateSelector:"#editMoodPageTemplate",
	name : 'EditMoodPageView',
	events : {
		"tap .addMoodButton" : 'addNewMood',
		"tap .clusterTabs span" : 'switchCluster'
	},
	subViewArrays : [{'viewClassName':'MoodView', 'reference':'moodViewArray', 'parentSelectorPrefix':'.moodViewCont', 'eval':['deviceCollection', 'groupCollection'], 'array':'this.collection', 'supressRender':true}],
	render : function () {
		MainPageView.prototype.render.apply(this, arguments);
		_.each(this['moodViewArray_'+(this.currentCluster||1)], function(view){
			view.render()
		}, this);
		return this;
	},
	switchCluster : function (event) {
		this.currentCluster = $(event.target).attr('clusterNo');
		this.repaint();
	},
	addNewMood : function () {
		var dummyModel = new Backbone.Model({'name':'', "id":0, "icon":'', controls:[]});
		dummyModel.ioSocket = ioSockets[(this.currentCluster-1)||0]
		var tmpClass = MoodView.extend({
			_hidePopUp : function () {
				MoodView.prototype._hidePopUp.apply(this, arguments);	
				this.removeView();
			}
		});
		var tmpMoodView = new tmpClass({'model':dummyModel, 
			'deviceCollection':this.options.deviceCollections[(this.currentCluster-1)||0],
			'groupCollection':this.options.groupCollections[(this.currentCluster-1)||0]
		});
		this.$el.find('.moodViewCont_'+(this.currentCluster||1)).prepend(tmpMoodView.render().$el);
		tmpMoodView.showPopUp();
	}
});