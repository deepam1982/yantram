function remoteStyle1 () {
	return "\
	<style>\
		#singleRemotePannel .buttonBG {\
			height:42px; width:42px; line-height:43px; border-radius: 30px; font-size: 30px; text-align:center;\
			padding:0px; margin:auto; color:white; position:relative; cursor:pointer;}\
		@-moz-document url-prefix() {	#singleRemotePannel .buttonBG { line-height:51px;}}\
		#singleRemotePannel .buttonBG.statePressed {border-radius: 10px;} 	\
		#singleRemotePannel .numberButton {\
			width:33%; float:left; text-align:center;margin:10px 0; }\
		.arrowView {text-align:center; position:relative; width:130px; margin: auto;}\
		.arrowView .absDiv {position:absolute;color:white;}\
		#singleRemotePannel .font20 .buttonBG{font-size: 20px;}\
		#singleRemotePannel .tick{top:-2px;right:-6px; background-color: inherit; display:none;}\
		#singleRemotePannel .maskTransparent{z-index:5}\
	</style>\
	"
}
function miniGenricHtml () {
	return "\
	<div class='smallView'>\
		<div class='leftDiv' style='width:45%; float:left; text-align:center;'>\
			<div class='btn buttonBG theamBGColor' code='KEY_VOLUMEUP'><i class='fa fa-chevron-circle-up'></i><div class='tick'></div><div class='maskTransparent'></div></div>\
			<br/>\
			<span class='theamTextColor font18'>CH-1</span>\
			<br/><br/>\
			<div class='btn buttonBG theamBGColor' code='KEY_VOLUMEDOWN'><i class='fa fa-chevron-circle-down'></i><div class='tick'></div><div class='maskTransparent'></div></div>\
		</div>\
		<div class='rightDiv' style='width:45%; float:right; text-align:center;'>\
			<div class='btn buttonBG theamBGColor' code='KEY_CHANNELUP'><i class='fa fa-chevron-circle-up'></i><div class='tick'></div><div class='maskTransparent'></div></div>\
			<br/>\
			<span class='theamTextColor font18'>CH-2</span>\
			<br/><br/>\
			<div class='btn buttonBG theamBGColor' code='KEY_CHANNELDOWN'><i class='fa fa-chevron-circle-down'></i><div class='tick'></div><div class='maskTransparent'></div></div>\
		</div>\
		<div style='clear:both;'></div>\
	</div>\
	"
}
function miniSectionRemoteHtml () {
	return "\
	<div class='smallView'>\
		<div class='leftDiv' style='width:33%; margin-top:50px; float:left; text-align:center;'>\
			<div class='btn buttonBG theamBGColor' code='KEY_VOLUMEUP'><i class='fa fa-chevron-circle-up'></i><div class='tick'></div><div class='maskTransparent'></div></div>\
			<br/>\
			<span class='theamTextColor font18'>VOL</span>\
			<br/><br/>\
			<div class='btn buttonBG theamBGColor' code='KEY_VOLUMEDOWN'><i class='fa fa-chevron-circle-down'></i><div class='tick'></div><div class='maskTransparent'></div></div>\
		</div>\
		<div class='centerDiv' style='width:33%; margin-top:0px; float:left; text-align:center;'>\
			<div class='btn buttonBG theamBGColor' code='KEY_POWER'><i class='fa fa-power-off'></i><div class='tick'></div><div class='maskTransparent'></div></div>\
			<br/><br/><br/>\
			<div class='btn buttonBG theamBGColor' code='KEY_MUTE'><i style='position:absolute; left:12px; font-size: 28px; top:7px;' class='fa fa-volume-down'></i><span><i>/</i></span><div class='tick theamBGColor'></div><div class='maskTransparent'></div></div>\
		</div>\
		<div class='rightDiv' style='width:33%; margin-top:50px; float:left; text-align:center;'>\
			<div class='btn buttonBG theamBGColor' code='KEY_CHANNELUP'><i class='fa fa-chevron-circle-up'></i><div class='tick'></div><div class='maskTransparent'></div></div>\
			<br/>\
			<span class='theamTextColor font18'>CH</span>\
			<br/><br/>\
			<div class='btn buttonBG theamBGColor' code='KEY_CHANNELDOWN'><i class='fa fa-chevron-circle-down'></i><div class='tick'></div><div class='maskTransparent'></div></div>\
		</div>\
		<div style='clear:both;'></div>\
	</div>\
	"
}
function nevigationPannelHtml () {
	return "\
	<div class='arrowView'>\
		<i class='fa fa-arrows theamColor' style='font-size:130px;'></i>\
		<div class='btn absDiv' code='KEY_UP' style='width:67px; height:26px; top:0px; left:30px;'><div class='tick' style='background-color:black;'></div><div class='maskTransparent'></div></div>\
		<div class='btn absDiv' code='KEY_LEFT' style='width:26px; height:67px; top:30px; left:0px;'><div class='tick' style='background-color:black;'></div><div class='maskTransparent'></div></div>\
		<div class='btn absDiv' code='KEY_DOWN' style='width:67px; height:26px; bottom:0px; left:30px;'><div class='tick' style='background-color:black;'></div><div class='maskTransparent'></div></div>\
		<div class='btn absDiv' code='KEY_RIGHT' style='width:26px; height:67px; top:30px; right:0px;'><div class='tick' style='background-color:black;'></div><div class='maskTransparent'></div></div>\
		<div class='btn absDiv theamBGColor' code='KEY_OK' style='width:55px; height:55px; border:10px solid white; top:27px; left:27px; border-radius:20px; line-height:56px;'>OK<div class='tick'></div><div class='maskTransparent'></div></div>\
	</div>\
	<div>\
		<div class='leftDiv' style='width:33%; margin-top:-40px; float:left; text-align:center;'>\
			<div code='KEY_BACK' class='btn buttonBG theamBGColor'><i class='fa fa-reply'></i><div class='tick'></div><div class='maskTransparent'></div></div>\
		</div>\
		<div class='rightDiv' style='width:33%; margin-top:-40px; float:right; text-align:center;'>\
			<div code='KEY_AV' class='btn buttonBG theamBGColor' style='font-size:20px;'>AV<div class='tick'></div><div class='maskTransparent'></div></div>\
		</div>\
	</div>\
	"
}
function numberKeyPannel () {
	return"\
	<div class='largeView'>\
		<div class='numberButton' ><div code='KEY_1' class='btn buttonBG theamBGColor'>1<div class='tick'></div><div class='maskTransparent'></div></div></div>\
		<div class='numberButton' ><div code='KEY_2' class='btn buttonBG theamBGColor'>2<div class='tick'></div><div class='maskTransparent'></div></div></div>\
		<div class='numberButton' ><div code='KEY_3' class='btn buttonBG theamBGColor'>3<div class='tick'></div><div class='maskTransparent'></div></div></div>\
		<div class='numberButton' ><div code='KEY_4' class='btn buttonBG theamBGColor'>4<div class='tick'></div><div class='maskTransparent'></div></div></div>\
		<div class='numberButton' ><div code='KEY_5' class='btn buttonBG theamBGColor'>5<div class='tick'></div><div class='maskTransparent'></div></div></div>\
		<div class='numberButton' ><div code='KEY_6' class='btn buttonBG theamBGColor'>6<div class='tick'></div><div class='maskTransparent'></div></div></div>\
		<div class='numberButton' ><div code='KEY_7' class='btn buttonBG theamBGColor'>7<div class='tick'></div><div class='maskTransparent'></div></div></div>\
		<div class='numberButton' ><div code='KEY_8' class='btn buttonBG theamBGColor'>8<div class='tick'></div><div class='maskTransparent'></div></div></div>\
		<div class='numberButton' ><div code='KEY_9' class='btn buttonBG theamBGColor'>9<div class='tick'></div><div class='maskTransparent'></div></div></div>\
		<div class='numberButton' ></div>\
		<div class='numberButton' ><div code='KEY_0' class='btn buttonBG theamBGColor'>0<div class='tick'></div><div class='maskTransparent'></div></div></div>\
		<div style='clear:both;'></div>\
	</div>\
	"	
};
function acControlHtml () {
	return "\
	<div class='smallView'>\
		<div class='leftDiv' style='width:33%; float:left; text-align:center;'>\
			<div class='btn buttonBG theamBGColor' code='KEY_POWER'><i class='fa fa-power-off'></i><div class='tick'></div><div class='maskTransparent'></div></div>\
			<span class='theamTextColor font16'>ON</span>\
			<br/><br/>\
			<div class='btn buttonBG theamBGColor' code='KEY_FANEUP'><i class='fa fa-chevron-circle-up'></i><div class='tick'></div><div class='maskTransparent'></div></div>\
			<br/>\
			<div class='btn buttonBG theamBGColor' code='KEY_SWINGLEFT'><i class='fa fa-chevron-circle-left'></i><div class='tick'></div><div class='maskTransparent'></div></div>\
		</div>\
		<div class='centerDiv' style='width:33%; margin-top:10px; float:left; text-align:center;'>\
			<br/><br/><br/><br/>\
			<span class='theamTextColor font16'>FAN</span>\
			<br/><br/><br/>\
			<span class='theamTextColor font16'>SWING</span>\
		</div>\
		<div class='rightDiv' style='width:33%; float:right; text-align:center;'>\
			<div class='btn buttonBG theamBGColor' code='KEY_POWER_OFF'><i class='fa fa-power-off'></i><div class='tick'></div><div class='maskTransparent'></div></div>\
			<span class='theamTextColor font16'>OFF</span>\
			<br/><br/>\
			<div class='btn buttonBG theamBGColor' code='KEY_FANDOWN'><i class='fa fa-chevron-circle-down'></i><div class='tick'></div><div class='maskTransparent'></div></div>\
			<br/>\
			<div class='btn buttonBG theamBGColor' code='KEY_SWINGRIGHT'><i class='fa fa-chevron-circle-right'></i><div class='tick'></div><div class='maskTransparent'></div></div>\
		</div>\
		<div style='clear:both;'></div>\
	</div>\
	"
}

