
ScheduleEditor = BaseView.extend({
	templateSelector:"#editScheduleTemplate",
	events : {
		"tap .done" : "done",
		"tap .cancel" : "cancle"
	},
	set : function (schedule) {
		schedule.type && this.$el.find('.scheduleType').val(schedule.type);
		schedule.hour && this.$el.find('.scheduleHour').val(schedule.hour);
		schedule.minute && this.$el.find('.scheduleMinute').val(schedule.minute);
		schedule.amPm && this.$el.find('.scheduleAmPm').val(schedule.amPm); 
	},
	done : function () {
		var obj = {'type':this.$el.find('.scheduleType').val(), 
			'hour':this.$el.find('.scheduleHour').val(),
			'minute':this.$el.find('.scheduleMinute').val(),
			'amPm':this.$el.find('.scheduleAmPm').val()
		}
		this.trigger('change', obj);
	},
	cancle : function () {this.trigger('remove');}
});

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
	subViews : [{'viewClassName':'ScheduleEditor', 'reference':'schEditor', 'parentSelector':'#scheduleEditor', 'model':'this.model', 'events' : {
		'change':'doneEditSchedule',
		'remove':'repaint'
	}}],
	subViewArrays : [{'viewClassName':'SelectSwitchIcon', 'reference':'iconViewArray', 'parentSelector':'.iconCont', 'array':'this.iconList'}],
	events: {
		"tap .iconCont .selectSwitch"  : "_setIcon",
		"change .switchName" : "_nameChange",
		"change .typeRadioCont input[type='radio']" : "_typeChange",
		"change .autoOffRadioCont input[type='radio']" : "_AutoOffToggle",
		"change .autoOffTimeSelect select" : "_setAutoOffParams",
		"tap .scheduleCont .edit, .addShdlBtnCont .addNewSchedule" : "_editSchedule",
		"tap .scheduleCont .enable, .scheduleCont .disable" : "_enableDisableSchedule",
		"tap .scheduleCont .remove" : "_removeSchedule"
	},
	bindFunctions :_.union(BaseView.prototype.bindFunctions,['_setIcon', '_nameChange']),
	_removeSchedule : function (event) {
		var $schCont = $(event.target).closest('.scheduleCont');
		scheduleId = parseInt($schCont.attr('scheduleId'));
		var schObj = { 'scheduleId' : parseInt($schCont.attr('scheduleId')),'remove':true};	
		this.model.setSwitchParam({'schedule':schObj}, _.bind(function () {}, this));
	},
	_enableDisableSchedule : function (event){
		var $schCont = $(event.target).closest('.scheduleCont');
		var schObj = { 'scheduleId' : parseInt($schCont.attr('scheduleId')),
						'enabled' : ($(event.target).hasClass('enable'))?true:false};
		this.model.setSwitchParam({'schedule':schObj}, _.bind(function () {}, this));				
	},
	_editSchedule : function (event) {
		_.delay(_.bind(function (event) {
			var $schCont = $(event.target).closest('.scheduleCont, .addShdlBtnCont');
			$schCont.html(this.schEditor.$el);
			if($schCont.hasClass('addShdlBtnCont')) return;
			this.schEditor.scheduleId = parseInt($schCont.attr('scheduleId'));
			this.schEditor.set(this.model.get('schedules')[this.schEditor.scheduleId]);
		}, this), 100, event);	
	},
	doneEditSchedule : function (obj) {
		console.log(obj);
		obj.scheduleId = this.schEditor.scheduleId;
		this.model.setSwitchParam({'schedule':obj}, _.bind(function () {}, this));
//		this.repaint();
	},
	_showHideAutoOff : function (state) {
		if (state) {
			this.$el.find('.autoOffTimeSelect').show();
			this.$el.find('.autoOffEnable').hide();
			var autoOffConf = this.model.get('autoOff');
			var time = (!autoOffConf)?0:autoOffConf.time;
			this.$el.find('.autoOffTimeSelect select').val(time/60);
		}
		else {
			this.$el.find('.autoOffTimeSelect').hide();
			this.$el.find('.autoOffEnable').show();			
		}

	},
	_AutoOffToggle : function (event) {
		this._showHideAutoOff($(event.target).val() == 'enabled');
		this._setAutoOffParams();
	},
	_setAutoOffParams : function () {
		var status = (this.$el.find('.autoOffRadioCont input[type="radio"]#autoOffEnable:checked').length)?true:false;
		var time = this.$el.find('.autoOffTimeSelect select').val();
		this.model.setSwitchParam({'autoOff':{'enabled':status, 'time':time*60}}, _.bind(function () {}, this));
	},
	_typeChange : function (event) {
		this.model.setSwitchParam({'type':$(event.target).val()}, _.bind(function () {

		}, this));
	},
	_nameChange : function (event) {
		this.model.setSwitchParam({'name':$(event.target).val()}, _.bind(function () {
			console.log("name changed on server", this.model.attributes);
		}, this));
	},
	_setIcon : function (event) {
		var iconName = $(event.target).attr('icon');
//		this.setIcon(iconName);
		this.model.setSwitchParam({'icon':iconName});
	},
	render	:	function () {
		BaseView.prototype.render.apply(this, arguments);
		this.setIcon(this.model.get('icon'));
		this._showHideAutoOff(this.$el.find('.autoOffRadioCont input[type="radio"]#autoOffEnable:checked').length);
		this.schEditor.scheduleId = null;
		setTimeout(_.bind(function(){this.$el.find('.switchName').removeAttr('readonly')}, this),500);
		return this;
	},
	setIcon : function (iconName) {
		var idx = _.indexOf(this.iconList, this.currentIcon);
		console.log(idx);
		if(idx != -1)this.iconViewArray[idx].repaint();
		this.currentIcon = iconName;
		idx = _.indexOf(this.iconList, iconName);
		console.log(idx, iconName);
		var $div = this.iconViewArray[idx].$el.find('img').parent();
		$div.addClass('theamBGColor');
		$div.find('.tick').show();
	}
});

EditCurtainParams = EditSwitchParams.extend({
	iconList : ['curtain']
});

EditIpCamParams = EditSwitchParams.extend({
	templateSelector:"#editIpCameraTemplate",
	iconList : ['ipCam','ipCam1','ipCam2','ipCam3'],
	subViews : [],
	render	:	function () {
		BaseView.prototype.render.apply(this, arguments);
		this.setIcon(this.model.get('icon'));
		setTimeout(_.bind(function(){this.$el.find('.switchName').removeAttr('readonly')}, this),500);
		return this;
	}
});

EditParamFactory = function (options) {
	switch (options.model.get('type')) {
		case 'curtain'	: return new EditCurtainParams(options);
		case 'ipCam'	: return new EditIpCamParams(options);
		default		: return new EditSwitchParams(options);
	}
}

EditableSwitch = AdvanceSwitch.extend({
	subViews : [{'viewClassName':'EditParamFactory', 'reference':'editView', 'parentSelector':'.advancePannel', 'model':'this.model', 'supressRender':true}],
	toggelSwitch : function (event) {
		if(this.model.get('type') != "curtain")
			return AdvanceSwitch.prototype.toggelSwitch.apply(this, arguments);
	},
	showAdvancePannel : function () {
		this.$el.find('.iconPartition').hide();
		AdvanceSwitch.prototype.showAdvancePannel.apply(this, arguments);
		this.editView.render();	
		var left = this.$el.offset().left;
		var top = ($(window).height() - this.$el.height())/2
		if(top > 0) this.$el.css('top', top+'px').css('left', left+'px').css('position','fixed');
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