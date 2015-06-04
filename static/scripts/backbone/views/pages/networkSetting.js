
NetworkSettingPageView = BaseView.extend({
	templateSelector:"#networkSettingTemplate",
	events: {
		"tap #modifyNwkSecKeyButton" : "_onDone",
		"tap #skipNwkSecButton" : "_skipConfiguration"
	},
	render: function() {
		this.options.socket.emit("getNetworkSettings", null, _.bind(function (rsp) {
			if(rsp.name) {
				this.$el.find('.nwkSecKey').val('dummypassword');
				this.$el.find('.nwkSecKeyCnf').val('dummypassword');
			}
		}, this));
		BaseView.prototype.render.apply(this, arguments);
	},
	forIntalonFlow : function () {
		this.$el.find('#skipNwkSecButton').show();
	},
	onDone : function (rsp) {
		$('#menuCont .mainPannel').trigger('tap');		
	},
	_onDone : function (event) {
		// var networkName = this.$el.find('.nwkSecKey').val();
		// if(!networkName) {
		// 	this.$el.find('.errorMsgDiv span').html("Enter network name in the first row.");
		// 	this.$el.find('.errorMsgDiv').show();
		// 	return;			
		// }
		var securityKey = this.$el.find('.nwkSecKey').val();
		if(securityKey == 'dummypassword') return this.onDone();
		var confirmKey = this.$el.find('.nwkSecKeyCnf').val();
		if(!securityKey || securityKey != confirmKey) {
			this.$el.find('.errorMsgDiv span').html("Enter network password in first row and then re-enter same key in second row.");
			this.$el.find('.errorMsgDiv').show();
			return;
		}
		var networkName = securityKey;
		securityKey = hex_md5(securityKey);
		if(confirm("Modifying this network password will require reconfiguration of all the switch board modules. Are you sure you want to modify security key?"))
			this.modify(networkName, securityKey);
	},
	_skipConfiguration : function () {
		var securityKey = hex_md5(new Date().getTime()+"");
		console.log(securityKey);
		this.modify('Skip', securityKey);
	},
	modify : function (networkName, securityKey) {
		this.$el.hide();
		var $loader = $('<div style="text-align:center;"><img src="static/images/loading.gif"/></div>');
		this.$el.parent().append($loader);
		this.options.socket.emit("modifyNetworkSecurityKey", {"securityKey":securityKey, "networkName":networkName}, _.bind(function (rsp) {
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