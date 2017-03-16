/*
    Copyright 2008-2013
        Matthias Ehmann,
        Michael Gerhaeuser,
        Carsten Miller,
        Bianca Valentin,
        Alfred Wassermann,
        Peter Wilfahrt


    Dual licensed under the Apache License Version 2.0, or LGPL Version 3 licenses.

    You should have received a copy of the GNU Lesser General Public License
    along with JSXCompressor.  If not, see <http://www.gnu.org/licenses/>.

    You should have received a copy of the Apache License along with JSXCompressor.
    If not, see <http://www.apache.org/licenses/>.
*/
(function(){var e,r,n;(function(t){function o(e,r){return C.call(e,r)}function i(e,r){var n,t,o,i,a,u,c,f,s,l,p=r&&r.split("/"),h=k.map,d=h&&h["*"]||{};if(e&&"."===e.charAt(0))if(r){for(p=p.slice(0,p.length-1),e=p.concat(e.split("/")),f=0;e.length>f;f+=1)if(l=e[f],"."===l)e.splice(f,1),f-=1;else if(".."===l){if(1===f&&(".."===e[2]||".."===e[0]))break;f>0&&(e.splice(f-1,2),f-=2)}e=e.join("/")}else 0===e.indexOf("./")&&(e=e.substring(2));if((p||d)&&h){for(n=e.split("/"),f=n.length;f>0;f-=1){if(t=n.slice(0,f).join("/"),p)for(s=p.length;s>0;s-=1)if(o=h[p.slice(0,s).join("/")],o&&(o=o[t])){i=o,a=f;break}if(i)break;!u&&d&&d[t]&&(u=d[t],c=f)}!i&&u&&(i=u,a=c),i&&(n.splice(0,a,i),e=n.join("/"))}return e}function a(e,r){return function(){return h.apply(t,v.call(arguments,0).concat([e,r]))}}function u(e){return function(r){return i(r,e)}}function c(e){return function(r){b[e]=r}}function f(e){if(o(m,e)){var r=m[e];delete m[e],y[e]=!0,p.apply(t,r)}if(!o(b,e)&&!o(y,e))throw Error("No "+e);return b[e]}function s(e){var r,n=e?e.indexOf("!"):-1;return n>-1&&(r=e.substring(0,n),e=e.substring(n+1,e.length)),[r,e]}function l(e){return function(){return k&&k.config&&k.config[e]||{}}}var p,h,d,g,b={},m={},k={},y={},C=Object.prototype.hasOwnProperty,v=[].slice;d=function(e,r){var n,t=s(e),o=t[0];return e=t[1],o&&(o=i(o,r),n=f(o)),o?e=n&&n.normalize?n.normalize(e,u(r)):i(e,r):(e=i(e,r),t=s(e),o=t[0],e=t[1],o&&(n=f(o))),{f:o?o+"!"+e:e,n:e,pr:o,p:n}},g={require:function(e){return a(e)},exports:function(e){var r=b[e];return r!==void 0?r:b[e]={}},module:function(e){return{id:e,uri:"",exports:b[e],config:l(e)}}},p=function(e,r,n,i){var u,s,l,p,h,k,C=[];if(i=i||e,"function"==typeof n){for(r=!r.length&&n.length?["require","exports","module"]:r,h=0;r.length>h;h+=1)if(p=d(r[h],i),s=p.f,"require"===s)C[h]=g.require(e);else if("exports"===s)C[h]=g.exports(e),k=!0;else if("module"===s)u=C[h]=g.module(e);else if(o(b,s)||o(m,s)||o(y,s))C[h]=f(s);else{if(!p.p)throw Error(e+" missing "+s);p.p.load(p.n,a(i,!0),c(s),{}),C[h]=b[s]}l=n.apply(b[e],C),e&&(u&&u.exports!==t&&u.exports!==b[e]?b[e]=u.exports:l===t&&k||(b[e]=l))}else e&&(b[e]=n)},e=r=h=function(e,r,n,o,i){return"string"==typeof e?g[e]?g[e](r):f(d(e,r).f):(e.splice||(k=e,r.splice?(e=r,r=n,n=null):e=t),r=r||function(){},"function"==typeof n&&(n=o,o=i),o?p(t,e,r,n):setTimeout(function(){p(t,e,r,n)},4),h)},h.config=function(e){return k=e,k.deps&&h(k.deps,k.callback),h},n=function(e,r,n){r.splice||(n=r,r=[]),o(b,e)||o(m,e)||(m[e]=[e,r,n])},n.amd={jQuery:!0}})(),n("../node_modules/almond/almond",function(){}),n("jxg",[],function(){var e={};return"object"!=typeof JXG||JXG.extend||(e=JXG),e.extend=function(e,r,n,t){var o,i;n=n||!1,t=t||!1;for(o in r)(!n||n&&r.hasOwnProperty(o))&&(i=t?o.toLowerCase():o,e[i]=r[o])},e.extend(e,{boards:{},readers:{},elements:{},registerElement:function(e,r){e=e.toLowerCase(),this.elements[e]=r},registerReader:function(e,r){var n,t;for(n=0;r.length>n;n++)t=r[n].toLowerCase(),"function"!=typeof this.readers[t]&&(this.readers[t]=e)},shortcut:function(e,r){return function(){return e[r].apply(this,arguments)}},getRef:function(e,r){return e.select(r)},getReference:function(e,r){return e.select(r)},debugInt:function(){var e,r;for(e=0;arguments.length>e;e++)r=arguments[e],"object"==typeof window&&window.console&&console.log?console.log(r):"object"==typeof document&&document.getElementById("debug")&&(document.getElementById("debug").innerHTML+=r+"<br/>")},debugWST:function(){var r=Error();e.debugInt.apply(this,arguments),r&&r.stack&&(e.debugInt("stacktrace"),e.debugInt(r.stack.split("\n").slice(1).join("\n")))},debugLine:function(){var r=Error();e.debugInt.apply(this,arguments),r&&r.stack&&e.debugInt("Called from",r.stack.split("\n").slice(2,3).join("\n"))},debug:function(){e.debugInt.apply(this,arguments)}}),e}),n("utils/zip",["jxg"],function(e){var r=[0,128,64,192,32,160,96,224,16,144,80,208,48,176,112,240,8,136,72,200,40,168,104,232,24,152,88,216,56,184,120,248,4,132,68,196,36,164,100,228,20,148,84,212,52,180,116,244,12,140,76,204,44,172,108,236,28,156,92,220,60,188,124,252,2,130,66,194,34,162,98,226,18,146,82,210,50,178,114,242,10,138,74,202,42,170,106,234,26,154,90,218,58,186,122,250,6,134,70,198,38,166,102,230,22,150,86,214,54,182,118,246,14,142,78,206,46,174,110,238,30,158,94,222,62,190,126,254,1,129,65,193,33,161,97,225,17,145,81,209,49,177,113,241,9,137,73,201,41,169,105,233,25,153,89,217,57,185,121,249,5,133,69,197,37,165,101,229,21,149,85,213,53,181,117,245,13,141,77,205,45,173,109,237,29,157,93,221,61,189,125,253,3,131,67,195,35,163,99,227,19,147,83,211,51,179,115,243,11,139,75,203,43,171,107,235,27,155,91,219,59,187,123,251,7,135,71,199,39,167,103,231,23,151,87,215,55,183,119,247,15,143,79,207,47,175,111,239,31,159,95,223,63,191,127,255],n=[3,4,5,6,7,8,9,10,11,13,15,17,19,23,27,31,35,43,51,59,67,83,99,115,131,163,195,227,258,0,0],t=[0,0,0,0,0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,0,99,99],o=[1,2,3,4,5,7,9,13,17,25,33,49,65,97,129,193,257,385,513,769,1025,1537,2049,3073,4097,6145,8193,12289,16385,24577],i=[0,0,0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11,12,12,13,13],a=[16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15],u=256;return e.Util=e.Util||{},e.Util.Unzip=function(c){function f(){return R+=8,O>X?c[X++]:-1}function s(){B=1}function l(){var e;try{return R++,e=1&B,B>>=1,0===B&&(B=f(),e=1&B,B=128|B>>1),e}catch(r){throw r}}function p(e){var n=0,t=e;try{for(;t--;)n=n<<1|l();e&&(n=r[n]>>8-e)}catch(o){throw o}return n}function h(){J=0}function d(e){j++,G[J++]=e,z.push(String.fromCharCode(e)),32768===J&&(J=0)}function g(){this.b0=0,this.b1=0,this.jump=null,this.jumppos=-1}function b(){for(;;){if(M[H]>=x)return-1;if(U[M[H]]===H)return M[H]++;M[H]++}}function m(){var e,r=P[F];if(17===H)return-1;if(F++,H++,e=b(),e>=0)r.b0=e;else if(r.b0=32768,m())return-1;if(e=b(),e>=0)r.b1=e,r.jump=null;else if(r.b1=32768,r.jump=P[F],r.jumppos=F,m())return-1;return H--,0}function k(e,r,n){var t;for(P=e,F=0,U=n,x=r,t=0;17>t;t++)M[t]=0;return H=0,m()?-1:0}function y(e){for(var r,n,t,o=0,i=e[o];;)if(t=l()){if(!(32768&i.b1))return i.b1;for(i=i.jump,r=e.length,n=0;r>n;n++)if(e[n]===i){o=n;break}}else{if(!(32768&i.b0))return i.b0;o++,i=e[o]}}function C(){var u,c,b,m,C,v,A,j,w,U,x,S,z,I,E,L,O;do if(u=l(),b=p(2),0===b)for(s(),U=f(),U|=f()<<8,S=f(),S|=f()<<8,65535&(U^~S)&&e.debug("BlockLen checksum mismatch\n");U--;)c=f(),d(c);else if(1===b)for(;;)if(C=r[p(7)]>>1,C>23?(C=C<<1|l(),C>199?(C-=128,C=C<<1|l()):(C-=48,C>143&&(C+=136))):C+=256,256>C)d(C);else{if(256===C)break;for(C-=257,w=p(t[C])+n[C],C=r[p(5)]>>3,i[C]>8?(x=p(8),x|=p(i[C]-8)<<8):x=p(i[C]),x+=o[C],C=0;w>C;C++)c=G[32767&J-x],d(c)}else if(2===b){for(A=Array(320),I=257+p(5),E=1+p(5),L=4+p(4),C=0;19>C;C++)A[C]=0;for(C=0;L>C;C++)A[a[C]]=p(3);for(w=q.length,m=0;w>m;m++)q[m]=new g;if(k(q,19,A,0))return h(),1;for(z=I+E,m=0,O=-1;z>m;)if(O++,C=y(q),16>C)A[m++]=C;else if(16===C){if(C=3+p(2),m+C>z)return h(),1;for(v=m?A[m-1]:0;C--;)A[m++]=v}else{if(C=17===C?3+p(3):11+p(7),m+C>z)return h(),1;for(;C--;)A[m++]=0}for(w=T.length,m=0;w>m;m++)T[m]=new g;if(k(T,I,A,0))return h(),1;for(w=T.length,m=0;w>m;m++)q[m]=new g;for(j=[],m=I;A.length>m;m++)j[m-I]=A[m];if(k(q,E,j,0))return h(),1;for(;;)if(C=y(T),C>=256){if(C-=256,0===C)break;for(C-=1,w=p(t[C])+n[C],C=y(q),i[C]>8?(x=p(8),x|=p(i[C]-8)<<8):x=p(i[C]),x+=o[C];w--;)c=G[32767&J-x],d(c)}else d(C)}while(!u);return h(),s(),0}function v(){var e,r,n,t,o,i,a,c,s=[];try{if(z=[],L=!1,s[0]=f(),s[1]=f(),120===s[0]&&218===s[1]&&(C(),E[I]=[z.join(""),"geonext.gxt"],I++),31===s[0]&&139===s[1]&&(S(),E[I]=[z.join(""),"file"],I++),80===s[0]&&75===s[1]&&(L=!0,s[2]=f(),s[3]=f(),3===s[2]&&4===s[3])){for(s[0]=f(),s[1]=f(),A=f(),A|=f()<<8,c=f(),c|=f()<<8,f(),f(),f(),f(),a=f(),a|=f()<<8,a|=f()<<16,a|=f()<<24,i=f(),i|=f()<<8,i|=f()<<16,i|=f()<<24,o=f(),o|=f()<<8,o|=f()<<16,o|=f()<<24,t=f(),t|=f()<<8,n=f(),n|=f()<<8,e=0,N=[];t--;)r=f(),"/"===r|":"===r?e=0:u-1>e&&(N[e++]=String.fromCharCode(r));for(w||(w=N),e=0;n>e;)r=f(),e++;j=0,8===c&&(C(),E[I]=Array(2),E[I][0]=z.join(""),E[I][1]=N.join(""),I++),S()}}catch(l){throw l}}var A,j,w,U,x,S,z=[],I=0,E=[],G=Array(32768),J=0,L=!1,O=c.length,X=0,B=1,R=0,T=Array(288),q=Array(32),F=0,P=null,H=(Array(64),Array(64),0),M=Array(17),N=[];M[0]=0,S=function(){var e,r,n,t,o,i,a=[];if(8&A&&(a[0]=f(),a[1]=f(),a[2]=f(),a[3]=f(),80===a[0]&&75===a[1]&&7===a[2]&&8===a[3]?(e=f(),e|=f()<<8,e|=f()<<16,e|=f()<<24):e=a[0]|a[1]<<8|a[2]<<16|a[3]<<24,r=f(),r|=f()<<8,r|=f()<<16,r|=f()<<24,n=f(),n|=f()<<8,n|=f()<<16,n|=f()<<24),L&&v(),a[0]=f(),8===a[0]){if(A=f(),f(),f(),f(),f(),f(),t=f(),4&A)for(a[0]=f(),a[2]=f(),H=a[0]+256*a[1],o=0;H>o;o++)f();if(8&A)for(o=0,N=[],i=f();i;)("7"===i||":"===i)&&(o=0),u-1>o&&(N[o++]=i),i=f();if(16&A)for(i=f();i;)i=f();2&A&&(f(),f()),C(),e=f(),e|=f()<<8,e|=f()<<16,e|=f()<<24,n=f(),n|=f()<<8,n|=f()<<16,n|=f()<<24,L&&v()}},e.Util.Unzip.prototype.unzipFile=function(e){var r;for(this.unzip(),r=0;E.length>r;r++)if(E[r][1]===e)return E[r][0];return""},e.Util.Unzip.prototype.unzip=function(){return v(),E}},e.Util}),n("utils/encoding",["jxg"],function(e){var r=0,n=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,8,8,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,10,3,3,3,3,3,3,3,3,3,3,3,3,4,3,3,11,6,6,6,5,8,8,8,8,8,8,8,8,8,8,8,0,12,24,36,60,96,84,12,12,12,48,72,12,12,12,12,12,12,12,12,12,12,12,12,12,0,12,12,12,12,12,0,12,0,12,12,12,24,12,12,12,12,12,24,12,24,12,12,12,12,12,12,12,12,12,24,12,12,12,12,12,24,12,12,12,12,12,12,12,24,12,12,12,12,12,12,12,12,12,36,12,36,12,12,12,36,12,12,12,12,12,36,12,36,12,12,12,36,12,12,12,12,12,12,12,12,12,12];return e.Util=e.Util||{},e.Util.UTF8={encode:function(e){var r,n,t="",o=e.length;if(e=e.replace(/\r\n/g,"\n"),"function"==typeof unescape&&"function"==typeof encodeURIComponent)return unescape(encodeURIComponent(e));for(r=0;o>r;r++)n=e.charCodeAt(r),128>n?t+=String.fromCharCode(n):n>127&&2048>n?(t+=String.fromCharCode(192|n>>6),t+=String.fromCharCode(128|63&n)):(t+=String.fromCharCode(224|n>>12),t+=String.fromCharCode(128|63&n>>6),t+=String.fromCharCode(128|63&n));return t},decode:function(e){var t,o,i,a=0,u=0,c=r,f=[],s=e.length,l=[];for(t=0;s>t;t++)o=e.charCodeAt(t),i=n[o],u=c!==r?63&o|u<<6:255>>i&o,c=n[256+c+i],c===r&&(u>65535?f.push(55232+(u>>10),56320+(1023&u)):f.push(u),a++,0===a%1e4&&(l.push(String.fromCharCode.apply(null,f)),f=[]));return l.push(String.fromCharCode.apply(null,f)),l.join("")},asciiCharCodeAt:function(e,r){var n=e.charCodeAt(r);if(n>255)switch(n){case 8364:n=128;break;case 8218:n=130;break;case 402:n=131;break;case 8222:n=132;break;case 8230:n=133;break;case 8224:n=134;break;case 8225:n=135;break;case 710:n=136;break;case 8240:n=137;break;case 352:n=138;break;case 8249:n=139;break;case 338:n=140;break;case 381:n=142;break;case 8216:n=145;break;case 8217:n=146;break;case 8220:n=147;break;case 8221:n=148;break;case 8226:n=149;break;case 8211:n=150;break;case 8212:n=151;break;case 732:n=152;break;case 8482:n=153;break;case 353:n=154;break;case 8250:n=155;break;case 339:n=156;break;case 382:n=158;break;case 376:n=159;break;default:}return n}},e.Util.UTF8}),n("utils/base64",["jxg","utils/encoding"],function(e,r){function n(e,r){return 255&e.charCodeAt(r)}function t(e,r){var n=o.indexOf(e.charAt(r));if(-1===n)throw Error("JSXGraph/utils/base64: Can't decode string (invalid character).");return n}var o="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",i="=";return e.Util=e.Util||{},e.Util.Base64={encode:function(e){var t,a,u,c,f,s=[];for(f=r.encode(e),u=f.length,c=u%3,t=0;u-c>t;t+=3)a=n(f,t)<<16|n(f,t+1)<<8|n(f,t+2),s.push(o.charAt(a>>18),o.charAt(63&a>>12),o.charAt(63&a>>6),o.charAt(63&a));switch(c){case 1:a=n(f,u-1),s.push(o.charAt(a>>2),o.charAt(63&a<<4),i,i);break;case 2:a=n(f,u-2)<<8|n(f,u-1),s.push(o.charAt(a>>10),o.charAt(63&a>>4),o.charAt(63&a<<2),i)}return s.join("")},decode:function(e,n){var o,a,u,c,f,s,l=[],p=[];if(o=e.replace(/[^A-Za-z0-9\+\/=]/g,""),u=o.length,0!==u%4)throw Error("JSXGraph/utils/base64: Can't decode string (invalid input length).");for(o.charAt(u-1)===i&&(c=1,o.charAt(u-2)===i&&(c=2),u-=4),a=0;u>a;a+=4)f=t(o,a)<<18|t(o,a+1)<<12|t(o,a+2)<<6|t(o,a+3),p.push(f>>16,255&f>>8,255&f),0===a%1e4&&(l.push(String.fromCharCode.apply(null,p)),p=[]);switch(c){case 1:f=t(o,u)<<12|t(o,u+1)<<6|t(o,u+2),p.push(f>>10,255&f>>2);break;case 2:f=t(o,a)<<6|t(o,a+1),p.push(f>>4)}return l.push(String.fromCharCode.apply(null,p)),s=l.join(""),n&&(s=r.decode(s)),s},decodeAsArray:function(e){var r,n=this.decode(e),t=[],o=n.length;for(r=0;o>r;r++)t[r]=n.charCodeAt(r);return t}},e.Util.Base64}),n("../build/compressor.deps.js",["jxg","utils/zip","utils/base64"],function(e,r,n){return e.decompress=function(e){return unescape(new r.Unzip(n.decodeAsArray(e)).unzip()[0][0])},e}),window.JXG=r("../build/compressor.deps.js")})();



// var BaseView = Backbone.View.extend({
//     name : 'BasicViewClass',
//     _getJsonToRenderTemplate : function () {return (this.model)?this.model.toJSON():{};},
//     render  :   function () {
//         var template = (typeof this.template != 'undefined')?this.template:_.template($(this.templateSelector).html());
//         this.$el.html(template(this._getJsonToRenderTemplate()));
//         return this;
//     },
//     erase   :   function () {
//         this.$el.html("");
//         return this;
//     },
//     repaint :   function () {
//         this.erase().render();
//         return this;
//     }
// })

