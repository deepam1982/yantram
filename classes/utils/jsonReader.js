var fs = require('fs');
var BaseClass = require(__rootPath+"/classes/baseClass");
var JsonReader = BaseClass.extend({
	readfile : function (file, callback) {
		fs.readFile(file, 'utf8', function (err, data) {
			if (err) {
				console.log('Tried to read file '+ file +' Error: ' + err);
				callback && callback(err);
			}
			callback && callback(null,  JSON.parse(data));
		});
	}
});
module.exports = JsonReader;

