# /etc/init.d/syncSystemClock
### BEGIN INIT INFO
# Provides:          inoho
# Required-Start:    $remote_fs $syslog
# Required-Stop:     $remote_fs $syslog
# Default-Start:     2 3 4 5
# Default-Stop:      0 1 6
# Short-Description: syncSystemClock
# Description:       syncSystemClock
### END INIT INFO

#!/bin/bash
sudo service ntp restart
sleep 15
#ntpq -p
TMP=`ntpq -p | awk ' $0 ~ /^\*/ {print $9}'`
#echo $TMP
if [ "$TMP" != "" ]; then
	echo $TMP
else
	sudo date -s "$(wget -qSO- --max-redirect=0 google.com 2>&1 | grep Date: | cut -d' ' -f5-8)Z"
fi