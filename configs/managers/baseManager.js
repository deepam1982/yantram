var __ = require("underscore");
var JsonReader = require(__rootPath+"/classes/utils/jsonReader");
var BaseConfigManager = JsonReader.extend({
	
	init : function () {this.load()},
	load : function (calback) {
		this.readfile(__rootPath+this.path, __.bind(function (err, data) { 
			if (typeof error == "undefined") this.data = data;
			calback && calback();
		}, this))
	},
	save : function () {}, 
	get : function (path) {
		path = path.split('.');
		var val = this.data;
		while(val && path.length) 
			val = val[path.shift()];
		//TODO return cloned value.
		return val;
	},
	set : function (path, value) {
		path = path.split('.');
		var key = path.pop();
		var val = this.data;
		while(val && path.length) 
			val = val[path.shift()];
		val[key] = value;
	},
	toJSON : function () {
		//TODO return cloned value.
		return this.data;
	}

});
module.exports = BaseConfigManager;