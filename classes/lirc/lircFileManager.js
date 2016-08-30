var __ = require("underscore");
var fs = require('fs');
var BaseClass = require(__rootPath+"/classes/baseClass");
var IRBLR1 = require(__rootPath+"/classes/devices/irBlasters/baseIrBlaster");
var LircFileManager = BaseClass.extend({
	editableFilesLocation : __rootPath+'/../configs/lirc',
	nonEditableFileLocation : __rootPath+'/lirc',
	editableFiles : null,
	nonEditableFiles : null,
	init : function (obj) {
		fs.readdir(this.editableFilesLocation, __.bind(function(err, fileNames){if(err) console.log(err); this.editableFiles = fileNames}, this));
		fs.readdir(this.nonEditableFileLocation, __.bind(function(err, fileNames){if(err) console.log(err); this.nonEditableFiles = fileNames}, this));
	},
	isEditable : function (filename) {
		return (__.indexOf(this.editableFiles, filename) != -1);
	},
	isValid : function (filename) {
		return (this.isFileEditable(filename) || __.indexOf(this.nonEditableFiles, filename) != -1);
	},
	getButtonList : function (fileName, callback) {
		IRBLR1.prototype.getRemoteLircObj(fileName, function(err,lircObj) {
			console.log('callback of IRBLR1.prototype.getRemoteLircObj');
			if(err) return callback && callback(err);
			var keys = __.union(__.keys(lircObj.codes), __.keys(lircObj.raw_codes));
			callback && callback(err, keys);
		});
	},
	editCode : function (filename, codeName, code, khz, calback) {
		if(!this.isEditable(filename)) return calback && calback("Lirc file is not editable!");
		var fileName = this.editableFilesLocation+"/"+filename;
		fs.readFile(fileName, 'utf8', __.bind(function(err, content){
			if (err) return calback(err);
			content = this._deleteRawCode(content, codeName);
			content = this._insertRawCode(content, codeName, code, khz);
			fs.writeFile(fileName, content, function() {
				IRBLR1.prototype.remoteLircObjs[filename] = null;
				calback();
			});
		}, this));
	},
	getlircTemplate : function(name) {
		return "begin remote\n\tname\t"+name+"\n\tflags\tRAW_CODES\n\teps\t30\n\taeps\t100\n\tgap\t90234\n\t\tbegin raw_codes\n\t\tend raw_codes\nend remote\n"
	},
	createIrRemote : function(calback) {
		var filename = ""+(new Date()).getTime();
		var filedata = this.getlircTemplate(filename);
		fs.writeFile(this.editableFilesLocation+"/"+filename, filedata, __.bind(function(err) {
			if(err) {
				console.log("error while creating lirc file", err);
				calback && calback(err);
			}
			this.editableFiles.push(filename);
			var irRemoteConfig = require(__rootPath+"/classes/configs/irRemoteConfig");
			irRemoteConfig.createIrRemote(filename, __.bind(function(err, data){
				if(err) console.log("error while creating remote config", err);
				calback && calback(err, data);
			}, this));
		}, this));
	},
	deleteLircFile : function(filename, calback) {
		console.log('deleteLircFile got called', filename);
		if(!this.isEditable(filename)) return calback && calback("Lirc file is not deletable!");
		var irRemoteConfig = require(__rootPath+"/classes/configs/irRemoteConfig");
		irRemoteConfig.deleteRemotesOfFile(filename, __.bind(function(err){
			if(err) {console.log(err); return calback && calback(err)}
			console.log('remote config got deleted.');
			var fileName = this.editableFilesLocation+"/"+filename;
			fs.unlink(fileName, function(err){
				if(err) console.log(err);
				calback && calback(err, {"success":true});
			})
		}, this));
	},
	_insertRawCode : function (content, codeName, code, khz) {
		var newContent = "", inserted = false;
		content.split("\n").forEach(function (line) {
			if(newContent) newContent += "\n";	
			if(!inserted && line.match(/end \s*raw_codes/i) !== null){
				newContent += "\t\tname " + codeName + "\n";
				if(khz) newContent += "\t\t\tkhz "+ khz + "\n";
				newContent += "\t\t\t"+ code + "\n";
				inserted = true;
			}
			if(!inserted && line.match(/end \s*remote/i) !== null){
				newContent += "\tbegin raw_codes\n\t\tname " + codeName + "\n\t\t\t" + code + "\n\tend raw_codes\n";
				inserted = true;
			}
			newContent += line;
		});
		return newContent;
	},
	_deleteRawCode : function (content, codeName) {
		var newContent = "", beginRawCodeFound = false, endRawCodeFound = false, foundCode = false, removedCode = false; 
		content.split("\n").forEach(function (line) {
			if(!endRawCodeFound) {
				endRawCodeFound=(line.match(/end \s*raw_codes/i) !== null);
				if(!beginRawCodeFound){
					beginRawCodeFound=(line.match(/begin \s*raw_codes/i) !== null);	
				} else {
					if(!removedCode) {
						if(!foundCode){
							foundCode = (line.indexOf(codeName) != -1);
						}
						else removedCode = ((line.indexOf("name") != -1) || endRawCodeFound);
					}
				}
			}
			if(!(foundCode^removedCode)){
				if(newContent) newContent += "\n";	
				newContent += line;
			}
		});
		return newContent;
	}

});

if (typeof lircFileManager == 'undefined') lircFileManager = new LircFileManager();
module.exports = lircFileManager;
