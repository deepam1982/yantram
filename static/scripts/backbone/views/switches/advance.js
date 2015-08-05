Backdrop = BaseView.extend({
	render	:	function () { 
		if(!this.options.zIndex) this.options.zIndex = 999
		this.$el = $('<div style="width:100%; height:100%; background-color:black;opacity:0.7;position:absolute; top:0; left:0;"/>');
		this.$el.css('z-index', this.options.zIndex)
		if(!this.options.$parent) this.options.$parent = $('body')
		this.options.$parent.append(this.$el);
	},
	pullItOver : function ($elm) {
		if(!this.elmArr) this.elmArr = [];
		$elm.attr('oldStyle', $elm.attr('style'));
		if(this.cloneOnPullup) $elm.after($elm.clone());
		var left = $elm.offset().left - this.$el.offset().left;
		var top = $elm.offset().top - this.$el.offset().top;
		$elm.css('left', left);
		$elm.css('top', top);
		var match = $elm.attr('style').match(/[^-]width[: ]+([0-9]+)/);
		match = (match)?(match[1]+'px'):'auto';
		$elm.attr('cssWidth', match);
		$elm.css('width', $elm.width());
		$elm.css('z-index', this.options.zIndex+1);
		$elm.css('position', 'absolute');
		$elm.addClass('onBackdrop');
		this.elmArr.push($elm);
	},
	erase : function () {
		_.each(this.elmArr, function ($elm) {
			$elm.css('width', $elm.attr('cssWidth'));
			$elm.attr('style', $elm.attr('oldStyle'));
			$elm.removeClass('onBackdrop');
			if(this.cloneOnPullup) $elm.next().remove();
		}, this);
		this.$el.remove();
		return this;
	}
});

Popup = {
	events: {
		"tap .popupPannel .cross" : "hidePopUp"
	},
	showPopUp : function () {
		this.bd = new Backdrop({'$parent':$('#mainCont')});
		this.bd.render();
		this.bd.cloneOnPullup = true;
		var $last = $(_.last(this.$el.find('.popupPannel'))).show();
		this.bd.pullItOver($last);
		$last[0].scrollIntoView();
	},
	hidePopUp : function () {
		if(!this.bd) return;
		this.bd.removeView();
		this.bd = null;
		var $last = $(_.last(this.$el.find('.popupPannel'))).hide();
		$last.css('position', 'inherit');
	}

}

AdvancePannel = {
 	render	:	function () {
 		if(this.bd) $(_.last(this.$el.find('.advancePannel'))).width(this.$el.parent().width() - this.$el.width()).show();
 		return this;
 	},
	events: {
		"tap .advancePannel .cross" : "done"
	},
	done : function () {
		this.animateAdvancePannel=true;
		this.hideAdvancePannel();
	},
	showAdvancePannel : function () {
		_.defer(_.bind(function () {this.animateAdvancePannel=false;}, this));
		if(this.bd) return;
		this.bd = new Backdrop({'$parent':$('#mainCont')});
		this.bd.cloneOnPullup = true;
		this.bd.render();
		this.bd.pullItOver(this.$el);
		$(_.last(this.$el.find('.advancePannel'))).show().focus();

	},
	hideAdvancePannel : function () {
		if(!this.bd) return;
		$(_.last(this.$el.find('.advancePannel'))).hide();
		this.$el.css('position', 'inherit');
		this.bd.removeView();
		this.bd = null;
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
AdvanceFanSwitch = AdvanceSwitch.extend({
	initialize : function () {
		_.bindAll(this, 'onDutyChange');
		this._onDutyChange = _.throttle(this.onDutyChange, 500, {leading: false});
		this.animateAdvancePannel=true;
		AdvanceSwitch.prototype.initialize.apply(this, arguments);
	},
	showAdvancePannel : function () {
		this.$slider.hide();
		AdvanceSwitch.prototype.showAdvancePannel.apply(this, arguments);
		this.$slider.show();
	},
	render	:	function () {
 		AdvanceSwitch.prototype.render.apply(this, arguments);
 		this.$slider = $('<input type="range" class="inside fanSlider" min="30" max="95" value="50" showemptylabels="false" style="margin:30px 0 0 10px;"/>');
 		this.$el.find('.advancePannel').append(this.$slider);
 		this.$slider.width(Math.max(120,this.$el.parent().width() - 2*this.$el.find('.toggelSwitch').width() - 20));
 		var duty = parseInt(100*parseInt(this.model.get('duty'))/255);
 		this.$slider.val(Math.min(Math.max(duty, 30), 95));
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