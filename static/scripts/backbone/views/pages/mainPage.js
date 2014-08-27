
MainPageView = BaseView.extend({
	subViewArrays : [{'viewClassName':'RoomView1', 'reference':'roomViewArray', 'parentSelector':'', 'array':'this.collection'}],
	initialize: function(obj) {
		_.bindAll(this, 'onNewRoomAddition');
		this.collection = obj.collection; // collection and model both gets attached to view object by default
		BaseView.prototype.initialize.apply(this, arguments);
    },
    render	:	function () {
		BaseView.prototype.render.apply(this, arguments);
		this.collection.on('add', this.onNewRoomAddition);
    },
    onNewRoomAddition : function (roomModel) {
    	var roomView = new RoomView1({model:roomModel});
		this.$el.append(roomView.$el);
		roomView.render();
    	this['roomViewArray'].push(roomView);
    },
	erase	:	function () {
		this.collection.off('add', this.onNewRoomAddition);
		BaseView.prototype.erase.apply(this, arguments);
	}
})