var BaseView = Backbone.View.extend({
    name : 'BasicViewClass',
    bindFunctions : [],
    initialize: function(obj) {
        _.each(this.bindFunctions, function(funcName){_.bind(this[funcName], this);}, this);
//        _.extend(this, obj);
        this._attachModelEvents();
        this._attachCollectionEvents();
        _.each(this.subViews, function (orignalParams) {
            this._createSubView(orignalParams);
        }, this);
        _.each(this.subViewArrays, function(orignalParams){
            !orignalParams.createOnRender && this._createSubViewArray(orignalParams)
        }, this);
	},
    _createSubView : function (orignalParams) {
        var params = _.extend({}, orignalParams);
        _.each(params.eval, function(evalStr){eval('params.'+evalStr);}, this);
        if(params.model && _.isString(params.model)) eval('params.model='+params.model);
        if(params.collection && _.isString(params.collection)) eval('params.collection='+params.collection);
        params.parentView=this;
        if(params.viewClassName)
            this[params.reference] = new window[params.viewClassName](_.omit(params,'events'));
        return this[params.reference];
    },
    _createSubViewArray : function (orignalParams) {
            var params = _.extend({}, orignalParams);
            _.each(params.eval, function(evalStr){eval('params.'+evalStr);}, this);
            if(params.array && _.isString(params.array)) eval('params.arr='+params.array);
            params.parentView=this;
            var arr = params.arr; params.array=null; var newArr=[];
            _.each(arr.models||arr, function (model, indx) {
                params.index = indx; params.model=model;
                newArr.push(new window[params.viewClassName](_.omit(params,'events')));
            }, this);
            this[params.reference] = newArr;
            if(typeof arr.on == 'function') {
                arr.on('add', _.bind(this._onNewModelInSubViewArray, this, params), this);
                arr.on('remove', _.bind(this._onModelRemovalFromSubViewArray, this, params), this);
                arr.on('change', _.bind(this._onModelChangeOfSubViewArray, this, params), this);
                arr.on('sort', _.bind(this._onModelSortOfSubViewArray, this, params), this);
            }
    },
    _onModelSortOfSubViewArray : function (params, list) {
        var idList = list.pluck('id'), noChange=true, idViewMap = {}, view;
        for (var indx=0; indx<this[params.reference].length; indx++) {
            idViewMap[(view = this[params.reference][indx]).model.id] = view;
            noChange && (this[params.reference][indx].model.id != idList[indx]) && (noChange=false); 
        }
        if(noChange) return;
        console.log('Order Changed')
        var $parent = (params.parentSelector)?this.$el.find(params.parentSelector):null;
        if (!$parent || !$parent.length) $parent=this.$el;
        this[params.reference]=[];
        for (var indx=0; indx<idList.length; indx++) {
            this[params.reference].push(view = idViewMap[idList[indx]]);
            $parent.children().eq(indx).before(view.$el);
        }

    },
    _onModelChangeOfSubViewArray : function (params, model) {
        if(params.recreateOnRepaint) {
            var index = this._onModelRemovalFromSubViewArray(params, model);
            this._onNewModelInSubViewArray(params, model, index);
        }
        else    
        _.each(this[params.reference], function (view) {
            if(view.model !== model) return;
            view.repaint();
        }, this);
    },
    _onModelRemovalFromSubViewArray : function (params, model) {
        var index = -1, retindx = -1;
        _.each(this[params.reference], function (view) {
            index++;
            if(view.model !== model) return;
            this[params.reference] = _.without(this[params.reference], view);
            view.removeView();
            retindx = index
        }, this);
        return retindx;
    },
    //TODO write function similar to following for remove and change as well.
    _onNewModelInSubViewArray : function (params, model, list) {
        var index = list.indexOf(model)
        params.model=model;
        var view = new window[params.viewClassName](_.omit(params,'events'));
        var $parent = (params.parentSelector)?this.$el.find(params.parentSelector):null;
        if (!$parent || !$parent.length) $parent=this.$el;
        $parent.append(view.$el);
        if(this.rendered) view.render();
        if(typeof index == 'number') {
            $parent.children().eq(index).before($parent.children().last());
            this[params.reference].splice(index, 0, view);
        }
        else 
            this[params.reference].push(view);
        return view;
    },
    _attachModelEvents:function(){
        _.each(this.modelEvents, function (value, key) {
            if (this.model) this.model.on(key, this[value], this);
        }, this);
    },
    _attachCollectionEvents:function(){
         _.each(this.collectionEvents, function (value, key) {
            if (this.collection) this.collection.on(key, this[value], this);
        }, this);
     },
//    subViews : [{'viewClassName':'SubViewClass', 'reference':'subViewObj', 'parentSelector':'#subViewCont', 'model':'this.model'}],
//    subViewArrays : [{'viewClassName':'SubViewClass', 'reference':'subViewArray', 'parentSelector':'#subViewCont', 'array':'this.collection'}]
    subViews : [],
    subViewArrays : [],
    modelEvents : {},
    collectionEvents : {},
    _getJsonToRenderTemplate : function () {return (this.model)?this.model.toJSON():{};},
    _reDelegateEvents : function () {
        _.each(this.subViews, function (params) { this[params.reference].delegateEvents();}, this);
        _.each(this.subViewArrays, function (params) {_.each(this[params.reference], function (viewObj) {viewObj.delegateEvents();}, this);}, this);
        this.delegateEvents();
    },
	render	:	function () {
		var template = (typeof this.template != 'undefined')?this.template:
                        (this.templateSelector)?_.template($(this.templateSelector).html()):null;
		if(template) this.$el.html(template(this._getJsonToRenderTemplate()));
        _.each(this.subViews, function (params) { 
            if(!params) return;
            var ref = this[params.reference];
            if(!ref) ref = this._createSubView(params);
            var $parent = (params.parentSelector)?this.$el.find(params.parentSelector):null;
            if (!$parent || !$parent.length) $parent=this.$el; 
            $parent.append(ref.$el);
            if (!params.supressRender && !ref.rendered) ref.render()
            var events = params.events;
            if (events) for(var eventName in events) {ref.on(eventName, this[events[eventName]], this)}
        }, this);
        _.each(this.subViewArrays, function(orignalParams){
            orignalParams.createOnRender && this._createSubViewArray(orignalParams);
        }, this);
        _.each(this.subViewArrays, function (params) {
            if(!params) return;
            var events = params.events;
            _.each(this[params.reference], function (viewObj) {
            	var $parent = (params.parentSelector)?this.$el.find(params.parentSelector):null;
            	if (!$parent || !$parent.length) $parent=this.$el; 
                $parent.append(viewObj.$el);
                if (!params.supressRender && !viewObj.rendered) viewObj.render();
                if (events) for(var eventName in events) {viewObj.on(eventName, this[events[eventName]], this)}
            }, this);
        }, this);
        this._reDelegateEvents();
        this.rendered = true;
		return this;
	},
    removeView	:	function () {
        _.each(this.modelEvents, function (value, key) {
            if (this.model) this.model.off(key, this[value], this);
        }, this);
        _.each(this.collectionEvents, function (value, key) {
            if (this.collection) this.collection.off(key, this[value], this);
        }, this);
    	this.erase();
        _.each(this.subViewArrays, function(params){
            !params.createOnRender && this._removeSubViewArray(params)
        }, this);
        _.each(this.subViews, function (params) {
            if(!params) return;
            this[params.reference] && this[params.reference].removeView();
        }, this);
        this.remove();
    },
    _removeSubViewArray : function (params) {
        if(!params) return;
        _.each(this[params.reference], function (viewObj) {viewObj.removeView();});
        if(params.array && _.isString(params.array)) eval('var arr='+params.array);
        if(arr && typeof arr.on == 'function') {
            arr.off('add', null, this);
            arr.off('remove', null, this);
            arr.off('change', null, this);
            arr.off('sort', null, this);
        }
    },
    erase	:	function () {
        _.each(this.subViewArrays, function (params) {
            if(!params) return;
            var events = params.events;
            _.each(this[params.reference], function (viewObj) {
                if (events) for(var eventName in events){viewObj.off(eventName, this[events[eventName]], this)}
                viewObj.rendered && viewObj.erase();
            }, this);
        }, this);
        _.each(this.subViewArrays, function(params){
            params.createOnRender && this._removeSubViewArray(params)
        }, this);
        _.each(this.subViews, function (params) {
            if(!params) return;
            var events = params.events,viewObj=this[params.reference];
            if (events) for(var eventName in events){viewObj.off(eventName, this[events[eventName]], this)}
            viewObj && viewObj.rendered && viewObj.erase();
            if(params.recreateOnRepaint) {
                viewObj && viewObj.removeView();
                this[params.reference] = null;
            }
        }, this);
    	this.$el.html("");
        this.rendered = false;
    	return this;
    },
    _detachModelEvents:function(){
        _.each(this.modelEvents, function (value, key) {
            if (this.model) this.model.off(key, this[value], this);
        }, this);
    },
    _detachCollectionEvents:function(){
        _.each(this.collectionEvents, function (value, key) {
            if (this.collection) this.collection.off(key, this[value], this);
        }, this);
    },
    repaint	:	function () {
        if(this.avoidRepaint) {this.avoidRepaint=false; return this;}
        if(!this.rendered) return this;
        this._detachModelEvents();
        this._detachCollectionEvents();
    	this.erase().render();
        this._attachModelEvents();
        this._attachCollectionEvents();
    	return this;
    },
    trigger:function(eventName, args){
        Backbone.View.prototype.trigger.call(this,eventName, args);
        if(typeof this.parentView != 'undefined') this.parentView.trigger(eventName, args);
        return this;
    },
    show:function(){
        this.$el.show();
    },
    hide:function(){
        this.$el.hide();
    }

});



GZI = 400; //global z-index
Backdrop = BaseView.extend({
	render	:	function () { 
		//if(!this.options.zIndex) 
			this.options.zIndex = GZI++;
		this.$el = $('<div style="width:100%; height:100%; background-color:black;opacity:0.7;position:absolute; top:0; left:0;"/>');
		this.$el.css('z-index', this.options.zIndex)
		if(!this.options.$parent) this.options.$parent = $('body')
		this.options.$parent.append(this.$el);
	},
	pullItOver : function ($elm) {
		if(!this.elmArr) this.elmArr = [];
		$elm.attr('oldStyle', $elm.attr('style'));
		if(this.cloneOnPullup) $elm.after($elm.clone());
		var left = $elm.position().left - this.$el.position().left;
		var top = $elm.position().top - this.$el.position().top;
		$elm.css('left', left);
		$elm.css('top', top);
		var match = $elm.attr('style').match(/[^-]width[: ]+([0-9]+)/);
		match = (match)?(match[1]+'px'):'auto';
		$elm.attr('cssWidth', match);
		$elm.css('width', $elm.width());
		$elm.css('max-height', $(window).height());
		$elm.css('z-index', this.options.zIndex+1);
		$elm.css('position', 'absolute');
		$elm.css('overflow', 'auto');
		$elm.addClass('onBackdrop');
		this.elmArr.push($elm);
	},
	erase : function () {
		_.each(this.elmArr, function ($elm) {
			$elm.css('width', $elm.attr('cssWidth'));
			$elm.attr('style', $elm.attr('oldStyle'));
			$elm.removeClass('onBackdrop');
			if(this.cloneOnPullup) $elm.next().remove();
		}, this);
		this.$el.remove();
		this.GZI--;
		return this;
	}
});


BasicDialog = BaseView.extend({
	templateSelector:"#basicDilogTemplate",
	events: {
		"tap .ok" : "hide",
		"tap .cancel" : "cancel"
	},
	cancel : function () {
		this.hide(null, false);
	},
	show : function (msg) {
		this.render();
		$('#mainCont').append(this.$el);
		this.$el.find('.msgDiv').html(msg || "Dummy message!!");
		this.$el.find('#ok').show();
		this._show();
	},
	_show : function () {
		this.bd = new Backdrop({'$parent':$('#mainCont')});
		this.bd.render();
		this.bd.pullItOver(this.$el);
		var left = Math.max(0,($(window).width() - this.$el.width())/2);
		var top = Math.max(0,($(window).height() - this.$el.height())/2);
		this.$el.css('position','fixed').css('top',top+'px').css('left',left+'px');
		$('body').css('overflow', 'hidden');		
	},
	hide : function (event, flag) {
		$('body').css('overflow', '');
		this.$el.css('position','').css('top','').css('left','');
		this.bd.removeView();
		this.bd = null;
		this.erase();
		return this;
	}
});

ConfirmDialog = BasicDialog.extend( {
	show : function (msg, clbk) {
		this.clbk = clbk;
		BasicDialog.prototype.show.apply(this, arguments);
	},
	_show : function () {
		this.$el.find('#ok').hide();
		this.$el.find('#yes').show();
		this.$el.find('#no').show();
		BasicDialog.prototype._show.apply(this, arguments);
	},
	hide : function (event, flag) {
		BasicDialog.prototype.hide.apply(this, arguments);
		this.clbk && this.clbk((flag === false)?false:true);
	}
})


confirmDialog = new ConfirmDialog;
alertDialog = new BasicDialog;



BasicSwitch = BaseView.extend({
	templateSelector:"#basicSwitchTemplate",
	events: {
		"tap .toggelSwitch" : "toggelSwitch"
	},
	toggelSwitch : function (event) {
		if(this.model.get('disabled')) return;
//		this.model.set('state', (this.model.get('state')=="on")?"off":"on");
		var $tar = $(event.target);
		$(this.$el.children()[0]).append('<i class="switchToggleSpinner brightColor fa fa-spinner fa-spin"></i>');
		var calbackfunc = _.bind(function(status) {}, this);
		_.defer(_.bind(this.model.toggelSwitch, this.model), calbackfunc)
//		this.model.toggelSwitch(calbackfunc);
	}
})


Popup = {
	events: {
		"tap .popupPannel .cross" : "hidePopUp"
	},
	showPopUp : function (calbackOnHide) {
		this.calbackOnHide = calbackOnHide;
		this.bd = new Backdrop({'$parent':$('#mainCont')});
		this.bd.render();
		if(!this.avoidCloneOnPullup) 
			this.bd.cloneOnPullup = true;
		var $last = $(_.last(this.$el.find('.popupPannel'))).show();
		this.bd.pullItOver($last);
		if(this.keepPopupFixed) {
			var left = $last.offset().left;
			var top = Math.max(0,($(window).height() - $last.height())/2);
			$last.css('top', top+'px').css('left', left+'px').css('position','fixed');
		}
		
//		$last[0].scrollIntoView();
		return $last;
	},
	hidePopUp : function () {
		if(!this.bd) return;
		this.bd.removeView();
		this.bd = null;
		var $last = $(_.last(this.$el.find('.popupPannel'))).hide();
		$last.css('position', 'inherit').css('top', '').css('left', '');
		(typeof this.calbackOnHide == 'function') && this.calbackOnHide(this.findValueOnHide());
	},
	findValueOnHide : function() {return null;}

}

RangeSelector1 = BaseView.extend(Popup).extend({
	name : "RangeSelector",
	templateSelector:"#editRangeTemplate",
	keepPopupFixed : true,
	avoidCloneOnPullup : false,
	events: {
		"tap .popupPannel > .cross" : "hidePopUp"
	},
	findValueOnHide : function() {return this.$el.find('.rangeSelector').val();},
	setValue : function(num) {this.$el.find('.rangeSelector').val(num);}
});

var rangeSelector1 = new RangeSelector1({'el':$("#rangeSelectorCont")});
rangeSelector1.render();	


IpCamaraFeedViewer = BaseView.extend(Popup).extend({
	templateSelector:"#ipCamaraFeedViewer",
	keepPopupFixed : true,
	avoidCloneOnPullup : true,
	events: {
		"tap .popupPannel > .cross" : "hidePopUp"
	},
	showFeed : function (camModel, groupModel) {
		this.hidePopUp();
		var switchId = camModel.get("switchID"), devId = camModel.get("devId"), groupId = camModel.get("groupId");
		var src = '/cam/'+switchId;
//		var groupModel = gC.get(groupId);
		var camIndex = -1;
		_.each(groupModel.get('controls'), function(ctrl, i){
			if(ctrl.devId == camModel.get('devId') && ctrl.switchID == camModel.get('switchID'))
				camIndex = i;
		});
		var cameraName = camModel.get("name");
		this.$el.find('.cameraName').html(cameraName);		
		this.$el.find('.camFeedCont').html("<img style='width:100%' src='"+src+"'>")

		this.grpView = new GroupView1({model:groupModel});
		this.$el.find('.camGroupCont').append(this.grpView.$el);
		this.grpView.render();
		(camIndex+1) && this.grpView.switchViewArray[camIndex].$el.hide();

		//this.grpView.$el.find('.translucentBg50').removeClass('translucentBg50').addClass('theamBGColor');

		this.showPopUp();
	},
	hidePopUp : function () {
		this.grpView && this.grpView.removeView();
		this.grpView = null;
		this.$el.find('.camGroupCont').html=("");
		this.$el.find('.camFeedCont img').attr("src","about:blank"); // this is to make sure that stream ends
		return Popup.hidePopUp.apply(this, arguments);
	}
});


IpCamaraSwitch = BasicSwitch.extend(Popup).extend({
	events: {
		"tap .toggelSwitch" : "showCameraFeed"
	},
	showCameraFeed : function () {
		ipCamaraFeedViewer.showFeed(this.model, this.options.parentView.model);
	}
})



	// render : function () {
	// 	BaseView.prototype.render.apply(this, arguments);
	// 	this.$el.find('.iconPartition img')[0].onselectstart = function() {
	//         return false;
	//     }
	// 	return this;
	// }



function remoteStyle1 () {
	return "\
	<style>\
		#singleRemotePannel .buttonBG {\
			height:42px; width:42px; line-height:43px; border-radius: 30px; font-size: 30px; text-align:center;\
			padding:0px; margin:auto; color:white; position:relative; cursor:pointer;}\
		@-moz-document url-prefix() {	#singleRemotePannel .buttonBG { line-height:51px;}}\
		#singleRemotePannel .buttonBG.statePressed {border-radius: 10px;} 	\
		#singleRemotePannel .numberButton {\
			width:33%; float:left; text-align:center;margin:10px 0; }\
		.arrowView {text-align:center; position:relative; width:130px; margin: auto;}\
		.arrowView .absDiv {position:absolute;color:white;}\
		#singleRemotePannel .font20 .buttonBG{font-size: 20px;}\
		#singleRemotePannel .tick{top:-2px;right:-6px; background-color: inherit; display:none;}\
		#singleRemotePannel .maskTransparent{z-index:5}\
	</style>\
	"
}
function miniGenricHtml () {
	return "\
	<div class='smallView'>\
		<div class='leftDiv' style='width:45%; float:left; text-align:center;'>\
			<div class='btn buttonBG theamBGColor' code='KEY_VOLUMEUP'><i class='fa fa-chevron-circle-up'></i><div class='tick'></div><div class='maskTransparent'></div></div>\
			<br/>\
			<span class='theamTextColor font18'>CH-1</span>\
			<br/><br/>\
			<div class='btn buttonBG theamBGColor' code='KEY_VOLUMEDOWN'><i class='fa fa-chevron-circle-down'></i><div class='tick'></div><div class='maskTransparent'></div></div>\
		</div>\
		<div class='rightDiv' style='width:45%; float:right; text-align:center;'>\
			<div class='btn buttonBG theamBGColor' code='KEY_CHANNELUP'><i class='fa fa-chevron-circle-up'></i><div class='tick'></div><div class='maskTransparent'></div></div>\
			<br/>\
			<span class='theamTextColor font18'>CH-2</span>\
			<br/><br/>\
			<div class='btn buttonBG theamBGColor' code='KEY_CHANNELDOWN'><i class='fa fa-chevron-circle-down'></i><div class='tick'></div><div class='maskTransparent'></div></div>\
		</div>\
		<div style='clear:both;'></div>\
	</div>\
	"
}
function miniSectionRemoteHtml () {
	return "\
	<div class='smallView'>\
		<div class='leftDiv' style='width:33%; margin-top:50px; float:left; text-align:center;'>\
			<div class='btn buttonBG theamBGColor' code='KEY_VOLUMEUP'><i class='fa fa-chevron-circle-up'></i><div class='tick'></div><div class='maskTransparent'></div></div>\
			<br/>\
			<span class='theamTextColor font18'>VOL</span>\
			<br/><br/>\
			<div class='btn buttonBG theamBGColor' code='KEY_VOLUMEDOWN'><i class='fa fa-chevron-circle-down'></i><div class='tick'></div><div class='maskTransparent'></div></div>\
		</div>\
		<div class='centerDiv' style='width:33%; margin-top:0px; float:left; text-align:center;'>\
			<div class='btn buttonBG theamBGColor' code='KEY_POWER'><i class='fa fa-power-off'></i><div class='tick'></div><div class='maskTransparent'></div></div>\
			<br/><br/><br/>\
			<div class='btn buttonBG theamBGColor' code='KEY_MUTE'><i style='position:absolute; left:12px; font-size: 28px; top:7px;' class='fa fa-volume-down'></i><span><i>/</i></span><div class='tick theamBGColor'></div><div class='maskTransparent'></div></div>\
		</div>\
		<div class='rightDiv' style='width:33%; margin-top:50px; float:left; text-align:center;'>\
			<div class='btn buttonBG theamBGColor' code='KEY_CHANNELUP'><i class='fa fa-chevron-circle-up'></i><div class='tick'></div><div class='maskTransparent'></div></div>\
			<br/>\
			<span class='theamTextColor font18'>CH</span>\
			<br/><br/>\
			<div class='btn buttonBG theamBGColor' code='KEY_CHANNELDOWN'><i class='fa fa-chevron-circle-down'></i><div class='tick'></div><div class='maskTransparent'></div></div>\
		</div>\
		<div style='clear:both;'></div>\
	</div>\
	"
}
function nevigationPannelHtml () {
	return "\
	<div class='arrowView'>\
		<i class='fa fa-arrows theamColor' style='font-size:130px;'></i>\
		<div class='btn absDiv' code='KEY_UP' style='width:67px; height:26px; top:0px; left:30px;'><div class='tick' style='background-color:black;'></div><div class='maskTransparent'></div></div>\
		<div class='btn absDiv' code='KEY_LEFT' style='width:26px; height:67px; top:30px; left:0px;'><div class='tick' style='background-color:black;'></div><div class='maskTransparent'></div></div>\
		<div class='btn absDiv' code='KEY_DOWN' style='width:67px; height:26px; bottom:0px; left:30px;'><div class='tick' style='background-color:black;'></div><div class='maskTransparent'></div></div>\
		<div class='btn absDiv' code='KEY_RIGHT' style='width:26px; height:67px; top:30px; right:0px;'><div class='tick' style='background-color:black;'></div><div class='maskTransparent'></div></div>\
		<div class='btn absDiv theamBGColor' code='KEY_OK' style='width:55px; height:55px; border:10px solid white; top:27px; left:27px; border-radius:20px; line-height:56px;'>OK<div class='tick'></div><div class='maskTransparent'></div></div>\
	</div>\
	<div>\
		<div class='rightDiv' style='width:33%; margin-top:-40px; float:left; text-align:center;'>\
			<div class='btn buttonBG theamBGColor' code='KEY_MENU'><i class='fa fa-list-ul'></i><div class='tick'></div><div class='maskTransparent'></div></div>\
		</div>\
		<div class='leftDiv' style='width:33%; margin-top:-40px; float:right; text-align:center;'>\
			<div code='KEY_BACK' class='btn buttonBG theamBGColor'><i class='fa fa-reply'></i><div class='tick'></div><div class='maskTransparent'></div></div>\
		</div>\
	</div>\
	"
}
function numberKeyPannel () {
	return"\
	<div class='largeView'>\
		<div class='numberButton' ><div code='KEY_1' class='btn buttonBG theamBGColor'>1<div class='tick'></div><div class='maskTransparent'></div></div></div>\
		<div class='numberButton' ><div code='KEY_2' class='btn buttonBG theamBGColor'>2<div class='tick'></div><div class='maskTransparent'></div></div></div>\
		<div class='numberButton' ><div code='KEY_3' class='btn buttonBG theamBGColor'>3<div class='tick'></div><div class='maskTransparent'></div></div></div>\
		<div class='numberButton' ><div code='KEY_4' class='btn buttonBG theamBGColor'>4<div class='tick'></div><div class='maskTransparent'></div></div></div>\
		<div class='numberButton' ><div code='KEY_5' class='btn buttonBG theamBGColor'>5<div class='tick'></div><div class='maskTransparent'></div></div></div>\
		<div class='numberButton' ><div code='KEY_6' class='btn buttonBG theamBGColor'>6<div class='tick'></div><div class='maskTransparent'></div></div></div>\
		<div class='numberButton' ><div code='KEY_7' class='btn buttonBG theamBGColor'>7<div class='tick'></div><div class='maskTransparent'></div></div></div>\
		<div class='numberButton' ><div code='KEY_8' class='btn buttonBG theamBGColor'>8<div class='tick'></div><div class='maskTransparent'></div></div></div>\
		<div class='numberButton' ><div code='KEY_9' class='btn buttonBG theamBGColor'>9<div class='tick'></div><div class='maskTransparent'></div></div></div>\
		<div class='numberButton' ><div code='KEY_AV' class='btn buttonBG theamBGColor' style='font-size:20px;'>AV<div class='tick'></div><div class='maskTransparent'></div></div></div>\
		<div class='numberButton' ><div code='KEY_0' class='btn buttonBG theamBGColor'>0<div class='tick'></div><div class='maskTransparent'></div></div></div>\
		<div class='numberButton' ><div code='KEY_HOME' class='btn buttonBG theamBGColor'><i class='fa fa-home'></i><div class='tick'></div><div class='maskTransparent'></div></div></div>\
		<div style='clear:both;'></div>\
	</div>\
	"	
};
function acControlHtml () {
	return "\
	<div class='smallView'>\
		<div class='leftDiv' style='width:33%; float:left; text-align:center;'>\
			<div class='btn buttonBG theamBGColor' code='KEY_POWER'><i class='fa fa-power-off'></i><div class='tick'></div><div class='maskTransparent'></div></div>\
			<span class='theamTextColor font16'>ON</span>\
			<br/><br/>\
			<div class='btn buttonBG theamBGColor' code='KEY_FANEUP'><i class='fa fa-chevron-circle-up'></i><div class='tick'></div><div class='maskTransparent'></div></div>\
			<br/>\
			<div class='btn buttonBG theamBGColor' code='KEY_SWINGLEFT'><i class='fa fa-chevron-circle-left'></i><div class='tick'></div><div class='maskTransparent'></div></div>\
		</div>\
		<div class='centerDiv' style='width:33%; margin-top:10px; float:left; text-align:center;'>\
			<br/><br/><br/><br/>\
			<span class='theamTextColor font16'>FAN</span>\
			<br/><br/><br/>\
			<span class='theamTextColor font16'>SWING</span>\
		</div>\
		<div class='rightDiv' style='width:33%; float:right; text-align:center;'>\
			<div class='btn buttonBG theamBGColor' code='KEY_POWER_OFF'><i class='fa fa-power-off'></i><div class='tick'></div><div class='maskTransparent'></div></div>\
			<span class='theamTextColor font16'>OFF</span>\
			<br/><br/>\
			<div class='btn buttonBG theamBGColor' code='KEY_FANDOWN'><i class='fa fa-chevron-circle-down'></i><div class='tick'></div><div class='maskTransparent'></div></div>\
			<br/>\
			<div class='btn buttonBG theamBGColor' code='KEY_SWINGRIGHT'><i class='fa fa-chevron-circle-right'></i><div class='tick'></div><div class='maskTransparent'></div></div>\
		</div>\
		<div style='clear:both;'></div>\
	</div>\
	"
}