function acTemperaturePannel () {
	return"\
	<div class='largeView font20'>\
		<div class='numberButton' ><div code='KEY_16' class='btn buttonBG theamBGColor'>16<div class='tick'></div><div class='maskTransparent'></div></div></div>\
		<div class='numberButton' ><div code='KEY_18' class='btn buttonBG theamBGColor'>18<div class='tick'></div><div class='maskTransparent'></div></div></div>\
		<div class='numberButton' ><div code='KEY_20' class='btn buttonBG theamBGColor'>20<div class='tick'></div><div class='maskTransparent'></div></div></div>\
		<div class='numberButton' ><div code='KEY_22' class='btn buttonBG theamBGColor'>22<div class='tick'></div><div class='maskTransparent'></div></div></div>\
		<div class='numberButton' ><div code='KEY_24' class='btn buttonBG theamBGColor'>24<div class='tick'></div><div class='maskTransparent'></div></div></div>\
		<div class='numberButton' ><div code='KEY_26' class='btn buttonBG theamBGColor'>26<div class='tick'></div><div class='maskTransparent'></div></div></div>\
		<div style='clear:both;'></div>\
	</div>\
	"	
}

function defaultRemoteHtml () {
return "\
		"+remoteStyle1()+"\
		<div id='singleRemotePannel' class=''>\
			"+miniSectionRemoteHtml()+"\
			"+nevigationPannelHtml()+"\
			<br/>\
			"+numberKeyPannel()+"\
		</div>\
	"	
}
function miniRemoteHtml () {
return "\
		"+remoteStyle1()+"\
		<div id='singleRemotePannel' class=''>\
			"+miniSectionRemoteHtml()+"\
			"+nevigationPannelHtml()+"\
		</div>\
	"	
}
function numPadRemoteHtml () {
return "\
		"+remoteStyle1()+"\
		<div id='singleRemotePannel' class=''>\
			"+miniSectionRemoteHtml()+"\
			<br/><br/>\
			"+numberKeyPannel()+"\
		</div>\
	"	
}
function defaultAcRemoteHtml () {
return "\
		"+remoteStyle1()+"\
		<div id='singleRemotePannel' class=''>\
			"+acControlHtml()+"\
			<br/><br/>\
			"+acTemperaturePannel()+"\
		</div>\
	"	
}
function mini2ChnlRemoteHtml () {
return "\
		"+remoteStyle1()+"\
		<div id='singleRemotePannel' class=''>\
			"+miniGenricHtml()+"\
		</div>\
	"	
}

