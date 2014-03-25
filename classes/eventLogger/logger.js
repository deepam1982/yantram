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
		setInterval(__.bind(function () {this.pendingEvents = {};}, this), 3*60000);
	},
	addEvent : function (eventName, properties, callback) {
		!properties && (properties = {});
		properties.user = __userEmail;
		properties.keen={"timestamp":formatLocalDate()};
		properties.localTimeStamp = formatLocalDate();
		this.logger.addEvent(eventName, properties, __.bind(function(err, res) {
			if (err) {
				if(err.code = "ENOTFOUND") {
					if(!this.pendingEvents[eventName])
						this.pendingEvents[eventName] = [];
					this.pendingEvents[eventName].push(properties);
				}
				if (callback) callback(err);
			} else {
				if(__.keys(this.pendingEvents).length) {
					this.logger.addEvents(this.pendingEvents);
					this.pendingEvents = {};
				}
				if (callback) callback();
			}
		}, this));
	},
});
if (!eventLogger)
	var eventLogger = new EventLogger();

module.exports = eventLogger;