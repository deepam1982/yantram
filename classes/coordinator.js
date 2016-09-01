var __ = require("underscore");
var BaseClass = require(__rootPath+"/classes/baseClass");
var deviceManager = require(__rootPath+'/classes/devices/deviceManager');
var CronDevice = require(__rootPath+"/classes/virtualDevices/cronDevice");
var AutoOffTimer = require(__rootPath+"/classes/virtualDevices/autoOffTimer");
var Stabilizer = require(__rootPath+"/classes/virtualDevices/stabilizer");
var BasicConfigManager = require(__rootPath+"/classes/configs/basicConfigManager");
var timerConfig = require(__rootPath+"/classes/configs/timerConfig");
var devCoordConf = new (BasicConfigManager.extend({file : '/../configs/deviceCoordinatorConfig.json'}))({"callback":function () {
	coordinator.populateUtilNodes();
	coordinator.applyCoordinationCondition();
}});


var Coordinator = BaseClass.extend({
	utilNodes : {},
	init : function (obj) {
		__.bindAll(this, "onNewNodesFound");
		this.deviceManager = obj.deviceManager;
		this.deviceManager.on("newNodesFound", this.onNewNodesFound);
		timerConfig.on('timerModified', __.bind(function (devId, loadId) {
			this.manageTimersOnLoad(this.deviceManager.getVirtualLoad(devId, loadId));
		}, this));
	},
	populateUtilNodes : function () {
		this.utilNodes['dayLight'] = new CronDevice({'switchOnAt':'00 30 6 * * *', 'switchOffAt':'00 00 17 * * *', 'id':'dayLight'});
		this.utilNodes['sleepHour'] = new CronDevice({'switchOnAt':'00 00 22 * * *', 'switchOffAt':'00 00 7 * * *', 'id':'sleepHour'});
		this.utilNodes['evening'] = new CronDevice({'switchOnAt':'00 00 18 * * *', 'switchOffAt':'00 00 23 * * *', 'id':'evening'});
		this.utilNodes['weekday'] = new CronDevice({'switchOnAt':'00 00 00 * * 1', 'switchOffAt':'00 00 18 * * 5', 'id':'weekday'});
		this.utilNodes['weekend'] = new CronDevice({'switchOnAt':'00 00 18 * * 5', 'switchOffAt':'00 00 00 * * 1', 'id':'weekend'});
		this.utilNodes['day'] = this.utilNodes['dayLight']
        console.log("#### dayLight = "+this.utilNodes['dayLight'].state);
        console.log("#### sleepHour ="+this.utilNodes['sleepHour'].state);
        console.log("#### evening = "+this.utilNodes['evening'].state);
        console.log("#### weekday = "+this.utilNodes['weekday'].state);
        console.log("#### weekend = "+this.utilNodes['weekend'].state);
        console.log(new Date());
        __.each(devCoordConf.data, function (conf, nodeId) {
			if(1+nodeId.indexOf("autoOffTimer"))
				this.utilNodes[nodeId] = new AutoOffTimer({"switchOffAfter":conf.turnOffAfter, 'id':nodeId});
			if(1+nodeId.indexOf("stabilizer"))
				this.utilNodes[nodeId] = new Stabilizer({"switchOffAfter":conf.offAfter, 'id':nodeId});
		}, this);
	},
	getNodeMap : function (nodeIdArr) {
		var nodeMap = this.deviceManager.getDeviceNodes(nodeIdArr);
		return __.extend(nodeMap, __.pick(this.utilNodes, nodeIdArr));
	},
	// suspendAutoOff : function (loadId, callback) {
	// 	var tmrId = loadId+'-autoOffTimer';
	// 	var nodeIdArr = [].concat(loadId).concat(tmrId);
	// 	var nodeMap = this.getNodeMap(nodeIdArr);
	// 	if(__.size(nodeMap) == 2){
	// 		__.each(nodeMap, function (node, id) {node.unfollowAll()});
	// 	}
	// 	callback && callback();
	// },
	// setAutoOff : function (loadId, timeInSec, callback) {
	// 	var tmrId = loadId+'-autoOffTimer';
	// 	var nodeIdArr = [].concat(loadId).concat(tmrId);
	// 	var nodeMap = this.getNodeMap(nodeIdArr);
	// 	if(!nodeMap[loadId]) {
	// 		console.log("#### cannot set autoOffTimer on", loadId, "not found, will retry in 10 sec");
	// 		return setTimeout(__.bind(this.setAutoOffOnLoad, this, loadId, timeInSec, callback), 10*1000);
	// 	}
	// 	if(!nodeMap[tmrId]){
	// 		this.utilNodes[tmrId] = nodeMap[tmrId] = new AutoOffTimer({"switchOffAfter":timeInSec, 'id':tmrId});
	// 	}
	// 	else {
	// 		__.each(nodeMap, function (node, id) {node.unfollowAll()});
	// 		nodeMap[tmrId].setSwitchOffAfter(timeInSec);
	// 	}
	// 	nodeMap[tmrId].follow(nodeMap[loadId], loadId, null);
	// 	nodeMap[loadId].follow(nodeMap[tmrId], null, '!'+tmrId);						
	// },
	// manageAutoOff : function (conf) {
	// 	if(!conf.enabled) 
	// 		this.suspendAutoOff(conf.devId+'-l'+conf.loadId);
	// 	else
	// 		this.setAutoOff(conf.devId+'-l'+conf.loadId, conf.time);
	// },
	putTimers : function (vNode, onTimers, offTimers, autoOffTimer) {
	//	this.suspendAutoOff(vNode.id);
		vNode.unfollowAll();
		var nodeIdArr = [vNode.id];
		var thisObj = this
		var makeFollowLogic = function(timerArr, type) {
			var logic = null;
			__.each(timerArr, function (timer, indx) {
				var id = vNode.id+'-'+type+'Timer-'+indx;
				nodeIdArr.push(id);
				console.log(timer.minute, timer.hour, timer.amPm)
				var min = parseInt(timer.minute); 
				var hour = parseInt(timer.hour)+((timer.amPm == 'AM')?0:12) - ((parseInt(timer.hour)==12)?12:0); 
				var onPattern = "00 "+min+" "+hour+" * * *";
				var offPattern = "02 "+min+" "+hour+" * * *";
				// offPattern = onPattern + 2 seconds. having +10 mins instead, causes the problem where geyser on-ed by timer, could not be turned off for 10 mins.
				//var offPattern ="00 "+((min+10)%60)+" "+((hour+parseInt((min+10)/60))%24)+" * * *";
				console.log(onPattern, offPattern);
				if(!this.utilNodes[id]) 
					this.utilNodes[id] = new CronDevice({'switchOnAt':onPattern, 'switchOffAt':offPattern, 'id':id});
				else {
					this.utilNodes[id].switchOnAt(onPattern);
					this.utilNodes[id].switchOffAt(offPattern);
				}
				if (!logic) logic = id;
				else logic += '||'+id;
			}, thisObj);
			return logic;
		};
		if(autoOffTimer) {
			var autOffTmrId = vNode.id+'-autoOffTimer', timeInSec=parseInt(autoOffTimer.time);	
			nodeIdArr.push(autOffTmrId);
			if(!this.utilNodes[autOffTmrId])
				this.utilNodes[autOffTmrId] = new AutoOffTimer({"switchOffAfter":timeInSec, 'id':autOffTmrId});
			else {
				this.utilNodes[autOffTmrId].unfollowAll();
				this.utilNodes[autOffTmrId].setSwitchOffAfter(timeInSec);
			}
			this.utilNodes[autOffTmrId].follow(vNode, vNode.id, '!'+vNode.id);
		}

		var onCondition = makeFollowLogic(onTimers, 'on');
		var offCondition = makeFollowLogic(offTimers, 'off');
		autoOffTimer && (offCondition = ((offCondition)?(offCondition+'||'):'')+'!'+autOffTmrId);
		var nodeMap = this.getNodeMap(__.without(nodeIdArr, vNode.id));
		vNode.follow(__.values(nodeMap), onCondition, offCondition);

	},
	manageTimersOnLoad : function (vNode) {
		if(vNode.className != 'Load') return;
		var nodeIndx = parseInt(vNode.id.substring(vNode.deviceId.length+2));
		var timers = timerConfig.getTimers(vNode.deviceId, nodeIndx);
		var onTimers = __.where(timers.schedules, {'type':'on', 'loadId':nodeIndx, 'enabled':true});
		var offTimers = __.where(timers.schedules, {'type':'off', 'loadId':nodeIndx, 'enabled':true});
		var autoOffTimer = __.where(timers.autoOff, {'loadId':nodeIndx, 'enabled':true});
		autoOffTimer = (autoOffTimer.length)?autoOffTimer[0]:null;
		this.putTimers(vNode, onTimers, offTimers, autoOffTimer);
	},
	onNewNodesFound : function (vNodes, deviceId) {
		__.each(vNodes, function (vNode) {this.manageTimersOnLoad(vNode)}, this);
		this.applyCoordinationCondition();
	},
	applyCoordinationCondition : function () {		
	//TODO __.each(devCoordConf.toJSON(), function (conf, nodeId) {
		__.each(devCoordConf.data, function (conf, nodeId) {
			if (!conf.conditionApplied) {
				try {
					var nodeIdArr = []
					if (conf.onCondition)
						nodeIdArr = nodeIdArr.concat(conf.onCondition.replace(/(&&)|(\|\|)|(\()|(\)|(!))/g, " ").replace(/ +(?= )/g,"").trim().split(" "));
					if (conf.offCondition)
						nodeIdArr = nodeIdArr.concat(conf.offCondition.replace(/(&&)|(\|\|)|(\()|(\)|(!))/g, " ").replace(/ +(?= )/g,"").trim().split(" "));
					nodeIdArr = __.uniq(nodeIdArr)
					nodeMap = this.getNodeMap(nodeIdArr = nodeIdArr.concat(nodeId))
					if(nodeIdArr.length != __.keys(nodeMap).length) {
						// if ('27B54C01004B1200-l3' == nodeId) 
						// 	console.log(nodeIdArr, nodeIdArr.length, __.keys(nodeMap).length, __.keys(nodeMap));
						return;
					}
					var offCond = conf.offCondition;
					if(conf.turnOffAfter) {
						var tmrId = nodeId+'-autoOffTimer';
						this.utilNodes[tmrId] = new AutoOffTimer({"switchOffAfter":conf.turnOffAfter, 'id':tmrId});
						this.utilNodes[tmrId].follow(nodeMap[nodeId], nodeId, null);
						nodeMap = this.getNodeMap(nodeIdArr = nodeIdArr.concat(tmrId));
						offCond=((offCond)?'||':'')+'!'+tmrId;
					}
					nodeMap[nodeId].follow(__.values(__.omit(nodeMap, nodeId)), conf.onCondition, offCond);
					nodeMap[nodeId].manualTime = conf.manualTime;
					nodeMap[nodeId].maxTime = conf.maxTime;
					conf.conditionApplied = true;
				}catch(err) {console.log("#### error #### "+err);}
			}
		}, this)
	}
});

