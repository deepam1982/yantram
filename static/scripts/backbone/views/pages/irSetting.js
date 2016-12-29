IrButtonRecorder = BasicDialog.extend({
	templateSelector:"#recordIRInterface",
	initialize : function (obj) {
		obj.socket.on('irCaptureSuccess', _.bind(this._onIRCapture, this))
		return BasicDialog.prototype.initialize.apply(this, arguments);
	},
	events: {
		"tap #startIrCapture"  : "_startIrCapture",
		"tap #stopIrCapture"  : "_stopIrCapture",
		"tap #playCaptured"  : "_playCapturedIr",
		"tap .cross"  : "hide",
		"tap #saveCaptured" : "_saveCaptured",
		"tap .blstrIconCont" : "changeHardware"
	},
	show : function(name) {
		BasicDialog.prototype.show.apply(this, arguments);
		this.$el.find('#name').html(name);
		this.capturedData = {"name":name};
		var blasters = this.options.deviceCollection.where({"id":"irBlasters"})[0].get("loadInfo");
		_.each(blasters, function(blstr, id){
			this.$el.find('.blstrIconListCont').append($('<div class="blstrIconCont" blstrId="'+id+'" style="position:relative;width:50px;float:left;margin:5px 0px;"><img style="width:100%;cursor:pointer;" src="static/'+revId+'/images/transparent/'+blstr.icon+'.png" /><div class="tick theamBGColor"></div></div>'));
		}, this);
		this.$el.find('.blstrIconCont .tick').hide();
		this.$el.find('.blstrIconCont[blstrId="'+this.blstrId+'"] .tick').show();
	},
	changeHardware : function (event) {
		var $iconCont = $(event.target).closest('.blstrIconCont'), blstrId=$iconCont.attr('blstrId');
		this.blstrId = blstrId;
		this.$el.find('.blstrIconCont .tick').hide();
		this.$el.find('.blstrIconCont[blstrId="'+this.blstrId+'"] .tick').show();
		this.trigger("onHwChange", blstrId);
	},
	_saveCaptured : function () {
		this.trigger("saveButtonIr", this.capturedData);
		this.hide();
	},
	_onIRCapture : function (data) {
		console.log(data);
		this.capturedData = _.extend(this.capturedData, data);
		this.$el.find('#encoding').html(data.encoding);
		this.$el.find('#bits').html(data.bits);
		this.$el.find('#code').html(data.code);
		this.$el.find('#length').html(data.length);

		this.$el.find('#stopIrCapture').hide();
		this.$el.find('#startIrCapture').show();
		this.$el.find('#playCaptured').show();
		this.$el.find('#saveCaptured').show();

		this.$el.find('.done').hide();
		this.$el.find('.cancle').show();
	},
	_startIrCapture : function () {
		this.$el.find('#encoding').html("&nbsp");
		this.$el.find('#bits').html("&nbsp");
		this.$el.find('#code').html("&nbsp");
		this.$el.find('#length').html("&nbsp");

		this.options.socket.emit('runIrProcess', {devId:this.blstrId, process:"startReciever"}, function(err){console.log('startReciever command sent!!');});
		this.$el.find('#saveCaptured').hide();
		this.$el.find('#startIrCapture').hide();
		this.$el.find('#stopIrCapture').show();
		this.$el.find('#playCaptured').hide();
	},
	_stopIrCapture : function () {
		console.log("_stopIrCapture called send emit runIrProcess stopReciever")
		this.options.socket.emit('runIrProcess', {devId:this.blstrId, process:"stopReciever"});
		this.$el.find('#saveCaptured').hide();
		this.$el.find('#stopIrCapture').hide();
		this.$el.find('#startIrCapture').show();
		this.$el.find('#playCaptured').hide();		
	},
	_playCapturedIr : function () {
		this.options.socket.emit('runIrProcess', _.extend({devId:this.blstrId, process:"playRawCode"},this.capturedData), function(){console.log('done!!');});
	}
})

