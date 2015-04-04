
ConfigureNewModuleView = BaseView.extend({
	templateSelector:"#addNewModuleTemplate",
	events: {
		"tap .moduleNotAttached #retryButton" : "tryCommunication",
		"tap .moduleAttached #configureNewModuleButton" : "configureModule",
		"tap .connectedConfigDone #configMore" : "configureMore",
		"tap .connectedConfigDone #configDone" : "doneConfiguration"
	},
	doneConfiguration : function () {
//		$('#menuCont .mainPannel').trigger('tap');
//		refresh the page instead.
		window.location.href = '/';
	},
	configureMore : function () {
		this._removeGroupViews();
		this.$el.find('.configuredModuleDisplay').hide()
		this.$el.find(".connectedConfigDone").hide();
		var $mdlNtAtch = this.$el.find('.moduleNotAttached').show();
		$mdlNtAtch.find('.connectModuleMsg').show();
		$mdlNtAtch.find('.retryMsg').hide();
	},
	_removeGroupViews : function () {
		for (var i=0; i<this.groupViewArr.length; i++) {
			this.groupViewArr[i].removeView();
		}
		this.groupViewArr = [];
	},
	_onConfigurationConfirmation : function (model) {
		if (model.changed && typeof model.changed.disabledCtls != 'undefined' && 
			model._previousAttributes.disabledCtls > model.attributes.disabledCtls) {
				this.$el.find(".connectedConfigDone").show();
				model.off('change', this._onConfigurationConfirmation, this);
		}
	},
	configureModule : function (event) {
		var moduleName = null;
		// moduleName = this.$el.find('.moduleName').val();
		// if(!moduleName) {
		// 	this.$el.find('.errorMsgDiv span').html('Please enter module name.');
		// 	this.$el.find('.errorMsgDiv').show();
		// 	return;
		// }
		// this.$el.find('.moduleAttached').hide();
		this.options.socket.emit("configureConnectedModule", {moduleName:moduleName}, _.bind(function (err, groupIds) {
			//this.$el.find('.moduleAttached').show();
			if(!err) {
				if(typeof groupIds != 'undefined') {
					console.log(groupIds);
					this.groupViewArr = [];
					setTimeout(_.bind(function () {
						this.$el.find('.loader').hide();
						for (var i=0; i<groupIds.length; i++) {
							var grpMdl = gC.get(groupIds[i]);
							grpMdl.on('change', this._onConfigurationConfirmation, this);
							var grpView = new GroupView1({model:grpMdl});
							this.$el.find('.configuredModuleDisplay').show().append(grpView.$el);
							grpView.render();
							this.groupViewArr.push(grpView);
						}
					}, this), 2000);
				}
				return;
			}
			this.$el.find('.loader').hide();
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
		this.$el.find('.loader').show();
		this.options.socket.emit("checkSerialCableConnection", {}, _.bind(function (status) {
			$mdlNtAtch.show();
			if(!status) {
				this.$el.find('.loader').hide();
				$mdlNtAtch.find('.connectModuleMsg').hide();
				$mdlNtAtch.find('.retryMsg').show();
			}
			else {
				$mdlNtAtch.hide();
//				this.$el.find('.moduleAttached').show();
				this.configureModule();
			}
		}, this));
	}

});