SideMenuView = BaseView.extend({
	templateSelector:"#sideMenuTemplate",
	events: {
		"tap .options" : "optionChange"
	},
	optionChange : function (event) {
		this.switchPage($(event.target).attr('jsVarNm'));
	},
	switchPage : function (pageName) {
		if(this.currentPage)this.currentPage.erase();
		this.currentPage = window[pageName];
		this.currentPage.render();
	}

});