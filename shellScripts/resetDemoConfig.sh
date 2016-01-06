#!/bin/bash

echo
echo "Demo Room Config check start!"
date
echo 

function jsonval {
    temp=`echo $json | sed 's/\\\\\//\//g' | sed 's/[{}]//g' | awk -v k="text" '{n=split($0,a,","); for (i=1; i<=n; i++) print a[i]}' | sed 's/\"\:\"/\|/g' | sed 's/[\,]/ /g' | sed 's/\"//g' | grep -w $prop| cut -d":" -f2| sed -e 's/^ *//g' -e 's/ *$//g'`
    echo ${temp##*|}
}

DIR1=/home/admin/inoho
DIR2=$DIR1/configs

conf1=`cat $DIR2/groupConfig_bkp.json`
conf2=`cat $DIR2/groupConfig.json`
conf3=`cat $DIR2/remoteDeviceInfoConfig_bkp.json`
conf4=`cat $DIR2/remoteDeviceInfoConfig.json`

if [ -f $DIR2/userConfig.json ]; then
	json=$(<$DIR2/userConfig.json)
	prop='email'
	email=`jsonval`
else 
	exit	
fi
echo "$email"

if [ "$email" != "inoho6@gmail.com" ]; then
	exit
fi	


if [ "$conf1" == "$conf2" && "$conf3" == "$conf4" ]; then
	echo "Equal!!"
else
	echo "Not equal!!"
	echo "$conf1" > $DIR2/groupConfig.json
	echo "$conf3" > $DIR2/remoteDeviceInfoConfig.json
	sudo service inoho restart
fi		