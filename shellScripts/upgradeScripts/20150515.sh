#!/bin/bash

DIR0=/home/admin/inoho
DIR1=$DIR0/homeController

sudo chmod 755 $DIR1/shellScripts/shallRestart.sh
line="*/15 * * * * sudo bash $DIR1/shellScripts/shallRestart.sh > $DIR0/logs/checkForRestart.log"
(crontab -u root -l; echo "$line" ) | crontab -u root -

echo "------------------ checkForRestart added to cron ----------------";