function acTemperaturePannel () {
	return"\
	<div class='largeView font20'>\
		<div class='numberButton' ><div code='KEY_16' class='btn buttonBG theamBGColor'>16<div class='tick'></div><div class='maskTransparent'></div></div></div>\
		<div class='numberButton' ><div code='KEY_18' class='btn buttonBG theamBGColor'>18<div class='tick'></div><div class='maskTransparent'></div></div></div>\
		<div class='numberButton' ><div code='KEY_20' class='btn buttonBG theamBGColor'>20<div class='tick'></div><div class='maskTransparent'></div></div></div>\
		<div class='numberButton' ><div code='KEY_22' class='btn buttonBG theamBGColor'>22<div class='tick'></div><div class='maskTransparent'></div></div></div>\
		<div class='numberButton' ><div code='KEY_24' class='btn buttonBG theamBGColor'>24<div class='tick'></div><div class='maskTransparent'></div></div></div>\
		<div class='numberButton' ><div code='KEY_26' class='btn buttonBG theamBGColor'>26<div class='tick'></div><div class='maskTransparent'></div></div></div>\
		<div style='clear:both;'></div>\
	</div>\
	"	
}

function defaultRemoteHtml () {
return "\
		"+remoteStyle1()+"\
		<div id='singleRemotePannel' class=''>\
			"+miniSectionRemoteHtml()+"\
			"+nevigationPannelHtml()+"\
			<br/>\
			"+numberKeyPannel()+"\
		</div>\
	"	
}
function miniRemoteHtml () {
return "\
		"+remoteStyle1()+"\
		<div id='singleRemotePannel' class=''>\
			"+miniSectionRemoteHtml()+"\
			"+nevigationPannelHtml()+"\
		</div>\
	"	
}
function numPadRemoteHtml () {
return "\
		"+remoteStyle1()+"\
		<div id='singleRemotePannel' class=''>\
			"+miniSectionRemoteHtml()+"\
			<br/><br/>\
			"+numberKeyPannel()+"\
		</div>\
	"	
}
function defaultAcRemoteHtml () {
return "\
		"+remoteStyle1()+"\
		<div id='singleRemotePannel' class=''>\
			"+acControlHtml()+"\
			<br/><br/>\
			"+acTemperaturePannel()+"\
		</div>\
	"	
}
function mini2ChnlRemoteHtml () {
return "\
		"+remoteStyle1()+"\
		<div id='singleRemotePannel' class=''>\
			"+miniGenricHtml()+"\
		</div>\
	"	
}

IrCodeSelector = BaseView.extend(Popup).extend({
	name : "IrCodeSelector",
	templateSelector:"#irCodeSelector",
	keepPopupFixed : true,
	avoidCloneOnPullup : true,
	events: {
		"tap .popupPannel > .cross" : "hidePopUp",
		"tap .btn" : "onButtonTap",
		"tap .remIcon" : "switchRemote",
		"tap .codeProxy .cancle" : "onCodeCancle"
	},
	onCodeCancle : function (event) {
		var $codeProxy = $(event.target).closest('.codeProxy');
		$codeProxy.remove();
	},
	onButtonTap : function (event) {
		var $btn = $(event.target).closest('.btn');
		var code = $btn.attr('code');
		var remId = this.$el.find('.tick:visible').closest('.remIcon').attr('remId');
		var $codeProxy = this.getIRCodeProxy(code, remId);
		this.$el.find('.codeProxyCont').append($codeProxy);

	},
	getIRCodeProxy : function(code, remId) {
		var remName = this.remotes[remId].name;
		return $("<span class='codeProxy button font10' code='"+code+"' remId='"+remId+"'><span>"+remName+"</span>: <span>"+code+"</span><i class='fa fa-times-circle-o cancle'></i></span>");
	},
	showPopUp : function(remotes, codeArr, callback){
		this.remotes = remotes;
		this.onDone = callback;
		this.$el.find('.codeProxyCont').html("");
		_.each(codeArr, function(obj) {
			this.$el.find('.codeProxyCont').append(this.getIRCodeProxy(obj.code, obj.remId));
		}, this);
		this.$el.find('.remIconCont').html("");
		_.each(remotes, function(rem, indx){
			this.$el.find('.remIconCont').append($('<div class="remIcon" icon="'+rem.icon+'" remId="'+rem.id+'" style="position:relative;width:50px;float:left;margin:5px 0px;z-index:5;text-align:center;"><img style="width:100%;cursor:pointer;" src="static/'+revId+'/images/transparent/'+rem.icon+'.png" /><br/><div class="font8">'+rem.name+'</div><div class="tick theamBGColor"></div></div>'));
		}, this);
		this.$el.find('.tick').hide();
		this.paintRemote('remote_default'); //this is required so that pop is places at right postition
		var retObj = Popup.showPopUp.apply(this, arguments);
		this._switchRemote(_.keys(remotes)[0])
		return retObj
	},
	hidePopUp : function () {
		var codeArr = []
		_.each(this.$el.find('.codeProxy'), function(codeProxy){
			var $codeProxy = $(codeProxy);
			codeArr.push({"remId":$codeProxy.attr('remId'), "code":$codeProxy.attr('code')})
		});
		this.onDone(codeArr);
		return Popup.hidePopUp.apply(this, arguments);
	},
	switchRemote : function (event) {
		var $remIcon = $(event.target).closest('.remIcon');
		var remId = $remIcon.attr('remId');
		this._switchRemote(remId);
	},
	_switchRemote : function (remId) {
		var icon = this.remotes[remId].icon;
		this.$el.find('.tick').hide();
		this.$el.find('.remIcon[remId='+remId+'] .tick').show();
		this.paintRemote(icon);
	},
	paintRemote : function(icon){
		switch (icon) {
			case 'remote_mini' : 		this.$el.find('.remoteCont').html(miniRemoteHtml()); break;
			case 'remote_mini_generic': this.$el.find('.remoteCont').html(mini2ChnlRemoteHtml()); break;
			case 'remote_with_numpad' : this.$el.find('.remoteCont').html(numPadRemoteHtml()); break;
			case 'remote_ac_default'  : this.$el.find('.remoteCont').html(defaultAcRemoteHtml()); break;
			case 'remote_default' : 	
			default : 					this.$el.find('.remoteCont').html(defaultRemoteHtml());
		}
	}
})
var irCodeSelector = new IrCodeSelector({'el':$("#irCodeSelectorCont")});
irCodeSelector.render();

RemoteViewer = BaseView.extend(Popup).extend({
	name : "RemoteViewer",
	templateSelector:"#remoteViewer",
	keepPopupFixed : true,
	avoidCloneOnPullup : true,
	events: {
		"tap .popupPannel > .cross" : "hidePopUp",
		"tap .btn" : "onButtonTap",
		"longTap .btn" : "onButtonLongTap"
	},
	initialize : function () {
		_.bindAll(this, 'onButtonUp');
		BaseView.prototype.initialize.apply(this, arguments);
	},
	showFeed : function (model) {
		this.model = model;
		this.hidePopUp();
		this.paintRemote(this.model.get('icon'));
		this.showPopUp();
	},
	paintRemote : function(icon){
		switch (icon) {
			case 'remote_mini' : 		this.$el.find('.remoteCont').html(miniRemoteHtml()); break;
			case 'remote_mini_generic': this.$el.find('.remoteCont').html(mini2ChnlRemoteHtml()); break;
			case 'remote_with_numpad' : this.$el.find('.remoteCont').html(numPadRemoteHtml()); break;
			case 'remote_ac_default'  : this.$el.find('.remoteCont').html(defaultAcRemoteHtml()); break;
			case 'remote_default' : 	
			default : 					this.$el.find('.remoteCont').html(defaultRemoteHtml());
		}
	},
	showPopUp : function () {
		$('body').on('touchend', this.onButtonUp)
		return Popup.showPopUp.apply(this, arguments);
	},
	hidePopUp : function () {
		this.onButtonUp();
		$('body').off('touchend', this.onButtonUp);
		this.$el.find('.remoteCont').html=("");
		return Popup.hidePopUp.apply(this, arguments);
	},
	onButtonTap : function (event, longTap) {
		var $btn = $(event.target).closest('.btn');
		$btn.addClass('statePressed');
		this.$PressedButton = $btn;
		clearTimeout(this.buttonTimer);
		this.buttonTimer = setTimeout(_.bind((longTap)?this.onButtonLongTap:this.onButtonUp, this, event), 200)
		console.log($btn.attr('code'));
		this.model.sendIRCode($btn.attr('code'));
	},
	onButtonLongTap : function (event) {
		console.log('onButtonLongTap')
		this.onButtonTap(event, true);
	},
	onButtonUp : function () {
		if(!this.$PressedButton) return;
		console.log('onButtonUp');
		clearTimeout(this.buttonTimer)
		this.$PressedButton.removeClass('statePressed');
		this.$PressedButton = null;
		setTimeout(_.bind(function(){this.model.sendIRCode("KEY_PRESS_END");}, this), 200);		
	}
});

var remoteViewer = new RemoteViewer({'el':$("#remoteViewerCont")});
remoteViewer.render();

AdvanceRemoteSwitch = BasicSwitch.extend(Popup).extend({
	name : "IrRemoteSwitch",
	events: {
		"tap .toggelSwitch" : "showPannel"
	},
	showPannel : function () {
		remoteViewer.$el.css("width", "80%").css("margin", "auto");
		remoteViewer.showFeed(this.model);
	}
})





AdvancePannel = {
 	render	:	function () {
 		if(this.bd) $(_.last(this.$el.find('.advancePannel'))).width(this.$el.parent().width() - this.$el.width()).show();
 		return this;
 	},
	events: {
		"tap .advancePannel .cross" : "done"
	},
	done : function () {
//		this.animateAdvancePannel=true;
		this.hideAdvancePannel();
		$('body').css('overflow', '');
	},
	showAdvancePannel : function () {
//		_.defer(_.bind(function () {this.animateAdvancePannel=false;}, this));
		if(this.bd) return;
		this.bd = new Backdrop({'$parent':this.bdCont || $('#mainCont')});
		this.bd.cloneOnPullup = true;
		this.bd.render();
		this.bd.pullItOver(this.$el);
		var $lastAdPnl = $(_.last(this.$el.find('.advancePannel')));
		this.adPnlCss = $lastAdPnl.attr('style');
		$lastAdPnl.show().focus();
		$('body').css('overflow', 'hidden');
		this.advancePannelVisible = true;
	},
	hideAdvancePannel : function () {
		if(!this.bd) return;
		var $lastAdPnl = $(_.last(this.$el.find('.advancePannel')));
		$lastAdPnl.attr('style', this.adPnlCss).hide();
		this.$el.css('position', 'inherit');
		this.bd.removeView();
		this.bd = null;
		this.advancePannelVisible = false;
	}

}
AdvanceSwitch = BasicSwitch.extend(AdvancePannel).extend({
 	render	:	function () {
 		BasicSwitch.prototype.render.apply(this, arguments);
 		this.$el.css('float','left');
 		AdvancePannel.render.apply(this, arguments);
 		if(this.showPannelOnrender) this.showAdvancePannel();
 		return this;
 	},
 	erase : function () {
 		if(this.bd) {
 			this.hideAdvancePannel();
 			this.showPannelOnrender=true;
 		}
 		return BasicSwitch.prototype.erase.apply(this, arguments);
 	},
	events: _.extend(BasicSwitch.prototype.events,AdvancePannel.events, {
		"longTap .toggelSwitch" : "showAdvancePannel"
	}),
	showAdvancePannel : function () {
		this.bdCont = this.$el.closest('.switchCont');
		this.showPannelOnrender = false;
		AdvancePannel.showAdvancePannel.apply(this, arguments);
		this.$el.css('width', 'auto');
		if(this.animateAdvancePannel) {
			$(_.last(this.$el.find('.advancePannel'))).width(0).animate({width:this.$el.parent().width() - this.$el.width()}, {'duration':150})
			this.$el.animate({left:this.$el.parent().position().left}, {'duration':150});
		}
		else {
			$(_.last(this.$el.find('.advancePannel'))).width(this.$el.parent().width() - this.$el.width());
			this.$el.css('left',this.$el.parent().position().left);
		}
	}
})

AdvanceCurtainSwitch = AdvanceSwitch.extend({
	initialize : function () {
		_.bindAll(this, 'stopCurtain');
		AdvanceSwitch.prototype.initialize.apply(this, arguments);
		this._moveCurtain = _.throttle(_.bind(this.model.moveCurtain, this.model), 200);
	},
	render	:	function () {
 		AdvanceSwitch.prototype.render.apply(this, arguments);
 		var state = this.model.get("state");
 		if(!this.$curtainControls)
 		this.$curtainControls = $(
 			"<div class='unselectable curtainControlPopup'>\
 				<div class='openCurtain "+((state=='opening')?"brightBGColor":"")+"' style='float:left; padding:15px; width:50px;'><div style='width:50px;height:50px;float:left;background-image:url(\"static/images/transparent/opencurtain.png\"); background-size:50px 50px;'></div><span>Open</span></div>\
 				<div class='closeCurtain "+((state=='closing')?"brightBGColor":"")+"' style='float:right; padding:15px; margin:0 40px 0 0; width:50px;'><div style='width:50px;height:50px;float:left;background-image:url(\"static/images/transparent/closecurtain.png\"); background-size:50px 50px;'></div><span>Close</span></div>\
 				<div style='clear:both'></div>\
 			</div>"
 		)//don't convert background-image div to img-tag, as on phones it dosn't trigger touchend after longtab.
 		this.$el.find('.advancePannel').append(this.$curtainControls);
 		return this;
 	},
 	erase	: function () {
 		if(!this.openCurtainTimer && !this.closeCurtainTimer && this.$curtainControls)
 		{console.log("removing curtain control UI!!");this.$curtainControls.remove(); this.$curtainControls=null;}
 		return AdvanceSwitch.prototype.erase.apply(this, arguments);
 	},
 	hideAdvancePannel : function() {
 		var $img = this.$el.find('.iconPartition img');
 		$img.attr('src', $img.attr('src').replace('black', appColor+''));
 		return AdvanceSwitch.prototype.hideAdvancePannel.apply(this, arguments);
 	},
 	showAdvancePannel : function () {
 		if(this.model.get('disabled') || this.advancePannelVisible) return;
 		var ret = AdvanceSwitch.prototype.showAdvancePannel.apply(this, arguments);
 		!this.touchendConnected && (this.touchendConnected = true) && $('body').on('touchend', _.bind(this._stopCurtain,this));
 		var $img = this.$el.find('.iconPartition img');
 		$img.attr('src', $img.attr('src').replace(appColor+'','black'));
 		return ret
 	},
 	done : function () {
 		this._stopCurtain();
 		$('body').off('touchend', this.stopCurtain);
 		this.touchendConnected = false;
 		return AdvanceSwitch.prototype.done.apply(this, arguments);
 	},
 	events  : { //TODO extend events hirarchy is not working 
 		"tap .advancePannel .cross" : "done"
		,"tap .toggelSwitch" : "showAdvancePannel"
		,"longTap .toggelSwitch" : "showAdvancePannel"
		,"longTap .openCurtain" : "openCurtain"
		,"longTap .closeCurtain" : "closeCurtain"
		,"tap .openCurtain" : "autoOpenCurtain"
		,"tap .closeCurtain" : "autoCloseCurtain"
		// ,"touchend .openCurtain" : "stopCurtain"
		// ,"touchend .closeCurtain" : "stopCurtain"
		// ,"touchleave .closeCurtain" : "stopCurtain" 
		
	},
	autoOpenCurtain : function (event) {
		if(this.model.get("state") != "off") return this.stopCurtain();
		this.$el.find('.openCurtain').addClass('brightBGColor');
		this.$el.find('.closeCurtain').removeClass('brightBGColor');
		this.model.moveCurtain("open", 15);
	},
	autoCloseCurtain : function (event) {
		if(this.model.get("state") != "off") return this.stopCurtain();
		this.$el.find('.closeCurtain').addClass('brightBGColor');
		this.$el.find('.openCurtain').removeClass('brightBGColor');
		this.model.moveCurtain("close", 15);
	},
	closeCurtain : function (event) {
		this.longPressOn = true;
		if(!event && this.model.get("state") == "off") return this.stopCurtain();
		console.log("closeCurtain");
		// this.$el.find('.closeCurtain').removeClass('whiteBG').addClass('theamBGColor');
		// this.$el.find('.openCurtain').removeClass('theamBGColor').addClass('whiteBG');		
		this.$el.find('.closeCurtain').addClass('brightBGColor');
		this.$el.find('.openCurtain').removeClass('brightBGColor');		
		this.model.moveCurtain("close");
		this.closeCurtainTimer = setTimeout(_.bind(this.closeCurtain, this), 1000);
		clearTimeout(this.openCurtainTimer);this.openCurtainTimer = null;
	},
	openCurtain : function (event) {
		this.longPressOn = true;
		if(!event && this.model.get("state") == "off") return this.stopCurtain();
		console.log("openCurtain");
		// this.$el.find('.openCurtain').removeClass('whiteBG').addClass('theamBGColor');
		// this.$el.find('.closeCurtain').removeClass('theamBGColor').addClass('whiteBG');		
		this.$el.find('.openCurtain').addClass('brightBGColor');
		this.$el.find('.closeCurtain').removeClass('brightBGColor');
		this.model.moveCurtain("open");
		this.openCurtainTimer = setTimeout(_.bind(this.openCurtain, this), 1000);
		clearTimeout(this.closeCurtainTimer);this.closeCurtainTimer = null;
	},
	_stopCurtain : function () {
		if(this.longPressOn) this.stopCurtain();
	},
	stopCurtain : function() {
		this.longPressOn = false;
		console.log("stopCurtain");
		this.model.moveCurtain("stop");
		clearTimeout(this.openCurtainTimer);
		clearTimeout(this.closeCurtainTimer);
		this.openCurtainTimer = this.closeCurtainTimer = null;
		// this.$el.find('.openCurtain, .closeCurtain').removeClass('theamBGColor').addClass('whiteBG');		
		this.$el.find('.openCurtain, .closeCurtain').removeClass('brightBGColor');
	}
})

AdvanceFanSwitch = AdvanceSwitch.extend({
	initialize : function () {
		_.bindAll(this, 'onDutyChange');
		this._onDutyChange = _.throttle(this.onDutyChange, 500, {leading: false});
		this.animateAdvancePannel=true;
		AdvanceSwitch.prototype.initialize.apply(this, arguments);
	},
	done : function () {
		this.animateAdvancePannel=true;
		AdvanceSwitch.prototype.done.apply(this, arguments);
	},
	showAdvancePannel : function () {
		this.$slider.hide();
		_.defer(_.bind(function () {this.animateAdvancePannel=false;}, this));
		AdvanceSwitch.prototype.showAdvancePannel.apply(this, arguments);
		this.$slider.show();
	},
	render	:	function () {
 		AdvanceSwitch.prototype.render.apply(this, arguments);
 		var minSpeed = (this.model.get('icon').indexOf('fan') == -1) ? 10 : 30;
 		this.$slider = $('<input type="range" class="inside fanSlider" min="'+minSpeed+'" max="95" value="50" showemptylabels="false" style="margin:30px 0 0 10px;"/>');
 		this.$el.find('.advancePannel').append(this.$slider);
 		this.$slider.width(Math.max(120,this.$el.parent().width() - 2*this.$el.find('.toggelSwitch').width() - 20));
 		var duty = parseInt(100*parseInt(this.model.get('duty'))/255);
 		this.$slider.val(Math.min(Math.max(duty, minSpeed), 95));
 		this.$slider.on("input change", this._onDutyChange);
 		return this;
 	},
 	onDutyChange : function (event) {
 		var duty = parseInt(this.$slider.val());
 		if(duty == 95) duty=100;
 		console.log(duty);
 		duty = parseInt(255*duty/100);
 		console.log(duty);
 		this.model.setDuty(duty);
 	}, 
 	erase	: function () {
 		if(this.$slider) {
	 		this.$slider.off("input change", this._onDutyChange);
 			this.$slider.remove(); 			
 		}
 		return AdvanceSwitch.prototype.erase.apply(this, arguments);
 	}
});



