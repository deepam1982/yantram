SelectSensors = BaseView.extend({
	templateSelector:"#multiSelectIconTemplate",
	tagName : 'span',
	events: {
		"tap .selectSwitch"  : "selectIcon",
	},
	selectIcon : function () {
		this.selected = !this.selected;
		this.$el.find('.tick')[(this.selected)?'show':'hide']();
	}, 
	_getJsonToRenderTemplate : function () {
		this.model.src = "static/images/transparent/"+this.model.icon+".png" ;
		this.selected = this.model.selected;
		return this.model;
	},
});

EditSensorRulePannel = BasicDialog.extend({
	templateSelector:"#editSensorRulePannel",
	subViewArrays : [{'viewClassName':'SelectSensors', 'reference':'sensorViewArray', 'parentSelector':'.sensorIconDiv', 'array':'this.sensorList','createOnRender':true},
					{'viewClassName':'SelectSensors', 'reference':'filterViewArray', 'parentSelector':'.filterIconDiv', 'array':'this.filterList','createOnRender':true}],
	events: {
		"tap .cross" : "onSelectionDone",
		"change .manualTimeRange" : "onManualTimeChange"
	},
	_filterList : [{'icon':'evening', 'name':'Evening', 'id':'evening'},
							{'icon':'dayLight', 'name':'Day Light', 'id':'dayLight'},
							{'icon':'sleepHour', 'name':'Night', 'id':'sleepHour'}],
	onManualTimeChange : function () {
		var displayVal, manualTime=parseInt(this.$el.find('.manualTimeRange').val());
		switch (manualTime) {
			case 1 : displayVal='2 minutes';break; case 2 : displayVal='5 minutes';break; 
			case 3 : displayVal='10 minutes';break;
			case 4 : displayVal='15 minutes';break; case 5 : displayVal='20 minutes';break;
		}
		this.$el.find('.manualTimeVal').html(displayVal);
	},
	show : function () {
		var selectedObjs = this.model.get('followObjs');
		this.filterList = JSON.parse(JSON.stringify(this._filterList)); // cloning
		_.each(this.filterList, function(obj) {
			if(_.contains(selectedObjs, obj.id)) obj.selected=true;
		}, this);
		this.sensorList = [];
		_.each(this.options.deviceCollection.models, function(model){
			_.each(model.get('loadInfo'), function(info) {
				if(info.type == 'sensor') {
					var clone = JSON.parse(JSON.stringify(info));
					if(_.contains(selectedObjs, clone.id)) clone.selected=true;
					this.sensorList.push(clone);
				}
			}, this);
		}, this)
		var retObj = BasicDialog.prototype.show.apply(this, arguments);
		var manualTime = this.model.get('manualFollowSuspension');
		var sliderVal=2, displayVal='5 minutes';
		switch (manualTime) {
			case 120 : sliderVal=1; displayVal='2 minutes'; break;
			case 300 : sliderVal=2; displayVal='5 minutes'; break;
			case 600 : sliderVal=3; displayVal='10 minutes'; break;
			case 900 : sliderVal=4; displayVal='15 minutes'; break;
			case 1200 : sliderVal=5; displayVal='20 minutes'; break;
		} 
		this.$el.find('.manualTimeRange').val(sliderVal);
		this.$el.find('.manualTimeVal').html(displayVal);
		this._makeSelectionString();
		return retObj;
	},
	_makeSelectionString : function() {
		var sensorList = [], filterList = [], manualTime=parseInt(this.$el.find('.manualTimeRange').val());
		switch (manualTime) {
			case 1 : manualTime=120;break; case 2 : manualTime=300;break; case 3 : manualTime=600;break;
			case 4 : manualTime=900;break; case 5 : manualTime=1200;break;
		}
		this.manualTime=manualTime;
		_.each(this.sensorViewArray, function(sView){if(sView.selected)sensorList.push(sView.model.id)}, this);
		_.each(this.filterViewArray, function(fView){if(fView.selected)filterList.push(fView.model.id)}, this);
		this.sensorListStr = JSON.stringify(sensorList);
		this.filterListStr = JSON.stringify(filterList);	
	},
	onSelectionDone : function() {
		var concatStr = this.sensorListStr + this.filterListStr + this.manualTime;
		this._makeSelectionString();
		if(concatStr != this.sensorListStr + this.filterListStr + this.manualTime) {
			this.model.setSwitchParam({'followObjects':{
				"sensorList":JSON.parse(this.sensorListStr),
				"filterList":JSON.parse(this.filterListStr),
				"manualTime":this.manualTime}},
				function(err){if(err)console.log(err);});
		}
		this.hide();
	}
})	


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
	iconList : ['switch', 'bulb', 'cfl', 'cfl1', 'tubelight', 'chandelier', 'ceiling', 'ceiling1', 'fan', 'fan1', 'plug', 'plug1', 'lamp', 'lamp1', 'mosquito coil', 'iron', 'geyser', 'tv', 'tv1', 'ac', 'ac1', 'heater', 'air cooler', 'washing machine', 'water purifier'],
	subViews : [{'viewClassName':'EditSensorRulePannel', 'reference':'sensorRuleDialog', 'parentSelector':'.sensorRuleEditorCont', 'model':'this.model', 'eval':['deviceCollection=this.options.deviceCollection'], 'supressRender':true},
				{'viewClassName':'ScheduleEditor', 'reference':'schEditor', 'parentSelector':'#scheduleEditor', 'model':'this.model', 'events' : {
		'change':'doneEditSchedule',
		'remove':'repaint'
	}}],
	subViewArrays : [{'viewClassName':'SelectSwitchIcon', 'reference':'iconViewArray', 'parentSelector':'.iconCont', 'array':'this.iconList'}],
	events: {
		"tap .sensorRuleDisplayCont" : "showEditSensorRuleDialog",
		"tap .editSensorRule" : "showEditSensorRuleDialog",
		"tap .iconCont .selectSwitch"  : "_setIcon",
		"change .switchName" : "_nameChange",
		"change .typeRadioCont input[type='radio']" : "_typeChange",
		"change .autoOffRadioCont input[type='radio']" : "_AutoOffToggle",
		"change .autoOffTimeSelect select" : "_setAutoOffParams",
		"tap .scheduleCont .edit, .addShdlBtnCont .addNewSchedule" : "_editSchedule",
		"tap .scheduleCont .enable, .scheduleCont .disable" : "_enableDisableSchedule",
		"tap .scheduleCont .remove" : "_removeSchedule"
	},
	showEditSensorRuleDialog : function () {
		this.sensorRuleDialog.show();
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
		this.repaint(); // repaint is required as one may click done without changing any thing.
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
		var followObjs = this.model.get('followObjs');
		_.each(followObjs, function (id, indx) {
			var imgName = id;
			if(1 + id.indexOf('-s')) {
				var loadinfo = this.options.deviceCollection.get(id.split('-s')[0]).get('loadInfo');
				for(var key in loadinfo) { var obj = loadinfo[key];
					if(obj.id == id) {imgName = obj.icon; break;}
				}
			}
			this.$el.find('.sensorRuleDisplayCont').append("<img style='width:35px;' src='static/images/transparent/"+imgName+".png'></img>")
			this.$el.find('.attachSensorRuleBtnCont').hide();
		}, this);
		return this;
	},
	setIcon : function (iconName) {
		var idx = _.indexOf(this.iconList, this.currentIcon);
		if(idx != -1)this.iconViewArray[idx].repaint();
		this.currentIcon = iconName;
		idx = _.indexOf(this.iconList, iconName);
		if(idx == -1) return;
		var $div = this.iconViewArray[idx].$el.find('img').parent();
		$div.addClass('theamBGColor');
		$div.find('.tick').show();
	}
});

