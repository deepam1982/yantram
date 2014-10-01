
ConfigureNewModuleView = BaseView.extend({
	templateSelector:"#addNewModuleTemplate",
	events: {
		"tap .moduleNotAttached #retryButton" : "tryCommunication",
		"tap .moduleAttached #configureNewModuleButton" : "configureModule"
	},
	configureModule : function (event) {
		var moduleName = this.$el.find('.moduleName').val();
		if(!moduleName) {
			this.$el.find('.errorMsgDiv span').html('Please enter module name.');
			this.$el.find('.errorMsgDiv').show();
			return;
		}
		this.$el.find('.moduleAttached').hide();
		this.options.socket.emit("configureConnectedModule", {moduleName:moduleName}, _.bind(function (err) {
			this.$el.find('.moduleAttached').show();
			if(!err) {
				$('#menuCont .mainPannel').trigger('tap');
				return
			}
			if (err == 'noConnect') {
				this.$el.find('.moduleAttached').hide();
				this.$el.find('.moduleNotAttached').show();
				return;
			}
			this.$el.find('.errorMsgDiv span').html(err);
			this.$el.find('.errorMsgDiv').show();
		}, this));
	},
	tryCommunication : function (event) {
		var $mdlNtAtch = this.$el.find('.moduleNotAttached');
		$mdlNtAtch.hide();
		this.options.socket.emit("checkSerialCableConnection", {}, _.bind(function (status) {
			$mdlNtAtch.show();
			if(!status) {
				$mdlNtAtch.find('.connectModuleMsg').hide();
				$mdlNtAtch.find('.retryMsg').show();
			}
			else {
				$mdlNtAtch.hide();
				this.$el.find('.moduleAttached').show();
			}
		}, this));
	}

});