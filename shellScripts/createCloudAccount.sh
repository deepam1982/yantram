#!/bin/bash
DIR0=/home/admin
DIR1=$DIR0/inoho/configs

if ! [ -f $DIR1/userConfig.json ]; then
	echo "$DIR1/userConfig.json not found" && exit 0
fi

function jsonval {
    temp=`echo $json | sed 's/\\\\\//\//g' | sed 's/[{}]//g' | awk -v k="text" '{n=split($0,a,","); for (i=1; i<=n; i++) print a[i]}' | sed 's/\"\:\"/\|/g' | sed 's/[\,]/ /g' | sed 's/\"//g' | grep -w $prop| cut -d":" -f2| sed -e 's/^ *//g' -e 's/ *$//g'`
    echo ${temp##*|}
}

json=$(echo $(<$DIR1/userConfig.json) | tr -d ' ')
prop='zigbeeNetworkName'
id=`jsonval`
prop='email'
email=`jsonval`
prop='password'
password=`jsonval`

if ! [ -f $DIR0/.ssh/id_rsa.pub ]; then
	echo "$DIR0/.ssh/id_rsa.pub not found"
	echo "creating rsa keys"
	mkdir $DIR0/.ssh
	ssh-keygen -t rsa -C "$id" -N "" -f $DIR0/.ssh/id_rsa
fi
pubRsa=$(echo $(<$DIR0/.ssh/id_rsa.pub))

http_code=$(curl -X POST -H "Content-Type: application/json" --write-out %{http_code} --silent --output /dev/null -d '{"a":123}' http://bcloud.inoho.com/opn/createaccount)
if [ $http_code != 200 ]; then
	echo "$http_code cloud server down!!"
	exit 0
fi

json=`curl -s -X POST -H "Content-Type: application/json" -d '{"prodId":"'"$id"'", "email":"'"$email"'", "password":"'"$password"'", "rsaPub":"'"$pubRsa"'"}' http://bcloud.inoho.com/opn/createaccount`
#json='{"success":true, "data":{"ports":{"http":8086,"ssh":8085,"m":8084}}}'

prop='success'
success=`jsonval`

if [ $success != true ]; then
	echo "account creation on cloud failed"
	echo $json
	exit 0
fi	

prop='http'
httpPort=`jsonval`
prop='ssh'
sshPort=`jsonval`
prop='m'
mPort=`jsonval`
prop='domain'
domain=`jsonval`

cat <<EOF > $DIR1/sshTunnelConfig.json && 
{
	"tunnels": {
		"m"	: $mPort,
		"http"	: ["-R",$httpPort,8080],	
		"ssh" 	: ["-R",$sshPort,22]
	},
	"server": "$domain",
	"user"	: "$id",
	"rsa"	: "$DIR0/.ssh/id_rsa"
}
EOF

sudo cp $DIR0/inoho/homeController/shellScripts/cloudTunnel.sh /etc/init.d/cloudTunnel
sudo chmod 755 /etc/init.d/cloudTunnel
sudo update-rc.d cloudTunnel defaults

echo "------------------ added start cloudTunnel to startup scripts ----------------";

sudo service cloudTunnel start


