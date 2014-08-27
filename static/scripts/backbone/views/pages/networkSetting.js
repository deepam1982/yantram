
NetworkSettingPageView = BaseView.extend({
	templateSelector:"#networkSettingTemplate",
	events: {
		"tap #modifyNwkSecKeyButton" : "_onDone"
	},
	onDone : function (rsp) {
		$('#menuCont .mainPannel').trigger('tap');		
	},
	_onDone : function (event) {
		var networkName = this.$el.find('.nwkSecKey').val();
		if(!networkName) {
			this.$el.find('.errorMsgDiv span').html("Enter network name in the first row.");
			this.$el.find('.errorMsgDiv').show();
			return;			
		}
		var securityKey = this.$el.find('.nwkSecKey').val();
		var confirmKey = this.$el.find('.nwkSecKeyCnf').val();
		if(!securityKey || securityKey != confirmKey) {
			this.$el.find('.errorMsgDiv span').html("Enter securety key in second row and then re-enter same key in third row.");
			this.$el.find('.errorMsgDiv').show();
			return;
		}
		securityKey = hex_md5(securityKey);
		if(confirm("Modifying this key will require reconfiguration of all the switch board modules. Are you sure you want to modify security key?"))
			this.modify(networkName, securityKey);
	},
	modify : function (networkName, securityKey) {
		this.options.socket.emit("modifyNetworkSecurityKey", {"securityKey":securityKey, "networkName":networkName}, _.bind(function (rsp) {
			if(!rsp.success) {
				this.$el.find('.errorMsgDiv span').html(rsp.msg);
				this.$el.find('.errorMsgDiv').show();
				return;
			}
			this.onDone();
		}, this));
	}


});