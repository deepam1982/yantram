GZI = 400; //global z-index
Backdrop = BaseView.extend({
	render	:	function () { 
		//if(!this.options.zIndex) 
			this.options.zIndex = GZI++;
		this.$el = $('<div style="width:100%; height:100%; background-color:black;opacity:0.7;position:absolute; top:0; left:0;"/>');
		this.$el.css('z-index', this.options.zIndex)
		if(!this.options.$parent) this.options.$parent = $('body')
		this.options.$parent.append(this.$el);
	},
	pullItOver : function ($elm) {
		if(!this.elmArr) this.elmArr = [];
		$elm.attr('oldStyle', $elm.attr('style'));
		if(this.cloneOnPullup) $elm.after($elm.clone());
		var left = $elm.position().left - this.$el.position().left;
		var top = $elm.position().top - this.$el.position().top;
		$elm.css('left', left);
		$elm.css('top', top);
		var match = $elm.attr('style').match(/[^-]width[: ]+([0-9]+)/);
		match = (match)?(match[1]+'px'):'auto';
		$elm.attr('cssWidth', match);
		$elm.css('width', $elm.width());
		$elm.css('z-index', this.options.zIndex+1);
		$elm.css('position', 'absolute');
		$elm.addClass('onBackdrop');
		this.elmArr.push($elm);
	},
	erase : function () {
		_.each(this.elmArr, function ($elm) {
			$elm.css('width', $elm.attr('cssWidth'));
			$elm.attr('style', $elm.attr('oldStyle'));
			$elm.removeClass('onBackdrop');
			if(this.cloneOnPullup) $elm.next().remove();
		}, this);
		this.$el.remove();
		this.GZI--;
		return this;
	}
});


BasicDialog = BaseView.extend({
	templateSelector:"#basicDilogTemplate",
	events: {
		"tap .ok" : "hide",
		"tap .cancel" : "cancel"
	},
	cancel : function () {
		this.hide(null, false);
	},
	show : function (msg) {
		this.render();
		$('#mainCont').append(this.$el);
		this.$el.find('.msgDiv').html(msg || "Dummy message!!");
		this.$el.find('#ok').show();
		this._show();
	},
	_show : function () {
		this.bd = new Backdrop({'$parent':$('#mainCont')});
		this.bd.render();
		this.bd.pullItOver(this.$el);
		var left = ($(window).width() - this.$el.width())/2;
		var top = ($(window).height() - this.$el.height())/2;
		this.$el.css('position','fixed').css('top',top+'px').css('left',left+'px');
		$('body').css('overflow', 'hidden');		
	},
	hide : function (event, flag) {
		$('body').css('overflow', '');
		this.$el.css('position','').css('top','').css('left','');
		this.bd.removeView();
		this.bd = null;
		this.erase();
		return this;
	}
});

ConfirmDialog = BasicDialog.extend( {
	show : function (msg, clbk) {
		this.clbk = clbk;
		BasicDialog.prototype.show.apply(this, arguments);
	},
	_show : function () {
		this.$el.find('#ok').hide();
		this.$el.find('#yes').show();
		this.$el.find('#no').show();
		BasicDialog.prototype._show.apply(this, arguments);
	},
	hide : function (event, flag) {
		BasicDialog.prototype.hide.apply(this, arguments);
		this.clbk && this.clbk((flag === false)?false:true);
	}
})


confirmDialog = new ConfirmDialog;
alertDialog = new BasicDialog;
