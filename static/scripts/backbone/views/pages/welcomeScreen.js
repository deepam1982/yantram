
WelcomeScreenPageView = BaseView.extend({
	templateSelector:"#welcomeScreenTemplate",
	events: {
		"tap #startConfigurationButton" : "start"
	},
	start : function (rsp) {
		$('#menuCont .nwkStng').trigger('tap');		
	}
});