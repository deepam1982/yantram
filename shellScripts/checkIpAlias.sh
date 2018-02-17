# /etc/init.d/checkIpAlias
### BEGIN INIT INFO
# Provides:          inoho
# Required-Start:    $remote_fs $syslog
# Required-Stop:     $remote_fs $syslog
# Default-Start:     2 3 4 5
# Default-Stop:      0 1 6
# Short-Description: checkIpAlias
# Description:       checkIpAlias
### END INIT INFO

#!/bin/bash
DIR0=/home/admin
DIR1=$DIR0/inoho/configs

function jsonval {
    temp=`echo $json | sed 's/\\\\\//\//g' | sed 's/[{}]//g' | awk -v k="text" '{n=split($0,a,","); for (i=1; i<=n; i++) print a[i]}' | sed 's/\"\:\"/\|/g' | sed 's/[\,]/ /g' | sed 's/\"//g' | grep -w $prop| cut -d":" -f2| sed -e 's/^ *//g' -e 's/ *$//g'`
    echo ${temp##*|}
}

json=$(echo $(<$DIR1/systemConfig.json) | tr -d ' ')
prop='ipOctate'
ipOct=`jsonval`
if [ "$ipOct" == "" ]; then
	ipOct=123
fi	
echo $ipOct


IP=`ifconfig wlan0 2>/dev/null|awk '/inet addr:/ {print $2}'|sed 's/addr://'`
if [ "$IP" == "" ]; then
    IP=`ifconfig wlan0 2>/dev/null|awk '/inet / {print $2}'`
fi
if [ "$IP" != "" ]; then
	echo "$IP"
	IFS=.
	ary=($IP)
	ary[3]=$ipOct
	IP=`printf ".%s"  "${ary[@]}"`
	IP=${IP:1}
	echo "$IP"
	CMD="ifconfig wlan0:$ipOct $IP up"
	eval "$CMD"
fi

IP=`ifconfig eth0 2>/dev/null|awk '/inet addr:/ {print $2}'|sed 's/addr://'`
if [ "$IP" == "" ]; then
    IP=`ifconfig eth0 2>/dev/null|awk '/inet / {print $2}'`
fi
if [ "$IP" != "" ]; then
        echo "$IP"
        IFS=.
        ary=($IP)
        ary[3]=$ipOct
        IP=`printf ".%s"  "${ary[@]}"`
        IP=${IP:1}
        echo "$IP"
        CMD="ifconfig eth0:$ipOct $IP up"
        eval "$CMD"
fi
