var __ = require("underscore");
var request = require('request');
var ipCamaraConfig = require(__rootPath+"/classes/configs/ipCamaraConfig");
var MjpegProxy = require('mjpeg-proxy').MjpegProxy;

module.exports = function(app, cmdMngr) {

	__.each(ipCamaraConfig.data, function (data, id){
		id=parseInt(id);
		var port = 8100 + id;
		var mjp_url = 'http://'+data.userName+':'+data.password+'@'+data.ip+data.videoPath
		console.log("############### mjp_url ", mjp_url)
		var mjp = new MjpegProxy(mjp_url)

		mjp.lastDataTs = Math.floor(Date.now()/1000);
		setInterval(function() {
			if(mjp.globalMjpegResponse && !mjp.globalMjpegResponse.customOnDataAttached) {
				mjp.globalMjpegResponse.on('data', function(){mjp.lastDataTs = Math.floor(Date.now()/1000);});
				mjp.globalMjpegResponse.customOnDataAttached = true
			}
		}, 1000);

		setInterval(function() {
			if(mjp.globalMjpegResponse && mjp.lastDataTs + 5 < Math.floor(Date.now()/1000)){
				for (var i = mjp.audienceResponses.length; i--;) mjp.audienceResponses[i].end();
				mjp.audienceResponses=[];
				mjp.globalMjpegResponse.destroy(); 
			}
		}, 5000);

		app.get('/cam/'+id, mjp.proxyRequest);

	});

	// app.get('/cam', function (req, res) {
	// 	console.log ("Got /cam req");
	// 	var url = 'http://127.0.0.1:8085' + req.url;
	// 	var proxyReq = request(url)
	// 	req.on('close', function () {console.log("rrrrr close"); proxyReq.abort()});
	//  	req.pipe(proxyReq).pipe(res);
	// });
};