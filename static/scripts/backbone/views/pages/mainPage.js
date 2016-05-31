
MainPageView = BaseView.extend({
	name : 'MainPageView',
	subViewArrays : [{'viewClassName':'GroupView1', 'reference':'roomViewArray', 'parentSelector':'', 'array':'this.collection'}],
	_getJsonToRenderTemplate : function () {return {'clusterCount':this.options.collections.length, 'currentCluster':this.currentCluster||1}},
	initialize: function(opt) {
		var oriPrams = JSON.parse(JSON.stringify(this.subViewArrays[0])), i=0;
		this.subViewArrays = [];
		_.each(opt.collections, function(col){
			var clonPrams = JSON.parse(JSON.stringify(oriPrams));
			_.each(clonPrams.eval, function(val, idx, eval){
				if(val == 'deviceCollection') eval[idx] = val+'=this.options.deviceCollections['+i+']';
				if(val == 'moodCollection') eval[idx] = val+'=this.options.moodCollections['+i+']';
				if(val == 'groupCollection') eval[idx] = val+'=this.options.groupCollections['+i+']';
			}, this);
			clonPrams.array = 'this.options.collections['+(i++)+']';
			clonPrams.reference +=('_'+i);
			if(clonPrams.parentSelectorPrefix)
				clonPrams.parentSelector = clonPrams.parentSelectorPrefix + ('_'+i);
			this.subViewArrays.push(clonPrams);
		}, this)
		console.log(this.subViewArrays);
		return BaseView.prototype.initialize.apply(this, arguments);
	},
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
	proxyMinMargin:15,
	templateSelector:"#groupProxyViewTemplate",
	_getJsonToRenderTemplate : function () {
		return _.extend(this.model.toJSON(),{'width':this.proxyWidth, 'margin':this.proxyMargin, 'minMargin':this.proxyMinMargin});
	},
	events: {
		"tap .powerOffIcon"	: "powerOff",
		"tap .moodIcon"	: "applyMood",
		"tap .groupProxyCont" : "onProxyTap"
	},
	onProxyTap : function () {
		this.options.parentView.switchToGroupview(this.model, this.options.moodCollection);
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
	subViewArrays : [{'viewClassName':'GroupProxyView', 'reference':'groupProxyArray', 'parentSelectorPrefix':'.proxyCont', 'array':'this.collection', 'eval':['moodCollection']}],
	templateSelector:"#groupProxyMainPageViewTemplate",
	initialize: function(obj) {
		$('#backImageCont').on('tap', _.bind(this.backClicked, this));
		return MainPageView.prototype.initialize.apply(this, arguments);
	},
	render : function () {
		$(".appArea").css('padding',0);
		this.$el.css('width','100%');
		var wth = this.$el.width()
		, pWth = GroupProxyView.prototype.proxyWidth
		, pMar = GroupProxyView.prototype.proxyMinMargin
		, proxysInARow = Math.floor(wth/(pWth+2*pMar))
		, extraMrgin = wth - (proxysInARow*(pWth+2*pMar))
		;
		extraMrgin = Math.floor((extraMrgin-2*pMar)/(2*(proxysInARow+1)));
		GroupProxyView.prototype.proxyMargin = extraMrgin + pMar;
		MainPageView.prototype.render.apply(this, arguments);
		this.$el.css('width','100%');
		this.$el.find('.proxyCont').css('padding-left',pMar+extraMrgin).css('padding-right',pMar+extraMrgin);
		return this;
	},
	erase : function () {
		$(".appArea").css('padding', '');
		return MainPageView.prototype.erase.apply(this, arguments);
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
	switchToGroupview : function (grpMdl, moodCollection) {
		console.log("onProxyTap");	
		this.grpView = new GroupView1({model:grpMdl});
		this.$el.find('.groupViewCont').prepend(this.grpView.$el);
		this.$el.find('.proxyCont').hide();
		$(".appArea").css('padding', '');
		this.grpView.render();
		$('#burgerImageCont').hide();
		$('#backImageCont').show();
		var moodModels=[];
		_.each(_.pluck(grpMdl.get('groupMoods'),'id'), function(id){moodModels.push(moodCollection.get(id))});
		this.moodStrip.showSelectiveMoodProxy(moodModels)

	}
})

