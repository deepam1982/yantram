#!/bin/bash

DIR0=/home/admin/inoho
DIR1=$DIR0/homeController
DIR2=$DIR0/gitScripts
DIR3=$DIR2/shellScripts/upgradeScripts

sudo cp $DIR2/shellScripts/syncSystemClock.sh /etc/init.d/syncSystemClock
sudo chmod 755 /etc/init.d/syncSystemClock

echo "------------------ added syncSystemClock.sh to init.d ----------------";


echo "starting softupgrade"

#step 3 soft update
git --work-tree=$DIR1 --git-dir=$DIR1/.git fetch origin
git --work-tree=$DIR1 --git-dir=$DIR1/.git reset --hard origin/$BRANCH

echo "softupgrade done, restarting home controller"
#step 4 restart homeController

sudo /etc/init.d/inoho stop
sudo /etc/init.d/inoho start

echo "upgrade complete"