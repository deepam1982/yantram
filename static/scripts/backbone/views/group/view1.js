SwitchViewFactory = function (options) {
	var retObj;
	switch (options.model.get('type')) {
		case 'dimmer'	: return new AdvanceFanSwitch(options);
		case 'curtain'	: return new AdvanceCurtainSwitch(options);
		case 'ipCam'	: return new IpCamaraSwitch(options);
		case 'irRem'	: return new AdvanceRemoteSwitch(options);
		case 'normal'	: return new BasicSwitch(options);
		default		: retObj = new BasicSwitch(options);
	}
	retObj.render = function(){return this}
	return retObj;
}

GroupView1 = BaseView.extend({
	name : "GroupView1",
	templateSelector:"#groupTemplate",
	// recreateOnRepaint because ViewClass is a ViewFactory
	subViewArrays : [{'viewClassName':'SwitchViewFactory', 'reference':'switchViewArray', 'parentSelector':'.switchCont', 'array':'this.switchCollection', 'recreateOnRepaint':false}],
	initialize: function(obj) {
		var ColClass = Backbone.Collection.extend({model:SwitchModel});
		this.switchCollection = new ColClass();
		this.switchCollection.on("add", function (swModel) {swModel.ioSocket=this.model.collection.ioSocket;}, this);
		this.switchCollection.set(this.model.get("controls"), {merge: true});
		this.model.on('change', _.bind(function (model) {
			//var changedProps = _.keys(model.changed);
			//if(changedProps.length == 1 && changedProps[0] == "controls") this.avoidRepaint = true;
			this.switchCollection.set(this.model.get("controls"), {merge: true});
		}, this));
		BaseView.prototype.initialize.apply(this, arguments);
//		this.model.on('change', _.bind(this.repaint, this));
    },
	events: {
		"tap .powerButton" : "onPowerOffClick"
	},
	repaint : function () {
		// Hack to fix mobile app and mobile chrome browser where without following line,
		// lower groups on app dance while on/off. Proper fix would be that on switch state change,
		// entire group should not get repainted.
		// group repaint could be avoided by setting this.avoidRepaint=true, after making sure that 
		// only parameter of the controles of the group have changed. which can be done by listining to on-change of model
		this.$el.css('height',this.$el.height()+'px');
		BaseView.prototype.repaint.apply(this, arguments);
		this.$el.css('height','auto');
		
	},
	onPowerOffClick : function (event) {
		var $loader;
//		$(event.target).closest('.roomTitleCont').append($loader=$('<img class="powerOffSpinner" src="static/images/loading.gif"/>'))
		$(event.target).closest('.roomTitleCont').append($loader=$('<i class="powerOffSpinner brightColor fa fa-spinner fa-spin"></i>'))
		this.model.powerOff(function () {setTimeout(function (){$loader.remove()}, 1000)});
	}
});

SwitchProxy = BaseView.extend({
	name : "SwitchProxy",
	templateSelector:"#switchProxyTemplate",
	events: {
 		"tap .toggelSwitch" : "onToggelSwitch"
 	},
 	onToggelSwitch : function (event) {
 		if(this.model.task == 'moodSelection') {
 			if(this.model.type == 'irBlstr') return this.showIrCodeSelector();
	 		if(!this.model.selected) {
		 		this.model.selected = !this.model.selected;
 				this.model.setOn = true;
	 		}
 			else if(this.model.setOn) this.model.setOn = false;
 			else this.model.selected = !this.model.selected;
 		}else this.model.selected = !this.model.selected;
 		this.repaint();
 	},
 	showIrCodeSelector : function () {
 		var remotes = this.options.deviceCollection.get('irRemotes').get('loadInfo');
 		irCodeSelector.showPopUp(remotes, this.model.setOn || [], _.bind(function(codeArr){
 			this.model.selected = (codeArr && codeArr.length)?true:false;
 			this.model.setOn = codeArr;
 			this.repaint();
 		}, this));
 	},
	_getJsonToRenderTemplate : function () {
		return JSON.parse(JSON.stringify(this.model));
	}
});

