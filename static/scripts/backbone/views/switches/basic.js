BasicSwitch = BaseView.extend({
	templateSelector:"#basicSwitchTemplate",
	events: {
		"tap .toggelSwitch" : "toggelSwitch"
	},
	toggelSwitch : function (event) {
		if(this.model.get('disabled')) return;
//		this.model.set('state', (this.model.get('state')=="on")?"off":"on");
		var $tar = $(event.target);
		$(this.$el.children()[0]).append('<i class="switchToggleSpinner brightColor fa fa-spinner fa-spin"></i>');
		var calbackfunc = _.bind(function(status) {}, this);
		_.defer(_.bind(this.model.toggelSwitch, this.model), calbackfunc)
//		this.model.toggelSwitch(calbackfunc);
	}
})


Popup = {
	events: {
		"tap .popupPannel .cross" : "hidePopUp"
	},
	showPopUp : function () {
		this.bd = new Backdrop({'$parent':$('#mainCont')});
		this.bd.render();
		if(!this.avoidCloneOnPullup) 
			this.bd.cloneOnPullup = true;
		var $last = $(_.last(this.$el.find('.popupPannel'))).show();
		this.bd.pullItOver($last);
		if(this.keepPopupFixed) {
			var left = $last.offset().left;
			var top = Math.max(0,($(window).height() - $last.height())/2);
			$last.css('top', top+'px').css('left', left+'px').css('position','fixed');
		}
		
//		$last[0].scrollIntoView();
		return $last;
	},
	hidePopUp : function () {
		if(!this.bd) return;
		this.bd.removeView();
		this.bd = null;
		var $last = $(_.last(this.$el.find('.popupPannel'))).hide();
		$last.css('position', 'inherit').css('top', '').css('left', '');
	}

}

IpCamaraFeedViewer = BaseView.extend(Popup).extend({
	templateSelector:"#ipCamaraFeedViewer",
	keepPopupFixed : true,
	avoidCloneOnPullup : true,
	events: {
		"tap .popupPannel > .cross" : "hidePopUp"
	},
	showFeed : function (camModel, groupModel) {
		this.hidePopUp();
		var switchId = camModel.get("switchID"), devId = camModel.get("devId"), groupId = camModel.get("groupId");
		var src = '/cam/'+switchId;
//		var groupModel = gC.get(groupId);
		var camIndex = -1;
		_.each(groupModel.get('controls'), function(ctrl, i){
			if(ctrl.devId == camModel.get('devId') && ctrl.switchID == camModel.get('switchID'))
				camIndex = i;
		});
		var cameraName = camModel.get("name");
		this.$el.find('.cameraName').html(cameraName);		
		this.$el.find('.camFeedCont').html("<img style='width:100%' src='"+src+"'>")

		this.grpView = new GroupView1({model:groupModel});
		this.$el.find('.camGroupCont').append(this.grpView.$el);
		this.grpView.render();
		(camIndex+1) && this.grpView.switchViewArray[camIndex].$el.hide();

		//this.grpView.$el.find('.translucentBg50').removeClass('translucentBg50').addClass('theamBGColor');

		this.showPopUp();
	},
	hidePopUp : function () {
		this.grpView && this.grpView.removeView();
		this.grpView = null;
		this.$el.find('.camGroupCont').html=("");
		this.$el.find('.camFeedCont img').attr("src","about:blank"); // this is to make sure that stream ends
		return Popup.hidePopUp.apply(this, arguments);
	}
});


IpCamaraSwitch = BasicSwitch.extend(Popup).extend({
	events: {
		"tap .toggelSwitch" : "showCameraFeed"
	},
	showCameraFeed : function () {
		ipCamaraFeedViewer.showFeed(this.model, this.options.parentView.model);
	}
})



	// render : function () {
	// 	BaseView.prototype.render.apply(this, arguments);
	// 	this.$el.find('.iconPartition img')[0].onselectstart = function() {
	//         return false;
	//     }
	// 	return this;
	// }