#!/bin/bash

DIR0=/home/admin/inoho
DIR1=$DIR0/homeController
DIR2=$DIR0/gitScripts
DIR3=$DIR2/shellScripts/upgradeScripts

sudo chmod 755 $DIR1/shellScripts/shallRestart.sh
line="*/15 * * * * sudo bash $DIR1/shellScripts/shallRestart.sh > $DIR0/logs/checkForRestart.log"
(crontab -u root -l; echo "$line" ) | crontab -u root -

echo "------------------ checkForRestart added to cron ----------------";

sudo chmod 755 $DIR1/shellScripts/fixTimezone.sh
line="0 0 * * * sudo bash $DIR1/shellScripts/fixTimezone.sh > $DIR0/logs/fixTimezone.log"
(crontab -u root -l; echo "$line" ) | crontab -u root -

echo "------------------ fixTimezone added to cron ----------------";

sudo bash $DIR2/shellScripts/fixTimezone.sh

echo "------------------ ran fixTimezone ----------------";