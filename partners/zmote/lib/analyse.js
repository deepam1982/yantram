'use strict';

//var es = require('child_process').execSync;
var exec = require('child_process').exec;
var binDir = __dirname + '/../bin/';
// binDir = '';
var decodeir = binDir + 'decodeir ';
var encodeir = binDir + 'encodeir ';
var encodeirz = binDir + 'encodeirz ';

var code2gc = function(code, compress) {
    if (compress === undefined) compress = true;
    var gc = code.frequency + ',' + (code.repeat[0] + 1) + ',' + (code.repeat[1] + 1);
    var p = [], q = [];
    if (compress) {
        var alphabet = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
        for (var i = 0; i < code.seq.length; i += 2) {
            var j = -1;
            for (var k = 0; k < p.length; k++)
                if (p[k] === code.seq[i] && q[k] === code.seq[i + 1]) {
                    j = k;
                    break;
                }
            if (j == -1) {
                if (p.length < 15) {
                    p.push(code.seq[i]);
                    q.push(code.seq[i + 1]);
                }
                gc += ',' + code.seq[i] + ',' + code.seq[i + 1];
            }
            else {
                gc += alphabet[j];
            }
        }
        gc = gc.replace(/([A-Z]),/g, '$1');
    }
    else {
        gc += ',' + JSON.stringify(code.seq).replace('[', '').replace(']', '');
    }
    return gc;
}

var gc2trigger = function(gc) {
    // console.log(gc);
    gc = gc.replace(/([A-Z])/g, ',$1,').replace(/,,/g, ',').replace(/,+$/, '');
    // console.log(gc);
    var data = gc.split(',');
    if (data[0] === 'sendir') {
        data.shift();
        data.shift();
        data.shift();
    }
    var f = parseInt(data.shift());
    var r = parseInt(data.shift());
    var o = parseInt(data.shift());
    var trigger = [];
    var p = {}, q = {}, k = 0;
    var alphabet = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
    while (data.length > 0) {
        var v = data.shift();
        if (v.match(/[A-Z]/)) {
            trigger.push(p[v]);
            trigger.push(q[v]);
        }
        else {
            v = parseInt(parseInt(v) * 1000000.0 / f + 0.5);
            trigger.push(v);
            p[alphabet[k]] = v;
            v = parseInt(parseInt(data.shift()) * 1000000.0 / f + 0.5);
            trigger.push(v);
            q[alphabet[k]] = v;
            k++;
        }
    }
    return trigger;
}

var rawcode = function(trigger, frequency) {
    if (frequency === undefined) frequency = 38000;
    var seq = [];

    for (var i = 0; i < trigger.length; i++) {
        seq.push(Math.floor(trigger[i] * frequency / 1000000.0 + 0.5));
    }

    return {frequency: frequency, n: seq.length, seq: seq, repeat: [0, 0, 0]};
}

var analyse = function(trigger, calback) {
    var args, spec, code;
    var response = { confidence: 0 };
    if (trigger[0] !== '0000') { // If not Pronto HEX
        for (var i = 0; i < trigger.length; i++) trigger[i] = parseInt(trigger[i]);
        if (trigger.length % 2 == 1) trigger.push(100000);
    }
    exec(decodeir + trigger.join(' '), function(error, stdout, stderr) {
        if(error) {console.log(error);calback(error);}
        spec = JSON.parse(stdout.toString().trim());
        if (spec.error === undefined) {
            response.confidence += 32;
            response.spec = spec;
            args = spec.protocol + ' ' + spec.device + ' ' + (spec.subdevice || -1) + ' ' + spec.obc;
            exec(encodeirz + args, function(error, stdout, stderr){
                if(error) {console.log(error);calback(error);}
                code = JSON.parse(stdout.toString().trim());
                if (code.error === undefined) {
                    response.confidence += 64;
                    code.repeat[0] = 1;
                    response.code = code2gc(code);
                    if (spec.misc && spec.misc.match(/T=/)) {
                        args += ' 1';
                        exec(encodeirz + args, function(error, stdout, stderr){
                            if(error) {console.log(error);calback(error);}
                            code = JSON.parse(stdout.toString().trim());
                            code.repeat[0] = 1;
                            response.tcode = code2gc(code);
                            calback(null, response);
                        });
                    }
                    else
                        calback(null, response);
                }
                else {
                    // console.log('encode error');
                    response.trigger = trigger;
                    code = rawcode(trigger);
                    response.code = code2gc(code);
                    calback(null, response);
                }
            });
        }
        else {
            // console.log('decode error');
            response.trigger = trigger;
            code = rawcode(trigger);
            response.code = code2gc(code);
            calback(null, response);
        }
    });

//    return response;
}

module.exports = function(data, callback) { //data is string
            
    var trigger;
    try {
        var v1form = JSON.parse(data);
        var sendir = 'sendir,1:1,0,' + v1form.frequency + ',1,1';
        for (var i = 0; i < v1form.n; i++)
            sendir += ',' + v1form.seq[i];
        trigger = gc2trigger(sendir);
    }
    catch (error) {
        trigger = data.replace(/,/g, ' ').replace(/ +/g, ' ').trim().split(' ');
    }
    if (trigger[0] === 'sendir') {
        trigger = gc2trigger(data);
        analyse(trigger, callback);
    }
    else if (isNaN(parseInt(trigger[0])) && (trigger.length == 3 || trigger.length == 4)) {
        if (trigger.length == 3)
            trigger.splice(2, 0, -1);
        exec(encodeir + trigger.join(' '), function(error, stdout, stderr){
            if(error) {console.log(error);}
            trigger = stdout.toString().split(' ');
            analyse(trigger, callback);
        })
    }
    else {
        analyse(trigger, callback);
    }
};


//http://192.168.1.123/irp/analyse/2650,900,500,450,500,450,500,900,500,900,950,450,500,450,500,450,500,450,500,450,500,450,500,450,500,450,500,450,500,450,500,400,500,450,500,450,500,450,950,850,500,450,500,450,500,450,500,450,500