EditCurtainParams = EditSwitchParams.extend({
	iconList : ['curtain', 'curtain1', 'curtain2', 'curtain3', 'curtain4']
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

EditSensorParams = EditIpCamParams.extend({
	templateSelector:"#editPirTemplate",
	iconList : ['pir', 'pir1'],
	events : _.extend(EditIpCamParams.prototype.events, {
		"change .pacificityRange" : "_pacificityChange"
	}),
	_pacificityChange : function () {
		var pval = parseInt(this.$el.find('.pacificityRange').val());
		switch(pval){
			case 1 : pval = 15;break;	case 4 : pval = 120;break;	case 7 : pval = 420;break;
			case 2 : pval = 30;break;	case 5 : pval = 180;break;	case 8 : pval = 600;break;
			case 3 : pval = 60;break;	case 6 : pval = 300;break;	case 9 : pval = 900;break;
			case 10 : pval = 1200;break;
		}
		var mins = parseInt(pval/60), secs = pval%60;
		this.$el.find('.pacificityVal').html((mins)?mins+" minutes":secs+" seconds");
		this.model.setSwitchParam({'pacificity':pval}, _.bind(function () {}, this));
	},
	render	:	function () {
		EditIpCamParams.prototype.render.apply(this, arguments);
		var pval = this.model.get('pacificity');
		var mins = parseInt(pval/60), secs = pval%60;
		switch(pval){
			case 15 : pval = 1;break;	case 120 : pval = 4;break;	case 420 : pval = 7;break;
			case 30 : pval = 2;break;	case 180 : pval = 5;break;	case 600 : pval = 8;break;
			case 60 : pval = 3;break;	case 300 : pval = 6;break;	case 900 : pval = 9;break;
			case 1200 : pval = 10;break;
		}
		this.$el.find('.pacificityRange').val(pval);
		this.$el.find('.pacificityVal').html((mins)?mins+" minutes":secs+" seconds");
		return this;
	}
});


SelectRemote = BaseView.extend({
	templateSelector:"#multiSelectIconTemplate",
	tagName : 'span',
	events: {
		"tap .selectSwitch"  : "selectSwitch",
	},
	selectSwitch : function () {
		this.remoteSelected = !this.remoteSelected;
		this.$el.find('.tick')[(this.remoteSelected)?'show':'hide']();
	}, 
	_getJsonToRenderTemplate : function () {
		this.model.src = "static/images/transparent/"+this.model.icon+".png" ;
		return this.model;
	},
});

EditIrBlstrParams = EditIpCamParams.extend({
	iconList : [],//['Airtel_DTH', 'Tata_Sky', 'Dish_TV', 'Videocon_D2H', 'Sun_Direct'],
	subViewArrays : [{'viewClassName':'SelectRemote', 'reference':'iconViewArray', 'parentSelector':'.iconCont', 'array':'this.options.deviceCollection.get("irRemotes").get("loadInfo")','createOnRender':true}],
	render	:	function () {
		this.selectedIcons=[]
		var retObj = EditIpCamParams.prototype.render.apply(this, arguments);
		_.each(this.model.get("remotes"), function (idx) {
			idx = parseInt(idx);
			this.iconViewArray[idx-1].selectSwitch();
		}, this);
		return retObj
	},
	saveParams : function () {
		var selectedIds = [];
		_.each(this.iconViewArray, function(view){if(view.remoteSelected) selectedIds.push(view.model.id)}, this)
		console.log(selectedIds);
		this.model.setSwitchParam({'remotes':selectedIds});		
	},
	_setIcon : function (event) {
		return;
	}
});

EditParamFactory = function (options) {
	var retObj;
	switch (options.model.get('type')) {
		case 'curtain'	: return new EditCurtainParams(options);
		case 'ipCam'	: return new EditIpCamParams(options);
		case 'irBlstr'	: return new EditIrBlstrParams(options);
		case 'sensor'	: return new EditSensorParams(options);
		case 'dimmer'	:
		case 'normal'	: return new EditSwitchParams(options);
		default		: retObj = new EditSwitchParams(options);
	}
	retObj.render = function(){return this}
	return retObj;
}

EditableSwitch = AdvanceSwitch.extend({
	// recreateOnRepaint because ViewClass is a ViewFactory
	subViews : [{'viewClassName':'EditParamFactory', 'reference':'editView', 'parentSelector':'.advancePannel', 'model':'this.model', 'eval':['deviceCollection=this.options.deviceCollection'], 'supressRender':true, 'recreateOnRepaint':true }],
	toggelSwitch : function (event) {
		if(!_.contains(['curtain', 'ipCam', 'irBlstr', 'sensor'], this.model.get('type')))
			return AdvanceSwitch.prototype.toggelSwitch.apply(this, arguments);
	},
	showAdvancePannel : function () {
		this.$el.find('.followObjIndicator, .remoteCountIndicator').hide();
		this.$el.find('.iconPartition').hide();
		AdvanceSwitch.prototype.showAdvancePannel.apply(this, arguments);
		this.editView.render();	
		var left = this.$el.offset().left;
		var top = ($(window).height() - this.$el.height())/2
		if(top > 0) this.$el.css('top', top+'px').css('left', left+'px').css('position','fixed');
		setTimeout(_.bind(function () {this.$el.find('.checked').prop("checked", true);}, this), 20);
	},
	hideAdvancePannel : function () {
		this.$el.find('.followObjIndicator, .remoteCountIndicator').show();
		if(this.editView.saveParams)this.editView.saveParams();
		this.editView.erase();
		AdvanceSwitch.prototype.hideAdvancePannel.apply(this, arguments);
		this.$el.find('.iconPartition').show();
		this.repaint();
	},
	repaint : function () {
		if(!this.bd) return AdvanceSwitch.prototype.repaint.apply(this, arguments);
		this.editView.repaint();
		return this;
	},
	render : function () {
		if(this.model.get('type') == "irRem") return this; // donot render in case of irRem;
		var retObj= AdvanceSwitch.prototype.render.apply(this, arguments);
		this.$el.find('.followObjIndicator').show();
		if(this.model.get('type') == "irBlstr"){
			var remotes = this.model.get("remotes");
			var count = (remotes)?remotes.length:0;
			if(count)
				this.$el.find('.basicSwitchTemplate .fa-exclamation-circle').parent().before("<div class='remoteCountIndicator theamBGColor'><i class='fa fa-paperclip hInvert' style='position:absolute;left:-7px;bottom:-7px;'></i><span style='color:white;'>"+count+"</span></div>")
		}

		return retObj;
	}
});