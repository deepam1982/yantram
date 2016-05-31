
MoodView = BaseView.extend(Popup).extend({
	name : "MoodView",
	templateSelector:"#moodViewTemplate",
	subViews : [{'viewClassName':'EditMoodPannel', 'reference':'editPannel', 'parentSelector':'.editTemplateCont', 'model':'this.model', 'eval':['gC=this.options.groupCollection'], 'supressRender':true}],
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
 		var moodIcon = this.$el.find('.moodIconCont .tick:visible').length;
 		var moodSize = this.$el.find('.deviceGroupCont .tick:visible').length;
 		if(moodIcon && moodSize) this._hidePopUp();
 		else
 			confirmDialog.show("Mood without "+((moodSize)?"icon":"any device")+" cannot exist, are you sure you are done?", _.bind(function(sure) {
 				if (sure) this._hidePopUp();	
 			},this));
 	},
 	_hidePopUp : function () {	
 		this.$popup.find('.editTemplateCont').css('max-height','').removeClass('overflowScroll');
 		this.$popup.css('top', '').css('left', '').css('position','');
 		this.editPannel.erase();
		return Popup.hidePopUp.apply(this, arguments);
 	},
 	deleteMood : function () {
 		confirmDialog.show("Are you sure, you want to delete mood?", _.bind(function(sure){
 			if(!sure) return;
	 		var moodInfo = this.model.toJSON();
			moodInfo.rank = moodInfo.id;
			moodInfo.controls = [];
			ioSocket.emit("modifyMood", moodInfo, function (err){if(err)console.log(err)});
 		}, this)); 		
 	},
	_getJsonToRenderTemplate : function () {
		var moodJson = (this.model)?this.model.toJSON():{};
		moodJson.groups = [];
		var groups = _.groupBy(moodJson.controls, function (ctl) {
			var info = this.options.deviceCollection.get(ctl.devId).get('loadInfo')[ctl.switchId];
			ctl.name = info.name; ctl.icon=info.icon;
			return (ctl.groupInfo)?ctl.groupInfo.id:9999;
		}, this);
		_.each(groups, function (ctls, gpId){
			moodJson.groups.push({'name':(ctls[0].groupInfo)?ctls[0].groupInfo.name:'No Group', 'controls':ctls});
		});
		return moodJson; 
	}
})