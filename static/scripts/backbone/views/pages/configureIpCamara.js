ConfigureIpCamaraView = BaseView.extend({
	templateSelector:"#configureIPCamaraTemplate",
	name : 'ConfigureIpCamaraView',
	events : {
		"tap .showMoreCams" : 'toggleCamList',
		"tap #submitCamData" : 'submit',
		"tap .camDropDown .camTab" : 'changeFormData'
	},
	render : function () {
		this.options.socket.emit("getIpCamaraData", _.bind(function (res) {
			if(!res.success) return alert(res.msg);
			this._populateCamList(res.data);
		}, this));
		return BaseView.prototype.render.apply(this, arguments);
	},
	changeFormData : function (event) {
		this.$el.find('.errorMsg').html("");
		var obj = JSON.parse($(event.target).closest('.camTab').attr("camObj") || "{}");
		this.toggleCamList();
		this.$el.find('#camMetaData #cameraId').val(obj.id);
		this.$el.find('#camMetaData #cameraName').val(obj.name);
		this.$el.find('#camMetaData #camaraIp').val(obj.ip);
		this.$el.find('#camMetaData #videoPath').val(obj.videoPath);
		this.$el.find('#camMetaData #userName').val(obj.userName);
		this.$el.find('#camMetaData #password').val(obj.password);
		this.$el.find('.currentCam').html(obj.name || "Add New");
	},
	_populateCamList : function (data) {
		this.$el.find('.errorMsg').html("");
		this.$el.find('.currentCam').html("Add New");
		this.$el.find('.camDropDown .camTab').remove();
		_.each(data, function(obj, id) {
			obj.id = id;
			this.$el.find('.camDropDown').append($("<div class='camTab' camObj='"+JSON.stringify(obj)+"'>"+obj.name+"</div>"))
		}, this);
		this.$el.find('.camDropDown').append($("<div class='camTab'>Add New</div>"))
	},
	toggleCamList : function() {
		var $list = this.$el.find('.camDropDown');
		if($list.is(':visible')) $list.hide();
		else $list.show();
	},
	submit : function () {
		this.$el.find('.errorMsg').html("");
		var obj = {};
		obj.id 			= this.$el.find('#cameraId').val();
		obj.name		= this.$el.find('#cameraName').val();
		obj.ip			= this.$el.find('#camaraIp').val();
		obj.videoPath	= this.$el.find('#videoPath').val();
		obj.userName	= this.$el.find('#userName').val();
		obj.password	= this.$el.find('#password').val();
		//TODO valid field value check 
		this.$el.find('.errorMsg').html("Saving parameters ...");
		this.options.socket.emit("editIpCamaraData", obj, _.bind(function (res) {
			console.log(res);
			if(!res.success) return this.$el.find('.errorMsg').html(res.msg);
			this.$el.find('.errorMsg').html("Ip camera parameters saved.");
			setTimeout(_.bind(function() {this.$el.find('.errorMsg').html("");}, this), 3000)
		}, this));
	}

})

