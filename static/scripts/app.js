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
			ioSockets[primeIp].emit("checkConfigurations")
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
		setInterval(function () {if(Date.now()-pingTimeStamp < 8000)return; location.reload();}, 1000);
	}
};
var setAppTheamColor = function (appTheme, themeColor) {
		/*<!-Orange - #EE972D; green - #69C1A8; blue-#5ED5F3; red-#9E171D->*/
		if(typeof themeColor == 'undefined') themeColor = 'Orange';
		if(typeof appTheam == 'undefined') appTheam = 'Clasic';
		appTheam = appTheam.toLowerCase();
		themeColor = themeColor.toLowerCase();
		switch(themeColor) { // if you modify color here modify it in website.js as well as it sends the color to android or Iphone app.
			case "orange" : var color = (appTheam=='maze')?"#CE771D":"#EE972D", brightColor = (appTheam=='maze')?'#F3CBCB':"#EE972D", traprntColor = "96,20,31", inputColor=(appTheam=='maze')?'#E7CDB0':color; break;
			case "red"	  : var color = (appTheam=='maze')?"#832A28":"#9E171D", brightColor = (appTheam=='maze')?'#F3CBCB':"#9E171D", traprntColor = "96,20,31", inputColor=(appTheam=='maze')?'#A58F8F':color; break;
			case "blue"   : var color = (appTheam=='maze')?'#42487B':"#5EA5F3", brightColor = (appTheam=='maze')?'#93CBEB':"#5EA5F3", traprntColor = "26,20,50", inputColor=(appTheam=='maze')?'#758FAF':color; break;
			case "green"  : var color = (appTheam=='maze')?'#406E38':"#69C1A8", brightColor = (appTheam=='maze')?'#E3DBCB':"#69C1A8", traprntColor = "56,72,50", inputColor=(appTheam=='maze')?'#95AF8F':color; break;
		}

		var $sheet = $("<style>\
	hr {\
		border-top-color: "+color+";\
		border-bottom-color: "+((appTheam=='maze')?brightColor:"white")+";\
	}\
	.whiteBG{background-color: white;}\
	.whiteBorderColor{border-color:white;}\
	input[type='range']::-webkit-slider-thumb, input[type='radio']:checked:after{background-color: "+inputColor+";}\
	.theamBGColor{background-color: "+color+";}\
	.brightBGColor{background-color: "+brightColor+";}\
	.appThemeMaze #ipCamaraFeedViewerCont .popupPannel, .appThemeMaze .onBackdrop > .basicSwitchTemplate {background-color: "+color+";}\
	.theamTextColor{color:"+inputColor+";}\
	input[type=radio], .theamBorderColor{border-color:"+inputColor+";}\
	select, input[type=password], input[type=text], textarea \
	{border-color:"+inputColor+((appTheam=="maze")?(";background-color:"+inputColor):"")+";}\
	.brightBorderColor{border-color:"+brightColor+";}\
	#bgImageCont{background-image: url('/static/images/backgrounds/app_2_2x_"+themeColor+".png');}\
	.translucentBg45 {background-color: rgba("+traprntColor+",0.45);}\
	.translucentBdr45 {border-color: rgba("+traprntColor+",0.45);}\
	#groupTitleHeaderForTrapTheam{border-bottom-color:rgba("+traprntColor+",0.45);}\
	.brightColor {color:"+brightColor+";}\
	</style>");
		$('body').append($sheet);	
}
var servedFromCloud = false, useSockets=servedFromCloud||true;

