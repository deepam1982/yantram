#!/bin/bash
DIR0=/home/admin/inoho

function jsonval {
    temp=`echo $json | sed 's/\\\\\//\//g' | sed 's/[{}]//g' | awk -v k="text" '{n=split($0,a,","); for (i=1; i<=n; i++) print a[i]}' | sed 's/\"\:\"/\|/g' | sed 's/[\,]/ /g' | sed 's/\"//g' | grep -w $prop| cut -d":" -f2| sed -e 's/^ *//g' -e 's/ *$//g'`
    echo ${temp##*|}
}
# https://gist.github.com/cjus/1047794
echo `date`
email='unconfigured@inoho.com'
if [ -f $DIR0/configs/userConfig.json ]; then
	json=$(<$DIR0/configs/userConfig.json)
	prop='email'
	email=`jsonval`
fi
echo $email

json=`curl -s -X GET http://cloud.inoho.com/shallrestart?email=$email`
echo $json
prop='restart'
restart=`jsonval`
prop='success'
success=`jsonval`
 
#echo $success
#echo $restart

if [ "$success" == "true" -a "$restart" == "true" ]; then
	echo "Restarting now!"
	CMD="sudo service inoho restart"
	eval "$CMD"
fi