
NetworkSettingPageView = BaseView.extend({
	templateSelector:"#networkSettingTemplate",
	initialize: function(obj) {
		BaseView.prototype.initialize.apply(this, arguments);
		this.options.socket.on('modifyNetworkSecurityKeyResponse', _.bind(function (rsp) {
			if(!rsp.success) {
				this.$el.find('.errorMsgDiv span').html(rsp.msg);
				this.$el.find('.errorMsgDiv').show();
				return;
			}
			$('#menuCont .mainPannel').trigger('tap');

		}, this));
    },
	events: {
		"tap #modifyNwkSecKeyButton" : "onDone",
	},
	onDone : function (event) {
		var securityKey = this.$el.find('.nwkSecKey').val();
		var confirmKey = this.$el.find('.nwkSecKeyCnf').val();
		if(!securityKey || securityKey != confirmKey) {
			this.$el.find('.errorMsgDiv span').html("Enter securety key in first row and then re-enter same key in second row.");
			this.$el.find('.errorMsgDiv').show();
			return;
		}
		securityKey = hex_md5(securityKey);
		if(confirm("Modifying this key will require reconfiguration of all the switch board modules. Are you sure you want to modify security key?"))
			this.modifyKey(securityKey);
	},
	modifyKey : function (securityKey) {
		this.options.socket.emit("modifyNetworkSecurityKey", {"securityKey":securityKey});
	}


});