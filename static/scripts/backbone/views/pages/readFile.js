FileReaderPageView = BaseView.extend({
	templateSelector:"#fileReaderTemplate",
	initialize: function(obj) {
		obj.socket.on("fileContentStream", _.bind(this.onFileData, this));
		return BaseView.prototype.initialize.apply(this, arguments);
	},
	events: {
		"tap #submitFilePath" : "onSubmit",
	},
	onSubmit: function () {
		var filePath = this.$el.find('#filePath').val();
		console.log(filePath);
		$(this.$el.find('.fileContentArea')[0]).html("");
		this.timeStamp = (new Date()).getTime();
		this.options.socket.emit("fetchFile", {'fileName':filePath, 'token':this.timeStamp})
	},
	onFileData : function (obj) {
		console.log(obj);
		if (obj.token != this.timeStamp) return;
		$(this.$el.find('.fileContentArea')[0]).append(obj.data.replace(/\n/g, "<br/>"));
	}
});