SelectSensors = BaseView.extend({
	templateSelector:"#multiSelectIconTemplate",
	tagName : 'span',
	events: {
		"tap .selectSwitch"  : "selectIcon",
	},
	selectIcon : function () {
		this.selected = !this.selected;
		this.$el.find('.tick')[(this.selected)?'show':'hide']();
	}, 
	_getJsonToRenderTemplate : function () {
		this.model.src = "static/images/transparent/"+this.model.icon+".png" ;
		this.selected = this.model.selected;
		return this.model;
	},
});

EditSensorRulePannel = BasicDialog.extend({
	templateSelector:"#editSensorRulePannel",
	subViewArrays : [{'viewClassName':'SelectSensors', 'reference':'sensorViewArray', 'parentSelector':'.sensorIconDiv', 'array':'this.sensorList','createOnRender':true},
					{'viewClassName':'SelectSensors', 'reference':'filterViewArray', 'parentSelector':'.filterIconDiv', 'array':'this.filterList','createOnRender':true}],
	events: {
		"tap .cross" : "onSelectionDone",
		"change .manualTimeRange" : "onManualTimeChange"
	},
	_filterList : [{'icon':'evening', 'name':'Evening', 'id':'evening'},
							{'icon':'dayLight', 'name':'Day Light', 'id':'dayLight'},
							{'icon':'sleepHour', 'name':'Night', 'id':'sleepHour'}],
	onManualTimeChange : function () {
		var displayVal, manualTime=parseInt(this.$el.find('.manualTimeRange').val());
		switch (manualTime) {
			case 1 : displayVal='2 minutes';break; case 2 : displayVal='5 minutes';break; 
			case 3 : displayVal='10 minutes';break;
			case 4 : displayVal='15 minutes';break; case 5 : displayVal='20 minutes';break;
		}
		this.$el.find('.manualTimeVal').html(displayVal);
	},
	show : function () {
		var selectedObjs = this.model.get('followObjs');
		this.filterList = JSON.parse(JSON.stringify(this._filterList)); // cloning
		_.each(this.filterList, function(obj) {
			if(_.contains(selectedObjs, obj.id)) obj.selected=true;
		}, this);
		this.sensorList = [];
		_.each(this.options.deviceCollection.models, function(model){
			_.each(model.get('loadInfo'), function(info) {
				if(info.type == 'sensor') {
					var clone = JSON.parse(JSON.stringify(info));
					if(_.contains(selectedObjs, clone.id)) clone.selected=true;
					this.sensorList.push(clone);
				}
			}, this);
		}, this)
		var retObj = BasicDialog.prototype.show.apply(this, arguments);
		var manualTime = this.model.get('manualFollowSuspension');
		var sliderVal=2, displayVal='5 minutes';
		switch (manualTime) {
			case 120 : sliderVal=1; displayVal='2 minutes'; break;
			case 300 : sliderVal=2; displayVal='5 minutes'; break;
			case 600 : sliderVal=3; displayVal='10 minutes'; break;
			case 900 : sliderVal=4; displayVal='15 minutes'; break;
			case 1200 : sliderVal=5; displayVal='20 minutes'; break;
		} 
		this.$el.find('.manualTimeRange').val(sliderVal);
		this.$el.find('.manualTimeVal').html(displayVal);
		this._makeSelectionString();
		return retObj;
	},
	_makeSelectionString : function() {
		var sensorList = [], filterList = [], manualTime=parseInt(this.$el.find('.manualTimeRange').val());
		switch (manualTime) {
			case 1 : manualTime=120;break; case 2 : manualTime=300;break; case 3 : manualTime=600;break;
			case 4 : manualTime=900;break; case 5 : manualTime=1200;break;
		}
		this.manualTime=manualTime;
		_.each(this.sensorViewArray, function(sView){if(sView.selected)sensorList.push(sView.model.id)}, this);
		_.each(this.filterViewArray, function(fView){if(fView.selected)filterList.push(fView.model.id)}, this);
		this.sensorListStr = JSON.stringify(sensorList);
		this.filterListStr = JSON.stringify(filterList);	
	},
	onSelectionDone : function() {
		var concatStr = this.sensorListStr + this.filterListStr + this.manualTime;
		this._makeSelectionString();
		if(concatStr != this.sensorListStr + this.filterListStr + this.manualTime) {
			this.model.setSwitchParam({'followObjects':{
				"sensorList":JSON.parse(this.sensorListStr),
				"filterList":JSON.parse(this.filterListStr),
				"manualTime":this.manualTime}},
				function(err){if(err)console.log(err);});
		}
		this.hide();
	}
})	


ScheduleEditor = BaseView.extend({
	templateSelector:"#editScheduleTemplate",
	events : {
		"tap .done" : "done",
		"tap .cancel" : "cancle"
	},
	set : function (schedule) {
		schedule.type && this.$el.find('.scheduleType').val(schedule.type);
		schedule.hour && this.$el.find('.scheduleHour').val(schedule.hour);
		schedule.minute && this.$el.find('.scheduleMinute').val(schedule.minute);
		schedule.amPm && this.$el.find('.scheduleAmPm').val(schedule.amPm); 
	},
	done : function () {
		var obj = {'type':this.$el.find('.scheduleType').val(), 
			'hour':this.$el.find('.scheduleHour').val(),
			'minute':this.$el.find('.scheduleMinute').val(),
			'amPm':this.$el.find('.scheduleAmPm').val()
		}
		this.trigger('change', obj);
	},
	cancle : function () {this.trigger('remove');}
});

SelectSwitchIcon = BaseView.extend({
	templateSelector:"#selectSwitchIconTemplate",
	tagName : 'span',
	_getJsonToRenderTemplate : function () {
		return {"src":"static/images/transparent/"+this.model+".png", "icon":this.model};
	},
});

EditSwitchParams = BaseView.extend({
	templateSelector:"#editSwitchTemplate",
	iconList : ['switch', 'bulb', 'cfl', 'cfl1', 'tubelight', 'chandelier', 'ceiling', 'ceiling1', 'fan', 'fan1', 'plug', 'plug1', 'lamp', 'lamp1', 'mosquito coil', 'iron', 'geyser', 'tv', 'tv1', 'ac', 'ac1', 'heater', 'air cooler', 'washing machine', 'water purifier', 'curtain'],
	subViews : [{'viewClassName':'EditSensorRulePannel', 'reference':'sensorRuleDialog', 'parentSelector':'.sensorRuleEditorCont', 'model':'this.model', 'eval':['deviceCollection=this.options.deviceCollection'], 'supressRender':true},
				{'viewClassName':'ScheduleEditor', 'reference':'schEditor', 'parentSelector':'#scheduleEditor', 'model':'this.model', 'events' : {
		'change':'doneEditSchedule',
		'remove':'repaint'
	}}],
	subViewArrays : [{'viewClassName':'SelectSwitchIcon', 'reference':'iconViewArray', 'parentSelector':'.iconCont', 'array':'this.iconList'}],
	events: {
		"tap .sensorRuleDisplayCont" : "showEditSensorRuleDialog",
		"tap .editSensorRule" : "showEditSensorRuleDialog",
		"tap .iconCont .selectSwitch"  : "_setIcon",
		"change .switchName" : "_nameChange",
		"change .typeRadioCont input[type='radio']" : "_typeChange",
		"change .autoOffRadioCont input[type='radio']" : "_AutoOffToggle",
		"change .autoOffTimeSelect select" : "_setAutoOffParams",
		"tap .scheduleCont .edit, .addShdlBtnCont .addNewSchedule" : "_editSchedule",
		"tap .scheduleCont .enable, .scheduleCont .disable" : "_enableDisableSchedule",
		"tap .scheduleCont .remove" : "_removeSchedule"
	},
	showEditSensorRuleDialog : function () {
		this.sensorRuleDialog.show();
	},
	bindFunctions :_.union(BaseView.prototype.bindFunctions,['_setIcon', '_nameChange']),
	_removeSchedule : function (event) {
		var $schCont = $(event.target).closest('.scheduleCont');
		scheduleId = parseInt($schCont.attr('scheduleId'));
		var schObj = { 'scheduleId' : parseInt($schCont.attr('scheduleId')),'remove':true};	
		this.model.setSwitchParam({'schedule':schObj}, _.bind(function () {}, this));
	},
	_enableDisableSchedule : function (event){
		var $schCont = $(event.target).closest('.scheduleCont');
		var schObj = { 'scheduleId' : parseInt($schCont.attr('scheduleId')),
						'enabled' : ($(event.target).hasClass('enable'))?true:false};
		this.model.setSwitchParam({'schedule':schObj}, _.bind(function () {}, this));				
	},
	_editSchedule : function (event) {
		_.delay(_.bind(function (event) {
			var $schCont = $(event.target).closest('.scheduleCont, .addShdlBtnCont');
			$schCont.html(this.schEditor.$el);
			if($schCont.hasClass('addShdlBtnCont')) return;
			this.schEditor.scheduleId = parseInt($schCont.attr('scheduleId'));
			this.schEditor.set(this.model.get('schedules')[this.schEditor.scheduleId]);
		}, this), 100, event);	
	},
	doneEditSchedule : function (obj) {
		console.log(obj);
		obj.scheduleId = this.schEditor.scheduleId;
		this.model.setSwitchParam({'schedule':obj}, _.bind(function () {}, this));
		this.repaint(); // repaint is required as one may click done without changing any thing.
	},
	_showHideAutoOff : function (state) {
		if (state) {
			this.$el.find('.autoOffTimeSelect').show();
			this.$el.find('.autoOffEnable').hide();
			var autoOffConf = this.model.get('autoOff');
			var time = (!autoOffConf)?0:autoOffConf.time;
			this.$el.find('.autoOffTimeSelect select').val(time/60);
		}
		else {
			this.$el.find('.autoOffTimeSelect').hide();
			this.$el.find('.autoOffEnable').show();			
		}

	},
	_AutoOffToggle : function (event) {
		this._showHideAutoOff($(event.target).val() == 'enabled');
		this._setAutoOffParams();
	},
	_setAutoOffParams : function () {
		var status = (this.$el.find('.autoOffRadioCont input[type="radio"]#autoOffEnable:checked').length)?true:false;
		var time = this.$el.find('.autoOffTimeSelect select').val();
		this.model.setSwitchParam({'autoOff':{'enabled':status, 'time':time*60}}, _.bind(function () {}, this));
	},
	_typeChange : function (event) {
		this.model.setSwitchParam({'type':$(event.target).val()}, _.bind(function () {

		}, this));
	},
	_nameChange : function (event) {
		this.model.setSwitchParam({'name':$(event.target).val()}, _.bind(function () {
			console.log("name changed on server", this.model.attributes);
		}, this));
	},
	_setIcon : function (event) {
		var iconName = $(event.target).attr('icon');
//		this.setIcon(iconName);
		this.model.setSwitchParam({'icon':iconName});
	},
	render	:	function () {
		BaseView.prototype.render.apply(this, arguments);
		this.setIcon(this.model.get('icon'));
		this._showHideAutoOff(this.$el.find('.autoOffRadioCont input[type="radio"]#autoOffEnable:checked').length);
		this.schEditor.scheduleId = null;
		setTimeout(_.bind(function(){this.$el.find('.switchName').removeAttr('readonly')}, this),500);
		var followObjs = this.model.get('followObjs');
		_.each(followObjs, function (id, indx) {
			var imgName = id;
			if(1 + id.indexOf('-s')) {
				var loadinfo = this.options.deviceCollection.get(id.split('-s')[0]).get('loadInfo');
				for(var key in loadinfo) { var obj = loadinfo[key];
					if(obj.id == id) {imgName = obj.icon; break;}
				}
			}
			this.$el.find('.sensorRuleDisplayCont').append("<img style='width:35px;' src='static/images/transparent/"+imgName+".png'></img>")
			this.$el.find('.attachSensorRuleBtnCont').hide();
		}, this);
		return this;
	},
	setIcon : function (iconName) {
		var idx = _.indexOf(this.iconList, this.currentIcon);
		if(idx != -1)this.iconViewArray[idx].repaint();
		this.currentIcon = iconName;
		idx = _.indexOf(this.iconList, iconName);
		if(idx == -1) return;
		var $div = this.iconViewArray[idx].$el.find('img').parent();
		$div.addClass('theamBGColor');
		$div.find('.tick').show();
	}
});

EditCurtainParams = EditSwitchParams.extend({
	iconList : ['curtain', 'curtain1', 'curtain2', 'curtain3', 'curtain4']
});

EditIpCamParams = EditSwitchParams.extend({
	templateSelector:"#editIpCameraTemplate",
	iconList : ['ipCam','ipCam1','ipCam2','ipCam3'],
	subViews : [],
	render	:	function () {
		BaseView.prototype.render.apply(this, arguments);
		this.setIcon(this.model.get('icon'));
		setTimeout(_.bind(function(){this.$el.find('.switchName').removeAttr('readonly')}, this),500);
		return this;
	}
});

EditSensorParams = EditIpCamParams.extend({
	templateSelector:"#editPirTemplate",
	iconList : ['pir', 'pir1'],
	events : _.extend(EditIpCamParams.prototype.events, {
		"change .pacificityRange" : "_pacificityChange"
	}),
	_pacificityChange : function () {
		var pval = parseInt(this.$el.find('.pacificityRange').val());
		switch(pval){
			case 1 : pval = 15;break;	case 4 : pval = 120;break;	case 7 : pval = 420;break;
			case 2 : pval = 30;break;	case 5 : pval = 180;break;	case 8 : pval = 600;break;
			case 3 : pval = 60;break;	case 6 : pval = 300;break;	case 9 : pval = 900;break;
			case 10 : pval = 1200;break;
		}
		var mins = parseInt(pval/60), secs = pval%60;
		this.$el.find('.pacificityVal').html((mins)?mins+" minutes":secs+" seconds");
		this.model.setSwitchParam({'pacificity':pval}, _.bind(function () {}, this));
	},
	render	:	function () {
		EditIpCamParams.prototype.render.apply(this, arguments);
		var pval = this.model.get('pacificity');
		var mins = parseInt(pval/60), secs = pval%60;
		switch(pval){
			case 15 : pval = 1;break;	case 120 : pval = 4;break;	case 420 : pval = 7;break;
			case 30 : pval = 2;break;	case 180 : pval = 5;break;	case 600 : pval = 8;break;
			case 60 : pval = 3;break;	case 300 : pval = 6;break;	case 900 : pval = 9;break;
			case 1200 : pval = 10;break;
		}
		this.$el.find('.pacificityRange').val(pval);
		this.$el.find('.pacificityVal').html((mins)?mins+" minutes":secs+" seconds");
		return this;
	}
});


SelectRemote = BaseView.extend({
	templateSelector:"#multiSelectIconTemplate",
	tagName : 'span',
	events: {
		"tap .selectSwitch"  : "selectSwitch",
	},
	selectSwitch : function () {
		this.remoteSelected = !this.remoteSelected;
		this.$el.find('.tick')[(this.remoteSelected)?'show':'hide']();
	}, 
	_getJsonToRenderTemplate : function () {
		this.model.src = "static/images/transparent/"+this.model.icon+".png" ;
		return this.model;
	},
});

EditIrBlstrParams = EditIpCamParams.extend({
	iconList : [],//['Airtel_DTH', 'Tata_Sky', 'Dish_TV', 'Videocon_D2H', 'Sun_Direct'],
	subViewArrays : [{'viewClassName':'SelectRemote', 'reference':'iconViewArray', 'parentSelector':'.iconCont', 'array':'this.options.deviceCollection.get("irRemotes").get("loadInfo")','createOnRender':true}],
	render	:	function () {
		this.selectedIcons=[]
		var retObj = EditIpCamParams.prototype.render.apply(this, arguments);
		_.each(this.model.get("remotes"), function (idx) {
			idx = parseInt(idx);
			for (var i=0; i < this.iconViewArray.length; i++) {
				var mdl = this.iconViewArray[i].model;
				if(mdl.id == idx) {
					this.iconViewArray[i].selectSwitch();
					break;
				}
			}
		}, this);
		return retObj
	},
	saveParams : function () {
		var selectedIds = [];
		_.each(this.iconViewArray, function(view){if(view.remoteSelected) selectedIds.push(view.model.id)}, this)
		console.log(selectedIds);
		this.model.setSwitchParam({'remotes':selectedIds});		
	},
	_setIcon : function (event) {
		return;
	}
});

EditParamFactory = function (options) {
	var retObj;
	switch (options.model.get('type')) {
		case 'curtain'	: return new EditCurtainParams(options);
		case 'ipCam'	: return new EditIpCamParams(options);
		case 'irBlstr'	: return new EditIrBlstrParams(options);
		case 'sensor'	: return new EditSensorParams(options);
		case 'dimmer'	:
		case 'normal'	: return new EditSwitchParams(options);
		default		: retObj = new EditSwitchParams(options);
	}
	retObj.render = function(){return this}
	return retObj;
}

EditableSwitch = AdvanceSwitch.extend({
	// recreateOnRepaint because ViewClass is a ViewFactory
	subViews : [{'viewClassName':'EditParamFactory', 'reference':'editView', 'parentSelector':'.advancePannel', 'model':'this.model', 'eval':['deviceCollection=this.options.deviceCollection'], 'supressRender':true, 'recreateOnRepaint':true }],
	toggelSwitch : function (event) {
		if(!_.contains(['curtain', 'ipCam', 'irBlstr', 'sensor'], this.model.get('type')))
			return AdvanceSwitch.prototype.toggelSwitch.apply(this, arguments);
	},
	showAdvancePannel : function () {
		this.$el.find('.followObjIndicator, .remoteCountIndicator').hide();
		this.$el.find('.iconPartition').hide();
		AdvanceSwitch.prototype.showAdvancePannel.apply(this, arguments);
		this.editView.render();	
		var left = this.$el.offset().left;
		var top = ($(window).height() - this.$el.height())/2
		if(top > 0) this.$el.css('top', top+'px').css('left', left+'px').css('position','fixed');
		setTimeout(_.bind(function () {this.$el.find('.checked').prop("checked", true);}, this), 20);
	},
	hideAdvancePannel : function () {
		this.$el.find('.followObjIndicator, .remoteCountIndicator').show();
		if(this.editView.saveParams)this.editView.saveParams();
		this.editView.erase();
		AdvanceSwitch.prototype.hideAdvancePannel.apply(this, arguments);
		this.$el.find('.iconPartition').show();
		this.repaint();
	},
	repaint : function () {
		if(!this.bd) return AdvanceSwitch.prototype.repaint.apply(this, arguments);
		this.editView.repaint();
		return this;
	},
	render : function () {
		if(this.model.get('type') == "irRem") return this; // donot render in case of irRem;
		var retObj= AdvanceSwitch.prototype.render.apply(this, arguments);
		this.$el.find('.followObjIndicator').show();
		if(this.model.get('type') == "irBlstr"){
			var remotes = this.model.get("remotes");
			var count = (remotes)?remotes.length:0;
			if(count)
				this.$el.find('.basicSwitchTemplate .fa-exclamation-circle').parent().before("<div class='remoteCountIndicator theamBGColor'><i class='fa fa-paperclip hInvert' style='position:absolute;left:-7px;bottom:-7px;'></i><span style='color:white;'>"+count+"</span></div>")
		}

		return retObj;
	}
});



SwitchViewFactory = function (options) {
	var retObj;
	switch (options.model.get('type')) {
		case 'dimmer'	: return new AdvanceFanSwitch(options);
		case 'curtain'	: return new AdvanceCurtainSwitch(options);
		case 'ipCam'	: return new IpCamaraSwitch(options);
		case 'irRem'	: return new AdvanceRemoteSwitch(options);
		case 'normal'	: return new BasicSwitch(options);
		default		: retObj = new BasicSwitch(options);
	}
	retObj.render = function(){return this}
	return retObj;
}

GroupView1 = BaseView.extend({
	name : "GroupView1",
	templateSelector:"#groupTemplate",
	// recreateOnRepaint because ViewClass is a ViewFactory
	subViewArrays : [{'viewClassName':'SwitchViewFactory', 'reference':'switchViewArray', 'parentSelector':'.switchCont', 'array':'this.switchCollection', 'recreateOnRepaint':false}],
	initialize: function(obj) {
		var ColClass = Backbone.Collection.extend({model:SwitchModel});
		this.switchCollection = new ColClass();
		this.switchCollection.on("add", function (swModel) {swModel.ioSocket=this.model.collection.ioSocket;}, this);
		this.switchCollection.set(this.model.get("controls"), {merge: true});
		this.model.on('change', _.bind(function (model) {
			//var changedProps = _.keys(model.changed);
			//if(changedProps.length == 1 && changedProps[0] == "controls") this.avoidRepaint = true;
			this.switchCollection.set(this.model.get("controls"), {merge: true});
		}, this));
		BaseView.prototype.initialize.apply(this, arguments);
//		this.model.on('change', _.bind(this.repaint, this));
    },
	events: {
		"tap .powerButton" : "onPowerOffClick"
	},
	repaint : function () {
		// Hack to fix mobile app and mobile chrome browser where without following line,
		// lower groups on app dance while on/off. Proper fix would be that on switch state change,
		// entire group should not get repainted.
		// group repaint could be avoided by setting this.avoidRepaint=true, after making sure that 
		// only parameter of the controles of the group have changed. which can be done by listining to on-change of model
		this.$el.css('height',this.$el.height()+'px');
		BaseView.prototype.repaint.apply(this, arguments);
		this.$el.css('height','auto');
		
	},
	onPowerOffClick : function (event) {
		var $loader;
//		$(event.target).closest('.roomTitleCont').append($loader=$('<img class="powerOffSpinner" src="static/images/loading.gif"/>'))
		$(event.target).closest('.roomTitleCont').append($loader=$('<i class="powerOffSpinner brightColor fa fa-spinner fa-spin"></i>'))
		this.model.powerOff(function () {setTimeout(function (){$loader.remove()}, 1000)});
	}
});

