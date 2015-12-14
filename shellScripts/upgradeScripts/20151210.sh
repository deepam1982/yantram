#!/bin/bash

DIR0=/home/admin/inoho
DIR1=$DIR0/homeController
DIR2=$DIR0/gitScripts
DIR3=$DIR2/shellScripts/upgradeScripts

line="03 4,11,16,23 * * * sudo service inoho restart"
(crontab -u root -l; echo "$line" ) | crontab -u root -

echo "------ added crontab to restart inoho 4 times in a day -------";

sudo npm install --unsafe-perm --prefix $DIR0 mjpeg-proxy

sudo apt-get install autossh
