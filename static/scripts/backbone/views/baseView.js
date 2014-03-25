// var BaseView = Backbone.View.extend({
//     name : 'BasicViewClass',
//     _getJsonToRenderTemplate : function () {return (this.model)?this.model.toJSON():{};},
//     render  :   function () {
//         var template = (typeof this.template != 'undefined')?this.template:_.template($(this.templateSelector).html());
//         this.$el.html(template(this._getJsonToRenderTemplate()));
//         return this;
//     },
//     erase   :   function () {
//         this.$el.html("");
//         return this;
//     },
//     repaint :   function () {
//         this.erase().render();
//         return this;
//     }
// })

var BaseView = Backbone.View.extend({
    name : 'BasicViewClass',
    initialize: function(obj) {
        _.extend(this, obj);
        this._attachModelEvents();
        this._attachCollectionEvents();
        _.each(this.subViews, function (orignalParams) {
            var params = _.extend({}, orignalParams);
            if(params.model && _.isString(params.model)) eval('params.model='+params.model);
            if(params.collection && _.isString(params.collection)) eval('params.collection='+params.collection);
            params.parentView=this;
            if(params.viewClassName)
                this[params.reference] = new window[params.viewClassName](_.omit(params,'events'));
        }, this);
        _.each(this.subViewArrays, function (orignalParams) {
        	var params = _.extend({}, orignalParams);
            if(params.array && _.isString(params.array)) eval('params.arr='+params.array);
            params.parentView=this;
            var arr = params.arr; params.array=null; var newArr=[];
            _.each(arr.models||arr, function (model, indx) {
            	params.index = indx; params.model=model;
            	newArr.push(new window[params.viewClassName](_.omit(params,'events')));}, this);
            this[params.reference] = newArr;
        }, this);

	},
    _attachModelEvents:function(){
        _.each(this.modelEvents, function (value, key) {
            if (this.model) this.model.on(key, this[value], this);
        }, this);
    },
    _attachCollectionEvents:function(){
         _.each(this.collectionEvents, function (value, key) {
            if (this.collection) this.collection.on(key, this[value], this);
        }, this);
     },
//    subViews : [{'viewClassName':'SubViewClass', 'reference':'subViewObj', 'parentSelector':'#subViewCont', 'model':'this.model'}],
//    subViewArrays : [{'viewClassName':'SubViewClass', 'reference':'subViewArray', 'parentSelector':'#subViewCont', 'array':'this.collection'}]
    subViews : [],
    subViewArrays : [],
    modelEvents : {},
    collectionEvents : {},
    _getJsonToRenderTemplate : function () {return (this.model)?this.model.toJSON():{};},
	render	:	function () {
		var template = (typeof this.template != 'undefined')?this.template:_.template($(this.templateSelector).html());
		this.$el.html(template(this._getJsonToRenderTemplate()));
        _.each(this.subViews, function (params) { 
            if(!params) return;
            var ref = this[params.reference];
            var $parent = this.$el.find(params.parentSelector);
            if (!$parent.length) $parent=this.$el; 
            $parent.append(ref.$el);
            if (!params.supressRender) ref.render();
            var events = params.events;
            if (events) for(var eventName in events) {ref.on(eventName, this[events[eventName]], this)}
        }, this);
        _.each(this.subViewArrays, function (params) {
            if(!params) return;
            var events = params.events;
            _.each(this[params.reference], function (viewObj) {
            	var $parent = this.$el.find(params.parentSelector);
            	if (!$parent.length) $parent=this.$el; 
                $parent.append(viewObj.$el);
                if (!params.supressRender) viewObj.render();
                if (events) for(var eventName in events) {viewObj.on(eventName, this[events[eventName]], this)}
            }, this);
        }, this);
		return this;
	},
    removeView	:	function () {
        _.each(this.modelEvents, function (value, key) {
            if (this.model) this.model.off(key, this[value], this);
        }, this);
        _.each(this.collectionEvents, function (value, key) {
            if (this.collection) this.collection.off(key, this[value], this);
        }, this);
    	this.erase();
        _.each(this.subViewArrays, function (params) {
            if(!params) return;
            _.each(this[params.reference], function (viewObj) {viewObj.removeView();});
        }, this);
        _.each(this.subViews, function (params) {
            if(!params) return;
            this[params.reference].removeView();
        }, this);
        this.remove();
    },
    erase	:	function () {
        _.each(this.subViewArrays, function (params) {
            if(!params) return;
            var events = params.events;
            _.each(this[params.reference], function (viewObj) {
                if (events) for(var eventName in events){viewObj.off(eventName, this[events[eventName]], this)}
                viewObj.erase();
            }, this);
        }, this);
        _.each(this.subViews, function (params) {
            if(!params) return;
            var events = params.events,viewObj=this[params.reference];
            if (events) for(var eventName in events){viewObj.off(eventName, this[events[eventName]], this)}
            viewObj.erase();
        }, this);
    	this.$el.html("");
    	return this;
    },
    _detachModelEvents:function(){
        _.each(this.modelEvents, function (value, key) {
            if (this.model) this.model.off(key, this[value], this);
        }, this);
    },
    _detachCollectionEvents:function(){
        _.each(this.collectionEvents, function (value, key) {
            if (this.collection) this.collection.off(key, this[value], this);
        }, this);
    },
    repaint	:	function () {
        this._detachModelEvents();
        this._detachCollectionEvents();
    	this.erase().render();
        this._attachModelEvents();
        this._attachCollectionEvents();
    	return this;
    },
    trigger:function(eventName, args){
        Backbone.View.prototype.trigger.call(this,eventName, args);
        if(typeof this.parentView != 'undefined') this.parentView.trigger(eventName, args);
        return this;
    },
    show:function(){
        this.$el.show();
    },
    hide:function(){
        this.$el.hide();
    }

});