SwitchProxy = BaseView.extend({
	name : "SwitchProxy",
	templateSelector:"#switchProxyTemplate",
	events: {
 		"tap .toggelSwitch" : "onToggelSwitch"
 	},
	onToggelSwitch : function (event) {
		if(this.model.type == 'dimmer' && parseInt(this.model.setOn)) this.buff = parseInt(this.model.setOn);
		if(this.model.task == 'moodSelection') {
			if(this.model.type == 'irBlstr') return this.showIrCodeSelector();
	 		if(!this.model.selected) {
	 			if(this.model.type == 'dimmer') return this.showRangeSelector();
		 		this.model.selected = !this.model.selected;
				this.model.setOn = true;
	 		}
			else if(this.model.setOn) this.model.setOn = false;
			else this.model.selected = !this.model.selected;
		}else this.model.selected = !this.model.selected;
		this.repaint();
	},
	showRangeSelector : function () {
		rangeSelector1.setValue(this.buff || 80);
		rangeSelector1.showPopUp(_.bind(function(v) {
			this.model.selected = !this.model.selected;
			this.buff = this.model.setOn = v;
			this.repaint();
		}, this));
 	},
 	showIrCodeSelector : function () {
 		var remotes = this.options.deviceCollection.get('irRemotes').get('loadInfo');
 		irCodeSelector.showPopUp(remotes, this.model.setOn || [], _.bind(function(codeArr){
 			this.model.selected = (codeArr && codeArr.length)?true:false;
 			this.model.setOn = codeArr;
 			this.repaint();
 		}, this));
 	},
	_getJsonToRenderTemplate : function () {
		return JSON.parse(JSON.stringify(this.model));
	}
});

DeviceGroupSwitchProxy = SwitchProxy.extend({
	render : function () {
		if(_.contains(['sensor'], this.model.type) || this.model.hidden) return this;
		return SwitchProxy.prototype.render.apply(this, arguments);
	}
});

DeviceGroupView = BaseView.extend({
	name : "DeviceGroupView",
	templateSelector:"#deviceGroupTemplate",
	subViewArrays : [{'viewClassName':'DeviceGroupSwitchProxy', 'reference':'switchViewArray', 'parentSelector':'.switchProxyCont', 'array':'this.model.get("loadInfo")||this.model.get("controls")', 'eval':['deviceCollection=this.options.deviceCollection'], 'createOnRender':true}]
	//TODO arr should be collection and not simple array.

});

ChoseGroupIconPannel = BasicDialog.extend({
	templateSelector:"#choseGroupIconPannel",
	icons:['1living','2living','3living','4tv','5tv','6music','7dining','8dining','9dining','10bar','11bar','12kitchen','13kitchen', '14bedroom', '15bedroom', '16bedroom', '17bedroom', '18bunkbed', '18splitbed', '19dressing', '20wadrobe','21wadrobe','22washroom','23bathroom','24bathroom','25washing', '26balcony','27balcony','28garden','29outdoor','30outdoor','31swimming','32snooker','33tenis','34gym','35garage','36conferance','37desk','38desk','39study','41pooja','42stairs','40door'],
	_getJsonToRenderTemplate : function () {return {'icons':this.icons, 'curIcon':this.iconName || '40door'}},
	events: {
		"tap .cross" : "onSelectionDone",
		"tap .roomIconCont" : "onRoomIconChange"
	},
	show : function (iconName,onDoneCakbk) {
		this.iconName = iconName;
		this.onDoneCakbk = onDoneCakbk;
		return BasicDialog.prototype.show.apply(this, arguments);
	},
	onRoomIconChange : function (event) {
		var rmIcnCnt = $(event.target).closest('.roomIconCont'), iconName = rmIcnCnt.attr('iconName');
		this.$el.find('.roomIconCont .tick:visible').hide();
		rmIcnCnt.find('.tick').show();
	},
	onSelectionDone : function () {
		var newIconName = $(this.$el.find('.roomIconCont .tick:visible')[0]).closest('.roomIconCont').attr('iconName');
		this.hide();
		this.onDoneCakbk && this.onDoneCakbk(newIconName);
	}
})

EditGroupPannel = BaseView.extend({
	name : "EditGroupPannel",
	templateSelector:"#editGroupTemplate",
	subViews : [{'viewClassName':'ChoseGroupIconPannel', 'reference':'choseIconDialog', 'parentSelector':'.groupIconPannelCont', 'model':null, 'supressRender':true}],
	subViewArrays : [{'viewClassName':'DeviceGroupView', 'reference':'deviceGroupView', 'parentSelector':'.deviceGroupCont', 'array':'this.options.deviceCollection'}],
	events: {
		"tap .editGroupIcon" : "editGroupIcon"
	},
	editGroupIcon : function () {
		this.choseIconDialog.show(this.model.get('icon'),_.bind(function(newIconName){
			this.model.set('icon', newIconName, {silent: true});
			this.$el.find('.roomIcon').css('background-image','url("static/images/rooms/'+newIconName+'.png")')
		},this));
	},
	render : function () {
		var irRemIndx = -1;
		this.options.deviceCollection.each(function (dev, indx) {
			if(dev.get("id") == "irRemotes") irRemIndx = indx;
			_.each(dev.get('loadInfo'), function (sw, key) {sw.task=sw.selected=sw.hidden=false;}, this);
		}, this);
		_.each(this.model.get('controls'), function (obj) {
			this.options.deviceCollection.get(obj.devId).get('loadInfo')[obj.switchID].selected=true;
		}, this);
		BaseView.prototype.render.apply(this, arguments);
		if(irRemIndx != -1) this.deviceGroupView[irRemIndx].$el.hide();
		return this;
	},
	erase : function () {
		if(!this.rendered) return;
		this.saveGroupInfo()
		return BaseView.prototype.erase.apply(this, arguments);
	},
	saveGroupInfo : function () {
		var groupInfo = this.model.toJSON();
		groupInfo.rank = this.$el.find('input[name=rank]:checked').val() || groupInfo.rank;
		groupInfo.name=this.$el.find('.groupName').val() || groupInfo.name;
		var controls = [], id=0;
		this.options.deviceCollection.each(function (dev) {
			if(dev.get('id') == "irRemotes") return;
			_.each(dev.get('loadInfo'), function (sw, key) {
				sw.selected && controls.push({"id":++id, "devId":dev.id, "switchID":(dev.id=="irBlasters")?key:parseInt(key)});
			}, this);
		}, this);
		groupInfo.controls = controls;
		if(groupInfo.name && controls.length)
		this.model.ioSocket.emit("modifyGroup", groupInfo, function (err){if(err)console.log(err)});
		console.log(groupInfo);		
	}
});

GroupEditView = GroupView1.extend(AdvancePannel).extend({
	name : "GroupEditView",
	subViews : [{'viewClassName':'EditGroupPannel', 'reference':'editPannel', 'parentSelector':'.editTemplateCont', 'model':'this.model', 'eval':['deviceCollection=this.options.deviceCollection'],'supressRender':true}],
	subViewArrays : [{'viewClassName':'EditableSwitch', 'reference':'switchViewArray', 'parentSelector':'.switchCont', 'array':'this.switchCollection', 'eval':['deviceCollection=this.options.deviceCollection']}],
	render	:	function () {
 		GroupView1.prototype.render.apply(this, arguments);
 		AdvancePannel.render.apply(this, arguments);
 		return this;
 	},
 	events: _.extend(GroupView1.prototype.events,AdvancePannel.events, {
 		"tap .editGroup" : "showAdvancePannel",
 		"tap .deleteGroup" : "deleteGroup"
 	}),
 	deleteGroup : function () {
 		confirmDialog.show("Are you sure, you want to delete group?", _.bind(function(sure){
 			if(!sure) return;
 			var groupInfo = this.model.toJSON();
//			groupInfo.rank = groupInfo.id;
			groupInfo.controls = [];
			this.model.ioSocket.emit("modifyGroup", groupInfo, function (err){if(err)console.log(err)});
 		}, this));
 	},
 	showAdvancePannel : function () {
		AdvancePannel.showAdvancePannel.apply(this, arguments);
		//this.$el.css('top', '50px');
		this.$el.find('.roomTitleCont').hide();
		this.$el.find('.switchCont').hide();
		this.editPannel.render();

		var left = this.$el.offset().left;
		var top = Math.max(0,($(window).height() - this.$el.height())/2)
		this.$el.css('top', top+'px').css('left', left+'px').css('position','fixed');
		this.$el.find('.groupView').css('max-height',$(window).height()+'px').addClass('overflowScroll');

//		this.$el.css('top',Math.max(10,Math.min($('body').height()-this.editPannel.$el.height()-30, this.editPannel.$el.offset().top))+"px");
		
 	},
 	hideAdvancePannel : function () {
 		var groupName = this.$el.find('.groupName').val()
 		var groupSize = this.$el.find('.deviceGroupCont .tick:visible').length
 		if(groupName && groupSize) this._hideAdvancePannel();
 		else
 			confirmDialog.show("Group without "+((groupSize)?"name":"any device")+" cannot exist, are you sure you are done?", _.bind(function(sure) {
 				if (sure) this._hideAdvancePannel();	
 			},this));
 	},
 	_hideAdvancePannel : function () {
 		
 		this.$el.find('.groupView').css('max-height','').removeClass('overflowScroll');
 		this.$el.css('top', '').css('left', '').css('position','');
 		this.editPannel.erase();
 		this.$el.find('.switchCont').show();
 		this.$el.find('.roomTitleCont').show();
		AdvancePannel.hideAdvancePannel.apply(this, arguments);
 	}

});



MoodProxy = BaseView.extend({
	name : "MoodProxy",
	tagName : 'span',
	templateSelector:"#moodProxyTemplate",
	events : {
		"tap .moodIcon" : 'applyMood'
	},
	applyMood : function (event) {
		var $elm = $(event.target).closest('.moodIcon');
		var moodModel = this.model;
		console.log(moodModel);
//		$elm.append('<img src="static/images/loading.gif" style="position:absolute;left:-9px;top:-2px;width:60px;"/>')
		$elm.append('<i class="spinner fa fa-spinner fa-spin" style="position:absolute;left:-6px;top:-2px;font-size:50px;color:white;"></i>')
		moodModel.sendActionRequest("applyMood", {'id':$elm.attr('moodId'), 'icon':$elm.attr('moodIconName')}, function (err){
			setTimeout(function (){$elm.find('.spinner').remove()}, 1000);
			if(err)console.log(err)
		});
	},
	
});

MoodStripView = BaseView.extend({
	name : "MoodStrip",
	templateSelector:"#moodStripTemplate",
	subViewArrays : [{'viewClassName':'MoodProxy', 'reference':'moodProxyArray', 'parentSelector':'.moodProxyCont', 'array':'this.collection'}],
	initialize: function(opt) {
		var oriPrams = this.subViewArrays[0], i=0;
		this.subViewArrays = [];
		_.each(opt.collections, function(col){
			var clonPrams = _.extend({}, oriPrams);
			clonPrams.array = 'this.options.collections['+(i++)+']';
			clonPrams.reference +=('_'+i);
			this.subViewArrays.push(clonPrams);
			col.on('add', function(){
				var count=0;_.each(this.options.collections, function(ccol){count+=ccol.length;});
				this.$el.find('.moodProxyCont').width(55*count);
			}, this);
		}, this)
		return BaseView.prototype.initialize.apply(this, arguments);
	},
	showSelectiveMoodProxy : function (moods) {
		var cids = []; _.each(moods, function(m){cids.push(m.cid);});
		for(var i=1; i<=this.options.collections.length;i++){
			_.each(this['moodProxyArray_'+i], function(view){
				view.$el.hide();
				if(1+_.indexOf(cids, view.model.cid)) view.$el.show();
			});
		}
	},
	showAllMoodProxy : function() {
		for(var i=1; i<=this.options.collections.length;i++){
			_.each(this['moodProxyArray_'+i], function(view){
				var $moodProxy = view.$el.show();
			});
		}	
	}
})



EditMoodPannel = BaseView.extend({
	name : "EditMoodPannel",
	iconNameArray : ['morning', 'evening', 'welcome', 'leave', 'coffee', 'tea', 'meditate', 'ideate', 'wine', 'chat', 'romance', 'movie', 'gaming', 'meal', 'supper', 'sleepy', 'work', 'gym', 'partial', 'presentation'],
	templateSelector:"#editMoodTemplate",
	subViewArrays : [{'viewClassName':'DeviceGroupView', 'reference':'deviceGroupView', 'parentSelector':'.deviceGroupCont', 'array':'this.options.gC','eval':['deviceCollection=this.options.deviceCollection'], 'createOnRender':true}],
		events : {
		"tap .moodIcon" : 'changeMoodIcon'
	},
	changeMoodIcon : function (event) {
		this.selectedIcon = $(event.target).closest('.moodIcon').attr('moodName');
		this.$el.find('.moodName').val(this.selectedIcon)
		this.repaint();
		
	},
	_getJsonToRenderTemplate : function () {
		var moodJson = (this.moodInfo)?(this.moodInfo):((this.model)?this.model.toJSON():{});
		if(this.selectedIcon) moodJson.icon = this.selectedIcon;
		moodJson.iconNameArray = this.iconNameArray;
		return moodJson;
	},
	_getMoodInfo : function () {
		var moodInfo = this.model.toJSON();
		this.selectedIcon && (moodInfo.icon = this.selectedIcon) ;
		moodInfo.rank = this.$el.find('input[name=rank]:checked').val() || moodInfo.id;
		moodInfo.name=this.$el.find('.moodName').val() || moodInfo.name;
		moodInfo.name=moodInfo.name.charAt(0).toUpperCase() + moodInfo.name.slice(1);
		var controls = [], id=0, arr=[];
		this.options.gC.each(function (grp) {
			_.each(grp.get('controls'), function (sw, key) {
				if(sw.selected && !_.contains(arr, sw.devId+sw.switchID)) {
					arr.push(sw.devId+sw.switchID);
					if(sw.devId == 'irBlasters')
						controls.push({"id":++id, "devId":sw.devId, "switchId":sw.switchID, "state":"off", "irCodes":sw.setOn});
					else 
						controls.push({"id":++id, "devId":sw.devId, "switchId":sw.switchID, "state":sw.setOn});
				}
			}, this);
		}, this);
		moodInfo.controls = controls;
		return moodInfo;		
	},
	_saveMood : function () {
		if(this.avoidSaving) return;
		var info = this._getMoodInfo();
		console.log(info);
		this.model.ioSocket.emit("modifyMood", info, function (err){if(err)console.log(err)});
	},
	_onGroupModelChange : function(grp) {
		this._reMakeHash();
		_.each(grp.get('controls'), function (sw, key) {
			sw.task='moodSelection';sw.selected=sw.hidden=false;
			if(this.hash[sw.devId] && _.has(this.hash[sw.devId], sw.switchID)){
				sw.selected=true;sw.setOn=this.hash[sw.devId][sw.switchID];
			}
			if(_.contains(['irRem', 'ipCam'], sw.type)) sw.hidden=true;
		}, this);
	},
	_reMakeHash : function () {
		var hash = {};
		_.each((this.moodInfo)?this.moodInfo.controls:this.model.get('controls'), function (obj) {
			if(!hash[obj.devId]) hash[obj.devId]={}; 
			hash[obj.devId][obj.switchId]= parseInt(obj.state)?obj.state:((obj.state=='on'||obj.state==true)?true:false);
			if(obj.devId == 'irBlasters')hash[obj.devId][obj.switchId] = obj.irCodes;
		}, this);
		this.hash = hash;
	},
	render : function () {
		this._reMakeHash();
		this.options.gC.each(function (grp) {
			grp.on('change', this._onGroupModelChange, this);
			this._onGroupModelChange(grp);
		}, this);

		BaseView.prototype.render.apply(this, arguments);
		setTimeout(_.bind(function(){this.$el.find('input[type="radio"][checked]').prop("checked", true);},this),200);
		return this;
	},
	erase : function () {
		if(!this.rendered) return;
		this.options.gC.each(function (grp) {
			grp.off('change', this._onGroupModelChange);
		}, this);
		this._saveMood();
		return BaseView.prototype.erase.apply(this, arguments);
	},
	repaint : function () {
		this.avoidSaving=true;
		this.moodInfo = this._getMoodInfo();
		BaseView.prototype.repaint.apply(this, arguments);
		this.avoidSaving=false;
		this.moodInfo = null;
		return this;
	}
});

/*



*/




MoodView = BaseView.extend(Popup).extend({
	name : "MoodView",
	templateSelector:"#moodViewTemplate",
	subViews : [{'viewClassName':'EditMoodPannel', 'reference':'editPannel', 'parentSelector':'.editTemplateCont', 'model':'this.model', 'eval':['gC=this.options.groupCollection', 'deviceCollection=this.options.deviceCollection'], 'supressRender':true}],
	events: _.extend(Popup.events, {
 		"tap .editMood" : "showPopUp",
 		"tap .deleteMood" : "deleteMood",
 	}),
 	showPopUp : function () {
		this.editPannel.render();
		this.$popup = Popup.showPopUp.apply(this, arguments);
		var left = this.$popup.offset().left;
		var top = Math.max(0,($(window).height() - this.$popup.height())/2);
		this.$popup.css('top', top+'px').css('left', left+'px').css('position','fixed');
		this.$popup.find('.editTemplateCont').css('max-height',$(window).height()+'px').addClass('overflowScroll');
		return this.$popup;
 	},
 	hidePopUp : function () {
 		var moodIcon = this.$el.find('.moodIconCont .tick:visible').length;
 		var moodSize = this.$el.find('.deviceGroupCont .tick:visible').length;
 		if(moodIcon && moodSize) this._hidePopUp();
 		else
 			confirmDialog.show("Mood without "+((moodSize)?"icon":"any device")+" cannot exist, are you sure you are done?", _.bind(function(sure) {
 				if (sure) this._hidePopUp();	
 			},this));
 	},
 	_hidePopUp : function () {	
 		this.$popup.find('.editTemplateCont').css('max-height','').removeClass('overflowScroll');
 		this.$popup.css('top', '').css('left', '').css('position','');
 		this.editPannel.erase();
		return Popup.hidePopUp.apply(this, arguments);
 	},
 	deleteMood : function () {
 		confirmDialog.show("Are you sure, you want to delete mood?", _.bind(function(sure){
 			if(!sure) return;
	 		var moodInfo = this.model.toJSON();
			moodInfo.rank = moodInfo.id;
			moodInfo.controls = [];
			this.model.ioSocket.emit("modifyMood", moodInfo, function (err){if(err)console.log(err)});
 		}, this)); 		
 	},
	_getJsonToRenderTemplate : function () {
		var moodJson = (this.model)?this.model.toJSON():{};
		moodJson.groups = [];
		var groups = _.groupBy(moodJson.controls, function (ctl) {
			var dev = this.options.deviceCollection.get(ctl.devId);
			if(dev) { //TODO if device is deleted from device setting it should be deleted from mood.
				var info = dev.get('loadInfo')[ctl.switchId];
				if(info){ctl.name = info.name; ctl.icon=info.icon; ctl.type = info.type;}
			}
			return (ctl.groupInfo)?ctl.groupInfo.id:9999;
		}, this);
		_.each(groups, function (ctls, gpId){
			moodJson.groups.push({'name':(ctls[0].groupInfo)?ctls[0].groupInfo.name:'No Group', 'controls':ctls});
		});
		return moodJson; 
	}
})




MainPageView = BaseView.extend({
	name : 'MainPageView',
	subViewArrays : [{'viewClassName':'GroupView1', 'reference':'roomViewArray', 'parentSelector':'', 'array':'this.collection'}],
	_getJsonToRenderTemplate : function () {return {'clusterCount':this.options.collections.length, 'currentCluster':this.currentCluster||1}},
	initialize: function(opt) {
		var oriPrams = JSON.parse(JSON.stringify(this.subViewArrays[0])), i=0;
		this.subViewArrays = [];
		_.each(opt.collections, function(col){
			var clonPrams = JSON.parse(JSON.stringify(oriPrams));
			_.each(clonPrams.eval, function(val, idx, eval){
				if(val == 'deviceCollection') eval[idx] = val+'=this.options.deviceCollections['+i+']';
				if(val == 'moodCollection') eval[idx] = val+'=this.options.moodCollections['+i+']';
				if(val == 'groupCollection') eval[idx] = val+'=this.options.groupCollections['+i+']';
			}, this);
			clonPrams.array = 'this.options.collections['+(i++)+']';
			clonPrams.reference +=('_'+i);
			if(clonPrams.parentSelectorPrefix)
				clonPrams.parentSelector = clonPrams.parentSelectorPrefix + ('_'+i);
			this.subViewArrays.push(clonPrams);
		}, this)
		console.log(this.subViewArrays);
		return BaseView.prototype.initialize.apply(this, arguments);
	},
	render : function () {
		this.moodStrip && $('#moodWigitCont').show() && this.moodStrip.render();
		return BaseView.prototype.render.apply(this, arguments);
	},
	erase : function () {
		this.moodStrip && $('#moodWigitCont').hide() && this.moodStrip.erase();
		return BaseView.prototype.erase.apply(this, arguments);
	}
})

GroupProxyView = BaseView.extend({
	name : "GroupProxyView",
	proxyWidth:94,
	proxyMargin:13,
	proxyMinMargin:13,
	templateSelector:"#groupProxyViewTemplate",
	_getJsonToRenderTemplate : function () {
		return _.extend(this.model.toJSON(),{'width':this.proxyWidth, 'margin':this.proxyMargin, 'minMargin':this.proxyMinMargin});
	},
	events: {
		"tap .powerOffIcon"	: "powerOff",
		"tap .moodIcon"	: "applyMood",
		"tap .groupProxyCont" : "onProxyTap"
	},
	onProxyTap : function () {
		this.options.parentView.switchToGroupview(this.model, this.options.moodCollection);
	},
	powerOff : function(event) {
		event.stopPropagation();
		console.log("powerOff");
		$(event.target).closest('.powerOffIcon').append($loader=$('<i class="patchSpinner brightColor fa fa-spinner fa-spin"></i>'))
		this.model.powerOff(function () {setTimeout(function (){$loader.remove()}, 1000)});
	},
	applyMood : function (event) {
		event.stopPropagation();
		var $elm = $(event.target).closest('.moodIcon');
		var moodModel = this.options.moodCollection.get($elm.attr('moodId'));
		console.log(moodModel);
		$elm.append($loader=$('<i class="patchSpinner brightColor fa fa-spinner fa-spin"></i>'))
		moodModel.sendActionRequest("applyMood", {'id':$elm.attr('moodId')}, function (err){
			setTimeout(function (){$elm.find('.patchSpinner').remove()}, 1000);
			if(err)console.log(err)
		});
	}
})

