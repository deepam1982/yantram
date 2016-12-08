var __ = require("underscore");
var express = require('express');
var ejs = require('ejs');
var findIpAddress = require(__rootPath+"/classes/utils/checkInternet").findIpAddress;
ejs.delimiter = '$';
// var RoomController = require(__rootPath+"/controllers/roomController");
var deviceManager = require(__rootPath + '/classes/devices/deviceManager');
module.exports = function(app) {
	
	app.get('/', function(req, res) {
		var appTheme = __userConfig.get('appTheam') || 'Clasic';
		switch (__userConfig.get('appTheam')) {
			case 'Maze' : var appFile = __rootPath + '/static/ejs/app_maze.ejs'; break;
			default		: var appFile = __rootPath + '/static/ejs/app_clasic.ejs';
		}
		var appColor = (__userConfig.get('appColor') || 'orange').toLowerCase();
		var homeView = __userConfig.get('homeView') || 'list';
		var hcId = __userConfig.get('zigbeeNetworkName');
		if(!__piIpAddr) __piIpAddr = findIpAddress();
		var piIpAddr = __piIpAddr || '192.168.1.123'
		var ip = piIpAddr.split('.');
		ip.pop();
		var ipMask = ip.join('.');
		//JSON.stringify(
		var clusterIpArr = __systemConfig.get('clusterIps');
		var avoidRestoTime = __userConfig.get('restoreWithInMins');
		var dLP = __userConfig.get('periods.dayLight'); if(!dLP) dLP = [6,30,17,0];
		var sHP = __userConfig.get('periods.sleepHour'); if(!sHP) sHP = [22,0,7,0];
		var evP = __userConfig.get('periods.evening'); if(!evP) evP = [17,30,22,30];
		__.each(dLP, function(num, idx){if(num<10)dLP[idx]='0'+num;});
		dLP = [dLP[0]+':'+dLP[1], dLP[2]+':'+dLP[3]];
		__.each(sHP, function(num, idx){if(num<10)sHP[idx]='0'+num;});
		sHP = [sHP[0]+':'+sHP[1], sHP[2]+':'+sHP[3]];
		__.each(evP, function(num, idx){if(num<10)evP[idx]='0'+num;});
		evP = [evP[0]+':'+evP[1], evP[2]+':'+evP[3]];

		clusterIpArr = (clusterIpArr)?[piIpAddr].concat(clusterIpArr):[piIpAddr];
		res.render(appFile,{'appColor':appColor,'appTheme':appTheme, 'homeView':homeView,
			'ipCamaraSupported':__systemConfig.get('ipCamaraSupported'), 
			'iRSupported':__systemConfig.get('iRSupported'),
			'sensorsPresent':deviceManager.sensorsPresentInSystem,
			'avoidRestoTime':(avoidRestoTime)?avoidRestoTime:15,//15 minutes
			'periods':{'dLP':dLP, 'sHP':sHP, 'evP':evP},
			'clusteringSupported':__systemConfig.get('clusteringSupported'), 
			'revId':__systemConfig.get('revId')||'0000000',
			'brand':__systemConfig.get('brand')||'inoho',
			'cloudRequest':(req.headers.host.indexOf("cloud")==-1)?false:true,
			'hcId':hcId, 
			'ipMask':ipMask,
			'ipOctate':__systemConfig.get('ipOctate')||'123',
			'clusterIpArr':clusterIpArr
		});
		// try {res.sendFile(appFile);}
		// catch(err) {res.sendfile(appFile);}

	});
	app.get('/auth/login', function(req, res) {
		try {res.sendFile(__rootPath + '/static/htmls/auth/login.html');}
		catch(err) {res.sendfile(__rootPath + '/static/htmls/auth/login.html');}
	});
	app.get('/apptest', function (req, res) {
    	res.end(req.query.callback+'('+JSON.stringify({'success':true})+')');
	});

// for Apps to confirm this device is Inoho home controller
	app.get('/inohocontroller', function (req, res) {
		var appTheam = (__userConfig.get('appTheam') || 'Clasic').toLowerCase();
		var themeColor = (__userConfig.get('appColor') || 'orange').toLowerCase();
		switch(themeColor) {
			case "orange" : var color = (appTheam=='maze')?"#CE771D":"#EE972D"; break;
			case "red"	  : var color = (appTheam=='maze')?"#832A28":"#9E171D"; break;
			case "blue"   : var color = (appTheam=='maze')?'#42487B':"#5EA5F3"; break;
			case "green"  : var color = (appTheam=='maze')?'#406E38':"#69C1A8"; break;
		}


    	res.end(JSON.stringify({'success':true, 'themeColor':color}));
	});
	app.get('/headers', function (req,res) {
		// if(!req.headers['authorization']){
		// 	res.writeHead(401, {'WWW-Authenticate': 'Basic realm="Inoho Test App"', 'Content-Type': 'text/plain'});
		// 	res.end();
		// 	return;
		// }
		res.send(req.headers);
		// res.write(req.headers);
		// res.write(req.query);
		// res.end()
	});
	app.get('/testlog', function (req,res) {
		console.log(' ################# recieved get request testlog #############');
		// if(!req.headers['authorization']){
		// 	res.writeHead(401, {'WWW-Authenticate': 'Basic realm="Inoho Test App"', 'Content-Type': 'text/plain'});
		// 	res.end();
		// 	return;
		// }
		res.send(req.headers);
		// res.write(req.headers);
		// res.write(req.query);
		// res.end()
	});
	app.get('/test/:data', function (req,res) {
		var analyse = require(__rootPath + '/partners/zmote/lib/analyse');
		analyse(req.params.data, function(err, respJson){
			var response = JSON.stringify(respJson);
            res.writeHead(200, {
                'Content-Type': 'application/json; charset=utf-8'
            });
            res.end(response);
        });
	});

};
