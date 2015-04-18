
/*
*
*		https://gist.github.com/jfromaniello/4087861
*
*/
//var myXhr = require(__rootPath + '/classes/sockets/socketIoClientHackXhr');
var __ = require("underscore");
module.exports = function (callback) {
//	return;
	var myXhr = require(__rootPath + '/classes/sockets/socketIoClientHackXhr');
	var io = require('socket.io-client');
	var request = require('request');
	 
	/*
	 * This is the jar (like a cookie container) we will use always
	 */
	var j = request.jar();

	myXhr.callbacks.test2 = function() {
		this.setDisableHeaderCheck(true);
		var stdOpen = this.open;
		this.open = function() {
			stdOpen.apply(this, arguments);
			var header = j.getCookieString(__cloudUrl);
//			console.log(header);
			//this.setRequestHeader('cookie', myCookie);
			this.setRequestHeader('cookie', header);
			this.setRequestHeader('inoho-home-controller', true);
		}
	}
/*
	/*
	 *  Little example of how to use ```socket-io.client``` and ```request``` from node.js
	 *  to authenticate thru http, and send the cookies during the socket.io handshake.
	 * /
	 
	var io = require('socket.io-client');
	var request = require('request');
	 
	/*
	 * This is the jar (like a cookie container) we will use always
	 * /
	var j = request.jar();
	 
	/*
	 *  First I will patch the xmlhttprequest library that socket.io-client uses
	 *  internally to simulate XMLHttpRequest in the browser world.
	 * /
	var originalRequest = require('xmlhttprequest').XMLHttpRequest;
	require(__rootPath+'/../node_modules/socket.io-client/node_modules/xmlhttprequest').XMLHttpRequest = function(){
//	require('xmlhttprequest').XMLHttpRequest = function(){
		originalRequest.apply(this, arguments);
		this.setDisableHeaderCheck(true);
		var stdOpen = this.open;

		this.open = function() {
			stdOpen.apply(this, arguments);
			var header = j.getCookieString(__cloudUrl);
			this.setRequestHeader('cookie', header);
			this.setRequestHeader('inoho-home-controller', true);
		};
	};
*/

	/*
	* Authenticate first, doing a post to some url 
	* with the credentials for instance
	*/
	var pingTimeStamp, pingTimer, socket;
	var foo = function () {
		if(!__userConfig.get('email')) return setTimeout(foo, 30000);
		console.log("Trying to login to cloud");
		request.get({jar: j, url: __cloudUrl+'/login/', form: {username: __userConfig.get('email'), password: __userConfig.get('password')} }, function (err, resp, body){
	 		console.log('got response!!', err, resp.statusCode);
	 		if(err) {
	 			console.log(err);
	 			console.log('Found no response from cloud, probably internet is down!!')
	 		}
	 		if(!err && resp.statusCode != 200) console.log('Cloud login resp code-'+resp.statusCode);	
	 		if (!resp || err || resp.statusCode != 200) {console.log("will retry connecting cloud in 60 sec."); setTimeout(foo, 60000); return;}

			/*
			* now we can connect.. and socket.io will send the cookies!
			*/
			pingTimeStamp = Date.now();
			if(!socket){
				socket = io(__cloudUrl+'/inoho-home-controller');
				socket.io.on('connect_error', function (err){console.log("------------ ", err);});
				socket.on('connect', __.bind(function(){
					console.log('connected! handshakedddddddddddd');
					callback(null, this);
				}, socket));
				socket.on('reconnect', function (){console.log('reconnected cloud socket!!')});
				socket.on('disconnect', function(){console.log('connection broken!!');foo();});
				socket.on('sudoHeartbeat', function(){pingTimeStamp = Date.now();console.log("recieved sudoHeartbeat from cloud");});
				socket.on('error', function (err){console.log("------ERR------ ", err);});
				socket.on('reconnect_error', function (err){console.log("------RECCON-ERR------ ", err);});
				//callback(null, socket);
			}
			else 
				socket.io.reconnect();
			pingTimer = setInterval(function () {
				if(Date.now()-pingTimeStamp < 6*60*1000) return;
				console.log('stoped recieving sudoHeartbeat from cloud ... trying to reconnect now.') 
				clearInterval(pingTimer);
				foo();
			}, 3*60*1000);
		});	
	}
	foo();
}