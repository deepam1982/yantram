var __ = require("underscore");
var BaseClass = require(__rootPath+"/classes/baseClass");
var deviceManager = require(__rootPath+'/classes/devices/deviceManager');
var CronDevice = require(__rootPath+"/classes/virtualDevices/cronDevice");
var BasicConfigManager = require(__rootPath+"/classes/configs/basicConfigManager");
var devCoordConf = new (BasicConfigManager.extend({file : '/../configs/deviceCoordinatorConfig.json'}))();


var Coordinator = BaseClass.extend({
	utilNodes : {},
	init : function (obj) {
		__.bindAll(this, "onNewNodesFound");
		this.populateUtilNodes();
		this.deviceManager = obj.deviceManager;
		this.deviceManager.on("newNodesFound", this.onNewNodesFound);
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
	},
	getNodeMap : function (nodeIdArr) {
		var nodeMap = this.deviceManager.getDeviceNodes(nodeIdArr);
		return __.extend(nodeMap, __.pick(this.utilNodes, nodeIdArr));
	},
	onNewNodesFound : function (nodes) {
		
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
					if(nodeIdArr.length != __.keys(nodeMap).length) return;
					nodeMap[nodeId].follow(__.values(__.omit(nodeMap, nodeId)), conf.onCondition, conf.offCondition);
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

*/
if(typeof coordinator == 'undefined')
	coordinator = new Coordinator({"deviceManager":deviceManager});
module.exports = coordinator;

