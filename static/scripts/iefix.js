if(typeof console == 'undefined') console = {'log':function () {}};
if(!Array.prototype.forEach)
	Array.prototype.forEach = function (f) {
		for (var i=0; i<this.length; i++) f(this[i]);
	}

Date.now = Date.now || function() { return +new Date; }; 

function addScript( src ) {
  var s = document.createElement( 'script' );
  s.setAttribute( 'src', src );
  document.body.appendChild( s );
}

if(typeof JSON == 'undefined') addScript("/static/scripts/json2.js");