EditMoodPannel = BaseView.extend({
	name : "EditMoodPannel",
	iconNameArray : ['morning', 'evening', 'welcome', 'leave', 'coffee', 'tea', 'meditate', 'ideate', 'wine', 'chat', 'romance', 'movie', 'gaming', 'meal', 'supper', 'sleepy', 'work', 'gym'],
	templateSelector:"#editMoodTemplate",
	subViewArrays : [{'viewClassName':'DeviceGroupView', 'reference':'deviceGroupView', 'parentSelector':'.deviceGroupCont', 'array':'this.options.gC','eval':['deviceCollection=this.options.deviceCollection'], 'createOnRender':true}],
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
		var controls = [], id=0, arr=[];
		this.options.gC.each(function (grp) {
			_.each(grp.get('controls'), function (sw, key) {
				if(sw.selected && !_.contains(arr, sw.devId+sw.switchID)) {
					arr.push(sw.devId+sw.switchID);
					if(sw.devId == 'irBlasters')
						controls.push({"id":++id, "devId":sw.devId, "switchId":sw.switchID, "state":"off", "irCodes":sw.setOn});
					else 
						controls.push({"id":++id, "devId":sw.devId, "switchId":sw.switchID, "state":sw.setOn});
				}
			}, this);
		}, this);
		moodInfo.controls = controls;
		return moodInfo;		
	},
	_saveMood : function () {
		if(this.avoidSaving) return;
		this.model.ioSocket.emit("modifyMood", this._getMoodInfo(), function (err){if(err)console.log(err)});
	},
	render : function () {
		var hash = {};
		_.each((this.moodInfo)?this.moodInfo.controls:this.model.get('controls'), function (obj) {
			if(!hash[obj.devId]) hash[obj.devId]={}; 
			hash[obj.devId][obj.switchId]= (obj.state=='on'||obj.state==true)?true:false;
			if(obj.devId == 'irBlasters')hash[obj.devId][obj.switchId] = obj.irCodes;
		}, this);

		this.options.gC.each(function (grp) {
			_.each(grp.get('controls'), function (sw, key) {
				sw.task='moodSelection';sw.selected=sw.hidden=false;
				if(hash[sw.devId] && _.has(hash[sw.devId], sw.switchID)){
					sw.selected=true;sw.setOn=hash[sw.devId][sw.switchID];
				}
				if(_.contains(['irRem', 'ipCam', 'curtain'], sw.type)) sw.hidden=true;
			}, this);
		}, this);

		BaseView.prototype.render.apply(this, arguments);
		setTimeout(_.bind(function(){this.$el.find('input[type="radio"][checked]').prop("checked", true);},this),200);
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

