ThemeSettingPageView = BaseView.extend({
	templateSelector:"#theamSettingTemplate",
	_getJsonToRenderTemplate : function () {return {'theams':['Clasic', 'Maze'], 'colors':['Orange','Red','Blue','Green']};},
	events: {
		"tap #applyTheamButton" : "_applyTheam",
		"tap #restartInoho" : "restartInoho",
		"change select" : "onSysSetngChange"
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
	},
	restartInoho : function(){
		this.options.socket.emit('restartHomeController', function(){window.location.reload();});
	},
	onSysSetngChange : function () {
		var sysStngObj = {};
		sysStngObj.restoreWithInMins = this.$el.find(".avoidRestoTime").val()
		try {
			var dlpSltrs = this.$el.find(".dayLightTime select");
			sysStngObj.dLP = _.map($(dlpSltrs[0]).val().split(":").concat($(dlpSltrs[1]).val().split(":")), function(i){return parseInt(i);});
		
			var evpSltrs = this.$el.find(".eveningTime select");
			sysStngObj.evP = _.map($(evpSltrs[0]).val().split(":").concat($(evpSltrs[1]).val().split(":")), function(i){return parseInt(i);});

			var shpSltrs = this.$el.find(".sleepHourTime select");
			sysStngObj.sHP = _.map($(shpSltrs[0]).val().split(":").concat($(shpSltrs[1]).val().split(":")), function(i){return parseInt(i);});
		} catch(e){console.log(e);}
		this.options.socket.emit('modifySystemSettings', sysStngObj);

	}	
});	