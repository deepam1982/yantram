# /etc/init.d/inoho
### BEGIN INIT INFO
# Provides:          inoho
# Required-Start:    $remote_fs $syslog
# Required-Stop:     $remote_fs $syslog
# Default-Start:     2 3 4 5
# Default-Stop:      0 1 6
# Short-Description: Start daemon at boot time
# Description:       Enable service provided by daemon.
### END INIT INFO

#!/bin/bash

NODE=/usr/bin/node
SERVER_JS_FILE=/home/admin/inoho/homeController/main.js
USER=root
OUT=/home/admin/inoho/logs/inoho.log

case "$1" in

startWithLogs)
	echo "starting node: $NODE $SERVER_JS_FILE"
	sudo -u $USER $NODE $SERVER_JS_FILE > $OUT 2>$OUT &
	;;

restartWithLogs)
	killall $NODE
	echo "starting node: $NODE $SERVER_JS_FILE"
	sudo -u $USER $NODE $SERVER_JS_FILE > $OUT 2>$OUT &
	;;	

start)
	echo "starting node: $NODE $SERVER_JS_FILE"
	sudo -u $USER $NODE $SERVER_JS_FILE noLogs > $OUT 2>$OUT &
	;;

stop)
	killall $NODE
	;;

restart)
	killall $NODE	
	echo "starting node: $NODE $SERVER_JS_FILE"
	sudo -u $USER $NODE $SERVER_JS_FILE noLogs > $OUT 2>$OUT &
	;;

*)
	echo "usage: $0 (start|stop|restart)"
esac

exit 0