GroupProxyMainPageView = MainPageView.extend({
	name : 'GroupProxyMainPageView',
	subViewArrays : [{'viewClassName':'GroupProxyView', 'reference':'groupProxyArray', 'parentSelectorPrefix':'.proxyCont', 'array':'this.collection', 'eval':['moodCollection']}],
	templateSelector:"#groupProxyMainPageViewTemplate",
	initialize: function(obj) {
		$('#backImageCont').on('tap', _.bind(this.backClicked, this));
		return MainPageView.prototype.initialize.apply(this, arguments);
	},
	render : function () {
		$(".appArea").css('padding',0);
		this.$el.css('width','100%');
		var wth = this.$el.width()
		, pWth = GroupProxyView.prototype.proxyWidth
		, pMar = GroupProxyView.prototype.proxyMinMargin
		, proxysInARow = Math.floor(wth/(pWth+2*pMar))
		, extraMrgin = wth - (proxysInARow*(pWth+2*pMar))
		;
		extraMrgin = Math.floor((extraMrgin-2*pMar)/(2*(proxysInARow+1)));
		GroupProxyView.prototype.proxyMargin = extraMrgin + pMar;
		MainPageView.prototype.render.apply(this, arguments);
		this.$el.css('width','100%');
		this.$el.find('.proxyCont').css('padding-left',pMar+extraMrgin).css('padding-right',pMar+extraMrgin);
		return this;
	},
	erase : function () {
		$(".appArea").css('padding', '');
		return MainPageView.prototype.erase.apply(this, arguments);
	},
	backClicked : function() {
		if(!this.rendered) return;
		this.moodStrip.showAllMoodProxy()
		$(".appArea").css('padding',0);
		this.grpView.removeView();
		this.$el.find('.proxyCont').show();
		$('#backImageCont').hide();
		$('#burgerImageCont').show();

	},
	switchToGroupview : function (grpMdl, moodCollection) {
		console.log("onProxyTap");	
		this.grpView = new GroupView1({model:grpMdl});
		this.$el.find('.groupViewCont').prepend(this.grpView.$el);
		this.$el.find('.proxyCont').hide();
		$(".appArea").css('padding', '');
		this.grpView.render();
		$('#burgerImageCont').hide();
		$('#backImageCont').show();
		var moodModels=[];
		_.each(_.pluck(grpMdl.get('groupMoods'),'id'), function(id){moodModels.push(moodCollection.get(id))});
		this.moodStrip.showSelectiveMoodProxy(moodModels)

	}
})




EditPageView = MainPageView.extend({
	templateSelector:"#editPageTemplate",
	name : 'EditPageView',
	events : {
		"tap .addGroupButton" : 'addNewGroup',
		"tap .clusterTabs span" : 'switchCluster'
	},
	subViewArrays : [{'viewClassName':'GroupEditView', 'reference':'groupViewArray', 'parentSelectorPrefix':'.editViewCont', 'eval':['deviceCollection'],'array':'this.collection', 'supressRender':true}],
	render : function () {
		MainPageView.prototype.render.apply(this, arguments);
		_.each(this['groupViewArray_'+(this.currentCluster||1)], function(view){
			view.render()
		}, this);
		return this;
	},
	switchCluster : function (event) {
		this.currentCluster = $(event.target).attr('clusterNo');
		this.repaint();
	},
	addNewGroup : function () {
		var dummyModel = new Backbone.Model({'name':'', "id":0});
		dummyModel.ioSocket = ioSockets[(this.currentCluster-1)||0]
		var tmpClass = GroupEditView.extend({
			_hideAdvancePannel : function () {
				GroupEditView.prototype._hideAdvancePannel.apply(this, arguments);	
				this.removeView();
			}
		});
		var tmpGroupView = new tmpClass({'model':dummyModel, 
			'deviceCollection':this.options.deviceCollections[(this.currentCluster-1)||0]});
		this.$el.find('.editViewCont_'+(this.currentCluster||1)).prepend(tmpGroupView.render().$el);
		tmpGroupView.showAdvancePannel();
	}
});



DevStngPageView = MainPageView.extend({
	templateSelector:"#devStngPageTemplate",
	name : 'DevStngPageView',
	events : {
		"tap .clusterTabs span" : 'switchCluster'
	},
	subViewArrays : [{'viewClassName':'DeviceView', 'reference':'groupViewArray', 'parentSelectorPrefix':'.devStngViewCont', 'eval':['deviceCollection'],'array':'this.collection', 'supressRender':true}],
	render : function () {
		MainPageView.prototype.render.apply(this, arguments);
		_.each(this['groupViewArray_'+(this.currentCluster||1)], function(view){
			view.render()
		}, this);
		return this;
	},
	switchCluster : function (event) {
		this.currentCluster = $(event.target).attr('clusterNo');
		this.repaint();
	}
});

DeviceView = BaseView.extend({
	templateSelector:"#groupTemplate",
	name : "DeviceView",
	subViewArrays : [{'viewClassName':'EditableSwitch', 'reference':'switchViewArray', 'parentSelector':'.switchCont', 'array':'this.switchCollection', 'eval':['deviceCollection=this.options.deviceCollection']}],
	events : {
		"tap .deleteGroup" : 'deleteDevice'
	},
	initialize: function(obj) {
		var ColClass = Backbone.Collection.extend({model:SwitchModel});
		this.switchCollection = new ColClass();
		this.switchCollection.on("add", function (swModel) {swModel.ioSocket=this.model.collection.ioSocket;}, this);
		this.switchCollection.set(_.values(this.model.get("loadInfo")), {merge: true});
		this.model.on('change', _.bind(function (model) {
			this.switchCollection.set(_.values(this.model.get("loadInfo")), {merge: true});
		}, this));
		BaseView.prototype.initialize.apply(this, arguments);
    },
    _isDeviceDeletable : function () {
    	var key, loadInfo = this.model.get("loadInfo");
    	for (key in loadInfo) {
    		if (!loadInfo[key].disabled) return false;
    	}
    	return true;
    },
    render : function () {
    	BaseView.prototype.render.apply(this, arguments);
    	this.$el.find('.deleteGroup')[(this._isDeviceDeletable())?'show':'hide']();
    	if(!this.switchCollection.models.length) this.$el.hide();
    	return this;
    },
    deleteDevice : function () {
    	if(!this._isDeviceDeletable()) return;
    	console.log(this.model.id);
    	this.options.deviceCollection.ioSocket.emit("deleteDevice", this.model.id, function(err) {if(err)console.log(err);});
    }
})



IrButtonRecorder = BasicDialog.extend({
	templateSelector:"#recordIRInterface",
	initialize : function (obj) {
		obj.socket.on('irCaptureSuccess', _.bind(this._onIRCapture, this))
		return BasicDialog.prototype.initialize.apply(this, arguments);
	},
	events: {
		"tap #startIrCapture"  : "_startIrCapture",
		"tap #stopIrCapture"  : "_stopIrCapture",
		"tap #playCaptured"  : "_playCapturedIr",
		"tap .cross"  : "hide",
		"tap #saveCaptured" : "_saveCaptured",
		"tap .blstrIconCont" : "changeHardware"
	},
	show : function(name) {
		BasicDialog.prototype.show.apply(this, arguments);
		this.$el.find('#name').html(name);
		this.capturedData = {"name":name};
		var blasters = this.options.deviceCollection.where({"id":"irBlasters"})[0].get("loadInfo");
		_.each(blasters, function(blstr, id){
			this.$el.find('.blstrIconListCont').append($('<div class="blstrIconCont" blstrId="'+id+'" style="position:relative;width:50px;float:left;margin:5px 0px;"><img style="width:100%;cursor:pointer;" src="static/'+revId+'/images/transparent/'+blstr.icon+'.png" /><div class="tick theamBGColor"></div></div>'));
		}, this);
		this.$el.find('.blstrIconCont .tick').hide();
		this.$el.find('.blstrIconCont[blstrId="'+this.blstrId+'"] .tick').show();
	},
	changeHardware : function (event) {
		var $iconCont = $(event.target).closest('.blstrIconCont'), blstrId=$iconCont.attr('blstrId');
		this.blstrId = blstrId;
		this.$el.find('.blstrIconCont .tick').hide();
		this.$el.find('.blstrIconCont[blstrId="'+this.blstrId+'"] .tick').show();
		this.trigger("onHwChange", blstrId);
	},
	_saveCaptured : function () {
		this.trigger("saveButtonIr", this.capturedData);
		this.hide();
	},
	_onIRCapture : function (data) {
		console.log(data);
		this.capturedData = _.extend(this.capturedData, data);
		this.$el.find('#encoding').html(data.encoding);
		this.$el.find('#bits').html(data.bits);
		this.$el.find('#code').html(data.code);
		this.$el.find('#length').html(data.length);

		this.$el.find('#stopIrCapture').hide();
		this.$el.find('#startIrCapture').show();
		this.$el.find('#playCaptured').show();
		this.$el.find('#saveCaptured').show();

		this.$el.find('.done').hide();
		this.$el.find('.cancle').show();
	},
	_startIrCapture : function () {
		this.$el.find('#encoding').html("&nbsp");
		this.$el.find('#bits').html("&nbsp");
		this.$el.find('#code').html("&nbsp");
		this.$el.find('#length').html("&nbsp");

		this.options.socket.emit('runIrProcess', {devId:this.blstrId, process:"startReciever"}, function(err){console.log('startReciever command sent!!');});
		this.$el.find('#saveCaptured').hide();
		this.$el.find('#startIrCapture').hide();
		this.$el.find('#stopIrCapture').show();
		this.$el.find('#playCaptured').hide();
	},
	_stopIrCapture : function () {
		console.log("_stopIrCapture called send emit runIrProcess stopReciever")
		this.options.socket.emit('runIrProcess', {devId:this.blstrId, process:"stopReciever"});
		this.$el.find('#saveCaptured').hide();
		this.$el.find('#stopIrCapture').hide();
		this.$el.find('#startIrCapture').show();
		this.$el.find('#playCaptured').hide();		
	},
	_playCapturedIr : function () {
		this.options.socket.emit('runIrProcess', _.extend({devId:this.blstrId, process:"playRawCode"},this.capturedData), function(){console.log('done!!');});
	}
})

RemoteEditViewer = RemoteViewer.extend({
	subViews : [{'viewClassName':'IrButtonRecorder', 'reference':'recorderDialog', 'parentSelector':'.iRrecorderCont', 'model':null, 'eval':['socket=this.options.socket','deviceCollection=this.options.deviceCollection'], 'supressRender':true}],
	iconList : ['remote_mini', 'remote_mini_generic', 'remote_with_numpad', 'remote_default', 'remote_ac_default'],
	events: {
		"tap .popupPannel > .cross" : "hidePopUp",
		"tap .btn" : "onButtonTap",
		"longTap .btn" : "editButtonCode",
		"saveButtonIr .iRrecorderCont" : "saveButtonIr",
		"tap .remoteIconCont" : "changeIcon",
		"tap .blstrIconCont" : "changeBlaster",
		"change #remoteName" : "changeName"
	},
	initialize : function (obj) {
		RemoteViewer.prototype.initialize.apply(this, arguments);
		this.recorderDialog.on("saveButtonIr", _.bind(this.saveButtonIr, this));
		this.recorderDialog.on("onHwChange", _.bind(this._changeBlaster, this));
		this.recorderDialog.blstrId = 'HcIrBlaster';
		return this;
	},
	render : function(){
		RemoteViewer.prototype.render.apply(this, arguments);
		this.$el.find('.remoteCont').addClass('theamBorderColor').css('border-width','1px').css('border-style','solid').css('border-radius','5px');
		this.$el.find('.iconListCont').show();
		this.$el.find('.recoderMeta').show();
		var blasters = this.options.deviceCollection.where({"id":"irBlasters"})[0].get("loadInfo");
		_.each(blasters, function(blstr, id){
			this.$el.find('.blstrIconListCont').append($('<div class="blstrIconCont" blstrId="'+id+'" style="position:relative;width:50px;float:left;margin:5px 0px;z-index:5;"><img style="width:100%;cursor:pointer;" src="static/'+revId+'/images/transparent/'+blstr.icon+'.png" /><div class="tick theamBGColor"></div></div>'));
		}, this);
		_.each(this.iconList, function(icon, indx){
			this.$el.find('.iconListCont').append($('<div class="remoteIconCont" icon="'+icon+'" style="position:relative;width:50px;float:left;margin:5px 0px;z-index:5;"><img style="width:100%;cursor:pointer;" src="static/'+revId+'/images/transparent/'+icon+'.png" /><div class="tick theamBGColor"></div></div>'));
		}, this);
		return this;
	},
	showFeed : function (model) {
		RemoteViewer.prototype.showFeed.apply(this, arguments);
		this.$el.find('.tick').hide();
		this.$el.find('.remoteIconCont[icon='+model.get('icon')+'] .tick').show();
		var blstrId = this.recorderDialog.blstrId || 'HcIrBlaster';
		this.model.set('irBlasterId', blstrId);
		this.$el.find('.blstrIconCont[blstrId="'+blstrId+'"] .tick').show();
		this.$el.find('.popupPannel').css('top', '0px');
		this.$el.find('#remoteName').val(model.get('name'));
		this.checkButtonList();
	},
	checkButtonList : function () {
		this.options.socket.emit("getButtonList", {"remoteId":this.model.get('switchID')}, _.bind(function(err, list){
			console.log(err, list);
			_.each(list, function(keyName) {this.$el.find('[code="'+keyName+'"] .tick').show()}, this)
		}, this));		
	},
	changeName : function () {
		var name = this.$el.find('#remoteName').val().trim();
		if(!name) return this.$el.find('#remoteName').val(this.model.get('name'));
		this.model.setSwitchParam({'name':name}, _.bind(function(rsp){
			this.model.set('name', name);
		}, this));
	},
	changeBlaster : function (event) {
		var $iconCont = $(event.target).closest('.blstrIconCont'), blstrId=$iconCont.attr('blstrId');
		this._changeBlaster(blstrId);
	},
	_changeBlaster : function (blstrId) {
		this.$el.find('.blstrIconCont .tick').hide();
		this.$el.find('.blstrIconCont[blstrId="'+blstrId+'"] .tick').show();
		this.recorderDialog.blstrId = blstrId;
		this.model.set('irBlasterId', blstrId);
	},
	changeIcon : function (event) {
		var $iconCont = $(event.target).closest('.remoteIconCont'), icon=$iconCont.attr('icon');
		this.$el.find('.remoteIconCont .tick').hide();
		this.paintRemote(icon);
		this.model.setSwitchParam({'icon':icon}, _.bind(function(rsp){
			this.$el.find('.remoteIconCont[icon='+icon+'] .tick').show();
			this.model.set('icon', icon);
		}, this));
		this.checkButtonList();
	},
	editButtonCode : function (event) {
		var $btn = $(event.target).closest('.btn');
		var name = $btn.attr('code');
		this.recorderDialog.show(name);
	},
	saveButtonIr : function (data) {
		console.log(data);
		data.remoteId = this.model.get("switchID"); // in device irRemotes switchId is the remoteId
		this.options.socket.emit("editRemoteIrCode", data, _.bind(function(err){console.log(err);this.checkButtonList();}, this));
	}
});

IrEditProxy = BaseView.extend({
	templateSelector:"#irRemoteEditProxyTemplate",
	_getJsonToRenderTemplate : function () {return this.model;},
	events: {
		"tap .editIrRemote"  : "_editIrRemote",
		"tap .deleteIrRemote"  : "_deleteIrRemote"
	},
	_editIrRemote : function () {
		var model = _.omit(JSON.parse(JSON.stringify(this.model)), "id");
		console.log(this.model);
		model = new SwitchModel(_.extend({'irBlasterId':'HcIrBlaster', 'switchID':this.model.id}, model));
		model.on('change', _.bind(function(model){
			this.model = _.extend(this.model, model.changed);//this.model is simple object
			this.repaint();
		}, this));
		model.ioSocket = this.options.socket;
		this.options.remoteEditViewer.showFeed(model);
	},
	_deleteIrRemote : function () {
		console.log("delete remote with id", this.model.id);
		this.options.socket.emit("deleteIrRemote", {'remoteId':this.model.id}, function(err, msg){
			err && console.log(err);
			if(msg && msg.success) location.reload();
		});
	}
});


IRSettingPage = BaseView.extend({
	templateSelector:"#iRSettingTemplate",
	subViewArrays : [{'viewClassName':'IrEditProxy', 'reference':'proxyViewArray', 'parentSelector':'.irRemProxyCont', 'eval':['socket=this.options.socket', 'remoteEditViewer=this.remoteEditViewer'], 'array':'_.where(_.values(this.options.deviceCollection.where({"id":"irRemotes"})[0].get("loadInfo")), {"editable":true})','createOnRender':true}],
	initialize : function (obj) {
		this.remoteEditViewer = new RemoteEditViewer({'el':$("#remoteEditorCont"), 'socket':this.options.socket, 'deviceCollection':this.options.deviceCollection});
		return 	BaseView.prototype.initialize.apply(this, arguments);
	},
	events : {
		"tap .addRemoteButton" : "_addNewRemote"
	},
	render : function () {
		!this.remoteEditViewer.rendered && this.remoteEditViewer.render();
		return 	BaseView.prototype.render.apply(this, arguments);
	},
	_addNewRemote	: function() {
		console.log("Add Ir Remote called");
		this.options.socket.emit("createIrRemote", _.bind(function(err, data){
			if(err)return console.log(err);
			console.log(data);
			if(data && data.id && data.icon && data.name) {
				var obj = this.options.deviceCollection.where({"id":"irRemotes"})[0].get("loadInfo");
				obj[data.id] = {"devId":"irRemotes","editable":true,"icon":data.icon,"id":data.id, "name":data.name, "type":"irRem"};
				this.repaint();
			}
		}, this));
		// var indx = "" + (1 + _.max(_.map(_.keys(obj), function(i){return parseInt(i)})));
		// obj[indx] = {"devId":"irRemotes","editable":true,"icon":"remote_default","id":0, "name":"no name", "type":"irRem"};
		// this.repaint();
	}
});




EditMoodPageView = MainPageView.extend({
	templateSelector:"#editMoodPageTemplate",
	name : 'EditMoodPageView',
	events : {
		"tap .addMoodButton" : 'addNewMood',
		"tap .clusterTabs span" : 'switchCluster'
	},
	subViewArrays : [{'viewClassName':'MoodView', 'reference':'moodViewArray', 'parentSelectorPrefix':'.moodViewCont', 'eval':['deviceCollection', 'groupCollection'], 'array':'this.collection', 'supressRender':true}],
	render : function () {
		MainPageView.prototype.render.apply(this, arguments);
		_.each(this['moodViewArray_'+(this.currentCluster||1)], function(view){
			view.render()
		}, this);
		return this;
	},
	switchCluster : function (event) {
		this.currentCluster = $(event.target).attr('clusterNo');
		this.repaint();
	},
	addNewMood : function () {
		var dummyModel = new Backbone.Model({'name':'', "id":0, "icon":'', controls:[]});
		dummyModel.ioSocket = ioSockets[(this.currentCluster-1)||0]
		var tmpClass = MoodView.extend({
			_hidePopUp : function () {
				MoodView.prototype._hidePopUp.apply(this, arguments);	
				this.removeView();
			}
		});
		var tmpMoodView = new tmpClass({'model':dummyModel, 
			'deviceCollection':this.options.deviceCollections[(this.currentCluster-1)||0],
			'groupCollection':this.options.groupCollections[(this.currentCluster-1)||0]
		});
		this.$el.find('.moodViewCont_'+(this.currentCluster||1)).prepend(tmpMoodView.render().$el);
		tmpMoodView.showPopUp();
	}
});



ConfigureClusterView = BaseView.extend({
	templateSelector:"#configureClusterTemplate",
	name : 'ConfigureClusterView',
	events : {
		"change #ipOctet" : 'ipOctetChange',
		"tap #addCluster" : 'onAddNewCluster',
		"tap .clstrStng .remove" : 'onDeleteCluster',
		"change .clstrStng input" : 'onClusterIpChange'
	},
	_getJsonToRenderTemplate : function () {
		return {"ipArr":localIpArr};
	},
	ipOctetChange : function(){
		var valStr = this.$el.find("#ipOctet").val(), ipOctet = parseInt(valStr);
		if(valStr != ipOctet || ipOctet<2 || ipOctet > 254)
			return this.$el.find("#ipOctet").val(this.$el.find("#ipOctet").attr('orig-value'))
		this.options.socket.emit("updateIpOctet", {"ipOctet":ipOctet}, _.bind(function (status) {
			console.log(status);
		}, this));
	},
	onAddNewCluster : function(event) {
		this.$el.find("#addCluster").hide();
		this.$el.find("#dummyClstrStng").show();
	},
	onDeleteCluster : function(event) {
		var $clusterSettings = $(event.target).closest('.clstrStng'), $inpt = $clusterSettings.find('input');
		if(!$inpt.attr('orig-value'))
			return this.repaint();
		$clusterSettings.remove();
		this.onClusterIpChange();
	},
	onClusterIpChange : function () {
		this.$el.find('#addClusterError').hide();
		var ipArr = [], err=false;
		var $inpts = this.$el.find('.clstrStng input');
		for (var i=0; i<$inpts.length; i++) {
			var val = $($inpts[i]).val();
			if(i+1 == $inpts.length && !val) continue; 
			ipArr[i]=val;
			var octates = ipArr[i].split('.');
			if(octates.length != 4) {err=true; break;}
			for (var j=0; j<octates.length;j++) {
				octates[j] = parseInt(octates[j]);
				if(octates[j]<0 || octates[j]>255){err=true; break;}
			}
			if(err || octates.join('.') != ipArr[i]) {err=true; break;}
		}
		if(err) {
			this.$el.find('#addClusterError .errorMsg').html("Invalid IP Address!");
			this.$el.find('#addClusterError').show();
			this.$el.find("#addCluster").hide();
			return;
		}
		this.options.socket.emit("updateClusterIps", {"ipArr":ipArr}, _.bind(function (status) {
			console.log(status);
			if(!status || !status.success) {
				this.$el.find('#addClusterError .errorMsg').html(status.msg);
				this.$el.find('#addClusterError').show();
				this.$el.find("#addCluster").hide();
				return;
			}
			location.reload();
		}, this));
	}
})




