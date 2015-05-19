SwitchViewFactory = function (options) {
	switch (options.model.get('type')) {
		case 'dimmer'	: return new AdvanceFanSwitch(options);
		default		: return new BasicSwitch(options);
	}
}

GroupView1 = BaseView.extend({
	name : "GroupView1",
	templateSelector:"#groupTemplate",
	// recreateOnRepaint because ViewClass is a ViewFactory
	subViewArrays : [{'viewClassName':'SwitchViewFactory', 'reference':'switchViewArray', 'parentSelector':'.switchCont', 'array':'this.switchCollection', 'recreateOnRepaint':false}],
	initialize: function(obj) {
		var ColClass = Backbone.Collection.extend({model:SwitchModel});
		this.switchCollection = new ColClass(obj.model.get("controls"));
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
		$(event.target).closest('.roomTitleCont').append($loader=$('<img src="static/images/loading.gif" style="position:absolute;right:-11px;top:-13px;"/>'))
		this.model.powerOff(function () {setTimeout(function (){$loader.remove()}, 1000)});
	}
});

SwitchProxy = BaseView.extend({
	name : "SwitchProxy",
	templateSelector:"#switchProxyTemplate",
	events: {
 		"tap .iconPartition" : "onToggelSwitch"
 	},
 	onToggelSwitch : function (event) {
 		if(this.model.task == 'moodSelection') {
	 		if(!this.model.selected) {
		 		this.model.selected = !this.model.selected;
 				this.model.setOn = true;
	 		}
 			else if(this.model.setOn) this.model.setOn = false;
 			else this.model.selected = !this.model.selected;
 		}else this.model.selected = !this.model.selected;
 		this.repaint();
 	},
	_getJsonToRenderTemplate : function () {
		return JSON.parse(JSON.stringify(this.model));
	}
});

DeviceGroupView = BaseView.extend({
	name : "DeviceGroupView",
	templateSelector:"#deviceGroupTemplate",
	subViewArrays : [{'viewClassName':'SwitchProxy', 'reference':'switchViewArray', 'parentSelector':'.switchProxyCont', 'array':'this.model.get("loadInfo")||this.model.get("controls")'}]
	//TODO arr should be collection and not simple array.
});

EditGroupPannel = BaseView.extend({
	name : "EditGroupPannel",
	templateSelector:"#editGroupTemplate",
	subViewArrays : [{'viewClassName':'DeviceGroupView', 'reference':'deviceGroupView', 'parentSelector':'.editGroupCont', 'array':'deviceCollection'}],
	render : function () {
		deviceCollection.each(function (dev) {
			_.each(dev.get('loadInfo'), function (sw, key) {sw.task=sw.selected=false;}, this);
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
		groupInfo.rank = this.$el.find('input[name=rank]:checked').val() || groupInfo.rank;
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
 		"tap .editGroup" : "showAdvancePannel",
 		"tap .deleteGroup" : "deleteGroup"
 	}),
 	deleteGroup : function () {
 		var groupInfo = this.model.toJSON();
//		groupInfo.rank = groupInfo.id;
		groupInfo.controls = [];
		ioSocket.emit("modifyGroup", groupInfo, function (err){if(err)console.log(err)});
 	},
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