//setAppTheamColor();
var primeIndx=0;
var ioSockets=[], pingTimeStamp = Date.now();
hashChanged = function (hash) {
	if(!window.location.hash) return;
	var removeHash = false;
	switch(window.location.hash) {
		case '#updatenow'				: 	ioSockets[primeIndx].emit('updateNow');removeHash=true;break;
		case '#restorenetwork'			: 	ioSockets[primeIndx].emit('restoreNetwork');removeHash=true;break;
		case '#restartinoho'			: 	ioSockets[primeIndx].emit('restartHomeController');removeHash=true;break;
		case '#configurecloudtunnel'	: 	ioSockets[primeIndx].emit('configureCloudTunnel');removeHash=true;break;
		case '#restartzigbee'			: 	ioSockets[primeIndx].emit('restartZigbee');removeHash=true;break;
		case '#startcloudlogs'			: 	ioSockets[primeIndx].emit('startCloudLogs');removeHash=true;break;
		case '#stopcloudlogs'			: 	ioSockets[primeIndx].emit('stopCloudLogs');removeHash=true;break;
		case '#restorefactorysetting'	: 	if(confirm("Are you sure you wanna restore factory setting?")){
												ioSockets[primeIndx].emit('restoreFactory', function (rsp) {
													if(!rsp.success) alert(rsp.msg);
												});
											};removeHash=true;break;

		case '#shownetworksettings'		:	sideMenu.switchPage('networkSettingPage');break;
		case '#showfilereader'			:	sideMenu.switchPage('fileReaderPage');break;
		case '#showcommandposter'		:	sideMenu.switchPage('commandPosterPage');break;


	}
	if(removeHash)window.location.hash = '';
};
var connectSocket = function (ip, idx, callback) {
	ioSockets[idx] = io.connect('/', {path: '/ip/'+ip+'/socket.io'});
	console.log(idx, ip, ioSockets[idx].id);
	ioSockets[idx].on('connect', function(){console.log(idx, ip, ioSockets[idx].id);if(callback)callback();});
	ioSockets[idx].on('connect', showBurgerMenu);
	ioSockets[idx].on('log', function(data) {console.log('Recieved from server to log', data, new Date() - d)});
	ioSockets[idx].on('roomConfigUpdated', function (config) {
		if(!_.isObject(config)) config = JSON.parse(JXG.decompress(config));
		gCs[idx].set(config, {merge: true, remove: false});
	});
	ioSockets[idx].on('deleteGroup', function (groupId) {
		if(!groupId) return;
		gCs[idx].remove(gCs[idx].get(groupId));
	});
	ioSockets[idx].on('onDeviceUpdate', function (config) {
		if(!_.isObject(config)) config = JSON.parse(JXG.decompress(config));
		dCs[idx].set(config, {merge: true, remove: false});
	});
	ioSockets[idx].on('moodConfigUpdate', function (config) {
		if(!_.isObject(config)) config = JSON.parse(JXG.decompress(config));
		mCs[idx].set(config, {merge: true, remove: false});
	});
	ioSockets[idx].on('deleteMood', function (moodId) {
		if(!moodId) return;
		mCs[idx].remove(mCs[idx].get(moodId));
	});
	ioSockets[idx].on('noHomeControllerPresent', function () {
		sideMenu.switchPage('homeControllerDownPage');
		$('#appLoadingVeil').hide();
	});
	ioSockets[idx].on('sudoHeartbeat', function () {pingTimeStamp = Date.now();});
	ioSockets[idx].on('switchPage', configurationWorkFlow);
	ioSockets[idx].on('homeControllerLocalIpAddress', function (add) {
		var arr = window.location.href.split("/");
		if(arr[2] == add) return;
		$.ajax({crossDomain: true,dataType: "jsonp",
			"url":"http://"+add+"/apptest", success:function (rsp){
			if(rsp && rsp.success) window.location.href="http://"+add
		}});
	});
};
var setTheme = function () {
	ioSockets[primeIndx].emit('getThemeSettings', {}, function (rsp) {
		setAppTheamColor(rsp.data.appTheme, rsp.data.appColor);
	});
}
_.each(localIpArr, function(ip, indx){connectSocket(ip, indx, (indx == primeIndx)?setTheme:null);})

var sideMenu = new SideMenuView({'el':$("#sideMenuCont")});
sideMenu.on('hideMe', function () {$('#burgerImageCont').trigger('tap')});
sideMenu.render();
var backboneAjax = Backbone.ajax;
var d = new Date();
Backbone.ajax = function (obj) {
	var success = obj.success;
	obj.success = function (data) {
		console.log(obj.url, new Date()-d);
		if(!_.isObject(data)){
			try {
				data = JSON.parse(data)	
			}
			catch (err) {
				data = JSON.parse(JXG.decompress(data))
			}
		}
		arguments[0] = data;
		success.apply(this, arguments);
	}
	obj.headers = {"Content-Encoding": "gzip"};
    obj.dataType = 'text';
	if(!obj.useSocket) return backboneAjax.apply(this, arguments);
	obj.socket.emit(obj.url, obj.data, obj.success);
}
var CustomCollection = Backbone.Collection.extend({
	initialize: function() {
		Backbone.Collection.prototype.initialize.apply(this, arguments);
		this.on('add', function (model) {
			model.ioSocket = model.collection.ioSocket;
		}, this);
		return this;
	}
})
var RoomCollection = CustomCollection.extend({
	url: '/group/list',
	model:RoomModel,
	initialize: function() {
		CustomCollection.prototype.initialize.apply(this, arguments);
		this.on('add', function (roomModel) {
			dCs[primeIndx].each(function (model, idx){model.set('name', 'Module-'+(idx+1));});
		}, this);
		return this;
	},
	comparator:function (model) {return parseInt(model.get('rank'));}
});
var DeviceCollection = CustomCollection.extend({
	url: '/device/list'
});
var MoodCollection = CustomCollection.extend({
	url: '/mood/list',
	model:BaseModel,
	initialize: function() {
		CustomCollection.prototype.initialize.apply(this, arguments);
		this.on("add", function(roomModel){
			roomModel.on('change', function (model, data) {console.log("change called on "+model.get('name'));console.log(model);});
			(gCs[primeIndx].models.length<5 || fixMoodStrip) && (fixMoodStrip=true) && clearTimeout(hideMoodStripTimer);
		});
		return this;
	},
	comparator:function (model) {return parseInt(model.get('rank'));}
});