IrCodeSelector = BaseView.extend(Popup).extend({
	name : "IrCodeSelector",
	templateSelector:"#irCodeSelector",
	keepPopupFixed : true,
	avoidCloneOnPullup : true,
	events: {
		"tap .popupPannel > .cross" : "hidePopUp",
		"tap .btn" : "onButtonTap",
		"tap .remIcon" : "switchRemote",
		"tap .codeProxy .cancle" : "onCodeCancle"
	},
	onCodeCancle : function (event) {
		var $codeProxy = $(event.target).closest('.codeProxy');
		$codeProxy.remove();
	},
	onButtonTap : function (event) {
		var $btn = $(event.target).closest('.btn');
		var code = $btn.attr('code');
		var remId = this.$el.find('.tick:visible').closest('.remIcon').attr('remId');
		var $codeProxy = this.getIRCodeProxy(code, remId);
		this.$el.find('.codeProxyCont').append($codeProxy);

	},
	getIRCodeProxy : function(code, remId) {
		var remName = this.remotes[remId].name;
		return $("<span class='codeProxy button font10' code='"+code+"' remId='"+remId+"'><span>"+remName+"</span>: <span>"+code+"</span><i class='fa fa-times-circle-o cancle'></i></span>");
	},
	showPopUp : function(remotes, codeArr, callback){
		this.remotes = remotes;
		this.onDone = callback;
		this.$el.find('.codeProxyCont').html("");
		_.each(codeArr, function(obj) {
			this.$el.find('.codeProxyCont').append(this.getIRCodeProxy(obj.code, obj.remId));
		}, this);
		this.$el.find('.remIconCont').html("");
		_.each(remotes, function(rem, indx){
			this.$el.find('.remIconCont').append($('<div class="remIcon" icon="'+rem.icon+'" remId="'+rem.id+'" style="position:relative;width:50px;float:left;margin:5px 0px;z-index:5;text-align:center;"><img style="width:100%;cursor:pointer;" src="static/'+revId+'/images/transparent/'+rem.icon+'.png" /><br/><div class="font8">'+rem.name+'</div><div class="tick theamBGColor"></div></div>'));
		}, this);
		this.$el.find('.tick').hide();
		this.paintRemote('remote_default'); //this is required so that pop is places at right postition
		var retObj = Popup.showPopUp.apply(this, arguments);
		this._switchRemote(_.keys(remotes)[0])
		return retObj
	},
	hidePopUp : function () {
		var codeArr = []
		_.each(this.$el.find('.codeProxy'), function(codeProxy){
			var $codeProxy = $(codeProxy);
			codeArr.push({"remId":$codeProxy.attr('remId'), "code":$codeProxy.attr('code')})
		});
		this.onDone(codeArr);
		return Popup.hidePopUp.apply(this, arguments);
	},
	switchRemote : function (event) {
		var $remIcon = $(event.target).closest('.remIcon');
		var remId = $remIcon.attr('remId');
		this._switchRemote(remId);
	},
	_switchRemote : function (remId) {
		var icon = this.remotes[remId].icon;
		this.$el.find('.tick').hide();
		this.$el.find('.remIcon[remId='+remId+'] .tick').show();
		this.paintRemote(icon);
	},
	paintRemote : function(icon){
		switch (icon) {
			case 'remote_mini' : 		this.$el.find('.remoteCont').html(miniRemoteHtml()); break;
			case 'remote_mini_generic': this.$el.find('.remoteCont').html(mini2ChnlRemoteHtml()); break;
			case 'remote_with_numpad' : this.$el.find('.remoteCont').html(numPadRemoteHtml()); break;
			case 'remote_ac_default'  : this.$el.find('.remoteCont').html(defaultAcRemoteHtml()); break;
			case 'remote_default' : 	
			default : 					this.$el.find('.remoteCont').html(defaultRemoteHtml());
		}
	}
})
var irCodeSelector = new IrCodeSelector({'el':$("#irCodeSelectorCont")});
irCodeSelector.render();

