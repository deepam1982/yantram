
CloudSettingPageView = BaseView.extend({
	templateSelector:"#cloudSettingTemplate",
		events: {
		"tap #modifyCloudAccountButton" : "_onDone",
		"tap #skipCldSetButton" : "_skipCloudSetting"

	},
	render: function() {
		this.options.socket.emit("getCloudSettings", null, _.bind(function (rsp) {
			if(rsp.email) {
				this.$el.find('.cloudEmail').val(rsp.email);
				this.$el.find('.cloudPwd').val('dummypassword');
				this.$el.find('.cloudPwdCnf').val('dummypassword');
			}
		}, this));
		BaseView.prototype.render.apply(this, arguments);
	},
	forIntalonFlow : function () {
		this.$el.find('#skipCldSetButton').show();
	},
	onDone : function (rsp) {
		$('#menuCont .mainPannel').trigger('tap');		
	},
	_onDone : function (event) {
		var cloudEmail = this.$el.find('.cloudEmail').val();
		var cloudEmailCnf = cloudEmail;//this.$el.find('.cloudEmailCnf').val();
		if(!cloudEmail || cloudEmail != cloudEmailCnf) {
			this.$el.find('.errorMsgDiv span').html("Enter your email in the first row, and then re-enter the same in second row.");
			this.$el.find('.errorMsgDiv').show();
			return;			
		}
		var cloudPwd = this.$el.find('.cloudPwd').val();
		var cloudPwdCnf = this.$el.find('.cloudPwdCnf').val();
		if(cloudPwd == 'dummypassword') return this.onDone();
		if(!cloudPwd || cloudPwd != cloudPwdCnf) {
			this.$el.find('.errorMsgDiv span').html("Enter password in third row, and then re-enter the same in last row.");
			this.$el.find('.errorMsgDiv').show();
			return;
		}
		this.modify(cloudEmail, cloudPwd);
	},
	_skipCloudSetting : function () {
		this.modify('skip');
	},
	modify : function (cloudEmail, cloudPwd) {
		this.$el.hide();
		var $loader = $('<div style="text-align:center;"><img src="static/images/loading.gif"/></div>');
		this.$el.parent().append($loader);
		this.options.socket.emit("modifyCloudSettings", {"email":cloudEmail, "password":cloudPwd}, _.bind(function (rsp) {
			$loader.remove();
			this.$el.show();
			if(!rsp.success) {
				this.$el.find('.errorMsgDiv span').html(rsp.msg);
				this.$el.find('.errorMsgDiv').show();
				return;
			}
			this.onDone();
		}, this));
	}
});