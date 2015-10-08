EditMoodPageView = BaseView.extend({
	templateSelector:"#editMoodPageTemplate",
	name : 'EditMoodPageView',
	events : {
		"tap .addMoodButton" : 'addNewMood'
	},
	subViewArrays : [{'viewClassName':'MoodView', 'reference':'moodViewArray', 'parentSelector':'.moodViewCont', 'array':'this.collection'}],
	addNewMood : function () {
		var dummyModel = new Backbone.Model({'name':'', "id":0, "icon":'', controls:[]});
		var tmpClass = MoodView.extend({
			_hidePopUp : function () {
				MoodView.prototype._hidePopUp.apply(this, arguments);	
				this.removeView();
			}
		});
		var tmpMoodView = new tmpClass({'model':dummyModel});
		this.$el.find('.moodViewCont').prepend(tmpMoodView.render().$el);
		tmpMoodView.showPopUp();
	}
});