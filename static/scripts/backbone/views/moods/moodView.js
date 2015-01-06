
MoodView = BaseView.extend(Popup).extend({
	name : "MoodView",
	templateSelector:"#moodViewTemplate",
	subViews : [{'viewClassName':'EditMoodPannel', 'reference':'editPannel', 'parentSelector':'.editTemplateCont', 'model':'this.model', 'supressRender':true}],
	events: _.extend(Popup.events, {
 		"tap .editMood" : "showPopUp"
 	}),
 	showPopUp : function () {
		this.editPannel.render();
		var retObj = Popup.showPopUp.apply(this, arguments);
//		this.$el.css('top',Math.max(10,Math.min($('body').height()-this.editPannel.$el.height()-30, this.editPannel.$el.offset().top))+"px");
		return retObj;
 	},
 	hidePopUp : function () {
 		this.editPannel.erase();
		return Popup.hidePopUp.apply(this, arguments);
 	},
	_getJsonToRenderTemplate : function () {
		var moodJson = (this.model)?this.model.toJSON():{};
		moodJson.groups = [];
		var groups = _.groupBy(moodJson.controls, function (ctl) {
			var info = deviceCollection.get(ctl.devId).get('loadInfo')[ctl.switchId];
			ctl.name = info.name; ctl.icon=info.icon;
			return (ctl.groupInfo)?ctl.groupInfo.id:9999;
		});
		_.each(groups, function (ctls, gpId){
			moodJson.groups.push({'name':(ctls[0].groupInfo)?ctls[0].groupInfo.name:'No Group', 'controls':ctls});
		});
		return moodJson; 
	}
})