ConfigureSwitchboardModuleView = BaseView.extend({
	templateSelector:"#configureModuleTemplate",
	events: {
		"tap .moduleNotAttached #retryButton" : "tryCommunication",
		"tap .moduleAttached #configureNewModuleButton" : "configureModule",
		"tap .connectedConfigDone #configMore" : "configureMore",
		"tap .connectedConfigDone #configDone" : "doneConfiguration"
	},
	doneConfiguration : function () {
//		$('#menuCont .mainPannel').trigger('tap');
//		refresh the page instead.
		window.location.href = '/';
	},
	configureMore : function () {
		this._removeGroupViews();
		this.$el.find('.configuredModuleDisplay').hide()
		this.$el.find(".connectedConfigDone").hide();
		var $mdlNtAtch = this.$el.find('.moduleNotAttached').show();
		$mdlNtAtch.find('.connectModuleMsg').show();
		$mdlNtAtch.find('.retryMsg').hide();
	},
	_removeGroupViews : function () {
		for (var i=0; i<this.groupViewArr.length; i++) {
			this.groupViewArr[i].removeView();
		}
		this.groupViewArr = [];
	},
	_onConfigurationConfirmation : function (model) {
		if (model.changed && typeof model.changed.disabledCtls != 'undefined' && 
			model._previousAttributes.disabledCtls > model.attributes.disabledCtls) {
				this.$el.find(".connectedConfigDone").show();
				model.off('change', this._onConfigurationConfirmation, this);
		}
	},
	configureModule : function (event) {
		var moduleName = null;
		// moduleName = this.$el.find('.moduleName').val();
		// if(!moduleName) {
		// 	this.$el.find('.errorMsgDiv span').html('Please enter module name.');
		// 	this.$el.find('.errorMsgDiv').show();
		// 	return;
		// }
		// this.$el.find('.moduleAttached').hide();
		this.options.socket.emit("configureConnectedModule", {moduleName:moduleName}, _.bind(function (err, groupIds) {
			//this.$el.find('.moduleAttached').show();
			if(!err) {
				if(typeof groupIds != 'undefined') {
					console.log(groupIds);
					this.groupViewArr = [];
					setTimeout(_.bind(function () {
						this.$el.find('.loader').hide();
						var gC = this.options.parentView.options.gC;
						for (var i=0; i<groupIds.length; i++) {
							var grpMdl = gC.get(groupIds[i]);
							grpMdl.on('change', this._onConfigurationConfirmation, this);
							var grpView = new GroupView1({model:grpMdl});
							this.$el.find('.configuredModuleDisplay').show().append(grpView.$el);
							grpView.render();
							this.groupViewArr.push(grpView);
						}
					}, this), 2000);
				}
				return;
			}
			this.$el.find('.loader').hide();
			if (err == 'noConnect') {
				this.$el.find('.moduleAttached').hide();
				this.$el.find('.moduleNotAttached').show();
				return;
			}
			this.$el.find('.errorMsgDiv span').html(err);
			this.$el.find('.errorMsgDiv').show();
		}, this));
	},
	tryCommunication : function (event) {
		var $mdlNtAtch = this.$el.find('.moduleNotAttached');
		$mdlNtAtch.hide();
		this.$el.find('.loader').show();
		this.options.socket.emit("checkSerialCableConnection", {}, _.bind(function (status) {
			$mdlNtAtch.show();
			if(!status) {
				this.$el.find('.loader').hide();
				$mdlNtAtch.find('.connectModuleMsg').hide();
				$mdlNtAtch.find('.retryMsg').show();
			}
			else {
				$mdlNtAtch.hide();
//				this.$el.find('.moduleAttached').show();
				this.configureModule();
			}
		}, this));
	}

});

ConfigureNewModuleView = BaseView.extend({
	templateSelector:"#addNewModuleTemplate",
	events : {
		"tap .showMore" : "toggleList",
		"tap .optionTab" : "switchView"
	},
	subViews : [{'viewClassName':'ConfigureSwitchboardModuleView', 'reference':'cnfgrSMView', 'parentSelector':'.configurationAppCont', 'eval':['socket=this.options.socket'], 'supressRender':false},
				{'viewClassName':'ConfigureIpCamaraView', 'reference':'cnfgrIPCamView', 'parentSelector':'.configurationAppCont', 'eval':['socket=this.options.socket'], 'supressRender':true},
				{'viewClassName':'ConfigureClusterView', 'reference':'cnfgrClusterView', 'parentSelector':'.configurationAppCont', 'eval':['socket=this.options.socket'], 'supressRender':true}],
	toggleList : function() {
		var $list = this.$el.find('.dropDownOptions');
		if($list.is(':visible')) $list.hide();
		else $list.show();
	},
	switchView : function (event) {
		this.cnfgrSMView.erase();	this.cnfgrIPCamView.erase();
		this[$(event.target).attr('viewName')].render();
		this.$el.find(".currentOpt").html($(event.target).html())
		this.toggleList();
	}

});



ConfigureIpCamaraView = BaseView.extend({
	templateSelector:"#configureIPCamaraTemplate",
	name : 'ConfigureIpCamaraView',
	events : {
		"tap .showMoreCams" : 'toggleCamList',
		"tap #submitCamData" : 'submit',
		"tap .camDropDown .camTab" : 'changeFormData'
	},
	render : function () {
		this.options.socket.emit("getIpCamaraData", _.bind(function (res) {
			if(!res.success) return alert(res.msg);
			this.camData = res.data;
			this._populateCamList(this.camData);
			this.changeFormData();
		}, this));
		return BaseView.prototype.render.apply(this, arguments);
	},
	changeFormData : function (event) {
		this.$el.find('.errorMsg').html("");
		var camObjStr = (event)?$(event.target).closest('.camTab').attr("camObj"):"";
		var camCnt=_.keys(this.camData).length;
		if(!camObjStr && camCnt) 
			camObjStr='{"info":"Add new camera to system, to edit existng '+camCnt+' camera'+((camCnt>1)?'s':'')+' use above dropdown."}';
		var obj = JSON.parse(camObjStr);
		if(event) this.toggleCamList();
		this.$el.find('#camMetaData #infoSpan').html(obj.info || "Use following fields to edit "+obj.name+"'s parameters.");
		this.$el.find('#camMetaData #cameraId').val(obj.id);
		this.$el.find('#camMetaData #cameraName').val(obj.name);
		this.$el.find('#camMetaData #camaraIp').val(obj.ip);
		this.$el.find('#camMetaData #videoPath').val(obj.videoPath);
		this.$el.find('#camMetaData #userName').val(obj.userName);
		this.$el.find('#camMetaData #password').val(obj.password);
		this.$el.find('.currentCam').html(obj.name || "Add New");
	},
	_populateCamList : function (data) {
		this.$el.find('.errorMsg').html("");
		this.$el.find('.currentCam').html("Add New");
		this.$el.find('.camDropDown .camTab').remove();
		_.each(data, function(obj, id) {
			obj.id = id;
			this.$el.find('.camDropDown').append($("<div class='camTab' camObj='"+JSON.stringify(obj)+"'>"+obj.name+"</div>"))
		}, this);
		this.$el.find('.camDropDown').append($("<div class='camTab'>Add New</div>"))
	},
	toggleCamList : function() {
		var $list = this.$el.find('.camDropDown');
		if($list.is(':visible')) $list.hide();
		else $list.show();
	},
	submit : function () {
		this.$el.find('.errorMsg').html("");
		var obj = {};
		obj.id 			= this.$el.find('#cameraId').val();
		obj.name		= this.$el.find('#cameraName').val();
		obj.ip			= this.$el.find('#camaraIp').val();
		obj.videoPath	= this.$el.find('#videoPath').val();
		obj.userName	= this.$el.find('#userName').val();
		obj.password	= this.$el.find('#password').val();
		//TODO valid field value check 
		this.$el.find('.errorMsg').html("Saving parameters ...");
		this.options.socket.emit("editIpCamaraData", obj, _.bind(function (res) {
			console.log(res);
			if(!res.success) return this.$el.find('.errorMsg').html(res.msg);
			this.$el.find('.errorMsg').html("Parameters saved, restarting now, would take 10 to 15 seconds.");
			this.$el.find('#submitCamData').hide();
			this.options.socket.emit('restartHomeController');
			//setTimeout(_.bind(function() {this.$el.find('.errorMsg').html("");}, this), 3000)
		}, this));
	}

})




/*
 * A JavaScript implementation of the RSA Data Security, Inc. MD5 Message
 * Digest Algorithm, as defined in RFC 1321.
 * Version 2.2 Copyright (C) Paul Johnston 1999 - 2009
 * Other contributors: Greg Holt, Andrew Kepert, Ydnar, Lostinet
 * Distributed under the BSD License
 * See http://pajhome.org.uk/crypt/md5 for more info.
 */

var hexcase=0;function hex_md5(a){return rstr2hex(rstr_md5(str2rstr_utf8(a)))}function hex_hmac_md5(a,b){return rstr2hex(rstr_hmac_md5(str2rstr_utf8(a),str2rstr_utf8(b)))}function md5_vm_test(){return hex_md5("abc").toLowerCase()=="900150983cd24fb0d6963f7d28e17f72"}function rstr_md5(a){return binl2rstr(binl_md5(rstr2binl(a),a.length*8))}function rstr_hmac_md5(c,f){var e=rstr2binl(c);if(e.length>16){e=binl_md5(e,c.length*8)}var a=Array(16),d=Array(16);for(var b=0;b<16;b++){a[b]=e[b]^909522486;d[b]=e[b]^1549556828}var g=binl_md5(a.concat(rstr2binl(f)),512+f.length*8);return binl2rstr(binl_md5(d.concat(g),512+128))}function rstr2hex(c){try{hexcase}catch(g){hexcase=0}var f=hexcase?"0123456789ABCDEF":"0123456789abcdef";var b="";var a;for(var d=0;d<c.length;d++){a=c.charCodeAt(d);b+=f.charAt((a>>>4)&15)+f.charAt(a&15)}return b}function str2rstr_utf8(c){var b="";var d=-1;var a,e;while(++d<c.length){a=c.charCodeAt(d);e=d+1<c.length?c.charCodeAt(d+1):0;if(55296<=a&&a<=56319&&56320<=e&&e<=57343){a=65536+((a&1023)<<10)+(e&1023);d++}if(a<=127){b+=String.fromCharCode(a)}else{if(a<=2047){b+=String.fromCharCode(192|((a>>>6)&31),128|(a&63))}else{if(a<=65535){b+=String.fromCharCode(224|((a>>>12)&15),128|((a>>>6)&63),128|(a&63))}else{if(a<=2097151){b+=String.fromCharCode(240|((a>>>18)&7),128|((a>>>12)&63),128|((a>>>6)&63),128|(a&63))}}}}}return b}function rstr2binl(b){var a=Array(b.length>>2);for(var c=0;c<a.length;c++){a[c]=0}for(var c=0;c<b.length*8;c+=8){a[c>>5]|=(b.charCodeAt(c/8)&255)<<(c%32)}return a}function binl2rstr(b){var a="";for(var c=0;c<b.length*32;c+=8){a+=String.fromCharCode((b[c>>5]>>>(c%32))&255)}return a}function binl_md5(p,k){p[k>>5]|=128<<((k)%32);p[(((k+64)>>>9)<<4)+14]=k;var o=1732584193;var n=-271733879;var m=-1732584194;var l=271733878;for(var g=0;g<p.length;g+=16){var j=o;var h=n;var f=m;var e=l;o=md5_ff(o,n,m,l,p[g+0],7,-680876936);l=md5_ff(l,o,n,m,p[g+1],12,-389564586);m=md5_ff(m,l,o,n,p[g+2],17,606105819);n=md5_ff(n,m,l,o,p[g+3],22,-1044525330);o=md5_ff(o,n,m,l,p[g+4],7,-176418897);l=md5_ff(l,o,n,m,p[g+5],12,1200080426);m=md5_ff(m,l,o,n,p[g+6],17,-1473231341);n=md5_ff(n,m,l,o,p[g+7],22,-45705983);o=md5_ff(o,n,m,l,p[g+8],7,1770035416);l=md5_ff(l,o,n,m,p[g+9],12,-1958414417);m=md5_ff(m,l,o,n,p[g+10],17,-42063);n=md5_ff(n,m,l,o,p[g+11],22,-1990404162);o=md5_ff(o,n,m,l,p[g+12],7,1804603682);l=md5_ff(l,o,n,m,p[g+13],12,-40341101);m=md5_ff(m,l,o,n,p[g+14],17,-1502002290);n=md5_ff(n,m,l,o,p[g+15],22,1236535329);o=md5_gg(o,n,m,l,p[g+1],5,-165796510);l=md5_gg(l,o,n,m,p[g+6],9,-1069501632);m=md5_gg(m,l,o,n,p[g+11],14,643717713);n=md5_gg(n,m,l,o,p[g+0],20,-373897302);o=md5_gg(o,n,m,l,p[g+5],5,-701558691);l=md5_gg(l,o,n,m,p[g+10],9,38016083);m=md5_gg(m,l,o,n,p[g+15],14,-660478335);n=md5_gg(n,m,l,o,p[g+4],20,-405537848);o=md5_gg(o,n,m,l,p[g+9],5,568446438);l=md5_gg(l,o,n,m,p[g+14],9,-1019803690);m=md5_gg(m,l,o,n,p[g+3],14,-187363961);n=md5_gg(n,m,l,o,p[g+8],20,1163531501);o=md5_gg(o,n,m,l,p[g+13],5,-1444681467);l=md5_gg(l,o,n,m,p[g+2],9,-51403784);m=md5_gg(m,l,o,n,p[g+7],14,1735328473);n=md5_gg(n,m,l,o,p[g+12],20,-1926607734);o=md5_hh(o,n,m,l,p[g+5],4,-378558);l=md5_hh(l,o,n,m,p[g+8],11,-2022574463);m=md5_hh(m,l,o,n,p[g+11],16,1839030562);n=md5_hh(n,m,l,o,p[g+14],23,-35309556);o=md5_hh(o,n,m,l,p[g+1],4,-1530992060);l=md5_hh(l,o,n,m,p[g+4],11,1272893353);m=md5_hh(m,l,o,n,p[g+7],16,-155497632);n=md5_hh(n,m,l,o,p[g+10],23,-1094730640);o=md5_hh(o,n,m,l,p[g+13],4,681279174);l=md5_hh(l,o,n,m,p[g+0],11,-358537222);m=md5_hh(m,l,o,n,p[g+3],16,-722521979);n=md5_hh(n,m,l,o,p[g+6],23,76029189);o=md5_hh(o,n,m,l,p[g+9],4,-640364487);l=md5_hh(l,o,n,m,p[g+12],11,-421815835);m=md5_hh(m,l,o,n,p[g+15],16,530742520);n=md5_hh(n,m,l,o,p[g+2],23,-995338651);o=md5_ii(o,n,m,l,p[g+0],6,-198630844);l=md5_ii(l,o,n,m,p[g+7],10,1126891415);m=md5_ii(m,l,o,n,p[g+14],15,-1416354905);n=md5_ii(n,m,l,o,p[g+5],21,-57434055);o=md5_ii(o,n,m,l,p[g+12],6,1700485571);l=md5_ii(l,o,n,m,p[g+3],10,-1894986606);m=md5_ii(m,l,o,n,p[g+10],15,-1051523);n=md5_ii(n,m,l,o,p[g+1],21,-2054922799);o=md5_ii(o,n,m,l,p[g+8],6,1873313359);l=md5_ii(l,o,n,m,p[g+15],10,-30611744);m=md5_ii(m,l,o,n,p[g+6],15,-1560198380);n=md5_ii(n,m,l,o,p[g+13],21,1309151649);o=md5_ii(o,n,m,l,p[g+4],6,-145523070);l=md5_ii(l,o,n,m,p[g+11],10,-1120210379);m=md5_ii(m,l,o,n,p[g+2],15,718787259);n=md5_ii(n,m,l,o,p[g+9],21,-343485551);o=safe_add(o,j);n=safe_add(n,h);m=safe_add(m,f);l=safe_add(l,e)}return Array(o,n,m,l)}function md5_cmn(h,e,d,c,g,f){return safe_add(bit_rol(safe_add(safe_add(e,h),safe_add(c,f)),g),d)}function md5_ff(g,f,k,j,e,i,h){return md5_cmn((f&k)|((~f)&j),g,f,e,i,h)}function md5_gg(g,f,k,j,e,i,h){return md5_cmn((f&j)|(k&(~j)),g,f,e,i,h)}function md5_hh(g,f,k,j,e,i,h){return md5_cmn(f^k^j,g,f,e,i,h)}function md5_ii(g,f,k,j,e,i,h){return md5_cmn(k^(f|(~j)),g,f,e,i,h)}function safe_add(a,d){var c=(a&65535)+(d&65535);var b=(a>>16)+(d>>16)+(c>>16);return(b<<16)|(c&65535)}function bit_rol(a,b){return(a<<b)|(a>>>(32-b))};




CheckUpdatePageView = BaseView.extend({
	templateSelector:"#checkUpdateTemplate",
	render : function (){
		this.options.socket.emit(
			"checkUpdates", null, _.bind(function (rsp) {
				this.$el.find('.loader').hide();
				this.$el.find('.msgBox').show().html(rsp.msg);
				if(rsp.success) {
					this.$el.find('.msgBox').hide();
					this.$el.find('.updateNowMsg').show();
				} 
		}, this));
		return BaseView.prototype.render.apply(this, arguments);
	},
	events: {
		"tap .updateNow" : "updateNow"
	},
	updateNow : function (rsp) {
		this.$el.find('.loader').show();
		this.$el.find('.updateNowMsg').hide();
		this.options.socket.emit("updateNow", null, _.bind(function (rsp) {

		}, this));	

	}
});




WelcomeScreenPageView = BaseView.extend({
	templateSelector:"#welcomeScreenTemplate",
	events: {
		"tap #startConfigurationButton" : "start"
	},
	start : function (rsp) {
		configurationWorkFlow('networkSetting');
//		$('#menuCont .nwkStng').trigger('tap');		
	}
});




NetworkSettingPageView = BaseView.extend({
	templateSelector:"#networkSettingTemplate",
	events: {
		"tap #modifyNwkSecKeyButton" : "_onDone",
		"tap #skipNwkSecButton" : "_skipConfiguration"
	},
	render: function() {
		this.options.socket.emit("getNetworkSettings", null, _.bind(function (rsp) {
			if(rsp.name) {
				this.$el.find('.nwkSecKey').val('dummypassword');
				this.$el.find('.nwkSecKeyCnf').val('dummypassword');
			}
		}, this));
		BaseView.prototype.render.apply(this, arguments);
	},
	forIntalonFlow : function () {
		this.$el.find('#skipNwkSecButton').show();
	},
	onDone : function (rsp) {
		$('#menuCont .mainPannel').trigger('tap');		
	},
	_onDone : function (event) {
		// var networkName = this.$el.find('.nwkSecKey').val();
		// if(!networkName) {
		// 	this.$el.find('.errorMsgDiv span').html("Enter network name in the first row.");
		// 	this.$el.find('.errorMsgDiv').show();
		// 	return;			
		// }
		var securityKey = this.$el.find('.nwkSecKey').val();
		if(securityKey == 'dummypassword') return this.onDone();
		var confirmKey = this.$el.find('.nwkSecKeyCnf').val();
		if(!securityKey || securityKey != confirmKey) {
			this.$el.find('.errorMsgDiv span').html("Enter network password in first row and then re-enter same key in second row.");
			this.$el.find('.errorMsgDiv').show();
			return;
		}
		var networkName = securityKey;
		securityKey = hex_md5(securityKey);
		if(confirm("Modifying this network password will require reconfiguration of all the switch board modules. Are you sure you want to modify security key?"))
			this.modify(networkName, securityKey);
	},
	_skipConfiguration : function () {
		var securityKey = hex_md5(new Date().getTime()+"");
		console.log(securityKey);
		this.modify('Skip', securityKey);
	},
	modify : function (networkName, securityKey) {
		this.$el.hide();
		var $loader = $('<div style="text-align:center;"><img src="static/images/loading.gif"/></div>');
		this.$el.parent().append($loader);
		this.options.socket.emit("modifyNetworkSecurityKey", {"securityKey":securityKey, "networkName":networkName}, _.bind(function (rsp) {
			$loader.remove();
			this.$el.show();
			if(!rsp.success) {
				this.$el.find('.errorMsgDiv span').html(rsp.msg);
				this.$el.find('.errorMsgDiv').show();
				return;
			}
			this.onDone();
		}, this));
	}


});




CloudSettingPageView = BaseView.extend({
	templateSelector:"#cloudSettingTemplate",
		events: {
		"tap #modifyCloudAccountButton" : "_onDone",
		"tap #skipCldSetButton" : "_skipCloudSetting",
		"tap #changePasswordButton" : "_showChangePwd"

	},
	render: function() {
		this.options.socket.emit("getCloudSettings", null, _.bind(function (rsp) {
			if(rsp.email) {
				this.$el.find('.cloudEmail').val(rsp.email);
				this.$el.find('.passwordBlock').hide();
				this.$el.find('#modifyCloudAccountButton').hide();
				this.$el.find('#changePasswordButton').show();
			}
		}, this));
		BaseView.prototype.render.apply(this, arguments);
	},
	forIntalonFlow : function () {
		this.$el.find('#skipCldSetButton').show();
	},
	_showChangePwd : function () {
		this.$el.find('.passwordBlock').show();
		this.$el.find('#modifyCloudAccountButton').show();
		this.$el.find('#changePasswordButton').hide();
	},
	onDone : function (rsp) {
		$('#menuCont .mainPannel').trigger('tap');		
	},
	_onDone : function (event) {
		var cloudEmail = this.$el.find('.cloudEmail').val().trim();
		var cloudEmailCnf = cloudEmail;//this.$el.find('.cloudEmailCnf').val();
		if(!cloudEmail || cloudEmail != cloudEmailCnf) {
			this.$el.find('.errorMsgDiv span').html("Enter your email in the first row, and then re-enter the same in second row.");
			this.$el.find('.errorMsgDiv').show();
			return;			
		}
		var cloudPwd = this.$el.find('.cloudPwd').val();
		var cloudPwdCnf = this.$el.find('.cloudPwdCnf').val();
		if(cloudPwd == 'dummypassword') return this.onDone();
		if(!cloudPwd || cloudPwd != cloudPwdCnf) {
			this.$el.find('.errorMsgDiv span').html("Enter password in third row, and then re-enter the same in last row.");
			this.$el.find('.errorMsgDiv').show();
			return;
		}
		this.modify(cloudEmail, cloudPwd);
	},
	_skipCloudSetting : function () {
		this.modify('skip');
	},
	modify : function (cloudEmail, cloudPwd) {
		this.$el.hide();
		var $loader = this.$el.find('.loader');
		$loader.show();
		this.$el.parent().append($loader);
		this.options.socket.emit("modifyCloudSettings", {"email":cloudEmail, "password":cloudPwd}, _.bind(function (rsp) {
			$loader.remove();
			this.$el.show();
			if(!rsp.success) {
				this.$el.find('.errorMsgDiv span').html(rsp.msg);
				this.$el.find('.errorMsgDiv').show();
				return;
			}
			this.onDone();
		}, this));
	}
});



