var checkRTC = function(callback) {
    var exec = require('child_process').exec, child;
    child = exec('sudo hwclock -r', function(error, stdout, stderr){
        if(error !== null) {
            console.log(error, "RTC not available");
            return callback("RTC not available");
        }
        if(stdout.indexOf("command not found") != -1 || stdout.indexOf("hwclock: Cannot access the Hardware Clock via any known method") != -1) {
            console.log(error, stdout, stderr);
            return callback("RTC not available");   
        }
        console.log("RTC is available");
        callback(null);
    });    
};

var updateRTC = function(callback) {
    var exec = require('child_process').exec, child;
    child = exec('sudo hwclock -w', function(error, stdout, stderr){
        if(error !== null) {
            console.log(error,"RTC cannot be updated");
            return callback && callback("RTC cannot be updated");
        }
        if(stdout.indexOf("command not found") != -1 || stdout.indexOf("hwclock: Cannot access the Hardware Clock via any known method") != -1) {
            console.log(error, stdout, stderr);
            return callback && callback("RTC not available");   
        }
        console.log("RTC is updated");
        callback && callback(null);
    });
};

var syncSystemClock = function (callback) {
    var sys = require('sys');
    var exec = require('child_process').exec;
    exec("sudo service syncSystemClock", function(err) {
        if(!err) updateRTC();
        else console.log(err);
        callback && callback(null);
    });
};

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
var findIpAddress = function () {
    var os = require('os');
    var interfaces = os.networkInterfaces();
    var addresses = [];
    for (var k in interfaces) {
        for (var k2 in interfaces[k]) {
            var address = interfaces[k][k2];
            if (address.family === 'IPv4' && !address.internal) {
                addresses.push(address.address);
            }
        }
    }
    return addresses[0];
}
var sendGetRequest = function (host, path, calbk) {
    var http = require('http');

    var options = {
        host: host,
        path: path
    };

    callback = function(response) {
        var str = '';
        
        response.on('data', function (chunk) {
            str += chunk; //another chunk of data has been recieved, so append it to `str`
        });

        response.on('end', function () {
            if(calbk) calbk(null, str); //the whole response has been recieved, so we just print it out here
        });
    }
    var req = http.request(options, callback)
    req.on('error', function(err) {
        if(calbk) calbk(err.code, null);
    });
    req.setTimeout(1000, function(){req.abort();})
    req.end();
}
module.exports.sendGetRequest = sendGetRequest;
module.exports.checkInternet = checkInternet;
module.exports.findIpAddress = findIpAddress;
module.exports.checkRTC = checkRTC;
module.exports.updateRTC = updateRTC;
module.exports.syncSystemClock = syncSystemClock;