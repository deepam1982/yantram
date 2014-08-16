SideMenuView = BaseView.extend({
	templateSelector:"#sideMenuTemplate",
	events: {
		"tap .options" : "optionChange",
	},
	optionChange : function (event) {
		var varName = $(event.target).attr('jsVarNm');
		if(this.currentPage)this.currentPage.erase();
		this.currentPage = window[varName];
		this.currentPage.render();
	}

});