//S||A && !(S&&B)
// nodeConnectionConf = {
// //	 "0001eff1-l2" : {"onCondition":"!dayLight&&0001eff1-s1", "offCondition":"!0001eff1-s1"},
// 	"00021369-l3" : {"onCondition":"!00021369-l2&&!dayLight&&00021369-s1", "offCondition":"!00021369-s1"},
// 	"00020dba-l3" : {"onCondition":"00020dba-s1", "offCondition":"!00020dba-s1", "manualTime":100, "maxTime":300},
// 	"0041544e-l3" : {"onCondition":"0041544e-s1", "manualTime":180},
// 	"0041544e-l4" : {"onCondition":"0041544e-s1", "manualTime":180},
// 	"0003017c-l5" : {"onCondition":"evening&&00030180-s0", "manualTime":600},
// 	"0003017c-l2" : {"onCondition":"evening&&00030180-s0", "manualTime":600},
// }
/*
{ 
	"A7734501004B1200-l0" : {"onCondition":"A7734501004B1200-s0", "offCondition":"!A7734501004B1200-s0", "manualTime":100, "maxTime":300},
	"27B54C01004B1200-l0" : {"onCondition":"27B54C01004B1200-s1", "offCondition":"!27B54C01004B1200-s1", "manualTime":100, "maxTime":300},
	"27B54C01004B1200-l1" : {"onCondition":"27B54C01004B1200-s1", "offCondition":"!27B54C01004B1200-s1", "manualTime":100, "maxTime":300},
	"96424501004B1200-l1" : {"onCondition":"evening&&(27B54C01004B1200-s0||96424501004B1200-s1||35B24C01004B1200-s0)", "manualTime":600},
	"96424501004B1200-l2" : {"onCondition":"evening&&(27B54C01004B1200-s0||96424501004B1200-s1||35B24C01004B1200-s0)", "manualTime":600}
}

{
	"stabilizer-1" : {"onCondition":"E7281707004B1200-s0", "offAfter":10},
	"E7281707004B1200-l1" : {"onCondition":"stabilizer-1", "offCondition":"!stabilizer-1", "manualTime":100}
}

*/
if(typeof coordinator == 'undefined')
	coordinator = new Coordinator({"deviceManager":deviceManager});
module.exports = coordinator;

