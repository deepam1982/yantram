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
    bindFunctions : [],
    initialize: function(obj) {
        _.each(this.bindFunctions, function(funcName){_.bind(this[funcName], this);}, this);
//        _.extend(this, obj);
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
            if(typeof arr.on == 'function') {
                arr.on('add', _.bind(this._onNewModelInSubViewArray, this, params), this);
                arr.on('remove', _.bind(this._onModelRemovalFromSubViewArray, this, params), this);
                arr.on('change', _.bind(this._onModelChangeOfSubViewArray, this, params), this);
            }
        }, this);
	},
    _onModelChangeOfSubViewArray : function (params, model) {
        if(params.recreateOnRepaint) {
            var index = this._onModelRemovalFromSubViewArray(params, model);
            this._onNewModelInSubViewArray(params, model, index);
        }
        else    
        _.each(this[params.reference], function (view) {
            if(view.model !== model) return;
            view.repaint();
        }, this);
    },
    _onModelRemovalFromSubViewArray : function (params, model) {
        var index = -1, retindx = -1;
        _.each(this[params.reference], function (view) {
            index++;
            if(view.model !== model) return;
            this[params.reference] = _.without(this[params.reference], view);
            view.removeView();
            retindx = index
        }, this);
        return retindx;
    },
    //TODO write function similar to following for remove and change as well.
    _onNewModelInSubViewArray : function (params, model, index) {
        params.model=model;
        var view = new window[params.viewClassName](_.omit(params,'events'));
        var $parent = (params.parentSelector)?this.$el.find(params.parentSelector):null;
        if (!$parent || !$parent.length) $parent=this.$el;
        $parent.append(view.$el);
        if(typeof index == 'number') $parent.children().eq(index).before($parent.children().last())
        if(this.rendered) view.render();
        if(typeof index == 'number') 
            this[params.reference].splice(index, 0, view);
        else 
            this[params.reference].push(view);
        return view;
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
    _reDelegateEvents : function () {
        _.each(this.subViews, function (params) { this[params.reference].delegateEvents();}, this);
        _.each(this.subViewArrays, function (params) {_.each(this[params.reference], function (viewObj) {viewObj.delegateEvents();}, this);}, this);
        this.delegateEvents();
    },
	render	:	function () {
		var template = (typeof this.template != 'undefined')?this.template:
                        (this.templateSelector)?_.template($(this.templateSelector).html()):null;
		if(template) this.$el.html(template(this._getJsonToRenderTemplate()));
        _.each(this.subViews, function (params) { 
            if(!params) return;
            var ref = this[params.reference];
            var $parent = (params.parentSelector)?this.$el.find(params.parentSelector):null;
            if (!$parent || !$parent.length) $parent=this.$el; 
            $parent.append(ref.$el);
            if (!params.supressRender && !ref.rendered) ref.render()
            var events = params.events;
            if (events) for(var eventName in events) {ref.on(eventName, this[events[eventName]], this)}
        }, this);
        _.each(this.subViewArrays, function (params) {
            if(!params) return;
            var events = params.events;
            _.each(this[params.reference], function (viewObj) {
            	var $parent = (params.parentSelector)?this.$el.find(params.parentSelector):null;
            	if (!$parent || !$parent.length) $parent=this.$el; 
                $parent.append(viewObj.$el);
                if (!params.supressRender && !viewObj.rendered) viewObj.render();
                if (events) for(var eventName in events) {viewObj.on(eventName, this[events[eventName]], this)}
            }, this);
        }, this);
        this._reDelegateEvents();
        this.rendered = true;
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
            if(params.array && _.isString(params.array)) eval('var arr='+params.array);
            if(arr && typeof arr.on == 'function') {
                arr.off('add', null, this);
                arr.off('remove', null, this);
                arr.off('change', null, this);
            }
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
                viewObj.rendered && viewObj.erase();
            }, this);
        }, this);
        _.each(this.subViews, function (params) {
            if(!params) return;
            var events = params.events,viewObj=this[params.reference];
            if (events) for(var eventName in events){viewObj.off(eventName, this[events[eventName]], this)}
            viewObj.rendered && viewObj.erase();
        }, this);
    	this.$el.html("");
        this.rendered = false;
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
        if(this.avoidRepaint) {this.avoidRepaint=false; return this;}
        if(!this.rendered) return this;
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
