/*
*
*		https://gist.github.com/jfromaniello/4087861
*
*/

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
		originalRequest.apply(this, arguments);
		this.setDisableHeaderCheck(true);
		var stdOpen = this.open;

		this.open = function() {
			stdOpen.apply(this, arguments);
			var header = j.getCookieString('http://cloud.inoho.com');
			this.setRequestHeader('cookie', header);
			this.setRequestHeader('inoho-home-controller', true);
		};
	};


	/*
	* Authenticate first, doing a post to some url 
	* with the credentials for instance
	*/
	var foo = function () {
		request.get({jar: j, url: 'http://cloud.inoho.com/login/', form: {username: __userConfig.get('email'), password: __userConfig.get('password')} }, function (err, resp, body){
	 		console.log('got response!!');
	 		if(err) console.log(err);
	 		if(resp.statusCode != 200) console.log('Cloud login resp code-'+resp.statusCode);	
	 		if (err || resp.statusCode != 200) {setTimeout(foo, 30000); return;}

			/*
			* now we can connect.. and socket.io will send the cookies!
			*/
			var socket = io.connect('http://cloud.inoho.com/inoho-home-controller');
			socket.on('connect', function(){console.log('connected! handshakedddddddddddd');});
			socket.on('disconnect', function(){console.log('connection broken!!');});
			callback(null, socket);
		});	
	}
	foo();
}