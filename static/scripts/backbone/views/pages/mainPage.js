
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