var hashChanged = function () {console.log('Hash Changed!!')};
if ("onhashchange" in window) { // event supported?
	window.onhashchange = function () {hashChanged(window.location.hash);}
}
else { // event not supported:
	var storedHash = window.location.hash;
	window.setInterval(function () {(window.location.hash != storedHash) && (storedHash = window.location.hash) && hashChanged(storedHash);}, 500);
}
$('#burgerImageCont').on('tap', function () {
	var $menuContPar = $('#menuCont').parent();
	var $appContPar = $('#appCont').parent();
	if($menuContPar.css('display') == 'block') {
		$menuContPar.hide();
//		$appContPar.css('width', '100%');
	}
	else {
		$menuContPar.show();
//		$appContPar.css('width', '62%');				
	}
});
fixMoodStrip = false; //true; //false;
lastScrollTop=0;
hideMoodStrip = function () {
	if($(document).height() - $(window).height() - $(window).scrollTop() > $('.footer').height())
		$('.footer').animate({'bottom':-parseInt($('.footer').height())}, 300);
};
hideMoodStripTimer = setTimeout(hideMoodStrip, 5000);
$(window).scroll(function (){
	if(fixMoodStrip || !moodStrip || !moodStrip.rendered) return ;//hideMoodStrip();
	hideMoodStripTimer && clearTimeout(hideMoodStripTimer);
	hideMoodStripTimer = setTimeout(hideMoodStrip, 5000);
	var curScrollTop = $(window).scrollTop(), delta = curScrollTop-lastScrollTop;
	var ftrBtmPos = parseInt($('.footer').css('bottom'), 10)+delta;
	ftrBtmPos = Math.min(0, Math.max(ftrBtmPos, -parseInt($('.footer').height(), 10)));
	$('.footer').css('bottom', ftrBtmPos+'px');
	lastScrollTop=curScrollTop;
});

