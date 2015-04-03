var checkInternet = function (callback) {
	var exec = require('child_process').exec, child;
	child = exec('ping -c 1 8.8.8.8', function(error, stdout, stderr){
    	if(error !== null) {
        	console.log(error, stdout, stderr);
        	callback("Internet not available");
        }
    	else{
        	console.log("Internet is available");
        	callback(null);
        }
	});
};
module.exports = checkInternet;