
WelcomeScreenPageView = BaseView.extend({
	templateSelector:"#welcomeScreenTemplate",
	events: {
		"tap #startConfigurationButton" : "start"
	},
	start : function (rsp) {
		configurationWorkFlow('networkSetting');
//		$('#menuCont .nwkStng').trigger('tap');		
	}
});