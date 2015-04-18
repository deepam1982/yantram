//		https://gist.github.com/jfromaniello/4087861

// XMLHttpRequest to override.
var xhrPath = __rootPath+'/../node_modules/socket.io-client/node_modules/engine.io-client/node_modules/xmlhttprequest';

// Make initial call to require so module is cached.
require(xhrPath);

var name = require.resolve(xhrPath);
// Get cached version.
var cachedXhr = require.cache[name];
var stdXhr = cachedXhr.exports;

// Callbacks exposes an object that callback functions can be added to.
var callbacks = {};
// Example
callbacks.test = function() {
//  console.log("In callback.");
}

var newXhr = function() {
  stdXhr.apply(this, arguments);
  for (method in callbacks) {
    if (typeof callbacks[method] == "function") {
      callbacks[method].apply(this, arguments);
    }
  }
}

newXhr.XMLHttpRequest = newXhr;

cachedXhr.exports = newXhr;
module.exports = newXhr;
module.exports.callbacks = callbacks;