//	  setInterval(function () {$('#experiment').html(Date().substr(16,8));} , 1000)
var configurationWorkFlow = function (pageName) {
	var pageObjName;
	switch(pageName) {
		case "welcomeScreen" : pageObjName = 'welcomeScreenPage'; break;
		case "networkSetting" : pageObjName = 'networkSettingPage'; break;
		case "cloudSetting" : pageObjName = 'cloudSettingPage'; break;
		case "configureModule" : pageObjName = 'configureModulePage'; break;
	}
	if(pageObjName) {
		$('.hideWhileConfigureFlow').hide();
		sideMenu.switchPage(pageObjName);
		try {window[pageObjName].forIntalonFlow();}catch(err){}
		window[pageObjName].onDone = function () {
			$('.hideWhileConfigureFlow').show();
			ioSocket.emit("checkConfigurations")
		};
	}
	else 
		sideMenu.switchPage('mainPageView');
}
var showBurgerMenu = function () {
	$('#burgerImageCont').show();
	if(servedFromCloud) {
		$('.nwkStng, .cldStng, .cnfrMdl, .chkUpdt').hide();
	}else {
		$('.logout').hide();
		setInterval(function () {if(Date.now()-pingTimeStamp < 8000)return; location.reload();}, 1000);
	}
};
var setAppTheamColor = function (appTheme, themeColor) {
		/*<!-Orange - #EE972D; green - #69C1A8; blue-#5ED5F3; red-#9E171D->*/
		if(typeof themeColor == 'undefined') themeColor = 'Orange';
		if(typeof appTheam == 'undefined') appTheam = 'Clasic';
		appTheam = appTheam.toLowerCase();
		themeColor = themeColor.toLowerCase();
		switch(themeColor) {
			case "orange" : var color = (appTheam=='maze')?"#CE771D":"#EE972D", brightColor = (appTheam=='maze')?'#F3CBCB':"#EE972D", traprntColor = "96,20,31", inputColor=(appTheam=='maze')?'#E7CDB0':color; break;
			case "red"	  : var color = (appTheam=='maze')?"#832A28":"#9E171D", brightColor = (appTheam=='maze')?'#F3CBCB':"#9E171D", traprntColor = "96,20,31", inputColor=(appTheam=='maze')?'#A58F8F':color; break;
			case "blue"   : var color = (appTheam=='maze')?'#42487B':"#5EA5F3", brightColor = (appTheam=='maze')?'#93CBEB':"#5EA5F3", traprntColor = "26,20,50", inputColor=(appTheam=='maze')?'#758FAF':color; break;
			case "green"  : var color = (appTheam=='maze')?'#406E38':"#69C1A8", brightColor = (appTheam=='maze')?'#E3DBCB':"#69C1A8", traprntColor = "56,72,50", inputColor=(appTheam=='maze')?'#95AF8F':color; break;
		}

		color=(servedFromCloud)?"#69C1A8":color;
		inputColor=(servedFromCloud)?"#69C1A8":inputColor;

		
//		inputColor=(servedFromCloud)?"#69C1A8":(appTheam == "Maze")?"#A58F8F":"#EE972D;";
		var $sheet = $("<style>\
	hr {\
		border-top-color: "+color+"\
	}\
	.whiteBG{background-color: white;}\
	.whiteBorderColor{border-color:white;}\
	input[type='range']::-webkit-slider-thumb, input[type='radio']:checked:after{background-color: "+inputColor+";}\
	.theamBGColor{background-color: "+color+";}\
	.appThemeMaze .onBackdrop .basicSwitchTemplate {background-color: "+color+";}\
	.theamTextColor{color:"+inputColor+";}\
	input[type=password], input[type=text], input[type=radio], textarea, .theamBorderColor{border-color:"+inputColor+";}\
	#bgImageCont{background-image: url('/static/images/backgrounds/app_2_2x_"+themeColor+".png');}\
	.translucentBg45 {background-color: rgba("+traprntColor+",0.45);}\
	#groupTitleHeaderForTrapTheam{border-bottom-color:rgba("+traprntColor+",0.45);}\
	.brightColor {color:"+brightColor+";}\
	</style>");
		$('body').append($sheet);	
}
var servedFromCloud = false;
//setAppTheamColor();
var ioSocket, pingTimeStamp = Date.now();
hashChanged = function (hash) {
	if(!window.location.hash) return;
	var removeHash = false;
	switch(window.location.hash) {
		case '#updatenow'				: 	ioSocket.emit('updateNow');removeHash=true;break;
		case '#restorenetwork'			: 	ioSocket.emit('restoreNetwork');removeHash=true;break;
		case '#restartinoho'			: 	ioSocket.emit('restartHomeController');removeHash=true;break;
		case '#restartzigbee'			: 	ioSocket.emit('restartZigbee');removeHash=true;break;
		case '#startcloudlogs'			: 	ioSocket.emit('startCloudLogs');removeHash=true;break;
		case '#stopcloudlogs'			: 	ioSocket.emit('stopCloudLogs');removeHash=true;break;
		case '#restorefactorysetting'	: 	if(confirm("Are you sure you wanna restore factory setting?")){
												ioSocket.emit('restoreFactory', function (rsp) {
													if(!rsp.success) alert(rsp.msg);
												});
											};removeHash=true;break;

		case '#shownetworksettings'		:	sideMenu.switchPage('networkSettingPage');break;
		case '#showfilereader'			:	sideMenu.switchPage('fileReaderPage');break;
		case '#showcommandposter'		:	sideMenu.switchPage('commandPosterPage');break;


	}
	if(removeHash)window.location.hash = '';
};
var connectSocket = function (callback) {
		ioSocket = io.connect((servedFromCloud)?'/client':'/' //, {transports: ['websocket']}
			);
		if(callback) ioSocket.on('connect', callback);
		ioSocket.on('connect', showBurgerMenu);
		ioSocket.on('log', function(data) {console.log('Recieved from server to log', data, new Date() - d)});
		ioSocket.on('roomConfigUpdated', function (config) {
		gC.set(config, {merge: true, remove: false});
	});
	ioSocket.on('deleteGroup', function (groupId) {
		if(!groupId) return;
		gC.remove(gC.get(groupId));
	});
	ioSocket.on('onDeviceUpdate', function (config) {
		dC.set(config, {merge: true, remove: false});
	});
	ioSocket.on('moodConfigUpdate', function (config) {
		mC.set(config, {merge: true, remove: false});
	});
	ioSocket.on('deleteMood', function (moodId) {
		if(!moodId) return;
		mC.remove(mC.get(moodId));
	});
	ioSocket.on('noHomeControllerPresent', function () {
		sideMenu.switchPage('homeControllerDownPage');
		$('#appLoadingVeil').hide();
	});
	ioSocket.on('sudoHeartbeat', function () {pingTimeStamp = Date.now();});
	ioSocket.on('switchPage', configurationWorkFlow);
	ioSocket.on('homeControllerLocalIpAddress', function (add) {
		var arr = window.location.href.split("/");
		if(arr[2] == add) return;
		$.ajax({crossDomain: true,dataType: "jsonp",
			"url":"http://"+add+"/apptest", success:function (rsp){
			if(rsp && rsp.success) window.location.href="http://"+add
		}});
	});
};
var setTheme = function () {
	ioSocket.emit('getThemeSettings', {}, function (rsp) {
		setAppTheamColor(rsp.data.appTheme, rsp.data.appColor);
	});
}
connectSocket(setTheme);
var sideMenu = new SideMenuView({'el':$("#sideMenuCont")});
sideMenu.on('hideMe', function () {$('#burgerImageCont').trigger('tap')});
sideMenu.render();
var backboneAjax = Backbone.ajax;
var d = new Date();
Backbone.ajax = function (obj) {
	var success = obj.success;
	obj.success = function (data) {
		console.log(obj.url, new Date()-d);
		success.apply(this, arguments);
	}
	if(!obj.useSocket) return backboneAjax.apply(this, arguments);
	ioSocket.emit(obj.url, obj.data, obj.success);
}
var RoomCollection = Backbone.Collection.extend({
	url: '/group/list',
	model:RoomModel
});
var DeviceCollection = Backbone.Collection.extend({
	url: '/device/list'
});
var MoodCollection = Backbone.Collection.extend({
	url: '/mood/list',
	model:BaseModel
});
var gC = new RoomCollection();
var dC = new DeviceCollection();
var mC = new MoodCollection();
gC.comparator = function (model) {return parseInt(model.get('rank'));};
mC.comparator = function (model) {return parseInt(model.get('rank'));};

