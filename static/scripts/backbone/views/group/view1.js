SwitchViewFactory = function (options) {
	switch (options.model.get('type')) {
		case 'dimmer'	: return new AdvanceFanSwitch(options);
		default		: return new BasicSwitch(options);
	}
}

GroupView1 = BaseView.extend({
	name : "GroupView1",
	templateSelector:"#roomTemplate",
	// recreateOnRepaint because ViewClass is a ViewFactory
	subViewArrays : [{'viewClassName':'SwitchViewFactory', 'reference':'switchViewArray', 'parentSelector':'.switchCont', 'array':'this.switchCollection', 'recreateOnRepaint':true}],
	initialize: function(obj) {
		var ColClass = Backbone.Collection.extend({model:SwitchModel});
		this.switchCollection = new ColClass(obj.model.get("controls"));
		BaseView.prototype.initialize.apply(this, arguments);
		this.model.on('change', _.bind(function () {
			this.switchCollection.set(this.model.get("controls"));
		}, this));
//		this.model.on('change', _.bind(this.repaint, this));
    },
	events: {
		"tap .powerButton" : "onPowerOffClick"
	},
	onPowerOffClick : function () {
		this.model.powerOff();
	}
});

SwitchProxy = BaseView.extend({
	name : "SwitchProxy",
	templateSelector:"#switchProxyTemplate",
	events: {
 		"tap .iconPartition" : "onToggelSwitch"
 	},
 	onToggelSwitch : function (event) {
 		this.model.selected = !this.model.selected;
 		this.repaint();
 	},
	_getJsonToRenderTemplate : function () {
		return JSON.parse(JSON.stringify(this.model));
	}
});

DeviceGroupView = BaseView.extend({
	name : "DeviceGroupView",
	templateSelector:"#deviceGroupTemplate",
	subViewArrays : [{'viewClassName':'SwitchProxy', 'reference':'switchViewArray', 'parentSelector':'.switchProxyCont', 'array':'this.model.get("loadInfo")'}]
});

EditGroupPannel = BaseView.extend({
	name : "EditGroupPannel",
	templateSelector:"#editGroupTemplate",
	subViewArrays : [{'viewClassName':'DeviceGroupView', 'reference':'deviceGroupView', 'parentSelector':'.editGroupCont', 'array':'deviceCollection'}],
	render : function () {
		deviceCollection.each(function (dev) {
			_.each(dev.get('loadInfo'), function (sw, key) {sw.selected=false;}, this);
		}, this);
		_.each(this.model.get('controls'), function (obj) {
			deviceCollection.get(obj.devId).get('loadInfo')[obj.switchID].selected=true;
		}, this);
		BaseView.prototype.render.apply(this, arguments);
		return this;
	},
	erase : function () {
		if(!this.rendered) return;
		var groupInfo = this.model.toJSON();
		groupInfo.rank = this.$el.find('input[name=rank]:checked').val() || groupInfo.id;
		groupInfo.name=this.$el.find('.groupName').val() || groupInfo.name;
		var controls = [], id=0;
		deviceCollection.each(function (dev) {
			_.each(dev.get('loadInfo'), function (sw, key) {
				sw.selected && controls.push({"id":++id, "devId":dev.id, "switchID":parseInt(key)});
			}, this);
		}, this);
		groupInfo.controls = controls;
		ioSocket.emit("modifyGroup", groupInfo, function (err){if(err)console.log(err)});
		console.log(groupInfo);
		return BaseView.prototype.erase.apply(this, arguments);
	}
});

GroupEditView = GroupView1.extend(AdvancePannel).extend({
	name : "GroupEditView",
	subViews : [{'viewClassName':'EditGroupPannel', 'reference':'editPannel', 'parentSelector':'.editTemplateCont', 'model':'this.model', 'supressRender':true}],
	subViewArrays : [{'viewClassName':'EditableSwitch', 'reference':'switchViewArray', 'parentSelector':'.switchCont', 'array':'this.switchCollection'}],
	render	:	function () {
 		GroupView1.prototype.render.apply(this, arguments);
 		AdvancePannel.render.apply(this, arguments);
 		return this;
 	},
 	events: _.extend(GroupView1.prototype.events,AdvancePannel.events, {
 		"tap .editButton" : "showAdvancePannel"
 	}),
 	showAdvancePannel : function () {
		AdvancePannel.showAdvancePannel.apply(this, arguments);
		//this.$el.css('top', '50px');
		this.$el.find('.roomTitleCont').hide();
		this.$el.find('.switchCont').hide();
		this.editPannel.render();
		this.$el.css('top',Math.max(10,Math.min($('body').height()-this.editPannel.$el.height()-30, this.editPannel.$el.offset().top))+"px");
		
 	},
 	hideAdvancePannel : function () {
 		this.editPannel.erase();
 		this.$el.find('.switchCont').show();
 		this.$el.find('.roomTitleCont').show();
		AdvancePannel.hideAdvancePannel.apply(this, arguments);
 	}

});
