SideMenuView = BaseView.extend({
	templateSelector:"#sideMenuTemplate",
	events: {
		"tap .options" : "optionChange",
		"tap .hideMe" : "hideMe"
	},
	hideMe : function() {this.trigger('hideMe')},
	optionChange : function (event) {
		this.switchPage($(event.target).attr('jsVarNm'));
	},
	switchPage : function (pageName) {
		if(1 || this.currentPage != window[pageName]) { // in case of cluster repaint is required.
			if(this.currentPage)this.currentPage.erase();
			this.currentPage = window[pageName];
			this.currentPage.render();
		}
		if(this.$el.is(':visible'))
			this.trigger('hideMe');
	}

});