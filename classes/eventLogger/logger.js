var __ = require("underscore");
var loggerObj = require(__rootPath+"/classes/eventLogger/keen");
var BaseClass = require(__rootPath+"/classes/baseClass");
var pad = function (num) {
    norm = Math.abs(Math.floor(num));
    return (norm < 10 ? '0' : '') + norm;
}

var formatLocalDate = function () {
    var local = new Date();
    var tzo = -local.getTimezoneOffset();
    var sign = tzo >= 0 ? '+' : '-';
    return local.getFullYear() 
        + '-' + pad(local.getMonth()+1)
        + '-' + pad(local.getDate())
        + 'T' + pad(local.getHours())
        + ':' + pad(local.getMinutes()) 
        + ':' + pad(local.getSeconds()) 
        + '.' + pad(local.getMilliseconds()) 
        + sign + pad(tzo / 60) 
        + ':' + pad(tzo % 60);
}



var EventLogger = BaseClass.extend({ 
	init : function () {
		this.logger = loggerObj;
		this.pendingEvents = {};
		this.internetDown = false;
	},
	logPendingEvents : function () {
		if(__.keys(this.pendingEvents).length) {
			this.logger.addEvents(this.pendingEvents, __.bind(function (err, rsp){
				if(!err) this.internetDown = false;
				if(err && err.code == "ENOTFOUND") {
					this.internetDown = true;
					setTimeout(__.bind(this.logPendingEvents, this), 10*60000);
				}
			}, this));
			this.pendingEvents = {};
		}
	},
	addEvent : function (eventName, properties, callback) {
		return callback && callback("NOSUPPORT");
		!properties && (properties = {});
		properties.user = __userEmail;
		properties.keen={"timestamp":formatLocalDate()};
		properties.localTimeStamp = formatLocalDate();
		if(this.internetDown) {
			if(!this.pendingEvents[eventName])
				this.pendingEvents[eventName] = [];
			this.pendingEvents[eventName].push(properties);
			if (callback) callback("InternetDown");
			return;
		}
		this.logger.addEvent(eventName, properties, __.bind(function(err, res) {
			if (err) {
				if(err.code == "ENOTFOUND") {
					this.internetDown = true;
					setTimeout(__.bind(this.logPendingEvents, this), 10*60000);
					if(!this.pendingEvents[eventName])
						this.pendingEvents[eventName] = [];
					this.pendingEvents[eventName].push(properties);
				}
				if (callback) callback(err);
			}
		}, this));
	},
});
if (!eventLogger)
	var eventLogger = new EventLogger();

module.exports = eventLogger;