#!/bin/bash

DIR0=/home/admin/inoho
DIR1=$DIR0/homeController
sudo cp $DIR1/shellScripts/syncSystemClock.sh /etc/init.d/syncSystemClock
sudo chmod 755 /etc/init.d/syncSystemClock

echo "------------------ added syncSystemClock.sh to init.d ----------------";