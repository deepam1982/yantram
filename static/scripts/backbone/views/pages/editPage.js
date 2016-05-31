EditPageView = MainPageView.extend({
	templateSelector:"#editPageTemplate",
	name : 'EditPageView',
	events : {
		"tap .addGroupButton" : 'addNewGroup',
		"tap .clusterTabs span" : 'switchCluster'
	},
	subViewArrays : [{'viewClassName':'GroupEditView', 'reference':'groupViewArray', 'parentSelectorPrefix':'.editViewCont', 'eval':['deviceCollection'],'array':'this.collection', 'supressRender':true}],
	render : function () {
		MainPageView.prototype.render.apply(this, arguments);
		_.each(this['groupViewArray_'+(this.currentCluster||1)], function(view){
			view.render()
		}, this);
		return this;
	},
	switchCluster : function (event) {
		this.currentCluster = $(event.target).attr('clusterNo');
		this.repaint();
	},
	addNewGroup : function () {
		var dummyModel = new Backbone.Model({'name':'', "id":0});
		dummyModel.ioSocket = ioSockets[(this.currentCluster-1)||0]
		var tmpClass = GroupEditView.extend({
			_hideAdvancePannel : function () {
				GroupEditView.prototype._hideAdvancePannel.apply(this, arguments);	
				this.removeView();
			}
		});
		var tmpGroupView = new tmpClass({'model':dummyModel, 
			'deviceCollection':this.options.deviceCollections[(this.currentCluster-1)||0]});
		this.$el.find('.editViewCont_'+(this.currentCluster||1)).prepend(tmpGroupView.render().$el);
		tmpGroupView.showAdvancePannel();
	}
});