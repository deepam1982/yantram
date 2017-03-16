
AdvancePannel = {
 	render	:	function () {
 		if(this.bd) $(_.last(this.$el.find('.advancePannel'))).width(this.$el.parent().width() - this.$el.width()).show();
 		return this;
 	},
	events: {
		"tap .advancePannel .cross" : "done"
	},
	done : function () {
//		this.animateAdvancePannel=true;
		this.hideAdvancePannel();
		$('body').css('overflow', '');
	},
	showAdvancePannel : function () {
//		_.defer(_.bind(function () {this.animateAdvancePannel=false;}, this));
		if(this.bd) return;
		this.bd = new Backdrop({'$parent':this.bdCont || $('#mainCont')});
		this.bd.cloneOnPullup = true;
		this.bd.render();
		this.bd.pullItOver(this.$el);
		var $lastAdPnl = $(_.last(this.$el.find('.advancePannel')));
		this.adPnlCss = $lastAdPnl.attr('style');
		$lastAdPnl.show().focus();
		$('body').css('overflow', 'hidden');
		this.advancePannelVisible = true;
	},
	hideAdvancePannel : function () {
		if(!this.bd) return;
		var $lastAdPnl = $(_.last(this.$el.find('.advancePannel')));
		$lastAdPnl.attr('style', this.adPnlCss).hide();
		this.$el.css('position', 'inherit');
		this.bd.removeView();
		this.bd = null;
		this.advancePannelVisible = false;
	}

}
AdvanceSwitch = BasicSwitch.extend(AdvancePannel).extend({
 	render	:	function () {
 		BasicSwitch.prototype.render.apply(this, arguments);
 		this.$el.css('float','left');
 		AdvancePannel.render.apply(this, arguments);
 		if(this.showPannelOnrender) this.showAdvancePannel();
 		return this;
 	},
 	erase : function () {
 		if(this.bd) {
 			this.hideAdvancePannel();
 			this.showPannelOnrender=true;
 		}
 		return BasicSwitch.prototype.erase.apply(this, arguments);
 	},
	events: _.extend(BasicSwitch.prototype.events,AdvancePannel.events, {
		"longTap .toggelSwitch" : "showAdvancePannel"
	}),
	showAdvancePannel : function () {
		this.bdCont = this.$el.closest('.switchCont');
		this.showPannelOnrender = false;
		AdvancePannel.showAdvancePannel.apply(this, arguments);
		this.$el.css('width', 'auto');
		if(this.animateAdvancePannel) {
			$(_.last(this.$el.find('.advancePannel'))).width(0).animate({width:this.$el.parent().width() - this.$el.width()}, {'duration':150})
			this.$el.animate({left:this.$el.parent().position().left}, {'duration':150});
		}
		else {
			$(_.last(this.$el.find('.advancePannel'))).width(this.$el.parent().width() - this.$el.width());
			this.$el.css('left',this.$el.parent().position().left);
		}
	}
})

