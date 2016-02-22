ThemeSettingPageView = BaseView.extend({
	templateSelector:"#theamSettingTemplate",
	_getJsonToRenderTemplate : function () {return {'theams':['Clasic', 'Maze'], 'colors':['Orange','Red','Blue','Green']};},
	events: {
		"tap #applyTheamButton" : "_applyTheam"
	},
	_applyTheam : function (event) {
		var theamJson = $(this.$el.find('.theamTable input[type="radio"][name="theamColor"]:checked')[0]).val();
		if(!theamJson) return alert('Make a selection.');
		console.log(theamJson);
		theamJson = JSON.parse(theamJson);
		theamJson.homeView = $(this.$el.find('.theamTable input[type="radio"][name="homeView"]:checked')[0]).val();
		this.options.socket.emit("modifyThemeSettings", theamJson, _.bind(function (rsp) {
			location.reload();
		}, this));
	}
});	