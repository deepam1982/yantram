#!/bin/bash

function jsonval {
    temp=`echo $json | sed 's/\\\\\//\//g' | sed 's/[{}]//g' | awk -v k="text" '{n=split($0,a,","); for (i=1; i<=n; i++) print a[i]}' | sed 's/\"\:\"/\|/g' | sed 's/[\,]/ /g' | sed 's/\"//g' | grep -w $prop| cut -d":" -f2| sed -e 's/^ *//g' -e 's/ *$//g'`
    echo ${temp##*|}
}

DIR1=/home/admin/inoho
DIR2=$DIR1/configs
DIR3=$DIR1/homeController

email='unconfigured@inoho.com'
if [ -f $DIR2/userConfig.json ]; then
	json=$(<$DIR2/userConfig.json)
	prop='email'
	email=`jsonval`
fi

if [ "$email" == "inoho6@gmail.com" ]; then
	sudo cp $DIR2/groupConfig.json $DIR2/groupConfig_bkp.json
	line="*/15 * * * * sudo bash $DIR3/shellScripts/resetDemoConfig.sh > $DIR1/logs/demoConfCheck.log"
	(crontab -u root -l; echo "$line" ) | crontab -u root -
fi