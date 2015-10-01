
MoodView = BaseView.extend(Popup).extend({
	name : "MoodView",
	templateSelector:"#moodViewTemplate",
	subViews : [{'viewClassName':'EditMoodPannel', 'reference':'editPannel', 'parentSelector':'.editTemplateCont', 'model':'this.model', 'supressRender':true}],
	events: _.extend(Popup.events, {
 		"tap .editMood" : "showPopUp",
 		"tap .deleteMood" : "deleteMood"
 	}),
 	showPopUp : function () {
		this.editPannel.render();
		this.$popup = Popup.showPopUp.apply(this, arguments);
		var left = this.$popup.offset().left;
		var top = Math.max(0,($(window).height() - this.$popup.height())/2);
		this.$popup.css('top', top+'px').css('left', left+'px').css('position','fixed');
		this.$popup.find('.editTemplateCont').css('max-height',$(window).height()+'px').addClass('overflowScroll');
		return this.$popup;
 	},
 	hidePopUp : function () {
 		this.$popup.find('.editTemplateCont').css('max-height','').removeClass('overflowScroll');
 		this.$popup.css('top', '').css('left', '').css('position','');
 		this.editPannel.erase();
		return Popup.hidePopUp.apply(this, arguments);
 	},
 	deleteMood : function () {
 		var moodInfo = this.model.toJSON();
		moodInfo.rank = moodInfo.id;
		moodInfo.controls = [];
		ioSocket.emit("modifyMood", moodInfo, function (err){if(err)console.log(err)});
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