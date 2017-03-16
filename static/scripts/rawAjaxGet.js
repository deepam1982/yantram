function rawAjaxGet(url, calback) {
    var xmlhttp = new XMLHttpRequest();

    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == XMLHttpRequest.DONE ) {
           if (xmlhttp.status == 200) {
				calback && calback(null, xmlhttp.responseText);
           }
           else {
               calback && calback(xmlhttp.status);
           }
        }
    };

    xmlhttp.open("GET", url, true);
    xmlhttp.send();
}
var initGroupData, initDeviceData, initMoodData;
var onGroupDataReady=null, onDeviceDataReady=null, onMoodDataReady=null;
rawAjaxGet("/group/list", function(err, data){if(err) return; initGroupData = data; onGroupDataReady && onGroupDataReady();});
rawAjaxGet("/device/list", function(err, data){if(err) return; initDeviceData = data; onDeviceDataReady && onDeviceDataReady();});
rawAjaxGet("/mood/list", function(err, data){if(err) return; initMoodData = data; onMoodDataReady && onMoodDataReady();});
