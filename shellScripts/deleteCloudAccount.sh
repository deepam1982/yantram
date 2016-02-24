#!/bin/bash
DIR0=/home/admin
DIR1=$DIR0/inoho/configs

if ! [ -f $DIR1/userConfig.json ]; then
	echo '{"success":false, "msg":"$DIR1/userConfig.json not found"}' && exit 0
fi

if ! [ -f $DIR1/sshTunnelConfig.json ]; then
#	if	sshTunnelConfig not found then cloud acount does not exist 
	echo '{"success":true, "msg":"$DIR1/sshTunnelConfig.json not found"}' && exit 0
fi

output=`sudo service cloudTunnel stop`

CloudUrl='http://bcloud.inoho.com'

function jsonval {
    temp=`echo $json | sed 's/\\\\\//\//g' | sed 's/[{}]//g' | awk -v k="text" '{n=split($0,a,","); for (i=1; i<=n; i++) print a[i]}' | sed 's/\"\:\"/\|/g' | sed 's/[\,]/ /g' | sed 's/\"//g' | grep -w $prop| cut -d":" -f2| sed -e 's/^ *//g' -e 's/ *$//g'`
    echo ${temp##*|}
}

json=$(echo $(<$DIR1/userConfig.json) | tr -d ' ')
prop='zigbeeNetworkName'
id=`jsonval`

pubPem=$(echo $(<$DIR0/.ssh/pub.pem))
#echo $pubPem

http_code=$(curl -X POST -H "Content-Type: application/json" --write-out %{http_code} --silent --output /dev/null -d '{"a":123}' $CloudUrl/opn/savepubpem)
if [ $http_code != 200 ]; then
	echo '{"success":false, "msg":"$http_code cloud server down!!"}'
	exit 0
fi

json=`curl -s -X POST -H "Content-Type: application/json" -d '{"prodId":"'"$id"'"}' $CloudUrl/opn/getedittoken`
prop='success'
success=`jsonval`

if [ $success != true ]; then
	echo '{"success":false, "msg":"error on cloud server", "resp":'$json'}'
	exit 0
fi	

prop='token'
token=`jsonval`

token=`echo $token | openssl base64 -d -A | sudo openssl rsautl -decrypt -oaep -inkey /home/admin/.ssh/id_rsa`

json=`curl -s -X POST -H "Content-Type: application/json" -d '{"prodId":"'"$id"'", "deleteToken":"'"$token"'"}' $CloudUrl/opn/removeuser`

prop='success'
success=`jsonval`

if [ $success == true ]; then
	sudo rm $DIR1/sshTunnelConfig.json
	sudo rm -R $DIR0/.ssh
	echo '{"success":true, "resp":'$json'}'
	exit 0
fi	

echo $json