dC.on('add', function () {dC.each(function (model, idx){model.set('name', 'Module-'+(idx+1));});});

gC.on("add", function(roomModel){
	roomModel.on('change', function (model, data) {
		console.log("change called on "+model.get('name'));
		console.log(model);
	});
	(gC.models.length<5 || fixMoodStrip) && (fixMoodStrip=true) && clearTimeout(hideMoodStripTimer);
})
//		gC.on("sort", function () {console.log(gC.pluck('name'));});
//		mC.on("add", function(model){console.log(model);})
// gc should follow dc and mc ... others wise page takes longer to load.
var fetchCount = 0;
var fetchComplete = function () {
	if(++fetchCount == 3)setTimeout(function () {
		$('#appLoadingVeil').hide();
		console.log('Veil lifted at:', new Date()-d);
	}, 200);
};
dC.fetch({update:true, remove: false, useSocket:servedFromCloud, success:fetchComplete});
mC.fetch({update:true, remove: false, useSocket:servedFromCloud, success:fetchComplete});
gC.fetch({update:true, remove: false, useSocket:servedFromCloud, success:fetchComplete});

deviceCollection = dC;
var mainPageView = new MainPageView({'collection':gC});
var moodStrip = mainPageView.moodStrip = new MoodStripView({'collection':mC, 'el':$('.moodWidgetArea')});
$('#appCont').append(mainPageView.$el);
mainPageView.render();
sideMenu.currentPage = mainPageView;
var editPageView = new EditPageView({'collection':gC});
$('#appCont').append(editPageView.$el);
// editPageView.render();
// sideMenu.currentPage = editPageView;
var editMoodView = new EditMoodPageView({'collection':mC});
$('#appCont').append(editMoodView.$el);
var configureModulePage = new ConfigureNewModuleView({socket:ioSocket});
$('#appCont').append(configureModulePage.$el);
var cloudSettingPage = new CloudSettingPageView({socket:ioSocket});
$('#appCont').append(cloudSettingPage.$el);
var themeSettingPage = new ThemeSettingPageView({socket:ioSocket});
$('#appCont').append(themeSettingPage.$el);
var networkSettingPage = new NetworkSettingPageView({socket:ioSocket});
$('#appCont').append(networkSettingPage.$el);
var welcomeScreenPage = new WelcomeScreenPageView({socket:ioSocket});
$('#appCont').append(welcomeScreenPage.$el);
var checkUpdatePage = new CheckUpdatePageView({socket:ioSocket});
$('#appCont').append(checkUpdatePage.$el);
var fileReaderPage = new FileReaderPageView({socket:ioSocket});
$('#appCont').append(fileReaderPage.$el);
var commandPosterPage = new CommandPosterPageView({socket:ioSocket});
$('#appCont').append(commandPosterPage.$el);
var HomeControllerDownPageView = BaseView.extend({
	templateSelector:"#homeControllerDownTemplate"
});
var homeControllerDownPage = new HomeControllerDownPageView();
$('#appCont').append(homeControllerDownPage.$el);
