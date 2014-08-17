#!/bin/bash
IP=`ifconfig wlan0 2>/dev/null|awk '/inet addr:/ {print $2}'|sed 's/addr://'`
if [ "$IP" != "" ]; then
	echo "$IP"
	IFS=.
	ary=($IP)
	ary[3]=123
	IP=`printf ".%s"  "${ary[@]}"`
	IP=${IP:1}
	echo "$IP"
	CMD="ifconfig wlan0:123 $IP up"
	eval "$CMD"
fi

IP=`ifconfig eth0 2>/dev/null|awk '/inet addr:/ {print $2}'|sed 's/addr://'`
if [ "$IP" != "" ]; then
        echo "$IP"
        IFS=.
        ary=($IP)
        ary[3]=123
        IP=`printf ".%s"  "${ary[@]}"`
        IP=${IP:1}
        echo "$IP"
        CMD="ifconfig eth0:123 $IP up"
        eval "$CMD"
fi