var fetchCount = 0;
var fetchComplete = function () {
	if(++fetchCount == 3)setTimeout(function () {
		$('#appLoadingVeil').hide();
		console.log('Veil lifted at:', new Date()-d);
	}, 200);
};

var gCs=[], dCs=[], mCs=[];
_.each(localIpArr, function(ip, idx){

	(gCs[idx] = new RoomCollection()).ioSocket=ioSockets[idx];
	(dCs[idx] = new DeviceCollection()).ioSocket=ioSockets[idx];
	(mCs[idx] = new MoodCollection()).ioSocket=ioSockets[idx];

	dCs[idx].fetch({update:true, remove: false, useSocket:useSockets, success:fetchComplete, socket:ioSockets[idx]});
	mCs[idx].fetch({update:true, remove: false, useSocket:useSockets, success:fetchComplete, socket:ioSockets[idx]});
	gCs[idx].fetch({update:true, remove: false, useSocket:useSockets, success:fetchComplete, socket:ioSockets[idx]});

})


if($('body').attr('homeView')=='list')
	var mainPageView = new MainPageView({'collections':gCs});
else 
	var mainPageView = new GroupProxyMainPageView({'collections':gCs, 'moodCollections':mCs});

var moodStrip = mainPageView.moodStrip = new MoodStripView({'collections':mCs, 'el':$('.moodWidgetArea')});
$('#appCont').append(mainPageView.$el);
mainPageView.render();


sideMenu.currentPage = mainPageView;
var editPageView = new EditPageView({'collections':gCs, 'deviceCollections':dCs});
$('#appCont').append(editPageView.$el);
// editPageView.render();
// sideMenu.currentPage = editPageView;
var editMoodView = new EditMoodPageView({'collections':mCs, 'deviceCollections':dCs, 'groupCollections':gCs});
$('#appCont').append(editMoodView.$el);
var configureModulePage = new ConfigureNewModuleView({socket:ioSockets[primeIndx], gC:gCs[primeIndx]});
$('#appCont').append(configureModulePage.$el);
var cloudSettingPage = new CloudSettingPageView({socket:ioSockets[primeIndx]});
$('#appCont').append(cloudSettingPage.$el);
var themeSettingPage = new ThemeSettingPageView({socket:ioSockets[primeIndx]});
$('#appCont').append(themeSettingPage.$el);
var networkSettingPage = new NetworkSettingPageView({socket:ioSockets[primeIndx]});
$('#appCont').append(networkSettingPage.$el);
var welcomeScreenPage = new WelcomeScreenPageView({socket:ioSockets[primeIndx]});
$('#appCont').append(welcomeScreenPage.$el);
var checkUpdatePage = new CheckUpdatePageView({socket:ioSockets[primeIndx]});
$('#appCont').append(checkUpdatePage.$el);
var fileReaderPage = new FileReaderPageView({socket:ioSockets[primeIndx]});
$('#appCont').append(fileReaderPage.$el);
var commandPosterPage = new CommandPosterPageView({socket:ioSockets[primeIndx]});
$('#appCont').append(commandPosterPage.$el);
var HomeControllerDownPageView = BaseView.extend({
	templateSelector:"#homeControllerDownTemplate"
});
var homeControllerDownPage = new HomeControllerDownPageView();
$('#appCont').append(homeControllerDownPage.$el);

var ipCamaraFeedViewer = new IpCamaraFeedViewer({'el':$("#ipCamaraFeedViewerCont")});
ipCamaraFeedViewer.render();

