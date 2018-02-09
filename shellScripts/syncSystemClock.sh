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
sudo service ntp restart
sleep 6
#ntpq -p
TMP=`ntpq -p | grep INIT`
if [ "$TMP" == "" ]; then
	echo $TMP
else
	sudo date -s "$(wget -qSO- --max-redirect=0 google.com 2>&1 | grep Date: | cut -d' ' -f5-8)Z"
fi