RemoteViewer = BaseView.extend(Popup).extend({
	name : "RemoteViewer",
	templateSelector:"#remoteViewer",
	keepPopupFixed : true,
	avoidCloneOnPullup : true,
	events: {
		"tap .popupPannel > .cross" : "hidePopUp",
		"tap .btn" : "onButtonTap",
		"longTap .btn" : "onButtonLongTap"
	},
	initialize : function () {
		_.bindAll(this, 'onButtonUp');
		BaseView.prototype.initialize.apply(this, arguments);
	},
	showFeed : function (model) {
		this.model = model;
		this.hidePopUp();
		this.paintRemote(this.model.get('icon'));
		this.showPopUp();
	},
	paintRemote : function(icon){
		switch (icon) {
			case 'remote_mini' : 		this.$el.find('.remoteCont').html(miniRemoteHtml()); break;
			case 'remote_mini_generic': this.$el.find('.remoteCont').html(mini2ChnlRemoteHtml()); break;
			case 'remote_with_numpad' : this.$el.find('.remoteCont').html(numPadRemoteHtml()); break;
			case 'remote_ac_default'  : this.$el.find('.remoteCont').html(defaultAcRemoteHtml()); break;
			case 'remote_default' : 	
			default : 					this.$el.find('.remoteCont').html(defaultRemoteHtml());
		}
	},
	showPopUp : function () {
		$('body').on('touchend', this.onButtonUp)
		return Popup.showPopUp.apply(this, arguments);
	},
	hidePopUp : function () {
		this.onButtonUp();
		$('body').off('touchend', this.onButtonUp);
		this.$el.find('.remoteCont').html=("");
		return Popup.hidePopUp.apply(this, arguments);
	},
	onButtonTap : function (event, longTap) {
		var $btn = $(event.target).closest('.btn');
		$btn.addClass('statePressed');
		this.$PressedButton = $btn;
		clearTimeout(this.buttonTimer);
		this.buttonTimer = setTimeout(_.bind((longTap)?this.onButtonLongTap:this.onButtonUp, this, event), 200)
		console.log($btn.attr('code'));
		this.model.sendIRCode($btn.attr('code'));
	},
	onButtonLongTap : function (event) {
		console.log('onButtonLongTap')
		this.onButtonTap(event, true);
	},
	onButtonUp : function () {
		if(!this.$PressedButton) return;
		console.log('onButtonUp');
		clearTimeout(this.buttonTimer)
		this.$PressedButton.removeClass('statePressed');
		this.$PressedButton = null;
		setTimeout(_.bind(function(){this.model.sendIRCode("KEY_PRESS_END");}, this), 200);		
	}
});

var remoteViewer = new RemoteViewer({'el':$("#remoteViewerCont")});
remoteViewer.render();

AdvanceRemoteSwitch = BasicSwitch.extend(Popup).extend({
	name : "IrRemoteSwitch",
	events: {
		"tap .toggelSwitch" : "showPannel"
	},
	showPannel : function () {
		remoteViewer.$el.css("width", "80%").css("margin", "auto");
		remoteViewer.showFeed(this.model);
	}
})

