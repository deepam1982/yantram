EditMoodPannel = BaseView.extend({
	name : "EditMoodPannel",
	iconNameArray : ['coffee','meditate', 'ideate', 'wine', 'converce', 'romance', 'movie', 'gaming', 'meal', 'supper', 'sleepy', 'work', 'gym'],
	templateSelector:"#editMoodTemplate",
	subViewArrays : [{'viewClassName':'DeviceGroupView', 'reference':'deviceGroupView', 'parentSelector':'.editMoodCont', 'array':'deviceCollection'}],
		events : {
		"tap .moodIcon" : 'changeMoodIcon'
	},
	changeMoodIcon : function (event) {
		this.selectedIcon = $(event.target).closest('.moodIcon').attr('moodName');
		this.$el.find('.moodName').val(this.selectedIcon)
		this.repaint();
		
	},
	_getJsonToRenderTemplate : function () {
		var moodJson = (this.moodInfo)?(this.moodInfo):((this.model)?this.model.toJSON():{});
		if(this.selectedIcon) moodJson.icon = this.selectedIcon;
		moodJson.iconNameArray = this.iconNameArray;
		return moodJson;
	},
	_getMoodInfo : function () {
		var moodInfo = this.model.toJSON();
		this.selectedIcon && (moodInfo.icon = this.selectedIcon) ;
		moodInfo.rank = this.$el.find('input[name=rank]:checked').val() || moodInfo.id;
		moodInfo.name=this.$el.find('.moodName').val() || moodInfo.name;
		moodInfo.name=moodInfo.name.charAt(0).toUpperCase() + moodInfo.name.slice(1);
		var controls = [], id=0;
		deviceCollection.each(function (dev) {
			_.each(dev.get('loadInfo'), function (sw, key) {
				sw.selected && controls.push({"id":++id, "devId":dev.id, "switchId":parseInt(key), "state":sw.setOn});
			}, this);
		}, this);
		moodInfo.controls = controls;
		return moodInfo;		
	},
	_saveMood : function () {
		if(this.avoidSaving) return;
		ioSocket.emit("modifyMood", this._getMoodInfo(), function (err){if(err)console.log(err)});
	},
	render : function () {
		deviceCollection.each(function (dev) {
				_.each(dev.get('loadInfo'), function (sw, key) {sw.task='moodSelection';sw.selected=false;}, this);
			}, this);
			_.each((this.moodInfo)?this.moodInfo.controls:this.model.get('controls'), function (obj) {
				var sw = deviceCollection.get(obj.devId).get('loadInfo')[obj.switchId];
				sw.selected=true;sw.setOn=(obj.state=='on'||obj.state==true)?true:false;
			}, this);
		BaseView.prototype.render.apply(this, arguments);
		return this;
	},
	erase : function () {
		if(!this.rendered) return;
		this._saveMood();
		return BaseView.prototype.erase.apply(this, arguments);
	},
	repaint : function () {
		this.avoidSaving=true;
		this.moodInfo = this._getMoodInfo();
		BaseView.prototype.repaint.apply(this, arguments);
		this.avoidSaving=false;
		this.moodInfo = null;
		return this;
	}
});

