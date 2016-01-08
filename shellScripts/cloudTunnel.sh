#!/bin/bash
DIR0=/home/admin/inoho

if ! [ -f $DIR0/configs/sshTunnelConfig.json ]; then
	echo "$DIR0/configs/sshTunnelConfig.json not found" && exit 0
fi

function jsonval {
    temp=`echo $json | sed 's/\\\\\//\//g' | sed 's/[{}]//g' | awk -v k="text" '{n=split($0,a,","); for (i=1; i<=n; i++) print a[i]}' | sed 's/\"\:\"/\|/g' | sed 's/[\,]/ /g' | sed 's/\"//g' | grep -w $prop| cut -d":" -f2| sed -e 's/^ *//g' -e 's/ *$//g'`
    echo ${temp##*|}
}

DAEMON=/usr/bin/autossh

NAME=`basename $0`

PIDFILE=/var/run/${NAME}.pid
SCRIPTNAME=/etc/init.d/${NAME}
DESC="the tunnel"

test -x $DAEMON || exit 0

export AUTOSSH_PIDFILE=${PIDFILE}


#	Function that starts the daemon/service.
d_start() {
	json=$(echo $(<$DIR0/configs/sshTunnelConfig.json) | tr -d ' ')

	prop='server'
	RSERVER=`jsonval`

	prop='user'
	RUSER=`jsonval`

	prop='rsa'
	Rsa=`jsonval`

	prop='tunnels'
	tunnels=`jsonval`

	ports=`node -pe 'var arr,obj=JSON.parse(process.argv[1]).tunnels;for(var key in obj){if(!arr)arr=obj[key];else arr+=","+obj[key];} arr;' $json`
	IFS=',' read -r -a array1 <<< "$ports"

	MPORT=${array1[0]}

	TUNNEL=''
	for ((i=1; i<${#array1[*]}; i=i+3));
	do
		TUNNEL=$TUNNEL"${array1[i]} ${array1[i+1]}:localhost:${array1[i+2]} "
	done

	ASOPT="-i "${Rsa}" "${TUNNEL}" -f -N -oStrictHostKeyChecking=no "${RUSER}"@"${RSERVER}

	export AUTOSSH_PORT=${MPORT}

	start-stop-daemon --start --quiet --pidfile $PIDFILE \
		--exec $DAEMON -- $ASOPT
	RETVAL="$?"
#	echo $RETVAL
	if [ $RETVAL -gt 0 ]; then
	    echo -n " not started (or already running)"
	else
	    sleep 1
	    start-stop-daemon --stop --quiet --pidfile $PIDFILE --test  > /dev/null && echo -n " started" || echo -n " not started"
	fi

}

#	Function that stops the daemon/service.
d_stop() {
	start-stop-daemon --stop --quiet --pidfile $PIDFILE && echo -n " stoped"\
		|| echo -n " was not running"
}


case "$1" in
  start)
	echo -n "Starting $DESC: $NAME"
	d_start
	echo "."
	;;
  stop)
	echo -n "Stopping $DESC: $NAME"
	d_stop
	echo "."
	;;

  restart)
	echo -n "Restarting $DESC: $NAME"
	d_stop
	sleep 1
	d_start
	echo "."
	;;
  *)
	echo "Usage: $SCRIPTNAME {start|stop|restart}" >&2
	exit 3
	;;
esac

exit 0