RemoteEditViewer = RemoteViewer.extend({
	subViews : [{'viewClassName':'IrButtonRecorder', 'reference':'recorderDialog', 'parentSelector':'.iRrecorderCont', 'model':null, 'eval':['socket=this.options.socket','deviceCollection=this.options.deviceCollection'], 'supressRender':true}],
	iconList : ['remote_mini', 'remote_mini_generic', 'remote_with_numpad', 'remote_default', 'remote_ac_default'],
	events: {
		"tap .popupPannel > .cross" : "hidePopUp",
		"tap .btn" : "onButtonTap",
		"longTap .btn" : "editButtonCode",
		"saveButtonIr .iRrecorderCont" : "saveButtonIr",
		"tap .remoteIconCont" : "changeIcon",
		"tap .blstrIconCont" : "changeBlaster",
		"change #remoteName" : "changeName"
	},
	initialize : function (obj) {
		RemoteViewer.prototype.initialize.apply(this, arguments);
		this.recorderDialog.on("saveButtonIr", _.bind(this.saveButtonIr, this));
		this.recorderDialog.on("onHwChange", _.bind(this._changeBlaster, this));
		this.recorderDialog.blstrId = 'HcIrBlaster';
		return this;
	},
	render : function(){
		RemoteViewer.prototype.render.apply(this, arguments);
		this.$el.find('.remoteCont').addClass('theamBorderColor').css('border-width','1px').css('border-style','solid').css('border-radius','5px');
		this.$el.find('.iconListCont').show();
		this.$el.find('.recoderMeta').show();
		var blasters = this.options.deviceCollection.where({"id":"irBlasters"})[0].get("loadInfo");
		_.each(blasters, function(blstr, id){
			this.$el.find('.blstrIconListCont').append($('<div class="blstrIconCont" blstrId="'+id+'" style="position:relative;width:50px;float:left;margin:5px 0px;z-index:5;"><img style="width:100%;cursor:pointer;" src="static/'+revId+'/images/transparent/'+blstr.icon+'.png" /><div class="tick theamBGColor"></div></div>'));
		}, this);
		_.each(this.iconList, function(icon, indx){
			this.$el.find('.iconListCont').append($('<div class="remoteIconCont" icon="'+icon+'" style="position:relative;width:50px;float:left;margin:5px 0px;z-index:5;"><img style="width:100%;cursor:pointer;" src="static/'+revId+'/images/transparent/'+icon+'.png" /><div class="tick theamBGColor"></div></div>'));
		}, this);
		return this;
	},
	showFeed : function (model) {
		RemoteViewer.prototype.showFeed.apply(this, arguments);
		this.$el.find('.tick').hide();
		this.$el.find('.remoteIconCont[icon='+model.get('icon')+'] .tick').show();
		var blstrId = this.recorderDialog.blstrId || 'HcIrBlaster';
		this.model.set('irBlasterId', blstrId);
		this.$el.find('.blstrIconCont[blstrId="'+blstrId+'"] .tick').show();
		this.$el.find('.popupPannel').css('top', '0px');
		this.$el.find('#remoteName').val(model.get('name'));
		this.checkButtonList();
	},
	checkButtonList : function () {
		this.options.socket.emit("getButtonList", {"remoteId":this.model.get('switchID')}, _.bind(function(err, list){
			console.log(err, list);
			_.each(list, function(keyName) {this.$el.find('[code="'+keyName+'"] .tick').show()}, this)
		}, this));		
	},
	changeName : function () {
		var name = this.$el.find('#remoteName').val().trim();
		if(!name) return this.$el.find('#remoteName').val(this.model.get('name'));
		this.model.setSwitchParam({'name':name}, _.bind(function(rsp){
			this.model.set('name', name);
		}, this));
	},
	changeBlaster : function (event) {
		var $iconCont = $(event.target).closest('.blstrIconCont'), blstrId=$iconCont.attr('blstrId');
		this._changeBlaster(blstrId);
	},
	_changeBlaster : function (blstrId) {
		this.$el.find('.blstrIconCont .tick').hide();
		this.$el.find('.blstrIconCont[blstrId="'+blstrId+'"] .tick').show();
		this.recorderDialog.blstrId = blstrId;
		this.model.set('irBlasterId', blstrId);
	},
	changeIcon : function (event) {
		var $iconCont = $(event.target).closest('.remoteIconCont'), icon=$iconCont.attr('icon');
		this.$el.find('.remoteIconCont .tick').hide();
		this.paintRemote(icon);
		this.model.setSwitchParam({'icon':icon}, _.bind(function(rsp){
			this.$el.find('.remoteIconCont[icon='+icon+'] .tick').show();
			this.model.set('icon', icon);
		}, this));
		this.checkButtonList();
	},
	editButtonCode : function (event) {
		var $btn = $(event.target).closest('.btn');
		var name = $btn.attr('code');
		this.recorderDialog.show(name);
	},
	saveButtonIr : function (data) {
		console.log(data);
		data.remoteId = this.model.get("switchID"); // in device irRemotes switchId is the remoteId
		this.options.socket.emit("editRemoteIrCode", data, _.bind(function(err){console.log(err);this.checkButtonList();}, this));
	}
});

