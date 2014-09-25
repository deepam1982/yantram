
SelectSwitchIcon = BaseView.extend({
	templateSelector:"#selectSwitchIconTemplate",
	tagName : 'span',
	_getJsonToRenderTemplate : function () {
		return {"src":"static/images/transparent/"+this.model+".png", "icon":this.model};
	},
});

EditSwitchParams = BaseView.extend({
	templateSelector:"#editSwitchTemplate",
	iconList : ['switch', 'bulb', 'cfl', 'cfl1', 'tubelight', 'fan', 'fan1', 'plug', 'plug1', 'lamp', 'lamp1', 'mosquito coil', 'iron', 'geyser', 'tv', 'tv1', 'ac', 'ac1', 'heater', 'air cooler', 'washing machine', 'water purifier'],
	subViewArrays : [{'viewClassName':'SelectSwitchIcon', 'reference':'iconViewArray', 'parentSelector':'.iconCont', 'array':'this.iconList'}],
	events: {
		"tap .iconCont .selectSwitch"  : "_setIcon",
		"change .switchName" : "_nameChange",
		"change input[type='radio']" : "_typeChange",
	},
	bindFunctions :_.union(BaseView.prototype.bindFunctions,['_setIcon', '_nameChange']),
	_typeChange : function (event) {
		this.model.setSwitchParam({'type':$(event.target).val()});
	},
	_nameChange : function (event) {
		this.model.setSwitchParam({'name':$(event.target).val()});
	},
	_setIcon : function (event) {
		var iconName = $(event.target).attr('icon');
		this.setIcon(iconName);
		this.model.setSwitchParam({'icon':iconName});
	},
	render	:	function () {
		BaseView.prototype.render.apply(this, arguments);
		this.setIcon(this.model.get('icon'));
		return this;
	},
	setIcon : function (iconName) {
		var idx = _.indexOf(this.iconList, this.currentIcon);
		if(idx != -1)this.iconViewArray[idx].repaint();
		this.currentIcon = iconName;
		idx = _.indexOf(this.iconList, iconName);
		var $div = this.iconViewArray[idx].$el.find('img').parent();
		$div.addClass('theamBGColor');
		$div.find('.tick').show();
	}
});


EditableSwitch = AdvanceSwitch.extend({
	subViews : [{'viewClassName':'EditSwitchParams', 'reference':'editView', 'parentSelector':'.advancePannel', 'model':'this.model', 'supressRender':true}],
	showAdvancePannel : function () {
		this.$el.find('.iconPartition').hide();
		AdvanceSwitch.prototype.showAdvancePannel.apply(this, arguments);
		this.$el.css('top', '50px');
		this.editView.render();
		setTimeout(_.bind(function () {this.$el.find('.checked').prop("checked", true);}, this), 20);
	},
	hideAdvancePannel : function () {
		this.editView.erase();
		AdvanceSwitch.prototype.hideAdvancePannel.apply(this, arguments);
		this.$el.find('.iconPartition').show();
		this.repaint();
	},
	repaint : function () {
		if(!this.bd) return AdvanceSwitch.prototype.repaint.apply(this, arguments);
		this.editView.repaint();
		return this;
	}
});