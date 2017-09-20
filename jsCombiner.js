/*
var buffer = ''
var scripts = [];
var lineReader = require('line-reader');
lineReader.eachLine('/home/admin/inoho/homeController/static/ejs/app_clasic.ejs', function(line, last) {
	line = line.trim();
	var src = line.replace(/^<script\s.*src="(.*)".*><\/script>/, function(s,m){return m;})
	if(src != line) {
		src ="/home/admin/inoho/homeController"+ src.replace("/<$=revId$>", "");
		console.log(src);
		lineReader.eachLine(src, function(ln, lt) {
			buffer += ln + '\n';
			if(lt) console.log(src, '<--');
		});
		buffer += '\n';
	}

      if(last){
         require('fs').writeFile('/home/admin/combined.js', buffer);
      }
});
*/

var buffer = ''
var scripts = [];
var lineReader = require('line-reader');
var scr = ''
function processScripts () {
	scr = scripts.shift();
	console.log(1+scripts.length, scr);
	lineReader.eachLine(scr, function(ln, lt){
		buffer += ln + '\n';
//	}).then(function(err){
		if(lt) {
			//console.log(scr, '<--');
			buffer += '\n\n\n';
			if(scripts.length)
				processScripts(); 
			else
				require('fs').writeFile('/home/admin/combined.js', buffer);
		}
	}); 
}
lineReader.eachLine('/home/admin/inputToJsCombiner.txt', function(line, last) {
        line = line.trim();
        var src = line.replace(/^<script\s.*src="(.*)".*><\/script>/, function(s,m){return m;})
        if(src != line){
		src ="/home/admin/inoho/homeController"+ src.replace("/<$=revId$>", "");
                //console.log(src);
		if(src.indexOf("/static") == 32)
	                scripts.push(src);
        }
	if(last) processScripts();
});