DeviceGroupSwitchProxy = SwitchProxy.extend({
	render : function () {
		if(_.contains(['sensor'], this.model.type) || this.model.hidden) return this;
		return SwitchProxy.prototype.render.apply(this, arguments);
	}
});

DeviceGroupView = BaseView.extend({
	name : "DeviceGroupView",
	templateSelector:"#deviceGroupTemplate",
	subViewArrays : [{'viewClassName':'DeviceGroupSwitchProxy', 'reference':'switchViewArray', 'parentSelector':'.switchProxyCont', 'array':'this.model.get("loadInfo")||this.model.get("controls")', 'eval':['deviceCollection=this.options.deviceCollection'],}]
	//TODO arr should be collection and not simple array.

});

ChoseGroupIconPannel = BasicDialog.extend({
	templateSelector:"#choseGroupIconPannel",
	icons:['1living','2living','3living','4tv','5tv','6music','7dining','8dining','9dining','10bar','11bar','12kitchen','13kitchen', '14bedroom', '15bedroom', '16bedroom', '17bedroom', '18bunkbed', '18splitbed', '19dressing', '20wadrobe','21wadrobe','22washroom','23bathroom','24bathroom','25washing', '26balcony','27balcony','28garden','29outdoor','30outdoor','31swimming','32snooker','33tenis','34gym','35garage','36conferance','37desk','38desk','39study','41pooja','42stairs','40door'],
	_getJsonToRenderTemplate : function () {return {'icons':this.icons, 'curIcon':this.iconName || '40door'}},
	events: {
		"tap .cross" : "onSelectionDone",
		"tap .roomIconCont" : "onRoomIconChange"
	},
	show : function (iconName,onDoneCakbk) {
		this.iconName = iconName;
		this.onDoneCakbk = onDoneCakbk;
		return BasicDialog.prototype.show.apply(this, arguments);
	},
	onRoomIconChange : function (event) {
		var rmIcnCnt = $(event.target).closest('.roomIconCont'), iconName = rmIcnCnt.attr('iconName');
		this.$el.find('.roomIconCont .tick:visible').hide();
		rmIcnCnt.find('.tick').show();
	},
	onSelectionDone : function () {
		var newIconName = $(this.$el.find('.roomIconCont .tick:visible')[0]).closest('.roomIconCont').attr('iconName');
		this.hide();
		this.onDoneCakbk && this.onDoneCakbk(newIconName);
	}
})

EditGroupPannel = BaseView.extend({
	name : "EditGroupPannel",
	templateSelector:"#editGroupTemplate",
	subViews : [{'viewClassName':'ChoseGroupIconPannel', 'reference':'choseIconDialog', 'parentSelector':'.groupIconPannelCont', 'model':null, 'supressRender':true}],
	subViewArrays : [{'viewClassName':'DeviceGroupView', 'reference':'deviceGroupView', 'parentSelector':'.deviceGroupCont', 'array':'this.options.deviceCollection'}],
	events: {
		"tap .editGroupIcon" : "editGroupIcon"
	},
	editGroupIcon : function () {
		this.choseIconDialog.show(this.model.get('icon'),_.bind(function(newIconName){
			this.model.set('icon', newIconName, {silent: true});
			this.$el.find('.roomIcon').css('background-image','url("static/images/rooms/'+newIconName+'.png")')
		},this));
	},
	render : function () {
		var irRemIndx = -1;
		this.options.deviceCollection.each(function (dev, indx) {
			if(dev.get("id") == "irRemotes") irRemIndx = indx;
			_.each(dev.get('loadInfo'), function (sw, key) {sw.task=sw.selected=sw.hidden=false;}, this);
		}, this);
		_.each(this.model.get('controls'), function (obj) {
			this.options.deviceCollection.get(obj.devId).get('loadInfo')[obj.switchID].selected=true;
		}, this);
		BaseView.prototype.render.apply(this, arguments);
		if(irRemIndx != -1) this.deviceGroupView[irRemIndx].$el.hide();
		return this;
	},
	erase : function () {
		if(!this.rendered) return;
		this.saveGroupInfo()
		return BaseView.prototype.erase.apply(this, arguments);
	},
	saveGroupInfo : function () {
		var groupInfo = this.model.toJSON();
		groupInfo.rank = this.$el.find('input[name=rank]:checked').val() || groupInfo.rank;
		groupInfo.name=this.$el.find('.groupName').val() || groupInfo.name;
		var controls = [], id=0;
		this.options.deviceCollection.each(function (dev) {
			if(dev.get('id') == "irRemotes") return;
			_.each(dev.get('loadInfo'), function (sw, key) {
				sw.selected && controls.push({"id":++id, "devId":dev.id, "switchID":(dev.id=="irBlasters")?key:parseInt(key)});
			}, this);
		}, this);
		groupInfo.controls = controls;
		if(groupInfo.name && controls.length)
		this.model.ioSocket.emit("modifyGroup", groupInfo, function (err){if(err)console.log(err)});
		console.log(groupInfo);		
	}
});

