
MainPageView = BaseView.extend({
	name : 'MainPageView',
	subViewArrays : [{'viewClassName':'GroupView1', 'reference':'roomViewArray', 'parentSelector':'', 'array':'this.collection'}],
	render : function () {
		this.moodStrip && $('#moodWigitCont').show() && this.moodStrip.render();
		return BaseView.prototype.render.apply(this, arguments);
	},
	erase : function () {
		this.moodStrip && $('#moodWigitCont').hide() && this.moodStrip.erase();
		return BaseView.prototype.erase.apply(this, arguments);
	}
})

GroupProxyView = BaseView.extend({
	name : "GroupProxyView",
	proxyWidth:90,
	proxyMargin:15,
	templateSelector:"#groupProxyViewTemplate",
	_getJsonToRenderTemplate : function () {
		return _.extend(this.model.toJSON(),{'width':this.proxyWidth, 'margin':this.proxyMargin});
	},
	events: {
		"tap .powerOffIcon"	: "powerOff",
		"tap .moodIcon"	: "applyMood" 
	},
	powerOff : function(event) {
		event.stopPropagation();
		console.log("powerOff");
		$(event.target).closest('.powerOffIcon').append($loader=$('<i class="patchSpinner brightColor fa fa-spinner fa-spin"></i>'))
		this.model.powerOff(function () {setTimeout(function (){$loader.remove()}, 1000)});
	},
	applyMood : function (event) {
		event.stopPropagation();
		var $elm = $(event.target).closest('.moodIcon');
		var moodModel = this.options.moodCollection.get($elm.attr('moodId'));
		console.log(moodModel);
		$elm.append($loader=$('<i class="patchSpinner brightColor fa fa-spinner fa-spin"></i>'))
		moodModel.sendActionRequest("applyMood", {'id':$elm.attr('moodId')}, function (err){
			setTimeout(function (){$elm.find('.patchSpinner').remove()}, 1000);
			if(err)console.log(err)
		});
	}
})

GroupProxyMainPageView = MainPageView.extend({
	name : 'GroupProxyMainPageView',
	subViewArrays : [{'viewClassName':'GroupProxyView', 'reference':'groupProxyArray', 'parentSelector':'.proxyCont', 'array':'this.collection', 'eval':['moodCollection=this.options.moodCollection']}],
	templateSelector:"#groupProxyMainPageViewTemplate",
	initialize: function(obj) {
		$('#backImageCont').on('tap', _.bind(this.backClicked, this));
		return BaseView.prototype.initialize.apply(this, arguments);
	},
	render : function () {
		$(".appArea").css('padding',0);
		MainPageView.prototype.render.apply(this, arguments);
		this.$el.css('width','100%');
		var wth = this.$el.width()
		, pWth = GroupProxyView.prototype.proxyWidth
		, pMar = GroupProxyView.prototype.proxyMargin
		;
		var proxysInARow = Math.floor(wth/(pWth+2*pMar));
		var padding = Math.floor((wth - (proxysInARow*(pWth+2*pMar)))/2)
		this.$el.find('.proxyCont').css('padding-left',padding).css('padding-right',padding);
		return this;
	},
	erase : function () {
		$(".appArea").css('padding', '');
		return MainPageView.prototype.erase.apply(this, arguments);
	},
	events: {
		"tap .groupProxyCont" : "switchToGroupview"
	},
	backClicked : function() {
		if(!this.rendered) return;
		this.moodStrip.showAllMoodProxy()
		$(".appArea").css('padding',0);
		this.grpView.removeView();
		this.$el.find('.proxyCont').show();
		$('#backImageCont').hide();
		$('#burgerImageCont').show();

	},
	switchToGroupview : function (event) {
		var $gropProxy = $(event.target).closest('.groupProxyCont');
		var groupId = $gropProxy.attr('groupId');
		var grpMdl = this.collection.get(groupId)
		this.grpView = new GroupView1({model:grpMdl});
		this.$el.find('.groupViewCont').prepend(this.grpView.$el);
		this.$el.find('.proxyCont').hide();
		$(".appArea").css('padding', '');
		this.grpView.render();
		$('#burgerImageCont').hide();
		$('#backImageCont').show();
		this.moodStrip.showSelectiveMoodProxy(_.pluck(grpMdl.get('groupMoods'),'id'))

	}
})

