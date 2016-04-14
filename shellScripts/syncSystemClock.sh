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