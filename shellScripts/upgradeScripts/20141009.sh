#!/bin/bash

DIR0=/home/admin/inoho
DIR1=$DIR0/homeController
DIR2=$DIR0/gitScripts
DIR3=$DIR2/shellScripts/upgradeScripts

sudo cp $DIR2/shellScripts/syncSystemClock.sh /etc/init.d/syncSystemClock
sudo chmod 755 /etc/init.d/syncSystemClock

echo "------------------ added syncSystemClock.sh to init.d ----------------";

