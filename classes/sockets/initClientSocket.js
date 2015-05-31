
/*
*
*		https://gist.github.com/jfromaniello/4087861
*
*/
var __ = require("underscore");
module.exports = function (callback) {

	/*
	 *  Little example of how to use ```socket-io.client``` and ```request``` from node.js
	 *  to authenticate thru http, and send the cookies during the socket.io handshake.
	 */
	 
	var io = require('socket.io-client');

	var request = require('request');
	 
	/*
	 * This is the jar (like a cookie container) we will use always
	 */
	var j = request.jar();
	 
	/*
	 *  First I will patch the xmlhttprequest library that socket.io-client uses
	 *  internally to simulate XMLHttpRequest in the browser world.
	 */
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

	var allowedEventsForHackEmit = ['roomConfigUpdated', 'onDeviceUpdate', 'moodConfigUpdate', 'deleteGroup', 'deleteMood'];
	var orignalEmitFunction = null;
	var hackedEmit = function (eventName, data, calback) { //TODO handle calback
		if(__.indexOf(allowedEventsForHackEmit, eventName) == -1) return orignalEmitFunction.apply(this, arguments);
		// console.log('hack emit on cloud socket',eventName);
		// request({
		// 	jar: j, 
		// 	url: __cloudUrl+'/socketemit', 
		// 	method: "POST",
		// 	json: true,
		// 	headers: {
		// 		"content-type": "application/json",
		// 	},
		// 	body: JSON.stringify({username: __userConfig.get('email'), event:eventName, "data":data})
		// },function (err, resp, body){
		// 	if(err) console.log(err,body);
		// 	console.log(body);
		// });

		var cookie = j.getCookieString(__cloudUrl);
		var dataStr = JSON.stringify({username: __userConfig.get('email'), event:eventName, "data":data});
		var command = 'curl -X POST --max-time 3 --retry 3 --cookie "'+cookie+'" -H "Content-Type: application/json" -d \''+dataStr+'\''+' '+__cloudUrl+'/socketemit';
		var exec = require('child_process').exec;
		var foo = function(error, stdout, stderr) {
			if(error) console.log(error, stdout);
//			if(error) console.log(command);
		}
		exec(command, foo);



		// // console.log(command);
		// console.log('command executed');
	};


	/*
	* Authenticate first, doing a post to some url 
	* with the credentials for instance
	*/
	var pingTimeStamp = Date.now(), pingTimer, socket, socketCheckTimer;
	var foo = function () {
		if(!__userConfig.get('email')) return setTimeout(foo, 30000);
		console.log("Trying to login to cloud");
		request.get({jar: j, timeout:3000, url: __cloudUrl+'/login/', form: {username: __userConfig.get('email'), password: __userConfig.get('password')} }, function (err, resp, body){
	 		console.log('got response!!');
	 		if(err) {
	 			console.log(err);
	 			console.log('Found no response from cloud, probably internet is down!!')
	 		}
	 		if(!err && resp.statusCode != 200) console.log('Cloud login resp code-'+resp.statusCode);	
	 		if (!resp || err || resp.statusCode != 200) {
	 			if(Date.now()-pingTimeStamp < 20*1000) return foo(); // 20 seconds
	 			console.log("will retry connecting cloud in 60 sec."); setTimeout(foo, 60000); return;}

			/*
			* now we can connect.. and socket.io will send the cookies!
			*/
			pingTimeStamp = Date.now();
			if(!socket || !socket.firstConnectionDone){
				var onSocketFirstConnect = function (newSocket) {
					if(socket !== newSocket) return;
					console.log("onSocketFirstConnect called!!")
					socket.firstConnectionDone = true;
					orignalEmitFunction = socket.emit;
					socket.emit = hackedEmit;
					socket.on('disconnect', function(){console.log(socket.socket.open, 'connection broken!!');socket.socket.reconnect();}); // try to reconnect only after 10 seconds m2m problem.
					socket.on('sudoHeartbeat', function(){pingTimeStamp = Date.now();console.log("recieved sudoHeartbeat from cloud");});
					socket.on('testEvent', function(){console.log("recieved testEvent from cloud");});
					socket.on('testEvent1', function(){console.log("recieved testEvent1 from cloud");});
					callback(null, socket);
				}
				var connectSocket = function () {
					console.log("Trying to establish socket with cloud");
					socket = io.connect(__cloudUrl+'/inoho-home-controller',{'connect timeout':4000});
					socket.on('connect', function(){
						console.log('connected! handshakedddddddddddd');
						if(!socket.firstConnectionDone) onSocketFirstConnect(socket)
					});
				}
				connectSocket();
				socketCheckTimer = setInterval(function () {
					if(socket.firstConnectionDone && socket.socket.open) return;
					console.log("########### Cloud socket seems to have disconnected. Trying to reconnect");
					if (socket.firstConnectionDone) return socket.socket.reconnect();
					clearInterval(socketCheckTimer);
					clearInterval(pingTimer);
					setTimeout(foo,5000);
				}, 5000); 
			}
			else 
				socket.socket.reconnect();
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