IrEditProxy = BaseView.extend({
	templateSelector:"#irRemoteEditProxyTemplate",
	_getJsonToRenderTemplate : function () {return this.model;},
	events: {
		"tap .editIrRemote"  : "_editIrRemote",
		"tap .deleteIrRemote"  : "_deleteIrRemote"
	},
	_editIrRemote : function () {
		var model = _.omit(JSON.parse(JSON.stringify(this.model)), "id");
		console.log(this.model);
		model = new SwitchModel(_.extend({'irBlasterId':'HcIrBlaster', 'switchID':this.model.id}, model));
		model.on('change', _.bind(function(model){
			this.model = _.extend(this.model, model.changed);//this.model is simple object
			this.repaint();
		}, this));
		model.ioSocket = this.options.socket;
		this.options.remoteEditViewer.showFeed(model);
	},
	_deleteIrRemote : function () {
		console.log("delete remote with id", this.model.id);
		this.options.socket.emit("deleteIrRemote", {'remoteId':this.model.id}, function(err, msg){
			err && console.log(err);
			if(msg && msg.success) location.reload();
		});
	}
});


IRSettingPage = BaseView.extend({
	templateSelector:"#iRSettingTemplate",
	subViewArrays : [{'viewClassName':'IrEditProxy', 'reference':'proxyViewArray', 'parentSelector':'.irRemProxyCont', 'eval':['socket=this.options.socket', 'remoteEditViewer=this.remoteEditViewer'], 'array':'_.where(_.values(this.options.deviceCollection.where({"id":"irRemotes"})[0].get("loadInfo")), {"editable":true})','createOnRender':true}],
	initialize : function (obj) {
		this.remoteEditViewer = new RemoteEditViewer({'el':$("#remoteEditorCont"), 'socket':this.options.socket, 'deviceCollection':this.options.deviceCollection});
		return 	BaseView.prototype.initialize.apply(this, arguments);
	},
	events : {
		"tap .addRemoteButton" : "_addNewRemote"
	},
	render : function () {
		!this.remoteEditViewer.rendered && this.remoteEditViewer.render();
		return 	BaseView.prototype.render.apply(this, arguments);
	},
	_addNewRemote	: function() {
		console.log("Add Ir Remote called");
		this.options.socket.emit("createIrRemote", _.bind(function(err, data){
			if(err)return console.log(err);
			console.log(data);
			if(data && data.id && data.icon && data.name) {
				var obj = this.options.deviceCollection.where({"id":"irRemotes"})[0].get("loadInfo");
				obj[data.id] = {"devId":"irRemotes","editable":true,"icon":data.icon,"id":data.id, "name":data.name, "type":"irRem"};
				this.repaint();
			}
		}, this));
		// var indx = "" + (1 + _.max(_.map(_.keys(obj), function(i){return parseInt(i)})));
		// obj[indx] = {"devId":"irRemotes","editable":true,"icon":"remote_default","id":0, "name":"no name", "type":"irRem"};
		// this.repaint();
	}
});

