var __ = require("underscore");
var fs = require('fs');
var BaseClass = require(__rootPath+"/classes/baseClass");
var BasicConfigManager = BaseClass.extend({
	file : "",//extender of the calss will provide a valid path
	init : function (obj) {this.load((obj||{}).callback);},
	load : function (calback) {
		this.updateTs = new Date;
		this.readfile(__rootPath+this.file, __.bind(function (err, data) { 
			if(err && (err+" ").indexOf("SyntaxError") != -1) {
				var splitPath = (__rootPath+this.file).split("/");
				var fileName  = splitPath.pop();
				this.readfile(splitPath.join("/")+"/bkp/"+fileName, __.bind(function (err, data) { 
					this.data = data || {};
					calback && calback(err);
				}, this))
			}
			else {
				this.data = data || {};
				calback && calback(err);
				return;
			}
		}, this))
	},
	save : function (callback) {
		fs.writeFile(__rootPath+this.file, JSON.stringify(this.data, null, 4), __.bind(function(err) {
			try{callback && callback(err);}
			catch(e) {if (e) console.log("####### Error while executing save callback", e.stack);}
			var splitPath = (__rootPath+this.file).split("/");
			var fileName  = splitPath.pop();
			try {fs.mkdirSync(splitPath.join("/")+"/bkp/");} 
			catch(e) {if ( e.code != 'EEXIST' ) throw e;}
			fs.writeFile(splitPath.join("/")+"/bkp/"+fileName, JSON.stringify(this.data, null, 4), function(err) {
				if(err) console.log("######## Error:", err);
			})
		}, this));
		this.updateTs = new Date; // dont wait for file write must update as soon as the data is modified
	}, 
	has : function (path) {
		path = path.split('.');
		var obj = this.data;
		while(obj && path.length) {
			var key = path.shift();
			if(!__.has(obj, key)) return false;
			obj = obj[key]
		}
		return !path.length;
	},
	get : function (path) {
		path = path.split('.');
		var val = this.data;
		while(val && path.length) 
			val = val[path.shift()];
		return (val)?JSON.parse(JSON.stringify(val)):val;
	},
	set : function (path, value) {
		path = path.split('.');
		var key = path.pop();
		var val = this.data;
		while(val && path.length) {
			var subkey = path.shift();
			if(typeof val[subkey] == "undefined") val[subkey] = {};
			val = val[subkey];
		}
		val[key] = value;
	},
	toJSON : function () {
		// return cloned value.
		return JSON.parse(JSON.stringify(this.data));
	},
	readfile : function (file, callback) {
		fs.readFile(file, 'utf8', function (err, data) {
			if (err) {
				console.log('Tried to read file '+ file +' Error: ' + err);
				callback && callback(err);
				return;
			}
			try{
				data = JSON.parse(data);
				callback && callback(null,  data);
			}
			catch(err){
				console.log("############ ERR ########",file, err)
				callback && callback(err);
			}
			
		});
	}


});
module.exports = BasicConfigManager;