ThemeSettingPageView = BaseView.extend({
	templateSelector:"#theamSettingTemplate",
	_getJsonToRenderTemplate : function () {return {'theams':['Clasic', 'Maze'], 'colors':['Orange','Red','Blue','Green']};},
	events: {
		"tap #applyTheamButton" : "_applyTheam",
		"tap #restartInoho" : "restartInoho",
		"change select" : "onSysSetngChange"
	},
	_applyTheam : function (event) {
		var theamJson = $(this.$el.find('.theamTable input[type="radio"][name="theamColor"]:checked')[0]).val();
		if(!theamJson) return alert('Make a selection.');
		console.log(theamJson);
		theamJson = JSON.parse(theamJson);
		theamJson.homeView = $(this.$el.find('.theamTable input[type="radio"][name="homeView"]:checked')[0]).val();
		this.options.socket.emit("modifyThemeSettings", theamJson, _.bind(function (rsp) {
			location.reload();
		}, this));
	},
	restartInoho : function(){
		this.options.socket.emit('restartHomeController', function(){window.location.reload();});
	},
	onSysSetngChange : function () {
		var sysStngObj = {};
		sysStngObj.restoreWithInMins = this.$el.find(".avoidRestoTime").val()

		var dlpSltrs = this.$el.find(".dayLightTime select");
		sysStngObj.dLP = _.map($(dlpSltrs[0]).val().split(":").concat($(dlpSltrs[1]).val().split(":")), function(i){return parseInt(i);});
		
		var evpSltrs = this.$el.find(".eveningTime select");
		sysStngObj.evP = _.map($(evpSltrs[0]).val().split(":").concat($(evpSltrs[1]).val().split(":")), function(i){return parseInt(i);});

		var shpSltrs = this.$el.find(".sleepHourTime select");
		sysStngObj.sHP = _.map($(shpSltrs[0]).val().split(":").concat($(shpSltrs[1]).val().split(":")), function(i){return parseInt(i);});

		this.options.socket.emit('modifySystemSettings', sysStngObj);

	}	
});	



SideMenuView = BaseView.extend({
	templateSelector:"#sideMenuTemplate",
	events: {
		"tap .options" : "optionChange",
		"tap .hideMe" : "hideMe"
	},
	hideMe : function() {this.trigger('hideMe')},
	optionChange : function (event) {
		this.switchPage($(event.target).attr('jsVarNm'));
	},
	switchPage : function (pageName) {
		if(1 || this.currentPage != window[pageName]) { // in case of cluster repaint is required.
			if(this.currentPage)this.currentPage.erase();
			this.currentPage = window[pageName];
			this.currentPage.render();
		}
		if(this.$el.is(':visible'))
			this.trigger('hideMe');
	}

});



FileReaderPageView = BaseView.extend({
	templateSelector:"#fileReaderTemplate",
	initialize: function(obj) {
		obj.socket.on("fileContentStream", _.bind(this.onFileData, this));
		return BaseView.prototype.initialize.apply(this, arguments);
	},
	events: {
		"tap #submitFilePath" : "onSubmit",
	},
	onSubmit: function () {
		var filePath = this.$el.find('#filePath').val();
		console.log(filePath);
		$(this.$el.find('.fileContentArea')[0]).html("");
		this.timeStamp = (new Date()).getTime();
		this.options.socket.emit("fetchFile", {'fileName':filePath, 'token':this.timeStamp})
	},
	onFileData : function (obj) {
		console.log(obj);
		if (obj.token != this.timeStamp) return;
		$(this.$el.find('.fileContentArea')[0]).append(obj.data.replace(/\n/g, "<br/>"));
	}
});




CommandPosterPageView = BaseView.extend({
	templateSelector:"#commandPosterTemplate",
	events: {
		"tap #postJson" : "onSubmit",
	},
	onSubmit: function () {
		var eventName = this.$el.find('.eventName').val();
		console.log(eventName);
		var json = JSON.parse(this.$el.find('.textJson').val());
		console.log(json);
		this.options.socket.emit(eventName, json);
	}
});



var hashChanged = function () {console.log('Hash Changed!!')};
if ("onhashchange" in window) { // event supported?
	window.onhashchange = function () {hashChanged(window.location.hash);}
}
else { // event not supported:
	var storedHash = window.location.hash;
	window.setInterval(function () {(window.location.hash != storedHash) && (storedHash = window.location.hash) && hashChanged(storedHash);}, 500);
}
$('#burgerImageCont').on('tap', function () {
	var $menuContPar = $('#menuCont').parent();
	var $appContPar = $('#appCont').parent();
	if($menuContPar.css('display') == 'block') {
		$menuContPar.hide();
//		$appContPar.css('width', '100%');
	}
	else {
		$menuContPar.show();
//		$appContPar.css('width', '62%');				
	}
});
fixMoodStrip = false; //true; //false;
lastScrollTop=0;
hideMoodStrip = function () {
	if($(document).height() - $(window).height() - $(window).scrollTop() > $('.footer').height())
		$('.footer').animate({'bottom':-parseInt($('.footer').height())}, 300);
};
hideMoodStripTimer = setTimeout(hideMoodStrip, 5000);
$(window).scroll(function (){
	if(fixMoodStrip || !moodStrip || !moodStrip.rendered) return ;//hideMoodStrip();
	hideMoodStripTimer && clearTimeout(hideMoodStripTimer);
	hideMoodStripTimer = setTimeout(hideMoodStrip, 5000);
	var curScrollTop = $(window).scrollTop(), delta = curScrollTop-lastScrollTop;
	var ftrBtmPos = parseInt($('.footer').css('bottom'), 10)+delta;
	ftrBtmPos = Math.min(0, Math.max(ftrBtmPos, -parseInt($('.footer').height(), 10)));
	$('.footer').css('bottom', ftrBtmPos+'px');
	lastScrollTop=curScrollTop;
});

//	  setInterval(function () {$('#experiment').html(Date().substr(16,8));} , 1000)
var configurationWorkFlow = function (pageName) {
	var pageObjName;
	switch(pageName) {
		case "welcomeScreen" : pageObjName = 'welcomeScreenPage'; break;
		case "networkSetting" : pageObjName = 'networkSettingPage'; break;
		case "cloudSetting" : pageObjName = 'cloudSettingPage'; break;
		case "configureModule" : pageObjName = 'configureModulePage'; break;
	}
	if(pageObjName) {
		$('.hideWhileConfigureFlow').hide();
		sideMenu.switchPage(pageObjName);
		try {window[pageObjName].forIntalonFlow();}catch(err){}
		window[pageObjName].onDone = function () {
			$('.hideWhileConfigureFlow').show();
			ioSockets[primeIndx].emit("checkConfigurations")
		};
	}
	else 
		sideMenu.switchPage('mainPageView');
}
var showBurgerMenu = function () {
	$('#burgerImageCont').show();
	if(servedFromCloud) {
		$('.nwkStng, .cldStng, .cnfrMdl, .chkUpdt').hide();
	}else {
		setInterval(function () {if(Date.now()-pingTimeStamp < 8000)return; location.reload();}, 1000);
	}
};
var setAppTheamColor = function (appTheme, themeColor) {
		/*<!-Orange - #EE972D; green - #69C1A8; blue-#5ED5F3; red-#9E171D->*/
		if(typeof themeColor == 'undefined') themeColor = 'Orange';
		if(typeof appTheam == 'undefined') appTheam = 'Clasic';
		appTheam = appTheam.toLowerCase();
		themeColor = themeColor.toLowerCase();
		switch(themeColor) { // if you modify color here modify it in website.js as well as it sends the color to android or Iphone app.
			case "orange" : var color = (appTheam=='maze')?"#CE771D":"#EE972D", brightColor = (appTheam=='maze')?'#F3CBCB':"#EE972D", traprntColor = "96,20,31", inputColor=(appTheam=='maze')?'#E7CDB0':color; break;
			case "red"	  : var color = (appTheam=='maze')?"#832A28":"#9E171D", brightColor = (appTheam=='maze')?'#F3CBCB':"#9E171D", traprntColor = "96,20,31", inputColor=(appTheam=='maze')?'#A58F8F':color; break;
			case "blue"   : var color = (appTheam=='maze')?'#42487B':"#5EA5F3", brightColor = (appTheam=='maze')?'#93CBEB':"#5EA5F3", traprntColor = "26,20,50", inputColor=(appTheam=='maze')?'#758FAF':color; break;
			case "green"  : var color = (appTheam=='maze')?'#406E38':"#69C1A8", brightColor = (appTheam=='maze')?'#E3DBCB':"#69C1A8", traprntColor = "56,72,50", inputColor=(appTheam=='maze')?'#95AF8F':color; break;
		}

		var $sheet = $("<style>\
	hr {\
		border-top-color: "+color+";\
		border-bottom-color: "+((appTheam=='maze')?brightColor:"white")+";\
	}\
	.whiteBG{background-color: white;}\
	.whiteBorderColor{border-color:white;}\
	input[type='range']::-webkit-slider-thumb, input[type='radio']:checked:after{background-color: "+inputColor+";}\
	input[type='range'].bringOverMask::-webkit-slider-thumb {background-color:"+themeColor+"}\
	.theamColor{color: "+color+";}\
	.theamBGColor{background-color: "+color+";}\
	.brightBGColor{background-color: "+brightColor+";}\
	.appThemeMaze #ipCamaraFeedViewerCont .popupPannel, .appThemeMaze .onBackdrop > .basicSwitchTemplate {background-color: "+color+";}\
	.theamTextColor{color:"+inputColor+";}\
	input[type=radio], .theamBorderColor{border-color:"+inputColor+";}\
	select, input[type=password], input[type=text], textarea \
	{border-color:"+inputColor+((appTheam=="maze")?(";background-color:"+inputColor):"")+";}\
	.brightBorderColor{border-color:"+brightColor+";}\
	#bgImageCont{background-image: url('/static/images/backgrounds/app_2_2x_"+themeColor+".png');}\
	.translucentBg45 {background-color: rgba("+traprntColor+",0.45);}\
	.translucentBdr45 {border-color: rgba("+traprntColor+",0.45);}\
	#groupTitleHeaderForTrapTheam{border-bottom-color:rgba("+traprntColor+",0.45);}\
	.brightColor {color:"+brightColor+";}\
	</style>");
		$('body').append($sheet);	
}
var servedFromCloud = false, useSockets=servedFromCloud||true;

//setAppTheamColor();
var primeIndx=0;
var ioSockets=[], pingTimeStamp = Date.now();
hashChanged = function (hash) {
	if(!window.location.hash) return;
	var removeHash = false;
	switch(window.location.hash) {
		case '#updatenow'				: 	ioSockets[primeIndx].emit('updateNow');removeHash=true;break;
		case '#restorenetwork'			: 	ioSockets[primeIndx].emit('restoreNetwork');removeHash=true;break;
		case '#apprestart'				:
		case '#restartinoho'			: 	ioSockets[primeIndx].emit('restartHomeController');removeHash=true;break;
		case '#configurecloudtunnel'	: 	ioSockets[primeIndx].emit('configureCloudTunnel');removeHash=true;break;
		case '#restartzigbee'			: 	ioSockets[primeIndx].emit('restartZigbee');removeHash=true;break;
		case '#startcloudlogs'			: 	ioSockets[primeIndx].emit('startCloudLogs');removeHash=true;break;
		case '#stopcloudlogs'			: 	ioSockets[primeIndx].emit('stopCloudLogs');removeHash=true;break;
		case '#restorefactorysetting'	: 	if(confirm("Are you sure you wanna restore factory setting?")){
												ioSockets[primeIndx].emit('restoreFactory', function (rsp) {
													if(!rsp.success) alert(rsp.msg);
												});
											};removeHash=true;break;

		case '#shownetworksettings'		:	sideMenu.switchPage('networkSettingPage');break;
		case '#showfilereader'			:	sideMenu.switchPage('fileReaderPage');break;
		case '#showcommandposter'		:	sideMenu.switchPage('commandPosterPage');break;
		case '#showirsettings'			:	sideMenu.switchPage('iRSettingPage');break;


	}
	if(removeHash)window.location.hash = '';
};
var connectSocket = function (ip, idx, callback) {
	if(idx == primeIndx)
		ioSockets[idx] = io.connect('/');
	else 
		ioSockets[idx] = io.connect('/', {path: '/ip/'+ip+'/socket.io'});
	console.log(idx, ip, ioSockets[idx].id);
	ioSockets[idx].on('connect', function(){console.log(idx, ip, ioSockets[idx].id);if(callback)callback();});
	ioSockets[idx].on('connect', showBurgerMenu);
	ioSockets[idx].on('log', function(data) {console.log('Recieved from server to log', data, new Date() - d)});
	ioSockets[idx].on('roomConfigUpdated', function (config) {
		if(!_.isObject(config)) config = JSON.parse(JXG.decompress(config));
		gCs[idx].set(config, {merge: true, remove: false});
		console.log(config);
	});
	ioSockets[idx].on('deleteGroup', function (groupId) {
		if(!groupId) return;
		gCs[idx].remove(gCs[idx].get(groupId));
	});
	ioSockets[idx].on('deleteDevice', function (deviceId) {
		if(!deviceId) return;
		dCs[idx].remove(dCs[idx].get(deviceId));
	});
	ioSockets[idx].on('onDeviceUpdate', function (config) {
		if(!_.isObject(config)) config = JSON.parse(JXG.decompress(config));
		dCs[idx].set(config, {merge: true, remove: false});
		console.log(config);
	});
	ioSockets[idx].on('moodConfigUpdate', function (config) {
		if(!_.isObject(config)) config = JSON.parse(JXG.decompress(config));
		mCs[idx].set(config, {merge: true, remove: false});
	});
	ioSockets[idx].on('deleteMood', function (moodId) {
		if(!moodId) return;
		mCs[idx].remove(mCs[idx].get(moodId));
	});
	ioSockets[idx].on('noHomeControllerPresent', function () {
		sideMenu.switchPage('homeControllerDownPage');
		$('#appLoadingVeil').hide();
	});
	ioSockets[idx].on('sudoHeartbeat', function () {pingTimeStamp = Date.now();});
	ioSockets[idx].on('switchPage', configurationWorkFlow);
	ioSockets[idx].on('homeControllerLocalIpAddress', function (add) {
		var arr = window.location.href.split("/");
		if(arr[2] == add) return;
		$.ajax({crossDomain: true,dataType: "jsonp",
			"url":"http://"+add+"/apptest", success:function (rsp){
			if(rsp && rsp.success) window.location.href="http://"+add
		}});
	});
};
var setTheme = function () {
	ioSockets[primeIndx].emit('getThemeSettings', {}, function (rsp) {
		setAppTheamColor(rsp.data.appTheme, rsp.data.appColor);
	});
}
_.each(localIpArr, function(ip, indx){connectSocket(ip, indx, (indx == primeIndx)?setTheme:null);})

var sideMenu = new SideMenuView({'el':$("#sideMenuCont")});
sideMenu.on('hideMe', function () {$('#burgerImageCont').trigger('tap')});
sideMenu.render();
var backboneAjax = Backbone.ajax;
var d = new Date();
Backbone.ajax = function (obj) {
	var success = obj.success;
	obj.success = function (data) {
		console.log(obj.url, new Date()-d);
		if(!_.isObject(data)){
			try {
				data = JSON.parse(data)	
			}
			catch (err) {
				data = JSON.parse(JXG.decompress(data))
			}
		}
		arguments[0] = data;
		success.apply(this, arguments);
	}
	obj.headers = {"Content-Encoding": "gzip"};
    obj.dataType = 'text';
	if(!obj.useSocket) return backboneAjax.apply(this, arguments);
	obj.socket.emit(obj.url, obj.data, obj.success);
}
var CustomCollection = Backbone.Collection.extend({
	initialize: function() {
		Backbone.Collection.prototype.initialize.apply(this, arguments);
		this.on('add', function (model) {
			model.ioSocket = model.collection.ioSocket;
		}, this);
		return this;
	}
})
var RoomCollection = CustomCollection.extend({
	url: '/group/list',
	model:RoomModel,
	initialize: function() {
		CustomCollection.prototype.initialize.apply(this, arguments);
		this.on('add', function (roomModel) {
			dCs[primeIndx].each(function (model, idx){model.set('name', 'Module-'+(idx+1));});
		}, this);
		return this;
	},
	comparator:function (model) {return parseInt(model.get('rank'));}
});
var DeviceCollection = CustomCollection.extend({
	url: '/device/list'
});
var MoodCollection = CustomCollection.extend({
	url: '/mood/list',
	model:BaseModel,
	initialize: function() {
		CustomCollection.prototype.initialize.apply(this, arguments);
		this.on("add", function(roomModel){
			roomModel.on('change', function (model, data) {console.log("change called on "+model.get('name'));console.log(model);});
			(gCs[primeIndx].models.length<5 || fixMoodStrip) && (fixMoodStrip=true) && clearTimeout(hideMoodStripTimer);
		});
		return this;
	},
	comparator:function (model) {return parseInt(model.get('rank'));}
});

var fetchCount = 0;
var fetchComplete = function () {
	if(++fetchCount == 3)setTimeout(function () {
		$('#appLoadingVeil').hide();
		console.log('Veil lifted at:', new Date()-d);
	}, 200);
};

var gCs=[], dCs=[], mCs=[];
_.each(localIpArr, function(ip, idx){

	(gCs[idx] = new RoomCollection()).ioSocket=ioSockets[idx];
	(dCs[idx] = new DeviceCollection()).ioSocket=ioSockets[idx];
	(mCs[idx] = new MoodCollection()).ioSocket=ioSockets[idx];
	if (idx) {
		dCs[idx].fetch({update:true, remove: false, useSocket:useSockets, success:fetchComplete, socket:ioSockets[idx]});
		mCs[idx].fetch({update:true, remove: false, useSocket:useSockets, success:fetchComplete, socket:ioSockets[idx]});
		gCs[idx].fetch({update:true, remove: false, useSocket:useSockets, success:fetchComplete, socket:ioSockets[idx]});
	}
	else { // idx = 0 mean local cluster 
		onGroupDataReady = function() {var d=initGroupData; if(isCloudRequest) d=JXG.decompress(d);	gCs[idx].add(JSON.parse(d)); fetchComplete();}
		onDeviceDataReady = function() {var d=initDeviceData; if(isCloudRequest) d=JXG.decompress(d); dCs[idx].add(JSON.parse(d)); fetchComplete();}
		onMoodDataReady = function() {var d=initMoodData; if(isCloudRequest) d=JXG.decompress(d); mCs[idx].add(JSON.parse(d)); fetchComplete();}

		if(typeof initGroupData != "undefined") onGroupDataReady();
		if(typeof initDeviceData != "undefined") onDeviceDataReady();
		if(typeof initMoodData != "undefined") onMoodDataReady();
	}
})


if($('body').attr('homeView')=='list')
	var mainPageView = new MainPageView({'collections':gCs});
else 
	var mainPageView = new GroupProxyMainPageView({'collections':gCs, 'moodCollections':mCs});

var moodStrip = mainPageView.moodStrip = new MoodStripView({'collections':mCs, 'el':$('.moodWidgetArea')});
$('#appCont').append(mainPageView.$el);
mainPageView.render();


sideMenu.currentPage = mainPageView;
var editPageView = new EditPageView({'collections':gCs, 'deviceCollections':dCs});
$('#appCont').append(editPageView.$el);
// editPageView.render();
// sideMenu.currentPage = editPageView;
try {
var devStngPageView = new DevStngPageView({'collections':dCs, 'deviceCollections':dCs});
$('#appCont').append(devStngPageView.$el);
}catch(err){console.log(err);}

var iRSettingPage = new IRSettingPage({'deviceCollection':dCs[0], socket:ioSockets[primeIndx]});
$('#appCont').append(iRSettingPage.$el);

var editMoodView = new EditMoodPageView({'collections':mCs, 'deviceCollections':dCs, 'groupCollections':gCs});
$('#appCont').append(editMoodView.$el);
var configureModulePage = new ConfigureNewModuleView({socket:ioSockets[primeIndx], gC:gCs[primeIndx]});
$('#appCont').append(configureModulePage.$el);
var cloudSettingPage = new CloudSettingPageView({socket:ioSockets[primeIndx]});
$('#appCont').append(cloudSettingPage.$el);
var themeSettingPage = new ThemeSettingPageView({socket:ioSockets[primeIndx]});
$('#appCont').append(themeSettingPage.$el);
var networkSettingPage = new NetworkSettingPageView({socket:ioSockets[primeIndx]});
$('#appCont').append(networkSettingPage.$el);
var welcomeScreenPage = new WelcomeScreenPageView({socket:ioSockets[primeIndx]});
$('#appCont').append(welcomeScreenPage.$el);
var checkUpdatePage = new CheckUpdatePageView({socket:ioSockets[primeIndx]});
$('#appCont').append(checkUpdatePage.$el);
var fileReaderPage = new FileReaderPageView({socket:ioSockets[primeIndx]});
$('#appCont').append(fileReaderPage.$el);
var commandPosterPage = new CommandPosterPageView({socket:ioSockets[primeIndx]});
$('#appCont').append(commandPosterPage.$el);
var HomeControllerDownPageView = BaseView.extend({
	templateSelector:"#homeControllerDownTemplate"
});
var homeControllerDownPage = new HomeControllerDownPageView();
$('#appCont').append(homeControllerDownPage.$el);

var ipCamaraFeedViewer = new IpCamaraFeedViewer({'el':$("#ipCamaraFeedViewerCont")});
ipCamaraFeedViewer.render();




