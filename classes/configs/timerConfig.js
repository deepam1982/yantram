var __ = require("underscore");
var BasicConfigManager = require(__rootPath+"/classes/configs/basicConfigManager");
var TimerConfigManager = BasicConfigManager.extend({
	file : '/../configs/timerConfig.json',
	setAutoOffParams : function (devId, loadId, param, callback) {
		if(!__.has(param, 'enabled') || !__.has(param, 'time'))
			return (callback && callback("invalid autoOff params"));
		var autoOffArr = this.data.autoOff || [];
		var entry = {"devId":devId, "loadId":loadId};
		entry = __.where(autoOffArr, entry).pop() || entry;
		autoOffArr =__.reject(autoOffArr, function (obj){return (obj === entry);});
		autoOffArr.push(__.extend(entry,__.pick(param, 'enabled', 'time')));
		this.data.autoOff = autoOffArr;
		this.save(__.bind(function (err) {
			callback && callback(err);
			if(!err) this.emit('timerModified', devId, loadId);
		}, this));
	},
	removeSchedule : function (devId, loadId, schedule, callback) {
		if(schedule.scheduleId) schedule.scheduleId = parseInt(schedule.scheduleId);
		if(typeof schedule.scheduleId != 'number') return (callback && callback("invalid schedule"));
		this.data.schedules = this.data.schedules || [];
		var filter = {"devId":devId, "loadId":loadId};
		var filteredSechedules = __.where(this.data.schedules, filter);
		if(filteredSechedules.length <= schedule.scheduleId) return (callback && callback("invalid schedule"));
		this.data.schedules = __.without(this.data.schedules, filteredSechedules[schedule.scheduleId]);
		this.save(__.bind(function (err) {
			callback && callback(err);
			if(!err) this.emit('timerModified', devId, loadId);
		}, this));

	},
	setSchedule : function (devId, loadId, schedule, callback){
		if(schedule.remove) return this.removeSchedule(devId, loadId, schedule, callback)
		if(schedule.scheduleId) schedule.scheduleId = parseInt(schedule.scheduleId);
		if(!(__.has(schedule, 'type') || __.has(schedule, 'hour') || 
			__.has(schedule, 'minute') || __.has(schedule, 'amPm') || __.has(schedule, 'enabled')))
			return (callback && callback("invalid schedule params"));
		this.data.schedules = this.data.schedules || [];
		var filter = {"devId":devId, "loadId":loadId};
		var entry = __.extend(__.clone(filter),__.pick(schedule, 'type', 'hour', 'minute', 'amPm', 'enabled'));
		if(typeof schedule.scheduleId != 'number' && (entry.enabled=/*assignment*/true)) this.data.schedules.push(entry);	
		else {
			var filteredSechedules = __.where(this.data.schedules, filter);
			if(filteredSechedules.length <= schedule.scheduleId)
				return (callback && callback("invalid schedule"));
			__.extend(filteredSechedules[schedule.scheduleId],entry);
		}
		this.save(__.bind(function (err) {
			callback && callback(err);
			if(!err) this.emit('timerModified', devId, loadId);
		}, this));

	},
	getTimers : function (devId, loadId) {
		var retObj = {};
		var filter = __.extend({'devId':devId}, (typeof loadId == 'number')?{'loadId':loadId}:null);
		retObj.autoOff = JSON.parse(JSON.stringify(__.where(this.data.autoOff, filter)));
		retObj.schedules = JSON.parse(JSON.stringify(__.where(this.data.schedules, filter)));
		return retObj;
	}	
})
if (typeof timerConfig == 'undefined') timerConfig = new TimerConfigManager();
module.exports = timerConfig;
