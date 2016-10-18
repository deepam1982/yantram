DevStngPageView = MainPageView.extend({
	templateSelector:"#devStngPageTemplate",
	name : 'DevStngPageView',
	events : {
		"tap .clusterTabs span" : 'switchCluster'
	},
	subViewArrays : [{'viewClassName':'DeviceView', 'reference':'groupViewArray', 'parentSelectorPrefix':'.devStngViewCont', 'eval':['deviceCollection'],'array':'this.collection', 'supressRender':true}],
	render : function () {
		MainPageView.prototype.render.apply(this, arguments);
		_.each(this['groupViewArray_'+(this.currentCluster||1)], function(view){
			view.render()
		}, this);
		return this;
	},
	switchCluster : function (event) {
		this.currentCluster = $(event.target).attr('clusterNo');
		this.repaint();
	}
});

DeviceView = BaseView.extend({
	templateSelector:"#groupTemplate",
	name : "DeviceView",
	subViewArrays : [{'viewClassName':'EditableSwitch', 'reference':'switchViewArray', 'parentSelector':'.switchCont', 'array':'this.switchCollection', 'eval':['deviceCollection=this.options.deviceCollection']}],
	events : {
		"tap .deleteGroup" : 'deleteDevice'
	},
	initialize: function(obj) {
		var ColClass = Backbone.Collection.extend({model:SwitchModel});
		this.switchCollection = new ColClass();
		this.switchCollection.on("add", function (swModel) {swModel.ioSocket=this.model.collection.ioSocket;}, this);
		this.switchCollection.set(_.values(this.model.get("loadInfo")), {merge: true});
		this.model.on('change', _.bind(function (model) {
			this.switchCollection.set(_.values(this.model.get("loadInfo")), {merge: true});
		}, this));
		BaseView.prototype.initialize.apply(this, arguments);
    },
    _isDeviceDeletable : function () {
    	var key, loadInfo = this.model.get("loadInfo");
    	for (key in loadInfo) {
    		if (!loadInfo[key].disabled) return false;
    	}
    	return true;
    },
    render : function () {
    	BaseView.prototype.render.apply(this, arguments);
    	this.$el.find('.deleteGroup')[(this._isDeviceDeletable())?'show':'hide']();
    	if(!this.switchCollection.models.length) this.$el.hide();
    	return this;
    },
    deleteDevice : function () {
    	if(!this._isDeviceDeletable()) return;
    	console.log(this.model.id);
    	this.options.deviceCollection.ioSocket.emit("deleteDevice", this.model.id, function(err) {if(err)console.log(err);});
    }
})