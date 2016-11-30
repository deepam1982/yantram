var __ = require("underscore");
var BasicConfigManager = require(__rootPath+"/classes/configs/basicConfigManager");
var DeviceCoordinatorConfigManager = BasicConfigManager.extend({
	file : '/../configs/deviceCoordinatorConfig.json',
	findFollowObjects : function (vId) { // virtual load Id
		var nodeIdArr = []
		var conf = this.get(vId);
		if(!conf) return nodeIdArr;
		if (conf.onCondition)
			nodeIdArr = nodeIdArr.concat(conf.onCondition.replace(/(&&)|(\|\|)|(\()|(\)|(!))/g, " ").replace(/ +(?= )/g,"").trim().split(" "));
		if (conf.offCondition)
			nodeIdArr = nodeIdArr.concat(conf.offCondition.replace(/(&&)|(\|\|)|(\()|(\)|(!))/g, " ").replace(/ +(?= )/g,"").trim().split(" "));
		nodeIdArr = __.sortBy(__.uniq(nodeIdArr), function(id) {return __.indexOf(id, '-')}); // ids having '-' are sensor
		return nodeIdArr;
	},
	findManualTime : function (vId) { // virtual load Id
		return parseInt(this.get(vId+'.manualTime'))||120;
	},
	modifyFollowObjectsForLoad : function (deviceId, switchId, followObjects, callback) {
		var sCndion = "", fCndion = "";
		__.each(followObjects.sensorList, function(sId) {if(sCndion)sCndion += "||"; sCndion +=sId;}, this);
		__.each(followObjects.filterList, function(fId) {if(fCndion)fCndion += "||"; fCndion +=fId;}, this);
		var lId = deviceId+"-l"+switchId;
		if(!sCndion) {
			this.data = __.omit(this.data, lId);
			return this.save(callback);
		}
		var onCondition = (fCndion)?("("+sCndion+")&&("+fCndion+")"):sCndion;
		var offCondition = "!("+onCondition+")";
		this.set(lId, {"onCondition":onCondition, "offCondition":offCondition, "manualTime":followObjects.manualTime||300});
		this.save(callback);
	}

});
if (typeof deviceCoordinatorConfig == 'undefined') deviceCoordinatorConfig = new DeviceCoordinatorConfigManager();
module.exports = deviceCoordinatorConfig;