GroupEditView = GroupView1.extend(AdvancePannel).extend({
	name : "GroupEditView",
	subViews : [{'viewClassName':'EditGroupPannel', 'reference':'editPannel', 'parentSelector':'.editTemplateCont', 'model':'this.model', 'eval':['deviceCollection=this.options.deviceCollection'],'supressRender':true}],
	subViewArrays : [{'viewClassName':'EditableSwitch', 'reference':'switchViewArray', 'parentSelector':'.switchCont', 'array':'this.switchCollection', 'eval':['deviceCollection=this.options.deviceCollection']}],
	render	:	function () {
 		GroupView1.prototype.render.apply(this, arguments);
 		AdvancePannel.render.apply(this, arguments);
 		return this;
 	},
 	events: _.extend(GroupView1.prototype.events,AdvancePannel.events, {
 		"tap .editGroup" : "showAdvancePannel",
 		"tap .deleteGroup" : "deleteGroup"
 	}),
 	deleteGroup : function () {
 		confirmDialog.show("Are you sure, you want to delete group?", _.bind(function(sure){
 			if(!sure) return;
 			var groupInfo = this.model.toJSON();
//			groupInfo.rank = groupInfo.id;
			groupInfo.controls = [];
			this.model.ioSocket.emit("modifyGroup", groupInfo, function (err){if(err)console.log(err)});
 		}, this));
 	},
 	showAdvancePannel : function () {
		AdvancePannel.showAdvancePannel.apply(this, arguments);
		//this.$el.css('top', '50px');
		this.$el.find('.roomTitleCont').hide();
		this.$el.find('.switchCont').hide();
		this.editPannel.render();

		var left = this.$el.offset().left;
		var top = Math.max(0,($(window).height() - this.$el.height())/2)
		this.$el.css('top', top+'px').css('left', left+'px').css('position','fixed');
		this.$el.find('.groupView').css('max-height',$(window).height()+'px').addClass('overflowScroll');

//		this.$el.css('top',Math.max(10,Math.min($('body').height()-this.editPannel.$el.height()-30, this.editPannel.$el.offset().top))+"px");
		
 	},
 	hideAdvancePannel : function () {
 		var groupName = this.$el.find('.groupName').val()
 		var groupSize = this.$el.find('.deviceGroupCont .tick:visible').length
 		if(groupName && groupSize) this._hideAdvancePannel();
 		else
 			confirmDialog.show("Group without "+((groupSize)?"name":"any device")+" cannot exist, are you sure you are done?", _.bind(function(sure) {
 				if (sure) this._hideAdvancePannel();	
 			},this));
 	},
 	_hideAdvancePannel : function () {
 		
 		this.$el.find('.groupView').css('max-height','').removeClass('overflowScroll');
 		this.$el.css('top', '').css('left', '').css('position','');
 		this.editPannel.erase();
 		this.$el.find('.switchCont').show();
 		this.$el.find('.roomTitleCont').show();
		AdvancePannel.hideAdvancePannel.apply(this, arguments);
 	}

});