AdvanceCurtainSwitch = AdvanceSwitch.extend({
	initialize : function () {
		_.bindAll(this, 'stopCurtain');
		AdvanceSwitch.prototype.initialize.apply(this, arguments);
		this._moveCurtain = _.throttle(_.bind(this.model.moveCurtain, this.model), 200);
	},
	render	:	function () {
 		AdvanceSwitch.prototype.render.apply(this, arguments);
 		var state = this.model.get("state");
 		if(!this.$curtainControls)
 		this.$curtainControls = $(
 			"<div class='unselectable curtainControlPopup'>\
 				<div class='openCurtain "+((state=='opening')?"brightBGColor":"")+"' style='float:left; padding:15px; width:50px;'><div style='width:50px;height:50px;float:left;background-image:url(\"static/images/transparent/opencurtain.png\"); background-size:50px 50px;'></div><span>Open</span></div>\
 				<div class='closeCurtain "+((state=='closing')?"brightBGColor":"")+"' style='float:right; padding:15px; margin:0 40px 0 0; width:50px;'><div style='width:50px;height:50px;float:left;background-image:url(\"static/images/transparent/closecurtain.png\"); background-size:50px 50px;'></div><span>Close</span></div>\
 				<div style='clear:both'></div>\
 			</div>"
 		)//don't convert background-image div to img-tag, as on phones it dosn't trigger touchend after longtab.
 		this.$el.find('.advancePannel').append(this.$curtainControls);
 		return this;
 	},
 	erase	: function () {
 		if(!this.openCurtainTimer && !this.closeCurtainTimer && this.$curtainControls)
 		{console.log("removing curtain control UI!!");this.$curtainControls.remove(); this.$curtainControls=null;}
 		return AdvanceSwitch.prototype.erase.apply(this, arguments);
 	},
 	hideAdvancePannel : function() {
 		var $img = this.$el.find('.iconPartition img');
 		$img.attr('src', $img.attr('src').replace('black', appColor+''));
 		return AdvanceSwitch.prototype.hideAdvancePannel.apply(this, arguments);
 	},
 	showAdvancePannel : function () {
 		if(this.model.get('disabled') || this.advancePannelVisible) return;
 		var ret = AdvanceSwitch.prototype.showAdvancePannel.apply(this, arguments);
 		!this.touchendConnected && (this.touchendConnected = true) && $('body').on('touchend', _.bind(this._stopCurtain,this));
 		var $img = this.$el.find('.iconPartition img');
 		$img.attr('src', $img.attr('src').replace(appColor+'','black'));
 		return ret
 	},
 	done : function () {
 		this._stopCurtain();
 		$('body').off('touchend', this.stopCurtain);
 		this.touchendConnected = false;
 		return AdvanceSwitch.prototype.done.apply(this, arguments);
 	},
 	events  : { //TODO extend events hirarchy is not working 
 		"tap .advancePannel .cross" : "done"
		,"tap .toggelSwitch" : "showAdvancePannel"
		,"longTap .toggelSwitch" : "showAdvancePannel"
		,"longTap .openCurtain" : "openCurtain"
		,"longTap .closeCurtain" : "closeCurtain"
		,"tap .openCurtain" : "autoOpenCurtain"
		,"tap .closeCurtain" : "autoCloseCurtain"
		// ,"touchend .openCurtain" : "stopCurtain"
		// ,"touchend .closeCurtain" : "stopCurtain"
		// ,"touchleave .closeCurtain" : "stopCurtain" 
		
	},
	autoOpenCurtain : function (event) {
		if(this.model.get("state") != "off") return this.stopCurtain();
		this.$el.find('.openCurtain').addClass('brightBGColor');
		this.$el.find('.closeCurtain').removeClass('brightBGColor');
		this.model.moveCurtain("open", 15);
	},
	autoCloseCurtain : function (event) {
		if(this.model.get("state") != "off") return this.stopCurtain();
		this.$el.find('.closeCurtain').addClass('brightBGColor');
		this.$el.find('.openCurtain').removeClass('brightBGColor');
		this.model.moveCurtain("close", 15);
	},
	closeCurtain : function (event) {
		this.longPressOn = true;
		if(!event && this.model.get("state") == "off") return this.stopCurtain();
		console.log("closeCurtain");
		// this.$el.find('.closeCurtain').removeClass('whiteBG').addClass('theamBGColor');
		// this.$el.find('.openCurtain').removeClass('theamBGColor').addClass('whiteBG');		
		this.$el.find('.closeCurtain').addClass('brightBGColor');
		this.$el.find('.openCurtain').removeClass('brightBGColor');		
		this.model.moveCurtain("close");
		this.closeCurtainTimer = setTimeout(_.bind(this.closeCurtain, this), 1000);
		clearTimeout(this.openCurtainTimer);this.openCurtainTimer = null;
	},
	openCurtain : function (event) {
		this.longPressOn = true;
		if(!event && this.model.get("state") == "off") return this.stopCurtain();
		console.log("openCurtain");
		// this.$el.find('.openCurtain').removeClass('whiteBG').addClass('theamBGColor');
		// this.$el.find('.closeCurtain').removeClass('theamBGColor').addClass('whiteBG');		
		this.$el.find('.openCurtain').addClass('brightBGColor');
		this.$el.find('.closeCurtain').removeClass('brightBGColor');
		this.model.moveCurtain("open");
		this.openCurtainTimer = setTimeout(_.bind(this.openCurtain, this), 1000);
		clearTimeout(this.closeCurtainTimer);this.closeCurtainTimer = null;
	},
	_stopCurtain : function () {
		if(this.longPressOn) this.stopCurtain();
	},
	stopCurtain : function() {
		this.longPressOn = false;
		console.log("stopCurtain");
		this.model.moveCurtain("stop");
		clearTimeout(this.openCurtainTimer);
		clearTimeout(this.closeCurtainTimer);
		this.openCurtainTimer = this.closeCurtainTimer = null;
		// this.$el.find('.openCurtain, .closeCurtain').removeClass('theamBGColor').addClass('whiteBG');		
		this.$el.find('.openCurtain, .closeCurtain').removeClass('brightBGColor');
	}
})

AdvanceFanSwitch = AdvanceSwitch.extend({
	initialize : function () {
		_.bindAll(this, 'onDutyChange');
		this._onDutyChange = _.throttle(this.onDutyChange, 500, {leading: false});
		this.animateAdvancePannel=true;
		AdvanceSwitch.prototype.initialize.apply(this, arguments);
	},
	done : function () {
		this.animateAdvancePannel=true;
		AdvanceSwitch.prototype.done.apply(this, arguments);
	},
	showAdvancePannel : function () {
		this.$slider.hide();
		_.defer(_.bind(function () {this.animateAdvancePannel=false;}, this));
		AdvanceSwitch.prototype.showAdvancePannel.apply(this, arguments);
		this.$slider.show();
	},
	render	:	function () {
 		AdvanceSwitch.prototype.render.apply(this, arguments);
 		var minSpeed = (this.model.get('icon').indexOf('fan') == -1) ? 10 : 30;
 		this.$slider = $('<input type="range" class="inside fanSlider" min="'+minSpeed+'" max="95" value="50" showemptylabels="false" style="margin:30px 0 0 10px;"/>');
 		this.$el.find('.advancePannel').append(this.$slider);
 		this.$slider.width(Math.max(120,this.$el.parent().width() - 2*this.$el.find('.toggelSwitch').width() - 20));
 		var duty = parseInt(100*parseInt(this.model.get('duty'))/255);
 		this.$slider.val(Math.min(Math.max(duty, minSpeed), 95));
 		this.$slider.on("input change", this._onDutyChange);
 		return this;
 	},
 	onDutyChange : function (event) {
 		var duty = parseInt(this.$slider.val());
 		if(duty == 95) duty=100;
 		console.log(duty);
 		duty = parseInt(255*duty/100);
 		console.log(duty);
 		this.model.setDuty(duty);
 	}, 
 	erase	: function () {
 		if(this.$slider) {
	 		this.$slider.off("input change", this._onDutyChange);
 			this.$slider.remove(); 			
 		}
 		return AdvanceSwitch.prototype.erase.apply(this, arguments);
 	}
});