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
