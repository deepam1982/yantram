EditPageView = MainPageView.extend({
	templateSelector:"#editPageTemplate",
	name : 'EditPageView',
	events : {
		"tap .addGroupButton" : 'addNewGroup'
	},
	subViewArrays : [{'viewClassName':'GroupEditView', 'reference':'groupViewArray', 'parentSelector':'.editViewCont', 'array':'this.collection'}],
	addNewGroup : function () {
		var dummyModel = new Backbone.Model({'name':'', "id":0});
		var tmpClass = GroupEditView.extend({
			_hideAdvancePannel : function () {
				GroupEditView.prototype._hideAdvancePannel.apply(this, arguments);	
				this.removeView();
			}
		});
		var tmpGroupView = new tmpClass({'model':dummyModel});
		this.$el.find('.editViewCont').prepend(tmpGroupView.render().$el);
		tmpGroupView.showAdvancePannel();
	}
});